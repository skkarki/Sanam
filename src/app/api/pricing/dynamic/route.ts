import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { calculateDynamicPrice } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const {
      productId,
      demandFactor,
      timeFactor,
      inventoryLevel,
      competitorPrices
    } = await request.json();

    // Fetch the product to get the base price
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { basePrice: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate the dynamic price
    const dynamicPrice = calculateDynamicPrice(
      product.basePrice,
      demandFactor,
      timeFactor,
      inventoryLevel,
      competitorPrices
    );

    return NextResponse.json({
      productId,
      basePrice: product.basePrice,
      dynamicPrice,
      demandFactor,
      timeFactor,
      inventoryLevel,
      competitorPrices
    });
  } catch (error) {
    console.error('Error calculating dynamic price:', error);
    return NextResponse.json(
      { error: 'Failed to calculate dynamic price' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const demandFactor = parseFloat(searchParams.get('demandFactor') || '1');
  const timeFactor = parseFloat(searchParams.get('timeFactor') || '1');
  const inventoryLevel = parseInt(searchParams.get('inventoryLevel') || '100');

  if (!productId) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );
  }

  // Fetch the product to get the base price
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { basePrice: true }
  });

  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }

  // Calculate the dynamic price
  const dynamicPrice = calculateDynamicPrice(
    product.basePrice,
    demandFactor,
    timeFactor,
    inventoryLevel
  );

  return NextResponse.json({
    productId,
    basePrice: product.basePrice,
    dynamicPrice,
    demandFactor,
    timeFactor,
    inventoryLevel
  });
}