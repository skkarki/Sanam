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

export const brands: Brand[] = [
  {
    id: 'nike',
    name: 'Nike',
    slug: 'nike',
    description: 'Just Do It. The world\'s leading sportswear brand, known for innovation and iconic sneakers.',
    founded: 1964,
    country: 'USA',
    website: 'https://www.nike.com',
    category: 'Sportswear',
    products: 42,
  },
  {
    id: 'adidas',
    name: 'Adidas',
    slug: 'adidas',
    description: 'Impossible is Nothing. A global sportswear brand famous for its three-stripe logo and athletic apparel.',
    founded: 1949,
    country: 'Germany',
    website: 'https://www.adidas.com',
    category: 'Sportswear',
    products: 38,
  },
  {
    id: 'puma',
    name: 'Puma',
    slug: 'puma',
    description: 'Forever Faster. A German multinational company that designs and manufactures athletic and casual footwear.',
    founded: 1948,
    country: 'Germany',
    website: 'https://www.puma.com',
    category: 'Sportswear',
    products: 25,
  },
  {
    id: 'sanam-international',
    name: 'Sanam International',
    slug: 'sanam-international',
    description: 'Your Style, Your Story. Nepal\'s premier fashion retailer offering quality clothing, shoes, and accessories for men, women, and kids.',
    founded: 2010,
    country: 'Nepal',
    website: 'https://sanaminternational.com',
    category: 'Fashion Retailer',
    products: 500,
  },
  {
    id: 'levis',
    name: 'Levi\'s',
    slug: 'levis',
    description: 'Quality Never Goes Out of Style. An American clothing company known worldwide for its Levi\'s brand of denim jeans.',
    founded: 1853,
    country: 'USA',
    website: 'https://www.levi.com',
    category: 'Denim',
    products: 35,
  },
  {
    id: 'gap',
    name: 'GAP',
    slug: 'gap',
    description: 'Casual style for everyone. An American worldwide clothing and accessories retailer known for its casual style.',
    founded: 1969,
    country: 'USA',
    website: 'https://www.gap.com',
    category: 'Casual',
    products: 45,
  },
  {
    id: 'h-m',
    name: 'H&M',
    slug: 'h-m',
    description: 'Fashion and Quality at the Best Price. A Swedish multinational clothing-retail company known for its fast-fashion clothing.',
    founded: 1947,
    country: 'Sweden',
    website: 'https://www.hm.com',
    category: 'Fast Fashion',
    products: 52,
  },
]
