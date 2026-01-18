'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Filter, Eye, Calendar, DollarSign, AlertCircle, LogOut, ShoppingBag, Download, Upload, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  category: string
  brand: string
  stock: number
  status: 'active' | 'inactive' | 'out-of-stock'
  image: string
  createdAt: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    status: 'active' as const,
    image: ''
  })
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize with default data if localStorage is empty
  const getDefaultProducts = (): Product[] => [
    {
      id: '1',
      name: 'Nike Air Max 90',
      sku: 'NIKE-001',
      price: 12999,
      category: 'Men',
      brand: 'Nike',
      stock: 45,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Adidas Ultraboost',
      sku: 'ADIDAS-001',
      price: 15999,
      category: 'Men',
      brand: 'Adidas',
      stock: 32,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=150&h=150&fit=crop',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Puma RS-X',
      sku: 'PUMA-001',
      price: 8999,
      category: 'Women',
      brand: 'Puma',
      stock: 0,
      status: 'out-of-stock',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=150&h=150&fit=crop',
      createdAt: new Date().toISOString()
    }
  ]

  // Load products from localStorage on mount, with fallback to default
  useEffect(() => {
    const savedProducts = localStorage.getItem('admin_products')
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed)
        } else {
          setProducts(getDefaultProducts())
        }
      } catch {
        setProducts(getDefaultProducts())
      }
    } else {
      setProducts(getDefaultProducts())
    }
    setLoading(false)
  }, [])

  // Save products to localStorage whenever they change
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts)
    localStorage.setItem('admin_products', JSON.stringify(newProducts))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData({ ...formData, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview('')
    setFormData({ ...formData, image: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddProduct = () => {
    if (formData.name.trim() && formData.price) {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        sku: formData.sku || `SKU-${Date.now()}`,
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand,
        stock: parseInt(formData.stock) || 0,
        status: parseInt(formData.stock) > 0 ? 'active' : 'out-of-stock',
        image: formData.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
        createdAt: new Date().toISOString()
      }
      
      const updatedProducts = [...products, newProduct]
      saveProducts(updatedProducts)
      
      // Reset form
      setFormData({
        name: '',
        sku: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        status: 'active',
        image: ''
      })
      setImagePreview('')
      setIsAddModalOpen(false)
    }
  }

  const handleEditProduct = () => {
    if (selectedProduct && formData.name.trim() && formData.price) {
      const updatedProducts = products.map(product => 
        product.id === selectedProduct.id 
          ? { 
              ...product, 
              name: formData.name, 
              sku: formData.sku || product.sku,
              price: parseFloat(formData.price), 
              category: formData.category,
              brand: formData.brand,
              stock: parseInt(formData.stock) || 0,
              status: parseInt(formData.stock) > 0 ? formData.status : 'out-of-stock',
              image: formData.image || product.image
            }
          : product
      )
      
      saveProducts(updatedProducts)
      
      // Reset form
      setFormData({
        name: '',
        sku: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        status: 'active',
        image: ''
      })
      setImagePreview('')
      setIsEditModalOpen(false)
      setSelectedProduct(null)
    }
  }

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      const updatedProducts = products.filter(p => p.id !== product.id)
      saveProducts(updatedProducts)
    }
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      status: product.status,
      image: product.image
    })
    setImagePreview(product.image)
    setIsEditModalOpen(true)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: Product['status']) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Active', color: 'bg-green-100 text-green-800' },
      inactive: { variant: 'secondary' as const, label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
      'out-of-stock': { variant: 'destructive' as const, label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
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
          <p className="text-slate-600 mt-4">Loading products...</p>
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
                  <p className="text-xs text-slate-500">Product Management</p>
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
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Product Management</h2>
          <p className="text-slate-600">Manage your Sanam International product catalog</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{products.length}</p>
                <p className="text-sm text-slate-600">Total Products</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{products.filter(p => p.status === 'active').length}</p>
                <p className="text-sm text-slate-600">Active Products</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{products.filter(p => p.status === 'out-of-stock').length}</p>
                <p className="text-sm text-slate-600">Out of Stock</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">NPR {products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</p>
                <p className="text-sm text-slate-600">Total Value</p>
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
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 w-64 border-slate-200"
                />
              </div>
              <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Export Products
              </Button>
              <Button 
                onClick={() => saveProducts(getDefaultProducts())}
                variant="outline" 
                className="gap-2 border-slate-200 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Default
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200">
                    <TableHead className="text-slate-700 font-semibold">Product</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">SKU</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Price</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Stock</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Status</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-slate-600">{product.category} • {product.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">{product.sku}</TableCell>
                      <TableCell className="text-center font-semibold">NPR {product.price.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{product.stock}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(product.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(product)}
                            className="hover:bg-blue-50 text-slate-600"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product)}
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

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Name</label>
              <Input
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">SKU</label>
                <Input
                  placeholder="SKU (optional)"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Price (NPR)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <Input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Brand</label>
                <Input
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Stock</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Product['status'] })}
                  className="w-full border-slate-200 p-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Image</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-upload"
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
                      alt="Product image preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  placeholder="Or enter image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false)
              setImagePreview('')
              setFormData({
                name: '',
                sku: '',
                price: '',
                category: '',
                brand: '',
                stock: '',
                status: 'active',
                image: ''
              })
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Name</label>
              <Input
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">SKU</label>
                <Input
                  placeholder="SKU (optional)"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Price (NPR)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <Input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Brand</label>
                <Input
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Stock</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Product['status'] })}
                  className="w-full border-slate-200 p-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Image</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-edit"
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
                      alt="Product image preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  placeholder="Or enter image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false)
              setImagePreview('')
              setFormData({
                name: '',
                sku: '',
                price: '',
                category: '',
                brand: '',
                stock: '',
                status: 'active',
                image: ''
              })
              setSelectedProduct(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
