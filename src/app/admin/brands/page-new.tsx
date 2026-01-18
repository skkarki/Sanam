'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Filter, Eye, LogOut, Package, RefreshCw, Download, Upload, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface Brand {
  id: string
  name: string
  description: string
  logo: string
  products: number
  status: 'active' | 'inactive'
  createdAt: string
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    status: 'active' as const
  })
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize with default data if localStorage is empty
  const getDefaultBrands = (): Brand[] => [
    {
      id: '1',
      name: 'Nike',
      description: 'Sports and athletic wear',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop',
      products: 45,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Adidas',
      description: 'Sports and lifestyle brand',
      logo: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=150&h=150&fit=crop',
      products: 38,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Puma',
      description: 'Athletic footwear and apparel',
      logo: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=150&h=150&fit=crop',
      products: 22,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ]

  // Load brands from localStorage on mount, with fallback to default
  useEffect(() => {
    const savedBrands = localStorage.getItem('admin_brands')
    if (savedBrands) {
      try {
        const parsed = JSON.parse(savedBrands)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBrands(parsed)
        } else {
          setBrands(getDefaultBrands())
        }
      } catch {
        setBrands(getDefaultBrands())
      }
    } else {
      setBrands(getDefaultBrands())
    }
    setLoading(false)
  }, [])

  // Save brands to localStorage whenever they change
  const saveBrands = (newBrands: Brand[]) => {
    setBrands(newBrands)
    localStorage.setItem('admin_brands', JSON.stringify(newBrands))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData({ ...formData, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview('')
    setFormData({ ...formData, logo: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddBrand = () => {
    if (formData.name.trim()) {
      const newBrand: Brand = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        logo: formData.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
        products: 0,
        status: formData.status,
        createdAt: new Date().toISOString()
      }
      
      const updatedBrands = [...brands, newBrand]
      saveBrands(updatedBrands)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        logo: '',
        status: 'active'
      })
      setImagePreview('')
      setIsAddModalOpen(false)
    }
  }

  const handleEditBrand = () => {
    if (selectedBrand && formData.name.trim()) {
      const updatedBrands = brands.map(brand => 
        brand.id === selectedBrand.id 
          ? { ...brand, name: formData.name, description: formData.description, logo: formData.logo, status: formData.status }
          : brand
      )
      
      saveBrands(updatedBrands)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        logo: '',
        status: 'active'
      })
      setImagePreview('')
      setIsEditModalOpen(false)
      setSelectedBrand(null)
    }
  }

  const handleDeleteBrand = (brand: Brand) => {
    if (confirm(`Are you sure you want to delete "${brand.name}"?`)) {
      const updatedBrands = brands.filter(b => b.id !== brand.id)
      saveBrands(updatedBrands)
    }
  }

  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description,
      logo: brand.logo,
      status: brand.status
    })
    setImagePreview(brand.logo)
    setIsEditModalOpen(true)
  }

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: Brand['status']) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Active' },
      inactive: { variant: 'secondary' as const, label: 'Inactive' },
    }
    
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600 mt-4">Loading brands...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">SI</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Sanam International</h1>
                  <p className="text-xs text-slate-500">Brand Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => window.location.href = '/admin'} 
                variant="outline" 
                size="sm" 
                className="gap-2 border-slate-200 hover:bg-slate-50"
              >
                ← Back to Dashboard
              </Button>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Brand
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Brand Management</h2>
          <p className="text-slate-600">Manage your Sanam International product brands</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{brands.length}</p>
                <p className="text-sm text-slate-600">Total Brands</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{brands.filter(b => b.status === 'active').length}</p>
                <p className="text-sm text-slate-600">Active Brands</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{brands.filter(b => b.status === 'inactive').length}</p>
                <p className="text-sm text-slate-600">Inactive Brands</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{brands.reduce((sum, b) => sum + b.products, 0)}</p>
                <p className="text-sm text-slate-600">Total Products</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <Card className="bg-white border-slate-200 mb-8">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search brands by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 w-64 border-slate-200"
                />
              </div>
              <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Export Brands
              </Button>
              <Button 
                onClick={() => saveBrands(getDefaultBrands())}
                variant="outline" 
                className="gap-2 border-slate-200 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Default
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Brands Table */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200">
                    <TableHead className="text-slate-700 font-semibold">Brand</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Products</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Status</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Created</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBrands.map((brand) => (
                    <TableRow key={brand.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden">
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{brand.name}</p>
                            <p className="text-sm text-slate-600">{brand.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{brand.products}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(brand.status)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{new Date(brand.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(brand)}
                            className="hover:bg-blue-50 text-slate-600"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBrand(brand)}
                            className="hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Brand Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Brand Name</label>
              <Input
                placeholder="Enter brand name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                placeholder="Enter brand description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-24 border-slate-200 p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Brand Logo</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="brand-logo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2 border-slate-200 hover:bg-slate-50"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearImage}
                      className="gap-2 border-slate-200 hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <div className="w-24 h-24 rounded-lg border border-slate-200 overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Brand logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  placeholder="Or enter image URL"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full border-slate-200 p-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false)
              setImagePreview('')
              setFormData({
                name: '',
                description: '',
                logo: '',
                status: 'active'
              })
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddBrand}>
              Add Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Brand Name</label>
              <Input
                placeholder="Enter brand name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                placeholder="Enter brand description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-24 border-slate-200 p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Brand Logo</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="brand-logo-edit"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2 border-slate-200 hover:bg-slate-50"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearImage}
                      className="gap-2 border-slate-200 hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <div className="w-24 h-24 rounded-lg border border-slate-200 overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Brand logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  placeholder="Or enter image URL"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full border-slate-200 p-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false)
              setImagePreview('')
              setFormData({
                name: '',
                description: '',
                logo: '',
                status: 'active'
              })
              setSelectedBrand(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditBrand}>
              Update Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
