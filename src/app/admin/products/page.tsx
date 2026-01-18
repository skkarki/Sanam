'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  brandId: string | null
  categoryId: string
  productType: string
  gender: string
  basePrice: number
  compareAtPrice: number | null
  isActive: boolean
  isFeatured: boolean
  totalStock?: number
  variantCount?: number
  brand?: { id: string; name: string } | null
  category?: { id: string; name: string }
  createdAt: string
}

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    brandId: '',
    categoryId: '',
    productType: 'CLOTHING',
    gender: 'UNISEX',
    basePrice: '',
    compareAtPrice: '',
    isActive: false,
    isFeatured: false,
  })
  const [variants, setVariants] = useState<Array<{
    id?: string
    colorName: string
    colorHex: string
    sizeValue: string
    sizeLabel: string
    sizeCategory: string
    quantity: number
    sku: string
  }>>([])
  const [newVariant, setNewVariant] = useState({
    colorName: '',
    colorHex: '#000000',
    sizeValue: '',
    sizeLabel: '',
    sizeCategory: 'CLOTHING_ALPHA',
    quantity: 0,
    sku: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchBrands()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/admin/brands')
      if (response.ok) {
        const data = await response.json()
        setBrands(data.brands || [])
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const handleAddProduct = async () => {
    if (!formData.name.trim() || !formData.slug.trim() || !formData.categoryId || !formData.basePrice) {
      toast.error('Please fill in all required fields')
      return
    }

    if (variants.length === 0) {
      toast.error('Please add at least one variant (color/size combination)')
      return
    }

    try {
      setSubmitting(true)
      
      // Create product first
      const productResponse = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          brandId: formData.brandId || null,
        }),
      })

      const productData = await productResponse.json()

      if (!productResponse.ok) {
        throw new Error(productData.error || 'Failed to create product')
      }

      // Upload image if provided
      if (imageFile) {
        await uploadImage(productData.product.id)
      }

      // Create variants for the product
      const variantPromises = variants.map(variant =>
        fetch('/api/admin/products/variants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: productData.product.id,
            ...variant,
          }),
        })
      )

      const variantResponses = await Promise.all(variantPromises)
      const failedVariants = variantResponses.filter(r => !r.ok)
      
      if (failedVariants.length > 0) {
        toast.error(`Product created but ${failedVariants.length} variant(s) failed to create`)
      } else {
        toast.success(`Product created with ${variants.length} variant(s)`)
      }

      setIsAddModalOpen(false)
      resetForm()
      fetchProducts()
    } catch (error: any) {
      console.error('Error creating product:', error)
      toast.error(error.message || 'Failed to create product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProduct = async () => {
    if (!selectedProduct || !formData.name.trim() || !formData.slug.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      
      // Upload image if provided
      if (imageFile) {
        await uploadImage(selectedProduct.id)
      }
      
      // Update product
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          basePrice: formData.basePrice ? parseFloat(formData.basePrice) : undefined,
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          brandId: formData.brandId || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product')
      }

      // Create new variants (ones without id)
      const newVariants = variants.filter(v => !v.id)
      if (newVariants.length > 0) {
        const variantPromises = newVariants.map(variant =>
          fetch('/api/admin/products/variants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: selectedProduct.id,
              ...variant,
            }),
          })
        )

        await Promise.all(variantPromises)
      }

      toast.success('Product updated successfully')
      setIsEditModalOpen(false)
      setSelectedProduct(null)
      resetForm()
      fetchProducts()
    } catch (error: any) {
      console.error('Error updating product:', error)
      toast.error(error.message || 'Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product')
      }

      toast.success('Product deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
      fetchProducts()
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error(error.message || 'Failed to delete product')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = async (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      brandId: product.brandId || '',
      categoryId: product.categoryId,
      productType: product.productType,
      gender: product.gender,
      basePrice: product.basePrice.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || '',
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    })
    
    // Fetch product variants
    try {
      const response = await fetch(`/api/admin/products/${product.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.product.variants) {
          setVariants(data.product.variants.map((v: any) => ({
            id: v.id,
            colorName: v.colorName,
            colorHex: v.colorHex || '#000000',
            sizeValue: v.sizeValue,
            sizeLabel: v.sizeLabel || '',
            sizeCategory: v.sizeCategory,
            quantity: v.inventory?.quantity || 0,
            sku: v.sku,
          })))
        }
      }
    } catch (error) {
      console.error('Error fetching variants:', error)
    }
    
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      brandId: '',
      categoryId: '',
      productType: 'CLOTHING',
      gender: 'UNISEX',
      basePrice: '',
      compareAtPrice: '',
      isActive: false,
      isFeatured: false,
    })
    setVariants([])
    setNewVariant({
      colorName: '',
      colorHex: '#000000',
      sizeValue: '',
      sizeLabel: '',
      sizeCategory: 'CLOTHING_ALPHA',
      quantity: 0,
      sku: ''
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (productId: string): Promise<string | null> => {
    if (!imageFile) return null

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('folder', 'products')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const result = await response.json()
      const publicId = result.data?.publicId || result.publicId
      
      if (!publicId) {
        throw new Error('No publicId returned from upload')
      }

      console.log('Image uploaded, publicId:', publicId)
      
      // Create product image record
      const imageResponse = await fetch('/api/admin/products/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          imagePath: publicId,
          isPrimary: true,
          imageType: 'PRODUCT'
        }),
      })

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json()
        console.error('Failed to save image record:', errorData)
        throw new Error('Failed to save image record')
      }

      const imageData = await imageResponse.json()
      console.log('Image record created:', imageData)

      return publicId
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const generateSKU = () => {
    const prefix = formData.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '')
    const color = newVariant.colorName.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, '')
    const size = newVariant.sizeValue.toUpperCase().replace(/[^A-Z0-9]/g, '')
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `${prefix}-${color}-${size}-${random}`
  }

  const addVariant = () => {
    if (!newVariant.colorName || !newVariant.sizeValue) {
      toast.error('Please fill in color and size for the variant')
      return
    }

    const sku = newVariant.sku || generateSKU()
    
    setVariants([...variants, { ...newVariant, sku }])
    setNewVariant({
      colorName: '',
      colorHex: '#000000',
      sizeValue: '',
      sizeLabel: '',
      sizeCategory: newVariant.sizeCategory,
      quantity: 0,
      sku: ''
    })
    toast.success('Variant added')
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
    toast.success('Variant removed')
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const }
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const }
    return { label: 'In Stock', variant: 'default' as const }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage product catalog</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Variants</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const stock = product.totalStock || 0
                    const stockStatus = getStockStatus(stock)
                    const variantCount = product.variantCount || 0
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.brand?.name || 'No Brand'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.category?.name || 'Uncategorized'}
                        </TableCell>
                        <TableCell className="text-center">
                          {variantCount === 0 ? (
                            <Badge variant="destructive">No Variants</Badge>
                          ) : (
                            <Badge variant="outline">{variantCount} variant{variantCount !== 1 ? 's' : ''}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <div className="font-medium">Rs. {product.basePrice.toLocaleString()}</div>
                            {product.compareAtPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                Rs. {product.compareAtPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={stockStatus.variant}>{stock}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={product.isActive ? 'default' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData({ 
                      ...formData, 
                      name,
                      slug: formData.slug || generateSlug(name)
                    })
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="product-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                placeholder="Brief product description"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Product Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="productImage">Product Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Plus className="h-8 w-8 mx-auto mb-1" />
                      <span className="text-xs">Add Image</span>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="productImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 800x1000px, JPG or PNG
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandId">Brand</Label>
                <Select value={formData.brandId || 'none'} onValueChange={(value) => setFormData({ ...formData, brandId: value === 'none' ? '' : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Brand</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type *</Label>
                <Select value={formData.productType} onValueChange={(value) => setFormData({ ...formData, productType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLOTHING">Clothing</SelectItem>
                    <SelectItem value="SHOES">Shoes</SelectItem>
                    <SelectItem value="ACCESSORIES">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEN">Men</SelectItem>
                    <SelectItem value="WOMEN">Women</SelectItem>
                    <SelectItem value="UNISEX">Unisex</SelectItem>
                    <SelectItem value="BOYS">Boys</SelectItem>
                    <SelectItem value="GIRLS">Girls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (Rs.) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">Compare At Price (Rs.)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </div>

            {/* Variants Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label className="text-base font-semibold">Product Variants</Label>
                  <p className="text-sm text-muted-foreground">Add color and size combinations</p>
                </div>
                <Badge variant="secondary">{variants.length} variant{variants.length !== 1 ? 's' : ''}</Badge>
              </div>

              {/* Existing Variants List */}
              {variants.length > 0 && (
                <div className="space-y-2 mb-4">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: variant.colorHex }} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{variant.colorName} / {variant.sizeValue}</div>
                        <div className="text-xs text-muted-foreground">SKU: {variant.sku} • Stock: {variant.quantity}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Variant Form */}
              <div className="space-y-3 p-3 border rounded bg-muted/50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="variantColor">Color Name *</Label>
                    <Input
                      id="variantColor"
                      placeholder="e.g., Black, Red"
                      value={newVariant.colorName}
                      onChange={(e) => setNewVariant({ ...newVariant, colorName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantColorHex">Color Code</Label>
                    <Input
                      id="variantColorHex"
                      type="color"
                      value={newVariant.colorHex}
                      onChange={(e) => setNewVariant({ ...newVariant, colorHex: e.target.value })}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="variantSize">Size *</Label>
                    <Input
                      id="variantSize"
                      placeholder="e.g., M, 42"
                      value={newVariant.sizeValue}
                      onChange={(e) => setNewVariant({ ...newVariant, sizeValue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantSizeLabel">Size Label</Label>
                    <Input
                      id="variantSizeLabel"
                      placeholder="e.g., Medium"
                      value={newVariant.sizeLabel}
                      onChange={(e) => setNewVariant({ ...newVariant, sizeLabel: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantQuantity">Stock</Label>
                    <Input
                      id="variantQuantity"
                      type="number"
                      min="0"
                      value={newVariant.quantity}
                      onChange={(e) => setNewVariant({ ...newVariant, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="variantSizeCategory">Size Category</Label>
                    <Select value={newVariant.sizeCategory} onValueChange={(value) => setNewVariant({ ...newVariant, sizeCategory: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLOTHING_ALPHA">Clothing (S, M, L)</SelectItem>
                        <SelectItem value="CLOTHING_NUMERIC">Clothing (32, 34, 36)</SelectItem>
                        <SelectItem value="SHOES_US">Shoes US</SelectItem>
                        <SelectItem value="SHOES_UK">Shoes UK</SelectItem>
                        <SelectItem value="SHOES_EU">Shoes EU</SelectItem>
                        <SelectItem value="ONE_SIZE">One Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantSKU">SKU (auto-generated)</Label>
                    <Input
                      id="variantSKU"
                      placeholder="Auto-generated"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="button" variant="outline" size="sm" onClick={addVariant} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal - Same structure as Add */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug *</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-shortDescription">Short Description</Label>
              <Input
                id="edit-shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Product Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="edit-productImage">Product Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Plus className="h-8 w-8 mx-auto mb-1" />
                      <span className="text-xs">Add Image</span>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="edit-productImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload new image or keep existing
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select value={formData.brandId || 'none'} onValueChange={(value) => setFormData({ ...formData, brandId: value === 'none' ? '' : value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Brand</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Type *</Label>
                <Select value={formData.productType} onValueChange={(value) => setFormData({ ...formData, productType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLOTHING">Clothing</SelectItem>
                    <SelectItem value="SHOES">Shoes</SelectItem>
                    <SelectItem value="ACCESSORIES">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEN">Men</SelectItem>
                    <SelectItem value="WOMEN">Women</SelectItem>
                    <SelectItem value="UNISEX">Unisex</SelectItem>
                    <SelectItem value="BOYS">Boys</SelectItem>
                    <SelectItem value="GIRLS">Girls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Base Price (Rs.) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Compare At Price (Rs.)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-isFeatured">Featured</Label>
              </div>
            </div>

            {/* Variants Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label className="text-base font-semibold">Product Variants</Label>
                  <p className="text-sm text-muted-foreground">Manage color and size combinations</p>
                </div>
                <Badge variant="secondary">{variants.length} variant{variants.length !== 1 ? 's' : ''}</Badge>
              </div>

              {/* Existing Variants List */}
              {variants.length > 0 && (
                <div className="space-y-2 mb-4">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: variant.colorHex }} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{variant.colorName} / {variant.sizeValue}</div>
                        <div className="text-xs text-muted-foreground">SKU: {variant.sku} • Stock: {variant.quantity}</div>
                      </div>
                      {!variant.id && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Variant Form */}
              <div className="space-y-3 p-3 border rounded bg-muted/50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-variantColor">Color Name *</Label>
                    <Input
                      id="edit-variantColor"
                      placeholder="e.g., Black, Red"
                      value={newVariant.colorName}
                      onChange={(e) => setNewVariant({ ...newVariant, colorName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-variantColorHex">Color Code</Label>
                    <Input
                      id="edit-variantColorHex"
                      type="color"
                      value={newVariant.colorHex}
                      onChange={(e) => setNewVariant({ ...newVariant, colorHex: e.target.value })}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-variantSize">Size *</Label>
                    <Input
                      id="edit-variantSize"
                      placeholder="e.g., M, 42"
                      value={newVariant.sizeValue}
                      onChange={(e) => setNewVariant({ ...newVariant, sizeValue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-variantSizeLabel">Size Label</Label>
                    <Input
                      id="edit-variantSizeLabel"
                      placeholder="e.g., Medium"
                      value={newVariant.sizeLabel}
                      onChange={(e) => setNewVariant({ ...newVariant, sizeLabel: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-variantQuantity">Stock</Label>
                    <Input
                      id="edit-variantQuantity"
                      type="number"
                      min="0"
                      value={newVariant.quantity}
                      onChange={(e) => setNewVariant({ ...newVariant, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-variantSizeCategory">Size Category</Label>
                    <Select value={newVariant.sizeCategory} onValueChange={(value) => setNewVariant({ ...newVariant, sizeCategory: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLOTHING_ALPHA">Clothing (S, M, L)</SelectItem>
                        <SelectItem value="CLOTHING_NUMERIC">Clothing (32, 34, 36)</SelectItem>
                        <SelectItem value="SHOES_US">Shoes US</SelectItem>
                        <SelectItem value="SHOES_UK">Shoes UK</SelectItem>
                        <SelectItem value="SHOES_EU">Shoes EU</SelectItem>
                        <SelectItem value="ONE_SIZE">One Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-variantSKU">SKU (auto-generated)</Label>
                    <Input
                      id="edit-variantSKU"
                      placeholder="Auto-generated"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="button" variant="outline" size="sm" onClick={addVariant} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); resetForm(); }} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{selectedProduct?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} disabled={submitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
