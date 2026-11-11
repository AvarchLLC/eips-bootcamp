import { NextResponse } from 'next/server';
import { getSessionUser } from '@/app/lib/quiz-league/service';
import { mintWeeklyChampionNFT } from '@/app/lib/quiz-league/nft-service';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    const isAdmin = user?.role === 'ADMIN' || process.env.NODE_ENV === 'development';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { weekId } = await request.json();

    if (!weekId) {
      return NextResponse.json({ error: 'Missing weekId' }, { status: 400 });
    }

    const result = await mintWeeklyChampionNFT(weekId);

    return NextResponse.json({ success: result.success, result });
  } catch (error: any) {
    console.error('Trigger NFT mint error:', error);
    return NextResponse.json({ error: error.message || 'Failed to mint NFT' }, { status: 500 });
  }
}
