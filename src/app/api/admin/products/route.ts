import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          variants: {
            include: {
              inventory: true,
            },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ])

    return NextResponse.json({
      products: products.map(product => ({
        ...product,
        totalStock: product.variants.reduce((sum, v) => sum + (v.inventory?.quantity || 0), 0),
        variantCount: product.variants.length,
        primaryImage: product.images[0]?.imagePath || null,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    if (!name || !slug || !categoryId || !productType || !gender || !basePrice) {
      return NextResponse.json(
        { error: 'Required fields: name, slug, categoryId, productType, gender, basePrice' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await db.product.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        brandId,
        categoryId,
        productType,
        gender,
        basePrice: parseFloat(basePrice),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        isActive: isActive !== undefined ? isActive : false,
        isFeatured: isFeatured || false,
        isNewArrival: isNewArrival !== undefined ? isNewArrival : true,
        publishedAt: isActive ? new Date() : null, // Auto-publish if active
        tags: tags || '',
        materials: materials || '',
        careInstructions,
        metaTitle,
        metaDescription,
      },
      include: {
        brand: true,
        category: true,
        variants: true,
        images: true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
