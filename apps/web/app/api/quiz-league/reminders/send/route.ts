import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';
import { sendEmail } from '@/app/lib/email';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    const authHeader = request.headers.get('authorization');
    const isCronAuthorized =
      process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isAdmin = user?.role === 'ADMIN' || process.env.NODE_ENV === 'development';

    if (!isAdmin && !isCronAuthorized) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Cron authorization required' }, { status: 403 });
    }

    // 1. Find active competition week
    const activeWeek = await prisma.quizWeek.findFirst({
      where: { status: 'ACTIVE' },
      include: {
        quizzes: {
          where: { isPublished: true },
          orderBy: { dayIndex: 'desc' },
          take: 1,
        },
      },
    });

    if (!activeWeek || activeWeek.quizzes.length === 0) {
      return NextResponse.json({ message: 'No active published quiz found for today' });
    }

    const todayQuiz = activeWeek.quizzes[0];

    // 2. Find builders who haven't completed today's quiz
    const buildersToRemind = await prisma.user.findMany({
      where: {
        email: { not: undefined },
        NOT: {
          quizAttempts: {
            some: { quizId: todayQuiz.id },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        quizWeeklyScores: {
          where: { weekId: activeWeek.id },
          select: { currentStreak: true, totalPoints: true },
        },
      },
      take: 50,
    });

    let sentCount = 0;
    const appUrl = process.env.NEXTAUTH_URL || 'https://ethshala.com';

    for (const builder of buildersToRemind) {
      if (!builder.email || builder.email.endsWith('@ethshala.com')) continue;

      const streak = builder.quizWeeklyScores[0]?.currentStreak || 0;
      const builderName = builder.name || 'Student Builder';

      const subject = streak > 0
        ? `🔥 Protect your ${streak}-day streak in ETHShala Quiz League!`
        : `⚡ Day ${todayQuiz.dayIndex} Challenge is live on ETHShala: ${todayQuiz.title}`;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #091a14; color: #fcfbf7; margin: 0; padding: 24px; }
            .container { max-width: 540px; margin: 0 auto; background-color: #0f2920; border: 1px solid #1c4538; border-radius: 16px; padding: 32px; }
            .logo { font-size: 20px; font-weight: 900; color: #10b981; letter-spacing: -0.5px; margin-bottom: 24px; }
            .badge { display: inline-block; background-color: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.3); margin-bottom: 12px; }
            h1 { font-size: 22px; font-weight: 800; margin: 0 0 12px; color: #ffffff; }
            p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 20px; }
            .highlight { color: #f59e0b; font-weight: 700; }
            .btn { display: inline-block; background-color: #10b981; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 8px; }
            .footer { font-size: 11px; color: #64748b; margin-top: 32px; border-top: 1px solid #1c4538; pt-4; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">ETHShala</div>
            <div class="badge">Week ${activeWeek.weekNumber} • Day ${todayQuiz.dayIndex} Challenge</div>
            <h1>${todayQuiz.title}</h1>
            <p>Hey ${builderName},</p>
            <p>
              ${streak > 0
                ? `You have an active <span class="highlight">${streak}-day streak</span>! Complete today's timed protocol quiz before midnight UTC to defend your streak and climb the weekly championship leaderboard.`
                : `Today's protocol quiz is now open in the Arena. Test your smart contract knowledge and earn up to <span class="highlight">+${todayQuiz.maxPoints} XP</span> for your weekly standing.`}
            </p>
            <p style="font-size: 12px; font-family: monospace; color: #cbd5e1;">
              Topic: ${todayQuiz.topic} • Duration: ${todayQuiz.durationMinutes} Minutes • Max XP: +${todayQuiz.maxPoints}
            </p>
            <a href="${appUrl}/quiz-league/daily/${todayQuiz.id}" class="btn">Enter Challenge Arena →</a>
            <div class="footer">
              ETHShala Protocol Bootcamp &amp; Quiz League. You are receiving this because you are enrolled as a student builder.
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        await sendEmail({
          to: builder.email,
          subject,
          html,
        });
        sentCount++;
      } catch (err) {
        console.warn(`Failed sending streak email to ${builder.email}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      targetedUsers: buildersToRemind.length,
      quizTitle: todayQuiz.title,
    });
  } catch (error: any) {
    console.error('Streak reminder dispatch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch reminders' }, { status: 500 });
  }
}
