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
        className="relative overflow-hidden bg-[#06100e] text-white"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-7 sm:grid-cols-[1.05fr_1.5fr_0.8fr] sm:px-8 sm:py-8 lg:gap-12 lg:px-12">
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70">
              Our impact
            </p>
            <h2
              id="impact-heading"
              className="text-[clamp(1.65rem,3vw,2.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
            >
              Growing one
              <br />
              campus at a time.
            </h2>
          </div>

          <dl className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 sm:gap-3">
            {impactStats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[clamp(1.05rem,2vw,1.35rem)] font-semibold leading-none">
                  {stat.value}
                </dt>
                <dd className="mt-1.5 text-[9px] leading-tight text-white/65 sm:text-[10px]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>

          <div aria-hidden="true" className="hidden h-[110px] sm:block" />
        </div>
      </section>

      <section
        aria-labelledby="partner-heading"
        className="relative isolate overflow-hidden bg-[#101a17] text-white"
      >
        <div
          role="img"
          aria-label="Reserved space for a campus community photograph"
          className="absolute inset-0 -z-20 bg-[#26302c]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06100e]/95 via-[#06100e]/75 to-[#06100e]/25" />

        <div className="mx-auto flex min-h-[220px] max-w-7xl items-center px-5 py-8 sm:min-h-[250px] sm:px-8 lg:min-h-[280px] lg:px-12">
          <div className="max-w-lg">
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70">
              Work with us
            </p>
            <h2
              id="partner-heading"
              className="text-[clamp(1.75rem,3.8vw,2.65rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
            >
              Let’s bring Ethereum
              <br />
              <span className="text-[#5fe0c0]">to your campus.</span>
            </h2>
            <p className="mt-3 max-w-md text-[11px] leading-[1.5] text-white/75 sm:text-xs">
              Whether you’re a university, technical club or student community, we can design a program around your students.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href="/impact"
                className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#f7f6f1] px-3.5 text-[10px] font-semibold text-[#101a17] transition-colors hover:bg-white"
              >
                Partner with ETHShala <ArrowRight size={13} />
              </Link>
              <Link
                href="/impact"
                className="inline-flex min-h-9 items-center rounded-md border border-white/45 px-3.5 text-[10px] font-medium text-white transition-colors hover:bg-white/10"
              >
                Talk to us
              </Link>
            </div>
          </div>
          <div className="ml-auto hidden self-start pt-10 text-right text-[13px] font-medium italic leading-tight text-white/85 lg:block">
            Students
            <br />
            Communities
            <br />
            Real Impact
            <svg
              aria-hidden="true"
              viewBox="0 0 100 16"
              className="mt-1 w-24"
              fill="none"
            >
              <path
                d="M3 10C28 2 65 2 96 6M17 15C45 8 72 7 88 9"
                stroke="#e7cb43"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
