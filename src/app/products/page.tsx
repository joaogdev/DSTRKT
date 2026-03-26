import { prisma } from '@/lib/prisma';
import { ProductsPageClient } from '@/components/products/ProductsPageClient';

type ProductsPageProps = {
  searchParams?: {
    category?: string;
    search?: string;
    sort?: string;
    order?: string;
    page?: string;
  };
};

const SORT_FIELDS = new Set(['createdAt', 'price', 'name']);
const SORT_ORDERS = new Set(['asc', 'desc']);

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams?.category ?? '';
  const search = searchParams?.search ?? '';
  const sort = SORT_FIELDS.has(searchParams?.sort ?? '') ? (searchParams?.sort as string) : 'createdAt';
  const order = SORT_ORDERS.has(searchParams?.order ?? '') ? (searchParams?.order as string) : 'desc';
  const page = Math.max(1, Number.parseInt(searchParams?.page ?? '1', 10) || 1);
  const limit = 16;

  const where = {
    ...(category ? { category: { slug: category } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}),
  };

  const [categories, products, total] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
      },
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return (
    <ProductsPageClient
      initialCategories={categories}
      initialProducts={products}
      initialSearch={search}
      initialCategory={category}
      initialSort={sort}
      initialOrder={order}
      initialPage={page}
      initialTotalPages={Math.max(1, Math.ceil(total / limit))}
    />
  );
}
