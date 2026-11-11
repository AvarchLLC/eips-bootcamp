import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

export async function getSessionUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          walletAddress: true,
          role: true,
          image: true,
        },
      });
      return dbUser;
    }
  } catch {
    // transient session read
  }
  return null;
}

/**
 * Get the current active competition week (or latest week)
 */
export async function getActiveWeek() {
  let week = await prisma.quizWeek.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { weekNumber: 'desc' },
    include: {
      quizzes: {
        orderBy: { dayIndex: 'asc' },
        include: {
          questions: {
            select: { id: true, points: true },
          },
        },
      },
      nftReward: true,
    },
  });

  if (!week) {
    week = await prisma.quizWeek.findFirst({
      orderBy: { weekNumber: 'desc' },
      include: {
        quizzes: {
          orderBy: { dayIndex: 'asc' },
          include: {
            questions: {
              select: { id: true, points: true },
            },
          },
        },
        nftReward: true,
      },
    });
  }

  return week;
}

/**
 * Recalculates all participant ranks for a given week
 */
export async function recalculateWeekRanks(weekId: string) {
  const scores = await prisma.quizWeeklyScore.findMany({
    where: { weekId },
    orderBy: [{ totalPoints: 'desc' }, { quizzesCompleted: 'desc' }, { currentStreak: 'desc' }],
  });

  for (let i = 0; i < scores.length; i++) {
    const newRank = i + 1;
    if (scores[i].rank !== newRank) {
      await prisma.quizWeeklyScore.update({
        where: { id: scores[i].id },
        data: { rank: newRank },
      });
    }
  }
}
