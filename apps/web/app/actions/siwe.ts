'use server';

import crypto from 'crypto';
import { headers } from 'next/headers';
import { verifyMessage } from 'viem';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

const SIWE_SECRET = process.env.BETTER_AUTH_SECRET || 'ethshala-siwe-secret-key';

export interface SiweChallengeResult {
  success: boolean;
  message?: string;
  nonce?: string;
  timestamp?: number;
  error?: string;
}

export interface SiweVerifyResult {
  success: boolean;
  walletAddress?: string;
  error?: string;
}

/**
 * Generate a cryptographically signed SIWE challenge string for the authenticated user.
 */
export async function generateSiweChallengeAction(address: string, chainId: number = 84532): Promise<SiweChallengeResult> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user) {
      return { success: false, error: 'Unauthorized: Please log in first' };
    }

    const userId = session.user.id;
    const nonce = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();

    // Stateless token to verify challenge authenticity without extra database tables
    const signaturePayload = `${userId}:${nonce}:${timestamp}:${address.toLowerCase()}`;
    const hmac = crypto.createHmac('sha256', SIWE_SECRET).update(signaturePayload).digest('hex');

    const formattedMessage = [
      `ETHShala Account Verification`,
      `Sign this message to cryptographically link your Web3 wallet to your student profile.`,
      ``,
      `URI: https://ethshala.com`,
      `Version: 1`,
      `Chain ID: ${chainId}`,
      `Nonce: ${nonce}`,
      `Token: ${hmac}`,
      `Issued At: ${new Date(timestamp).toISOString()}`,
      `Wallet: ${address.toLowerCase()}`,
    ].join('\n');

    return {
      success: true,
      message: formattedMessage,
      nonce,
      timestamp,
    };
  } catch (err: any) {
    console.error('Error generating SIWE challenge:', err);
    return { success: false, error: err?.message || 'Failed to generate challenge' };
  }
}

/**
 * Verify cryptographic signature and link wallet to user account in Prisma.
 */
export async function verifyAndLinkWalletAction({
  address,
  message,
  signature,
}: {
  address: string;
  message: string;
  signature: string;
}): Promise<SiweVerifyResult> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user) {
      return { success: false, error: 'Unauthorized: Please log in first' };
    }

    const userId = session.user.id;
    const cleanAddress = address.trim().toLowerCase();

    // 1. Verify EIP-191 / SIWE signature using viem
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return { success: false, error: 'Invalid wallet signature. Please try again.' };
    }

    // 2. Extract nonce and token from message to verify authenticity
    const tokenMatch = message.match(/Token:\s*([a-f0-9]+)/i);
    const nonceMatch = message.match(/Nonce:\s*([a-f0-9]+)/i);
    const issuedAtMatch = message.match(/Issued At:\s*([^\n]+)/i);

    if (!tokenMatch || !nonceMatch || !issuedAtMatch) {
      return { success: false, error: 'Malformed verification message.' };
    }

    const token = tokenMatch[1];
    const nonce = nonceMatch[1];
    const issuedTime = new Date(issuedAtMatch[1]).getTime();

    // Check expiry (15 minutes)
    if (Date.now() - issuedTime > 15 * 60 * 1000) {
      return { success: false, error: 'Challenge expired. Please generate a new signature.' };
    }

    // Verify HMAC
    const expectedPayload = `${userId}:${nonce}:${issuedTime}:${cleanAddress}`;
    const expectedHmac = crypto.createHmac('sha256', SIWE_SECRET).update(expectedPayload).digest('hex');

    if (token !== expectedHmac) {
      return { success: false, error: 'Challenge authenticity check failed.' };
    }

    // 3. Check if wallet is already linked to another user
    const existing = await prisma.user.findFirst({
      where: {
        walletAddress: cleanAddress,
        id: { not: userId },
      },
    });

    if (existing) {
      return {
        success: false,
        error: 'This wallet address is already linked to another ETHShala account.',
      };
    }

    // 4. Update user's walletAddress in database
    await prisma.user.update({
      where: { id: userId },
      data: { walletAddress: cleanAddress },
    });

    return {
      success: true,
      walletAddress: cleanAddress,
    };
  } catch (err: any) {
    console.error('Error verifying wallet signature:', err);
    return { success: false, error: err?.message || 'Verification failed.' };
  }
}

/**
 * Unlink current wallet from user profile.
 */
export async function unlinkWalletAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { walletAddress: null },
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error unlinking wallet:', err);
    return { success: false, error: err?.message || 'Failed to unlink wallet' };
  }
}

/**
 * Fetch linked wallet address for authenticated user.
 */
export async function getLinkedWalletAction(): Promise<{ walletAddress: string | null }> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user) {
      return { walletAddress: null };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { walletAddress: true },
    });

    return { walletAddress: user?.walletAddress || null };
  } catch (err) {
    console.error('Error fetching linked wallet:', err);
    return { walletAddress: null };
  }
}
