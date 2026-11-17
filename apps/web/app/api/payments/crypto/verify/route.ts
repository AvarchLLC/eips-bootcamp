import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';
import { createPublicClient, http } from 'viem';
import { base, polygon, mainnet, sepolia } from 'viem/chains';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

const DEFAULT_TREASURY_ADDRESS =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS || '0x44AE96b3a246D218c5e608035D5a9FeB48d79F21';

function getChainConfig(chainId: number) {
  switch (chainId) {
    case 8453:
      return { chain: base, rpc: 'https://mainnet.base.org', explorer: 'https://basescan.org' };
    case 137:
      return { chain: polygon, rpc: 'https://polygon-rpc.com', explorer: 'https://polygonscan.com' };
    case 1:
      return { chain: mainnet, rpc: 'https://cloudflare-eth.com', explorer: 'https://etherscan.io' };
    case 11155111:
      return { chain: sepolia, rpc: 'https://rpc.sepolia.org', explorer: 'https://sepolia.etherscan.io' };
    default:
      return { chain: base, rpc: 'https://mainnet.base.org', explorer: 'https://basescan.org' };
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { txHash, chainId, moduleId } = body;

    if (!txHash || !chainId || !moduleId) {
      return NextResponse.json({ error: 'Missing required fields: txHash, chainId, moduleId' }, { status: 400 });
    }

    // 1. Verify module exists
    const moduleItem = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleItem) {
      return NextResponse.json({ error: 'Target module not found' }, { status: 404 });
    }

    // 2. Prevent replay attacks - check if txHash was already redeemed
    const replayCheckKey = `payment:crypto:${txHash.toLowerCase()}`;
    const existingPayment = await prisma.verification.findFirst({
      where: { identifier: replayCheckKey },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'This on-chain transaction hash has already been credited.' },
        { status: 400 }
      );
    }

    // 3. Verify Transaction on-chain via Viem Public Client
    const chainConfig = getChainConfig(Number(chainId));
    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(chainConfig.rpc),
    });

    let receipt: any = null;
    let tx: any = null;

    try {
      receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
      tx = await publicClient.getTransaction({ hash: txHash as `0x${string}` });
    } catch (rpcErr: any) {
      console.warn('RPC lookup warning (tx may be recently mined):', rpcErr?.message);
    }

    // If RPC returned null (e.g. still indexing or testnet), allow graceful test validation if in dev
    const isSuccess = receipt?.status === 'success' || process.env.NODE_ENV === 'development';

    if (!isSuccess) {
      return NextResponse.json(
        { error: 'Transaction has not succeeded or is still pending on-chain.' },
        { status: 400 }
      );
    }

    // Check recipient if tx details were resolved
    if (tx?.to && DEFAULT_TREASURY_ADDRESS) {
      const recipientMatches = tx.to.toLowerCase() === DEFAULT_TREASURY_ADDRESS.toLowerCase();
      if (!recipientMatches && process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
          { error: `Payment was sent to ${tx.to}, but platform treasury is ${DEFAULT_TREASURY_ADDRESS}.` },
          { status: 400 }
        );
      }
    }

    // 4. Record Module Subscription in Database
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

    // 5. Audit log payment in Verification table
    const auditData = {
      provider: 'CRYPTO',
      chainId,
      chainName: chainConfig.chain.name,
      txHash,
      userId: user.id,
      moduleId,
      amountUsd: moduleItem.price,
      valueWei: tx?.value?.toString() || '0',
      timestamp: new Date().toISOString(),
    };

    await prisma.verification.create({
      data: {
        identifier: replayCheckKey,
        value: JSON.stringify(auditData),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year audit retention
      },
    });

    // Optional: Sync to NestJS if running
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
      verified: true,
      txHash,
      explorerUrl: `${chainConfig.explorer}/tx/${txHash}`,
      moduleTitle: moduleItem.title,
    });
  } catch (error: any) {
    console.error('Crypto payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
