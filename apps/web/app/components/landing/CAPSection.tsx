'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function CAPSection() {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: "100px", threshold: 0 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="cap-heading" className="relative flex flex-col font-sans z-40">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}} />

      {/* Top Dark Section */}
      <div className="relative bg-[#0d1f1a] text-white overflow-hidden pb-40 pt-20 z-20">
        
        {/* Wavy bottom edge joining the light section */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-[60px] md:h-[120px] text-[#fcfbf7] translate-y-[1px]" 
          viewBox="0 0 1440 120" 
          fill="currentColor" 
          preserveAspectRatio="none"
        >
          <path d="M0,80 C480,-40 960,200 1440,80 L1440,120 L0,120 Z" />
        </svg>

        <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 sm:grid-cols-[1fr_1.1fr] lg:px-12">
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.95] tracking-tight">
              <span className="block">Learn it.</span>
              <span className="block mt-1">Build it.</span>
              <span className="block text-[#61d9b9] mt-1">Bring it back<br/>to campus.</span>
            </h2>
            
            {/* Orange accents next to 'to campus.' */}
            <div className="absolute right-0 md:-right-8 bottom-[35%] hidden md:block">
               <svg width="50" height="50" viewBox="0 0 50 50" stroke="#f8bd36" strokeWidth="4" strokeLinecap="round" fill="none">
                  <path d="M10,25 L25,25 M15,10 L25,20 M15,40 L25,30" />
               </svg>
            </div>

            <p className="mt-10 text-[18px] lg:text-[20px] font-medium leading-[1.5] text-white/90 max-w-[420px]">
              From first sessions to real projects, ETHShala helps students go from curiosity to contribution.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[650px] h-[400px]">
            {/* Left Polaroid */}
            <div className="absolute left-[5%] top-[10%] w-[320px] lg:w-[380px] h-[220px] lg:h-[260px] bg-[#1a2b25] border-[12px] border-white shadow-2xl transform rotate-[4deg] z-10 flex items-center justify-center overflow-hidden">
              <img src="/cap-image-1.jpg" alt="Hands-on learning" className="w-full h-full object-cover" />
              {/* Tape */}
              <div className="absolute -top-6 left-[40%] w-24 h-8 bg-white/70 backdrop-blur-sm shadow-sm transform rotate-[-4deg]" />
            </div>
            
            {/* Right Polaroid */}
            <div className="absolute right-[-5%] top-[25%] w-[280px] lg:w-[320px] h-[200px] lg:h-[220px] bg-[#16241e] border-[10px] border-white shadow-xl transform rotate-[12deg] z-0 flex items-center justify-center overflow-hidden">
              <img src="/cap-image-2.jpg" alt="Events and community" className="w-full h-full object-cover" />
              {/* Tape */}
              <div className="absolute -top-4 left-[10%] w-20 h-6 bg-[#93cba3]/80 backdrop-blur-sm shadow-sm transform rotate-[-15deg]" />
            </div>

            {/* Handwritten: Hands-on learning */}
            <div className="absolute bottom-[-10px] left-[30%] z-20 transform rotate-[-8deg] hidden sm:block">
              <svg className="absolute -top-8 -left-8 w-12 h-12 text-white/90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M80,80 Q30,60 20,20 M10,35 L20,20 L35,25" />
              </svg>
              <p className="font-caveat text-2xl text-white/90 font-bold" style={{ fontFamily: '"Caveat", cursive' }}>Hands-on<br/>learning</p>
            </div>

            {/* Handwritten: Events & community */}
            <div className="absolute top-[-30px] right-[5%] z-20 transform rotate-[6deg] hidden sm:block">
              <p className="font-caveat text-2xl text-white/90 font-bold text-center" style={{ fontFamily: '"Caveat", cursive' }}>Events<br/>& community</p>
              <svg className="absolute -bottom-10 right-10 w-10 h-12 text-white/90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M50,10 Q60,70 30,90 M15,75 L30,90 L45,85" />
              </svg>
            </div>

          </div>
        </div>
      </div>

      {/* Middle Light Section */}
      <div className="relative bg-[#fcfbf7] text-[#171a18] pt-16 pb-32 z-30">
        
        {/* Wavy bottom edge to transition into next section (Featured) */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-[60px] md:h-[100px] text-[#06100e] translate-y-[1px]" 
          viewBox="0 0 1440 120" 
          fill="currentColor" 
          preserveAspectRatio="none"
        >
          <path d="M0,0 C480,120 960,-40 1440,60 L1440,120 L0,120 Z" />
        </svg>

        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 sm:grid-cols-[0.8fr_1.2fr] lg:px-12 items-center relative z-30">
          
          {/* Overlapping ID Card */}
          <div ref={cardRef} className="relative h-[300px] lg:h-[350px] w-full flex justify-center">
            
            {/* Orange burst accents on the left of ID card */}
            <div className="absolute left-[-20px] lg:left-[10%] top-[30%] hidden lg:block transform rotate-[-15deg]">
               <svg width="80" height="80" viewBox="0 0 80 80" stroke="#f8bd36" strokeWidth="6" strokeLinecap="round" fill="none">
                  <path d="M10,40 L30,40 M20,20 L35,35 M20,60 L35,45" />
               </svg>
            </div>

            <div 
              className={`absolute top-0 lg:top-[40px] left-1/2 transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isVisible 
                  ? 'translate-y-[50px] lg:translate-y-[150px] -translate-x-1/2 rotate-[12deg] opacity-100 scale-[1.1] md:scale-[1.2] lg:scale-[1.3] xl:scale-[1.4]' 
                  : 'translate-y-[-200px] -translate-x-1/2 rotate-[0deg] opacity-0 scale-[0.9]'
              }`}
            >
              {/* ID Card Wrapper */}
              <div className="relative group flex justify-center">
                <img src="/id-card.png" alt="ID Card" className="w-[450px] sm:w-[550px] lg:w-[600px] xl:w-[700px] h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-50" />
              </div>
            </div>
          </div>

          <div className="pl-0 lg:pl-10 relative">
            <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#666963]">
              Campus Ambassador Program
            </p>
            <h2
              id="cap-heading"
              className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-[#111]"
            >
              Students who
              <br />
              <span className="text-[#075945]">build communities.</span>
            </h2>
            <p className="mt-6 max-w-xl text-[18px] font-medium leading-[1.5] text-[#444]">
              A student-led program to represent ETHShala at your campus, organize events and create opportunities for your peers.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/dashboard/cap"
                className="group inline-flex min-h-[52px] items-center gap-3 rounded-lg bg-[#0a1a16] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#15382f] shadow-lg"
              >
                Become a Campus Ambassador <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/cap"
                className="group inline-flex items-center gap-2 text-[15px] font-bold text-[#075945] hover:text-[#043e33] transition-colors"
              >
                Learn more <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            {/* Handwritten: Different campuses Same vision */}
            <div className="absolute right-[0%] bottom-[0%] hidden lg:block transform rotate-[-8deg]">
              <p className="font-caveat text-3xl font-bold text-[#333] leading-tight" style={{ fontFamily: '"Caveat", cursive' }}>
                Different<br/>campuses<br/>Same vision
              </p>
              <svg className="absolute -bottom-8 -left-4 w-12 h-12 text-[#333]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M80,20 Q20,40 30,80 M15,65 L30,80 L45,70" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
