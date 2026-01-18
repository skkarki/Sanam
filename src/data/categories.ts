export interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  icon: string
  colors: string[]
}

export const categories: Category[] = [
  {
    id: 'men',
    name: 'Men',
    slug: 'men',
    description: 'Discover the latest men\'s fashion, including casual wear, formal attire, sportswear, and accessories designed for the modern man.',
    productCount: 856,
    icon: '👔',
    colors: ['#000000', '#1a1a1a', '#2563eb'],
  },
  {
    id: 'women',
    name: 'Women',
    slug: 'women',
    description: 'Explore trendy women\'s fashion, from everyday essentials to elegant occasion wear, featuring the latest styles and comfortable fits.',
    productCount: 1243,
    icon: '👗',
    colors: ['#ec4899', '#f472b6', '#8b5cf6'],
  },
  {
    id: 'kids',
    name: 'Kids',
    slug: 'kids',
    description: 'Shop adorable and durable clothing for children of all ages, from playful casual outfits to smart school wear, all at family-friendly prices.',
    productCount: 432,
    icon: '🧒',
    colors: ['#fbbf24', '#10b981', '#06b6d4'],
  },
]
