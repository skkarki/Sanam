import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatPrice } from '@/lib/utils'

export interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    brand: string
    category: string
    price: number
    compareAtPrice?: number
    images: string[]
    description: string
    rating: number
    reviews: number
    inStock: boolean
    isNew: boolean
    isSale: boolean
    colors: string[]
    sizes: string[]
    variants?: string[]
  }
  onAddToCart?: (product: any) => void
  onWishlist?: (product: any) => void
}

export function ProductCard({ product, onAddToCart, onWishlist }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.images[0] || '/images/fashion-banner.webp'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/fashion-banner.webp';
              }}
            />
            {/* Overlays */}
            {product.isSale && (
              <Badge className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 font-semibold">
                Sale
              </Badge>
            )}
            {product.isNew && !product.isSale && (
              <Badge className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 font-semibold">
                New
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="outline" className="bg-white/90 text-white border-white">
                  Out of Stock
                </Badge>
              </div>
            )}
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              {onWishlist && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    onWishlist?.(product)
                  }}
                  className="bg-white/90 text-white hover:bg-white/90 hover:text-black h-12 w-12 rounded-full"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              )}
              {onAddToCart && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    onAddToCart?.(product)
                  }}
                  className="bg-white/90 text-white hover:bg-white/90 hover:text-black h-12 w-12 rounded-full"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews})</span>
            </div>

            {/* Brand & Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">{product.brand}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{product.category}</span>
            </div>

            {/* Product Name */}
            <h3 className="font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              {product.isSale && (
                <Badge variant="destructive">
                  {Math.round((1 - product.price / (product.compareAtPrice || product.price)) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Colors Preview */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">
                  {product.colors.length} colors available
                </span>
                <div className="flex gap-1">
                  {product.colors.slice(0, 5).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-background ring-1 ring-ring/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <div className="text-xs text-muted-foreground">
                      +{product.colors.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  onAddToCart?.(product)
                }}
                disabled={!product.inStock}
                className={cn(
                  "flex-1",
                  !product.inStock && "opacity-50 cursor-not-allowed"
                )}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  onWishlist?.(product)
                }}
                disabled={!product.inStock}
                size="icon"
                className={cn(
                  "hover:bg-primary/10 hover:text-primary",
                  !product.inStock && "opacity-50 cursor-not-allowed"
                )}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
