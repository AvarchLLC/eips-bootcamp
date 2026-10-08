'use client';

import { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { featuredPosts } from '../../lib/social-posts';

export function Featured() {
  const storiesRef = useRef<HTMLDivElement>(null);

  const scrollStories = (direction: -1 | 1) => {
    if (storiesRef.current) {
      // Scroll by the visible width of the container (which holds exactly 3 cards on desktop)
      const scrollAmount = storiesRef.current.clientWidth;
      storiesRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (storiesRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current;
        // If we reached the end (with a tiny buffer for fractional pixels), jump back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          storiesRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollStories(1);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="overflow-hidden bg-[#06100e] pt-24 pb-9 sm:pt-32 sm:pb-11 text-white"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 sm:px-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-12">
        <div>
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
              From the road
            </p>
            <div className="relative inline-block pb-6">
              <h2
                id="featured-heading"
                className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]"
              >
                Real students.
                <br />
                Real campuses.
              </h2>
              <svg
                aria-hidden="true"
                viewBox="0 0 220 22"
                className="absolute bottom-2 left-[5%] w-[90%] overflow-visible"
                fill="none"
              >
                <path
                  d="M3 16C55 3 145 4 215 7M24 21C88 11 159 8 191 11"
                  stroke="#48d6b2"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              aria-label="Scroll campus stories left"
              onClick={() => scrollStories(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Scroll campus stories right"
              onClick={() => scrollStories(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={storiesRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2"
          aria-label="Campus stories"
        >
          {featuredPosts.map((post) => (
            <a
              key={post.href}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open campus story: ${post.headline}`}
              className="group relative isolate flex h-[280px] w-[280px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl bg-[#1d2925] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#61d9b9] sm:h-[320px] sm:w-[320px] lg:w-[calc((100%-20px)/2)] shadow-lg"
            >
              <img
                src={post.image}
                alt=""
                className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06100e]/90 via-[#06100e]/30 to-transparent" />
              <div className="p-5">
                <p className="mb-2 text-[11px] font-bold tracking-wide text-[#f1c84b]">
                  {post.headline.includes('Heritage')
                    ? 'Heritage Institute of Technology'
                    : post.headline.includes('Academy')
                      ? 'Academy of Technology'
                      : post.headline.includes('HETC') ||
                          post.title.includes('Hooghly Engineering')
                        ? 'HETC'
                        : post.platform}
                </p>
                <h3 className="line-clamp-3 text-[16px] font-bold leading-[1.3] text-white drop-shadow-md">
                  {post.headline}
                </h3>
                <p className="mt-3 text-[11px] text-white/90 font-medium drop-shadow-md">{post.date}</p>
              </div>
            </a>
          ))}

          <Link
            href="/impact"
            className="group relative isolate flex h-[280px] w-[280px] shrink-0 snap-start flex-col items-start justify-end rounded-xl overflow-hidden p-6 text-lg font-bold text-white transition-colors sm:h-[320px] sm:w-[320px] lg:w-[calc((100%-20px)/2)]"
          >
            <img 
              src={featuredPosts[0]?.image || ''}
              alt=""
              className="absolute inset-0 -z-20 h-full w-full object-cover blur-sm opacity-50 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-70"
            />
            <div className="absolute inset-0 -z-10 bg-[#06100e]/50 transition-colors duration-700 group-hover:bg-[#06100e]/40" />
            
            <span className="relative z-10 flex items-center gap-2">
              Explore all stories
              <ArrowUpRight size={24} className="text-[#61d9b9] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
