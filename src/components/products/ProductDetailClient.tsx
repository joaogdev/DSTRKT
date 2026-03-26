'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, ArrowLeft, Check, ArrowDownRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Recommendations } from '@/components/Recommendations';

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    sku: string;
    stock: number;
    categoryId: string;
    category: { id: string; name: string };
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      image: product.images[0],
      sku: product.sku,
    });
    setAdded(true);
    toast.success(`${product.name} ADDED TO SYNDICATE CART`);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[var(--accent-red)] selection:text-white pb-24">
      <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-80px)] border-b border-[#333]">
        <div className="w-full lg:w-[70%] relative border-r border-[#333] bg-[#050505]">
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-20 font-condensed font-bold text-xs uppercase tracking-[0.2em] text-[#888] hover:text-white flex items-center gap-2 transition-colors bg-black px-4 py-2 border border-[#333]"
          >
            <ArrowLeft className="w-3 h-3" /> RETURN
          </button>

          <div className="sticky top-20 w-full h-[60vh] lg:h-[calc(100vh-80px)] p-6 lg:p-12 flex items-center justify-center">
            {product.images[0] ? (
              <div className="relative w-full h-full">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain filter grayscale-[10%] contrast-[1.1]"
                  priority
                />
              </div>
            ) : (
              <div className="font-mono text-[10vw] text-[#222]">NO.IMG</div>
            )}

            <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2">
              {discount > 0 && <span className="badge badge-danger">SALE -{discount}%</span>}
              <span className="font-mono text-[10px] text-[#555]">SKU: {product.sku}</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[30%] flex flex-col bg-[#0a0a0a]">
          <div className="p-8 lg:p-12 flex-1 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <p className="font-condensed font-bold text-[10px] uppercase tracking-[0.3em] text-[var(--accent-red)] border border-[var(--accent-red)] px-2 py-0.5">
                {product.category?.name}
              </p>
            </div>

            <h1 className="font-display font-bold text-4xl lg:text-5xl uppercase leading-[0.85] tracking-tight mb-8">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 border-b border-[#333] pb-6 mb-8">
              <span className="font-condensed font-bold text-4xl">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="font-mono text-sm text-[#666] line-through pb-1">{formatPrice(product.comparePrice)}</span>
              )}
            </div>

            <p className="font-serif italic text-lg text-[#aaa] leading-relaxed mb-12">
              {product.description}
            </p>

            <div className="border border-[#333] bg-black mb-10">
              <div className="flex border-b border-[#333]">
                <div className="w-1/3 p-4 border-r border-[#333] font-mono text-[10px] text-[#666] uppercase">Spec</div>
                <div className="w-2/3 p-4 font-condensed text-sm uppercase text-white tracking-widest">Heavyweight / Oversized</div>
              </div>
              <div className="flex border-b border-[#333]">
                <div className="w-1/3 p-4 border-r border-[#333] font-mono text-[10px] text-[#666] uppercase">Status</div>
                <div className={`w-2/3 p-4 font-condensed font-bold text-sm uppercase tracking-widest ${product.stock > 0 ? 'text-[#fff]' : 'text-[var(--accent-red)]'}`}>
                  {product.stock > 0 ? `DEPLOYED (${product.stock})` : 'RESTRICTED'}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-stretch h-14 border border-[#333] bg-black">
                <div className="flex items-center justify-center px-6 border-r border-[#333] font-mono text-[10px] text-[#666]">
                  QTY
                </div>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 flex items-center justify-center hover:bg-[#111] transition-colors border-r border-[#333] text-[#888] hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 flex items-center justify-center font-condensed font-bold text-xl">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-14 flex items-center justify-center hover:bg-[#111] transition-colors border-l border-[#333] text-[#888] hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`h-16 w-full font-display font-bold text-sm uppercase flex items-center justify-between px-8 transition-all duration-300 border ${
                  added
                    ? 'bg-white text-black border-white'
                    : 'bg-[var(--accent-red)] text-white border-[var(--accent-red)] hover:bg-[#000] hover:text-[var(--accent-red)]'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <span>{added ? 'ACQUIRED' : 'ADD TO ARSENAL'}</span>
                {added ? <Check className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 px-6 lg:px-12">
        <Recommendations title="SIMILAR SPECS" productId={product.id} categoryId={product.categoryId} limit={4} />
      </div>
    </div>
  );
}
