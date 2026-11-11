import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser, getActiveWeek } from '@/app/lib/quiz-league/service';

export async function GET() {
  try {
    const user = await getSessionUser();
    const week = await getActiveWeek();

    if (!week) {
      return NextResponse.json({ error: 'No active quiz week found' }, { status: 404 });
    }

    // Determine current day of week (1 = Monday ... 7 = Sunday)
    const today = new Date();
    let currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday ...
    if (currentDayIndex === 0) currentDayIndex = 7;

    // Competition Stats
    const totalParticipants = await prisma.quizWeeklyScore.count({
      where: { weekId: week.id },
    });

    const activeParticipants = await prisma.quizWeeklyScore.count({
      where: { weekId: week.id, quizzesCompleted: { gt: 0 } },
    });

    const quizzesCompletedTotal = await prisma.quizAttempt.count({
      where: { quiz: { weekId: week.id } },
    });

    // User's Weekly Score
    let userScore = null;
    let userAttempts: any[] = [];
    if (user) {
      userScore = await prisma.quizWeeklyScore.findUnique({
        where: {
          weekId_userId: {
            weekId: week.id,
            userId: user.id,
          },
        },
      });

      userAttempts = await prisma.quizAttempt.findMany({
        where: {
          userId: user.id,
          quiz: { weekId: week.id },
        },
        select: {
          quizId: true,
          score: true,
          pointsEarned: true,
          completedAt: true,
        },
      });
    }

    const attemptedQuizIdMap = new Map<string, any>();
    userAttempts.forEach((att) => attemptedQuizIdMap.set(att.quizId, att));

    // Map the 7-day calendar
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekSchedule = week.quizzes.map((quiz) => {
      const isPast = quiz.dayIndex < currentDayIndex;
      const isToday = quiz.dayIndex === currentDayIndex;
      const attempt = attemptedQuizIdMap.get(quiz.id);

      let status = 'UPCOMING';
      if (attempt) {
        status = 'COMPLETED';
      } else if (isToday) {
        status = quiz.status === 'AVAILABLE' ? 'AVAILABLE' : quiz.status;
      } else if (isPast) {
        status = 'MISSED';
      }

      return {
        id: quiz.id,
        dayIndex: quiz.dayIndex,
        dayName: dayNames[quiz.dayIndex - 1],
        title: quiz.title,
        topic: quiz.topic,
        maxPoints: quiz.maxPoints,
        durationMinutes: quiz.durationMinutes,
        status,
        pointsEarned: attempt ? attempt.pointsEarned : 0,
        completedAt: attempt ? attempt.completedAt : null,
      };
    });

    // Today's Quiz
    const todayQuizItem = weekSchedule.find((q) => q.dayIndex === currentDayIndex) || weekSchedule[0];
    const todayFullQuiz = week.quizzes.find((q) => q.id === todayQuizItem?.id);

    return NextResponse.json({
      week: {
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        startDate: week.startDate,
        endDate: week.endDate,
        status: week.status,
      },
      userStats: {
        isAuthenticated: !!user,
        userId: user?.id || null,
        name: user?.name || user?.username || 'Builder',
        walletAddress: user?.walletAddress || null,
        rank: userScore?.rank || (totalParticipants > 0 ? totalParticipants + 1 : 1),
        totalPoints: userScore?.totalPoints || 0,
        currentStreak: userScore?.currentStreak || 0,
        quizzesCompleted: userScore?.quizzesCompleted || 0,
        hasSubmittedToday: todayQuizItem?.status === 'COMPLETED',
      },
      competitionStats: {
        totalParticipants: Math.max(totalParticipants, 5),
        activeParticipants: Math.max(activeParticipants, 4),
        quizzesCompletedTotal: Math.max(quizzesCompletedTotal, 12),
      },
      todayQuiz: {
        id: todayFullQuiz?.id,
        title: todayFullQuiz?.title,
        topic: todayFullQuiz?.topic,
        dayIndex: todayFullQuiz?.dayIndex,
        durationMinutes: todayFullQuiz?.durationMinutes,
        maxPoints: todayFullQuiz?.maxPoints,
        questionCount: todayFullQuiz?.questions?.length || 5,
        status: todayQuizItem?.status,
        pointsEarned: todayQuizItem?.pointsEarned || 0,
      },
      calendar: weekSchedule,
    });
  } catch (error: any) {
    console.error('Quiz league dashboard error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
