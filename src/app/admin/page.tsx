'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Package, DollarSign, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  revenue: number;
  recentRevenue: number;
  lowStockCount: number;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  user: { name: string; email: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setOrders(data.recentOrders);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    SHIPPED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in relative z-10">
      <div className="mb-10">
        <p className="section-label">Overview</p>
        <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 stagger-children">
        <div className="glass-strong rounded-2xl p-6 border border-white/[0.04] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Total Users</p>
              <p className="text-3xl font-black text-white">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20 group-hover:border-primary-500/40 transition-colors">
              <Users className="w-5 h-5 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-white/[0.04] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Total Orders</p>
              <p className="text-3xl font-black text-white">{stats?.totalOrders || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-white/[0.04] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-black text-white">{formatPrice(stats?.revenue || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-white/[0.04] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Low Stock</p>
              <p className="text-3xl font-black text-white">{stats?.lowStockCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40 transition-colors">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          {stats?.lowStockCount && stats.lowStockCount > 0 ? (
            <Link href="/admin/products?lowStock=true" className="text-[10px] uppercase tracking-wider font-semibold text-red-400 hover:text-red-300 transition-colors mt-3 block relative z-10">
              View Products →
            </Link>
          ) : null}
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6 border border-white/[0.04] mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold text-white uppercase tracking-widest">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[10px] font-semibold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Order</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Customer</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Status</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-zinc-500 font-semibold text-right">Total</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-zinc-500 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-[13px] text-zinc-300 group-hover:text-primary-400 transition-colors">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-[13px] font-semibold text-zinc-200">{order.user.name}</p>
                    <p className="text-[11px] text-zinc-500">{order.user.email}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[13px] font-bold text-white text-right">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-4 px-4 text-[12px] text-zinc-500 text-right">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[12px] text-zinc-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href="/admin/products" className="glass-subtle rounded-2xl p-6 border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/[0.02] rounded-xl flex items-center justify-center border border-white/[0.05] group-hover:border-primary-500/30 transition-colors">
              <Package className="w-5 h-5 text-zinc-400 group-hover:text-primary-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Manage Products</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Add, edit, or remove inventory</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/users" className="glass-subtle rounded-2xl p-6 border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/[0.02] rounded-xl flex items-center justify-center border border-white/[0.05] group-hover:border-primary-500/30 transition-colors">
              <Users className="w-5 h-5 text-zinc-400 group-hover:text-primary-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Manage Users</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">View and edit accounts</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/orders" className="glass-subtle rounded-2xl p-6 border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/[0.02] rounded-xl flex items-center justify-center border border-white/[0.05] group-hover:border-primary-500/30 transition-colors">
              <TrendingUp className="w-5 h-5 text-zinc-400 group-hover:text-primary-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">All Orders</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Track and manage fulfillment</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}