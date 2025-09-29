import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Promotion {
  id: string
  name: string
  link: string
  image: string
  createdAt: string
}

export const usePromotionsStore = defineStore('promotions', () => {
  // State
  const promotions = ref<Promotion[]>([])

  // Getters
  const filteredPromotions = computed(() => {
    return promotions.value
  })

  const getPromotionById = computed(() => {
    return (id: string) => promotions.value.find(p => p.id === id)
  })

  // Actions
  const addPromotion = (promotion: Promotion) => {
    promotions.value = [...promotions.value, promotion]
  }

  const updatePromotion = (id: string, updatedPromotion: Partial<Promotion>) => {
    const index = promotions.value.findIndex(p => p.id === id)
    if (index !== -1) {
      promotions.value[index] = { ...promotions.value[index], ...updatedPromotion }
    }
  }

  const removePromotion = (id: string) => {
    promotions.value = promotions.value.filter(p => p.id !== id)
  }

  const setPromotions = (newPromotions: Promotion[]) => {
    promotions.value = newPromotions
  }

  const clearPromotions = () => {
    promotions.value = []
  }

  return {
    // State
    promotions,

    // Getters
    filteredPromotions,
    getPromotionById,

    // Actions
    addPromotion,
    updatePromotion,
    removePromotion,
    setPromotions,
    clearPromotions
  }
}, {
  persist: true
})
