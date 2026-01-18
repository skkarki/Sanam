import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    // Parse the limit parameter
    const parsedLimit = limit ? parseInt(limit) : undefined;
    
    // Fetch customers from the database
    const customers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER', // Only fetch actual customers, not admins
      },
      take: parsedLimit ? parsedLimit : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orders: {
          select: {
            totalAmount: true,
            createdAt: true,
            orderNumber: true,
          },
        },
        addresses: {
          select: {
            city: true,
          },
        },
      },
    });

    // Calculate order statistics for each customer
    const customersWithStats = customers.map(customer => {
      const totalOrders = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const lastOrder = customer.orders.length > 0 
        ? customer.orders.reduce((latest, order) => 
            order.createdAt > latest.createdAt ? order : latest
          ).orderNumber 
        : 'N/A';
        
      return {
        id: customer.id,
        name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown Customer',
        email: customer.email,
        phone: customer.phone || 'N/A',
        location: customer.addresses.length > 0 
          ? customer.addresses[0].city || 'Nepal' 
          : 'Nepal',
        joined: customer.createdAt.toISOString().split('T')[0],
        totalOrders,
        totalSpent: `Rs. ${totalSpent.toLocaleString()}`,
        status: customer.isActive ? 'active' : 'inactive',
        lastOrder,
      };
    });

    return NextResponse.json({ 
      customers: customersWithStats,
      count: customers.length 
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}