import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryUserId = url.searchParams.get('userId');

    const sessionUser = await getSessionUser();
    const targetUserId = queryUserId || sessionUser?.id;

    if (!targetUserId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        profile: true,
        quizWeeklyScores: {
          include: {
            week: true,
          },
          orderBy: { week: { weekNumber: 'desc' } },
        },
        quizAttempts: {
          include: {
            quiz: {
              include: { week: true },
            },
          },
          orderBy: { completedAt: 'desc' },
        },
        quizNftRewards: {
          include: { week: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculations
    let totalPoints = 0;
    const totalQuizzes = user.quizAttempts.length;
    let highestRank = 999;
    let maxStreak = 0;
    let currentStreak = 0;

    user.quizWeeklyScores.forEach((s) => {
      totalPoints += s.totalPoints;
      if (s.rank > 0 && s.rank < highestRank) highestRank = s.rank;
      if (s.longestStreak > maxStreak) maxStreak = s.longestStreak;
      if (s.currentStreak > currentStreak) currentStreak = s.currentStreak;
    });

    if (highestRank === 999) highestRank = user.quizWeeklyScores[0]?.rank || 1;

    // Badges determination
    const hasPerfectScore = user.quizAttempts.some((a) => a.score === 100);
    const hasSevenDayStreak = maxStreak >= 7;
    const isQuizMaster = totalQuizzes >= 5;
    const isEthshalaScholar = totalPoints >= 500;

    const badges = [
      {
        id: 'perfect-score',
        type: 'PERFECT_SCORE',
        title: 'Perfect Lightning',
        description: 'Achieve a 100% score on any daily quiz without a single mistake.',
        unlocked: hasPerfectScore,
        progress: hasPerfectScore ? 100 : 80,
      },
      {
        id: 'streak-7',
        type: 'STREAK_7',
        title: '7-Day Violet Flame',
        description: 'Maintain a 7-day continuous daily quiz participation streak.',
        unlocked: hasSevenDayStreak,
        progress: Math.min(100, Math.round((currentStreak / 7) * 100)),
      },
      {
        id: 'quiz-master',
        type: 'QUIZ_MASTER',
        title: 'EVM Quiz Master',
        description: 'Successfully complete at least 5 competitive protocol quizzes.',
        unlocked: isQuizMaster,
        progress: Math.min(100, Math.round((totalQuizzes / 5) * 100)),
      },
      {
        id: 'ethshala-scholar',
        type: 'ETHSHALA_SCHOLAR',
        title: 'ETHShala Diamond Scholar',
        description: 'Accumulate over 500 total championship league points.',
        unlocked: isEthshalaScholar,
        progress: Math.min(100, Math.round((totalPoints / 500) * 100)),
      },
    ];

    // NFT Collection
    const nfts = user.quizNftRewards.map((nft) => ({
      id: nft.id,
      weekNumber: nft.week.weekNumber,
      weekTitle: nft.week.title,
      tokenId: nft.tokenId,
      tokenUri: nft.tokenUri,
      txHash: nft.txHash,
      status: nft.status,
      network: nft.network,
      mintedAt: nft.mintedAt,
      explorerUrl: nft.txHash ? `https://gnosisscan.io/tx/${nft.txHash}` : null,
    }));

    // Weekly Participation History
    const history = user.quizWeeklyScores.map((s) => ({
      weekId: s.week.id,
      weekNumber: s.week.weekNumber,
      weekTitle: s.week.title,
      points: s.totalPoints,
      quizzesCompleted: s.quizzesCompleted,
      rank: s.rank,
      streak: s.currentStreak,
      startDate: s.week.startDate,
      endDate: s.week.endDate,
    }));

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name || user.username || 'ETH Builder',
        username: user.username ? `@${user.username}` : '@builder',
        email: user.email,
        walletAddress: user.walletAddress,
        shortenedWallet: user.walletAddress
          ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
          : null,
        avatarUrl: user.image || user.profile?.avatarUrl || null,
        bio: user.profile?.bio || 'Ethereum builder and quiz league competitor.',
      },
      stats: {
        totalPoints,
        totalQuizzes,
        highestRank: highestRank === 999 ? '-' : `#${highestRank}`,
        currentStreak,
        longestStreak: maxStreak,
      },
      badges,
      nfts,
      history,
    });
  } catch (error: any) {
    console.error('Quiz league profile error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * Connect/Update EVM Wallet for Quiz League rewards
 */
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { walletAddress } = await request.json();

    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 42) {
      return NextResponse.json({ error: 'Invalid EVM wallet address format' }, { status: 400 });
    }

    // Check if another user already has this wallet
    const existing = await prisma.user.findFirst({
      where: {
        walletAddress: { equals: walletAddress, mode: 'insensitive' },
        id: { not: user.id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This wallet address is already linked to another account' },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { walletAddress },
      select: {
        id: true,
        walletAddress: true,
      },
    });

    return NextResponse.json({ success: true, walletAddress: updated.walletAddress });
  } catch (error: any) {
    console.error('Update wallet error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update wallet' }, { status: 500 });
  }
}
