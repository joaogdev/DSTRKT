'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const SHOP = [
  { label: 'New In',      slug: 'new-in' },
  { label: 'Tracksuits',  slug: 'tracksuits' },
  { label: 'Hoodies',     slug: 'hoodies' },
  { label: 'Tees',        slug: 'tees' },
  { label: 'Pants',       slug: 'pants' },
  { label: 'Accessories', slug: 'accessories' },
];

const HELP = [
  { label: 'Account', href: '/account' },
  { label: 'Orders',  href: '/orders' },
  { label: 'Returns', href: '#' },
  { label: 'Sizing',  href: '#' },
];

export function Footer() {
  return (
    <footer className="relative bg-[#000] border-t border-[#333] pt-20 pb-10 overflow-hidden">
      
      <div className="w-full px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-5">
            <Link href="/" className="inline-flex items-baseline mb-6">
              <span className="font-hero text-6xl text-white tracking-[-0.02em] leading-none">DSTRKT</span>
              <span className="text-[var(--accent-red)] text-4xl font-black">.</span>
            </Link>
            <p className="font-serif italic text-2xl text-[#888] leading-tight mb-8 max-w-sm">
              Premium men&apos;s streetwear. Drops every Friday. Configured for the underground.
            </p>
            <div className="flex gap-4">
              {['INSTAGRAM', 'YOUTUBE', 'TIKTOK'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="px-4 py-2 border border-[#333] text-[10px] font-condensed font-bold uppercase tracking-[0.2em] text-[#888] hover:text-white hover:border-[var(--accent-red)] transition-all duration-300 flex items-center justify-between group"
                >
                  {label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="font-display font-bold text-white text-[11px] uppercase tracking-[0.2em] mb-6">Shop Core</h4>
            <ul className="space-y-4">
              {SHOP.map((item) => (
                <li key={item.slug}>
                  <Link href={`/products?category=${item.slug}`} className="font-condensed text-[14px] uppercase tracking-wider text-[#666] hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="font-display font-bold text-white text-[11px] uppercase tracking-[0.2em] mb-6">Support</h4>
            <ul className="space-y-4">
              {HELP.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="font-condensed text-[14px] uppercase tracking-wider text-[#666] hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="font-display font-bold text-white text-[11px] uppercase tracking-[0.2em] mb-6">Manifesto</h4>
            <p className="font-mono text-[11px] text-[#555] mb-6 leading-relaxed uppercase">
              Join the syndicate. Early access to drops, archival sales, and restricted releases.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="ENTER COMM LINK" className="input bg-[#0a0a0a] text-[12px] flex-1 min-w-0" />
              <button type="submit" className="btn btn-primary text-[11px] border-l-0">Sub</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#222] pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="font-condensed text-[12px] text-[#555] uppercase tracking-widest">
            © {new Date().getFullYear()} DSTRKT SYNDICATE. ROOT ACCESS.
          </p>
          <div className="flex gap-6 font-mono text-[10px] text-[#444] uppercase">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Spec</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>

      {/* Massive Background Typography */}
      <div className="absolute top-[10%] left-0 w-[150vw] -translate-x-[10%] pointer-events-none z-0 opacity-10 select-none overflow-hidden">
        <h2 className="font-hero text-[25vw] leading-[0.7] tracking-[-0.04em] text-white whitespace-nowrap outline-text opacity-30">
          DSTRKT DSTRKT
        </h2>
      </div>
      
    </footer>
  );
}
