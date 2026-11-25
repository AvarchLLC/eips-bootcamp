import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser, getActiveWeek } from '@/app/lib/quiz-league/service';

export async function GET() {
  try {
    const [user, week] = await Promise.all([
      getSessionUser(),
      getActiveWeek(),
    ]);

    if (!week) {
      return NextResponse.json({ error: 'No active quiz week found' }, { status: 404 });
    }

    // Determine current day of week (1 = Monday ... 7 = Sunday)
    const today = new Date();
    let currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday ...
    if (currentDayIndex === 0) currentDayIndex = 7;

    // Ensure all synthetic mock scores are purged from dashboard calculations
    await prisma.quizWeeklyScore.deleteMany({
      where: {
        user: {
          email: {
            endsWith: '@ethshala.com',
          },
        },
      },
    }).catch(() => {});

    // Concurrently fetch Competition Stats and User Score & Attempts
    const [
      totalParticipants,
      activeParticipants,
      quizzesCompletedTotal,
      userScore,
      userAttempts,
    ] = await Promise.all([
      prisma.quizWeeklyScore.count({
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
      }),
      prisma.quizWeeklyScore.count({
        where: {
          weekId: week.id,
          quizzesCompleted: { gt: 0 },
          user: {
            email: {
              not: {
                endsWith: '@ethshala.com',
              },
            },
          },
        },
      }),
      prisma.quizAttempt.count({
        where: {
          quiz: { weekId: week.id },
          user: {
            email: {
              not: {
                endsWith: '@ethshala.com',
              },
            },
          },
        },
      }),
      user
        ? prisma.quizWeeklyScore.findUnique({
            where: {
              weekId_userId: {
                weekId: week.id,
                userId: user.id,
              },
            },
          })
        : Promise.resolve(null),
      user
        ? prisma.quizAttempt.findMany({
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
          })
        : Promise.resolve([]),
    ]);

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
        totalParticipants: totalParticipants,
        activeParticipants: activeParticipants,
        quizzesCompletedTotal: quizzesCompletedTotal,
      },
      todayQuiz: {
        id: todayFullQuiz?.id,
        title: todayFullQuiz?.title,
        topic: todayFullQuiz?.topic,
        dayIndex: todayFullQuiz?.dayIndex,
        durationMinutes: todayFullQuiz?.durationMinutes,
        maxPoints: todayFullQuiz?.maxPoints,
        questionsCount: todayFullQuiz?.questions?.length || 5,
        questionCount: todayFullQuiz?.questions?.length || 5,
        status: todayQuizItem?.status,
        hasAttempted: todayQuizItem?.status === 'COMPLETED',
        pointsEarned: todayQuizItem?.pointsEarned || 0,
        attemptScore: todayQuizItem?.status === 'COMPLETED' ? Math.round(((todayQuizItem?.pointsEarned || 0) / (todayFullQuiz?.maxPoints || 100)) * 100) : 0,
      },
      calendar: weekSchedule,
    });
  } catch (error: any) {
    console.error('Quiz league dashboard error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

