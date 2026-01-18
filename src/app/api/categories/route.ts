import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Helper function to get category image URLs
function getCategoryImageUrl(slug: string): string {
  const categoryImages: Record<string, string> = {
    'men': '/uploads/categories/men-fashion.jpg',
    'women': '/uploads/categories/women-fashion.jpg',
    'kids': '/uploads/categories/kids-fashion.jpg',
  }
  
  return categoryImages[slug] || '/placeholder.jpg'
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        parent: true,
        _count: {
          select: { products: true }
        }
      }
    })

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: getCategoryImageUrl(category.slug),
      parentId: category.parentId,
      parentName: category.parent?.name,
      productCount: category._count.products,
      displayOrder: category.displayOrder,
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}