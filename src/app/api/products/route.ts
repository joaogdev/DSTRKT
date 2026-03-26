import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const where: any = {};

    if (categoryId) {
      // Support both UUID and slug
      const isUUID = /^[0-9a-f-]{36}$/.test(categoryId);
      if (isUUID) {
        where.categoryId = categoryId;
      } else {
        // Look up category by slug
        const cat = await prisma.category.findUnique({ where: { slug: categoryId } });
        if (cat) where.categoryId = cat.id;
        else where.categoryId = '__no_match__'; // ensure empty results
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
          reviews: {
            select: { rating: true },
          },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithAvgRating = products.map((p) => {
      const avgRating = p.reviews.length
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0;
      return {
        ...p,
        avgRating,
        reviewCount: p.reviews.length,
      };
    });

    return NextResponse.json({
      products: productsWithAvgRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, comparePrice, sku, stock, minStock, categoryId, images } = body;

    if (!name || !price || !sku || !categoryId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const slug = slugify(name);

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    const finalSlug = existingProduct ? `${slug}-${Date.now()}` : slug;

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        slug: finalSlug,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        sku,
        stock: stock || 0,
        minStock: minStock || 10,
        categoryId,
        images: images || [],
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}