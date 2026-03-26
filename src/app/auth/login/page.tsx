'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const callbackUrl =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('callbackUrl') || '/'
        : '/';

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error || !result?.ok) {
        toast.error('Invalid credentials');
        setLoading(false);
        return;
      }

      toast.success('Welcome back!');
      window.location.assign(result.url || callbackUrl);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Unable to sign in right now');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--surface-0)' }}>
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(255,69,0,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-baseline mb-6">
            <span className="text-3xl font-black text-white tracking-tighter">DSTRKT</span>
            <span className="text-primary-500 text-3xl font-black">.</span>
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome back</h2>
          <p className="mt-2 text-[13px] text-zinc-500">
            Don&apos;t have an account? <Link href="/auth/register" className="text-primary-400 hover:text-primary-300 transition-colors">Create one</Link>
          </p>
        </div>

        {/* Form */}
        <div className="glass-strong rounded-2xl p-8 glow-ring">
          <form method="POST" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input id="email" name="email" type="email" required className="input text-[13px]" placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input id="password" name="password" type="password" required className="input text-[13px]" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 text-xs mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
