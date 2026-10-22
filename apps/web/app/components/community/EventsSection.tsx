// apps/web/components/community/EventsSection.tsx

import React from 'react';
import { Calendar, GraduationCap, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  college: string;
  date: string;
  attendees: string;
  type: 'workshop' | 'meetup' | 'hackathon' | 'talk' | 'offline session' | 'online session';
  image?: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Ethereum, EIPs, and The Future of Web3 ecosystem',
    college: 'Hooghly Engineering & Technology College',
    date: 'Aug 27, 2026',
    attendees: '20-25',
    type: 'offline session',
    image: '/events/event_posters/Event poster.jpeg',
  },
];

const typeColors = {
  workshop: 'border-blue-400/20 bg-blue-500/8 text-blue-200',
  meetup: 'border-emerald-400/20 bg-emerald-500/8 text-emerald-200',
  'offline session': 'border-emerald-700/20 bg-emerald-600 text-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/8 dark:text-emerald-200',
  hackathon: 'border-violet-400/20 bg-violet-500/8 text-violet-200',
  'online session': 'border-violet-400/20 bg-violet-500/8 text-violet-200',
  talk: 'border-amber-400/20 bg-amber-500/8 text-amber-200',
};

export const EventsSection: React.FC = () => {
  return (
    <div className="relative group h-full lg:col-span-2">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-border bg-card/80 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.12)] sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_38%)]" />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="mb-8 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-300">
              <GraduationCap size={18} />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300/80">
                Events & Workshops
              </p>
              <h3 className="mt-1 font-grotesk text-2xl font-semibold tracking-[-0.04em] text-foreground">
                College Events
              </h3>
            </div>
          </div>

          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-blue-400">
                On the calendar
              </p>
              <h4 className="mt-2 font-grotesk text-xl font-semibold tracking-[-0.03em] text-foreground">Recent gatherings</h4>
            </div>
            <span className="text-xs text-slate-400">{events.length} highlights</span>
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="group/event flex flex-col rounded-lg border border-border bg-card/60 p-3 transition-all duration-200 hover:bg-accent"
              >
                {event.image && (
                  <div className="mb-3 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/10 shadow-sm">
                    <img
                      src={event.image}
                      alt={`${event.title} event poster`}
                      className="aspect-video w-full object-contain transition-transform duration-500 group-hover/event:scale-[1.02]"
                    />
                  </div>
                )}

                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-grotesk text-[1.05rem] font-semibold leading-tight tracking-[-0.04em] text-foreground">
                        {event.title}
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">{event.college}</p>
                    </div>

                    <span
                      className={[
                        'whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]',
                        typeColors[event.type],
                      ].join(' ')}
                    >
                      {event.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-sm text-foreground/80">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-muted-foreground" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};