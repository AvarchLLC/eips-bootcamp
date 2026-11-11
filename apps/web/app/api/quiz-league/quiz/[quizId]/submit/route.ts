import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser, recalculateWeekRanks } from '@/app/lib/quiz-league/service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to submit quiz' }, { status: 401 });
    }

    const body = await request.json();
    const { answers, timeSpentSeconds = 0 } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 });
    }

    // 1. Fetch Quiz with Questions and correct options
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        week: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // 2. Prevent Multiple Submissions
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        userId_quizId: {
          userId: user.id,
          quizId: quiz.id,
        },
      },
    });

    if (existingAttempt) {
      return NextResponse.json(
        { error: 'You have already submitted this quiz' },
        { status: 400 }
      );
    }

    // 3. Server-side Score Calculation
    let correctCount = 0;
    let pointsEarned = 0;
    const totalQuestions = quiz.questions.length;
    const userAnswersBreakdown: any[] = [];

    const answerMap = new Map<string, string>();
    for (const a of answers) {
      if (a.questionId && a.selectedOptionId) {
        answerMap.set(a.questionId, a.selectedOptionId);
      }
    }

    for (const question of quiz.questions) {
      const selectedOptionId = answerMap.get(question.id);
      const correctOption = question.options.find((o) => o.isCorrect);
      const selectedOption = question.options.find((o) => o.id === selectedOptionId);

      const isCorrect = !!(correctOption && selectedOptionId === correctOption.id);
      const awardedPoints = isCorrect ? question.points : 0;

      if (isCorrect) {
        correctCount++;
        pointsEarned += awardedPoints;
      }

      userAnswersBreakdown.push({
        questionId: question.id,
        question: question.question,
        selectedOptionId: selectedOptionId || null,
        selectedText: selectedOption?.text || null,
        correctOptionId: correctOption?.id || null,
        correctText: correctOption?.text || null,
        isCorrect,
        pointsAwarded: awardedPoints,
        explanation: question.explanation,
      });
    }

    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // 4. Create Quiz Attempt atomically
    const attempt = await prisma.$transaction(async (tx) => {
      const newAttempt = await tx.quizAttempt.create({
        data: {
          quizId: quiz.id,
          userId: user.id,
          score: scorePercentage,
          pointsEarned,
          totalQuestions,
          correctAnswers: correctCount,
          timeSpentSeconds: Number(timeSpentSeconds) || 0,
          userAnswers: userAnswersBreakdown,
        },
      });

      // 5. Update or Create QuizWeeklyScore
      const existingWeeklyScore = await tx.quizWeeklyScore.findUnique({
        where: {
          weekId_userId: {
            weekId: quiz.weekId,
            userId: user.id,
          },
        },
      });

      const newStreak = (existingWeeklyScore?.currentStreak || 0) + 1;
      const longest = Math.max(existingWeeklyScore?.longestStreak || 0, newStreak);

      await tx.quizWeeklyScore.upsert({
        where: {
          weekId_userId: {
            weekId: quiz.weekId,
            userId: user.id,
          },
        },
        update: {
          totalPoints: { increment: pointsEarned },
          quizzesCompleted: { increment: 1 },
          currentStreak: newStreak,
          longestStreak: longest,
        },
        create: {
          weekId: quiz.weekId,
          userId: user.id,
          totalPoints: pointsEarned,
          quizzesCompleted: 1,
          currentStreak: 1,
          longestStreak: 1,
        },
      });

      // 6. Award User XP Transaction
      await tx.xPTransaction.create({
        data: {
          userId: user.id,
          amount: pointsEarned,
          reason: `ETHShala Quiz League Day ${quiz.dayIndex}: ${quiz.title}`,
          category: 'COMPETITION',
          referenceId: `quiz_${quiz.id}_${Date.now()}`,
        },
      });

      return newAttempt;
    });

    // 7. Recalculate Ranks for the week
    await recalculateWeekRanks(quiz.weekId);

    // Fetch updated weekly score and rank
    const updatedScore = await prisma.quizWeeklyScore.findUnique({
      where: {
        weekId_userId: {
          weekId: quiz.weekId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      result: {
        attemptId: attempt.id,
        score: scorePercentage,
        pointsEarned,
        totalQuestions,
        correctAnswers: correctCount,
        timeSpentSeconds: attempt.timeSpentSeconds,
        breakdown: userAnswersBreakdown,
        newRank: updatedScore?.rank || 1,
        totalWeeklyPoints: updatedScore?.totalPoints || pointsEarned,
        currentStreak: updatedScore?.currentStreak || 1,
      },
    });
  } catch (error: any) {
    console.error('Submit quiz error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit quiz' }, { status: 500 });
  }
}
