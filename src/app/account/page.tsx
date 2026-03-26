'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Package, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  _count: { orders: number };
  recentOrders: { id: string; orderNumber: string; total: number; status: string; createdAt: string }[];
}

export default function AccountPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', street: '', city: '', state: '', zipCode: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/account');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        const addr = data.address ? JSON.parse(data.address) : {};
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          street: addr.street || '',
          city: addr.city || '',
          state: addr.state || '',
          zipCode: addr.zipCode || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: JSON.stringify({
            street: form.street,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
          }),
        }),
      });
      if (res.ok) {
        toast.success('Profile updated successfully');
      } else {
        throw new Error();
      }
    } catch {
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    SHIPPED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface-0)' }}>
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-0)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="mb-10">
          <p className="section-label">Account Settings</p>
          <h1 className="text-3xl font-black text-white tracking-tight">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-2xl p-6 text-center sticky top-24">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/5 flex items-center justify-center mx-auto mb-5 border border-primary-500/20 shadow-[0_0_30px_rgba(255,69,0,0.1)]">
                <span className="text-3xl font-black text-primary-400">
                  {profile?.name?.[0]?.toUpperCase() || <User className="w-10 h-10 text-primary-500" />}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">{profile?.name}</h2>
              <p className="text-zinc-500 text-[13px] mt-1">{profile?.email}</p>
              
              <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-4 text-left">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Total Orders
                  </span>
                  <span className="font-bold text-white">{profile?._count.orders || 0}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <User className="w-4 h-4" /> Member Since
                  </span>
                  <span className="font-medium text-white">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Forms & Orders */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSave} className="card p-6 md:p-8">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <User className="w-4 h-4 text-primary-500" /> Personal Details
              </h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input type="text" className="input text-[13px]" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                      Email
                    </label>
                    <input type="email" className="input text-[13px] opacity-70 cursor-not-allowed" value={profile?.email || ''} disabled />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input type="text" className="input text-[13px]" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>

                <div className="pt-6 border-t border-white/[0.04] mt-6">
                  <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Street</label>
                      <input type="text" className="input text-[13px]" placeholder="123 Main St" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">City</label>
                      <input type="text" className="input text-[13px]" placeholder="New York" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">State/Province</label>
                      <input type="text" className="input text-[13px]" placeholder="NY" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">ZIP / Postal Code</label>
                      <input type="text" className="input text-[13px]" placeholder="10001" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.04] flex justify-end">
                <button type="submit" disabled={saving} className="btn btn-primary text-xs px-8">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

            {/* Recent Orders */}
            {profile?.recentOrders && profile.recentOrders.length > 0 && (
              <div className="card p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary-500" /> Recent Orders
                  </h2>
                  <Link href="/orders" className="text-[11px] font-semibold text-zinc-500 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors">
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {profile.recentOrders.map((order) => (
                    <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between glass-subtle p-4 rounded-xl hover:bg-white/[0.04] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:border-primary-500/30 transition-colors">
                          <Package className="w-5 h-5 text-zinc-500 group-hover:text-primary-400 transition-colors" />
                        </div>
                        <div>
                          <p className="font-mono text-[13px] text-zinc-200">{order.orderNumber}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[14px] text-white">{formatPrice(order.total)}</p>
                        <div className="mt-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${statusColors[order.status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
