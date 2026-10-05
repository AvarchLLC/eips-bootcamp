import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function LearningSection() {
  return (
    <section aria-labelledby="learning-heading" className="overflow-hidden bg-[#f7f6f1] text-[#171a18]">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-9 sm:grid-cols-[1fr_0.9fr] sm:px-8 sm:py-11 lg:gap-12 lg:px-12">
        <div
          role="img"
          aria-label="Reserved space for the ETHShala learning dashboard image"
          className="relative mx-auto h-[190px] w-full max-w-[470px] overflow-hidden rounded-t-[18px] border-[7px] border-[#111918] bg-[#07100e] shadow-[0_16px_35px_rgba(0,0,0,0.22)] sm:h-[220px] sm:rotate-[-3deg] sm:origin-bottom-left"
        >
          <div className="absolute inset-2 flex overflow-hidden rounded-md bg-[#0b1311]">
            <div className="flex w-14 shrink-0 flex-col gap-3 border-r border-white/10 bg-[#080e0d] p-2">
              <div className="h-3 w-8 rounded-sm bg-white/20" />
              {['Home', 'Learn', 'Modules', 'Quizzes', 'Community', 'Events'].map((item) => (
                <span key={item} className="text-[5px] text-white/50">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex-1 p-3">
              <div className="h-2 w-20 rounded bg-white/35" />
              <div className="mt-4 rounded border border-white/10 bg-white/[0.03] p-2">
                <div className="h-2 w-24 rounded bg-white/30" />
                <div className="mt-2 h-1.5 w-32 rounded bg-white/10" />
                <div className="mt-3 h-4 w-14 rounded-sm bg-[#0bbf93]" />
              </div>
              <div className="mt-3 text-[6px] font-medium text-white/60">Featured modules</div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((tile) => (
                  <div key={tile} className="h-12 rounded-sm bg-[#192522]">
                    <div className="h-7 bg-white/[0.07]" />
                    <div className="mx-1 mt-1 h-1 w-8 rounded bg-white/20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#666963]">
            Learning
          </p>
          <h2
            id="learning-heading"
            className="text-[clamp(1.8rem,3.5vw,2.7rem)] font-bold leading-[1.02] tracking-[-0.045em]"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            The session ends.
            <br />
            The learning doesn’t.
          </h2>
          <p className="mt-4 max-w-md text-[13px] leading-[1.5] text-[#454842]">
            Structured modules, quizzes and resources built for students, by the community.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex min-h-10 items-center gap-3 rounded-md bg-[#07100e] px-4 text-[11px] font-medium text-white transition-colors hover:bg-[#17332b]"
          >
            Explore Learning <ArrowRight size={14} />
          </Link>
          <div
            aria-hidden="true"
            className="absolute -right-1 top-2 hidden rotate-[-9deg] bg-[#f2dfa9] px-4 py-3 text-[11px] leading-[1.35] text-[#303127] shadow-md sm:block"
          >
            From
            <br />
            curiosity
            <br />
            to contribution.
          </div>
        </div>
      </div>
    </section>
  );
}
