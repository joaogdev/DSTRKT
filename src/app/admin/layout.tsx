'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, FileText, ArrowLeft, Hexagon } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/logs', label: 'Logs', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--surface-0)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col border-r border-white/[0.04] bg-black/20 backdrop-blur-md relative z-20">
        <div className="p-6 border-b border-white/[0.04]">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center border border-primary-500/30 group-hover:border-primary-500 transition-colors">
              <Hexagon className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-widest uppercase">Admin</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">DSTRKT System</p>
            </div>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_15px_rgba(255,69,0,0.05)]'
                    : 'text-zinc-500 hover:text-white hover:bg-white/[0.02] border border-transparent hover:border-white/[0.05]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-500' : 'text-zinc-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/[0.04]">
          <Link href="/" className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px] font-semibold text-zinc-500 hover:text-white hover:bg-white/[0.02] border border-transparent hover:border-white/[0.05] transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-white/[0.06] z-50">
        <div className="flex justify-around py-3 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1.5 p-2 text-[10px] font-semibold tracking-wide transition-colors ${
                  isActive ? 'text-primary-400' : 'text-zinc-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-zinc-600'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 lg:pb-0 pb-24 overflow-x-hidden relative h-screen overflow-y-auto">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
        {children}
      </main>
    </div>
  );
}
