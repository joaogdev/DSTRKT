'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, User, LogOut, Package, ChevronDown, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';

const handleSignOut = () => {
  useCartStore.getState().clearCart();
  signOut({ callbackUrl: '/' });
};

const NAV_LINKS = [
  { label: 'HOME',        href: '/' },
  { label: 'MARKETPLACE', href: '/products' },
  { label: 'ARCHIVE',     href: '/archive' },
];

export function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black border-b border-[#333]'
          : 'bg-transparent border-b border-white/[0.1]'
      }`}
    >
      {/* Promo bar */}
      <div className="bg-[var(--accent-red)] text-white text-center text-[11px] py-1.5 font-condensed font-bold tracking-[0.3em] uppercase">
        Free Shipping Orders Over R$400 — New Drop Every Friday
      </div>

      <div className="w-full px-6 lg:px-12 border-b border-[#222]">
        <div className="flex justify-between items-center h-20 relative">

          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1 group relative overflow-hidden">
            <span className="font-hero text-4xl text-white tracking-[-0.02em] leading-none transition-transform duration-500 group-hover:translate-x-1">
              DSTRKT
            </span>
            <span className="font-hero text-4xl text-[var(--accent-red)] leading-none -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 absolute left-0 top-0">
              DSTRKT
            </span>
            <span className="text-[var(--accent-red)] text-3xl font-black">.</span>
          </Link>

          {/* Desktop nav - Centered */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-[13px] font-display font-bold uppercase tracking-[0.1em] text-[#888] hover:text-white transition-colors duration-300 group overflow-hidden"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent-red)] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </Link>
            ))}
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 border border-transparent hover:border-[#333] transition-colors duration-300 group">
              <ShoppingCart className="w-5 h-5 text-[#888] group-hover:text-white transition-colors duration-300" />
              {isMounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-condensed font-bold text-white bg-[var(--accent-red)]">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 border border-transparent hover:border-[#333] transition-colors duration-300">
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center">
                    <span className="text-xs font-condensed font-bold">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#888] transition-transform duration-300 group-hover:rotate-180" />
                </button>

                {/* Dropdown - Brutalist */}
                <div className="absolute right-0 mt-0 w-64 bg-black border border-[#333] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-5 py-4 border-b border-[#333] bg-[#0a0a0a]">
                    <p className="font-condensed font-bold text-white text-sm uppercase tracking-wider">{session.user?.name}</p>
                    <p className="text-[11px] text-[#888] mt-1 font-mono">{session.user?.email}</p>
                  </div>
                  <div className="flex flex-col">
                    <Link href="/account" className="flex items-center gap-3 px-5 py-3 text-[12px] font-display font-semibold uppercase tracking-wider text-[#888] hover:text-white hover:bg-[#111] border-b border-[#222] transition-colors">
                      <User className="w-4 h-4" /> My Account
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 px-5 py-3 text-[12px] font-display font-semibold uppercase tracking-wider text-[#888] hover:text-white hover:bg-[#111] border-b border-[#222] transition-colors">
                      <Package className="w-4 h-4" /> Orders
                    </Link>
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-3 px-5 py-3 text-[12px] font-display font-semibold uppercase tracking-wider text-[var(--accent-red)] hover:bg-[#111] border-b border-[#222] transition-colors">
                        <span className="text-sm">☢️</span> System Admin
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full text-left px-5 py-3 text-[12px] font-display font-semibold uppercase tracking-wider text-[#555] hover:text-[var(--accent-red)] hover:bg-[#111] transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Disconnect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="btn btn-primary text-[11px] py-2 px-6">
                Login
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 border border-transparent hover:border-[#333] transition-colors duration-300 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Brutalist Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black border-b border-[#333] animate-fade-in absolute w-full left-0 top-full">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-4 px-6 border-b border-[#222] text-[#888] hover:text-white hover:bg-[#111] text-sm font-display font-bold uppercase tracking-[0.2em] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <div className="bg-[#0a0a0a]">
                <Link href="/orders" className="block py-4 px-6 border-b border-[#222] text-[#555] font-condensed uppercase tracking-wider hover:text-white" onClick={() => setIsMenuOpen(false)}>Order History</Link>
                <Link href="/account" className="block py-4 px-6 text-[#555] font-condensed uppercase tracking-wider hover:text-white" onClick={() => setIsMenuOpen(false)}>Account Settings</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}