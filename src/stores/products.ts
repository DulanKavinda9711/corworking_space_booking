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
  // State
  const deletedProducts = ref<DeletedProduct[]>([])

  // Initialize from localStorage
  const initializeDeletedProducts = () => {
    try {
      const savedDeletedProducts = localStorage.getItem('deletedProducts')
      if (savedDeletedProducts) {
        const parsedProducts = JSON.parse(savedDeletedProducts)
        if (Array.isArray(parsedProducts)) {
          deletedProducts.value = parsedProducts
        }
      }
    } catch (error) {
      console.warn('⚠️ Error initializing deleted products from localStorage:', error)
    }
  }

  // Actions
  const addDeletedProduct = (product: any) => {
    const deletedProduct: DeletedProduct = {
      ...product,
      deletedAt: new Date().toISOString(),
      deletedBy: 'Admin User'
    }

    deletedProducts.value.push(deletedProduct)
    localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts.value))
  }

  // Initialize on store creation
  initializeDeletedProducts()

  return {
    // State
    deletedProducts,

    // Actions
    initializeDeletedProducts,
    addDeletedProduct
  }
})