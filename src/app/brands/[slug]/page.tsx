'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { ArrowLeft, Star, Shield } from 'lucide-react'
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

interface Brand {
  id: string
  name: string
  slug: string
  description: string
  founded?: number
  country?: string
  website?: string
  category: string
  products: number
}

export default function BrandPage({ params }: { params: { slug: string } }) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrandAndProducts()
  }, [params.slug])

  const fetchBrandAndProducts = async () => {
    try {
      setLoading(true)
      
      // Fetch brand details
      const brandResponse = await fetch(`/api/brands`)
      const brands = await brandResponse.json()
      const currentBrand = brands.find((b: any) => b.slug === params.slug)
      
      setBrand(currentBrand)
      
      // Fetch products for this brand
      const productsResponse = await fetch(`/api/products?brand=${params.slug}`)
      const productsData = await productsResponse.json()
      
      setProducts(productsData.products)
    } catch (error) {
      console.error('Error fetching brand and products:', error)
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

  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Brand not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="mb-8">
        <Link href="/brands" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Brands
        </Link>
        
        <div className="bg-gradient-to-r from-primary to-primary/10 rounded-2xl p-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-2">{brand.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{brand.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Founded</span>
                <p className="font-medium">{brand.founded || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Country</span>
                <p className="font-medium">{brand.country || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category</span>
                <p className="font-medium">{brand.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Products</span>
                <p className="font-medium">{brand.products}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Products by {brand.name}</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found for this brand.</p>
          </div>
        )}
      </div>
    </div>
  )
}