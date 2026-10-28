import Image from 'next/image';
import { ArrowDown, MapPin, Sparkles } from 'lucide-react';
import { CommunitySectionIntro } from './CommunitySectionIntro';

const events = [
  {
    day: '27',
    month: 'AUG',
    title: 'Ethereum, EIPs & the future of Web3',
    location: 'Hooghly Engineering & Technology College',
    format: 'Campus session',
  },
  {
    day: '27',
    month: 'SEP',
    title: 'Hands-on',
    location: 'Mentoring and judging sessions',
    format: 'Hackathon',
  },
  {
    day: '8',
    month: 'OCT',
    title: 'MCKV Institute of Engineering',
    location: 'MCKV Institute of Engineering',
    format: 'Campus session',
  },
];

export function CommunityEventsSection() {
  return (
    <section id="events" className="relative overflow-hidden bg-[#061a16] text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-8 sm:pb-14 lg:px-10 lg:pt-32">
        <div className="grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <CommunitySectionIntro
            eyebrow="Upcoming & past"
            title={
              <>
                <span className="text-5xl font-bold text-[#69e4c9] sm:text-6xl">Events.</span>
                <svg
                  viewBox="0 0 36 48"
                  fill="none"
                  aria-hidden="true"
                  className="ml-1 inline-block h-10 w-9 shrink-0 align-middle sm:h-12 sm:w-10"
                >
                  <path
                    d="M5 15 18 4M14 18 31 17M10 28 25 43"
                    stroke="#ffb91f"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </>
            }
            description="From workshops and webinars to campus events, we host experiences that bring the Web3 community closer."
            dark
          />

          <div className="relative mx-auto grid h-64 w-full max-w-2xl grid-cols-[1.1fr_0.9fr] gap-3 sm:h-80">
            <div className="relative mt-5 rotate-[-3deg] sm:mt-2">
              <div className="absolute inset-0 overflow-hidden rounded-sm border-[5px] border-white shadow-2xl">
                <Image
                  src="/events/event_images/IMG_4191.png"
                  alt="ETHShala speaker presenting at a campus event"
                  fill
                  sizes="(max-width: 768px) 55vw, 480px"
                  className="object-cover"
                  priority
                />
                <span className="absolute bottom-3 left-3 rounded bg-black/65 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                  Hands-on workshops
                </span>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-7 left-[12%] z-10 h-8 w-16 rotate-[-10deg] bg-emerald-200/80 shadow-sm"
              />
            </div>
            <div className="relative mb-5 mt-12 rotate-[4deg] overflow-hidden rounded-sm border-[5px] border-white shadow-2xl sm:mb-8 sm:mt-14">
              <Image
                src="/events/event_images/InnovoCon2_1.jpeg"
                alt="Students collaborating at InnovoCon Hacknex"
                fill
                sizes="(max-width: 768px) 45vw, 380px"
                className="object-cover"
              />
              <span className="absolute bottom-3 right-3 rounded bg-black/65 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                Meet like-minded people
              </span>
            </div>
            <Sparkles className="absolute -right-3 top-1 h-8 w-8 rotate-12 text-amber-400" aria-hidden="true" />
          </div>
        </div>

        <div id="event-list" className="mt-10 grid gap-3 md:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.title}
              className="flex items-center gap-4 rounded-xl border border-emerald-100/15 bg-white/[0.035] p-4 transition-colors hover:border-emerald-300/50 hover:bg-white/[0.07] sm:p-5"
            >
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-emerald-200 text-center text-[#09211a]">
                <span className="font-grotesk text-xl font-bold leading-none">{event.day}</span>
                <span className="mt-1 text-[9px] font-bold tracking-wide">{event.month}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-grotesk text-base font-semibold leading-snug text-white sm:text-lg">{event.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin size={12} className="shrink-0 text-emerald-300" />
                  <span className="truncate">{event.location}</span>
                </p>
              </div>
              <span className="hidden shrink-0 rounded-full border border-emerald-300/30 px-3 py-1 text-[10px] font-medium text-emerald-200 sm:block">
                {event.format}
              </span>
            </article>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 text-emerald-100/30 lg:block" aria-hidden="true">
        <ArrowDown size={18} />
      </div>
    </section>
  );
}
