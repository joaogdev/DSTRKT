import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  if (!product) {
    notFound();
  }

  let images: string[] = [];
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch {
    images = [];
  }

  return (
    <ProductDetailClient
      product={{
        ...product,
        images,
      }}
    />
  );
}
