import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { featuredPosts } from '@/app/lib/social-posts';
import { CommunitySectionIntro } from './CommunitySectionIntro';

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/ethshala/',
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.287zM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123zM7.119 20.452H3.555V8.999h3.564v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/Its_EthShala',
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.965 6.817H1.681l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    ),
  },
];

export function CommunityPostsSection() {
  return (
    <section id="latest-posts" className="bg-[#f7f8f2] text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:px-10 lg:py-16">
        <CommunitySectionIntro
          eyebrow="Latest"
          title={<>Posts <span className="text-emerald-700">&amp; News.</span></>}
          description="Event highlights, community updates, and announcements — all in one place."
          actionContent={
            <>
              <p className="text-sm font-semibold">Follow the updates</p>
              <div className="mt-3 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow ETHShala on ${social.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-800 transition-colors hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </>
          }
        />

        <div className="relative lg:pr-28">
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredPosts.slice(0, 2).map((post) => (
              <article
                key={post.href}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(15,23,42,0.14)]"
              >
                <a href={post.href} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative aspect-[1.7/1] overflow-hidden bg-emerald-950">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 42vw, 360px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Image src="/brand/ethshala_logo.svg" alt="" width={24} height={24} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">ETHShala</p>
                        <p className="text-[10px] text-slate-500">{post.date}</p>
                      </div>
                      <ArrowUpRight size={15} className="ml-auto shrink-0 text-emerald-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="font-grotesk text-base font-semibold leading-snug tracking-[-0.02em]">{post.headline}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{post.title}</p>
                  </div>
                </a>
              </article>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/4 hidden w-24 rotate-[-8deg] flex-col items-center text-slate-900 lg:flex"
          >
            <p
              className="text-[1.35rem] font-semibold leading-[1.05] tracking-[-0.04em]"
              style={{ fontFamily: '"Comic Sans MS", "Segoe Print", cursive' }}
            >
              Stay<br />updated
            </p>
            <svg viewBox="0 0 100 28" fill="none" className="mt-1 h-7 w-24 text-amber-500">
              <path d="M4 20C26 9 61 5 94 3M39 25c15-7 32-11 52-13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 72 76" fill="none" className="mt-5 h-16 w-16 -rotate-[18deg]">
              <g stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 27 33-14 3 35-33 2c-5 0-8-4-9-10-1-6 1-11 6-13Z" />
                <path d="m51 13 10-6M56 31l11-2M54 46l9 6M22 49l8 14c2 4 7 4 10 1l4-5-8-12" />
                <path d="m30 48 7 14" />
                <path d="M13 29c-4 3-5 8-4 13 1 4 3 7 7 8" />
              </g>
            </svg>
            <span className="absolute -left-2 top-[5.8rem] h-8 w-2 border-l border-slate-400/70 rotate-[-8deg]" />
          </div>
        </div>
      </div>
    </section>
  );
}
