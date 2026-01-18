import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// PUT - Update inventory
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
    const { quantity, lowStockThreshold, allowBackorder } = body

    // Check if inventory exists
    const existing = await db.inventory.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 })
    }

    const inventory = await db.inventory.update({
      where: { id: params.id },
      data: {
        quantity: quantity !== undefined ? parseInt(quantity) : undefined,
        lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold) : undefined,
        allowBackorder: allowBackorder !== undefined ? allowBackorder : undefined,
      },
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
    })

    return NextResponse.json({ inventory })
  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
