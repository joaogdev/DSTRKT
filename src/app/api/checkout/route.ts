import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { items, shippingAddress, billingAddress, paymentMethod, paymentDetails } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Endereço de entrega obrigatório' }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Método de pagamento obrigatório' }, { status: 400 });
    }

    // Validate stock and build order items
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Produto não encontrado` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}` },
          { status: 400 }
        );
      }

      const itemTotal = parseFloat(product.price.toString()) * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: product.id,
        variantId: item.variantId || null,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    const tax = subtotal * 0.1;
    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + tax + shipping;

    // Simulate payment processing
    const paymentId = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        status: paymentMethod === 'boleto' ? 'PENDING' : 'PROCESSING',
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        paymentMethod,
        paymentId,
        notes: paymentDetails ? JSON.stringify(paymentDetails) : null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Decrement stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'ORDER_CREATED',
        entityType: 'Order',
        entityId: order.id,
        details: JSON.stringify({
          orderNumber: order.orderNumber,
          total: order.total,
          itemCount: items.length,
          paymentMethod,
        }),
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json({ error: 'Erro ao processar checkout: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
