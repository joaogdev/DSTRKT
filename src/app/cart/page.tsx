'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center border-t border-[#333]">
        <div className="text-center animate-fade-in p-12 border border-[#333] bg-[#050505] max-w-lg w-full">
          <ShoppingBag className="w-12 h-12 text-[#222] mx-auto mb-8" />
          <h2 className="font-display font-bold text-3xl text-white mb-4 uppercase tracking-widest">Arsenal Empty</h2>
          <p className="font-mono text-xs text-[#666] mb-12 uppercase tracking-widest">No units acquired yet.</p>
          <Link href="/products" className="btn btn-primary w-full">Access Database</Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 400 ? 0 : 15;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[var(--accent-red)] selection:text-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Brutalist Header */}
        <div className="mb-16 border-b-2 border-white pb-8 relative overflow-hidden animate-fade-in">
          <p className="font-mono text-[10px] text-[var(--accent-red)] uppercase tracking-[0.4em] mb-4">
            Secured Loadout
          </p>
          <h1 className="text-display-heavy text-5xl lg:text-7xl xl:text-8xl">
            ARSENAL
          </h1>
          <div className="absolute right-0 top-0 font-hero text-[15vw] leading-none text-[#111] -z-10 select-none pointer-events-none">
            CART
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-px bg-[#333] border border-[#333]">
            {items.map((item) => (
              <div key={item.id} className="bg-black p-4 sm:p-6 flex flex-col sm:flex-row gap-6 group hover:bg-[#050505] transition-colors relative">
                
                {/* Image */}
                <div className="relative w-24 h-32 sm:w-32 sm:h-40 bg-[#111] border border-[#222] flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover grayscale" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#333] text-[10px] font-mono">NO.IMG</div>
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-display font-bold text-lg sm:text-xl uppercase leading-tight line-clamp-2">{item.name}</h3>
                      <button 
                        onClick={() => { removeItem(item.productId || item.id, item.variantId); toast.success('UNIT DISCARDED'); }} 
                        className="text-[#555] hover:text-[var(--accent-red)] transition-colors p-2 -mr-2 -mt-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="font-mono text-[10px] text-[#666] mt-2">SKU: {item.sku}</p>
                  </div>
                  
                  <div className="flex items-end justify-between mt-6">
                    <p className="font-condensed font-bold text-2xl">{formatPrice(item.price)}</p>
                    
                    {/* Qty Controls */}
                    <div className="flex border border-[#333] bg-[#0a0a0a]">
                      <button 
                        onClick={() => updateQuantity(item.productId || item.id, Math.max(1, item.quantity - 1), item.variantId)} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-black transition-colors border-r border-[#333]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-12 h-10 flex items-center justify-center font-condensed font-bold text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.productId || item.id, item.quantity + 1, item.variantId)} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-black transition-colors border-l border-[#333]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="border border-[#333] bg-black sticky top-32 p-8 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 border-l border-b border-[#333] bg-[#050505] -translate-y-8 translate-x-8 rotate-45" />

              <h2 className="font-display font-bold text-xl uppercase tracking-widest mb-8 text-[var(--accent-red)]">
                Manifest
              </h2>
              
              <div className="space-y-4 font-mono text-[11px] uppercase tracking-wider text-[#888]">
                <div className="flex justify-between border-b border-[#222] pb-4">
                  <span>Subtotal ({getItemCount()} units)</span>
                  <span className="text-white font-condensed text-base">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between border-b border-[#222] pb-4">
                  <span>Transport</span>
                  <span className={shipping === 0 ? 'text-[var(--accent-red)] font-bold' : 'text-white'}>
                    {shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#222] pb-4">
                  <span>Tariffs (10%)</span>
                  <span className="text-white font-condensed text-base">{formatPrice(tax)}</span>
                </div>
                
                <div className="pt-6">
                  <div className="flex justify-between items-end">
                    <span className="text-white">Final Authorization</span>
                    <span className="font-condensed font-bold text-4xl text-white">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-primary w-full mt-10 py-5 text-sm group flex justify-between">
                <span>Engage Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              {shipping > 0 && (
                <p className="font-serif italic text-xs text-[#555] text-center mt-6">
                  Complimentary transport unlocked at {formatPrice(400)}.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}