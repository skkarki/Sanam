import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import { getImageUrl } from '@/lib/cloudinary'

const CART_SESSION_COOKIE = 'cart_session'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

// Helper to get session ID from cookies
async function getSessionIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CART_SESSION_COOKIE)?.value || null
}

// Helper to get or create cart
async function getOrCreateCart(sessionId: string, userId?: string) {
  // Try to find existing cart
  let cart = await prisma.cart.findFirst({
    where: userId
      ? { userId }
      : { sessionId },
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

  // Create new cart if not exists
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        sessionId,
        userId,
        currency: 'NPR',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
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
  }

  return cart
}

// Helper to format cart for response
function formatCartResponse(cart: Awaited<ReturnType<typeof getOrCreateCart>>) {
  return {
    id: cart.id,
    currency: cart.currency,
    items: cart.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      variant: {
        id: item.variant.id,
        sku: item.variant.sku,
        colorName: item.variant.colorName,
        colorHex: item.variant.colorHex,
        sizeValue: item.variant.sizeValue,
        sizeLabel: item.variant.sizeLabel,
        price: item.variant.product.basePrice + item.variant.priceAdjustment,
        inStock: item.variant.inventory
          ? item.variant.inventory.quantity - item.variant.inventory.reservedQuantity > 0
          : false,
        availableQuantity: item.variant.inventory
          ? item.variant.inventory.quantity - item.variant.inventory.reservedQuantity
          : 0,
      },
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        slug: item.variant.product.slug,
        brand: item.variant.product.brand?.name || 'Unknown',
        image: item.variant.product.images[0]
          ? getImageUrl(item.variant.product.images[0].imagePath)
          : '/images/fashion-banner.webp',
      },
    })),
    subtotal: cart.items.reduce((sum, item) => {
      const price = item.variant.product.basePrice + item.variant.priceAdjustment
      return sum + (price * item.quantity)
    }, 0),
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

// Helper to create response with session cookie
function createResponseWithCookie(data: unknown, sessionId: string, status = 200): NextResponse {
  const response = NextResponse.json(data, { status })

  response.cookies.set(CART_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  })

  return response
}

// GET - Fetch cart
export async function GET() {
  try {
    // Get existing session ID or create new one
    let sessionId = await getSessionIdFromCookies()
    const isNewSession = !sessionId

    if (!sessionId) {
      sessionId = uuidv4()
    }

    const cart = await getOrCreateCart(sessionId)
    const formattedCart = formatCartResponse(cart)

    console.log('[Cart GET] Session:', sessionId, 'isNew:', isNewSession, 'Items:', cart.items.length)

    // Return response with cookie set
    return createResponseWithCookie(formattedCart, sessionId)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    // Get existing session ID or create new one
    let sessionId = await getSessionIdFromCookies()
    const isNewSession = !sessionId

    if (!sessionId) {
      sessionId = uuidv4()
    }

    const { variantId, quantity = 1 } = await request.json()

    console.log('[Cart POST] Session:', sessionId, 'isNew:', isNewSession, 'variantId:', variantId)

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      )
    }

    // Check if variant exists and has stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { inventory: true },
    })

    if (!variant) {
      return NextResponse.json(
        { error: 'Product variant not found' },
        { status: 404 }
      )
    }

    if (!variant.isActive) {
      return NextResponse.json(
        { error: 'Product variant is not available' },
        { status: 400 }
      )
    }

    const availableStock = variant.inventory
      ? variant.inventory.quantity - variant.inventory.reservedQuantity
      : 0

    if (availableStock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock', availableStock },
        { status: 400 }
      )
    }

    const cart = await getOrCreateCart(sessionId)

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.variantId === variantId)

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity

      if (newQuantity > availableStock) {
        return NextResponse.json(
          { error: 'Cannot add more items than available stock', availableStock },
          { status: 400 }
        )
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      })
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      })
    }

    // Return updated cart
    const updatedCart = await getOrCreateCart(sessionId)

    console.log('[Cart POST] Added item, cart now has:', updatedCart.items.length, 'items')

    // Return response with cookie set
    return createResponseWithCookie({
      success: true,
      message: 'Item added to cart',
      itemCount: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0),
    }, sessionId)
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    let sessionId = await getSessionIdFromCookies()

    if (!sessionId) {
      sessionId = uuidv4()
    }

    const { itemId, quantity } = await request.json()

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID and quantity are required' },
        { status: 400 }
      )
    }

    const cart = await getOrCreateCart(sessionId)
    const cartItem = cart.items.find(item => item.id === itemId)

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: { id: itemId },
      })
    } else {
      // Check stock
      const availableStock = cartItem.variant.inventory
        ? cartItem.variant.inventory.quantity - cartItem.variant.inventory.reservedQuantity
        : 0

      if (quantity > availableStock) {
        return NextResponse.json(
          { error: 'Cannot add more items than available stock', availableStock },
          { status: 400 }
        )
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      })
    }

    return createResponseWithCookie({ success: true, message: 'Cart updated' }, sessionId)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  try {
    let sessionId = await getSessionIdFromCookies()

    if (!sessionId) {
      sessionId = uuidv4()
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const clearAll = searchParams.get('clearAll') === 'true'

    const cart = await getOrCreateCart(sessionId)

    if (clearAll) {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
      return createResponseWithCookie({ success: true, message: 'Cart cleared' }, sessionId)
    }

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Remove specific item
    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return createResponseWithCookie({ success: true, message: 'Item removed from cart' }, sessionId)
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}
