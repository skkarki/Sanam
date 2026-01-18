import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET - Fetch all brands
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

    const [brands, total] = await Promise.all([
      db.brand.findMany({
        where,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.brand.count({ where }),
    ])

    return NextResponse.json({
      brands: brands.map(brand => ({
        ...brand,
        productCount: brand._count.products,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

// POST - Create new brand
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, logoPublicId, description, websiteUrl, isFeatured, isActive } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await db.brand.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Brand with this slug already exists' },
        { status: 409 }
      )
    }

    const brand = await db.brand.create({
      data: {
        name,
        slug,
        logoPublicId,
        description,
        websiteUrl,
        isFeatured: isFeatured || false,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json({
      brand: {
        ...brand,
        productCount: brand._count.products,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}
