import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    let sessionUserId: string | undefined;
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      sessionUserId = session?.user?.id;
    } catch {
      // transient session read
    }

    const effectiveUserId = sessionUserId || userId;

    // 1. Attempt NestJS backend if available
    try {
      if (effectiveUserId) {
        const res = await fetch(`${getApiBaseUrl()}/bootcamp/modules/${effectiveUserId}`, {
          cache: 'no-store',
          headers: { 'x-api-key': getInternalApiKey() },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            return NextResponse.json(data);
          }
        }
      }
    } catch {
      // NestJS backend offline, gracefully fall through to Prisma
    }

    // 2. Direct Prisma Fallback
    const modules = await prisma.module.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: true,
        subscriptions: effectiveUserId ? { where: { userId: effectiveUserId } } : false,
      },
    });

    if (modules.length > 0) {
      const formatted = modules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        category: m.category || 'General',
        price: m.price || 0,
        duration: m.duration || '4 Weeks',
        lessons: m.lessons.length,
        thumbnailUrl: m.thumbnailUrl,
        isSubscribed: effectiveUserId ? (m as any).subscriptions?.length > 0 : false,
      }));
      return NextResponse.json(formatted);
    }

    // 3. Fallback mock list if database has no modules seeded yet
    return NextResponse.json([
      {
        id: 'module-evm-genesis',
        title: 'Ethereum Protocol & EVM Architecture Bootcamp',
        description: 'Deep dive into Ethereum execution client internals, EVM gas schedules, opcodes, and smart contract security.',
        category: 'Core Protocol',
        price: 25,
        duration: '6 Weeks',
        lessons: 12,
        thumbnailUrl: null,
        isSubscribed: false,
      },
      {
        id: 'module-l2-rollups',
        title: 'Layer 2 Rollups & Scaling Architecture',
        description: 'Comprehensive analysis of Optimistic and ZK rollups, fraud proofs, state commitments, and cross-domain messaging.',
        category: 'Layer 2',
        price: 35,
        duration: '4 Weeks',
        lessons: 10,
        thumbnailUrl: null,
        isSubscribed: false,
      },
    ]);
  } catch (err: any) {
    console.error('Bootcamp modules route error:', err);
    return NextResponse.json([
      {
        id: 'module-evm-genesis',
        title: 'Ethereum Protocol & EVM Architecture Bootcamp',
        description: 'Comprehensive Web3 development curriculum.',
        category: 'Core Protocol',
        price: 25,
        duration: '6 Weeks',
        lessons: 12,
        thumbnailUrl: null,
        isSubscribed: false,
      },
    ]);
  }
}
