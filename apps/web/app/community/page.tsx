// apps/web/app/community/page.tsx

'use client';

import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { CommunityCampusesSection } from '../components/community/CampusNetwork';
import { CommunityEventsSection } from '../components/community/Events';
import { CommunityGallerySection } from '../components/community/EventGallery';
import { CommunityPostsSection } from '../components/community/Social';

export default function CommunityPage() {
  return (
    <div className="community-page min-h-screen overflow-hidden bg-background font-body text-foreground">
      <Navbar 
      className="dark bg-background/90 backdrop-blur-xl border-b border-border"
      showThemeToggle={false} />
      <main>
        <CommunityEventsSection />
        <CommunityPostsSection />
        <CommunityGallerySection />
        <CommunityCampusesSection />
      </main>
      <div className="dark">
        <Footer />
      </div>
    </div>
  );
}