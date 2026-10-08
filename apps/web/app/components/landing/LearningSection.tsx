import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function LearningSection() {
  return (
    <section
      aria-labelledby="learning-heading"
      className="relative bg-[#fdfdfc] text-[#111] overflow-x-clip overflow-y-visible z-10"
      style={{ paddingTop: 'clamp(3rem, 6vw, 5rem)', paddingBottom: 'clamp(6rem, 12vw, 10rem)', marginBottom: 'clamp(-4rem, -8vw, -7rem)' }}
    >
      {/* Blurry background behind laptop */}
      <div className="absolute left-0 top-0 h-full w-[45%] opacity-20 hidden lg:block pointer-events-none">
        <img src="/dashboard-ss.png" alt="" className="w-full h-full object-cover blur-[50px] saturate-150" />
      </div>

      <div className="mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-0 max-w-[1200px] px-6 lg:px-10 relative z-20">

        {/* Left Side: Laptop */}
        <div className="relative w-full lg:w-[40%] flex-shrink-0 z-30 lg:-translate-x-8">
          <div className="relative w-full max-w-[420px] transform rotate-[-8deg] -translate-y-8 transition-transform duration-500 hover:rotate-[-5deg]">

            {/* Yellow squiggles (left side) */}
            <svg className="absolute -left-10 top-[55%] w-16 h-16 text-[#f8bd36] rotate-12 hidden lg:block z-30 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
              <path d="M40,50 L80,30 M50,70 L90,50 M30,30 Q40,10 60,40" />
            </svg>

            {/* Yellow squiggles (top right) */}
            <svg className="absolute -right-4 -top-8 w-10 h-10 text-[#f8bd36] rotate-[15deg] hidden lg:block z-30 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
              <path d="M20,30 L60,10 M30,50 L70,30" />
            </svg>

            {/* Lid / Screen */}
            <div className="relative w-full bg-[#111] rounded-[12px] border-[12px] border-[#111] border-b-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.35)] z-10">
              {/* Webcam dot */}
              <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#222] rounded-full border border-white/10" />
              {/* Screen */}
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[4px] bg-black">
                <img
                  src="/dashboard-ss.png"
                  alt="ETHShala Learning Dashboard"
                  className="w-full h-full object-cover object-left-top"
                />
                {/* Glass glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              </div>
              {/* Logo / Brand mark */}
              <div className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 text-[6px] text-white/30 uppercase tracking-widest font-sans">
                ETHShala
              </div>
            </div>

            {/* Base / Keyboard deck */}
            <div
              className="relative w-full left-0 bg-gradient-to-b from-[#333] to-[#111] rounded-b-[12px] rounded-t-[4px] border-t border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-start overflow-hidden"
              style={{ height: '140px', transform: 'perspective(800px) rotateX(60deg) translateY(-20px)', transformOrigin: 'top center', zIndex: -1 }}
            >
              {/* Keyboard well */}
              <div className="w-[85%] h-[60%] mt-4 bg-[#111] rounded-[4px] border border-white/5 flex flex-wrap gap-1 p-2 opacity-80">
                 {/* Fake keys */}
                 {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="flex-grow h-3 bg-[#222] rounded-[2px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
                 ))}
                 <div className="w-[40%] h-3 bg-[#222] rounded-[2px] mx-auto shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] mt-1"></div>
              </div>
              
              {/* Trackpad */}
              <div className="w-[25%] h-[20%] mt-2 bg-[#222] rounded-[4px] border border-white/5"></div>
              
              {/* Front notch */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[15%] h-[4px] bg-[#0a0a0a] rounded-t-sm" />
            </div>
          </div>
        </div>

        {/* Right Side: Text */}
        <div className="relative w-full lg:w-[60%] lg:pl-24 z-30">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#888]">
            Learning
          </p>
          <h2
            id="learning-heading"
            className="text-[clamp(2.5rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#111]"
          >
            The session ends.
            <br />
            <span className="text-[#0e7955]">The learning doesn't.</span>
          </h2>
          <p className="mt-4 max-w-[360px] text-[15px] leading-[1.6] text-[#555]">
            Structured modules, quizzes and resources built for students, by the community.
          </p>
          <Link
            href="/dashboard"
            className="group mt-7 inline-flex min-h-[46px] items-center gap-2.5 rounded-lg bg-[#0a1a16] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#15382f] shadow-md"
          >
            Explore Learning <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Post-it Note — positioned top-right, out of the way */}
          <div className="absolute right-0 lg:right-[-40px] top-[-80px] lg:top-[-100px] hidden lg:block z-40 pointer-events-none">
            {/* Green dashes */}
            <svg className="absolute -top-5 -right-4 w-10 h-10 text-[#0e7955]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
              <path d="M25,80 L15,55 M45,70 L35,40 M65,55 L60,30" />
            </svg>
            <div
              aria-hidden="true"
              className="relative w-[160px] rotate-[10deg] bg-[#f8e099] p-5 pt-7 text-[21px] font-bold leading-[1.15] text-[#222] shadow-[4px_8px_16px_rgba(0,0,0,0.12)] rounded-sm"
              style={{ fontFamily: '"Caveat", cursive', backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)' }}
            >
              <div className="absolute top-2.5 left-2.5 w-1 h-1 rounded-full bg-black/15" />
              <div className="absolute -top-3 left-[35%] w-14 h-5 bg-[#4ade80] rotate-[-15deg] shadow-sm rounded-sm opacity-90" />
              From<br />curiosity<br />to contribution.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
