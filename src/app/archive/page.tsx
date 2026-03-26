import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ARCHIVE_ITEMS = [
  { year: '2023', title: 'SEASON 01: ORIGINS', img: '/images/archive/origins.png', desc: 'The foundation. Raw materials, unfinished hems, industrial aesthetics.' },
  { year: '2024', title: 'SEASON 02: VOID', img: '/images/archive/void.png', desc: 'Complete darkness. Experimenting with silhouettes and negative space.' },
  { year: '2025', title: 'COLLAB // UNDERGROUND', img: '/images/archive/underground.png', desc: 'Limited run. Tactical gear integrated with everyday streetwear.' },
];

export default function ArchivePage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      
      {/* Header marquees */}
      <div className="border-y border-[#333] overflow-hidden bg-[var(--accent-red)] py-2 mb-16">
        <div className="flex gap-8 animate-shimmer whitespace-nowrap opacity-90">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="font-condensed font-black tracking-[0.2em] text-black">DSTRKT ARCHIVE • PAST COLLECTIONS • NO RESTOCKS • </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24 relative z-10">
        <div className="mb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-[#888] hover:text-white transition-colors uppercase tracking-widest text-xs font-bold font-mono mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-6xl md:text-8xl font-hero uppercase tracking-tight leading-none">
            The <br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>Archive</span>
          </h1>
          <p className="mt-6 text-[#888] max-w-xl font-mono text-sm uppercase leading-relaxed">
            A comprehensive record of past collections, experiments, and discontinued silhouettes. 
            These items will never be produced again.
          </p>
        </div>

        <div className="space-y-32">
          {ARCHIVE_ITEMS.map((item, index) => (
            <div key={item.title} className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 group`}>
              <div className="w-full md:w-1/2 relative aspect-[3/4] overflow-hidden border border-[#333] grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image 
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 border border-white/10 m-4 z-10 pointer-events-none" />
                <div className="absolute bottom-6 left-6 z-20 mix-blend-difference text-white">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase">{item.year}</span>
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-center relative">
                <span className="text-[var(--accent-red)] font-hero text-8xl md:text-[12rem] absolute opacity-5 -translate-y-[10%] -translate-x-12 pointer-events-none select-none z-[-1]">
                  {item.year}
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-6">
                  {item.title}
                </h2>
                <p className="text-[#888] font-mono text-sm uppercase leading-relaxed max-w-md">
                  {item.desc}
                </p>
                <div className="mt-8 pt-8 border-t border-[#222]">
                  <span className="inline-block px-4 py-2 border border-[#333] text-[#666] text-xs font-bold tracking-widest uppercase bg-[#111]">
                    Status: Vaulted
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
