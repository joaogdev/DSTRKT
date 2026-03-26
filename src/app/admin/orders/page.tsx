'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  user: { name: string; email: string };
  createdAt: string;
  items: { product: { name: string }; quantity: number }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);

    try {
      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function updateStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        toast.success('Status atualizado');
        fetchOrders();
      } else {
        throw new Error('Erro');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    SHIPPED: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    DELIVERED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Pendente' },
    { value: 'PROCESSING', label: 'Processando' },
    { value: 'SHIPPED', label: 'Enviado' },
    { value: 'DELIVERED', label: 'Entregue' },
    { value: 'CANCELLED', label: 'Cancelado' },
  ];

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white font-display uppercase tracking-wider mb-8">Gerenciar Pedidos</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors pl-10"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors w-full md:w-48"
          >
            <option className="bg-[#111] text-white" value="">Todos os status</option>
            {statusOptions.map((opt) => (
              <option className="bg-[#111] text-white" key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#888] font-mono text-xs uppercase">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#888] font-mono text-xs uppercase">
                      {order.user.name} • {order.user.email}
                    </p>
                    <p className="text-sm text-[#888] font-mono text-xs uppercase mt-1">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')} • {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">{formatPrice(order.total)}</p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors w-40"
                    >
                      {statusOptions.map((opt) => (
                        <option className="bg-[#111] text-white" key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}