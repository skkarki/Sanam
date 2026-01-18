import { notFound } from 'next/navigation'
import { prisma } from '@/lib/database'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductActions } from '@/components/product/ProductActions'
import { ProductCard } from '@/components/product/product-card'
import { formatPrice } from '@/lib/utils'
import { getImageUrl } from '@/lib/cloudinary'

interface Product {
  id: string
  name: string
  slug: string
  brand: string
  category: string
  price: number
  compareAtPrice?: number
  description: string
  details: string[]
  tags: string[]
  inStock: boolean
  isNew: boolean
  isSale: boolean
  rating: number
  reviews: number
  colors: string[]
  sizes: string[]
  images: string[]
}

async function getRecommendedProducts(currentProduct: any, userId?: string) {
  try {
    // Try to use the new simple recommendation algorithm
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/recommendations/simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId || 'anonymous',
        currentProductId: currentProduct.id,
        limit: 4
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.recommendations || [];
    }
    
    // Fallback to the original simple recommendation logic
    console.warn('Using fallback recommendation system');
    
    // 1. Fetch products in the same category (excluding current)
    let recommended = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        id: { not: currentProduct.id },
        isActive: true,
      },
      take: 4,
      include: {
        category: true,
        brand: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    })

    // 2. If not enough, fetch products from the same brand
    if (recommended.length < 4) {
      const brandProducts = await prisma.product.findMany({
        where: {
          brandId: currentProduct.brandId,
          id: { notIn: [currentProduct.id, ...recommended.map(p => p.id)] },
          isActive: true,
        },
        take: 4 - recommended.length,
        include: {
          category: true,
          brand: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      })
      recommended = [...recommended, ...brandProducts]
    }

    // 3. If still not enough, fetch any active products
    if (recommended.length < 4) {
      const otherProducts = await prisma.product.findMany({
        where: {
          id: { notIn: [currentProduct.id, ...recommended.map(p => p.id)] },
          isActive: true,
        },
        take: 4 - recommended.length,
        include: {
          category: true,
          brand: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc', // Show newest products as fallback
        }
      })
      recommended = [...recommended, ...otherProducts]
    }

    return recommended;
  } catch (error) {
    console.error('Error getting recommended products:', error);
    
    // Fallback to the original simple recommendation logic
    // 1. Fetch products in the same category (excluding current)
    let recommended = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        id: { not: currentProduct.id },
        isActive: true,
      },
      take: 4,
      include: {
        category: true,
        brand: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    })

    // 2. If not enough, fetch products from the same brand
    if (recommended.length < 4) {
      const brandProducts = await prisma.product.findMany({
        where: {
          brandId: currentProduct.brandId,
          id: { notIn: [currentProduct.id, ...recommended.map(p => p.id)] },
          isActive: true,
        },
        take: 4 - recommended.length,
        include: {
          category: true,
          brand: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      })
      recommended = [...recommended, ...brandProducts]
    }

    // 3. If still not enough, fetch any active products
    if (recommended.length < 4) {
      const otherProducts = await prisma.product.findMany({
        where: {
          id: { notIn: [currentProduct.id, ...recommended.map(p => p.id)] },
          isActive: true,
        },
        take: 4 - recommended.length,
        include: {
          category: true,
          brand: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc', // Show newest products as fallback
        }
      })
      recommended = [...recommended, ...otherProducts]
    }

    return recommended;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const resolvedParams = await params
  const product = await prisma.product.findFirst({
    where: {
      slug: resolvedParams.slug,
      isActive: true,
    },
    include: {
      brand: true,
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    }
  })

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    }
  }

  return {
    title: `${product.name} - Sanam International`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params
  const product = await prisma.product.findFirst({
    where: {
      slug: resolvedParams.slug,
      isActive: true,
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: { displayOrder: 'asc' },
      },
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          colorName: true,
          colorHex: true,
          sizeValue: true,
          sizeLabel: true,
        }
      },
    }
  })

  if (!product) {
    notFound()
  }

  // Extract unique colors and sizes from variants
  const uniqueColors = [...new Set(product.variants.map(v => v.colorName).filter(Boolean))]
  const uniqueSizes = [...new Set(product.variants.map(v => v.sizeValue).filter(Boolean))]

  // Get user session if available for personalized recommendations
  let userId: string | undefined;
  try {
    // Use the session function from our custom auth system
    const { getSession } = await import('@/lib/auth');
    const session = await getSession();
    if (session?.userId) {
      userId = session.userId;
    }
  } catch (error) {
    // Session not available, proceed without user ID
    // This is expected when auth system is not configured
  }

  // Get recommended products
  const recommendedProducts = await getRecommendedProducts(product, userId)

  // Format product for the component
  const formattedProduct: Product = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand?.name || 'Unknown',
    category: product.category.name,
    price: product.basePrice,
    compareAtPrice: product.compareAtPrice || undefined,
    description: product.description || '',
    details: product.shortDescription ? product.shortDescription.split(',') : [],
    tags: product.tags ? product.tags.split(',') : [],
    inStock: product.isActive,
    isNew: product.isNewArrival,
    isSale: !!product.compareAtPrice,
    rating: 4.5, // Will be calculated from reviews later
    reviews: 0, // Will be calculated from reviews later
    colors: uniqueColors.length > 0 ? uniqueColors : ['Default'],
    sizes: uniqueSizes.length > 0 ? uniqueSizes : ['One Size'],
    images: product.images.length > 0
      ? product.images.map(img => getImageUrl(img.imagePath))
      : ['/placeholder.jpg'],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-xl overflow-hidden">
            <img
              src={formattedProduct.images[0] || '/placeholder.jpg'}
              alt={formattedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {formattedProduct.images.slice(0, 4).map((image, index) => (
              <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${formattedProduct.name} - View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="space-y-4">
            {/* Brand and Category */}
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{formattedProduct.brand}</Badge>
              <Badge variant="outline">{formattedProduct.category}</Badge>
              {formattedProduct.isNew && (
                <Badge className="bg-green-100 text-green-700">New</Badge>
              )}
              {formattedProduct.isSale && (
                <Badge className="bg-red-100 text-red-700">Sale</Badge>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold">{formattedProduct.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{formatPrice(formattedProduct.price)}</span>
              {formattedProduct.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(formattedProduct.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(formattedProduct.rating) ? 'text-yellow-400' : 'text-muted-foreground'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-muted-foreground">
                {formattedProduct.rating} ({formattedProduct.reviews} reviews)
              </span>
            </div>

            <Separator />

            {/* Description */}
            <p className="text-muted-foreground">
              {formattedProduct.description}
            </p>

            <Separator />

            {/* Product Actions - Size, Color, Quantity, Add to Cart, Wishlist */}
            <ProductActions
              productId={formattedProduct.id}
              productSlug={formattedProduct.slug}
              productName={formattedProduct.name}
              variants={product.variants}
            />
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="details" className="mt-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Product Details</h3>
          <ul className="space-y-2">
            {formattedProduct.details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {detail}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="reviews" className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product.</p>
        </TabsContent>
        <TabsContent value="shipping" className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Free shipping on orders over {formatPrice(10000)}
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Standard delivery: 3-5 business days
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Express delivery: 1-2 business days
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Cash on delivery available
            </li>
          </ul>
        </TabsContent>
      </Tabs>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <section className="mt-16 border-t pt-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((prod: any) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                name={prod.name}
                slug={prod.slug}
                price={prod.basePrice}
                compareAtPrice={prod.compareAtPrice || undefined}
                image={prod.images[0] ? getImageUrl(prod.images[0].imagePath) : '/placeholder.jpg'}
                brand={prod.brand?.name}
                isNew={prod.isNewArrival}
                isFeatured={prod.isFeatured}
                rating={4.5} // Placeholder rating
                reviewCount={0} // Placeholder count
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}