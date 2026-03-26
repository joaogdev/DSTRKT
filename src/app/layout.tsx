import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Provider } from '@/components/Provider';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DSTRKT — Premium Men\'s Streetwear',
  description: 'Premium men\'s streetwear. Tracksuits, hoodies, tees, cargos. Inspired by Corteiz, Synaworld, Nike Tech. Drops every Friday.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Provider>
          <Navbar />
          <Toaster position="top-right" />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}