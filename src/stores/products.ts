import { defineStore } from 'pinia'
import { ref } from 'vue'

interface DeletedProduct {
  id: string
  name: string
  type: string
  price: number
  location: string
  capacity?: number
  facilities?: string[]
  image?: string
  description?: string
  deletedAt: string
  deletedBy: string
  // Add other product fields as needed
  [key: string]: any
}

export const useProductsStore = defineStore('products', () => {
  // State - Pinia persistence will handle localStorage automatically
  const deletedProducts = ref<DeletedProduct[]>([])

  // Actions
  const addDeletedProduct = (product: any) => {
    const deletedProduct: DeletedProduct = {
      ...product,
      deletedAt: new Date().toISOString(),
      deletedBy: 'Admin User'
    }

    deletedProducts.value.push(deletedProduct)
  }

  return {
    // State
    deletedProducts,

    // Actions
    addDeletedProduct
  }
})