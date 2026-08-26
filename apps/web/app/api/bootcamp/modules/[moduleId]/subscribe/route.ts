import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
    }

    const session = await auth.api.getSession({ headers: await headers() }).catch((e) => {
      console.error('Session retrieval error:', e);
      return null;
    });

    const userAuth = session?.user;
    if (!userAuth || userAuth.id !== userId) {
      return NextResponse.json({ message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const res = await fetch(`${getApiBaseUrl()}/bootcamp/modules/${resolvedParams.moduleId}/subscribe`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': getInternalApiKey()
      },
      body: JSON.stringify({ userId: userId })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('NestJS API failed:', res.status, errorText);
      let parsedError = errorText;
      try {
        const jsonErr = JSON.parse(errorText);
        parsedError = jsonErr.message || errorText;
      } catch {}
      return NextResponse.json({ message: 'Failed to subscribe', error: parsedError }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Next.js API exception:', err);
    return NextResponse.json({ message: 'Internal Server Error', error: err?.message || String(err) }, { status: 500 });
  }
}
