import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CAPSection() {
  return (
    <section aria-labelledby="cap-heading" className="overflow-hidden">
      <div className="bg-[#07100e] text-white">
        <div className="mx-auto grid min-h-[250px] max-w-7xl items-center gap-8 px-6 py-8 sm:grid-cols-[0.65fr_1.35fr] sm:px-10 lg:min-h-[280px] lg:grid-cols-[0.7fr_1.3fr] lg:px-12">
          <div className="relative z-10">
            <h2 className="text-[clamp(1.8rem,3.8vw,3rem)] font-black leading-[0.96] tracking-[-0.045em]">
              Learn it.
              <br />
              Build it.
              <br />
              <span className="text-[#5fe0c0]">Bring it back</span>
              <br />
              <span className="text-[#5fe0c0]">to campus.</span>
            </h2>
            <p className="mt-4 max-w-[270px] text-[12px] leading-[1.45] text-white/75">
              From first sessions to real projects, ETHShala helps students go from curiosity to contribution.
            </p>
          </div>

          <div className="relative mx-auto h-[170px] w-full max-w-[620px] sm:h-[190px] lg:h-[210px]">
            <div
              role="img"
              aria-label="Reserved space for a campus hands-on learning photo"
              className="absolute left-0 top-1 h-[82%] w-[67%] rotate-[-4deg] border-[5px] border-[#f3f1e9] bg-[#202a27]"
            />
            <div
              role="img"
              aria-label="Reserved space for a campus community photo"
              className="absolute right-[2%] top-[23%] h-[68%] w-[34%] rotate-[7deg] border-[5px] border-[#f3f1e9] bg-[#202a27]"
            />
            <div
              aria-hidden="true"
              className="absolute left-[23%] top-0 z-10 h-4 w-12 rotate-[5deg] bg-[#d8c8a8]/80"
            />
            <div className="absolute bottom-0 left-[38%] z-10 -rotate-6 text-[10px] italic text-white/80">
              Hands-on learning
            </div>
            <div className="absolute right-[4%] top-0 z-10 rotate-6 text-[10px] italic text-white/80">
              Events &amp; community
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f7f6f1] text-[#171a18]">
        <div className="mx-auto grid max-w-7xl items-center gap-7 px-6 py-7 sm:grid-cols-[0.36fr_1fr] sm:gap-10 sm:px-10 lg:px-12">
          <div
            role="img"
            aria-label="Reserved space for the ETHShala campus ambassador badge"
            className="mx-auto h-[150px] w-[130px] rotate-[-9deg] rounded-t-2xl rounded-b-lg bg-[#075b49] p-4 text-white shadow-[0_14px_24px_rgba(0,0,0,0.18)] sm:h-[165px] sm:w-[145px]"
          >
            <div className="mx-auto h-3 w-10 rounded-b-md bg-[#f7f6f1]/80" />
            <div className="mt-7 text-center">
              <div aria-hidden="true" className="text-3xl leading-none">◇</div>
              <p className="mt-2 text-[10px] font-bold">ETHShala</p>
              <p className="text-[7px] text-white/75">Campus ambassador</p>
              <div className="mt-4 rounded-md border border-white/50 px-2 py-2 text-left text-[7px] leading-3 text-white/80">
                Your name
                <br />
                Your campus
              </div>
            </div>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#666963]">
              Campus Ambassador Program
            </p>
            <h2
              id="cap-heading"
              className="mt-2 text-[clamp(1.6rem,3vw,2.25rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Students who
              <br />
              <span className="text-[#08634f]">build communities.</span>
            </h2>
            <p className="mt-3 max-w-xl text-[12px] leading-[1.5] text-[#454842]">
              A student-led program to represent ETHShala at your campus, organize events and create opportunities for your peers.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/dashboard/cap"
                className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#07100e] px-4 text-[10px] font-semibold text-white transition-colors hover:bg-[#17332b]"
              >
                Become a Campus Ambassador <ArrowRight size={13} />
              </Link>
              <Link
                href="/dashboard/cap"
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#075b49] hover:text-[#043e33]"
              >
                Learn more <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
