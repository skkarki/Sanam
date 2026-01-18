import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET - Fetch single brand
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const brand = await db.brand.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    return NextResponse.json({
      brand: {
        ...brand,
        productCount: brand._count.products,
      },
    })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  }
}

// PUT - Update brand
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, logoPublicId, description, websiteUrl, isFeatured, isActive } = body

    // Check if brand exists
    const existing = await db.brand.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Check if slug is taken by another brand
    if (slug && slug !== existing.slug) {
      const slugTaken = await db.brand.findUnique({
        where: { slug },
      })

      if (slugTaken) {
        return NextResponse.json(
          { error: 'Brand with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const brand = await db.brand.update({
      where: { id: params.id },
      data: {
        name: name || existing.name,
        slug: slug || existing.slug,
        logoPublicId,
        description,
        websiteUrl,
        isFeatured,
        isActive,
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
    })
  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    )
  }
}

// DELETE - Delete brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if brand exists
    const brand = await db.brand.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Check if brand has products
    if (brand._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete brand with products. Please reassign or delete products first.' },
        { status: 400 }
      )
    }

    await db.brand.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Brand deleted successfully' })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    )
  }
}
