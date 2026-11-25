import { prisma } from './prisma';
import { CoinTransactionType, InventoryItemType } from '@prisma/client';

export interface CoinOperationResult {
  success: boolean;
  newBalance?: number;
  error?: string;
  transactionId?: string;
}

/**
 * Credits ETHShala Coins to a user's balance and records a transaction in the ledger.
 */
export async function creditCoins(
  userId: string,
  amount: number,
  reason: string,
  category: string = 'GENERAL',
  referenceId?: string
): Promise<CoinOperationResult> {
  if (amount <= 0) {
    return { success: false, error: 'Credit amount must be positive.' };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Record transaction in ledger
      const transaction = await tx.coinTransaction.create({
        data: {
          userId,
          amount,
          type: CoinTransactionType.EARNED,
          reason,
          category,
          referenceId,
        },
      });

      // 2. Increment user balance atomically
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          coinBalance: { increment: amount },
        },
        select: { coinBalance: true },
      });

      return {
        transactionId: transaction.id,
        newBalance: updatedUser.coinBalance,
      };
    });

    return {
      success: true,
      newBalance: result.newBalance,
      transactionId: result.transactionId,
    };
  } catch (error: any) {
    console.error('Error crediting coins:', error);
    return {
      success: false,
      error: error?.message || 'Failed to credit coins.',
    };
  }
}

/**
 * Debits ETHShala Coins from a user's balance with strict balance validation.
 */
export async function debitCoins(
  userId: string,
  amount: number,
  reason: string,
  category: string = 'PURCHASE',
  referenceId?: string
): Promise<CoinOperationResult> {
  if (amount <= 0) {
    return { success: false, error: 'Debit amount must be positive.' };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check existing balance
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { coinBalance: true },
      });

      if (!user) {
        throw new Error('User not found.');
      }

      if (user.coinBalance < amount) {
        throw new Error(`Insufficient coins. Balance: ${user.coinBalance}, required: ${amount}`);
      }

      // 2. Record debit transaction
      const transaction = await tx.coinTransaction.create({
        data: {
          userId,
          amount: -amount,
          type: CoinTransactionType.SPENT,
          reason,
          category,
          referenceId,
        },
      });

      // 3. Decrement user balance atomically
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          coinBalance: { decrement: amount },
        },
        select: { coinBalance: true },
      });

      return {
        transactionId: transaction.id,
        newBalance: updatedUser.coinBalance,
      };
    });

    return {
      success: true,
      newBalance: result.newBalance,
      transactionId: result.transactionId,
    };
  } catch (error: any) {
    console.error('Error debiting coins:', error);
    return {
      success: false,
      error: error?.message || 'Failed to debit coins.',
    };
  }
}

/**
 * Retrieves the current coin balance for a user.
 */
export async function getUserCoinBalance(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { coinBalance: true },
    });
    return user?.coinBalance ?? 0;
  } catch (error) {
    console.error('Error retrieving coin balance:', error);
    return 0;
  }
}

/**
 * Retrieves recent coin transaction history for a user.
 */
export async function getUserCoinHistory(userId: string, limit: number = 20) {
  try {
    return await prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  } catch (error) {
    console.error('Error retrieving coin history:', error);
    return [];
  }
}

/**
 * Retrieves a user's inventory items.
 */
export async function getUserInventory(userId: string) {
  try {
    return await prisma.userInventory.findMany({
      where: { userId },
      orderBy: { acquiredAt: 'desc' },
    });
  } catch (error) {
    console.error('Error retrieving inventory:', error);
    return [];
  }
}

/**
 * Equips a cosmetic item for a user (unequips others of the same type).
 */
export async function equipInventoryItem(userId: string, itemId: string, itemType: InventoryItemType) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Unequip any active item of the same type
      await tx.userInventory.updateMany({
        where: {
          userId,
          itemType,
          isEquipped: true,
        },
        data: {
          isEquipped: false,
        },
      });

      // 2. Equip the chosen item
      await tx.userInventory.update({
        where: {
          userId_itemId: {
            userId,
            itemId,
          },
        },
        data: {
          isEquipped: true,
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error equipping item:', error);
    return { success: false, error: error?.message || 'Failed to equip item.' };
  }
}
