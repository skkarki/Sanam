'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  currency: string
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Brown', 'Gray']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string, productCount: number}>>([])
  const [brands, setBrands] = useState<Array<{id: string, name: string, slug: string, productCount: number}>>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Fetch categories and brands
  const fetchFilters = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands')
      ])

      const categoriesData = await categoriesRes.json()
      const brandsData = await brandsRes.json()

      setCategories(categoriesData)
      setBrands(brandsData)
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
      })

      // Add filters if selected
      selectedCategories.forEach(cat => params.append('category', cat))
      selectedBrands.forEach(brand => params.append('brand', brand))
      selectedColors.forEach(color => params.append('color', color))
      selectedSizes.forEach(size => params.append('size', size))

      const response = await fetch(`/api/products?${params}`)
      const data: ProductsResponse = await response.json()
      
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch products on component mount and when filters change
  useEffect(() => {
    fetchProducts()
  }, [pagination.page, sortBy, priceRange, selectedCategories, selectedBrands, selectedColors, selectedSizes])

  // Fetch filters on component mount
  useEffect(() => {
    fetchFilters()
  }, [])

  const handleFilterChange = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">{products.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-4">Price Range</h3>
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
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.slug}`}
                      checked={selectedCategories.includes(category.slug)}
                      onCheckedChange={() => toggleCategory(category.slug)}
                    />
                    <label
                      htmlFor={`category-${category.slug}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Brands */}
            <div>
              <h3 className="font-semibold mb-4">Brands</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.slug}`}
                      checked={selectedBrands.includes(brand.slug)}
                      onCheckedChange={() => toggleBrand(brand.slug)}
                    />
                    <label
                      htmlFor={`brand-${brand.slug}`}
                      className="text-sm cursor-pointer"
                    >
                      {brand.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sizes */}
            <div>
              <h3 className="font-semibold mb-4">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`
                      px-3 py-1 text-sm border-2 rounded-md transition-colors
                      ${selectedSizes.includes(size)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-4">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`
                      px-3 py-1 text-sm border-2 rounded-full transition-colors
                      ${selectedColors.includes(color)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                      }
                    `}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            {/* Mobile Filter Trigger */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
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
                    <h3 className="font-semibold mb-4">Price Range</h3>
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
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-category-${category.slug}`}
                            checked={selectedCategories.includes(category.slug)}
                            onCheckedChange={() => toggleCategory(category.slug)}
                          />
                          <label
                            htmlFor={`mobile-category-${category.slug}`}
                            className="text-sm cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Brands */}
                  <div>
                    <h3 className="font-semibold mb-4">Brands</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-brand-${brand.slug}`}
                            checked={selectedBrands.includes(brand.slug)}
                            onCheckedChange={() => toggleBrand(brand.slug)}
                          />
                          <label
                            htmlFor={`mobile-brand-${brand.slug}`}
                            className="text-sm cursor-pointer"
                          >
                            {brand.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Sizes */}
                  <div>
                    <h3 className="font-semibold mb-4">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`
                            px-3 py-1 text-sm border-2 rounded-md transition-colors
                            ${selectedSizes.includes(size)
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary'
                            }
                          `}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Colors */}
                  <div>
                    <h3 className="font-semibold mb-4">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`
                            px-3 py-1 text-sm border-2 rounded-full transition-colors
                            ${selectedColors.includes(color)
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary'
                            }
                          `}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full">Apply Filters</Button>
                  <Button variant="outline" className="w-full">Clear All</Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
