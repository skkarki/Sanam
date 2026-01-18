import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Fetch total orders count
    const totalOrders = await prisma.order.count();
    
    // Fetch total sales amount (sum of all order total amounts)
    const ordersWithTotals = await prisma.order.findMany({
      select: {
        totalAmount: true,
      },
    });
    
    const totalSales = ordersWithTotals.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Fetch active products count
    const activeProducts = await prisma.product.count({
      where: {
        isActive: true,
      },
    });
    
    // Fetch total customers count
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER', // Only count actual customers, not admins
      },
    });

    return NextResponse.json({
      totalOrders,
      totalSales,
      activeProducts,
      totalCustomers,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}