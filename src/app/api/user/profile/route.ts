import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getSession } from '@/lib/auth'

// GET - Get current user's profile
export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to view your profile' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl,
        role: user.role,
        emailVerified: !!user.emailVerifiedAt,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        stats: {
          totalOrders: user._count.orders,
          totalReviews: user._count.reviews,
          wishlistItems: user._count.wishlist
        }
      }
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to update your profile' },
        { status: 401 }
      )
    }

    const { firstName, lastName, phone } = await request.json()

    // Validate input
    if (firstName !== undefined && typeof firstName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid first name' },
        { status: 400 }
      )
    }

    if (lastName !== undefined && typeof lastName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid last name' },
        { status: 400 }
      )
    }

    if (phone !== undefined && typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone })
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
