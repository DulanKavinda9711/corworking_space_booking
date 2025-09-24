import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Promotion {
  id: string
  name: string
  description?: string
  image: string
  createdAt: string
}

export const usePromotionsStore = defineStore('promotions', () => {
  // State
  const promotions = ref<Promotion[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const allPromotions = computed(() => promotions.value)
  const promotionsCount = computed(() => promotions.value.length)

  // Actions
  const setPromotions = (newPromotions: Promotion[]) => {
    promotions.value = newPromotions
  }

  const addPromotion = (promotion: Promotion) => {
    promotions.value.unshift(promotion) // Add to beginning of array
  }

  const updatePromotion = (updatedPromotion: Promotion) => {
    const index = promotions.value.findIndex(p => p.id === updatedPromotion.id)
    if (index !== -1) {
      promotions.value[index] = updatedPromotion
    }
  }

  const removePromotion = (promotionId: string) => {
    const index = promotions.value.findIndex(p => p.id === promotionId)
    if (index !== -1) {
      promotions.value.splice(index, 1)
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    promotions,
    isLoading,
    error,

    // Getters
    allPromotions,
    promotionsCount,

    // Actions
    setPromotions,
    addPromotion,
    updatePromotion,
    removePromotion,
    setLoading,
    setError,
    clearError
  }
})