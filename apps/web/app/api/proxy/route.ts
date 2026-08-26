import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

const ALLOWED_PREFIXES = [
  '/referrals/leaderboard/all',
  '/cap/analytics/admin',
  '/cap/status/',
  '/users/',
];

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const path = url.searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  // Whitelist check to prevent arbitrary traversal
  const isAllowed = ALLOWED_PREFIXES.some(prefix => path.startsWith(prefix));
  if (!isAllowed) {
    return NextResponse.json({ error: 'Forbidden path' }, { status: 403 });
  }

  // Admin path check
  if (path.includes('/admin')) {
    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: { 'x-api-key': getInternalApiKey() },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API Proxy Error:", err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
