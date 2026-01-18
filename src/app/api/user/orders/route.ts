import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getSession } from '@/lib/auth'

import { getImageUrl } from '@/lib/cloudinary'
// GET - Get user's order history
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Please login to view your orders' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = { userId: session.userId }
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: {
                        where: { isPrimary: true },
                        take: 1
                      }
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    // Transform orders for frontend
    const transformedOrders = orders.map(order => {
      // Parse shipping address
      let shippingAddress: Record<string, unknown> = {}
      try {
        shippingAddress = JSON.parse(order.shippingAddress)
      } catch {
        shippingAddress = { address: order.shippingAddress }
      }

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status.toLowerCase(),
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        shippingAmount: order.shippingAmount,
        taxAmount: order.taxAmount,
        totalAmount: order.totalAmount,
        couponCode: order.couponCode,
        shippingAddress,
        shippingMethod: order.shippingMethod,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        notes: order.notes,
        placedAt: order.placedAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        cancelledAt: order.cancelledAt,
        createdAt: order.createdAt,
        itemCount: order.items.length,
        items: order.items.map(item => {
          let productSnapshot: Record<string, unknown> = {}
          try {
            productSnapshot = JSON.parse(item.productSnapshot)
          } catch {
            productSnapshot = {}
          }

          const primaryImage = item.variant.product.images[0]?.imagePath

          return {
            id: item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            variant: {
              id: item.variant.id,
              sku: item.variant.sku,
              colorName: item.variant.colorName,
              sizeValue: item.variant.sizeValue
            },
            product: {
              id: item.variant.product.id,
              name: item.variant.product.name,
              slug: item.variant.product.slug,
              image: getImageUrl(primaryImage)
            },
            snapshot: productSnapshot
          }
        })
      }
    })

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
