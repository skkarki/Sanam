import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    // Parse the limit parameter
    const parsedLimit = limit ? parseInt(limit) : undefined;
    
    // Fetch orders from the database with customer information
    const orders = await prisma.order.findMany({
      take: parsedLimit ? parsedLimit : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          select: {
            provider: true,
          },
        },
      },
    });

    // Transform the orders data to match the frontend interface
    const transformedOrders = orders.map(order => ({
      id: order.orderNumber,
      customer: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
      customerEmail: order.user.email,
      date: order.createdAt.toISOString().split('T')[0],
      items: order.items.reduce((count, item) => count + item.quantity, 0),
      total: `Rs. ${order.totalAmount.toLocaleString()}`,
      status: order.status.toLowerCase(),
      payment: order.payments.length > 0 ? order.payments[0].provider : 'Unknown',
      shipping: order.shippingMethod || 'Standard Delivery',
      location: order.shippingAddress ? JSON.parse(order.shippingAddress).city || 'Nepal' : 'Nepal',
    }));

    return NextResponse.json({ 
      orders: transformedOrders,
      count: orders.length 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}