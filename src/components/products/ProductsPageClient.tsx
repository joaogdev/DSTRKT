'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ProductImage } from '@/components/ui/ProductImage';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string | string[];
  category: { id: string; name: string };
  stock: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface ProductsPageClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialSearch: string;
  initialCategory: string;
  initialSort: string;
  initialOrder: string;
  initialPage: number;
  initialTotalPages: number;
}

export function ProductsPageClient({
  initialProducts,
  initialCategories,
  initialSearch,
  initialCategory,
  initialSort,
  initialOrder,
  initialPage,
  initialTotalPages,
}: ProductsPageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const isFirstFetch = useRef(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    if (isFirstFetch.current) {
      isFirstFetch.current = false;
      return;
    }

    async function fetchProducts() {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (category) params.set('category', category);
      params.set('sort', sort);
      params.set('order', order);
      params.set('page', page.toString());
      params.set('limit', '16');

      try {
        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [debouncedSearch, category, sort, order, page]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[var(--accent-red)] selection:text-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 border-b-2 border-white pb-8 animate-fade-in relative overflow-hidden">
          <p className="font-mono text-[10px] text-[var(--accent-red)] uppercase tracking-[0.4em] mb-4">
            System Database
          </p>
          <h1 className="text-display-heavy text-5xl lg:text-7xl xl:text-8xl w-full break-words">
            {category
              ? categories.find((item) => item.slug === category)?.name || 'ALL UNITS'
              : 'ALL UNITS'}
          </h1>
          <div className="absolute right-0 top-0 font-hero text-[15vw] leading-none text-[#111] -z-10 select-none pointer-events-none">
            INDEX
          </div>
        </div>

        <div className="border border-[#333] bg-[#050505] p-6 mb-16 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
              <input
                type="text"
                placeholder="QUERY DATABASE..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="input pl-12 bg-black w-full"
              />
            </div>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              className="input md:w-56 bg-black"
            >
              <option value="">ALL DEPARTMENTS</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name} ({item._count.products})
                </option>
              ))}
            </select>
            <select
              value={`${sort}-${order}`}
              onChange={(event) => {
                const [nextSort, nextOrder] = event.target.value.split('-');
                setSort(nextSort);
                setOrder(nextOrder);
                setPage(1);
              }}
              className="input md:w-56 bg-black"
            >
              <option value="createdAt-desc">LATEST DROP</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="name-asc">ALPHABETICAL</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#333] border border-[#333]">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-black p-4 flex flex-col gap-4">
                <div className="h-80 animate-shimmer" />
                <div className="h-4 w-1/2 animate-shimmer" />
                <div className="h-6 w-3/4 animate-shimmer" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 border border-[#333] animate-fade-in bg-[#050505]">
            <SlidersHorizontal className="w-16 h-16 text-[#333] mx-auto mb-6" />
            <p className="font-display font-bold text-2xl uppercase tracking-widest text-[#aaa]">0 UNITS FOUND</p>
            <p className="font-mono text-xs text-[#666] mt-4">AMEND QUERY PARAMETERS</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-[#222] stagger-children">
              {products.map((product) => {
                let images: string[] = [];
                try {
                  images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                } catch {
                  images = [];
                }

                return (
                  <Link key={product.id} href={`/products/${product.id}`} className="group bg-black relative flex flex-col h-full border-r border-b border-[#222]">
                    <div className="relative h-[28rem] overflow-hidden bg-[#000]">
                      {images?.[0] ? (
                        <ProductImage
                          src={images[0]}
                          alt={product.name}
                          className="object-cover grayscale-[15%] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full font-mono text-xs text-[#333]">NO.IMG</div>
                      )}

                      {product.comparePrice && (
                        <span className="absolute top-4 left-4 badge badge-danger">SALE</span>
                      )}
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-10">
                          <span className="font-hero text-6xl text-[var(--accent-red)] -rotate-12 outline-text opacity-80">SOLD OUT</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-grow bg-black group-hover:bg-[#0a0a0a] transition-colors border-t border-[#222]">
                      <div>
                        <p className="font-mono text-[10px] text-[#555] mb-2">
                          DEPT: {product.category?.name || 'UNKNOWN'}
                        </p>
                        <h3 className="font-display font-bold text-lg leading-[1.1] uppercase tracking-wide group-hover:text-[var(--accent-red)] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                      <div className="mt-6 flex items-end justify-between">
                        <span className="font-condensed font-bold text-2xl text-white">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                          <span className="font-mono text-xs text-[#666] line-through mb-1">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border border-[#333] mt-16 p-2 bg-[#050505]">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-6 py-4 font-condensed font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                >
                  Prev
                </button>
                <span className="font-mono text-[11px] text-[#888] tracking-[0.2em] px-4">
                  PAGE {page} OF {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-4 font-condensed font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
