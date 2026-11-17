import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSessionUser } from '@/app/lib/quiz-league/service';

export async function GET() {
  try {
    const user = await getSessionUser();

    // Fetch all NFT rewards across all weeks
    const allRewards = await prisma.quizNFTReward.findMany({
      orderBy: { week: { weekNumber: 'desc' } },
      include: {
        week: true,
        winner: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            walletAddress: true,
          },
        },
      },
    });

    const formattedRewards = allRewards.map((reward) => ({
      id: reward.id,
      weekNumber: reward.week.weekNumber,
      weekTitle: reward.week.title,
      tokenId: reward.tokenId,
      tokenUri: reward.tokenUri,
      txHash: reward.txHash,
      status: reward.status,
      network: reward.network,
      chainId: reward.chainId,
      mintedAt: reward.mintedAt,
      isCurrentUserWinner: reward.winnerId === user?.id,
      winner: {
        id: reward.winner.id,
        name: reward.winner.name || reward.winner.username || 'Anonymous Champion',
        username: reward.winner.username ? `@${reward.winner.username}` : '@champion',
        avatarUrl: reward.winner.image,
        walletAddress: reward.recipientAddress,
        shortenedWallet: `${reward.recipientAddress.slice(0, 6)}...${reward.recipientAddress.slice(-4)}`,
      },
      explorerUrl: reward.txHash ? `https://gnosisscan.io/tx/${reward.txHash}` : null,
    }));

    // Current user's specific NFT rewards
    const userRewards = formattedRewards.filter((r) => r.isCurrentUserWinner);

    return NextResponse.json({
      rewards: formattedRewards,
      userRewards,
      currentUserWallet: user?.walletAddress || null,
      gnosisInfo: {
        network: 'Gnosis Chain (formerly xDai)',
        chainId: 100,
        currency: 'xDAI',
        blockExplorer: 'https://gnosisscan.io',
        testnetExplorer: 'https://gnosis-chiado.blockscout.com',
      },
    });
  } catch (error: any) {
    console.error('Quiz league rewards error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

