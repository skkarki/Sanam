import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Base path for uploads (in public folder)
const UPLOAD_BASE_PATH = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directories exist
async function ensureUploadDir(folder: string) {
  const fullPath = path.join(UPLOAD_BASE_PATH, folder)
  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true })
  }
  return fullPath
}

// Helper function to generate image URLs
export function getImageUrl(publicId: string, options?: {
  width?: number
  height?: number
  crop?: string
  format?: string
  quality?: number
}) {
  // Handle empty/null publicId
  if (!publicId) return '/placeholder.jpg'

  // If it's already a full URL, return as-is
  if (publicId.startsWith('http')) {
    return publicId
  }

  // If it starts with /, it's already a full path
  if (publicId.startsWith('/')) {
    return publicId
  }

  // NEW: Handle new uploaded images (products/uuid.ext format)
  if (publicId.startsWith('products/') && publicId.includes('-')) {
    return `/uploads/${publicId}`
  }

  // Handle old Cloudinary-style public IDs by mapping to actual local files
  // This handles cases like 'sanam-international/nike-air-max-90-black-main'
  const mappings: Record<string, string> = {
    'nike-air-max-90-black-main': 'nike-air-max-premium.jpg',
    'adidas-ultraboost-22-white-main': 'men-winter-hoodie.jpg',
    'classic-cotton-t-shirt-black-main': 'men-cotton-plain-tshirt.jpg',
    'puma-rs-x-multi-main': 'goldstar-g10-running.jpg',
    'pegasus39-main': 'women-running-shoes.jpg',
    'dress-main': 'women-floral-top.jpg',
  }

  // Check if any mapping key is part of the publicId
  for (const [key, filename] of Object.entries(mappings)) {
    if (publicId.includes(key)) {
      return `/uploads/products/${filename}`;
    }
  }

  if (publicId.includes('/')) {
    const fileName = publicId.split('/').pop()
    if (fileName) {
      // Fallback: try to match partial names
      const availableFiles = [
        'caliber-cr7-sports.jpg',
        'goldstar-g10-running.jpg',
        'goldstar-ladies-casual.jpg',
        'kids-cartoon-tshirt.jpg',
        'kids-denim-jeans.jpg',
        'kids-school-shoes.jpg',
        'kids-velcro-sneakers.jpg',
        'men-cotton-plain-tshirt.jpg',
        'men-formal-oxford.jpg',
        'men-slim-jeans.jpg',
        'men-winter-hoodie.jpg',
        'nike-air-max-premium.jpg',
        'north-face-windcheater.jpg',
        'women-chiffon-saree.jpg',
        'women-cotton-kurta.jpg',
        'women-floral-top.jpg',
        'women-high-waist-jeans.jpg',
        'women-party-heels.jpg',
        'women-running-shoes.jpg',
        'women-summer-sandals.jpg'
      ]

      // Try to find a matching file by partial name
      const searchTerm = fileName.toLowerCase().replace(/[^a-z0-9]/g, '')
      const matchedFile = availableFiles.find(file =>
        file.toLowerCase().replace(/[^a-z0-9]/g, '').includes(searchTerm)
      )

      if (matchedFile) {
        return `/uploads/products/${matchedFile}`
      }
    }

    // Final fallback
    return '/placeholder.jpg'
  }

  // Default case: treat as relative path from /uploads/
  return `/uploads/${publicId}`
}

// Alias for backward compatibility
export const getCloudinaryUrl = getImageUrl

// Helper function to upload images to local storage
export async function uploadImage(file: File, folder?: string): Promise<{
  publicId: string
  url: string
  format: string
  width: number
  height: number
}> {
  try {
    const uploadFolder = folder || 'general'
    const uploadDir = await ensureUploadDir(uploadFolder)

    // Get file extension
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'

    // Generate unique filename
    const uniqueId = uuidv4()
    const filename = `${uniqueId}.${extension}`
    const filePath = path.join(uploadDir, filename)

    // Convert File to Buffer and write to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Generate the public ID (relative path from uploads folder)
    const publicId = `${uploadFolder}/${filename}`

    return {
      publicId,
      url: `/uploads/${publicId}`,
      format: extension,
      width: 0, // Would need image processing library for actual dimensions
      height: 0,
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Helper function to delete images from local storage
export async function deleteImage(publicId: string): Promise<{ result: string }> {
  try {
    const filePath = path.join(UPLOAD_BASE_PATH, publicId)

    if (existsSync(filePath)) {
      await unlink(filePath)
      return { result: 'ok' }
    }

    return { result: 'not found' }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}
