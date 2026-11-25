import { NextResponse } from 'next/server';

interface PriceCache {
  ethUsd: number;
  polUsd: number;
  timestamp: number;
}

let cachedPrices: PriceCache = {
  ethUsd: 2800,
  polUsd: 0.35,
  timestamp: 0,
};

async function getLiveCryptoPrices() {
  const now = Date.now();
  // Cache for 60 seconds
  if (now - cachedPrices.timestamp < 60000) {
    return cachedPrices;
  }

  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network&vs_currencies=usd',
      {
        next: { revalidate: 60 },
        headers: { Accept: 'application/json' },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data?.ethereum?.usd && data?.['matic-network']?.usd) {
        cachedPrices = {
          ethUsd: data.ethereum.usd,
          polUsd: data['matic-network'].usd,
          timestamp: now,
        };
        return cachedPrices;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch CoinGecko prices, using fallback cached rates:', err);
  }

  return cachedPrices;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usdAmount = Math.max(0, parseFloat(searchParams.get('usd') || '0'));

    const prices = await getLiveCryptoPrices();

    const ethAmount = usdAmount > 0 ? (usdAmount / prices.ethUsd).toFixed(6) : '0';
    const polAmount = usdAmount > 0 ? (usdAmount / prices.polUsd).toFixed(4) : '0';

    return NextResponse.json({
      usd: usdAmount,
      rates: {
        ETH: prices.ethUsd,
        POL: prices.polUsd,
      },
      networks: {
        base: {
          chainId: 8453,
          name: 'Base',
          symbol: 'ETH',
          amount: ethAmount,
          isRecommended: true,
          gasEstimate: '~ $0.01',
          explorerUrl: 'https://basescan.org',
          description: 'Coinbase L2 with sub-cent gas fees and instant finality',
        },
        polygon: {
          chainId: 137,
          name: 'Polygon',
          symbol: 'POL',
          amount: polAmount,
          isRecommended: false,
          gasEstimate: '< $0.01',
          explorerUrl: 'https://polygonscan.com',
          description: 'High throughput, ultra-cheap PoS sidechain',
        },
        ethereum: {
          chainId: 1,
          name: 'Ethereum Mainnet',
          symbol: 'ETH',
          amount: ethAmount,
          isRecommended: false,
          gasEstimate: '~ $2.00 - $5.00',
          explorerUrl: 'https://etherscan.io',
          description: 'Original L1 network (higher gas fees)',
        },
        sepolia: {
          chainId: 11155111,
          name: 'Sepolia (Testnet)',
          symbol: 'ETH',
          amount: ethAmount,
          isRecommended: false,
          gasEstimate: 'Free (Testnet)',
          explorerUrl: 'https://sepolia.etherscan.io',
          description: 'Testnet environment for zero-cost development verification',
        },
      },
    });
  } catch (error: any) {
    console.error('Crypto price quote error:', error);
    return NextResponse.json({ error: error.message || 'Failed to calculate quotes' }, { status: 500 });
  }
}
