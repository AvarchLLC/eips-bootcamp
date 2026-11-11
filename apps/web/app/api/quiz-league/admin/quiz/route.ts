import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    const isAdmin = user?.role === 'ADMIN' || process.env.NODE_ENV === 'development';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      weekId,
      dayIndex,
      title,
      topic,
      description,
      durationMinutes = 5,
      maxPoints = 100,
      isPublished = true,
      questions = [],
    } = body;

    if (!weekId || !dayIndex || !title || !topic) {
      return NextResponse.json({ error: 'Missing required quiz fields' }, { status: 400 });
    }

    let quiz;
    if (id) {
      // Update existing
      quiz = await prisma.quiz.update({
        where: { id },
        data: {
          title,
          topic,
          description,
          durationMinutes: Number(durationMinutes),
          maxPoints: Number(maxPoints),
          isPublished,
          status: isPublished ? 'AVAILABLE' : 'UPCOMING',
        },
      });
    } else {
      // Create new
      const scheduledFor = new Date();
      quiz = await prisma.quiz.create({
        data: {
          weekId,
          dayIndex: Number(dayIndex),
          title,
          topic,
          description,
          durationMinutes: Number(durationMinutes),
          maxPoints: Number(maxPoints),
          scheduledFor,
          isPublished,
          status: isPublished ? 'AVAILABLE' : 'UPCOMING',
        },
      });
    }

    // If questions provided, replace questions
    if (Array.isArray(questions) && questions.length > 0) {
      await prisma.quizQuestion.deleteMany({ where: { quizId: quiz.id } });

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await prisma.quizQuestion.create({
          data: {
            quizId: quiz.id,
            orderIndex: i,
            question: q.question,
            codeSnippet: q.codeSnippet || null,
            explanation: q.explanation || 'Protocol specification explanation.',
            points: Number(q.points) || 20,
            options: {
              create: (q.options || []).map((opt: any, oIdx: number) => ({
                orderIndex: oIdx,
                text: opt.text,
                isCorrect: !!opt.isCorrect,
              })),
            },
          },
        });
      }
    }

    const fullQuiz = await prisma.quiz.findUnique({
      where: { id: quiz.id },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    return NextResponse.json({ success: true, quiz: fullQuiz });
  } catch (error: any) {
    console.error('Admin quiz save error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save quiz' }, { status: 500 });
  }
}
