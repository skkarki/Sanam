import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getSession } from '@/lib/auth'

// GET - Get user's addresses
export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to view your addresses' },
        { status: 401 }
      )
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.userId },
      orderBy: [
        { isDefaultShipping: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to add an address' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      label,
      firstName,
      lastName,
      company,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      countryCode,
      phone,
      isDefaultShipping,
      isDefaultBilling
    } = body

    // Validate required fields
    if (!firstName || !lastName || !addressLine1 || !city || !state || !postalCode || !countryCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If setting as default, remove default from other addresses
    if (isDefaultShipping) {
      await prisma.address.updateMany({
        where: { userId: session.userId, isDefaultShipping: true },
        data: { isDefaultShipping: false }
      })
    }

    if (isDefaultBilling) {
      await prisma.address.updateMany({
        where: { userId: session.userId, isDefaultBilling: true },
        data: { isDefaultBilling: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        label: label || null,
        firstName,
        lastName,
        company: company || null,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        postalCode,
        countryCode,
        phone: phone || null,
        isDefaultShipping: isDefaultShipping || false,
        isDefaultBilling: isDefaultBilling || false
      }
    })

    return NextResponse.json({
      message: 'Address created successfully',
      address
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}

// PUT - Update address
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to update an address' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Verify address belongs to user
    const existing = await prisma.address.findFirst({
      where: { id, userId: session.userId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // If setting as default, remove default from other addresses
    if (updateData.isDefaultShipping) {
      await prisma.address.updateMany({
        where: { userId: session.userId, isDefaultShipping: true, id: { not: id } },
        data: { isDefaultShipping: false }
      })
    }

    if (updateData.isDefaultBilling) {
      await prisma.address.updateMany({
        where: { userId: session.userId, isDefaultBilling: true, id: { not: id } },
        data: { isDefaultBilling: false }
      })
    }

    const address = await prisma.address.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      message: 'Address updated successfully',
      address
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

// DELETE - Delete address
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to delete an address' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Verify address belongs to user
    const existing = await prisma.address.findFirst({
      where: { id, userId: session.userId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    await prisma.address.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
