import Image from 'next/image';
import { CommunitySectionIntro } from './CommunitySectionIntro';

const campuses = [
  { name: 'HETC', src: '/brand/partners/hetc.png', position: 'left-[8%] top-[8%]' },
  { name: 'Heritage', src: '/brand/partners/heritage.png', position: 'right-[7%] top-[14%]' },
  { name: 'MCKV', src: '/brand/partners/mckvie.jpg', position: 'bottom-[7%] left-[14%]' },
];

export function CommunityCampusesSection() {
  return (
    <section id="campuses" className="bg-[#f7f8f2] text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:px-10 lg:py-16">
        <CommunitySectionIntro
          eyebrow="Campus network"
          title={<>Across <span className="text-emerald-700">campuses.</span></>}
          description="We’re growing a network of student communities, clubs, and partners across colleges and universities."
          href="https://www.ethshala.com/contact"
          action="Explore partnerships"
        />

        <div className="relative mx-auto flex min-h-72 w-full max-w-2xl items-center justify-center sm:min-h-80">
          <div className="pointer-events-none absolute inset-0">
            {campuses.map((campus) => (
              <Image
                key={campus.name}
                src={campus.src}
                alt={campus.name}
                width={72}
                height={72}
                className={`campus-logo-float absolute h-14 w-14 object-contain sm:h-[4.5rem] sm:w-[4.5rem] ${campus.position}`}
              />
            ))}
          </div>
          <div className="relative z-10 max-w-[17rem] rotate-[-4deg] text-center font-grotesk text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-emerald-900 sm:max-w-sm sm:text-4xl">
            <p>Different<br />campuses.<br />Same vision.</p>
            <svg
              viewBox="0 0 220 26"
              fill="none"
              aria-hidden="true"
              className="mx-auto mt-1 h-6 w-40 sm:w-52"
            >
              <path d="M5 18C57 4 151 3 214 8M57 23c31-8 71-12 112-12" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
