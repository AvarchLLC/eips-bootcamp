import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === 'sb') {
    return null;
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (res.ok) {
      const data = await res.json();
      return data.access_token;
    }
  } catch (e) {
    console.warn('PayPal token error:', e);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, moduleId } = body;

    if (!orderId || !moduleId) {
      return NextResponse.json({ error: 'Missing orderId or moduleId' }, { status: 400 });
    }

    const moduleItem = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleItem) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const accessToken = await getPayPalAccessToken();

    if (accessToken && !orderId.startsWith('PAYPAL_ORDER_')) {
      const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!captureRes.ok) {
        const errJson = await captureRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: errJson.message || 'PayPal order capture failed' },
          { status: captureRes.status }
        );
      }
    }

    // 1. Activate module subscription in database
    await prisma.moduleSubscription.upsert({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        moduleId,
      },
    });

    // 2. Audit log payment in Verification table
    const auditData = {
      provider: 'PAYPAL',
      orderId,
      userId: user.id,
      moduleId,
      amountUsd: moduleItem.price,
      currency: 'USD',
      timestamp: new Date().toISOString(),
    };

    const replayCheckKey = `payment:paypal:${orderId}`;
    await prisma.verification.deleteMany({ where: { identifier: replayCheckKey } });
    await prisma.verification.create({
      data: {
        identifier: replayCheckKey,
        value: JSON.stringify(auditData),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });

    // Sync to NestJS if available
    fetch(`${getApiBaseUrl()}/bootcamp/modules/${moduleId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getInternalApiKey(),
      },
      body: JSON.stringify({ userId: user.id }),
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      orderId,
      moduleTitle: moduleItem.title,
    });
  } catch (error: any) {
    console.error('Capture PayPal order route error:', error);
    return NextResponse.json({ error: error.message || 'Failed to capture PayPal order' }, { status: 500 });
  }
}
