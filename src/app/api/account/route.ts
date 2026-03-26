import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, orderNumber: true, total: true, status: true, createdAt: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      recentOrders: user.orders,
      orders: undefined,
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json({ error: 'Erro ao buscar conta' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { name, phone, address } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(address !== undefined && { address: address || null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'PROFILE_UPDATED',
        entityType: 'User',
        entityId: userId,
        details: JSON.stringify({ fields: Object.keys(body) }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json({ error: 'Erro ao atualizar conta' }, { status: 500 });
  }
}
