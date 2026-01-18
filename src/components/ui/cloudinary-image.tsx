import React from 'react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/cloudinary'

interface LocalImageProps {
  publicId: string
  alt: string
  width?: number
  height?: number
  crop?: string
  format?: string
  quality?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
}

export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  crop = 'fill',
  format = 'auto',
  quality = 80,
  className = '',
  priority = false,
  fill = false,
  sizes,
}: LocalImageProps) {
  const imageUrl = getImageUrl(publicId, {
    width,
    height,
    crop,
    format,
    quality,
  })

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width || 400}
      height={height || 400}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  )
}

// Alias for semantic naming
export const LocalImage = CloudinaryImage
