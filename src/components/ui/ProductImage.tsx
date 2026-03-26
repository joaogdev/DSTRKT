'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '');
  const [isFallback, setIsFallback] = useState(false);

  const FALLBACKS = [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'
  ];

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={isFallback ? `${className} grayscale opacity-90 backdrop-contrast-125 saturate-50` : className}
      onError={() => {
        if (!isFallback) {
          const index = (alt.length || 0) % FALLBACKS.length;
          setImgSrc(FALLBACKS[index]);
          setIsFallback(true);
        } else {
          // Absolute last resort
          setImgSrc('https://placehold.co/800x1000/111/555?text=NO+IMAGE&font=mono');
        }
      }}
    />
  );
}
