import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getImageUrl } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    // Get all category/brand params for multi-select filtering
    // Helper to get array from searchParams (handles both multiple keys and comma-separated values)
    const getParamArray = (key: string) => {
      const values = searchParams.getAll(key)
      if (values.length === 1 && values[0].includes(',')) {
        return values[0].split(',')
      }
      return values
    }

    const categories = getParamArray('category')
    const brands = getParamArray('brand')
    const colors = getParamArray('color')
    const sizes = getParamArray('size')
    const gender = searchParams.get('gender')
    const categorySlug = searchParams.get('categorySlug')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sort') || 'featured'
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000')
    const isNew = searchParams.get('isNew') === 'true'

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true,
      publishedAt: { not: null },
    }

    // Support gender filtering
    if (gender) {
      where.gender = gender.toUpperCase()
    }

    // Support hierarchical category filtering
    if (categorySlug) {
      where.category = {
        OR: [
          { slug: categorySlug },
          { parent: { slug: categorySlug } }
        ]
      }
    } else if (categories.length > 0) {
      where.category = {
        OR: [
          { slug: { in: categories } },
          { parent: { slug: { in: categories } } }
        ]
      }
    }

    // Support multiple brands
    if (brands.length > 0) {
      where.brand = { slug: { in: brands } }
    }

    // Support color filtering (via variants)
    if (colors.length > 0) {
      where.variants = {
        some: {
          colorName: { in: colors, mode: 'insensitive' }
        }
      }
    }

    // Support size filtering (via variants)
    if (sizes.length > 0) {
      if (where.variants) {
        where.variants.some = {
          ...where.variants.some,
          sizeValue: { in: sizes, mode: 'insensitive' }
        }
      } else {
        where.variants = {
          some: {
            sizeValue: { in: sizes, mode: 'insensitive' }
          }
        }
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minPrice > 0 || maxPrice < 1000000) {
      where.basePrice = {
        gte: minPrice,
        lte: maxPrice,
      }
    }

    if (isNew) {
      where.isNewArrival = true
    }

    // Build order by clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'price-low':
        orderBy = { basePrice: 'asc' }
        break
      case 'price-high':
        orderBy = { basePrice: 'desc' }
        break
      case 'rating':
        orderBy = { createdAt: 'desc' } // Will be replaced with avg rating later
        break
      case 'relevance':
         // For relevance, we default to newness if no search term, 
         // but if searched, Prisma can't easily sort by relevance without raw query.
         // We keep it simple here.
         orderBy = { createdAt: 'desc' }
         break
      case 'featured':
      default:
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
        break
    }

    // Fetch products with their images, brand, and category
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Format products for frontend
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.basePrice,
      compareAtPrice: product.compareAtPrice || undefined,
      image: product.images[0] 
        ? getImageUrl(product.images[0].imagePath, {
            width: 800,
            height: 1000,
            crop: 'fill',
            quality: 80,
          })
        : '/placeholder.jpg',
      brand: product.brand?.name,
      isNew: product.isNewArrival,
      isFeatured: product.isFeatured,
      rating: 0, // Will be calculated from reviews later
      reviewCount: 0, // Will be calculated from reviews later
    }))

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      currency: 'NPR',
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
