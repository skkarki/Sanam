import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET - Fetch all inventory
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
    const lowStock = searchParams.get('lowStock') === 'true'

    const where: any = {}
    
    if (lowStock) {
      where.OR = [
        { quantity: { lte: db.inventory.fields.lowStockThreshold } },
        { quantity: 0 },
      ]
    }

    const [inventory, total] = await Promise.all([
      db.inventory.findMany({
        where,
        include: {
          variant: {
            include: {
              product: {
                include: {
                  brand: true,
                  category: true,
                },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.inventory.count({ where }),
    ])

    const filteredInventory = search
      ? inventory.filter(inv =>
          inv.variant.product.name.toLowerCase().includes(search.toLowerCase()) ||
          inv.variant.sku.toLowerCase().includes(search.toLowerCase())
        )
      : inventory

    return NextResponse.json({
      inventory: filteredInventory,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}
