import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';
import { createPublicClient, http, parseEther } from 'viem';
import { base, polygon, mainnet, sepolia } from 'viem/chains';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

const TREASURY_ADDRESS =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS || '0x44AE96b3a246D218c5e608035D5a9FeB48d79F21';

const chainConfigs = {
  8453: { chain: base, rpc: 'https://mainnet.base.org', explorer: 'https://basescan.org' },
  137: { chain: polygon, rpc: 'https://polygon-rpc.com', explorer: 'https://polygonscan.com' },
  1: { chain: mainnet, rpc: 'https://cloudflare-eth.com', explorer: 'https://etherscan.io' },
  11155111: { chain: sepolia, rpc: 'https://rpc.sepolia.org', explorer: 'https://sepolia.etherscan.io' },
} as const;

type CryptoPrices = {
  ethereum?: { usd?: number };
  'matic-network'?: { usd?: number };
};

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { txHash, chainId: rawChainId, moduleId } = body;
    const chainId = Number(rawChainId);

    if (
      typeof txHash !== 'string' ||
      !/^0x[0-9a-f]{64}$/i.test(txHash) ||
      !Number.isInteger(chainId) ||
      typeof moduleId !== 'string' ||
      !moduleId
    ) {
      return NextResponse.json({ error: 'Invalid transaction hash, chain ID, or module ID' }, { status: 400 });
    }

    if (chainId === 11155111 && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Testnet payments are not accepted in production' }, { status: 400 });
    }

    const chainConfig = chainConfigs[chainId as keyof typeof chainConfigs];
    if (!chainConfig) {
      return NextResponse.json({ error: 'Unsupported payment network' }, { status: 400 });
    }

    const moduleItem = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!moduleItem) {
      return NextResponse.json({ error: 'Target module not found' }, { status: 404 });
    }
    if (!moduleItem.isPremium || moduleItem.price <= 0) {
      return NextResponse.json({ error: 'This module does not require payment' }, { status: 400 });
    }

    const normalizedHash = txHash.toLowerCase();
    const replayCheckKey = `payment:crypto:${chainId}:${normalizedHash}`;
    const legacyReplayCheckKey = `payment:crypto:${normalizedHash}`;
    const existingPayment = await prisma.verification.findFirst({
      where: { identifier: { in: [replayCheckKey, legacyReplayCheckKey] } },
    });
    if (existingPayment) {
      return NextResponse.json(
        { error: 'This on-chain transaction has already been credited' },
        { status: 409 },
      );
    }

    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(chainConfig.rpc),
    });

    let receipt;
    let transaction;
    try {
      [receipt, transaction] = await Promise.all([
        publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` }),
        publicClient.getTransaction({ hash: txHash as `0x${string}` }),
      ]);
    } catch (error) {
      console.error('Unable to verify crypto payment on-chain:', error);
      return NextResponse.json({ error: 'Unable to verify transaction on this network' }, { status: 502 });
    }

    if (receipt.status !== 'success') {
      return NextResponse.json({ error: 'Transaction did not succeed on-chain' }, { status: 400 });
    }
    if (transaction.to?.toLowerCase() !== TREASURY_ADDRESS.toLowerCase()) {
      return NextResponse.json({ error: 'Payment was not sent to the platform treasury' }, { status: 400 });
    }

    const priceResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network&vs_currencies=usd',
      { next: { revalidate: 60 }, headers: { Accept: 'application/json' } },
    );
    if (!priceResponse.ok) {
      return NextResponse.json({ error: 'Unable to confirm the current cryptocurrency price' }, { status: 503 });
    }

    const prices: CryptoPrices = await priceResponse.json();
    const usdPrice = chainId === 137 ? prices['matic-network']?.usd : prices.ethereum?.usd;
    if (typeof usdPrice !== 'number' || !Number.isFinite(usdPrice) || usdPrice <= 0) {
      return NextResponse.json({ error: 'Unable to confirm the current cryptocurrency price' }, { status: 503 });
    }

    const decimals = chainId === 137 ? 4 : 6;
    const quotedAmount = (moduleItem.price / usdPrice).toFixed(decimals);
    const minimumValue = parseEther(quotedAmount);
    if (transaction.value < minimumValue) {
      return NextResponse.json({ error: 'Payment amount is less than the module price' }, { status: 400 });
    }

    const auditData = JSON.stringify({
      provider: 'CRYPTO',
      chainId,
      chainName: chainConfig.chain.name,
      txHash: normalizedHash,
      to: transaction.to,
      valueWei: transaction.value.toString(),
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
      verified: true,
      txHash,
      explorerUrl: `${chainConfig.explorer}/tx/${txHash}`,
      moduleTitle: moduleItem.title,
    });
  } catch (error) {
    console.error('Crypto payment verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
