import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getSession } from '@/lib/auth'
import { getImageUrl } from '@/lib/cloudinary'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Please login to view order details' },
                { status: 401 }
            )
        }

        const { id } = await params

        const order = await prisma.order.findUnique({
            where: { id },
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
            }
        })

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        // Security check: Ensure order belongs to user
        if (order.userId !== session.userId) {
            return NextResponse.json(
                { error: 'You do not have permission to view this order' },
                { status: 403 }
            )
        }

        // Parse shipping address
        let shippingAddress: Record<string, unknown> = {}
        try {
            shippingAddress = JSON.parse(order.shippingAddress)
        } catch {
            shippingAddress = { address: order.shippingAddress }
        }

        const transformedOrder = {
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

        return NextResponse.json({ order: transformedOrder })

    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json(
            { error: 'Failed to fetch order details' },
            { status: 500 }
        )
    }
}
