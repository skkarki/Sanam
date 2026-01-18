'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react'
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
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logoPublicId: string | null
  websiteUrl: string | null
  isFeatured: boolean
  isActive: boolean
  productCount: number
  createdAt: string
  updatedAt: string
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logoPublicId: '',
    websiteUrl: '',
    isFeatured: false,
    isActive: true
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/brands')
      
      if (!response.ok) {
        throw new Error('Failed to fetch brands')
      }
      
      const data = await response.json()
      setBrands(data.brands || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
      toast.error('Failed to load brands')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBrand = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Name and slug are required')
      return
    }

    try {
      setSubmitting(true)
      
      // Upload image if selected
      let logoPublicId = formData.logoPublicId
      if (imageFile) {
        setUploadingImage(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          logoPublicId = uploadData.publicId || uploadData.url
        }
        setUploadingImage(false)
      }
      
      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          logoPublicId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create brand')
      }

      toast.success('Brand created successfully')
      setIsAddModalOpen(false)
      resetForm()
      fetchBrands()
    } catch (error: any) {
      console.error('Error creating brand:', error)
      toast.error(error.message || 'Failed to create brand')
    } finally {
      setSubmitting(false)
      setUploadingImage(false)
    }
  }

  const handleEditBrand = async () => {
    if (!selectedBrand || !formData.name.trim() || !formData.slug.trim()) {
      toast.error('Name and slug are required')
      return
    }

    try {
      setSubmitting(true)
      
      // Upload image if selected
      let logoPublicId = formData.logoPublicId
      if (imageFile) {
        setUploadingImage(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          logoPublicId = uploadData.publicId || uploadData.url
        }
        setUploadingImage(false)
      }
      
      const response = await fetch(`/api/admin/brands/${selectedBrand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          logoPublicId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update brand')
      }

      toast.success('Brand updated successfully')
      setIsEditModalOpen(false)
      setSelectedBrand(null)
      resetForm()
      fetchBrands()
    } catch (error: any) {
      console.error('Error updating brand:', error)
      toast.error(error.message || 'Failed to update brand')
    } finally {
      setSubmitting(false)
      setUploadingImage(false)
    }
  }

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/admin/brands/${selectedBrand.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.error?.includes('products')) {
          toast.error(`Cannot delete "${selectedBrand.name}". It has ${selectedBrand.productCount} product(s). Please reassign or delete those products first.`)
        } else {
          toast.error(data.error || 'Failed to delete brand')
        }
        setIsDeleteDialogOpen(false)
        setSelectedBrand(null)
        return
      }

      toast.success('Brand deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedBrand(null)
      fetchBrands()
    } catch (error: any) {
      console.error('Error deleting brand:', error)
      toast.error(error.message || 'Failed to delete brand')
      setIsDeleteDialogOpen(false)
      setSelectedBrand(null)
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand)
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logoPublicId: brand.logoPublicId || '',
      websiteUrl: brand.websiteUrl || '',
      isFeatured: brand.isFeatured,
      isActive: brand.isActive
    })
    setImagePreview(brand.logoPublicId || '')
    setImageFile(null)
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      logoPublicId: '',
      websiteUrl: '',
      isFeatured: false,
      isActive: true
    })
    setImageFile(null)
    setImagePreview('')
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
          <p className="text-muted-foreground">Manage product brands</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search brands..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No brands found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBrands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell className="text-muted-foreground">{brand.slug}</TableCell>
                      <TableCell className="text-center">{brand.productCount}</TableCell>
                      <TableCell className="text-center">
                        {brand.isFeatured && <Badge variant="outline">Featured</Badge>}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={brand.isActive ? 'default' : 'secondary'}>
                          {brand.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(brand)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(brand)}
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

      {/* Add Brand Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter brand name"
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
                placeholder="brand-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter brand description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                placeholder="https://example.com"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Brand Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                </div>
              )}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAddBrand} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter brand name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                placeholder="brand-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter brand description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-websiteUrl">Website URL</Label>
              <Input
                id="edit-websiteUrl"
                placeholder="https://example.com"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logo">Brand Logo</Label>
              <Input
                id="edit-logo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                </div>
              )}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleEditBrand} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Brand
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
              This will permanently delete the brand "{selectedBrand?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBrand} disabled={submitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
