'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface Brand {
  id: string
  name: string
  slug: string
  logoUrl?: string
  description?: string
  productCount: number
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands')
        const data = await response.json()
        setBrands(data || [])
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Brands</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover premium fashion brands from around the world
        </p>
      </div>

      {brands.length > 0 ? (
        <>
          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link key={brand.id} href={`/brands/${brand.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={brand.logoUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop'}
                        alt={`${brand.name} logo`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        <h2 className="text-3xl font-bold">{brand.name}</h2>
                        <p className="text-sm opacity-90 mt-2">{brand.description || 'Premium brand'}</p>
                        <span className="text-xs bg-white text-black px-3 py-1 rounded-full mt-4">
                          {brand.productCount} Products
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Featured Brands */}
          {brands.length >= 3 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Featured Brands</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brands.slice(0, 3).map((brand) => (
                  <Link key={brand.id} href={`/brands/${brand.slug}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={brand.logoUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop'}
                            alt={`${brand.name} logo`}
                            className="w-16 h-16 object-cover rounded-full"
                          />
                          <div>
                            <h3 className="text-xl font-bold">{brand.name}</h3>
                            <p className="text-sm text-muted-foreground">{brand.productCount} products</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No brands available yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Brands will appear here once added to the database.</p>
        </div>
      )}
    </div>
  )
}
