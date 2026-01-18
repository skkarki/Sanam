
import { PrismaClient, ProductType, GenderType, SizeCategory, ImageType } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { finished } from 'stream/promises'

const prisma = new PrismaClient()

const UPLOADS_DIR_PRODUCTS = path.join(process.cwd(), 'public', 'uploads', 'products')
const UPLOADS_DIR_CATEGORIES = path.join(process.cwd(), 'public', 'uploads', 'categories')

async function downloadImage(url: string, filename: string, type: 'product' | 'category' = 'product'): Promise<string> {
  const uploadDir = type === 'product' ? UPLOADS_DIR_PRODUCTS : UPLOADS_DIR_CATEGORIES
  const filepath = path.join(uploadDir, filename)
  const relativePath = `/uploads/${type === 'product' ? 'products' : 'categories'}/${filename}`
  
  if (fs.existsSync(filepath)) {
    console.log(`Image already exists: ${filename}`)
    return relativePath
  }

  console.log(`Downloading ${url} to ${filename}...`)
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`)
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const fileStream = fs.createWriteStream(filepath, { flags: 'wx' })
    
    if (res.body) {
        // @ts-ignore
        await finished(Readable.fromWeb(res.body).pipe(fileStream))
    }
    
    console.log(`Downloaded ${filename}`)
    return relativePath
  } catch (error) {
    console.error(`Error downloading ${filename}:`, error)
    return relativePath
  }
}

const CATEGORIES = [
  { 
    name: 'Men', 
    slug: 'men', 
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    description: 'Elevate your style with our Men\'s Collection.'
  },
  { 
    name: 'Women', 
    slug: 'women', 
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
    description: 'Discover the latest trends in Women\'s Fashion.'
  },
  { 
    name: 'Kids', 
    slug: 'kids', 
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80',
    description: 'Comfortable and fun styles for your little ones.'
  },
]

const BRANDS = [
  { name: 'Goldstar', slug: 'goldstar', description: 'Proudly Nepali Footwear' },
  { name: 'Caliber', slug: 'caliber', description: 'Premium Nepali Shoes' },
  { name: 'Nike', slug: 'nike', description: 'Just Do It' },
  { name: 'Adidas', slug: 'adidas', description: 'Impossible is Nothing' },
  { name: 'North Face', slug: 'north-face', description: 'Never Stop Exploring' },
  { name: 'Generic', slug: 'generic', description: 'Affordable Essentials' },
]

const PRODUCTS = [
  // MEN - SHOES
  {
    name: 'Goldstar G10 Running Shoes',
    slug: 'goldstar-g10-running',
    brand: 'Goldstar',
    category: 'Men',
    type: ProductType.SHOES,
    gender: GenderType.MEN,
    price: 1550,
    compareAt: 1800,
    description: 'The classic Goldstar G10. Durable, comfortable, and perfect for everyday running and walking. Made in Nepal.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    tags: 'running,goldstar,nepali,durable',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['40', '41', '42', '43']
  },
  {
    name: 'Caliber CR-7 Sports',
    slug: 'caliber-cr7-sports',
    brand: 'Caliber',
    category: 'Men',
    type: ProductType.SHOES,
    gender: GenderType.MEN,
    price: 2800,
    compareAt: 3200,
    description: 'Premium sports shoes from Caliber. Designed for high performance and style.',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    tags: 'sports,caliber,premium',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['40', '41', '42', '43', '44']
  },
  {
    name: 'Nike Air Max Premium',
    slug: 'nike-air-max-premium',
    brand: 'Nike',
    category: 'Men',
    type: ProductType.SHOES,
    gender: GenderType.MEN,
    price: 4500,
    compareAt: 6000,
    description: 'High quality copy of the legendary Nike Air Max. Great comfort and style at an affordable price.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    tags: 'nike,sneakers,fashion',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['40', '41', '42', '43']
  },
  {
    name: 'Formal Oxford Shoes',
    slug: 'men-formal-oxford',
    brand: 'Generic',
    category: 'Men',
    type: ProductType.SHOES,
    gender: GenderType.MEN,
    price: 2200,
    compareAt: 2800,
    description: 'Classic black leather formal shoes. Perfect for office and events.',
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80',
    tags: 'formal,office,leather',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['40', '41', '42', '43']
  },

  // MEN - CLOTHING
  {
    name: 'North Face Windcheater',
    slug: 'north-face-windcheater',
    brand: 'North Face',
    category: 'Men',
    type: ProductType.CLOTHING,
    gender: GenderType.MEN,
    price: 2500,
    compareAt: 3500,
    description: 'Water resistant windcheater jacket. Ideal for Kathmandu weather and trekking.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    tags: 'jacket,winter,windcheater',
    sizeCategory: SizeCategory.CLOTHING_ALPHA,
    variants: ['M', 'L', 'XL', 'XXL']
  },
  {
    name: 'Cotton Plain T-Shirt',
    slug: 'men-cotton-plain-tshirt',
    brand: 'Generic',
    category: 'Men',
    type: ProductType.CLOTHING,
    gender: GenderType.MEN,
    price: 850,
    compareAt: 1000,
    description: '100% Cotton plain t-shirt. Breathable and comfortable for summer.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    tags: 'tshirt,cotton,summer',
    sizeCategory: SizeCategory.CLOTHING_ALPHA,
    variants: ['S', 'M', 'L', 'XL']
  },
  {
    name: 'Slim Fit Denim Jeans',
    slug: 'men-slim-jeans',
    brand: 'Generic',
    category: 'Men',
    type: ProductType.CLOTHING,
    gender: GenderType.MEN,
    price: 2200,
    compareAt: 2800,
    description: 'Stretchable slim fit jeans. Stylish and durable denim.',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&q=80',
    tags: 'jeans,denim,fashion',
    sizeCategory: SizeCategory.CLOTHING_NUMERIC,
    variants: ['30', '32', '34', '36']
  },
  {
    name: 'Winter Hoodie',
    slug: 'men-winter-hoodie',
    brand: 'Generic',
    category: 'Men',
    type: ProductType.CLOTHING,
    gender: GenderType.MEN,
    price: 1800,
    compareAt: 2200,
    description: 'Warm fleece hoodie for winter. Comfortable fit.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    tags: 'hoodie,winter,warm',
    sizeCategory: SizeCategory.CLOTHING_ALPHA,
    variants: ['M', 'L', 'XL']
  },

  // WOMEN - SHOES
  {
    name: 'Goldstar Ladies Casual',
    slug: 'goldstar-ladies-casual',
    brand: 'Goldstar',
    category: 'Women',
    type: ProductType.SHOES,
    gender: GenderType.WOMEN,
    price: 1250,
    compareAt: 1500,
    description: 'Lightweight canvas shoes for daily wear. Comfortable and stylish.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
    tags: 'goldstar,casual,women',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['36', '37', '38', '39']
  },
  {
    name: 'Party Wear Heels',
    slug: 'women-party-heels',
    brand: 'Generic',
    category: 'Women',
    type: ProductType.SHOES,
    gender: GenderType.WOMEN,
    price: 3200,
    compareAt: 4000,
    description: 'Elegant heels for parties and weddings. Stand out with style.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    tags: 'heels,party,fashion',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['36', '37', '38', '39']
  },
  {
    name: 'Summer Sandals',
    slug: 'women-summer-sandals',
    brand: 'Generic',
    category: 'Women',
    type: ProductType.SHOES,
    gender: GenderType.WOMEN,
    price: 1500,
    compareAt: 1800,
    description: 'Comfortable flat sandals for summer.',
    image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&q=80',
    tags: 'sandals,summer,flat',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['36', '37', '38', '39']
  },
  {
    name: 'Running Sports Shoes',
    slug: 'women-running-shoes',
    brand: 'Nike',
    category: 'Women',
    type: ProductType.SHOES,
    gender: GenderType.WOMEN,
    price: 3500,
    compareAt: 4500,
    description: 'Lightweight running shoes for women. Breathable mesh.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    tags: 'running,sports,fitness',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['36', '37', '38', '39']
  },

  // WOMEN - CLOTHING
  {
    name: 'Cotton Kurta Set',
    slug: 'women-cotton-kurta',
    brand: 'Generic',
    category: 'Women',
    type: ProductType.CLOTHING,
    gender: GenderType.WOMEN,
    price: 2500,
    compareAt: 3000,
    description: 'Traditional cotton kurta set. Perfect for festivals and casual wear.',
    image: 'https://images.unsplash.com/photo-1583391733958-e026b1346316?w=800&q=80', // Ethnic looking dress
    tags: 'kurta,ethnic,traditional',
    sizeCategory: SizeCategory.CLOTHING_ALPHA,
    variants: ['S', 'M', 'L', 'XL']
  },
  {
    name: 'High Waist Jeans',
    slug: 'women-high-waist-jeans',
    brand: 'Generic',
    category: 'Women',
    type: ProductType.CLOTHING,
    gender: GenderType.WOMEN,
    price: 2100,
    compareAt: 2600,
    description: 'Trendy high waist jeans. Perfect fit and comfortable denim.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    tags: 'jeans,denim,trendy',
    sizeCategory: SizeCategory.CLOTHING_NUMERIC,
    variants: ['28', '30', '32', '34']
  },
  {
    name: 'Summer Floral Top',
    slug: 'women-floral-top',
    brand: 'Generic',
    category: 'Women',
    type: ProductType.CLOTHING,
    gender: GenderType.WOMEN,
    price: 1200,
    compareAt: 1500,
    description: 'Lightweight floral print top. Ideal for hot summer days.',
    image: 'https://images.unsplash.com/photo-1551163943-3f6a2b74119c?w=800&q=80',
    tags: 'top,floral,summer',
    sizeCategory: SizeCategory.CLOTHING_ALPHA,
    variants: ['S', 'M', 'L']
  },
  {
    name: 'Chiffon Saree',
    slug: 'women-chiffon-saree',
    brand: 'Generic',
    category: 'Women',
    type: ProductType.CLOTHING,
    gender: GenderType.WOMEN,
    price: 3800,
    compareAt: 4500,
    description: 'Elegant chiffon saree with border work. Blouse piece included.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', // Saree lookalike
    tags: 'saree,ethnic,party',
    sizeCategory: SizeCategory.ONE_SIZE,
    variants: ['Free Size']
  },

  // KIDS
  {
    name: 'Kids Velcro Sneakers',
    slug: 'kids-velcro-sneakers',
    brand: 'Goldstar',
    category: 'Kids',
    type: ProductType.SHOES,
    gender: GenderType.UNISEX,
    price: 1400,
    compareAt: 1700,
    description: 'Easy to wear velcro sneakers for kids. Durable for playing.',
    image: 'https://images.unsplash.com/photo-1514989940723-e8875ea6ab7d?w=800&q=80',
    tags: 'kids,sneakers,school',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['30', '31', '32', '33']
  },
  {
    name: 'Kids Cartoon T-Shirt',
    slug: 'kids-cartoon-tshirt',
    brand: 'Generic',
    category: 'Kids',
    type: ProductType.CLOTHING,
    gender: GenderType.UNISEX,
    price: 650,
    compareAt: 800,
    description: 'Fun cartoon print t-shirt for kids. Soft cotton fabric.',
    image: 'https://images.unsplash.com/photo-15192382686-96692716a254?w=800&q=80',
    tags: 'kids,tshirt,cartoon',
    sizeCategory: SizeCategory.CLOTHING_ALPHA,
    variants: ['4-5Y', '6-7Y', '8-9Y']
  },
  {
    name: 'School Shoes (Black)',
    slug: 'kids-school-shoes',
    brand: 'Goldstar',
    category: 'Kids',
    type: ProductType.SHOES,
    gender: GenderType.UNISEX,
    price: 1100,
    compareAt: 1300,
    description: 'Standard black school shoes. Comfortable for all-day wear.',
    image: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=800&q=80', // Generic shoe
    tags: 'school,uniform,shoes',
    sizeCategory: SizeCategory.SHOES_EU,
    variants: ['30', '31', '32', '33', '34', '35']
  },
  {
    name: 'Kids Denim Jeans',
    slug: 'kids-denim-jeans',
    brand: 'Generic',
    category: 'Kids',
    type: ProductType.CLOTHING,
    gender: GenderType.UNISEX,
    price: 1300,
    compareAt: 1600,
    description: 'Durable denim jeans for kids. Adjustable waist.',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80',
    tags: 'kids,jeans,denim',
    sizeCategory: SizeCategory.CLOTHING_ALPHA,
    variants: ['4-5Y', '6-7Y', '8-9Y']
  }
]

async function main() {
  console.log('🌱 Starting seed for Nepali Market...')

  // 1. Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.category.deleteMany()
  console.log('✅ Data cleaned.')

  // 2. Create Categories
  console.log('📂 Creating categories...')
  const categoryMap = new Map()
  for (const cat of CATEGORIES) {
    const imageName = `${cat.slug}-fashion.jpg`
    const imageUrl = await downloadImage(cat.image, imageName, 'category')

    const created = await prisma.category.create({
      data: { 
        name: cat.name, 
        slug: cat.slug,
        description: cat.description,
        imagePublicId: imageUrl // Store local path
      }
    })
    categoryMap.set(cat.name, created.id)
  }

  // 3. Create Brands
  console.log('🏷️ Creating brands...')
  const brandMap = new Map()
  for (const brand of BRANDS) {
    const created = await prisma.brand.create({
      data: { 
        name: brand.name, 
        slug: brand.slug,
        description: brand.description
      }
    })
    brandMap.set(brand.name, created.id)
  }

  // 4. Create Products
  console.log('👟 Creating products...')
  for (const p of PRODUCTS) {
    const imageName = `${p.slug}.jpg`
    const imageUrl = await downloadImage(p.image, imageName, 'product')

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.description.substring(0, 100) + '...',
        basePrice: p.price,
        compareAtPrice: p.compareAt,
        categoryId: categoryMap.get(p.category),
        brandId: brandMap.get(p.brand),
        productType: p.type,
        gender: p.gender,
        isActive: true,
        publishedAt: new Date(), // FIX: This was missing, causing products to be hidden
        tags: p.tags,
        isNewArrival: Math.random() > 0.5,
        isFeatured: Math.random() > 0.7,
      }
    })

    // Create default image
    await prisma.productImage.create({
      data: {
        productId: product.id,
        cloudinaryPublicId: imageUrl, // Storing local path as ID based on frontend logic
        isPrimary: true,
        imageType: ImageType.PRODUCT
      }
    })

    // Create Variants & Inventory
    for (const size of p.variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: `${p.slug}-${size}`.toUpperCase(),
          colorName: 'Default',
          sizeValue: size,
          sizeCategory: p.sizeCategory,
          priceAdjustment: 0,
          isActive: true
        }
      })

      // Inventory
      await prisma.inventory.create({
        data: {
          variantId: variant.id,
          quantity: Math.floor(Math.random() * 50) + 10 // 10-60 stock
        }
      })
    }
    console.log(`✅ Created ${p.name}`)
  }

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
