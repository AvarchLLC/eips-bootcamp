import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true, durationMinutes: true, isPublished: true },
    });

    if (!quiz || !quiz.isPublished) {
      return NextResponse.json({ error: 'Quiz not found or not published' }, { status: 404 });
    }

    const sessionKey = `quiz_session:${user.id}:${quiz.id}`;
    const existingSession = await prisma.verification.findFirst({
      where: { identifier: sessionKey },
      orderBy: { createdAt: 'desc' },
    });

    if (existingSession) {
      const startedAt = new Date(existingSession.value);
      const elapsedSeconds = Math.floor((Date.now() - startedAt.getTime()) / 1000);
      if (
        !Number.isFinite(startedAt.getTime()) ||
        elapsedSeconds > quiz.durationMinutes * 60 + 45
      ) {
        return NextResponse.json({ error: 'This quiz session has expired' }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        startedAt: startedAt.toISOString(),
        durationMinutes: quiz.durationMinutes,
      });
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + (quiz.durationMinutes * 60 + 45) * 1000);

    await prisma.verification.create({
      data: {
        identifier: sessionKey,
        value: startedAt.toISOString(),
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      startedAt: startedAt.toISOString(),
      durationMinutes: quiz.durationMinutes,
    });
  } catch (error: any) {
    console.error('Quiz start timer error:', error);
    return NextResponse.json({ error: error.message || 'Failed to start quiz session' }, { status: 500 });
  }
}
