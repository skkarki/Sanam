'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CategoryCardProps {
  name: string
  slug: string
  image: string
  description?: string
}

export function CategoryCard({ name, slug, image, description }: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardContent className="p-0">
        <Link href={`/categories/${slug}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{name}</h3>
              {description && (
                <p className="text-sm opacity-90 mb-4 line-clamp-2">{description}</p>
              )}
              <Button
                variant="secondary"
                className="group/btn"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
