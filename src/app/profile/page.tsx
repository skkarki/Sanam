'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Settings, 
  LogOut, 
  Loader2,
  LogIn,
  Plus,
  Eye,
  X,
  Trash2
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  avatarUrl: string | null
  role: string
  emailVerified: boolean
  lastLoginAt: string | null
  createdAt: string
  stats: {
    totalOrders: number
    totalReviews: number
    wishlistItems: number
  }
}

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  variant: {
    id: string
    sku: string
    colorName: string
    sizeValue: string
  }
  product: {
    id: string
    name: string
    slug: string
    image: string
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  discountAmount: number
  shippingAmount: number
  taxAmount: number
  totalAmount: number
  couponCode: string | null
  shippingAddress: {
    firstName?: string
    lastName?: string
    addressLine1?: string
    city?: string
    state?: string
    postalCode?: string
  }
  trackingNumber: string | null
  placedAt: string | null
  createdAt: string
  itemCount: number
  items: OrderItem[]
}

interface Address {
  id: string
  label: string | null
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  countryCode: string
  phone: string | null
  isDefaultShipping: boolean
  isDefaultBilling: boolean
}

const initialAddressForm = {
  label: '',
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  countryCode: 'NP',
  phone: '',
  isDefaultShipping: false
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('orders')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [saving, setSaving] = useState(false)

  const [userInfo, setUserInfo] = useState<UserProfile | null>(null)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressesLoading, setAddressesLoading] = useState(false)

  // Address form state
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressForm, setAddressForm] = useState(initialAddressForm)
  const [savingAddress, setSavingAddress] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null)

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/profile')
      const data = await response.json()

      if (response.status === 401) {
        setIsAuthenticated(false)
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile')
      }

      setUserInfo(data.user)
      setEditForm({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        phone: data.user.phone || ''
      })
      setIsAuthenticated(true)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true)
      const response = await fetch('/api/user/orders')
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    try {
      setAddressesLoading(true)
      const response = await fetch('/api/user/addresses')
      const data = await response.json()

      if (response.ok) {
        setAddresses(data.addresses)
      }
    } catch (err) {
      console.error('Error fetching addresses:', err)
    } finally {
      setAddressesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      fetchOrders()
    } else if (isAuthenticated && activeTab === 'addresses') {
      fetchAddresses()
    }
  }, [isAuthenticated, activeTab, fetchOrders, fetchAddresses])

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setUserInfo(prev => prev ? { ...prev, ...data.user } : null)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const response = await fetch('/api/user/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDefaultShipping: true })
      })

      if (response.ok) {
        fetchAddresses()
      }
    } catch (err) {
      console.error('Error setting default address:', err)
    }
  }

  const handleOpenAddressModal = (address?: Address) => {
    if (address) {
      // Edit mode
      setEditingAddressId(address.id)
      setAddressForm({
        label: address.label || '',
        firstName: address.firstName,
        lastName: address.lastName,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        countryCode: address.countryCode,
        phone: address.phone || '',
        isDefaultShipping: address.isDefaultShipping
      })
    } else {
      // Add mode
      setEditingAddressId(null)
      setAddressForm(initialAddressForm)
    }
    setAddressError(null)
    setShowAddressModal(true)
  }

  const handleCloseAddressModal = () => {
    setShowAddressModal(false)
    setEditingAddressId(null)
    setAddressForm(initialAddressForm)
    setAddressError(null)
  }

  const handleSaveAddress = async () => {
    // Validate required fields
    if (!addressForm.firstName || !addressForm.lastName || !addressForm.addressLine1 || 
        !addressForm.city || !addressForm.state || !addressForm.postalCode) {
      setAddressError('Please fill in all required fields')
      return
    }

    setSavingAddress(true)
    setAddressError(null)

    try {
      const method = editingAddressId ? 'PUT' : 'POST'
      const body = editingAddressId 
        ? { id: editingAddressId, ...addressForm }
        : addressForm

      const response = await fetch('/api/user/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save address')
      }

      handleCloseAddressModal()
      fetchAddresses()
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : 'Failed to save address')
    } finally {
      setSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    setDeletingAddressId(id)

    try {
      const response = await fetch(`/api/user/addresses?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchAddresses()
      }
    } catch (err) {
      console.error('Error deleting address:', err)
    } finally {
      setDeletingAddressId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading your profile...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <LogIn className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Please Login</h3>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your profile
          </p>
          <Button asChild>
            <Link href="/auth">Login / Register</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Welcome back, {userInfo?.firstName || userInfo?.email}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {userInfo?.avatarUrl ? (
                    <Image
                      src={userInfo.avatarUrl}
                      alt="Avatar"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {userInfo?.firstName && userInfo?.lastName 
                      ? `${userInfo.firstName} ${userInfo.lastName}`
                      : userInfo?.email
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">{userInfo?.email}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-muted/50">
                <div className="text-center">
                  <p className="text-lg font-bold">{userInfo?.stats.totalOrders || 0}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{userInfo?.stats.wishlistItems || 0}</p>
                  <p className="text-xs text-muted-foreground">Wishlist</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{userInfo?.stats.totalReviews || 0}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
              </div>

              <nav className="flex flex-col">
                <Button
                  variant={activeTab === 'orders' ? 'default' : 'ghost'}
                  className="justify-start rounded-none"
                  onClick={() => setActiveTab('orders')}
                >
                  <Package className="h-4 w-4 mr-3" />
                  Order History
                </Button>
                <Button
                  variant={activeTab === 'profile' ? 'default' : 'ghost'}
                  className="justify-start rounded-none"
                  onClick={() => setActiveTab('profile')}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Profile Settings
                </Button>
                <Button
                  variant={activeTab === 'addresses' ? 'default' : 'ghost'}
                  className="justify-start rounded-none"
                  onClick={() => setActiveTab('addresses')}
                >
                  <MapPin className="h-4 w-4 mr-3" />
                  Addresses
                </Button>
                <Separator />
                <Button
                  variant="ghost"
                  className="justify-start rounded-none text-red-600 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading orders...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Button asChild>
                      <Link href="/products">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{order.orderNumber}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Order Items Preview */}
                        <div className="flex items-center gap-2 mb-3 overflow-x-auto">
                          {order.items.slice(0, 3).map((item) => (
                            <div 
                              key={item.id}
                              className="w-16 h-16 bg-muted rounded flex-shrink-0 overflow-hidden"
                            >
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/placeholder.jpg'
                                }}
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-16 h-16 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                              <span className="text-sm font-medium">+{order.items.length - 3}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">
                              Rs. {order.totalAmount.toLocaleString()}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/orders/${order.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {order.trackingNumber && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Tracking: </span>
                              <span className="font-mono">{order.trackingNumber}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={saving}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First Name</label>
                    <Input
                      value={isEditing ? editForm.firstName : userInfo?.firstName || ''}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                    <Input
                      value={isEditing ? editForm.lastName : userInfo?.lastName || ''}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={userInfo?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={isEditing ? editForm.phone : userInfo?.phone || ''}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="+977-XXXX-XXXXXX"
                  />
                </div>

                {/* Account Info */}
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {userInfo?.createdAt && new Date(userInfo.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Type</p>
                    <p className="font-medium capitalize">{userInfo?.role?.toLowerCase()}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'addresses' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Shipping Addresses</CardTitle>
                  <Button size="sm" onClick={() => handleOpenAddressModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {addressesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading addresses...</span>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add a shipping address to make checkout faster
                    </p>
                    <Button onClick={() => handleOpenAddressModal()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{address.label || 'Address'}</h4>
                              {address.isDefaultShipping && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            {address.phone && (
                              <p className="text-sm text-muted-foreground">
                                {address.phone}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenAddressModal(address)}
                            >
                              Edit
                            </Button>
                            {!address.isDefaultShipping && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSetDefaultAddress(address.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                              disabled={deletingAddressId === address.id}
                              className="text-red-600 hover:text-red-700"
                            >
                              {deletingAddressId === address.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {editingAddressId 
                ? 'Update your shipping address details below.'
                : 'Enter your shipping address details below.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Label */}
            <div className="grid gap-2">
              <Label htmlFor="label">Address Label (Optional)</Label>
              <Input
                id="label"
                placeholder="e.g., Home, Office, etc."
                value={addressForm.label}
                onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
              />
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={addressForm.firstName}
                  onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={addressForm.lastName}
                  onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div className="grid gap-2">
              <Label htmlFor="addressLine1">Street Address *</Label>
              <Input
                id="addressLine1"
                placeholder="Street address"
                value={addressForm.addressLine1}
                onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
              />
            </div>

            {/* Address Line 2 */}
            <div className="grid gap-2">
              <Label htmlFor="addressLine2">Apartment, Suite, etc. (Optional)</Label>
              <Input
                id="addressLine2"
                placeholder="Apartment, suite, unit, etc."
                value={addressForm.addressLine2}
                onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
              />
            </div>

            {/* City, State, Postal */}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  placeholder="Postal code"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+977-XXXX-XXXXXX"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
              />
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={addressForm.isDefaultShipping}
                onCheckedChange={(checked) => 
                  setAddressForm({...addressForm, isDefaultShipping: checked as boolean})
                }
              />
              <Label htmlFor="isDefault" className="text-sm font-normal">
                Set as default shipping address
              </Label>
            </div>

            {/* Error Message */}
            {addressError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {addressError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddressModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddress} disabled={savingAddress}>
              {savingAddress ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editingAddressId ? 'Update Address' : 'Add Address'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
