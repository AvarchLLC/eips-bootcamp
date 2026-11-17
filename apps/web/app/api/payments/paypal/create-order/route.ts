import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';

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
    const { moduleId } = body;

    if (!moduleId) {
      return NextResponse.json({ error: 'Missing moduleId' }, { status: 400 });
    }

    const moduleItem = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleItem) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const amountValue = (moduleItem.price || 1).toFixed(2);
    const accessToken = await getPayPalAccessToken();

    if (accessToken) {
      const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: moduleItem.id,
              description: `ETHShala Course: ${moduleItem.title}`,
              amount: {
                currency_code: 'USD',
                value: amountValue,
              },
            },
          ],
        }),
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        return NextResponse.json({ id: orderData.id, status: orderData.status });
      } else {
        const errJson = await orderRes.json().catch(() => ({}));
        console.error('PayPal create order error:', errJson);
      }
    }

    // Interactive Demo / Sandbox fallback if credentials are unset or in dev
    const demoOrderId = `PAYPAL_ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return NextResponse.json({
      id: demoOrderId,
      status: 'CREATED',
      isDemo: true,
      amount: amountValue,
    });
  } catch (error: any) {
    console.error('Create PayPal order route error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create PayPal order' }, { status: 500 });
  }
}
