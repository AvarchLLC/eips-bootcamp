import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser, getActiveWeek } from '@/app/lib/quiz-league/service';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const weekNumberParam = url.searchParams.get('week');
    const search = url.searchParams.get('search')?.trim().toLowerCase() || '';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get('limit') || '20')));

    const user = await getSessionUser();

    // Find Target Week
    let week;
    if (weekNumberParam) {
      week = await prisma.quizWeek.findUnique({
        where: { weekNumber: parseInt(weekNumberParam) },
        include: { nftReward: true },
      });
    }

    if (!week) {
      week = await getActiveWeek();
    }

    if (!week) {
      return NextResponse.json({ error: 'No quiz week available' }, { status: 404 });
    }

    // Ensure all synthetic mock data is completely purged from the leaderboard
    await prisma.quizWeeklyScore.deleteMany({
      where: {
        user: {
          email: {
            endsWith: '@ethshala.com',
          },
        },
      },
    }).catch(() => {});

    // Concurrently fetch available weeks dropdown and leaderboard scores for this week
    const [availableWeeks, rawScores] = await Promise.all([
      prisma.quizWeek.findMany({
        select: {
          id: true,
          weekNumber: true,
          title: true,
          status: true,
          startDate: true,
          endDate: true,
        },
        orderBy: { weekNumber: 'desc' },
      }),
      prisma.quizWeeklyScore.findMany({
        where: {
          weekId: week.id,
          user: {
            email: {
              not: {
                endsWith: '@ethshala.com',
              },
            },
          },
        },
        orderBy: [{ totalPoints: 'desc' }, { quizzesCompleted: 'desc' }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              image: true,
              walletAddress: true,
            },
          },
        },
      }),
    ]);

    // Assign true ranks dynamically based on actual scores
    const allScores = rawScores.map((s, idx) => ({
      ...s,
      rank: idx + 1,
    }));

    // Filter by search if provided
    let filtered = allScores;
    if (search) {
      filtered = allScores.filter((s) => {
        const name = (s.user.name || '').toLowerCase();
        const username = (s.user.username || '').toLowerCase();
        const wallet = (s.user.walletAddress || '').toLowerCase();
        return name.includes(search) || username.includes(search) || wallet.includes(search);
      });
    }

    // Identify Podium (Top 3)
    const podiumRaw = allScores.slice(0, 3);
    const podium = [
      podiumRaw[0] ? formatParticipant(podiumRaw[0], 1, user?.id) : null,
      podiumRaw[1] ? formatParticipant(podiumRaw[1], 2, user?.id) : null,
      podiumRaw[2] ? formatParticipant(podiumRaw[2], 3, user?.id) : null,
    ].filter(Boolean);

    // Paginate
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const rankings = paginated.map((s, idx) =>
      formatParticipant(s, s.rank || (page - 1) * limit + idx + 1, user?.id)
    );

    // Current user's specific ranking
    const userRanking = allScores.find((s) => s.userId === user?.id);

    return NextResponse.json({
      week: {
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        status: week.status,
        startDate: week.startDate,
        endDate: week.endDate,
        winnerId: week.winnerId,
        nftReward: week.nftReward
          ? {
              tokenId: week.nftReward.tokenId,
              txHash: week.nftReward.txHash,
              status: week.nftReward.status,
              network: week.nftReward.network,
            }
          : null,
      },
      availableWeeks,
      podium,
      rankings,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
      currentUser: userRanking ? formatParticipant(userRanking, userRanking.rank, user?.id) : null,
    });
  } catch (error: any) {
    console.error('Quiz league leaderboard error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

function formatParticipant(scoreRecord: any, computedRank: number, currentUserId?: string) {
  const u = scoreRecord.user;
  const displayName = u.name || u.username || (u.email ? u.email.split('@')[0] : 'Builder');
  const shortenedWallet = u.walletAddress
    ? `${u.walletAddress.slice(0, 6)}...${u.walletAddress.slice(-4)}`
    : null;

  return {
    userId: u.id,
    rank: computedRank,
    name: displayName,
    username: u.username ? (u.username.startsWith('@') ? u.username : `@${u.username}`) : `@${displayName.toLowerCase().replace(/\s+/g, '')}`,
    avatarUrl: u.image || null,
    walletAddress: u.walletAddress || null,
    shortenedWallet,
    totalPoints: scoreRecord.totalPoints,
    quizzesCompleted: scoreRecord.quizzesCompleted,
    streak: scoreRecord.currentStreak,
    isCurrentUser: u.id === currentUserId,
  };
}

