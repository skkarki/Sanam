'use client'

import { useState, useEffect } from 'react'
import { HeroSection } from '@/components/hero-section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Star, ShoppingBag, TrendingUp, Shield, Truck, Heart, Loader2, Zap, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

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
  description?: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  productCount: number
}

const TrustBar = () => (
  <section className="py-10 border-y bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: Truck, title: "Free Shipping", desc: "On orders over Rs. 10k" },
          { icon: Shield, title: "Secure Payment", desc: "100% protected checkout" },
          { icon: CheckCircle, title: "Authentic Product", desc: "Sourced directly from brands" },
          { icon: Zap, title: "Fast Delivery", desc: "2-4 business days" }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4 justify-center md:justify-start"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products, new arrivals, and categories in parallel
        const [featuredRes, newRes, categoriesRes] = await Promise.all([
          fetch('/api/products?limit=4&sort=featured'),
          fetch('/api/products?limit=4&isNew=true&sort=newest'),
          fetch('/api/categories')
        ])

        const featuredData = await featuredRes.json()
        const newData = await newRes.json()
        const categoriesData = await categoriesRes.json()

        setFeaturedProducts(featuredData.products || [])
        setNewArrivals(newData.products || [])
        // Filter to only show main categories (Men, Women, Kids)
        const mainCategories = (categoriesData || []).filter(
          (cat: Category) => ['men', 'women', 'kids'].includes(cat.slug)
        )
        setCategories(mainCategories)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Signals */}
      <TrustBar />

      {/* Shop by Category */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Curated Collections</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our handpicked selections for every style and occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : categories.length > 0 ? (
              categories.map((category, idx) => (
                <Link key={category.id} href={`/categories/${category.slug}`} className="block group">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative aspect-[3/4] overflow-hidden rounded-2xl"
                  >
                    <img
                      src={category.image || '/images/fashion-banner.webp'}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                      <p className="text-white/80 mb-4 line-clamp-1">
                        {category.description || `Explore ${category.name} Collection`}
                      </p>
                      <div className="flex items-center font-medium">
                        Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              // Fallback categories
               ['Men', 'Women', 'Kids'].map((name, idx) => (
                <Link key={name} href={`/categories/${name.toLowerCase()}`} className="block group">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative aspect-[3/4] overflow-hidden rounded-2xl"
                  >
                     <img
                      src={
                        name === 'Men' ? "/images/fashion-style.webp" :
                        name === 'Women' ? "/images/fashion-banner.webp" :
                        "/images/fashion-collection-hero.webp"
                      }
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-3xl font-bold mb-2">{name}</h3>
                      <p className="text-white/80 mb-4">Latest Trends & Styles</p>
                      <div className="flex items-center font-medium">
                        Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Hand-picked favorites just for you</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="hidden sm:flex hover:bg-transparent hover:text-primary p-0">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border-none shadow-sm h-full flex flex-col">
                    <Link href={`/products/${product.slug}`} className="block flex-1">
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
                          <img
                            src={product.image || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.compareAtPrice && (
                            <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">
                              Sale
                            </Badge>
                          )}
                          
                          {/* Quick Actions Overlay */}
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                             <Button size="sm" variant="secondary" className="shadow-lg">
                               <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
                             </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="text-sm text-muted-foreground mb-1">{product.brand || 'Sanam'}</div>
                          <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold">Rs. {product.price.toLocaleString()}</span>
                              {product.compareAtPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  Rs. {product.compareAtPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-yellow-500">
                              <Star className="h-4 w-4 fill-current mr-1" />
                              <span className="text-foreground font-medium">{product.rating}</span>
                            </div>
                          </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No featured products found.
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="w-full">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fresh Arrivals</h2>
            <p className="text-muted-foreground text-lg">Check out the latest additions to our collection</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border-none shadow-sm h-full flex flex-col">
                    <Link href={`/products/${product.slug}`} className="block flex-1">
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
                          <img
                            src={product.image || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
                            New
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">Rs. {product.price.toLocaleString()}</span>
                            <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary">
                              <Heart className="h-5 w-5" />
                            </Button>
                          </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
                </motion.div>
              ))}
            </div>
          ) : (
             <div className="text-center py-12 text-muted-foreground">
              No new arrivals found.
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center text-primary-foreground"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Join the Sanam Family
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Unlock 10% off your first order plus exclusive access to new launches, sales, and style tips.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full text-foreground bg-background placeholder:text-muted-foreground border-2 border-transparent focus:outline-none focus:border-white/50 shadow-lg"
              />
              <Button size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-lg">
                Subscribe
              </Button>
            </form>
            
            <p className="text-sm mt-6 opacity-75">
              No spam, ever. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
