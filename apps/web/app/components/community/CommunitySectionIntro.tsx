import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 rounded-md border border-current/30 px-4 py-2.5 text-xs font-semibold transition-colors hover:border-emerald-500 hover:bg-emerald-500 hover:text-slate-950"
    >
      {children}
      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
    </a>
  );
}

export function CommunitySectionIntro({
  eyebrow,
  title,
  description,
  href,
  action,
  actionContent,
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  href?: string;
  action?: string;
  actionContent?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={`max-w-sm ${dark ? 'text-white' : 'text-slate-900'}`}>
      <p className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] ${dark ? 'text-emerald-300' : 'text-slate-500'}`}>
        {eyebrow}
      </p>
      <h2 className="font-grotesk text-3xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-4xl">
        {title}
      </h2>
      <p className={`mt-4 max-w-xs text-sm leading-6 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
        {description}
      </p>
      {(actionContent || (href && action)) && (
        <div className="mt-6">
          {actionContent ?? (href && action ? <SectionLink href={href}>{action}</SectionLink> : null)}
        </div>
      )}
    </div>
  );
}
