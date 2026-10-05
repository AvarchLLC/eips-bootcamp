'use client';

import { useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { featuredPosts } from '../../lib/social-posts';

export function Featured() {
  const storiesRef = useRef<HTMLDivElement>(null);

  const scrollStories = (direction: -1 | 1) => {
    storiesRef.current?.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="overflow-hidden bg-[#06100e] py-9 text-white sm:py-11"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-center lg:gap-5 lg:px-12">
        <div>
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70">
              From the road
            </p>
            <div className="relative inline-block pb-5">
              <h2
                id="featured-heading"
                className="text-[clamp(1.65rem,3vw,2rem)] font-semibold leading-[1.08] tracking-[-0.035em]"
              >
                Real students.
                <br />
                Real campuses.
              </h2>
              <svg
                aria-hidden="true"
                viewBox="0 0 220 22"
                className="absolute bottom-0 left-[10%] w-[82%] overflow-visible"
                fill="none"
              >
                <path
                  d="M3 16C55 3 145 4 215 7M24 21C88 11 159 8 191 11"
                  stroke="#48d6b2"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              aria-label="Scroll campus stories left"
              onClick={() => scrollStories(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Scroll campus stories right"
              onClick={() => scrollStories(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={storiesRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
          aria-label="Campus stories"
        >
          {featuredPosts.map((post) => (
            <a
              key={post.href}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open campus story: ${post.headline}`}
              className="group relative isolate flex h-[190px] w-[min(78vw,230px)] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-md bg-[#1d2925] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#61d9b9] sm:h-[205px] sm:w-[240px]"
            >
              <img
                src={post.image}
                alt=""
                className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06100e] via-[#06100e]/75 to-transparent" />
              <div className="p-3">
                <p className="mb-1 text-[9px] font-semibold text-[#f1c84b]">
                  {post.headline.includes('Heritage')
                    ? 'Heritage Institute of Technology'
                    : post.headline.includes('Academy')
                      ? 'Academy of Technology'
                      : post.headline.includes('HETC') ||
                          post.title.includes('Hooghly Engineering')
                        ? 'HETC'
                        : post.platform}
                </p>
                <h3 className="line-clamp-2 text-[13px] font-semibold leading-[1.2] text-white">
                  {post.headline}
                </h3>
                <p className="mt-1.5 text-[9px] text-white/70">{post.date}</p>
              </div>
            </a>
          ))}

          <Link
            href="/impact"
            className="flex h-[190px] w-[min(78vw,230px)] shrink-0 snap-start flex-col items-start justify-end rounded-md border border-white/15 bg-white/[0.04] p-4 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08] sm:h-[205px] sm:w-[180px]"
          >
            Explore all stories
            <ArrowUpRight size={16} className="mt-3 text-[#61d9b9]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
