'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useSession } from '@/app/lib/auth-client';

const events = [
  {
    day: '14',
    month: 'OCT',
    title: 'Ethereum 101 Workshop',
    venue: 'Heritage Institute of Technology, Kolkata',
    color: 'bg-[#f2bd40]',
  },
  {
    day: '28',
    month: 'OCT',
    title: 'EIPs and Governance Session',
    venue: 'Academy of Technology, Kolkata',
    color: 'bg-[#ded9f5]',
  },
  {
    day: '09',
    month: 'NOV',
    title: 'Hands-on Builder Day',
    venue: 'Techno Main Salt Lake, Kolkata',
    color: 'bg-[#e2eee4]',
  },
];

const campuses = [
  {
    name: 'Hooghly Engineering & Technology College',
    logo: '/brand/partners/hetc.png',
  },
  {
    name: 'Heritage Institute of Technology',
    logo: '/brand/partners/heritage.png',
  },
  {
    name: 'MCKV Institute of Engineering',
    logo: '/brand/partners/mckvie.jpg',
  },
  {
    name: 'Techno Main Salt Lake',
    logo: '/brand/partners/tmsl.png',
  },
];

export function HeroSection() {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  return (
    <section className="relative overflow-hidden bg-[#f7f6f1] text-[#171a18]">
      <div className="mx-auto w-full max-w-7xl px-5 pb-4 pt-4 sm:px-8 lg:px-12">
        <div className="grid items-center gap-4 sm:items-start sm:grid-cols-[0.85fr_1.15fr] sm:gap-4 lg:gap-8">
          <div className="relative z-10 max-w-xl sm:pt-10">
            <h1
              className="text-[clamp(3rem,6.8vw,6.5rem)] font-black leading-[0.9] tracking-[-0.065em]"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 900 }}
            >
              <span className="block">Ethereum,</span>
              <span className="relative mt-1 inline-block whitespace-nowrap text-[#08634f]">
                on campus.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 360 24"
                  className="absolute -bottom-4 left-[17%] w-[82%] overflow-visible"
                  fill="none"
                >
                  <path
                    d="M3 16C78 5 189 3 353 9M14 21C108 13 236 9 326 13"
                    stroke="#e8b443"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-5 max-w-sm text-[15px] leading-[1.45] text-[#363936]">
              Bringing Ethereum learning, events
              <br className="hidden sm:block" /> and communities to students.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Link
                href="/impact"
                className="group inline-flex min-h-11 items-center gap-2.5 rounded-md bg-[#064f40] px-5 text-[13px] font-medium text-white transition-colors hover:bg-[#043e33]"
              >
                Partner with us
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={isSignedIn ? '/dashboard/learning' : '/sign-up'}
                className="inline-flex min-h-11 items-center rounded-md border border-[#bfc0bb] bg-white/40 px-5 text-[13px] font-medium text-[#1c201e] transition-colors hover:bg-white"
              >
                Explore programs
              </Link>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div aria-hidden="true" className="flex -space-x-2">
                {[0, 1, 2, 3].map((item) => (
                  <span
                    key={item}
                    className="h-7 w-7 rounded-full border-2 border-[#f7f6f1] bg-gradient-to-br from-[#c8c7bf] to-[#898c83]"
                  />
                ))}
              </div>
              <p className="text-xs leading-[1.35] text-[#363936]">
                <span className="block text-sm font-semibold text-[#1d211f]">200+</span>
                students reached across campuses
              </p>
            </div>
          </div>

          <div className="relative mx-auto h-[360px] w-full max-w-[650px] sm:h-[clamp(300px,36vw,410px)]">
            <div
              aria-label="Reserved space for a campus event photograph"
              className="absolute inset-x-4 top-0 h-[88%] bg-[#e5e3dc] shadow-[0_18px_50px_rgba(34,37,32,0.12)] sm:inset-x-8"
            />
            <div
              aria-hidden="true"
              className="absolute right-0 top-[43%] h-[25%] w-[28%] rotate-[-7deg] border-[5px] border-[#f7f6f1] bg-[#d2d0c8] shadow-lg"
            />

            <div className="absolute right-0 top-[45%] z-10 flex w-[88%] flex-col gap-1 sm:right-1 sm:w-[83%] sm:top-[45%]">
              {events.map((event) => (
                <div
                  key={event.title}
                  className={`${event.color} flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-1.5 shadow-[0_4px_12px_rgba(30,32,29,0.14)] sm:min-h-[50px] sm:gap-3 sm:px-4`}
                >
                  <div className="w-8 shrink-0 text-center leading-none">
                    <span className="block text-base font-bold">{event.day}</span>
                    <span className="mt-1 block text-[8px] font-semibold">{event.month}</span>
                  </div>
                  <div className="min-w-0 flex-1 border-l border-black/10 pl-2">
                    <p className="truncate text-[10px] font-semibold leading-tight sm:text-xs">
                      {event.title}
                    </p>
                    <p className="mt-1 truncate text-[8px] leading-tight sm:text-[9px]">
                      {event.venue}
                    </p>
                  </div>
                  <ArrowRight size={14} className="shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-4 sm:py-5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#666963]">
            Trusted by campuses across India
          </p>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-5">
            {campuses.map((campus) => (
              <div key={campus.name} className="flex min-h-10 items-center gap-3">
                <Image
                  src={campus.logo}
                  alt={`${campus.name} logo`}
                  width={48}
                  height={48}
                  className="h-10 w-10 shrink-0 object-contain"
                />
                <p className="text-xs font-semibold leading-tight text-[#323530]">
                  {campus.name}
                </p>
              </div>
            ))}
            <div className="hidden items-center text-[10px] leading-tight text-[#51544e] sm:flex">
              and more
              <br />
              campuses...
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
