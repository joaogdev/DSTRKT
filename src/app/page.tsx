import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Star } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';

export const dynamic = 'force-dynamic';

const CATEGORY_IMAGES: Record<string, string> = {
  'new-in': 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80',
  'tracksuits': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
  'hoodies': 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
  'tees': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  'pants': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
  'accessories': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
};

async function getData() {
  const [categories, featured] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      include: { category: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);

  const featuredWithRating = featured.map((p: any) => ({
    ...p,
    avgRating: p.reviews.length
      ? p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length
      : 0,
  }));

  return { categories, featured: featuredWithRating };
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

export default async function Home() {
  const { categories, featured } = await getData();

  return (
    <div className="bg-black text-white min-h-screen selection:bg-[var(--accent-red)] selection:text-white">

      {/* ─── BRUTALIST HERO ──────────────────────────────────────────── */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col justify-between pt-20 border-b border-[#333]">
        
        {/* Dynamic Typography Background/Foreground */}
        <div className="absolute top-[18%] inset-x-0 w-full flex flex-col gap-0 z-0 select-none opacity-90 animate-reveal-text items-center justify-center pointer-events-none">
          <h1 className="text-hero-massive text-white whitespace-nowrap mix-blend-difference px-4" style={{ fontSize: 'clamp(3rem, 12vw, 15rem)' }}>
            STREETWEAR
          </h1>
          <h1 className="text-hero-massive text-transparent whitespace-nowrap brutalist-outline -mt-6 lg:-mt-16 px-4" style={{ fontSize: 'clamp(3rem, 12vw, 15rem)' }}>
            SYNDICATE
          </h1>
        </div>

        {/* Hero Content Overlay -> Asymmetric placement */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end pb-12 px-6 lg:px-12 pointer-events-none">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pointer-events-auto">
            
            {/* Left Block: Data/Intro */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-4 text-[10px] font-condensed font-bold uppercase tracking-[0.3em] text-[var(--accent-red)]">
                <span className="w-8 h-px bg-[var(--accent-red)]" /> 
                SS25 COLLECTION
              </div>
              <p className="font-serif italic text-2xl lg:text-3xl text-white leading-[1.1] max-w-sm">
                Configured for the underground. Heavyweight fabrics, stark contrasts.
              </p>
              <div className="flex gap-4 mt-4">
                <Link href="/products?category=new-in" className="btn btn-primary text-xs w-fit">
                  Enter Shop
                </Link>
              </div>
            </div>

            {/* Right Block: Abstract Stats / Editorial cut */}
            <div className="md:col-span-7 lg:col-span-8 flex justify-end animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-right border-r-2 border-[var(--accent-red)] pr-4">
                <p className="font-display font-bold text-[10px] uppercase tracking-[0.2em] text-[#666] mb-1">Status</p>
                <p className="font-condensed font-bold text-4xl text-white">LIVE / ACTIVE</p>
                <p className="font-mono text-[10px] text-[#444] mt-2">SYS.VER: 2.0.4.5</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INFINITE CAROUSEL MARQUEE ───────────────────────────────── */}
      <section className="border-b border-[#333] overflow-hidden bg-[var(--accent-red)] py-3 relative flex items-center select-none">
        <div className="flex w-[200%] animate-marquee pause-on-hover">
          <div className="flex w-1/2 justify-around whitespace-nowrap">
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">No rules just raw.</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">DSTRKT System</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">Worldwide Shipping</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">SS25 Collection Out Now</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">Join the Syndicate</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
          </div>
          <div className="flex w-1/2 justify-around whitespace-nowrap">
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">No rules just raw.</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">DSTRKT System</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">Worldwide Shipping</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">SS25 Collection Out Now</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black uppercase">Join the Syndicate</span>
            <span className="font-condensed font-black tracking-[0.2em] text-black">•</span>
          </div>
        </div>
      </section>

      {/* ─── FRAGMENTED CATEGORIES ────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-24 border-b border-[#333] relative overflow-hidden">
          {/* Giant background text */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full text-center opacity-5 pointer-events-none select-none">
            <span className="font-hero text-[30vw] leading-none whitespace-nowrap">DEPARTMENTS</span>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-display-heavy text-3xl lg:text-5xl">Archive</h2>
              <span className="font-mono text-xs text-[#555]">[01]</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 border-l border-t border-[#333]">
              {categories.map((cat: any, i: number) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group bg-black p-8 flex flex-col justify-between aspect-square hover:bg-[#0a0a0a] transition-colors relative overflow-hidden border-r border-b border-[#333]"
                >
                  <Image 
                    src={cat.image || CATEGORY_IMAGES[cat.slug] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-20 grayscale group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                  />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <p className="font-mono text-[10px] text-[#555] group-hover:text-[var(--accent-red)] transition-colors inline-block bg-black/60 w-max px-2 py-1">
                      NO. 0{i + 1}
                    </p>
                    <div className="bg-black/80 p-3 -mx-3 -mb-3 backdrop-blur-sm border-t border-[#333]/50">
                      <h3 className="font-display font-bold text-xl lg:text-3xl text-white uppercase group-hover:tracking-wider transition-all duration-300">
                        {cat.name}
                      </h3>
                      <p className="font-condensed text-xs text-[#666] mt-1 tracking-widest uppercase">
                        {cat._count?.products || 0} units
                      </p>
                    </div>
                  </div>
                  {/* Hover Accent */}
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[var(--accent-red)] opacity-0 group-hover:opacity-100 -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 m-4 z-20 pointer-events-none" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── EXPERIMENTAL GRID (PRODUCTS) ─────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            
            <div className="flex flex-col md:flex-row items-baseline gap-8 mb-20">
              <h2 className="text-hero-massive text-white leading-[0.75]" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}>
                LATEST
              </h2>
              <p className="font-serif italic text-2xl text-[#888] max-w-sm">
                Restricted drops. High demand, low supply.
              </p>
            </div>

            {/* Asymmetrical Masonry/Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-l border-t border-[#222]">
              {featured.map((product: any, index: number) => {
                let images: string[] = [];
                try { images = JSON.parse(product.images as string); } catch {}
                
                // Asymmetric spanning logic
                const isLarge = index === 0 || index === 3;
                const colSpan = isLarge ? 'md:col-span-8' : 'md:col-span-4';
                const heightClass = isLarge ? 'min-h-[60vh] md:min-h-[80vh]' : 'min-h-[50vh] md:min-h-[50vh]';

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className={`group flex flex-col border-r border-b border-[#222] ${colSpan}`}
                  >
                    <div className={`relative w-full flex-1 ${heightClass} bg-[#111] overflow-hidden`}>
                      {images[0] ? (
                        <ProductImage
                          src={images[0]}
                          alt={product.name}
                          className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full font-mono text-xs text-[#555]">NO.IMG</div>
                      )}
                      
                      {/* UI Overlays */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.comparePrice && (
                          <span className="badge badge-danger">SALE</span>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <span className="badge badge-zinc bg-black">LOW STOCK</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 p-6">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-display font-bold text-lg text-white uppercase leading-tight group-hover:text-[var(--accent-red)] transition-colors">
                          {product.name}
                        </h3>
                        <div className="text-right flex-shrink-0">
                          <span className="font-condensed font-bold text-xl text-white block">
                            {formatPrice(product.price)}
                          </span>
                          {product.comparePrice && (
                            <span className="font-mono text-[10px] text-[#666] line-through block w-max ml-auto text-right">
                              {formatPrice(product.comparePrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-condensed text-xs text-[#888] tracking-widest uppercase">
                        {product.category?.name} {'//'} SKU: {product.id.slice(0,6).toUpperCase()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-20 flex justify-center">
              <Link href="/products" className="btn btn-outline px-12 py-5 text-sm group">
                Access Full Database
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── EDITORIAL CUTOUT SECTION ─────────────────────────────────── */}
      <section className="py-0 relative min-h-screen flex items-center border-t border-[#333] overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          {/* We would use a real image, but fallback to a dark geometric pattern to simulate a photoshoot background */}
          <div className="w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, #111 25%, #111 50%, #000 50%, #000 75%, #111 75%, #111 100%)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-editorial-huge text-white mb-8" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
              Break the <br/>
              <span className="text-transparent brutalist-outline not-italic font-hero">SYSTEM</span>
            </h2>
            <p className="font-mono text-xs text-[#888] uppercase leading-loose max-w-md border-l-2 border-[var(--accent-red)] pl-6">
              &quot;We reject the standard. DSTRKT is built for those who operate outside the lines. High contrast, sharp edges, zero compromises.&quot;
            </p>
            <div className="mt-12">
              <Link href="/auth/register" className="btn btn-danger px-12 py-5 text-sm shadow-[8px_8px_0_0_#fff] hover:shadow-[4px_4px_0_0_#fff] hover:translate-x-1 hover:translate-y-1 transition-all">
                Join Syllabus
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-end">
            {/* Brutalist image frame / typography block */}
            <div className="relative w-full max-w-md aspect-[3/4] bg-black border border-[#333] p-8 flex flex-col justify-between group overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80"
                alt="System Editorial Archive"
                fill
                className="object-cover opacity-60 grayscale group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none"
              />
              <div className="font-condensed font-bold text-5xl text-white opacity-80 uppercase break-words leading-[0.8] mix-blend-difference relative z-10 transition-transform duration-700 group-hover:-translate-y-2">
                001<br/>002<br/>003
              </div>
              <div className="text-right mix-blend-difference relative z-10">
                <span className="font-display font-bold text-8xl text-white block opacity-50 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-2">X</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}