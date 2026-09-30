'use client';

import { ArrowUpRight, Image as ImageIcon, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { socialPosts } from '../../lib/social-posts';

const TwitterIcon = ({
  size = 24,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width={size} height={size} {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.965 6.817H1.681l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const LinkedinIcon = ({
  size = 24,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width={size} height={size} {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.287zM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123zM7.119 20.452H3.555V8.999h3.564v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const platformUrls = {
  LinkedIn: 'https://www.linkedin.com/company/ethshala',
  Twitter: 'https://x.com/Its_EthShala',
} as const;

export function SocialSection() {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPaused = isHovered || isFocused;

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] bg-background px-4 py-10 shadow-2xl shadow-emerald-950/20 sm:px-6 lg:px-8"
      role="region"
      aria-roledescription="carousel"
      aria-label="Latest ETHShala posts"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
    >
      {/* <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" /> */}

      <div className="relative z-10 mx-auto mb-10 max-w-2xl text-center">
        <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
          <Megaphone size={15} />
          <span>The latest buzz</span>
        </div>
        <h2 className="font-grotesk text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Our latest <span className="text-orange-400">posts</span>{' '}
          <span className="font-sans text-foreground">&amp;</span>{' '}news
        </h2>
      </div>

      <div className="relative z-10">
        <div className="social-posts-viewport overflow-hidden">
          <div className={`social-posts-track${isPaused ? ' is-paused' : ''}`}>
            {[false, true].map((isDuplicate) => (
              <div key={String(isDuplicate)} className="flex shrink-0 gap-6 pr-6" aria-hidden={isDuplicate}>
                {socialPosts.map((post, index) => (
                  <article
                    key={`${post.date}-${post.platform}-${isDuplicate}`}
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${socialPosts.length}`}
                    className="group flex w-[min(82vw,260px)] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-orange-400/60 hover:shadow-orange-950/20"
                  >
                    <div className="aspect-[1.65/1] overflow-hidden bg-emerald-950/50">
                      {post.image ? (
                        <img src={post.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-emerald-300/60" aria-label="Post image not added yet">
                          <ImageIcon size={28} aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col border-t border-emerald-400/10 p-5">
                      <a
                        href={platformUrls[post.platform]}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isDuplicate ? -1 : undefined}
                      >
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 p-1.5">
                              <img src="/brand/ethshala_logo.svg" alt="EthShala" className="h-full w-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">ETHShala</p>
                              <p className="text-xs text-muted-foreground">{post.date}</p>
                            </div>
                          </div>
                          {post.platform === 'LinkedIn' ? (
                            <LinkedinIcon size={22} className="shrink-0 text-cyan-300" aria-label="LinkedIn" />
                          ) : (
                            <TwitterIcon size={22} className="shrink-0 text-cyan-300" aria-label="X / Twitter" />
                          )}
                        </div>
                      </a>

                      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{post.title}</p>

                      <a
                        href={post.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isDuplicate ? -1 : undefined}
                        className="mt-auto flex items-center gap-1 pt-6 text-sm font-medium text-orange-400 transition hover:text-orange-300"
                      >
                        View post
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}