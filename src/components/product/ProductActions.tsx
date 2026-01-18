'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Loader2, Plus, Minus, Check } from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart-store'

interface Variant {
  id: string
  colorName: string
  colorHex: string | null
  sizeValue: string
  sizeLabel: string | null
}

interface ProductActionsProps {
  productId: string
  productSlug: string
  variants: Variant[]
  productName: string
}

export function ProductActions({ 
  productId, 
  productSlug, 
  variants,
  productName 
}: ProductActionsProps) {
  const router = useRouter()
  const { addToCart } = useCartStore()
  
  // Extract unique colors and sizes
  const uniqueColors = [...new Set(variants.map(v => v.colorName).filter(Boolean))]
  const uniqueSizes = [...new Set(variants.map(v => v.sizeValue).filter(Boolean))]
  
  // State
  const [selectedColor, setSelectedColor] = useState<string>(uniqueColors[0] || '')
  const [selectedSize, setSelectedSize] = useState<string>(uniqueSizes[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const [cartSuccess, setCartSuccess] = useState(false)
  const [wishlistSuccess, setWishlistSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Find matching variant based on selected color and size
  const selectedVariant = variants.find(
    v => v.colorName === selectedColor && v.sizeValue === selectedSize
  ) || variants[0]

  // Check if product is in wishlist on mount
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist')
        if (response.ok) {
          const data = await response.json()
          const isInList = data.items?.some(
            (item: { productId: string }) => item.productId === productId
          )
          setIsInWishlist(isInList)
        }
      } catch (err) {
        // Silently fail - user might not be logged in
        console.log('Could not check wishlist status')
      }
    }
    checkWishlist()
  }, [productId])

  // Get available sizes for selected color
  const availableSizesForColor = variants
    .filter(v => v.colorName === selectedColor)
    .map(v => v.sizeValue)

  // Get available colors for selected size
  const availableColorsForSize = variants
    .filter(v => v.sizeValue === selectedSize)
    .map(v => v.colorName)

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setError('Please select a size and color')
      return
    }

    setAddingToCart(true)
    setError(null)
    setCartSuccess(false)

    try {
      await addToCart(selectedVariant.id, quantity)
      setCartSuccess(true)
      setTimeout(() => setCartSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    setAddingToWishlist(true)
    setError(null)
    setWishlistSuccess(false)

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: 'DELETE'
        })

        if (response.status === 401) {
          router.push(`/auth?redirect=/products/${productSlug}`)
          return
        }

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to remove from wishlist')
        }

        setIsInWishlist(false)
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })

        if (response.status === 401) {
          router.push(`/auth?redirect=/products/${productSlug}`)
          return
        }

        const data = await response.json()

        if (!response.ok) {
          if (data.alreadyExists) {
            setIsInWishlist(true)
            return
          }
          throw new Error(data.error || 'Failed to add to wishlist')
        }

        setIsInWishlist(true)
        setWishlistSuccess(true)
        setTimeout(() => setWishlistSuccess(false), 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wishlist')
    } finally {
      setAddingToWishlist(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {uniqueSizes.length > 0 && uniqueSizes[0] !== 'One Size' && (
        <div>
          <h3 className="font-semibold mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueSizes.map((size) => {
              const isAvailable = availableSizesForColor.includes(size)
              const isSelected = selectedSize === size
              
              return (
                <Button
                  key={size}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`px-4 ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => isAvailable && setSelectedSize(size)}
                  disabled={!isAvailable}
                >
                  {size}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {uniqueColors.length > 0 && uniqueColors[0] !== 'Default' && (
        <div>
          <h3 className="font-semibold mb-3">
            Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map((color) => {
              const isAvailable = availableColorsForSize.includes(color)
              const isSelected = selectedColor === color
              const variant = variants.find(v => v.colorName === color)
              const colorHex = variant?.colorHex
              
              return (
                <Button
                  key={color}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`px-4 ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => isAvailable && setSelectedColor(color)}
                  disabled={!isAvailable}
                >
                  {colorHex && (
                    <span 
                      className="w-4 h-4 rounded-full mr-2 border"
                      style={{ backgroundColor: colorHex }}
                    />
                  )}
                  {color}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <h3 className="font-semibold mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Messages */}
      {cartSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <Check className="h-4 w-4" />
          {productName} added to cart!
        </div>
      )}

      {wishlistSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <Check className="h-4 w-4" />
          Added to your wishlist!
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          size="lg" 
          className="flex-1"
          onClick={handleAddToCart}
          disabled={addingToCart || !selectedVariant}
        >
          {addingToCart ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
        
        <Button 
          size="lg" 
          variant={isInWishlist ? 'default' : 'outline'}
          onClick={handleAddToWishlist}
          disabled={addingToWishlist}
          className={isInWishlist ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {addingToWishlist ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          )}
          <span className="ml-2 hidden sm:inline">
            {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </span>
        </Button>
      </div>

      {/* Selected Variant Info */}
      {selectedVariant && (
        <p className="text-sm text-muted-foreground">
          Selected: {selectedColor} / {selectedSize}
          {selectedVariant.sizeLabel && ` (${selectedVariant.sizeLabel})`}
        </p>
      )}
    </div>
  )
}
