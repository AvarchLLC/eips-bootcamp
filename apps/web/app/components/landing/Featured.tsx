'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { featuredPosts } from '../../lib/social-posts';

const UPDATE_INTERVAL_MS = 5000;

export function Featured() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const featuredPost = featuredPosts[activeIndex];

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => setProgress(100));
    const timer = window.setTimeout(() => {
      setProgress(0);
      setActiveIndex((index) => (index + 1) % featuredPosts.length);
    }, UPDATE_INTERVAL_MS);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timer);
    };
  }, [activeIndex]);

  return (
    <section className="bg-background py-16 sm:py-20" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              ETHShala updates
            </p>
            <h2 id="featured-heading" className="text-3xl font-bold text-foreground sm:text-4xl">
              Featured
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground sm:text-right">
            Campus stories, community milestones, and the latest from across ETHShala.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
          <article className="overflow-hidden rounded-xl border border-border bg-card">
            <a
              href={featuredPost.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              aria-label={`Open update: ${featuredPost.headline}`}
            >
              <div className="relative aspect-[16/7] overflow-hidden bg-muted">
                <img
                  src={featuredPost.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {/* <span className="absolute bottom-4 left-4 rounded-sm bg-background/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground">
                  {featuredPost.platform} · {featuredPost.date}
                </span> */}
              </div>
            </a>

            <div className="p-5 sm:p-7">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Latest update
              </p>
              <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {featuredPost.headline}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {featuredPost.title}
              </p>
              <a
                href={featuredPost.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 border-b border-emerald-400 pb-1 text-sm font-semibold text-foreground transition-colors hover:text-emerald-400"
              >
                Read the update <ArrowUpRight size={15} />
              </a>
            </div>
          </article>

          <div className="flex flex-col gap-2" aria-label="Choose a featured update">
            {featuredPosts.map((post, index) => (
              <button
                key={post.href}
                type="button"
                onClick={() => {
                  setProgress(0);
                  setActiveIndex(index);
                }}
                aria-pressed={activeIndex === index}
                className={`group relative flex min-h-[76px] items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
                  activeIndex === index
                    ? 'border-emerald-400 bg-card'
                    : 'border-border bg-card/50 hover:bg-card'
                }`}
              >
                <img
                  src={post.image}
                  alt=""
                  className={`h-12 w-[68px] shrink-0 rounded-md object-cover ${
                    activeIndex === index ? '' : 'saturate-75'
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block line-clamp-2 text-sm font-semibold leading-5 text-foreground">
                    {post.headline}
                  </span>
                  <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {post.date}
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  className={`shrink-0 transition-colors ${
                    activeIndex === index ? 'text-emerald-400' : 'text-muted-foreground'
                  }`}
                />
                {activeIndex === index && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-400 transition-[width] ease-linear"
                    style={{
                      width: `${progress}%`,
                      transitionDuration: `${UPDATE_INTERVAL_MS}ms`,
                    }}
                  />
                )}
              </button>
            ))}

            <Link
              href="/impact"
              className="mt-2 inline-flex min-h-11 items-center justify-between border-t border-border px-1 pt-3 text-sm font-semibold text-foreground transition-colors hover:text-emerald-400"
            >
              Explore all impact updates <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}