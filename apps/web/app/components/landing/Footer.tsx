'use client';

import Link from 'next/link';
import { footerLinks } from '../../lib/landing-data';
import { Heart, ArrowRight } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemedLogoGif } from '@/app/components/ThemedLogoGif';


export function Footer() {
  return (
    <footer className="bg-background border-t border-border font-sans transition-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-none">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Column 1: Brand & Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative bottom-1.5" >
                <ThemedLogoGif
                  alt="ETHShala"
                  width={45}
                  height={45}
                  unoptimized
                />
              </div>
              <Logo />
            </div>
            
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mb-8">
              Build With <Heart size={14} className="text-emerald-500 fill-emerald-500/20" /> by Avarch
            </p> 
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-5">LINKS</h4>
            <ul className="space-y-3.5">
              {footerLinks.important.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-muted-foreground text-sm hover:text-emerald-400 transition-colors flex items-center gap-2">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div className="flex flex-col items-start md:items-start">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-5">FOLLOW US</h4>
            <ul className="flex items-center gap-3.5">
              {footerLinks.followUs.map((l) => {
                return (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={l.label}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground shadow-sm transform-none transition-[border-color,color,background-color,box-shadow] duration-200 hover:border-emerald-400/60 hover:text-emerald-400 hover:bg-accent dark:bg-[#111111] dark:text-white dark:hover:bg-[#131313]"
                    >
                      {l.label === 'X' && (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {l.label === 'LinkedIn' && (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {l.label === 'Discord' && (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                          <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.403.768-.553 1.11a18.27 18.27 0 0 0-5.29 0A11.64 11.64 0 0 0 9.49 3a19.736 19.736 0 0 0-4.435 1.371C2.249 8.57 1.484 12.663 1.866 16.699a19.9 19.9 0 0 0 5.993 3.028c.48-.654.908-1.346 1.276-2.07a12.93 12.93 0 0 1-2.008-.964c.169-.124.334-.253.494-.386 3.874 1.82 8.08 1.82 11.908 0 .162.133.327.262.496.386a12.89 12.89 0 0 1-2.011.965c.368.723.796 1.415 1.276 2.068a19.86 19.86 0 0 0 5.996-3.028c.448-4.678-.765-8.734-3.969-12.329ZM8.02 14.247c-1.182 0-2.151-1.085-2.151-2.419 0-1.333.95-2.418 2.151-2.418 1.211 0 2.17 1.094 2.151 2.418 0 1.334-.95 2.419-2.151 2.419Zm7.96 0c-1.182 0-2.151-1.085-2.151-2.419 0-1.333.95-2.418 2.151-2.418 1.211 0 2.17 1.094 2.151 2.418 0 1.334-.94 2.419-2.151 2.419Z" />
                        </svg>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">EMAIL:</p>
              <Link
                href="mailto:contact@ethshala.com"
                className="inline-flex items-center gap-2 text-[clamp(0.9rem,1.1vw,1.35rem)] font-medium text-primary hover:underline leading-none tracking-[-0.03em] transition-colors"
              >
                contact@ethshala.com
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
