import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const user = await getSessionUser();

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

    // Check if current user has already submitted this quiz
    let userAttempt = null;
    if (user) {
      userAttempt = await prisma.quizAttempt.findUnique({
        where: {
          userId_quizId: {
            userId: user.id,
            quizId: quiz.id,
          },
        },
      });
    }

    // If user already completed, return full results with explanations
    if (userAttempt) {
      const sanitizedQuestions = quiz.questions.map((q) => {
        const correctOpt = q.options.find((o) => o.isCorrect);
        return {
          id: q.id,
          orderIndex: q.orderIndex,
          question: q.question,
          codeSnippet: q.codeSnippet,
          explanation: q.explanation,
          points: q.points,
          correctOptionId: correctOpt?.id,
          options: q.options.map((o) => ({
            id: o.id,
            orderIndex: o.orderIndex,
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        };
      });

      return NextResponse.json({
        quiz: {
          id: quiz.id,
          title: quiz.title,
          topic: quiz.topic,
          description: quiz.description,
          durationMinutes: quiz.durationMinutes,
          maxPoints: quiz.maxPoints,
          dayIndex: quiz.dayIndex,
          weekNumber: quiz.week.weekNumber,
          questions: sanitizedQuestions,
        },
        attempt: {
          score: userAttempt.score,
          pointsEarned: userAttempt.pointsEarned,
          totalQuestions: userAttempt.totalQuestions,
          correctAnswers: userAttempt.correctAnswers,
          timeSpentSeconds: userAttempt.timeSpentSeconds,
          userAnswers: userAttempt.userAnswers,
          completedAt: userAttempt.completedAt,
        },
        alreadySubmitted: true,
      });
    }

    // User has NOT submitted yet: SECURITY FIRST!
    // Strip `isCorrect` from options and strip `explanation` from questions!
    const secureQuestions = quiz.questions.map((q) => ({
      id: q.id,
      orderIndex: q.orderIndex,
      question: q.question,
      codeSnippet: q.codeSnippet,
      points: q.points,
      options: q.options.map((o) => ({
        id: o.id,
        orderIndex: o.orderIndex,
        text: o.text,
      })),
    }));

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        topic: quiz.topic,
        description: quiz.description,
        durationMinutes: quiz.durationMinutes,
        maxPoints: quiz.maxPoints,
        dayIndex: quiz.dayIndex,
        weekNumber: quiz.week.weekNumber,
        questions: secureQuestions,
      },
      attempt: null,
      alreadySubmitted: false,
    });
  } catch (error: any) {
    console.error('Fetch quiz error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
