import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('range') || '30'; // Default to 30 days
    
    // Parse date range to calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));
    
    // Get total revenue and order counts
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
        user: true,
      },
    });
    
    // Calculate analytics data
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalCustomers = [...new Set(orders.map(order => order.userId))].length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Get top selling products
    const productSalesMap = new Map<string, { name: string; sales: number; revenue: number }>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const productName = item.variant.product.name;
        const existing = productSalesMap.get(productName);
        
        if (existing) {
          productSalesMap.set(productName, {
            name: productName,
            sales: existing.sales + item.quantity,
            revenue: existing.revenue + (item.unitPrice * item.quantity),
          });
        } else {
          productSalesMap.set(productName, {
            name: productName,
            sales: item.quantity,
            revenue: item.unitPrice * item.quantity,
          });
        }
      });
    });
    
    // Convert to array and sort by sales
    const topProducts = Array.from(productSalesMap.entries())
      .map(([name, data]) => ({
        id: name.substring(0, 3), // Simple ID generation
        name,
        sales: data.sales,
        revenue: `Rs. ${data.revenue.toLocaleString()}`,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5 products
    
    // Get category sales
    const categorySalesMap = new Map<string, { sales: number; revenue: number }>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.variant.product.category.name || 'Uncategorized';
        const existing = categorySalesMap.get(category);
        
        if (existing) {
          categorySalesMap.set(category, {
            sales: existing.sales + item.quantity,
            revenue: existing.revenue + (item.unitPrice * item.quantity),
          });
        } else {
          categorySalesMap.set(category, {
            sales: item.quantity,
            revenue: item.unitPrice * item.quantity,
          });
        }
      });
    });
    
    const categories = Array.from(categorySalesMap.entries())
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        revenue: `Rs. ${data.revenue.toLocaleString()}`,
      }));
    
    // Generate daily sales data for the period
    const salesByDate = new Map<string, { sales: number; revenue: number }>();
    
    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      const existing = salesByDate.get(dateStr);
      
      if (existing) {
        salesByDate.set(dateStr, {
          sales: existing.sales + 1,
          revenue: existing.revenue + order.totalAmount,
        });
      } else {
        salesByDate.set(dateStr, {
          sales: 1,
          revenue: order.totalAmount,
        });
      }
    });
    
    // Fill in missing dates with zero values
    const salesData: { date: string; sales: number; revenue: number }[] = [];
    const currentDate = new Date(startDate);
    const endDate = new Date();
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = salesByDate.get(dateStr) || { sales: 0, revenue: 0 };
      
      salesData.push({
        date: dateStr,
        sales: dayData.sales,
        revenue: dayData.revenue,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Calculate growth rate (comparing to previous period)
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - parseInt(dateRange));
    
    const prevOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: startDate,
        },
      },
    });
    
    const currentOrdersCount = orders.length;
    let growthRate = 0;
    
    if (prevOrders > 0) {
      growthRate = ((currentOrdersCount - prevOrders) / prevOrders) * 100;
    } else if (currentOrdersCount > 0 && prevOrders === 0) {
      growthRate = 100; // New business or new period
    }
    
    const growthRateStr = growthRate >= 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`;
    
    const analyticsData = {
      overview: {
        totalRevenue: `Rs. ${totalRevenue.toLocaleString()}`,
        growthRate: growthRateStr,
        totalOrders,
        totalCustomers,
        averageOrderValue: `Rs. ${Math.round(averageOrderValue).toLocaleString()}`,
      },
      sales: salesData,
      topProducts,
      categories,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}