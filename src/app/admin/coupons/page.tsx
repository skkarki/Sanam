'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Ticket, Copy, Check } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Coupon {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue: number
  maxUses: number
  usedCount: number
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'disabled'
}

const initialCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    description: 'Welcome discount for new customers',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1000,
    maxUses: 100,
    usedCount: 45,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
  },
  {
    id: '2',
    code: 'SAVE500',
    description: 'Flat Rs. 500 off on orders above Rs. 5000',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 5000,
    maxUses: 50,
    usedCount: 23,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'active',
  },
  {
    id: '3',
    code: 'SUMMER20',
    description: 'Summer sale - 20% off',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 2000,
    maxUses: 200,
    usedCount: 200,
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    status: 'expired',
  },
]

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderValue: '',
    maxUses: '',
    startDate: '',
    endDate: '',
  })

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddCoupon = () => {
    setEditingCoupon(null)
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '',
      maxUses: '',
      startDate: '',
      endDate: '',
    })
    setIsAddModalOpen(true)
  }

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderValue: coupon.minOrderValue.toString(),
      maxUses: coupon.maxUses.toString(),
      startDate: coupon.startDate,
      endDate: coupon.endDate,
    })
    setIsAddModalOpen(true)
  }

  const handleDeleteCoupon = (coupon: Coupon) => {
    setCouponToDelete(coupon)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!couponToDelete) return
    setCoupons(prev => prev.filter(c => c.id !== couponToDelete.id))
    setIsDeleteModalOpen(false)
    setCouponToDelete(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const couponData = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      minOrderValue: parseFloat(formData.minOrderValue),
      maxUses: parseInt(formData.maxUses),
      startDate: formData.startDate,
      endDate: formData.endDate,
    }

    if (editingCoupon) {
      setCoupons(prev => prev.map(c => 
        c.id === editingCoupon.id 
          ? { ...c, ...couponData }
          : c
      ))
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        ...couponData,
        usedCount: 0,
        status: 'active',
      }
      setCoupons(prev => [...prev, newCoupon])
    }
    setIsAddModalOpen(false)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-700">Expired</Badge>
      case 'disabled':
        return <Badge className="bg-gray-100 text-gray-700">Disabled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const stats = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.status === 'active').length,
    totalUses: coupons.reduce((sum, c) => sum + c.usedCount, 0),
    totalSavings: coupons.reduce((sum, c) => {
      if (c.discountType === 'fixed') {
        return sum + (c.discountValue * c.usedCount)
      }
      return sum + (c.discountValue * c.usedCount * 50) // Rough estimate
    }, 0),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coupons Management</h1>
          <p className="text-muted-foreground">
            Create and manage discount coupons
          </p>
        </div>
        <Button onClick={handleAddCoupon} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Coupons</span>
              <Ticket className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{stats.totalCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Coupons</span>
              <Ticket className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold">{stats.activeCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Uses</span>
              <Ticket className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold">{stats.totalUses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Est. Savings</span>
              <Ticket className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold">Rs. {stats.totalSavings.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded font-mono font-semibold">
                            {coupon.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyCode(coupon.code)}
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{coupon.description}</TableCell>
                      <TableCell>
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}%`
                          : `Rs. ${coupon.discountValue}`
                        }
                      </TableCell>
                      <TableCell>Rs. {coupon.minOrderValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={coupon.usedCount >= coupon.maxUses ? 'text-red-600' : ''}>
                          {coupon.usedCount} / {coupon.maxUses}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{coupon.startDate}</div>
                        <div className="text-muted-foreground">to {coupon.endDate}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCoupon(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCoupon(coupon)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingCoupon ? 'Edit Coupon' : 'Add Coupon'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Coupon Code</label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SAVE20"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Discount description"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Discount Type</label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value: 'percentage' | 'fixed') => 
                        setFormData({ ...formData, discountType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {formData.discountType === 'percentage' ? 'Discount %' : 'Discount Amount'}
                    </label>
                    <Input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder={formData.discountType === 'percentage' ? '10' : '500'}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Min Order Value</label>
                    <Input
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                      placeholder="1000"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Uses</label>
                    <Input
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                      placeholder="100"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingCoupon ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && couponToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete coupon "{couponToDelete.code}"? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setCouponToDelete(null)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
