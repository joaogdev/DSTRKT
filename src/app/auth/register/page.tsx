'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error creating account');
      toast.success('Account created!');
      router.push('/auth/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--surface-0)' }}>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(255,69,0,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-baseline mb-6">
            <span className="text-3xl font-black text-white tracking-tighter">DSTRKT</span>
            <span className="text-primary-500 text-3xl font-black">.</span>
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
          <p className="mt-2 text-[13px] text-zinc-500">
            Already registered? <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 transition-colors">Sign in</Link>
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-8 glow-ring">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input id="name" name="name" type="text" required className="input text-[13px]" placeholder="Jordan Silva" />
            </div>
            <div>
              <label htmlFor="email" className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Email</label>
              <input id="email" name="email" type="email" required className="input text-[13px]" placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Password</label>
              <input id="password" name="password" type="password" required minLength={6} className="input text-[13px]" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 text-xs mt-2">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}