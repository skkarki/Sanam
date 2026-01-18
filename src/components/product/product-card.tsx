'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, ShoppingCart, Eye, Loader2 } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

interface ProductCardProps {
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

export function ProductCard({ 
  id, 
  name, 
  slug, 
  price, 
  compareAtPrice, 
  image, 
  brand, 
  isNew = false,
  isFeatured = false,
  rating = 0,
  reviewCount = 0
}: ProductCardProps) {
  const router = useRouter()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setWishlistLoading(true)
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${id}`, {
          method: 'DELETE'
        })
        
        if (response.status === 401) {
          router.push(`/auth?redirect=/products/${slug}`)
          return
        }
        
        if (response.ok) {
          setIsInWishlist(false)
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id })
        })
        
        if (response.status === 401) {
          router.push(`/auth?redirect=/products/${slug}`)
          return
        }
        
        if (response.ok || response.status === 409) {
          // 409 means already in wishlist
          setIsInWishlist(true)
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error)
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/products/${slug}`)
  }

  return (
    <div className="group relative bg-background rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              New
            </Badge>
          )}
          {isFeatured && (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Featured
            </Badge>
          )}
          {compareAtPrice && compareAtPrice > price && (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
              Sale
            </Badge>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="icon" 
            variant={isInWishlist ? "default" : "outline"}
            className={`h-8 w-8 rounded-full ${isInWishlist ? 'bg-red-500 hover:bg-red-600 border-red-500' : ''}`}
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
          >
            {wishlistLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-white' : ''}`} />
            )}
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 rounded-full"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="space-y-2">
          {brand && (
            <Badge variant="secondary" className="text-xs">
              {brand}
            </Badge>
          )}
          
          <Link href={`/products/${slug}`} className="hover:underline">
            <h3 className="font-medium line-clamp-2">{name}</h3>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatPrice(price)}</span>
            {compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4" 
          size="sm"
          onClick={() => router.push(`/products/${slug}`)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          View Product
        </Button>
      </div>
    </div>
  )
}
