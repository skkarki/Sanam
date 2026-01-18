import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getSession } from '@/lib/auth'

// GET - Get user's wishlist
export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to view your wishlist' },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: session.userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
            images: {
              where: { isPrimary: true },
              take: 1
            },
            variants: {
              include: {
                inventory: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data for frontend
    const items = wishlistItems.map(item => {
      const product = item.product
      const primaryImage = product.images[0]?.imagePath || '/placeholder.jpg'
      
      // Calculate if product is in stock (any variant has stock)
      const inStock = product.variants.some(
        v => v.inventory && (v.inventory.quantity - v.inventory.reservedQuantity) > 0
      )
      
      // Calculate discount percentage if compareAtPrice exists
      const discount = product.compareAtPrice 
        ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
        : 0

      return {
        id: item.id,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        price: product.basePrice,
        compareAtPrice: product.compareAtPrice,
        discount,
        image: primaryImage.startsWith('/') ? primaryImage : `/uploads/${primaryImage}`,
        category: product.category.name,
        brand: product.brand?.name || null,
        inStock,
        addedAt: item.createdAt
      }
    })

    return NextResponse.json({ items, count: items.length })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST - Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to add items to wishlist' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.userId,
          productId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Product is already in your wishlist', alreadyExists: true },
        { status: 409 }
      )
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.userId,
        productId
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Product added to wishlist',
      item: {
        id: wishlistItem.id,
        productId: wishlistItem.product.id,
        name: wishlistItem.product.name,
        addedAt: wishlistItem.createdAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE - Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to modify your wishlist' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const wishlistId = searchParams.get('id')

    if (!productId && !wishlistId) {
      return NextResponse.json(
        { error: 'Product ID or Wishlist ID is required' },
        { status: 400 }
      )
    }

    if (wishlistId) {
      // Delete by wishlist item ID
      const item = await prisma.wishlist.findFirst({
        where: {
          id: wishlistId,
          userId: session.userId
        }
      })

      if (!item) {
        return NextResponse.json(
          { error: 'Wishlist item not found' },
          { status: 404 }
        )
      }

      await prisma.wishlist.delete({
        where: { id: wishlistId }
      })
    } else if (productId) {
      // Delete by product ID
      const item = await prisma.wishlist.findUnique({
        where: {
          userId_productId: {
            userId: session.userId,
            productId
          }
        }
      })

      if (!item) {
        return NextResponse.json(
          { error: 'Product not found in wishlist' },
          { status: 404 }
        )
      }

      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId: session.userId,
            productId
          }
        }
      })
    }

    return NextResponse.json({ message: 'Product removed from wishlist' })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
