import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Community',
  description:
    "Explore ETHShala's events, community highlights, and ecosystem partnerships bringing Ethereum education and Web3 opportunities to students.",
};

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return children;
}
