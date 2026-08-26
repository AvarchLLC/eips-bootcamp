import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

export async function GET() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/events`, {
      cache: 'no-store',
      headers: { 'x-api-key': getInternalApiKey() },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch events' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = (session?.user as any)?.role;
  if (!session?.user || (userRole !== 'ADMIN' && userRole !== 'admin')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const res = await fetch(`${getApiBaseUrl()}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': getInternalApiKey()
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to create event' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
