import { create } from 'zustand'

export interface CartItem {
  id: string
  quantity: number
  variantId?: string // Helpful for optimistic updates or checks
  variant: {
    id: string
    sku: string
    colorName: string
    colorHex: string | null
    sizeValue: string
    sizeLabel: string | null
    price: number
    inStock: boolean
    availableQuantity: number
  }
  product: {
    id: string
    name: string
    slug: string
    brand: string
    image: string
  }
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  fetchCart: () => Promise<void>
  addToCart: (variantId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/cart')
      if (!response.ok) throw new Error('Failed to fetch cart')
      const data = await response.json()
      set({ items: data.items || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  addToCart: async (variantId: string, quantity: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add to cart')
      }
      
      // Refresh cart to get the latest state (including formatted items)
      await get().fetchCart()
    } catch (error) {
      set({ error: (error as Error).message })
      throw error // Re-throw so components can handle specific UI feedback (like toasts)
    } finally {
      set({ isLoading: false })
    }
  },

  removeFromCart: async (itemId: string) => {
    // Optimistic update
    const previousItems = get().items
    set({ items: previousItems.filter((item) => item.id !== itemId) })

    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove item')
      }
      
      // No need to re-fetch if successful, optimistic update covers it.
      // But if we want to be super safe about totals/prices:
      // await get().fetchCart() 
    } catch (error) {
      // Revert
      set({ items: previousItems, error: (error as Error).message })
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    // Optimistic update
    const previousItems = get().items
    set({
      items: previousItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    })

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      })

      if (!response.ok) {
        throw new Error('Failed to update quantity')
      }
      
      // Fetch to ensure consistency (e.g. if stock limits changed things)
      // await get().fetchCart()
    } catch (error) {
      set({ items: previousItems, error: (error as Error).message })
    }
  },

  clearCart: async () => {
    set({ items: [], isLoading: true })
    try {
      const response = await fetch('/api/cart?clearAll=true', {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to clear cart')
    } catch (error) {
      set({ error: (error as Error).message })
      // Ideally we should reload cart here if it failed, but clearing local is usually fine for UX
      await get().fetchCart()
    } finally {
      set({ isLoading: false })
    }
  },
}))
