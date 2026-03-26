import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const categoryId = searchParams.get('categoryId');
    const limit = parseInt(searchParams.get('limit') || '8');

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    let recommended: any[] = [];

    // If user is logged in, get recommendations based on purchase history
    if (userId) {
      const userOrders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: { product: { select: { categoryId: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      // Get categories the user has bought from
      const purchasedCategoryIds = Array.from(
        new Set(
          userOrders.flatMap((o) =>
            o.items.map((i) => i.product.categoryId)
          )
        )
      );

      // Get purchased product IDs to exclude
      const purchasedProductIds = Array.from(
        new Set(userOrders.flatMap((o) => o.items.map((i) => i.productId)))
      );

      if (purchasedCategoryIds.length > 0) {
        recommended = await prisma.product.findMany({
          where: {
            categoryId: { in: purchasedCategoryIds },
            id: { notIn: [...purchasedProductIds, ...(productId ? [productId] : [])] },
            stock: { gt: 0 },
          },
          include: {
            category: true,
            reviews: { select: { rating: true } },
          },
          take: limit,
          orderBy: { createdAt: 'desc' },
        });
      }
    }

    // If not enough recommendations, fill with same-category or popular products
    if (recommended.length < limit) {
      const remaining = limit - recommended.length;
      const excludeIds = recommended.map((r) => r.id);
      if (productId) excludeIds.push(productId);

      const where: any = {
        id: { notIn: excludeIds },
        stock: { gt: 0 },
      };

      if (categoryId) {
        where.categoryId = categoryId;
      }

      const filler = await prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: { select: { rating: true } },
        },
        take: remaining,
        orderBy: { createdAt: 'desc' },
      });

      recommended = [...recommended, ...filler];
    }

    // Add average rating
    const withRatings = recommended.map((p) => {
      const avgRating = p.reviews.length
        ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length
        : 0;
      return { ...p, avgRating, reviewCount: p.reviews.length };
    });

    return NextResponse.json(withRatings);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Erro ao buscar recomendações' }, { status: 500 });
  }
}
