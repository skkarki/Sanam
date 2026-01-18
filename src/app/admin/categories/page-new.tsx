'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Filter, Eye, LogOut, Package, RefreshCw, Download, Upload, X, Folder } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  status: 'active' | 'inactive'
  createdAt: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active' as const
  })
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize with default data if localStorage is empty
  const getDefaultCategories = (): Category[] => [
    {
      id: '1',
      name: 'Men',
      slug: 'men',
      description: 'Men\'s clothing and accessories',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&h=150&fit=crop',
      productCount: 120,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Women',
      slug: 'women',
      description: 'Women\'s clothing and accessories',
      image: 'https://images.unsplash.com/photo-1487415049610-bf24e8e0a3a2?w=150&h=150&fit=crop',
      productCount: 145,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Kids',
      slug: 'kids',
      description: 'Kids clothing and accessories',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6b9f3d8d?w=150&h=150&fit=crop',
      productCount: 85,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ]

  // Load categories from localStorage on mount, with fallback to default
  useEffect(() => {
    const savedCategories = localStorage.getItem('admin_categories')
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed)
        } else {
          setCategories(getDefaultCategories())
        }
      } catch {
        setCategories(getDefaultCategories())
      }
    } else {
      setCategories(getDefaultCategories())
    }
    setLoading(false)
  }, [])

  // Save categories to localStorage whenever they change
  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories)
    localStorage.setItem('admin_categories', JSON.stringify(newCategories))
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

  const handleAddCategory = () => {
    if (formData.name.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        image: formData.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop',
        productCount: 0,
        status: formData.status,
        createdAt: new Date().toISOString()
      }
      
      const updatedCategories = [...categories, newCategory]
      saveCategories(updatedCategories)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        image: '',
        status: 'active'
      })
      setImagePreview('')
      setIsAddModalOpen(false)
    }
  }

  const handleEditCategory = () => {
    if (selectedCategory && formData.name.trim()) {
      const updatedCategories = categories.map(category => 
        category.id === selectedCategory.id 
          ? { ...category, name: formData.name, description: formData.description, image: formData.image, status: formData.status }
          : category
      )
      
      saveCategories(updatedCategories)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        image: '',
        status: 'active'
      })
      setImagePreview('')
      setIsEditModalOpen(false)
      setSelectedCategory(null)
    }
  }

  const handleDeleteCategory = (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      const updatedCategories = categories.filter(c => c.id !== category.id)
      saveCategories(updatedCategories)
    }
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      status: category.status
    })
    setImagePreview(category.image)
    setIsEditModalOpen(true)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: Category['status']) => {
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
          <p className="text-slate-600 mt-4">Loading categories...</p>
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
                  <p className="text-xs text-slate-500">Category Management</p>
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
                Add Category
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Category Management</h2>
          <p className="text-slate-600">Manage your Sanam International product categories</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Folder className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
                <p className="text-sm text-slate-600">Total Categories</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Folder className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{categories.filter(c => c.status === 'active').length}</p>
                <p className="text-sm text-slate-600">Active Categories</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Folder className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{categories.filter(c => c.status === 'inactive').length}</p>
                <p className="text-sm text-slate-600">Inactive Categories</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Folder className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{categories.reduce((sum, c) => sum + c.productCount, 0)}</p>
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
                  placeholder="Search categories by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 w-64 border-slate-200"
                />
              </div>
              <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Export Categories
              </Button>
              <Button 
                onClick={() => saveCategories(getDefaultCategories())}
                variant="outline" 
                className="gap-2 border-slate-200 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Default
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200">
                    <TableHead className="text-slate-700 font-semibold">Category</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Products</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Status</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Created</TableHead>
                    <TableHead className="text-center text-slate-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{category.name}</p>
                            <p className="text-sm text-slate-600">{category.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{category.productCount}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(category.status)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(category)}
                            className="hover:bg-blue-50 text-slate-600"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(category)}
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

      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category Name</label>
              <Input
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-24 border-slate-200 p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category Image</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="category-image-upload"
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
                      alt="Category image preview"
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
                image: '',
                status: 'active'
              })
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category Name</label>
              <Input
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-24 border-slate-200 p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category Image</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="category-image-edit"
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
                      alt="Category image preview"
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
                image: '',
                status: 'active'
              })
              setSelectedCategory(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
