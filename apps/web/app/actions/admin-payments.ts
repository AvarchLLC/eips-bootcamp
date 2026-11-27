'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return session.user;
}

export async function getAdminPaymentsData() {
  await verifyAdmin();

  const [subscriptions, verifications, modules, users] = await Promise.all([
    prisma.moduleSubscription.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        module: {
          select: {
            id: true,
            title: true,
            price: true,
            isPremium: true,
          },
        },
      },
    }),
    prisma.verification.findMany({
      where: {
        OR: [
          { identifier: { startsWith: 'crypto_payment:' } },
          { identifier: { startsWith: 'paypal_payment:' } },
          { identifier: { startsWith: 'manual_grant:' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.module.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        isPremium: true,
      },
      orderBy: { orderIndex: 'asc' },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  // Parse verification audit records
  const paymentReceipts = verifications.map((v) => {
    let parsed: any = {};
    try {
      parsed = JSON.parse(v.value);
    } catch {
      parsed = { note: v.value };
    }
    return {
      id: v.id,
      identifier: v.identifier,
      data: parsed,
      createdAt: v.createdAt,
    };
  });

  const totalRevenue = subscriptions.reduce((acc, s) => acc + (s.module?.price || 0), 0);

  return {
    subscriptions,
    paymentReceipts,
    modules,
    users,
    stats: {
      totalSubscriptions: subscriptions.length,
      totalRevenue,
      premiumModulesCount: modules.filter((m) => m.isPremium).length,
      receiptsLogged: verifications.length,
    },
  };
}

export async function grantManualCourseAccess(userId: string, moduleId: string, notes: string) {
  const admin = await verifyAdmin();

  if (!userId || !moduleId) {
    return { success: false, error: 'User and Module are required' };
  }

  try {
    const auditData = JSON.stringify({
      provider: 'MANUAL_ADMIN',
      adminId: admin.id,
      adminEmail: admin.email,
      notes: notes || 'Granted manually by administrator',
      timestamp: new Date().toISOString(),
    });

    await prisma.$transaction(async (tx) => {
      // 1. Audit log in verification table
      await tx.verification.create({
        data: {
          identifier: `manual_grant:${userId}:${moduleId}:${Date.now()}`,
          value: auditData,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });

      // 2. Grant module access
      await tx.moduleSubscription.upsert({
        where: {
          userId_moduleId: {
            userId,
            moduleId,
          },
        },
        update: {},
        create: {
          userId,
          moduleId,
        },
      });
    });

    revalidatePath('/dashboard/admin/payments');
    return { success: true };
  } catch (error: any) {
    console.error('Manual grant failed:', error);
    return { success: false, error: error.message || 'Failed to grant access' };
  }
}

export async function revokeCourseAccess(userId: string, moduleId: string) {
  await verifyAdmin();

  try {
    await prisma.moduleSubscription.delete({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
    });

    revalidatePath('/dashboard/admin/payments');
    return { success: true };
  } catch (error: any) {
    console.error('Revoke failed:', error);
    return { success: false, error: error.message || 'Failed to revoke access' };
  }
}
