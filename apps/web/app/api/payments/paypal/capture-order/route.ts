import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

type PayPalPurchaseUnit = {
  reference_id?: string;
  custom_id?: string;
  amount?: { currency_code?: string; value?: string };
  payments?: {
    captures?: Array<{
      status?: string;
      amount?: { currency_code?: string; value?: string };
    }>;
  };
};

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

    if (typeof orderId !== 'string' || typeof moduleId !== 'string' || !orderId || !moduleId) {
      return NextResponse.json({ error: 'Missing orderId or moduleId' }, { status: 400 });
    }
    if (
      !/^[A-Z0-9]+$/i.test(orderId) &&
      !/^PAYPAL_ORDER_\d+_[A-Z0-9]+$/i.test(orderId)
    ) {
      return NextResponse.json({ error: 'Invalid PayPal order ID' }, { status: 400 });
    }

    if (process.env.NODE_ENV === 'production' && process.env.PAYPAL_MODE !== 'live') {
      return NextResponse.json({ error: 'PayPal live payments are not configured' }, { status: 503 });
    }

    const moduleItem = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleItem) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    if (!moduleItem.isPremium || moduleItem.price <= 0) {
      return NextResponse.json({ error: 'This module does not require payment' }, { status: 400 });
    }

    const replayCheckKey = `payment:paypal:${orderId}`;
    const existingPayment = await prisma.verification.findFirst({
      where: { identifier: replayCheckKey },
    });

    if (existingPayment) {
      return NextResponse.json({ error: 'This PayPal order has already been credited' }, { status: 409 });
    }

    const accessToken = await getPayPalAccessToken();
    const isDemoOrder = orderId.startsWith('PAYPAL_ORDER_');
    const expectedAmount = moduleItem.price.toFixed(2);

    if (isDemoOrder) {
      if (process.env.NODE_ENV !== 'development' || accessToken) {
        return NextResponse.json({ error: 'Invalid PayPal order' }, { status: 400 });
      }
    } else if (accessToken) {
      const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!orderRes.ok) {
        return NextResponse.json({ error: 'PayPal order could not be verified' }, { status: 400 });
      }

      const orderData = await orderRes.json();
      const orderUnits: PayPalPurchaseUnit[] = Array.isArray(orderData.purchase_units)
        ? orderData.purchase_units
        : [];
      const orderMatches = orderUnits.some(
        (unit) =>
          unit.reference_id === moduleId &&
          unit.custom_id === user.id &&
          unit.amount?.currency_code === 'USD' &&
          unit.amount.value === expectedAmount,
      );
      if (orderData.status !== 'APPROVED' || !orderMatches) {
        return NextResponse.json({ error: 'PayPal order does not match this user and module' }, { status: 400 });
      }

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
      const captureData = await captureRes.json();
      const purchaseUnits: PayPalPurchaseUnit[] = Array.isArray(captureData.purchase_units)
        ? captureData.purchase_units
        : [];
      const purchaseUnit = purchaseUnits.find(
        (unit) => unit.reference_id === moduleId && unit.custom_id === user.id,
      );
      const completedCapture = purchaseUnit?.payments?.captures?.find(
        (capture) =>
          capture.status === 'COMPLETED' &&
          capture.amount?.currency_code === 'USD' &&
          capture.amount.value === expectedAmount,
      );

      if (captureData.status !== 'COMPLETED' || !completedCapture) {
        return NextResponse.json({ error: 'PayPal order does not match this user and module' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'PayPal is not configured' }, { status: 503 });
    }

    const auditData = JSON.stringify({
      provider: 'PAYPAL',
      orderId,
      userId: user.id,
      moduleId,
      amountUsd: expectedAmount,
      currency: 'USD',
    });

    await prisma.$transaction(async (tx) => {
      await tx.verification.create({
        data: {
          identifier: replayCheckKey,
          value: auditData,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });

      await tx.moduleSubscription.upsert({
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
    });

    // Sync to NestJS if available
    fetch(`${getApiBaseUrl()}/bootcamp/modules/${moduleId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getInternalApiKey(),
      },
      body: JSON.stringify({ userId: user.id }),
    }).catch((error: unknown) => {
      console.error('Failed to sync module subscription to API:', error);
    });

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
