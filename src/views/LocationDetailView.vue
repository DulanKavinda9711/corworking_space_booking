<template>
  <AdminLayout>
    <div class="space-y-6" v-if="location">
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
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
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
                  <span>{{ location.address }}, {{ location.city }}, {{ location.country }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600" v-if="location.contactPersonName">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiAccount" />
                  </svg>
                  {{ location.contactPersonName }}
                </div>
                <div class="flex items-center text-sm text-gray-600" v-if="location.contactPhone">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiPhone" />
                  </svg>
                  {{ location.contactPhone }}
                </div>
                <div class="flex items-center text-sm text-gray-600" v-if="location.mapUrl">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiOpenInNew" />
                  </svg>
                  <a :href="location.mapUrl" target="_blank" class="text-primary-600 hover:text-primary-700">
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
            <router-link :to="`/locations/${location.id}/edit`" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Location
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  mdiMapMarker, 
  mdiAccount, 
  mdiPhone, 
  mdiOpenInNew
} from '@mdi/js'

const route = useRoute()

// Sample location data
const location = ref({
  id: 'LC-001',
  name: 'Main Branch - Downtown',
  address: '123 Business Street, Suite 100',
  city: 'New York',
  country: 'United States',
  status: 'active',
  mapUrl: 'https://maps.google.com/example1',
  contactPersonName: 'John Smith',
  contactPhone: '+1 (555) 123-4567'
})

// Methods
const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

// Load location data based on route parameter
onMounted(() => {
  const locationId = route.params.id
  // Here you would typically fetch the location data from your API
  console.log('Loading location:', locationId)
})
</script>
