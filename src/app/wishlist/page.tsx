'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, ShoppingCart, Star, Loader2, LogIn } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface WishlistItem {
  id: string
  productId: string
  productSlug: string
  name: string
  price: number
  compareAtPrice: number | null
  discount: number
  image: string
  category: string
  brand: string | null
  inStock: boolean
  addedAt: string
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wishlist')
      const data = await response.json()

      if (response.status === 401) {
        setIsAuthenticated(false)
        setWishlist([])
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch wishlist')
      }

      setWishlist(data.items)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const removeFromWishlist = async (id: string) => {
    try {
      setRemovingId(id)
      const response = await fetch(`/api/wishlist?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove item')
      }

      setWishlist(wishlist.filter(item => item.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove item')
    } finally {
      setRemovingId(null)
    }
  }

  const addToCart = async (item: WishlistItem) => {
    try {
      setAddingToCartId(item.id)
      
      // First get the product variants to find a default variant
      const productResponse = await fetch(`/api/products?slug=${item.productSlug}`)
      if (!productResponse.ok) {
        throw new Error('Failed to fetch product details')
      }
      
      const productData = await productResponse.json()
      const products = productData.products || [productData]
      const product = products.find((p: { slug: string }) => p.slug === item.productSlug)
      
      if (!product || !product.variants || product.variants.length === 0) {
        throw new Error('Product variants not available')
      }

      // Get first in-stock variant
      const variant = product.variants.find((v: { inventory?: { quantity: number, reservedQuantity: number } }) => 
        v.inventory && (v.inventory.quantity - v.inventory.reservedQuantity) > 0
      ) || product.variants[0]

      // Add to cart
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: variant.id,
          quantity: 1
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add to cart')
      }

      alert(`${item.name} added to cart!`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setAddingToCartId(null)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading your wishlist...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <LogIn className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Please Login</h3>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your wishlist
          </p>
          <Button asChild>
            <Link href="/auth">Login / Register</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchWishlist}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Wishlist</h1>
        <p className="text-xl text-muted-foreground">
          {wishlist.length > 0 
            ? `${wishlist.length} item${wishlist.length > 1 ? 's' : ''} you're dreaming about`
            : 'Items you\'re dreaming about'
          }
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Add items to your wishlist to keep track of products you love
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative">
                  <Link href={`/products/${item.productSlug}`}>
                    <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.jpg'
                        }}
                      />
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={removingId === item.id}
                  >
                    {removingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  {item.discount > 0 && (
                    <Badge variant="destructive" className="absolute top-2 left-2">
                      -{item.discount}%
                    </Badge>
                  )}
                  {!item.inStock && (
                    <Badge variant="secondary" className="absolute top-10 left-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Link href={`/products/${item.productSlug}`}>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                {item.brand && (
                  <p className="text-xs text-muted-foreground mb-2">{item.brand}</p>
                )}
                <div className="flex items-center mb-3">
                  {renderStars(4.5)}
                  <span className="ml-2 text-sm text-muted-foreground">(4.5)</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {item.discount > 0 && item.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through mr-2">
                        Rs. {item.compareAtPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary">
                      Rs. {item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => addToCart(item)}
                  disabled={!item.inStock || addingToCartId === item.id}
                  className="w-full"
                >
                  {addingToCartId === item.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
