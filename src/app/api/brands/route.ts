import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    const formattedBrands = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      logoPublicId: brand.logoPublicId,
      websiteUrl: brand.websiteUrl,
      isFeatured: brand.isFeatured,
      productCount: brand._count.products,
    }))

    return NextResponse.json(formattedBrands)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}
