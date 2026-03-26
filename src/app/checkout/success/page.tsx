'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-24 px-6 selection:bg-[var(--accent-red)]">
      <div className="max-w-md w-full text-center animate-fade-in relative">
        {/* Background Decorative Text */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 text-[#0a0a0a] font-hero text-8xl -z-10 select-none pointer-events-none">
          SECURE
        </div>

        <div className="mb-12">
          <div className="w-20 h-20 bg-black border-2 border-[var(--accent-red)] rounded-none flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0_0_rgba(255,0,0,0.2)]">
            <CheckCircle className="w-8 h-8 text-[var(--accent-red)]" strokeWidth={3} />
          </div>
          <h1 className="text-display-heavy text-4xl text-white mb-4 uppercase leading-none">Pedido Confirmado!</h1>
          <p className="font-mono text-xs tracking-widest text-[#888] uppercase">
            ID: <span className="font-bold text-[var(--accent-red)]">{orderNumber}</span> STATUS: SUCESSO.
          </p>
        </div>

        <div className="border border-[#333] bg-[#050505] p-8 mb-10 text-left relative overflow-hidden group">
          {/* Top Right Brutalist Label */}
          <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-[#333] flex items-center justify-center bg-black">
            <span className="font-mono text-[8px] text-[#666]">SEQ</span>
          </div>
          
          <h3 className="font-condensed font-bold text-sm uppercase tracking-[0.2em] mb-6 border-b border-[#222] pb-4 text-white">
            Próximos passos
          </h3>
          
          <ul className="space-y-6 font-mono text-[10px] text-[#888] tracking-widest uppercase">
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 border border-[#333] flex items-center justify-center flex-shrink-0 text-white group-hover:border-[var(--accent-red)] transition-colors">01</span>
              <span className="mt-1 leading-relaxed">Você receberá um email de confirmação com os detalhes.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 border border-[#333] flex items-center justify-center flex-shrink-0 text-white group-hover:border-[var(--accent-red)] transition-colors">02</span>
              <span className="mt-1 leading-relaxed">Assim que o pagamento for verificado, prepararemos o envio.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 border border-[#333] flex items-center justify-center flex-shrink-0 text-white group-hover:border-[var(--accent-red)] transition-colors">03</span>
              <span className="mt-1 leading-relaxed">Acompanhe o status em <Link href="/account" className="text-[var(--accent-red)] hover:underline border-b border-transparent hover:border-[var(--accent-red)]">Meus Pedidos</Link>.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/orders/${orderId}`} className="btn btn-primary flex-1 py-4">
            <Package className="w-4 h-4 mr-2" /> Ver Pedido
          </Link>
          <Link href="/" className="btn btn-outline flex-1 py-4 text-[#888] hover:text-white">
            <Home className="w-4 h-4 mr-2" /> Voltar à Loja
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-xs tracking-[0.3em] text-[#666] animate-pulse">VERIFICANDO...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
