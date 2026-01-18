'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Edit, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface InventoryItem {
  id: string
  quantity: number
  reservedQuantity: number
  lowStockThreshold: number
  allowBackorder: boolean
  variant: {
    sku: string
    colorName: string
    sizeValue: string
    product: {
      name: string
      brand: {
        name: string
      } | null
      category: {
        name: string
      }
    }
  }
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    quantity: 0,
    lowStockThreshold: 5,
    allowBackorder: false
  })

  useEffect(() => {
    fetchInventory()
  }, [showLowStock])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const url = showLowStock
        ? '/api/admin/inventory?lowStock=true'
        : '/api/admin/inventory'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory')
      }
      
      const data = await response.json()
      setInventory(data.inventory || [])
    } catch (error) {
      console.error('Error fetching inventory:', error)
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateInventory = async () => {
    if (!selectedItem) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/admin/inventory/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update inventory')
      }

      toast.success('Inventory updated successfully')
      setIsEditModalOpen(false)
      setSelectedItem(null)
      fetchInventory()
    } catch (error: any) {
      console.error('Error updating inventory:', error)
      toast.error(error.message || 'Failed to update inventory')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setFormData({
      quantity: item.quantity,
      lowStockThreshold: item.lowStockThreshold,
      allowBackorder: item.allowBackorder
    })
    setIsEditModalOpen(true)
  }

  const filteredInventory = inventory.filter(item =>
    item.variant.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.variant.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { label: 'Out of Stock', variant: 'destructive' as const }
    if (item.quantity <= item.lowStockThreshold) return { label: 'Low Stock', variant: 'secondary' as const }
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
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage product stock levels</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showLowStock ? 'default' : 'outline'}
              onClick={() => setShowLowStock(!showLowStock)}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Low Stock Only
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-center">Reserved</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => {
                    const status = getStockStatus(item)
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.variant.product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.variant.product.brand?.name || 'No Brand'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.variant.sku}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {item.variant.colorName} / {item.variant.sizeValue}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.reservedQuantity}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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

      {/* Edit Inventory Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div>
                <div className="font-medium">{selectedItem.variant.product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedItem.variant.colorName} / {selectedItem.variant.sizeValue} ({selectedItem.variant.sku})
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowBackorder"
                  checked={formData.allowBackorder}
                  onChange={(e) => setFormData({ ...formData, allowBackorder: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="allowBackorder">Allow Backorder</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateInventory} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
