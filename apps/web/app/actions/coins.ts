'use server';

import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import {
  getUserCoinBalance as getBalance,
  getUserCoinHistory as getHistory,
  getUserInventory as getInventory,
  equipInventoryItem as equipItem,
  type CoinOperationResult,
} from '@/app/lib/coins';
import { InventoryItemType } from '@prisma/client';

export async function getUserCoinBalanceAction(): Promise<number> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return 0;
    return await getBalance(session.user.id);
  } catch (error) {
    console.error('Failed to get coin balance:', error);
    return 0;
  }
}

export async function getUserCoinHistoryAction(limit: number = 20) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return [];
    return await getHistory(session.user.id, limit);
  } catch (error) {
    console.error('Failed to get coin history:', error);
    return [];
  }
}

export async function getUserInventoryAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return [];
    return await getInventory(session.user.id);
  } catch (error) {
    console.error('Failed to get inventory:', error);
    return [];
  }
}

export async function equipItemAction(itemId: string, itemType: InventoryItemType) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };
    return await equipItem(session.user.id, itemId, itemType);
  } catch (error: any) {
    console.error('Failed to equip item:', error);
    return { success: false, error: error?.message || 'Failed to equip item' };
  }
}

export async function topUpCoinsAction(amount: number, packageName: string): Promise<CoinOperationResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };
    const { creditCoins } = await import('@/app/lib/coins');
    return await creditCoins(
      session.user.id,
      amount,
      `Top-Up: ${packageName}`,
      'TOPUP'
    );
  } catch (error: any) {
    console.error('Failed to top up coins:', error);
    return { success: false, error: error?.message || 'Top-up failed' };
  }
}
