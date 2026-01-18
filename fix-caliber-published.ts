import { db } from './src/lib/db'

async function fixCaliber() {
  try {
    const product = await db.product.findFirst({
      where: {
        name: {
          contains: 'Caliber',
          mode: 'insensitive'
        }
      }
    })

    if (!product) {
      console.log('❌ Caliber product not found!')
      return
    }

    console.log('\n📦 Current Status:')
    console.log(`Name: ${product.name}`)
    console.log(`isActive: ${product.isActive}`)
    console.log(`publishedAt: ${product.publishedAt}`)

    if (!product.publishedAt) {
      console.log('\n⚠️  Product is NOT PUBLISHED!')
      console.log('Setting publishedAt to now...')
      
      const updated = await db.product.update({
        where: { id: product.id },
        data: {
          publishedAt: new Date(),
          isActive: true
        }
      })

      console.log('\n✅ Product updated!')
      console.log(`publishedAt: ${updated.publishedAt}`)
      console.log(`isActive: ${updated.isActive}`)
      console.log('\n🎉 Caliber Shoes should now be visible on the frontend!')
    } else {
      console.log('\n✅ Product is already published')
      console.log('Product should be visible on frontend')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

fixCaliber()
