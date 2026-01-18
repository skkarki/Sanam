'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    Calendar,
    Truck,
    Loader2,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'

interface OrderDetails {
    id: string
    orderNumber: string
    status: string
    subtotal: number
    discountAmount: number
    shippingAmount: number
    taxAmount: number
    totalAmount: number
    shippingAddress: {
        firstName?: string
        lastName?: string
        address?: string
        addressLine1?: string
        city?: string
        state?: string
        postalCode?: string
        country?: string
        phone?: string
        email?: string
    }
    shippingMethod?: string
    trackingNumber?: string
    createdAt: string
    items: Array<{
        id: string
        quantity: number
        unitPrice: number
        totalPrice: number
        variant: {
            colorName: string
            sizeValue: string
        }
        product: {
            id: string
            name: string
            slug: string
            image: string
        }
    }>
}

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/user/orders/${params.id}`)

                if (response.status === 401) {
                    router.push(`/auth?redirect=/orders/${params.id}`)
                    return
                }

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch order')
                }

                setOrder(data.order)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchOrder()
        }
    }, [params.id, router])

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'processing':
            case 'confirmed':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'cancelled':
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
                    <p className="text-muted-foreground mb-6">{error || "We couldn't find the order you're looking for."}</p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => router.back()}>
                            Go Back
                        </Button>
                        <Link href="/profile">
                            <Button>View All Orders</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Order History
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            Order #{order.orderNumber}
                            <Badge className={getStatusColor(order.status)} variant="outline">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">Download Invoice</Button>
                        <Link href="/contact">
                            <Button>Need Help?</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items ({order.items.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-24 w-24 bg-muted rounded-md overflow-hidden flex-shrink-0 relative border">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                                onError={(e) => {
                                                    // Try to use a fallback if specific handling needed, 
                                                    // but next/image handles src errors mostly by showing alt or empty
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none'; // Hide broken images or replacement
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/products/${item.product.slug}`} className="hover:underline">
                                                <h3 className="font-semibold text-lg line-clamp-1">{item.product.name}</h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.variant.colorName} • {item.variant.sizeValue}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                                            </p>
                                        </div>
                                        <div className="text-right font-medium">
                                            {formatPrice(item.totalPrice)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline / Tracking */}
                    {order.trackingNumber && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Tracking Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Tracking Number</p>
                                        <p className="font-mono font-bold text-lg">{order.trackingNumber}</p>
                                    </div>
                                    <Button variant="secondary" size="sm">Track Order</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{formatPrice(order.shippingAmount)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatPrice(order.discountAmount)}</span>
                                </div>
                            )}
                            {order.taxAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{formatPrice(order.taxAmount)}</span>
                                </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatPrice(order.totalAmount)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                            <p className="text-muted-foreground mt-1">{order.shippingAddress.address || order.shippingAddress.addressLine1}</p>
                            <p className="text-muted-foreground">
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-muted-foreground mt-2">{order.shippingAddress.phone}</p>
                            <p className="text-muted-foreground">{order.shippingAddress.email}</p>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Payment Status</span>
                                <Badge variant={order.status === 'cancelled' ? 'destructive' : 'outline'}>
                                    {order.status === 'pending' ? 'Unpaid' : 'Paid'}
                                </Badge>
                            </div>
                            {/* We could add payment method details here if available in the parsed data */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
