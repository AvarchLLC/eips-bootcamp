import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';
import { mintWeeklyChampionNFT } from '@/app/lib/quiz-league/nft-service';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    const isAdmin = user?.role === 'ADMIN' || process.env.NODE_ENV === 'development';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { weekId } = await request.json();

    if (!weekId) {
      return NextResponse.json({ error: 'Missing weekId' }, { status: 400 });
    }

    // 1. Get week and participants sorted by score
    const week = await prisma.quizWeek.findUnique({
      where: { id: weekId },
      include: {
        weeklyScores: {
          orderBy: [{ totalPoints: 'desc' }, { quizzesCompleted: 'desc' }, { currentStreak: 'desc' }],
          take: 10,
          include: { user: true },
        },
      },
    });

    if (!week) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 });
    }

    const championScore = week.weeklyScores[0];
    if (!championScore) {
      return NextResponse.json({ error: 'No participants found to determine a winner' }, { status: 400 });
    }

    const winnerId = championScore.userId;

    // 2. Mark week as FINALIZED and store winner
    await prisma.quizWeek.update({
      where: { id: weekId },
      data: {
        status: 'FINALIZED',
        winnerId,
      },
    });

    // 3. Store Leaderboard Snapshot
    await prisma.quizLeaderboardSnapshot.create({
      data: {
        weekId,
        rankings: week.weeklyScores.map((s, idx) => ({
          rank: idx + 1,
          userId: s.userId,
          name: s.user.name || s.user.username,
          points: s.totalPoints,
          quizzes: s.quizzesCompleted,
          wallet: s.user.walletAddress,
        })),
      },
    });

    // 4. Trigger NFT Minting on Gnosis Chain
    let mintResult = null;
    try {
      mintResult = await mintWeeklyChampionNFT(weekId);
    } catch (mintErr: any) {
      console.warn('Auto-minting on finalization encountered issue:', mintErr);
      mintResult = { success: false, error: mintErr.message };
    }

    return NextResponse.json({
      success: true,
      weekNumber: week.weekNumber,
      winner: {
        id: championScore.user.id,
        name: championScore.user.name || championScore.user.username,
        score: championScore.totalPoints,
        walletAddress: championScore.user.walletAddress,
      },
      mintResult,
    });
  } catch (error: any) {
    console.error('Finalize week error:', error);
    return NextResponse.json({ error: error.message || 'Failed to finalize week' }, { status: 500 });
  }
}

