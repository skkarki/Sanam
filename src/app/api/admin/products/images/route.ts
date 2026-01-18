import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// POST - Create product image
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      productId,
      variantId,
      imagePath,
      altText,
      isPrimary,
      imageType,
      displayOrder,
    } = body

    console.log('Creating product image:', { productId, imagePath, isPrimary })

    if (!productId || !imagePath) {
      return NextResponse.json(
        { error: 'Required fields: productId, imagePath', received: { productId, imagePath } },
        { status: 400 }
      )
    }

    // If this is set as primary, unset other primary images for this product
    if (isPrimary) {
      await db.productImage.updateMany({
        where: {
          productId,
          variantId: variantId || null,
        },
        data: {
          isPrimary: false,
        },
      })
    }

    const image = await db.productImage.create({
      data: {
        productId,
        variantId: variantId || null,
        imagePath,
        altText: altText || null,
        isPrimary: isPrimary !== undefined ? isPrimary : false,
        imageType: imageType || 'PRODUCT',
        displayOrder: displayOrder || 0,
      },
    })

    console.log('Product image created:', image.id)

    return NextResponse.json({ image }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product image:', error)
    return NextResponse.json(
      { error: 'Failed to create product image', details: error.message },
      { status: 500 }
    )
  }
}
