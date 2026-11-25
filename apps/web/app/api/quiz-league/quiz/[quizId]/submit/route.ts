import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser, recalculateWeekRanks } from '@/app/lib/quiz-league/service';

function detectQuestionType(q: { question: string; options: Array<{ isCorrect: boolean }> }) {
  const qText = q.question.toUpperCase();
  if (qText.startsWith('[ORDER]') || qText.startsWith('[SEQUENCE]')) return 'CODE_ORDERING';
  if (qText.startsWith('[VULN]') || qText.startsWith('[DEBUG]')) return 'VULNERABILITY_DEBUG';
  if (qText.startsWith('[MULTI]') || qText.startsWith('[CHECKBOX]') || q.options.filter(o => o.isCorrect).length > 1) {
    return 'MULTIPLE_CHOICE';
  }
  return 'SINGLE_CHOICE';
}

function cleanQuestionText(question: string) {
  return question
    .replace(/^\[(MULTI|CHECKBOX|ORDER|SEQUENCE|VULN|DEBUG)\]\s*/i, '')
    .trim();
}

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
    const { answers, timeSpentSeconds = 0, isPractice = false } = body;
    let authoritativeTimeSpentSeconds = Math.max(0, Number(timeSpentSeconds) || 0);

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 });
    }

    // 1. Fetch Quiz with Questions and options
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        week: true,
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            options: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // 2. Strict Server-Side Timer & Duplicate Check (Ranked mode only)
    if (!isPractice) {
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

      // Verify server-side timer from prisma.verification
      const sessionKey = `quiz_session:${user.id}:${quiz.id}`;
      const sessionRecord = await prisma.verification.findFirst({
        where: { identifier: sessionKey },
        orderBy: { createdAt: 'desc' },
      });

      if (!sessionRecord) {
        return NextResponse.json({ error: 'Start the quiz before submitting it' }, { status: 400 });
      }

      const startedAtMs = new Date(sessionRecord.value).getTime();
      const elapsedSecs = Math.floor((Date.now() - startedAtMs) / 1000);
      const maxAllowedSecs = quiz.durationMinutes * 60 + 45;
      if (!Number.isFinite(startedAtMs) || elapsedSecs < 0 || elapsedSecs > maxAllowedSecs) {
        return NextResponse.json(
          { error: `Time limit exceeded. Server recorded ${elapsedSecs}s elapsed, exceeding the ${maxAllowedSecs}s maximum allowed window.` },
          { status: 400 },
        );
      }
      authoritativeTimeSpentSeconds = elapsedSecs;
    }

    // 3. Multi-Format Server-Side Score Calculation
    let correctCount = 0;
    let pointsEarned = 0;
    const totalQuestions = quiz.questions.length;
    const userAnswersBreakdown: any[] = [];

    // Build lookup maps for submitted answers
    const singleAnswerMap = new Map<string, string>();
    const multiAnswerMap = new Map<string, string[]>();
    const orderAnswerMap = new Map<string, string[]>();

    for (const a of answers) {
      if (!a.questionId) continue;
      if (Array.isArray(a.selectedOptionIds)) {
        multiAnswerMap.set(a.questionId, a.selectedOptionIds);
      } else if (Array.isArray(a.orderedOptionIds)) {
        orderAnswerMap.set(a.questionId, a.orderedOptionIds);
      } else if (a.selectedOptionId) {
        singleAnswerMap.set(a.questionId, a.selectedOptionId);
      }
    }

    for (const question of quiz.questions) {
      const qType = detectQuestionType(question);
      const displayQuestion = cleanQuestionText(question.question);
      let isCorrect = false;
      let awardedPoints = 0;

      if (qType === 'MULTIPLE_CHOICE') {
        const correctOptIds = question.options.filter(o => o.isCorrect).map(o => o.id);
        const selectedIds = [
          ...new Set(
            multiAnswerMap.get(question.id) ||
              (singleAnswerMap.get(question.id) ? [singleAnswerMap.get(question.id)!] : []),
          ),
        ];

        const correctSet = new Set(correctOptIds);

        // Proportional partial credit formula: max(0, (correctSelected - wrongSelected) / totalCorrect)
        const correctSelected = selectedIds.filter(id => correctSet.has(id)).length;
        const wrongSelected = selectedIds.filter(id => !correctSet.has(id)).length;
        const totalCorrect = Math.max(1, correctOptIds.length);

        const scoreFraction = Math.max(0, (correctSelected - wrongSelected) / totalCorrect);
        awardedPoints = Math.round(scoreFraction * question.points);
        isCorrect = scoreFraction === 1;

        userAnswersBreakdown.push({
          questionId: question.id,
          question: displayQuestion,
          type: 'MULTIPLE_CHOICE',
          selectedOptionIds: selectedIds,
          correctOptionIds: correctOptIds,
          isCorrect,
          pointsAwarded: awardedPoints,
          explanation: question.explanation,
        });
      } else if (qType === 'CODE_ORDERING') {
        // Target order is options sorted by orderIndex
        const expectedOrder = question.options.map(o => o.id);
        const submittedOrder = orderAnswerMap.get(question.id) || [];

        isCorrect = expectedOrder.length === submittedOrder.length &&
          expectedOrder.every((id, idx) => id === submittedOrder[idx]);
        awardedPoints = isCorrect ? question.points : 0;

        userAnswersBreakdown.push({
          questionId: question.id,
          question: displayQuestion,
          type: 'CODE_ORDERING',
          submittedOrder,
          expectedOrder,
          isCorrect,
          pointsAwarded: awardedPoints,
          explanation: question.explanation,
        });
      } else {
        // SINGLE_CHOICE or VULNERABILITY_DEBUG
        const selectedOptionId = singleAnswerMap.get(question.id) || (multiAnswerMap.get(question.id)?.[0]);
        const correctOption = question.options.find((o) => o.isCorrect);
        const selectedOption = question.options.find((o) => o.id === selectedOptionId);

        isCorrect = !!(correctOption && selectedOptionId === correctOption.id);
        awardedPoints = isCorrect ? question.points : 0;

        userAnswersBreakdown.push({
          questionId: question.id,
          question: displayQuestion,
          type: qType,
          selectedOptionId: selectedOptionId || null,
          selectedText: selectedOption?.text || null,
          correctOptionId: correctOption?.id || null,
          correctText: correctOption?.text || null,
          isCorrect,
          pointsAwarded: awardedPoints,
          explanation: question.explanation,
        });
      }

      if (isCorrect) correctCount++;
      pointsEarned += awardedPoints;
    }

    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // 4. In Practice / Revision Mode: return results immediately without modifying leaderboard or XP
    if (isPractice) {
      return NextResponse.json({
        success: true,
        isPractice: true,
        result: {
          attemptId: `practice_${Date.now()}`,
          score: scorePercentage,
          pointsEarned: 0,
          totalQuestions,
          correctAnswers: correctCount,
          timeSpentSeconds: authoritativeTimeSpentSeconds,
          breakdown: userAnswersBreakdown,
          isPractice: true,
        },
      });
    }

    // 5. Create Quiz Attempt atomically for ranked mode
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
