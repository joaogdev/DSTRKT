'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    total: number;
    product: { images: string };
  }[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  PROCESSING: { label: 'Processando', color: 'text-blue-600 bg-blue-100', icon: Package },
  SHIPPED: { label: 'Enviado', color: 'text-purple-600 bg-purple-100', icon: Truck },
  DELIVERED: { label: 'Entregue', color: 'text-green-600 bg-green-100', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'text-red-600 bg-red-100', icon: XCircle },
};

const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#888] font-mono text-xs uppercase mb-4">Pedido não encontrado</p>
          <button onClick={() => router.back()} className="btn btn-outline">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(order.status);
  let parsedAddress: any = {};
  try { parsedAddress = JSON.parse(order.shippingAddress); } catch { parsedAddress = { raw: order.shippingAddress }; }

  const paymentLabels: Record<string, string> = {
    credit_card: 'Cartão de Crédito',
    pix: 'PIX',
    boleto: 'Boleto Bancário',
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="btn btn-outline mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
              <p className="text-sm text-[#888] font-mono text-xs uppercase mt-1">
                Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig[order.status]?.color || 'bg-[#222] border border-[#333]'}`}>
              {statusConfig[order.status]?.label || order.status}
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        {order.status !== 'CANCELLED' && (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold mb-6">Acompanhamento</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#333]"></div>
              <div className="absolute top-5 left-0 h-0.5 bg-primary-600 transition-all" style={{ width: `${Math.max(0, (currentStatusIndex / (statusOrder.length - 1)) * 100)}%` }}></div>
              {statusOrder.map((status, i) => {
                const config = statusConfig[status];
                const Icon = config.icon;
                const isActive = i <= currentStatusIndex;
                return (
                  <div key={status} className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-primary-600 text-white' : 'bg-[#333] text-[#666]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary-600' : 'text-[#666]'}`}>
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Itens do Pedido</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-black">
                    <div className="w-16 h-16 bg-[#333] rounded-lg flex items-center justify-center text-[#666] flex-shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-[#888] font-mono text-xs uppercase">SKU: {item.sku} • Qtd: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.total)}</p>
                      <p className="text-sm text-[#888] font-mono text-xs uppercase">{formatPrice(item.price)} un.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Resumo</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Frete</span>
                  <span>{order.shipping === 0 ? 'Grátis' : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Impostos</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Endereço
              </h2>
              <div className="text-sm text-[#aaa]">
                {parsedAddress.raw ? (
                  <p>{parsedAddress.raw}</p>
                ) : (
                  <>
                    <p>{parsedAddress.street}{parsedAddress.number && `, ${parsedAddress.number}`}</p>
                    {parsedAddress.neighborhood && <p>{parsedAddress.neighborhood}</p>}
                    <p>{parsedAddress.city} - {parsedAddress.state}</p>
                    {parsedAddress.zipCode && <p>CEP: {parsedAddress.zipCode}</p>}
                  </>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Pagamento
              </h2>
              <p className="text-sm text-[#aaa]">{paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
              {order.paymentId && <p className="text-xs text-[#666] mt-1">ID: {order.paymentId}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
