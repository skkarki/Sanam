'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  image: string
  brand?: string
  isNew: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
}

export default function WomenCategoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch women's products (categorySlug=women)
        const response = await fetch('/api/products?categorySlug=women&limit=20')
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Women</h1>
        <p className="text-muted-foreground">Discover the latest women's fashion collection at Sanam International</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-4">Price Range (NPR)</h3>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={50000}
                  step={500}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Rs. {priceRange[0].toLocaleString()}</span>
                  <span>Rs. {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a href="/categories/men" className="text-muted-foreground hover:text-foreground transition-colors">Men</a></li>
                <li><a href="/categories/kids" className="text-muted-foreground hover:text-foreground transition-colors">Kids</a></li>
                <li><a href="/products" className="text-muted-foreground hover:text-foreground transition-colors">All Products</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile Filter Trigger */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="mb-4 lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-4">Price Range (NPR)</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={50000}
                      step={500}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Rs. {priceRange[0].toLocaleString()}</span>
                      <span>Rs. {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>Apply Filters</Button>
                <Button variant="outline" className="w-full" onClick={() => setPriceRange([0, 50000])}>Clear All</Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Products */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
              <p className="text-sm text-muted-foreground mt-2">Products will appear here once added to the database.</p>
            </div>
          )}

          {/* Load More */}
          {filteredProducts.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
