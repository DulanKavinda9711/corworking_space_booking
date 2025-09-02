<template>
  <AdminLayout>
    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-red-800">{{ errorMessage }}</span>
          <button @click="loadLocation" class="ml-auto text-red-600 hover:text-red-800 font-medium">
            Retry
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-6" v-if="location && !isLoading">
      <!-- Back Button -->
      <div class="flex items-center">
        <router-link to="/locations" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Locations
        </router-link>
      </div>

      <!-- Location Profile Card -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiMapMarker" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ location.name }}</h1>
              
              <!-- Location Information -->
              <div class="mt-4 space-y-2">
                <div class="flex items-start text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiMapMarker" />
                  </svg>
                  <span>{{ getFullAddress(location) }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600" v-if="location.contactName">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiAccount" />
                  </svg>
                  {{ location.contactName }}
                </div>
                <div class="flex items-center text-sm text-gray-600" v-if="location.contactPhone">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiPhone" />
                  </svg>
                  {{ location.contactPhone }}
                </div>
                <div class="flex items-center text-sm text-gray-600" v-if="location.contactEmail">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                  </svg>
                  {{ location.contactEmail }}
                </div>
                <div class="flex items-center text-sm text-gray-600" v-if="location.mapUrl">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiOpenInNew" />
                  </svg>
                  <a :href="location.mapUrl" target="_blank" class="text-green-600 hover:text-primary-700">
                    View on Map
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <span :class="getStatusClass(location.status)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{ location.status }}
            </span>
            <router-link :to="`/locations/${location.id}/edit`" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Edit Location
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
        <span class="text-gray-600">Loading location details...</span>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { locationApi } from '@/services/api'
import { 
  mdiMapMarker, 
  mdiAccount, 
  mdiPhone, 
  mdiOpenInNew
} from '@mdi/js'

const route = useRoute()

// Location data
const location = ref<any>(null)
const isLoading = ref(true)
const errorMessage = ref('')

// Methods
const getFullAddress = (location: any) => {
  if (!location) return 'Address not available'
  
  const addressParts = [
    location.street,
    location.street2,
    location.town,
    location.district,
    location.postalCode,
    location.city
  ].filter(part => part && part.trim()) // Remove null, undefined, and empty strings
  
  return addressParts.join(', ') || 'Address not available'
}

const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

// Load location data based on route parameter
const loadLocation = async () => {
  const locationId = route.params.id as string
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await locationApi.getLocationById(locationId)
    
    if (response.success && response.data) {
      location.value = response.data
    } else {
      errorMessage.value = response.message || 'Failed to load location'
    }
  } catch (error) {
    console.error('Error loading location:', error)
    errorMessage.value = 'An unexpected error occurred while loading the location'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadLocation()
})
</script>
