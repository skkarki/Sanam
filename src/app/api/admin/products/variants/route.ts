import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// POST - Create new product variant
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      productId,
      sku,
      colorName,
      colorHex,
      sizeValue,
      sizeLabel,
      sizeCategory,
      quantity,
      priceAdjustment,
      lowStockThreshold,
    } = body

    if (!productId || !sku || !colorName || !sizeValue || !sizeCategory) {
      return NextResponse.json(
        { error: 'Required fields: productId, sku, colorName, sizeValue, sizeCategory' },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existing = await db.productVariant.findUnique({
      where: { sku },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Variant with this SKU already exists' },
        { status: 409 }
      )
    }

    // Create variant with inventory
    const variant = await db.productVariant.create({
      data: {
        productId,
        sku,
        colorName,
        colorHex: colorHex || null,
        sizeValue,
        sizeLabel: sizeLabel || null,
        sizeCategory,
        priceAdjustment: priceAdjustment ? parseFloat(priceAdjustment) : 0,
        isActive: true,
        inventory: {
          create: {
            quantity: quantity || 0,
            reservedQuantity: 0,
            lowStockThreshold: lowStockThreshold || 5,
            allowBackorder: false,
          },
        },
      },
      include: {
        inventory: true,
      },
    })

    return NextResponse.json({ variant }, { status: 201 })
  } catch (error) {
    console.error('Error creating variant:', error)
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    )
  }
}
