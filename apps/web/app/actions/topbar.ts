'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

export async function getUserTotalXp() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return 0;
    
    // Find db user
    const dbUser = await prisma.user.findFirst({ where: { id: session.user.id } });
    if (!dbUser) return 0;

    // Fetch XP strictly from Quiz League
    const [xpAgg, quizScores] = await Promise.all([
      prisma.xPTransaction.aggregate({
        where: {
          userId: dbUser.id,
          OR: [
            { category: 'COMPETITION' },
            { reason: { contains: 'Quiz', mode: 'insensitive' } },
          ],
        },
        _sum: { amount: true },
      }),
      prisma.quizWeeklyScore.aggregate({
        where: { userId: dbUser.id },
        _sum: { totalPoints: true },
      }),
    ]);

    return Math.max(xpAgg._sum.amount || 0, quizScores._sum.totalPoints || 0);
  } catch (error) {
    console.error('Error fetching user XP:', error);
    return 0;
  }
}

export interface AppNotification {
  id: string;
  title: string;
  type: 'ASSIGNMENT' | 'MODULE' | 'QUIZ';
  link?: string;
  createdAt: Date;
}

export async function getRecentNotifications(): Promise<AppNotification[]> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return [];

    const dbUser = await prisma.user.findFirst({ where: { id: session.user.id } });
    if (!dbUser) return [];

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [recentAssignments, recentModules, activeWeek] = await Promise.all([
      prisma.assignment.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: 'desc' },
        take: 4
      }),
      prisma.module.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: 'desc' },
        take: 4
      }),
      prisma.quizWeek.findFirst({
        where: { status: 'ACTIVE' },
        include: {
          quizzes: {
            where: { isPublished: true },
            orderBy: { dayIndex: 'desc' },
            take: 1,
          },
        },
      }),
    ]);

    const notifications: AppNotification[] = [
      ...recentAssignments.map(a => ({
        id: `assn_${a.id}`,
        title: `New Assignment Posted: ${a.title}`,
        type: 'ASSIGNMENT' as const,
        link: `/dashboard/assignments`,
        createdAt: a.createdAt
      })),
      ...recentModules.map(m => ({
        id: `mod_${m.id}`,
        title: `New Module Posted: ${m.title}`,
        type: 'MODULE' as const,
        link: `/dashboard/modules/${m.id}`,
        createdAt: m.createdAt
      }))
    ];

    // Check if user has an incomplete quiz for today in the active week
    if (activeWeek && activeWeek.quizzes.length > 0) {
      const latestQuiz = activeWeek.quizzes[0];
      const attempt = await prisma.quizAttempt.findUnique({
        where: {
          userId_quizId: {
            userId: dbUser.id,
            quizId: latestQuiz.id,
          },
        },
      });

      if (!attempt) {
        const weeklyScore = await prisma.quizWeeklyScore.findUnique({
          where: {
            weekId_userId: {
              weekId: activeWeek.id,
              userId: dbUser.id,
            },
          },
        });

        const streak = weeklyScore?.currentStreak || 0;
        notifications.unshift({
          id: `quiz_streak_${latestQuiz.id}`,
          title: streak > 0
            ? `🔥 Protect your ${streak}d streak! Day ${latestQuiz.dayIndex} challenge is live`
            : `⚡ Daily Challenge: Day ${latestQuiz.dayIndex} (${latestQuiz.title}) is live`,
          type: 'QUIZ',
          link: `/quiz-league/daily/${latestQuiz.id}`,
          createdAt: new Date(),
        });
      }
    }

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}
