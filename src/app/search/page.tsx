'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Search, 
  Loader2, 
  Mic, 
  MicOff, 
  X, 
  SlidersHorizontal,
  History,
  TrendingUp,
  Sparkles,
  Filter,
  Grid3X3,
  LayoutList
} from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  image: string
  brand?: string
  isNew?: boolean
  isFeatured?: boolean
  rating?: number
  reviewCount?: number
}

interface Category {
  id: string
  name: string
  slug: string
  productCount: number
}

interface Brand {
  id: string
  name: string
  slug: string
  productCount: number
}

export default function AdvancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  
  // Filter states
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState('relevance')
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showSaleOnly, setShowSaleOnly] = useState(false)

  // Voice search states
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Search history
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  
  // Popular and trending searches
  const trendingSearches = [
    'Nike Air Max', 'Summer Collection', 'Adidas Shoes', 
    'Formal Wear', 'Kids Fashion', 'Sports Wear'
  ]

  const suggestions = [
    'nike shoes', 'adidas t-shirt', 'summer dress', 
    'kids sneakers', 'formal shirt', 'winter jacket',
    'running shoes', 'casual wear', 'denim jeans'
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Brown', 'Gray']

  // Initialize voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setVoiceSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Load search history from localStorage
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Fetch categories and brands
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands')
        ])
        const catData = await catRes.json()
        const brandData = await brandRes.json()
        setCategories(catData || [])
        setBrands(brandData || [])
      } catch (error) {
        console.error('Error fetching filters:', error)
      }
    }
    fetchFilters()
  }, [])

  // Search function
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() && selectedCategories.length === 0 && selectedBrands.length === 0) {
      return
    }

    setIsSearching(true)
    setShowSuggestions(false)

    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategories.length) params.append('category', selectedCategories.join(','))
      if (selectedBrands.length) params.append('brand', selectedBrands.join(','))
      if (selectedColors.length) params.append('color', selectedColors.join(','))
      if (selectedSizes.length) params.append('size', selectedSizes.join(','))
      params.append('minPrice', priceRange[0].toString())
      params.append('maxPrice', priceRange[1].toString())
      params.append('sort', sortBy)
      if (showNewOnly) params.append('isNew', 'true')
      params.append('limit', '24')

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      let results = data.products || []
      
      // Filter sale items client-side
      if (showSaleOnly) {
        results = results.filter((p: Product) => p.compareAtPrice && p.compareAtPrice > p.price)
      }

      setSearchResults(results)

      // Save to search history
      if (searchQuery && !searchHistory.includes(searchQuery)) {
        const newHistory = [searchQuery, ...searchHistory.slice(0, 9)]
        setSearchHistory(newHistory)
        localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      }
    } catch (error) {
      console.error('Error searching products:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortBy, showNewOnly, showSaleOnly, searchHistory])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2 || selectedCategories.length || selectedBrands.length || selectedColors.length || selectedSizes.length) {
        handleSearch()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategories, selectedBrands, selectedColors, selectedSizes, priceRange, sortBy, showNewOnly, showSaleOnly, handleSearch])

  // Voice search toggle
  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedColors([])
    setSelectedSizes([])
    setPriceRange([0, 50000])
    setShowNewOnly(false)
    setShowSaleOnly(false)
    setSortBy('relevance')
  }

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase()) && s.toLowerCase() !== searchQuery.toLowerCase()
  )

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + 
    selectedColors.length + selectedSizes.length +
    (showNewOnly ? 1 : 0) + (showSaleOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0)

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-4">Price Range (NPR)</h3>
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

      <Separator />

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, cat.slug])
                  } else {
                    setSelectedCategories(selectedCategories.filter(c => c !== cat.slug))
                  }
                }}
              />
              <label htmlFor={`cat-${cat.slug}`} className="text-sm cursor-pointer flex-1">
                {cat.name}
              </label>
              <span className="text-xs text-muted-foreground">({cat.productCount})</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-4">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand.slug}`}
                checked={selectedBrands.includes(brand.slug)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBrands([...selectedBrands, brand.slug])
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand.slug))
                  }
                }}
              />
              <label htmlFor={`brand-${brand.slug}`} className="text-sm cursor-pointer flex-1">
                {brand.name}
              </label>
              <span className="text-xs text-muted-foreground">({brand.productCount})</span>
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
              onClick={() => {
                setSelectedSizes(prev =>
                  prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                )
              }}
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
              onClick={() => {
                setSelectedColors(prev =>
                  prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
                )
              }}
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

      <Separator />

      {/* Quick Filters */}
      <div>
        <h3 className="font-semibold mb-4">Quick Filters</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="newOnly"
              checked={showNewOnly}
              onCheckedChange={(checked) => setShowNewOnly(!!checked)}
            />
            <label htmlFor="newOnly" className="text-sm cursor-pointer">
              New Arrivals Only
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="saleOnly"
              checked={showSaleOnly}
              onCheckedChange={(checked) => setShowSaleOnly(!!checked)}
            />
            <label htmlFor="saleOnly" className="text-sm cursor-pointer">
              On Sale Only
            </label>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Advanced Search
        </h1>
        <p className="text-xl text-muted-foreground">
          Find exactly what you're looking for with powerful filters
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products, brands, categories... (or use voice search)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-12 pr-32 h-14 text-lg"
          />
          <div className="absolute right-2 top-2 flex items-center gap-2">
            {voiceSupported && (
              <Button
                variant={isListening ? "default" : "ghost"}
                size="icon"
                onClick={toggleVoiceSearch}
                className={isListening ? "animate-pulse bg-red-500 hover:bg-red-600" : ""}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            )}
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchQuery('')
                  setSearchResults([])
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button onClick={handleSearch} size="lg" disabled={isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-2 z-50">
              <CardContent className="p-2">
                {filteredSuggestions.slice(0, 6).map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-2 hover:bg-muted rounded-lg flex items-center gap-2"
                    onClick={() => {
                      setSearchQuery(suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    {suggestion}
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Voice Search Indicator */}
        {isListening && (
          <div className="text-center mt-4 text-primary animate-pulse">
            <Mic className="h-6 w-6 inline mr-2" />
            Listening... Speak now
          </div>
        )}
      </div>

      {/* Quick Tags */}
      {!searchQuery && searchResults.length === 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchHistory([])
                    localStorage.removeItem('searchHistory')
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setSearchQuery(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <Badge>{activeFiltersCount}</Badge>
                )}
              </div>
              <FilterContent />
            </CardContent>
          </Card>
        </aside>

        {/* Results Area */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <h2 className="text-lg font-bold mb-4">Filters</h2>
                  <FilterContent />
                </SheetContent>
              </Sheet>

              <span className="text-muted-foreground">
                {searchResults.length} results
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map(cat => (
                <Badge key={cat} variant="secondary" className="gap-1">
                  {cat}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}
                  />
                </Badge>
              ))}
              {selectedBrands.map(brand => (
                <Badge key={brand} variant="secondary" className="gap-1">
                  {brand}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                  />
                </Badge>
              ))}
              {selectedColors.map(color => (
                <Badge key={color} variant="secondary" className="gap-1">
                  {color}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                  />
                </Badge>
              ))}
              {selectedSizes.map(size => (
                <Badge key={size} variant="secondary" className="gap-1">
                  {size}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== size))}
                  />
                </Badge>
              ))}
              {showNewOnly && (
                <Badge variant="secondary" className="gap-1">
                  New Only
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setShowNewOnly(false)} />
                </Badge>
              )}
              {showSaleOnly && (
                <Badge variant="secondary" className="gap-1">
                  On Sale
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setShowSaleOnly(false)} />
                </Badge>
              )}
            </div>
          )}

          {/* Loading */}
          {isSearching && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Results Grid */}
          {!isSearching && searchResults.length > 0 && (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-4"
            }>
              {searchResults.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 group overflow-hidden">
                    <CardContent className={viewMode === 'grid' ? "p-0" : "p-4 flex gap-4"}>
                      <div className={viewMode === 'grid' ? "" : "w-24 h-24 flex-shrink-0"}>
                        <img
                          src={product.image || '/placeholder.jpg'}
                          alt={product.name}
                          className={`object-cover group-hover:scale-105 transition-transform ${
                            viewMode === 'grid' ? 'w-full aspect-square' : 'w-full h-full rounded-lg'
                          }`}
                        />
                      </div>
                      <div className={viewMode === 'grid' ? "p-4" : "flex-1"}>
                        {product.brand && (
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                        )}
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-primary">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              Rs. {product.compareAtPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {product.isNew && (
                          <Badge className="mt-2 bg-green-500">New</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isSearching && searchResults.length === 0 && (searchQuery || activeFiltersCount > 0) && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add TypeScript declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
