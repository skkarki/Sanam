'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Menu, User, Heart, X, Trash2, ShoppingBagIcon, CheckCircle, Home, Package, ChevronRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/hooks/use-cart-store'
import Image from 'next/image'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items: cartItems, fetchCart, removeFromCart, clearCart, updateQuantity } = useCartStore()
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [isClearCartDialogOpen, setIsClearCartDialogOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0)

  const handleRemoveItem = (item: any) => {
    setItemToRemove(item)
    setIsRemoveDialogOpen(true)
  }

  const confirmRemoveItem = async () => {
    if (!itemToRemove) return

    await removeFromCart(itemToRemove.id)
    setIsRemoveDialogOpen(false)
    setShowSuccess(true)
    setSuccessMessage('Item removed from cart')
    setItemToRemove(null)

    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleClearCart = () => {
    setIsClearCartDialogOpen(true)
  }

  const confirmClearCart = async () => {
    await clearCart()
    setIsClearCartDialogOpen(false)
    setShowSuccess(true)
    setSuccessMessage('Cart cleared successfully')
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const menuItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop All', href: '/products', icon: ShoppingBag },
    { label: 'Men', href: '/categories/men', icon: User },
    { label: 'Women', href: '/categories/women', icon: User },
    { label: 'Kids', href: '/categories/kids', icon: User },
    { label: 'Brands', href: '/brands', icon: Package },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'My Account', href: '/profile', icon: User },
  ]

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 animate-pulse">
          <span>🇳🇵</span> Free shipping all over Nepal on orders over Rs. 5,000 | Use code: NEPALFREE
        </div>
      </div>

      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all',
          isScrolled && 'shadow-md'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold tracking-tighter">SANAM <span className="text-primary">INTL</span></div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
                Shop
              </Link>
              <Link href="/categories/men" className="text-sm font-medium hover:text-primary transition-colors">
                Men
              </Link>
              <Link href="/categories/women" className="text-sm font-medium hover:text-primary transition-colors">
                Women
              </Link>
              <Link href="/categories/kids" className="text-sm font-medium hover:text-primary transition-colors">
                Kids
              </Link>
              <Link href="/brands" className="text-sm font-medium hover:text-primary transition-colors">
                Brands
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Link href="/search">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              {/* Profile */}
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              {/* Cart */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg flex flex-col">
                  <SheetHeader className="border-b pb-4">
                    <SheetTitle>Shopping Cart</SheetTitle>
                    <SheetDescription>
                      {cartItems.length === 0
                        ? 'Your cart is empty'
                        : `${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`
                      }
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {cartItems.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Your cart is empty</p>
                        <Button variant="link" className="mt-2" asChild>
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg relative bg-card">
                              <div className="h-20 w-20 bg-muted rounded-md overflow-hidden relative shrink-0">
                                {item.product.image && (
                                  <img
                                    src={item.product.image || '/images/fashion-banner.webp'}
                                    alt={item.product.name}
                                    className="object-cover w-full h-full"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate pr-6">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {item.variant.sizeValue} / {item.variant.colorName}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="font-semibold text-primary">{formatPrice(item.variant.price)}</p>
                                  <div className="flex items-center border rounded-md">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 rounded-none"
                                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                    >
                                      -
                                    </Button>
                                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 rounded-none"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveItem(item)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 mt-auto">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-medium">Subtotal</span>
                            <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              onClick={handleClearCart}
                            >
                              Clear
                            </Button>
                            <Link href="/checkout" className="w-full block">
                              <Button className="w-full">
                                Checkout
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile Menu Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                  <SheetHeader className="p-6 border-b text-left bg-muted/30">
                    <SheetTitle className="flex items-center gap-2 text-primary">
                      <span className="text-xl">Namaste 🙏</span>
                    </SheetTitle>
                    <SheetDescription className="text-sm text-foreground/80 mt-1">
                      Welcome to Sanam International
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    <nav className="flex flex-col p-4">
                      {menuItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted transition-colors group"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </nav>

                    <div className="px-6 py-4 mt-2 border-t">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Contact Us
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>Bode, Bhaktapur, Nepal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t bg-muted/30">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span>Made in Nepal</span>
                      <img src="/nepal-flag.svg" alt="Nepal Flag" className="h-3 w-auto" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Remove Item Confirmation Dialog */}
              <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Item</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove "{itemToRemove?.name}" from your cart?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmRemoveItem}>Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Clear Cart Confirmation Dialog */}
              <AlertDialog open={isClearCartDialogOpen} onOpenChange={setIsClearCartDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to clear your cart? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmClearCart}>Clear Cart</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Success Toast */}
              {showSuccess && (
                <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 fade-in">
                  <div className="flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-lg shadow-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{successMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
