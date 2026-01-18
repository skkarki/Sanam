'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  image: string
  brand: string
  isNew: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  icon: string
  colors: string[]
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategoryAndProducts()
  }, [params.slug])

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true)
      
      // Fetch category details
      const categoryResponse = await fetch(`/api/categories`)
      const categories = await categoryResponse.json()
      const currentCategory = categories.find((c: any) => c.slug === params.slug)
      
      setCategory(currentCategory)
      
      // Fetch products for this category
      const productsResponse = await fetch(`/api/products?category=${params.slug}`)
      const productsData = await productsResponse.json()
      
      setProducts(productsData.products)
    } catch (error) {
      console.error('Error fetching category and products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Loading...</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Category not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <Link href="/categories" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
        
        <div className="bg-gradient-to-r from-primary to-primary/10 rounded-2xl p-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{category.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {category.productCount} products
              </span>
              <span className="text-muted-foreground">Category ID: {category.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Products in {category.name}</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
