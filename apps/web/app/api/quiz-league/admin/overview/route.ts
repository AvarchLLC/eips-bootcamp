import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';

export async function GET() {
  try {
    const user = await getSessionUser();
    // Allow if user is ADMIN or in development environment for smooth configuration
    const isAdmin = user?.role === 'ADMIN' || process.env.NODE_ENV === 'development';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const [weeks, quizzes, attempts, rewards] = await Promise.all([
      prisma.quizWeek.findMany({
        orderBy: { weekNumber: 'desc' },
        include: {
          quizzes: {
            include: { _count: { select: { questions: true, attempts: true } } },
          },
          _count: { select: { weeklyScores: true } },
          nftReward: true,
        },
      }),
      prisma.quiz.findMany({
        orderBy: [{ week: { weekNumber: 'desc' } }, { dayIndex: 'asc' }],
        include: {
          week: true,
          questions: {
            include: { options: true },
          },
          _count: { select: { attempts: true } },
        },
      }),
      prisma.quizAttempt.findMany({
        take: 30,
        orderBy: { completedAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, walletAddress: true } },
          quiz: { select: { id: true, title: true, dayIndex: true } },
        },
      }),
      prisma.quizNFTReward.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          week: true,
          winner: { select: { id: true, name: true, email: true, walletAddress: true } },
        },
      }),
    ]);

    return NextResponse.json({
      weeks,
      quizzes,
      recentAttempts: attempts,
      rewards,
    });
  } catch (error: any) {
    console.error('Admin overview error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
