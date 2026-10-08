import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const impactStats = [
  { value: '4', label: 'Campuses' },
  { value: '200+', label: 'Students reached' },
  { value: '8+', label: 'Sessions conducted' },
  { value: '10+', label: 'ETHShala registrations' },
];

export function ImpactPartnerSections() {
  return (
    <>
      <section
        aria-labelledby="impact-heading"
        className="relative overflow-visible bg-[#06100e] text-white z-30 shadow-2xl"
      >
        <div className="mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:px-12 max-w-[1400px]">
          <div className="flex-shrink-0 max-w-[280px]">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#61d9b9]">
              Our impact
            </p>
            <h2
              id="impact-heading"
              className="text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold leading-[1.1] tracking-tight relative inline-block"
            >
              Growing one
              <br />
              campus at a time.
              <svg className="absolute -bottom-3 left-0 w-[140px] h-[16px] text-[#0e7955]" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                <path d="M5,10 Q50,0 95,15" />
                <path d="M10,18 Q40,5 90,20" />
              </svg>
            </h2>
          </div>

          <dl className="flex flex-wrap lg:flex-nowrap items-center gap-x-6 gap-y-6 lg:gap-x-0 w-full lg:w-auto mt-4 lg:mt-0">
            {impactStats.map((stat, index) => (
              <div key={stat.label} className={`flex flex-col ${index !== 0 ? 'lg:border-l lg:border-white/20 lg:pl-8' : ''} ${index !== impactStats.length - 1 ? 'lg:pr-8' : ''}`}>
                <dt className="text-[2rem] font-bold leading-none tracking-tight">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-[10px] font-medium text-white/70 uppercase tracking-wide">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>

          {/* India Map Graphic */}
          <div className="relative w-[280px] h-[180px] hidden xl:block flex-shrink-0">
            <img src="/india-map.svg" alt="India Map" className="absolute right-[40px] top-0 w-[140px] h-[140px] opacity-40 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />

            {/* Kolkata */}
            <div className="absolute left-[198px] top-[66px] flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-[#f8bd36] rounded-full shadow-[0_0_8px_#f8bd36] flex-shrink-0"></div>
               <p className="text-[16px] text-[#f8bd36] transform rotate-[-5deg]" style={{ fontFamily: '"Caveat", cursive' }}>
                  Kolkata
               </p>
            </div>
            
            {/* Bangalore */}
            <div className="absolute left-[70px] top-[114px] flex items-center gap-1.5 justify-end w-[80px]">
               <p className="text-[16px] text-[#f8bd36] transform rotate-[-5deg]" style={{ fontFamily: '"Caveat", cursive' }}>
                  Bangalore
               </p>
               <div className="w-1.5 h-1.5 bg-[#f8bd36] rounded-full shadow-[0_0_8px_#f8bd36] flex-shrink-0"></div>
            </div>
            
            {/* Arrow and More Campuses */}
            <div className="absolute right-[-30px] bottom-[10px]">
               <svg className="absolute -left-10 top-0 w-10 h-8 text-[#f8bd36]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                 <path d="M5,10 Q25,30 40,20" markerEnd="url(#arrow)" />
                 <defs>
                   <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                     <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" stroke="none" />
                   </marker>
                 </defs>
               </svg>
               <p className="text-[18px] text-white/90 transform rotate-[-12deg] leading-tight ml-2" style={{ fontFamily: '"Caveat", cursive' }}>
                  More<br/>campuses<br/>soon...
               </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="partner-heading"
        className="relative overflow-hidden bg-[#fdfdfc] text-[#111]"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#0e7955 1px, transparent 1px), linear-gradient(90deg, #0e7955 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-6 py-12 lg:py-16 lg:grid-cols-[1fr_1.5fr] lg:gap-8 lg:px-12 relative z-10">
          <div className="max-w-lg relative">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.25em] text-[#666963]">
              Work with us
            </p>
            <h2
              id="partner-heading"
              className="text-[clamp(2.5rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight"
            >
              Let’s bring Ethereum
              <br />
              <span className="text-[#0e7955]">to your campus.</span>
            </h2>
            <p className="mt-6 text-[18px] font-medium leading-[1.5] text-[#444]">
              Whether you’re a university, technical club or student community, we can design a program around your students.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/impact"
                className="group inline-flex min-h-[52px] items-center gap-3 rounded-lg bg-[#0a1a16] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#15382f] shadow-lg"
              >
                Partner with ETHShala <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/impact"
                className="group inline-flex min-h-[52px] items-center gap-3 rounded-lg border-2 border-[#e5e7eb] bg-white px-7 text-[15px] font-semibold text-[#111] transition-colors hover:border-[#d1d5db] hover:bg-[#f9fafb]"
              >
                Talk to us <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            {/* Yellow squiggles around text */}
            <svg className="absolute left-[85%] top-[0%] w-12 h-12 text-[#f8bd36] transform rotate-12 hidden lg:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
              <path d="M20,50 L80,30 M30,70 L90,50 M10,30 Q40,10 60,40" />
            </svg>
            <svg className="absolute left-[80%] bottom-[0%] w-12 h-12 text-[#f8bd36] transform rotate-[160deg] hidden lg:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
              <path d="M20,50 L80,30 M30,70 L90,50 M10,30 Q40,10 60,40" />
            </svg>
          </div>

          {/* Flowchart Diagram */}
          <div className="relative w-full h-[400px] hidden lg:block font-sans">
            
            {/* Center Box */}
            <div className="absolute left-[50%] top-[40%] -translate-x-1/2 -translate-y-1/2 w-[280px] bg-[#0a1a16] rounded-xl p-5 text-center shadow-2xl z-20 border-[3px] border-[#0a1a16]">
               <h3 className="text-4xl font-extrabold text-white tracking-tight">ETHShala</h3>
               <p className="text-[10px] font-bold tracking-[0.2em] text-white/80 mt-2 uppercase">Learn \ Build \ Contribute</p>
            </div>

            {/* Bottom Campus Box */}
            <div className="absolute left-[50%] bottom-[15%] -translate-x-1/2 w-[240px] bg-[#0a1a16] rounded-xl p-4 text-center shadow-xl z-20">
               <p className="text-[16px] font-bold tracking-[0.15em] text-white uppercase mt-1">Your Campus</p>
               {/* University Clipart Icon */}
               <svg className="absolute -top-[55px] left-1/2 -translate-x-1/2 w-[90px] h-[75px] text-[#0a1a16]" viewBox="0 0 100 100" fill="currentColor">
                 {/* Base line */}
                 <rect x="5" y="85" width="90" height="6" rx="2" />
                 {/* Side wings */}
                 <rect x="12" y="55" width="16" height="30" />
                 <rect x="72" y="55" width="16" height="30" />
                 {/* Side windows */}
                 <rect x="16" y="65" width="8" height="12" fill="#fff" rx="1" />
                 <rect x="76" y="65" width="8" height="12" fill="#fff" rx="1" />
                 {/* Main building */}
                 <rect x="28" y="40" width="44" height="45" />
                 {/* Door outer (white) */}
                 <path d="M38 85V60a12 12 0 0 1 24 0v25H38z" fill="#fff" />
                 {/* Door inner (black) */}
                 <path d="M42 85V62a8 8 0 0 1 16 0v23H42z" fill="#0a1a16" />
                 {/* Roof */}
                 <polygon points="50,15 22,40 78,40" />
                 {/* Clock/Emblem */}
                 <circle cx="50" cy="30" r="3.5" fill="#fff" />
                 {/* Flag pole */}
                 <rect x="49" y="0" width="2" height="20" />
                 {/* Flag */}
                 <path d="M51 2L68 8L51 14Z" />
               </svg>
            </div>

            {/* Top Left: Learning */}
            <div className="absolute left-[5%] top-[5%] w-[180px] bg-white rounded-xl p-4 shadow-[5px_5px_0px_#0e7955] border-2 border-gray-100 transform rotate-[-2deg] z-10">
               <div className="flex items-center gap-2 mb-2">
                 <svg className="w-5 h-5 text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                 <span className="text-[12px] font-bold uppercase tracking-wider text-[#111]">Learning</span>
               </div>
               <p className="text-[11px] font-medium text-[#666] leading-snug">EIPs, Ethereum, Governance & more</p>
            </div>

            {/* Bottom Left: Campus Ambassador */}
            <div className="absolute left-[0%] bottom-[20%] w-[180px] bg-white rounded-xl p-4 shadow-[5px_5px_0px_#f8bd36] border-2 border-gray-100 transform rotate-[1deg] z-10">
               <div className="flex items-center gap-2 mb-2">
                 <svg className="w-5 h-5 text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                 <span className="text-[12px] font-bold uppercase tracking-wider text-[#111]">Campus Ambassador</span>
               </div>
               <p className="text-[11px] font-medium text-[#666] leading-snug">Lead your community with our support</p>
            </div>

            {/* Top Right: Workshops */}
            <div className="absolute right-[15%] top-[0%] w-[180px] bg-white rounded-xl p-4 shadow-[5px_5px_0px_#f8bd36] border-2 border-gray-100 transform rotate-[3deg] z-10">
               <div className="flex items-center gap-2 mb-2">
                 <svg className="w-5 h-5 text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 <span className="text-[12px] font-bold uppercase tracking-wider text-[#111]">Workshops</span>
               </div>
               <p className="text-[11px] font-medium text-[#666] leading-snug">Beginner to Builder sessions</p>
            </div>

            {/* Bottom Right: Community */}
            <div className="absolute right-[5%] bottom-[15%] w-[180px] bg-white rounded-xl p-4 shadow-[5px_5px_0px_#0e7955] border-2 border-gray-100 transform rotate-[-4deg] z-10">
               <div className="flex items-center gap-2 mb-2">
                 <svg className="w-5 h-5 text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 <span className="text-[12px] font-bold uppercase tracking-wider text-[#111]">Community</span>
               </div>
               <p className="text-[11px] font-medium text-[#666] leading-snug">Connect, build and grow together</p>
            </div>

            {/* Connecting Arrows (SVGs drawn in absolute positions) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
               <defs>
                 <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="#0e7955" />
                 </marker>
               </defs>
               {/* Left Top to Center */}
               <path d="M180 80 Q220 70 250 110" fill="none" stroke="#0e7955" strokeWidth="2.5" markerEnd="url(#arrowhead-green)" strokeLinecap="round" />
               {/* Left Bottom to Center */}
               <path d="M180 250 Q230 250 250 210" fill="none" stroke="#0e7955" strokeWidth="2.5" markerEnd="url(#arrowhead-green)" strokeLinecap="round" />
               {/* Right Top to Center */}
               <path d="M420 80 Q360 70 330 110" fill="none" stroke="#0e7955" strokeWidth="2.5" markerEnd="url(#arrowhead-green)" strokeLinecap="round" />
               {/* Right Bottom to Center */}
               <path d="M420 250 Q360 250 330 210" fill="none" stroke="#0e7955" strokeWidth="2.5" markerEnd="url(#arrowhead-green)" strokeLinecap="round" />
               {/* Center to Bottom */}
               <path d="M290 190 L290 230" fill="none" stroke="#0a1a16" strokeWidth="3" markerEnd="url(#arrowhead-green)" strokeLinecap="round" />
               
               {/* Handwritten text arrow */}
               <path d="M680 160 Q620 200 640 250" fill="none" stroke="#111" strokeWidth="2" markerEnd="url(#arrowhead-green)" strokeLinecap="round" />
            </svg>

            {/* Handwritten Text */}
            <div className="absolute right-[-60px] top-[15%] transform rotate-[-8deg] z-30">
               <p className="font-caveat text-[26px] text-[#333] leading-[1.1] text-center" style={{ fontFamily: '"Caveat", cursive' }}>
                  Your<br/>campus<br/>could be<br/>next.
               </p>
               {/* Green underline */}
               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#34d399] rounded-full transform rotate-[5deg]" />
            </div>

            {/* Small yellow dashes */}
            <svg className="absolute left-[0%] top-[45%] w-10 h-10 text-[#f8bd36] transform rotate-[-20deg]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
              <path d="M20,20 L60,10 M10,50 L50,40 M0,80 L40,70" />
            </svg>
            <svg className="absolute right-[10%] top-[0%] w-10 h-10 text-[#f8bd36] transform rotate-[10deg]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
              <path d="M20,20 L60,10 M10,50 L50,40 M0,80 L40,70" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
