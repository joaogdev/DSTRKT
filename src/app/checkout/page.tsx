'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, MapPin, CreditCard, CheckCircle, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STEPS = ['Address', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const [address, setAddress] = useState({
    street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '',
  });
  const [payment, setPayment] = useState({
    method: 'credit_card', cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
  });

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 400 ? 0 : 15;
  const total = subtotal + tax + shipping;

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface-0)' }}>
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-zinc-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Cart is empty</h2>
          <p className="text-zinc-500 text-sm mb-8">Add products before checkout</p>
          <Link href="/products" className="btn btn-primary text-xs px-8 py-3">Browse</Link>
        </div>
      </div>
    );
  }

  async function handleFinalize() {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId || item.id, variantId: item.variantId, quantity: item.quantity })),
          shippingAddress: JSON.stringify(address),
          billingAddress: JSON.stringify(address),
          paymentMethod: payment.method,
          paymentDetails: { lastFour: payment.cardNumber.slice(-4), cardName: payment.cardName },
        }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Error processing order'); }
      const order = await res.json();
      clearCart();
      router.push(`/checkout/success?orderId=${order.id}&orderNumber=${order.orderNumber}`);
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  function canProceed() {
    if (step === 0) return address.street && address.city && address.state && address.zipCode;
    if (step === 1) {
      if (payment.method === 'credit_card') return payment.cardNumber && payment.cardName && payment.cardExpiry && payment.cardCvv;
      return true;
    }
    return true;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-0)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <button onClick={() => router.back()} className="btn btn-ghost text-[11px] mb-8 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-12">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-xs font-bold transition-all duration-500 ${
                i <= step
                  ? 'bg-primary-500 text-white shadow-[0_0_20px_rgba(255,69,0,0.3)]'
                  : 'glass text-zinc-500'
              }`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${i <= step ? 'text-white' : 'text-zinc-600'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-0.5 mx-3 rounded-full transition-colors duration-500 ${i < step ? 'bg-primary-500' : 'bg-zinc-800'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 0 && (
              <div className="card p-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Street</label>
                    <input type="text" className="input text-[13px]" placeholder="Rua das Flores" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Number</label>
                    <input type="text" className="input text-[13px]" placeholder="123" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Complement</label>
                    <input type="text" className="input text-[13px]" placeholder="Apto 4B" value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Neighborhood</label>
                    <input type="text" className="input text-[13px]" placeholder="Centro" value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">City</label>
                    <input type="text" className="input text-[13px]" placeholder="São Paulo" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">State</label>
                    <select className="input text-[13px] bg-black" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                      <option className="bg-black text-white" value="">Select</option>
                      {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((s) => (
                        <option className="bg-black text-white" key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">ZIP Code</label>
                    <input type="text" className="input text-[13px]" placeholder="01234-567" maxLength={9} value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="card p-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary-500" /> Payment
                </h2>
                <div className="space-y-3 mb-6">
                  {[
                    { value: 'credit_card', label: 'Credit Card', icon: '💳' },
                    { value: 'pix', label: 'PIX', icon: '⚡' },
                    { value: 'boleto', label: 'Boleto', icon: '📄' },
                  ].map((method) => (
                    <label key={method.value} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      payment.method === method.value
                        ? 'glass border-primary-500/30 shadow-[0_0_20px_rgba(255,69,0,0.08)]'
                        : 'glass-subtle hover:border-zinc-600'
                    }`}>
                      <input type="radio" name="paymentMethod" value={method.value} checked={payment.method === method.value} onChange={() => setPayment({ ...payment, method: method.value })} className="accent-primary-500" />
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-[13px] font-medium text-zinc-300">{method.label}</span>
                    </label>
                  ))}
                </div>
                {payment.method === 'credit_card' && (
                  <div className="space-y-4 border-t border-white/[0.04] pt-6">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Card Number</label>
                      <input type="text" className="input text-[13px] font-mono" placeholder="0000 0000 0000 0000" maxLength={19} value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Cardholder</label>
                      <input type="text" className="input text-[13px]" placeholder="JOHN DOE" value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Expiry</label>
                        <input type="text" className="input text-[13px] font-mono" placeholder="MM/YY" maxLength={5} value={payment.cardExpiry} onChange={(e) => setPayment({ ...payment, cardExpiry: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">CVV</label>
                        <input type="text" className="input text-[13px] font-mono" placeholder="123" maxLength={4} value={payment.cardCvv} onChange={(e) => setPayment({ ...payment, cardCvv: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}
                {payment.method === 'pix' && (
                  <div className="border-t border-white/[0.04] pt-6 text-center">
                    <div className="glass rounded-2xl p-8 inline-block mb-4">
                      <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center text-5xl">📱</div>
                    </div>
                    <p className="text-[12px] text-zinc-500">PIX QR code will be generated after order confirmation</p>
                  </div>
                )}
                {payment.method === 'boleto' && (
                  <div className="border-t border-white/[0.04] pt-6 text-center">
                    <p className="text-[12px] text-zinc-500">Boleto will be generated after confirmation — valid for 3 business days.</p>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="card p-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-500" /> Confirm Order
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">📍 Shipping</h3>
                    <div className="glass-subtle rounded-xl p-4 text-[13px] text-zinc-400 space-y-1">
                      <p>{address.street}, {address.number} {address.complement && `— ${address.complement}`}</p>
                      <p>{address.neighborhood && `${address.neighborhood}, `}{address.city} — {address.state}</p>
                      <p>ZIP: {address.zipCode}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">💳 Payment</h3>
                    <div className="glass-subtle rounded-xl p-4 text-[13px] text-zinc-400">
                      {payment.method === 'credit_card' && <p>Credit card •••• {payment.cardNumber.slice(-4)}</p>}
                      {payment.method === 'pix' && <p>PIX — instant payment</p>}
                      {payment.method === 'boleto' && <p>Boleto — 3 day validity</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">📦 Items ({getItemCount()})</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center glass-subtle rounded-xl p-3 text-[13px]">
                          <div>
                            <p className="font-medium text-zinc-200">{item.name}</p>
                            <p className="text-zinc-600 text-[11px]">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-2xl p-6 sticky top-32">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Summary</h2>
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal ({getItemCount()} items)</span>
                  <span className="text-zinc-300">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-400' : 'text-zinc-300'}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tax (10%)</span>
                  <span className="text-zinc-300">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-white/[0.06] pt-3 mt-3">
                  <div className="flex justify-between text-lg font-black">
                    <span className="text-white">Total</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="btn btn-outline flex-1 text-[10px]">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}
                {step < 2 ? (
                  <button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="btn btn-primary flex-1 text-[10px] disabled:opacity-30 disabled:cursor-not-allowed">
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button onClick={handleFinalize} disabled={loading} className="btn btn-primary flex-1 text-[10px]">
                    {loading ? 'Processing...' : 'Confirm Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
