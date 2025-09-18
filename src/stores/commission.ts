import { defineStore } from 'pinia'
import { ref } from 'vue'

interface CommissionSettings {
  SquareHubRate: number
  ceylincoRate: number
}

export const useCommissionStore = defineStore('commission', () => {
  // State - Pinia persistence will handle localStorage automatically
  const commissionSettings = ref<CommissionSettings>({
    SquareHubRate: 30.0,
    ceylincoRate: 70.0
  })

  // Actions
  const updateCommissionSettings = (settings: Partial<CommissionSettings>) => {
    commissionSettings.value = { ...commissionSettings.value, ...settings }

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