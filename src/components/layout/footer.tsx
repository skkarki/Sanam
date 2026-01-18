'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Footer() {
  const [year, setYear] = useState(2025)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])
  return (
    <footer className="bg-muted text-foreground">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Stay in Style</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter and get 10% off your first order
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="/categories/men" className="text-muted-foreground hover:text-foreground transition-colors">Men</Link></li>
              <li><Link href="/categories/women" className="text-muted-foreground hover:text-foreground transition-colors">Women</Link></li>
              <li><Link href="/categories/kids" className="text-muted-foreground hover:text-foreground transition-colors">Kids</Link></li>
              <li><Link href="/brands" className="text-muted-foreground hover:text-foreground transition-colors">Brands</Link></li>
              <li><Link href="/products?sale=true" className="text-muted-foreground hover:text-foreground transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/size-guide" className="text-muted-foreground hover:text-foreground transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">Our Story</Link></li>
              <li><Link href="/sustainability" className="text-muted-foreground hover:text-foreground transition-colors">Sustainability</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-muted-foreground hover:text-foreground transition-colors">Press</Link></li>
              <li><Link href="/affiliates" className="text-muted-foreground hover:text-foreground transition-colors">Affiliates</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">info@sanaminternational.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">+977-9865-4321</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Bode, Madhyapur Thimi - 5, Bhaktapur, Nepal</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {year} Sanam International. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
