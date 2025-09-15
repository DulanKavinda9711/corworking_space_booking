import { defineStore } from 'pinia'
import { ref } from 'vue'

interface CommissionSettings {
  SquareHubRate: number
  ceylincoRate: number
}

export const useCommissionStore = defineStore('commission', () => {
  // State
  const commissionSettings = ref<CommissionSettings>({
    SquareHubRate: 30.0,
    ceylincoRate: 70.0
  })

  // Initialize from localStorage
  const savedSettings = localStorage.getItem('commissionSettings')
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings)
      commissionSettings.value = { ...commissionSettings.value, ...parsedSettings }
    } catch (error) {
      console.error('Error loading commission settings:', error)
    }
  }

  // Actions
  const updateCommissionSettings = (settings: Partial<CommissionSettings>) => {
    commissionSettings.value = { ...commissionSettings.value, ...settings }
    localStorage.setItem('commissionSettings', JSON.stringify(commissionSettings.value))

    // Emit custom event for components that need to react to changes
    window.dispatchEvent(new CustomEvent('commissionSettingsUpdated', {
      detail: commissionSettings.value
    }))
  }

  const setSquareHubRate = (rate: number) => {
    updateCommissionSettings({ SquareHubRate: rate })
  }

  const setCeylincoRate = (rate: number) => {
    updateCommissionSettings({ ceylincoRate: rate })
  }

  return {
    commissionSettings,
    updateCommissionSettings,
    setSquareHubRate,
    setCeylincoRate
  }
})