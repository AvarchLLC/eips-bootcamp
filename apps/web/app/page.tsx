import React from 'react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { Footer } from './components/landing/Footer';
import { Featured } from './components/landing/Featured';
import { CAPSection } from './components/landing/CAPSection';
import { LearningSection } from './components/landing/LearningSection';
import { ImpactPartnerSections } from './components/landing/ImpactPartnerSections';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar className=" bg-background/90 backdrop-blur-xl border-b border-border"/>
      <main className="mt-16">
        <HeroSection />
        <CAPSection />
        <Featured />
        <LearningSection />
        <ImpactPartnerSections />
      </main>
      <Footer />
    </div>
  );
}
