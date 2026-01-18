import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Fetch product with all related data
    const product = await db.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        brand: true,
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        variants: {
          include: {
            inventory: true,
          },
          where: { isActive: true },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0

    // Group variants by color and size
    const colors = product.variants.reduce((acc, variant) => {
      if (!acc.some(c => c.name === variant.colorName)) {
        acc.push({
          id: variant.id,
          name: variant.colorName,
          hex: variant.colorHex || '#000000',
        })
      }
      return acc
    }, [] as { id: string; name: string; hex: string }[])

    const sizes = product.variants.reduce((acc, variant) => {
      if (!acc.some(s => s.name === variant.sizeValue)) {
        acc.push({
          id: variant.id,
          name: variant.sizeValue,
          label: variant.sizeLabel || variant.sizeValue,
          inStock: variant.inventory
            ? variant.inventory.quantity - variant.inventory.reservedQuantity > 0
            : false,
        })
      }
      return acc
    }, [] as { id: string; name: string; label: string; inStock: boolean }[])

    // Format images
    const images = product.images.map(img => img.imagePath)

    // Format reviews
    const formattedReviews = product.reviews.map(review => ({
      id: review.id,
      author: review.user?.firstName || 'Anonymous',
      rating: review.rating,
      date: review.createdAt.toISOString(),
      title: review.title,
      comment: review.comment,
      helpful: review.helpfulCount,
    }))

    // Format response
    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      brand: product.brand?.name,
      price: product.basePrice,
      compareAtPrice: product.compareAtPrice || undefined,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
      isNew: product.isNewArrival,
      isFeatured: product.isFeatured,
      materials: product.materials,
      careInstructions: product.careInstructions,
      colors,
      sizes,
      images,
      reviews: formattedReviews,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
    }

    return NextResponse.json({
      ...formattedProduct,
      currency: 'NPR',
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
