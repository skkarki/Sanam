export interface Product {
  id: string
  name: string
  slug: string
  brand: string
  brandSlug: string
  category: string
  categorySlug: string
  price: number
  compareAtPrice?: number
  images: string[]
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
  variants?: string[]
}

export interface Brand {
  id: string
  name: string
  slug: string
  description: string
  logo?: string
  founded?: number
  country?: string
  website?: string
  category: string
  products: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  icon: string
  colors: string[]
}

export interface CartItem {
  id: string
  name: string
  variant: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  customer: string
  customerEmail: string
  date: string
  items: number
  total: string
  status: 'completed' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment: string
  shipping: string
  location: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  joined: string
  totalOrders: number
  totalSpent: string
  status: 'active' | 'inactive'
  lastOrder: string
}

export interface AdminStats {
  totalOrders: number
  totalSales: string
  totalProducts: number
  totalCustomers: number
  conversionRate: string
  averageOrderValue: string
  growthRate: string
}

export interface SearchFilters {
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  color?: string
  size?: string
  inStock?: boolean
}

export interface AnalyticsData {
  overview: {
    totalRevenue: string
    totalOrders: number
    totalCustomers: number
    conversionRate: string
    averageOrderValue: string
    growthRate: string
  }
  sales: {
    period: string
    revenue: string
    orders: number
    growth: string
  }[]
  topProducts: {
    name: string
    sold: number
    revenue: string
    stock: number
  }[]
  categories: {
    name: string
    orders: number
    revenue: string
    growth: string
  }[]
  conversionFunnel: {
    pageViews: number
    addToCart: number
    checkout: number
    purchase: number
  }
}
