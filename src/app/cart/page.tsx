'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  ShoppingCart,
  Shield,
  Check
} from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart-store'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { 
    items, 
    isLoading, 
    error, 
    fetchCart, 
    updateQuantity: storeUpdateQuantity, 
    removeFromCart: storeRemoveFromCart, 
    clearCart: storeClearCart 
  } = useCartStore()

  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    setUpdating(itemId)
    await storeUpdateQuantity(itemId, newQuantity)
    setUpdating(null)
  }

  const removeItem = async (itemId: string) => {
    setUpdating(itemId)
    await storeRemoveFromCart(itemId)
    setUpdating(null)
  }

  const clearCart = async () => {
    await storeClearCart()
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    // Check if variant and product exist before accessing properties
    // This safeguards against malformed data during optimistic updates or stale state
    const price = item.variant?.price || 0
    return sum + (price * item.quantity)
  }, 0)
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const shippingThreshold = 10000 // Free shipping over Rs. 10,000
  const shippingCost = subtotal > 0 && subtotal < shippingThreshold ? 200 : 0
  const total = subtotal + shippingCost

  if (isLoading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet. 
            Start shopping to fill it up!
          </p>
          <Link href="/products">
            <Button size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearCart} className="hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
          ></div>
        </div>
        {subtotal < shippingThreshold && (
          <div className="text-center text-sm text-muted-foreground">
            Add {formatPrice(shippingThreshold - subtotal)} more for <span className="text-green-600 font-medium">FREE shipping</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className={`transition-all duration-300 hover:shadow-lg ${updating === item.id ? 'opacity-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Link href={`/products/${item.product.slug}`}>
                      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-muted rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={item.product.image || '/images/fashion-banner.webp'}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/fashion-banner.webp';
                          }}
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                          {item.product.brand || 'Sanam'}
                        </p>
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="font-bold text-xl hover:text-primary transition-colors line-clamp-2 mt-1">
                            {item.product.name}
                          </h3>
                        </Link>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors h-10 w-10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Variant Info */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.variant.colorName && (
                        <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 text-sm">
                          {item.variant.colorHex && (
                            <span 
                              className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                              style={{ backgroundColor: item.variant.colorHex }}
                            />
                          )}
                          <span className="font-medium">{item.variant.colorName}</span>
                        </Badge>
                      )}
                      <Badge variant="secondary" className="px-3 py-1 text-sm">
                        <span className="font-medium">Size:</span> {item.variant.sizeValue}
                      </Badge>
                    </div>

                    {/* Stock Warning */}
                    {!item.variant.inStock && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        Out of Stock
                      </div>
                    )}
                    {item.variant.inStock && item.variant.availableQuantity < 5 && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        Only {item.variant.availableQuantity} left
                      </div>
                    )}

                    {/* Quantity and Price Section */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-6 pt-4 border-t border-border">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                        <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-md hover:bg-background"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-md hover:bg-background"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id || item.quantity >= item.variant.availableQuantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {item.quantity >= item.variant.availableQuantity && (
                          <span className="text-xs text-muted-foreground">Max quantity reached</span>
                        )}
                      </div>

                      {/* Price Display */}
                      <div className="text-right">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(item.variant.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-sm text-muted-foreground line-through">
                              ({formatPrice(item.variant.price)} × {item.quantity})
                            </span>
                          )}
                        </div>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(item.variant.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg border-border">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Shipping
                  </span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      FREE
                    </span>
                  ) : (
                    <span className="font-medium">{formatPrice(shippingCost)}</span>
                  )}
                </div>
              </div>

              {subtotal < shippingThreshold && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 font-medium">Almost there!</p>
                      <p className="text-blue-700 text-sm mt-1">
                        Add {formatPrice(shippingThreshold - subtotal)} more for <span className="font-semibold">free shipping</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">incl. VAT</p>
              </div>

              <div className="space-y-3">
                <Link href="/checkout" className="block w-full">
                  <Button size="lg" className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg">
                    <span className="font-semibold">Proceed to Checkout</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/products" className="block w-full">
                  <Button variant="outline" size="lg" className="w-full border-2 hover:border-primary/50">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Enhanced Trust Badges */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Why Shop With Us?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-muted-foreground">Secure SSL Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-muted-foreground">30-Day Return Policy</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-muted-foreground">100% Authentic Products</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-muted-foreground">Fast Delivery</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
