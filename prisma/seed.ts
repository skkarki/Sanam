import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // ==================== ADMIN USER ====================
  console.log('👤 Creating admin user...')

  // Password: admin123 (SHA-256 hash)
  const adminPasswordHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
  
  await prisma.user.upsert({
    where: { email: 'admin@sanaminternational.com' },
    update: {},
    create: {
      email: 'admin@sanaminternational.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      isActive: true,
      emailVerifiedAt: new Date(),
    }
  })

  console.log('✅ Admin user created (email: admin@sanaminternational.com, password: admin123)')

  // ==================== CATEGORIES ====================
  console.log('📁 Creating categories...')

  const menCategory = await prisma.category.create({
    data: {
      name: 'Men',
      slug: 'men',
      description: 'Casual wear, formal attire, and sportswear',
      imagePublicId: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=600&fit=crop',
      isActive: true,
      displayOrder: 1,
    }
  })

  const menClothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'men-clothing',
      description: 'Men\'s clothing',
      parentId: menCategory.id,
      isActive: true,
      displayOrder: 1,
    }
  })

  const menShoes = await prisma.category.create({
    data: {
      name: 'Shoes',
      slug: 'men-shoes',
      description: 'Men\'s shoes',
      parentId: menCategory.id,
      isActive: true,
      displayOrder: 2,
    }
  })

  const womenCategory = await prisma.category.create({
    data: {
      name: 'Women',
      slug: 'women',
      description: 'Dresses, tops, bottoms, and accessories',
      imagePublicId: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=600&fit=crop',
      isActive: true,
      displayOrder: 2,
    }
  })

  const womenClothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'women-clothing',
      description: 'Women\'s clothing',
      parentId: womenCategory.id,
      isActive: true,
      displayOrder: 1,
    }
  })

  const womenShoes = await prisma.category.create({
    data: {
      name: 'Shoes',
      slug: 'women-shoes',
      description: 'Women\'s shoes',
      parentId: womenCategory.id,
      isActive: true,
      displayOrder: 2,
    }
  })

  const kidsCategory = await prisma.category.create({
    data: {
      name: 'Kids',
      slug: 'kids',
      description: 'Adorable and durable clothing for all ages',
      imagePublicId: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&h=600&fit=crop',
      isActive: true,
      displayOrder: 3,
    }
  })

  console.log('✅ Categories created')

  // ==================== BRANDS ====================
  console.log('🏷️  Creating brands...')

  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'Nike',
        slug: 'nike',
        description: 'Just Do It',
        websiteUrl: 'https://www.nike.com',
        isFeatured: true,
        isActive: true,
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Adidas',
        slug: 'adidas',
        description: 'Impossible is Nothing',
        websiteUrl: 'https://www.adidas.com',
        isFeatured: true,
        isActive: true,
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Puma',
        slug: 'puma',
        description: 'Forever Faster',
        websiteUrl: 'https://us.puma.com',
        isFeatured: true,
        isActive: true,
      }
    }),
  ])

  console.log('✅ Brands created')

  // ==================== PRODUCTS ====================
  console.log('🛍️  Creating products...')

  // Nike Air Max 90
  const airMax90 = await prisma.product.create({
    data: {
      name: 'Nike Air Max 90',
      slug: 'nike-air-max-90',
      description: 'The Nike Air Max 90 stays true to its roots with the iconic Waffle sole, stitched overlays and classic TPU accents.',
      shortDescription: 'Classic sneaker with Air cushioning',
      brandId: brands[0].id,
      categoryId: menShoes.id,
      productType: 'SHOES',
      gender: 'MEN',
      basePrice: 130.00,
      compareAtPrice: 150.00,
      isActive: true,
      isFeatured: true,
      isNewArrival: false,
      tags: 'sneakers, running, casual, air max',
      materials: 'leather, mesh, rubber',
      metaTitle: 'Nike Air Max 90 - Men\'s Shoes',
      metaDescription: 'Shop Nike Air Max 90 with iconic Air cushioning. Classic style meets modern comfort.',
      publishedAt: new Date(),
    }
  })

  // Air Max 90 variants
  const airMax90Variants = await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: airMax90.id,
        sku: 'NK-AM90-BK-8',
        colorName: 'Black',
        colorHex: '#000000',
        sizeValue: '8',
        sizeLabel: 'US 8 / EU 41',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 350,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: airMax90.id,
        sku: 'NK-AM90-BK-9',
        colorName: 'Black',
        colorHex: '#000000',
        sizeValue: '9',
        sizeLabel: 'US 9 / EU 42',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 350,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: airMax90.id,
        sku: 'NK-AM90-BK-10',
        colorName: 'Black',
        colorHex: '#000000',
        sizeValue: '10',
        sizeLabel: 'US 10 / EU 43',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 350,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: airMax90.id,
        sku: 'NK-AM90-RD-9',
        colorName: 'Red',
        colorHex: '#FF0000',
        sizeValue: '9',
        sizeLabel: 'US 9 / EU 42',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 350,
        isActive: true,
      }
    }),
  ])

  // Nike Air Max 90 inventory
  await Promise.all(airMax90Variants.map(variant =>
    prisma.inventory.create({
      data: {
        variantId: variant.id,
        quantity: 50,
        reservedQuantity: 0,
        lowStockThreshold: 5,
        allowBackorder: false,
      }
    })
  ))

  // Nike Air Max 90 images
  await prisma.productImage.createMany({
    data: [
      {
        productId: airMax90.id,
        cloudinaryPublicId: 'sanam-international/nike-air-max-90-black-main',
        altText: 'Nike Air Max 90 - Main view',
        displayOrder: 0,
        isPrimary: true,
        imageType: 'PRODUCT',
      },
      {
        productId: airMax90.id,
        cloudinaryPublicId: 'sanam-international/nike-air-max-90-black-side',
        altText: 'Nike Air Max 90 - Side view',
        displayOrder: 1,
        isPrimary: false,
        imageType: 'PRODUCT',
      },
    ]
  })

  // Adidas Ultraboost
  const ultraboost = await prisma.product.create({
    data: {
      name: 'Adidas Ultraboost 22',
      slug: 'adidas-ultraboost-22',
      description: 'Experience energy return with the Adidas Ultraboost 22. Featuring BOOST technology for maximum energy return.',
      shortDescription: 'High-performance running shoes',
      brandId: brands[1].id,
      categoryId: menShoes.id,
      productType: 'SHOES',
      gender: 'MEN',
      basePrice: 190.00,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      tags: 'sneakers, running, performance, boost',
      materials: 'primeknit, boost, rubber',
      metaTitle: 'Adidas Ultraboost 22 - Men\'s Running Shoes',
      metaDescription: 'Shop Adidas Ultraboost 22 with BOOST technology. Maximum energy return for your run.',
      publishedAt: new Date(),
    }
  })

  const ultraboostVariants = await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: ultraboost.id,
        sku: 'AD-UB22-WH-9',
        colorName: 'White',
        colorHex: '#FFFFFF',
        sizeValue: '9',
        sizeLabel: 'US 9 / EU 42',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 320,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: ultraboost.id,
        sku: 'AD-UB22-WH-10',
        colorName: 'White',
        colorHex: '#FFFFFF',
        sizeValue: '10',
        sizeLabel: 'US 10 / EU 43',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 320,
        isActive: true,
      }
    }),
  ])

  await Promise.all(ultraboostVariants.map(variant =>
    prisma.inventory.create({
      data: {
        variantId: variant.id,
        quantity: 30,
        reservedQuantity: 0,
        lowStockThreshold: 5,
        allowBackorder: false,
      }
    })
  ))

  await prisma.productImage.create({
    data: {
      productId: ultraboost.id,
      cloudinaryPublicId: 'sanam-international/adidas-ultraboost-22-white-main',
      altText: 'Adidas Ultraboost 22 - Main view',
      displayOrder: 0,
      isPrimary: true,
      imageType: 'PRODUCT',
    }
  })

  // Classic T-Shirt
  const classicTee = await prisma.product.create({
    data: {
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-t-shirt',
      description: 'A timeless classic made from 100% organic cotton. Perfect for everyday wear.',
      shortDescription: 'Premium cotton tee',
      categoryId: menClothing.id,
      productType: 'CLOTHING',
      gender: 'MEN',
      basePrice: 29.99,
      compareAtPrice: 39.99,
      isActive: true,
      isFeatured: true,
      isNewArrival: false,
      tags: 't-shirt, cotton, casual, basic',
      materials: '100% organic cotton',
      careInstructions: 'Machine wash cold, tumble dry low',
      metaTitle: 'Classic Cotton T-Shirt - Men\'s',
      metaDescription: 'Shop our classic cotton t-shirt. 100% organic cotton for everyday comfort.',
      publishedAt: new Date(),
    }
  })

  const classicTeeVariants = await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: classicTee.id,
        sku: 'TEE-CL-BL-S',
        colorName: 'Black',
        colorHex: '#000000',
        sizeValue: 'S',
        sizeLabel: 'Small',
        sizeCategory: 'CLOTHING_ALPHA',
        priceAdjustment: 0,
        weightGrams: 180,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: classicTee.id,
        sku: 'TEE-CL-BL-M',
        colorName: 'Black',
        colorHex: '#000000',
        sizeValue: 'M',
        sizeLabel: 'Medium',
        sizeCategory: 'CLOTHING_ALPHA',
        priceAdjustment: 0,
        weightGrams: 190,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: classicTee.id,
        sku: 'TEE-CL-BL-L',
        colorName: 'Black',
        colorHex: '#000000',
        sizeValue: 'L',
        sizeLabel: 'Large',
        sizeCategory: 'CLOTHING_ALPHA',
        priceAdjustment: 0,
        weightGrams: 200,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: classicTee.id,
        sku: 'TEE-CL-WH-M',
        colorName: 'White',
        colorHex: '#FFFFFF',
        sizeValue: 'M',
        sizeLabel: 'Medium',
        sizeCategory: 'CLOTHING_ALPHA',
        priceAdjustment: 0,
        weightGrams: 190,
        isActive: true,
      }
    }),
  ])

  await Promise.all(classicTeeVariants.map(variant =>
    prisma.inventory.create({
      data: {
        variantId: variant.id,
        quantity: 100,
        reservedQuantity: 0,
        lowStockThreshold: 10,
        allowBackorder: false,
      }
    })
  ))

  await prisma.productImage.createMany({
    data: [
      {
        productId: classicTee.id,
        cloudinaryPublicId: 'sanam-international/classic-cotton-t-shirt-black-main',
        altText: 'Classic Cotton T-Shirt - Main view',
        displayOrder: 0,
        isPrimary: true,
        imageType: 'PRODUCT',
      },
      {
        productId: classicTee.id,
        cloudinaryPublicId: 'sanam-international/classic-cotton-t-shirt-black-lifestyle',
        altText: 'Classic Cotton T-Shirt - Lifestyle',
        displayOrder: 1,
        isPrimary: false,
        imageType: 'LIFESTYLE',
      },
    ]
  })

  // Puma RS-X
  const pumaRSX = await prisma.product.create({
    data: {
      name: 'Puma RS-X',
      slug: 'puma-rs-x',
      description: 'The RS-X gets chunkier with the RS-X Retro Remix. Featuring a mix of materials on the upper.',
      shortDescription: 'Chunky retro sneaker',
      brandId: brands[2].id,
      categoryId: menShoes.id,
      productType: 'SHOES',
      gender: 'MEN',
      basePrice: 110.00,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      tags: 'sneakers, retro, chunky, casual',
      materials: 'leather, synthetic, rubber',
      metaTitle: 'Puma RS-X - Men\'s Sneakers',
      metaDescription: 'Shop Puma RS-X retro sneakers. Bold style with chunky design.',
      publishedAt: new Date(),
    }
  })

  const pumaRSXVariants = await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: pumaRSX.id,
        sku: 'PU-RSX-MU-9',
        colorName: 'Multi',
        colorHex: '#CCCCCC',
        sizeValue: '9',
        sizeLabel: 'US 9 / EU 42',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 380,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: pumaRSX.id,
        sku: 'PU-RSX-MU-10',
        colorName: 'Multi',
        colorHex: '#CCCCCC',
        sizeValue: '10',
        sizeLabel: 'US 10 / EU 43',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 380,
        isActive: true,
      }
    }),
  ])

  await Promise.all(pumaRSXVariants.map(variant =>
    prisma.inventory.create({
      data: {
        variantId: variant.id,
        quantity: 40,
        reservedQuantity: 0,
        lowStockThreshold: 5,
        allowBackorder: false,
      }
    })
  ))

  await prisma.productImage.create({
    data: {
      productId: pumaRSX.id,
      cloudinaryPublicId: 'sanam-international/puma-rs-x-multi-main',
      altText: 'Puma RS-X - Main view',
      displayOrder: 0,
      isPrimary: true,
      imageType: 'PRODUCT',
    }
  })

  // Women's Running Shoes - Nike
  const womenRunning = await prisma.product.create({
    data: {
      name: 'Nike Air Zoom Pegasus 39',
      slug: 'nike-air-pegasus-39',
      description: 'The Nike Air Zoom Pegasus 39 continues to put a spring in your step with responsive Zoom Air cushioning.',
      shortDescription: 'Women\'s running shoes',
      brandId: brands[0].id,
      categoryId: womenShoes.id,
      productType: 'SHOES',
      gender: 'WOMEN',
      basePrice: 120.00,
      isActive: true,
      isFeatured: true,
      isNewArrival: false,
      tags: 'sneakers, running, zoom air, pegasus',
      materials: 'mesh, synthetic, rubber',
      metaTitle: 'Nike Air Zoom Pegasus 39 - Women\'s Running Shoes',
      metaDescription: 'Shop Nike Air Zoom Pegasus 39. Responsive Zoom Air cushioning for your runs.',
      publishedAt: new Date(),
    }
  })

  const womenRunningVariants = await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: womenRunning.id,
        sku: 'NK-PG39-PK-6',
        colorName: 'Pink',
        colorHex: '#FFC0CB',
        sizeValue: '6',
        sizeLabel: 'US 6 / EU 37',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 240,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: womenRunning.id,
        sku: 'NK-PG39-PK-7',
        colorName: 'Pink',
        colorHex: '#FFC0CB',
        sizeValue: '7',
        sizeLabel: 'US 7 / EU 38',
        sizeCategory: 'SHOES_US',
        priceAdjustment: 0,
        weightGrams: 250,
        isActive: true,
      }
    }),
  ])

  await Promise.all(womenRunningVariants.map(variant =>
    prisma.inventory.create({
      data: {
        variantId: variant.id,
        quantity: 35,
        reservedQuantity: 0,
        lowStockThreshold: 5,
        allowBackorder: false,
      }
    })
  ))

  await prisma.productImage.create({
    data: {
      productId: womenRunning.id,
      cloudinaryPublicId: 'pegasus39-main',
      altText: 'Nike Air Zoom Pegasus 39 - Main view',
      displayOrder: 0,
      isPrimary: true,
      imageType: 'PRODUCT',
    }
  })

  // Women's Dress
  const womenDress = await prisma.product.create({
    data: {
      name: 'Floral Midi Dress',
      slug: 'floral-midi-dress',
      description: 'Elegant floral midi dress perfect for special occasions. Made from lightweight fabric.',
      shortDescription: 'Elegant floral midi dress',
      categoryId: womenClothing.id,
      productType: 'CLOTHING',
      gender: 'WOMEN',
      basePrice: 79.99,
      compareAtPrice: 99.99,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      tags: 'dress, floral, midi, elegant',
      materials: 'polyester blend',
      careInstructions: 'Dry clean or hand wash cold',
      metaTitle: 'Floral Midi Dress - Women\'s',
      metaDescription: 'Shop our elegant floral midi dress. Perfect for special occasions.',
      publishedAt: new Date(),
    }
  })

  const womenDressVariants = await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: womenDress.id,
        sku: 'DRES-FL-S',
        colorName: 'Floral',
        colorHex: '#FFB6C1',
        sizeValue: 'S',
        sizeLabel: 'Small',
        sizeCategory: 'CLOTHING_ALPHA',
        priceAdjustment: 0,
        weightGrams: 300,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: womenDress.id,
        sku: 'DRES-FL-M',
        colorName: 'Floral',
        colorHex: '#FFB6C1',
        sizeValue: 'M',
        sizeLabel: 'Medium',
        sizeCategory: 'CLOTHING_ALPHA',
        priceAdjustment: 0,
        weightGrams: 310,
        isActive: true,
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: womenDress.id,
        sku: 'DRES-FL-L',
        colorName: 'Floral',
        colorHex: '#FFB6C1',
        sizeValue: 'L',
        sizeLabel: 'Large',
        sizeCategory: 'CLOTHING_ALPHA',
        priceAdjustment: 0,
        weightGrams: 320,
        isActive: true,
      }
    }),
  ])

  await Promise.all(womenDressVariants.map(variant =>
    prisma.inventory.create({
      data: {
        variantId: variant.id,
        quantity: 25,
        reservedQuantity: 0,
        lowStockThreshold: 5,
        allowBackorder: false,
      }
    })
  ))

  await prisma.productImage.create({
    data: {
      productId: womenDress.id,
      cloudinaryPublicId: 'dress-main',
      altText: 'Floral Midi Dress - Main view',
      displayOrder: 0,
      isPrimary: true,
      imageType: 'PRODUCT',
    }
  })

  // ==================== COUPONS ====================
  console.log('🎟️  Creating coupons...')

  await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        description: 'First time customer discount',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minimumOrderAmount: 50,
        maximumDiscount: 25,
        usageLimit: 1000,
        perUserLimit: 1,
        validFrom: new Date(),
        isActive: true,
        appliesTo: 'ALL',
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'FREESHIP',
        description: 'Free shipping on all orders',
        discountType: 'FREE_SHIPPING',
        discountValue: 0,
        minimumOrderAmount: 75,
        usageLimit: null,
        perUserLimit: 5,
        validFrom: new Date(),
        isActive: true,
        appliesTo: 'ALL',
      }
    }),
  ])

  console.log('✅ Coupons created')

  console.log('🎉 Seed completed successfully!')
  console.log(`
  📊 Summary:
  - 1 Admin user (email: admin@sanaminternational.com, password: admin123)
  - 6 Categories
  - 3 Brands
  - 6 Products
  - 13 Variants
  - 13 Inventory records
  - 8 Product images
  - 2 Coupons
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
