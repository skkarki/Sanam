import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { cookies } from 'next/headers'
import { createSession } from '@/lib/auth'

// Generate order number
function generateOrderNumber(): string {
  const prefix = 'SI'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('cart_session')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No cart session found' },
        { status: 400 }
      )
    }

    const { shippingAddress, paymentMethod } = await request.json()

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.email || !shippingAddress.address || !shippingAddress.city) {
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      )
    }

    // Get cart with items
    const cart = await prisma.cart.findFirst({
      where: { sessionId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    brand: true,
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
                inventory: true,
              },
            },
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate stock for all items
    for (const item of cart.items) {
      const availableStock = item.variant.inventory
        ? item.variant.inventory.quantity - item.variant.inventory.reservedQuantity
        : 0

      if (item.quantity > availableStock) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.variant.product.name} (${item.variant.colorName} / ${item.variant.sizeValue})`,
            availableStock
          },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant.product.basePrice + item.variant.priceAdjustment
      return sum + (price * item.quantity)
    }, 0)

    const shippingAmount = subtotal >= 10000 ? 0 : 200
    const taxAmount = 0 // No tax for now
    const totalAmount = subtotal + shippingAmount + taxAmount

    // Create or get guest user
    let user = await prisma.user.findUnique({
      where: { email: shippingAddress.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: shippingAddress.email,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: shippingAddress.phone,
          role: 'CUSTOMER',
          isActive: true,
        },
      })
    }

    // IMPORTANT: Create auth session for the user so they can view their orders
    // This logs them in automatically after checkout
    await createSession(user.id, user.email, user.role)

    // Create order
    const orderNumber = generateOrderNumber()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PENDING',
        currency: 'NPR',
        subtotal,
        discountAmount: 0,
        shippingAmount,
        taxAmount,
        totalAmount,
        shippingAddress: JSON.stringify(shippingAddress),
        shippingMethod: shippingAmount === 0 ? 'Free Shipping' : 'Standard Shipping',
        placedAt: new Date(),
        items: {
          create: cart.items.map(item => ({
            variantId: item.variant.id,
            productId: item.variant.product.id,
            quantity: item.quantity,
            unitPrice: item.variant.product.basePrice + item.variant.priceAdjustment,
            totalPrice: (item.variant.product.basePrice + item.variant.priceAdjustment) * item.quantity,
            productSnapshot: JSON.stringify({
              productId: item.variant.product.id,
              productName: item.variant.product.name,
              productSlug: item.variant.product.slug,
              brandName: item.variant.product.brand?.name,
              colorName: item.variant.colorName,
              sizeValue: item.variant.sizeValue,
              sku: item.variant.sku,
              image: item.variant.product.images[0]?.imagePath,
            }),
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: paymentMethod === 'cod' ? 'MANUAL' : paymentMethod === 'esewa' ? 'ESEWA' : 'KHALTI',
        providerPaymentId: `PAY-${orderNumber}`,
        amount: totalAmount,
        currency: 'NPR',
        status: paymentMethod === 'cod' ? 'PENDING' : 'PENDING', // Will be updated after payment confirmation
        paymentMethod: paymentMethod,
      },
    })

    // Update inventory (reserve stock)
    for (const item of cart.items) {
      if (item.variant.inventory) {
        await prisma.inventory.update({
          where: { id: item.variant.inventory.id },
          data: {
            reservedQuantity: {
              increment: item.quantity,
            },
          },
        })
      }
    }

    // DON'T clear cart here - only clear after successful payment verification
    // This allows users to retry payment if it fails
    // Cart will be cleared in the payment verification endpoint after success
    // await prisma.cartItem.deleteMany({
    //   where: { cartId: cart.id },
    // })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: totalAmount,
      message: 'Order placed successfully',
    })
  } catch (error) {
    console.error('Error processing checkout:', error)
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    )
  }
}

// GET - Get order details (for confirmation page)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        payments: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: order.subtotal,
      shippingAmount: order.shippingAmount,
      totalAmount: order.totalAmount,
      shippingAddress: JSON.parse(order.shippingAddress),
      items: order.items.map(item => ({
        ...item,
        productSnapshot: JSON.parse(item.productSnapshot),
      })),
      placedAt: order.placedAt,
      paymentMethod: order.payments[0]?.paymentMethod,
      paymentStatus: order.payments[0]?.status,
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
