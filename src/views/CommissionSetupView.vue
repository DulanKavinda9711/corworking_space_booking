<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/payments" class="flex items-center text-gray-600 hover:text-gray-900">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Payments
          </router-link>
        </div>
        
      </div>

      <!-- Commission Setup Form -->
      <div class="bg-white rounded-xl shadow-card">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Commission Setup</h1>
          
        </div>

        <form class="p-6 space-y-8">
          <!-- Commission Summary -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Commission Summary</h3>
            <div class="bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg p-6 border border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center">
                  <label class="block text-sm font-medium text-gray-500 mb-2">SquareHub Rate</label>
                  <span class="text-2xl font-bold text-green-600">{{ commissionSettings.SquareHubRate }}%</span>
                </div>
                <div class="text-center">
                  <label class="block text-sm font-medium text-gray-500 mb-2">Ceylinco Rate</label>
                  <span class="text-2xl font-bold text-emerald-600">{{ commissionSettings.ceylincoRate }}%</span>
                </div>
                <div class="text-center">
                  <label class="block text-sm font-medium text-gray-500 mb-2">Total Rate</label>
                  <span class="text-2xl font-bold text-teal-600">{{ totalCommissionRate }}%</span>
                </div>
              </div>

              <div v-if="totalCommissionRate !== 100" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm text-yellow-700">
                  ℹ️ Commission rates are automatically adjusted to maintain a total of 100%.
                </p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-200"></div>

          <!-- Commission Rates Section -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Commission Rates</h3>
        

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- SquareHub Commission -->
              <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-medium text-gray-500">SquareHub Commission</h4>

                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-green-700 mb-2">Commission Rate (%)</label>
                    <div class="relative">
                      <input
                        type="number"
                        v-model="commissionSettings.SquareHubRate"
                        min="0"
                        max="100"
                        step="0.1"
                        :disabled="!isEditing"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="50.0"
                      />
                    </div>
                  </div>

                  
                </div>
              </div>

              <!-- Ceylinco Commission -->
              <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-medium text-gray-500">Ceylinco Commission</h4>
                  
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-emerald-700 mb-2">Commission Rate (%)</label>
                    <div class="relative">
                      <input
                        type="number"
                        v-model="commissionSettings.ceylincoRate"
                        min="0"
                        max="100"
                        step="0.1"
                        :disabled="!isEditing"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="50.0"
                      />
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <template v-if="!isEditing">
              <button
                @click="startEditing"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Edit Commission Settings
              </button>
            </template>
            <template v-else>
              <button
                @click="cancelEditing"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="saveCommissionSettings"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </template>
          </div>
        </form>
      </div>

      
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiCog } from '@mdi/js'

// Commission settings - SquareHub and Ceylinco only
const commissionSettings = ref({
  SquareHubRate: 50.0,
  SquareHubFixedFee: 0.00,
  ceylincoRate: 50.0,
  ceylincoFixedFee: 0.00
})

// Edit mode state
const isEditing = ref(false)
const originalSettings = ref({ ...commissionSettings.value })

// Computed properties for commission calculations
const totalCommissionRate = computed(() => {
  return commissionSettings.value.SquareHubRate + commissionSettings.value.ceylincoRate
})

// Sample calculations for preview
const sampleSquareHubCommission = computed(() => {
  const rate = commissionSettings.value.SquareHubRate / 100
  return (150 * rate).toFixed(2)
})

const sampleCeylincoCommission = computed(() => {
  const rate = commissionSettings.value.ceylincoRate / 100
  return (150 * rate).toFixed(2)
})

const sampleNetToPartner = computed(() => {
  const SquareHubAmount = parseFloat(sampleSquareHubCommission.value)
  const ceylincoAmount = parseFloat(sampleCeylincoCommission.value)
  return (150 - SquareHubAmount - ceylincoAmount).toFixed(2)
})

const sampleSquareHubCommission300 = computed(() => {
  const rate = commissionSettings.value.SquareHubRate / 100
  return (300 * rate).toFixed(2)
})

const sampleCeylincoCommission300 = computed(() => {
  const rate = commissionSettings.value.ceylincoRate / 100
  return (300 * rate).toFixed(2)
})

const sampleNetToPartner300 = computed(() => {
  const SquareHubAmount = parseFloat(sampleSquareHubCommission300.value)
  const ceylincoAmount = parseFloat(sampleCeylincoCommission300.value)
  return (300 - SquareHubAmount - ceylincoAmount).toFixed(2)
})

// Flag to prevent infinite watcher loops
let isAutoAdjusting = false

// Watch for SquareHub rate changes and auto-adjust Ceylinco rate
watch(() => commissionSettings.value.SquareHubRate, (newSquareHubRate) => {
  if (isEditing.value && !isAutoAdjusting) {
    isAutoAdjusting = true
    const adjustedCeylincoRate = Math.max(0, Math.min(100, 100 - newSquareHubRate))
    commissionSettings.value.ceylincoRate = adjustedCeylincoRate
    // Reset flag after a short delay to allow DOM updates
    setTimeout(() => { isAutoAdjusting = false }, 0)
  }
})

// Watch for Ceylinco rate changes and auto-adjust SquareHub rate
watch(() => commissionSettings.value.ceylincoRate, (newCeylincoRate) => {
  if (isEditing.value && !isAutoAdjusting) {
    isAutoAdjusting = true
    const adjustedSquareHubRate = Math.max(0, Math.min(100, 100 - newCeylincoRate))
    commissionSettings.value.SquareHubRate = adjustedSquareHubRate
    // Reset flag after a short delay to allow DOM updates
    setTimeout(() => { isAutoAdjusting = false }, 0)
  }
})

// Methods
const loadCommissionSettings = () => {
  // Load commission settings from localStorage
  const savedSettings = localStorage.getItem('commissionSettings')
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings)
      commissionSettings.value = { ...commissionSettings.value, ...parsedSettings }
      originalSettings.value = { ...commissionSettings.value }
    } catch (error) {
      console.error('Error loading commission settings:', error)
    }
  }
}

const startEditing = () => {
  originalSettings.value = { ...commissionSettings.value }
  isEditing.value = true
}

const cancelEditing = () => {
  commissionSettings.value = { ...originalSettings.value }
  isEditing.value = false
}

const saveCommissionSettings = () => {
  // Save commission settings to localStorage for persistence across pages
  localStorage.setItem('commissionSettings', JSON.stringify(commissionSettings.value))

  // In a real app, this would also save to the backend
  console.log('Saving commission settings:', commissionSettings.value)

  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('commissionSettingsUpdated', {
    detail: commissionSettings.value
  }))

  // Show success message and exit edit mode
  alert('Commission settings saved successfully! Changes will apply to all payment calculations.')
  isEditing.value = false
}
</script>
