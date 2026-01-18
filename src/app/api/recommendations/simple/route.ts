import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { simpleRecommendationAlgorithm } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      currentProductId,
      limit = 4
    } = await request.json();

    // Fetch user's purchase history
    const userOrders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const userPurchaseHistory = userOrders.flatMap(order => 
      order.items.map(item => item.productId)
    );

    // For simplicity, we'll use viewed products from cart for now
    // In a real implementation, you'd track views separately
    const cartItems = await prisma.cartItem.findMany({
      where: { cart: { userId } },
      include: {
        variant: {
          include: { product: true }
        }
      }
    });

    const userViewHistory = cartItems.map(item => item.variant.productId);

    // Fetch the full product catalog
    const productCatalog = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        brand: true,
        images: {
          where: { isPrimary: true },
          take: 1
        }
      }
    });

    // Format the product catalog for the algorithm
    const formattedCatalog = productCatalog.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category.name,
      brand: product.brand?.name || 'Generic',
      price: product.basePrice,
      tags: product.tags ? product.tags.split(',') : []
    }));

    // Generate recommendations using the simple algorithm
    const recommendedProductIds = simpleRecommendationAlgorithm(
      userId,
      currentProductId,
      userPurchaseHistory,
      userViewHistory,
      formattedCatalog,
      limit
    );

    // Fetch the recommended products with full details
    const recommendedProducts = await prisma.product.findMany({
      where: {
        id: { in: recommendedProductIds },
        isActive: true
      },
      include: {
        category: true,
        brand: true,
        images: {
          where: { isPrimary: true },
          take: 1
        }
      },
      orderBy: {
        id: { // Maintain order from recommendation algorithm
          _in: recommendedProductIds,
        },
      },
    });

    return NextResponse.json({
      userId,
      currentProductId,
      recommendations: recommendedProducts,
      count: recommendedProducts.length
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const currentProductId = searchParams.get('currentProductId');
  const limit = parseInt(searchParams.get('limit') || '4');

  if (!currentProductId) {
    return NextResponse.json(
      { error: 'Current product ID is required' },
      { status: 400 }
    );
  }

  // Fetch user's purchase history
  const userOrders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  const userPurchaseHistory = userOrders.flatMap(order => 
    order.items.map(item => item.productId)
  );

  // For simplicity, we'll use viewed products from cart for now
  const cartItems = await prisma.cartItem.findMany({
    where: { cart: { userId } },
    include: {
      variant: {
        include: { product: true }
      }
    }
  });

  const userViewHistory = cartItems.map(item => item.variant.productId);

  // Fetch the full product catalog
  const productCatalog = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      brand: true,
      images: {
        where: { isPrimary: true },
        take: 1
      }
    }
  });

  // Format the product catalog for the algorithm
  const formattedCatalog = productCatalog.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category.name,
    brand: product.brand?.name || 'Generic',
    price: product.basePrice,
    tags: product.tags ? product.tags.split(',') : []
  }));

  // Generate recommendations using the simple algorithm
  const recommendedProductIds = simpleRecommendationAlgorithm(
    userId || 'anonymous',
    currentProductId,
    userPurchaseHistory,
    userViewHistory,
    formattedCatalog,
    limit
  );

  // Fetch the recommended products with full details
  const recommendedProducts = await prisma.product.findMany({
    where: {
      id: { in: recommendedProductIds },
      isActive: true
    },
    include: {
      category: true,
      brand: true,
      images: {
        where: { isPrimary: true },
        take: 1
      }
    },
    orderBy: {
      id: { // Maintain order from recommendation algorithm
        _in: recommendedProductIds,
      },
    },
  });

  return NextResponse.json({
    userId: userId || 'anonymous',
    currentProductId,
    recommendations: recommendedProducts,
    count: recommendedProducts.length
  });
}