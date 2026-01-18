import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const product = await db.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: {
          include: {
            inventory: true,
          },
        },
        images: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      name,
      slug,
      description,
      shortDescription,
      brandId,
      categoryId,
      productType,
      gender,
      basePrice,
      compareAtPrice,
      costPrice,
      isActive,
      isFeatured,
      isNewArrival,
      tags,
      materials,
      careInstructions,
      metaTitle,
      metaDescription,
    } = body

    // Check if product exists
    const existing = await db.product.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if slug is taken by another product
    if (slug && slug !== existing.slug) {
      const slugTaken = await db.product.findUnique({
        where: { slug },
      })

      if (slugTaken) {
        return NextResponse.json(
          { error: 'Product with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        shortDescription,
        brandId,
        categoryId,
        productType,
        gender,
        basePrice: basePrice ? parseFloat(basePrice) : undefined,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        isActive,
        isFeatured,
        isNewArrival,
        // Auto-publish when activated, unpublish when deactivated
        publishedAt: isActive !== undefined 
          ? (isActive ? (existing.publishedAt || new Date()) : null)
          : undefined,
        tags,
        materials,
        careInstructions,
        metaTitle,
        metaDescription,
      },
      include: {
        brand: true,
        category: true,
        variants: {
          include: {
            inventory: true,
          },
        },
        images: true,
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if product has order items
    if (product._count.orderItems > 0) {
      return NextResponse.json(
        { error: `Cannot delete product with ${product._count.orderItems} order(s). This product has been purchased and must be kept for order history.` },
        { status: 400 }
      )
    }

    // Delete product (cascade will handle variants, images, etc.)
    await db.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
