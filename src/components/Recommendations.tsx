'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string;
  category: { name: string };
  avgRating: number;
  reviewCount: number;
}

interface Props {
  title?: string;
  productId?: string;
  categoryId?: string;
  limit?: number;
}

export function Recommendations({ title = 'Recommended', productId, categoryId, limit = 8 }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_recs() {
      const params = new URLSearchParams();
      if (productId) params.set('productId', productId);
      if (categoryId) params.set('categoryId', categoryId);
      params.set('limit', limit.toString());

      try {
        const res = await fetch(`/api/recommendations?${params}`);
        if (res.ok) setProducts(await res.json());
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetch_recs();
  }, [productId, categoryId, limit]);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-black text-white mb-6 tracking-tight">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="h-56 animate-shimmer" />
              <div className="p-4 space-y-3">
                <div className="h-2 w-16 animate-shimmer rounded" />
                <div className="h-3 w-3/4 animate-shimmer rounded" />
                <div className="h-4 w-1/2 animate-shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
        <Link href="/products" className="text-zinc-500 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors duration-300 uppercase tracking-[0.15em] group">
          View all <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {products.map((product) => {
          let images: string[] = [];
          try { images = JSON.parse(product.images); } catch { /* ignore */ }

          return (
            <Link key={product.id} href={`/products/${product.id}`} className="group card-hover">
              <div className="relative h-56 overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                {images[0] ? (
                  <Image
                    src={images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-700 text-xs">No image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {product.comparePrice && (
                  <span className="absolute top-3 left-3 badge badge-primary text-[9px]">
                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-zinc-600 text-[10px] uppercase tracking-[0.15em] mb-1.5">{product.category?.name}</p>
                <h3 className="font-semibold text-[13px] text-zinc-200 line-clamp-2 group-hover:text-white transition-colors duration-300 leading-snug">{product.name}</h3>
                {product.avgRating > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] text-zinc-500">{product.avgRating.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span className="font-bold text-white text-[15px]">{formatPrice(product.price)}</span>
                  {product.comparePrice && (
                    <span className="text-[11px] text-zinc-600 line-through">{formatPrice(product.comparePrice)}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
