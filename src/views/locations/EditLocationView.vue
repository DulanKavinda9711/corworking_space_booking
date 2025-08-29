<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/locations" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Edit Location</h1>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <form @submit.prevent="updateLocation" class="space-y-6">
          <!-- Single Card with All Information -->
          <div class="bg-white rounded-xl shadow-card overflow-hidden">
            <div class="p-8 space-y-16">
              
              <!-- Location Details Section -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiMapMarker" />
                  </svg>
                  Location Details
                </h2>
                
                <!-- Form Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Location Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.name" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter location name" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Address <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.address" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter full address" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Map URL
                    </label>
                    <input type="url" v-model="form.mapUrl"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="https://maps.google.com/..." />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input type="text" v-model="form.location"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="City, State/Province" />
                  </div>
                </div>
              </div>

              <!-- Contact Information Section -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiAccount" />
                  </svg>
                  Contact Information
                </h2>
                
                <!-- Contact Fields -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.contactPersonName" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter contact person name" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone Number <span class="text-red-500">*</span>
                    </label>
                    <input type="tel" v-model="form.contactPhone" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="+1-555-0123" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input type="email" v-model="form.contactEmail" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="contact@company.com" />
                  </div>
                </div>
              </div>

              <!-- Action Buttons - Bottom Right -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <router-link to="/locations"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </router-link>
                <button type="submit" :disabled="!isFormValid"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Update Location</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import { mdiMapMarker, mdiAccount } from '@mdi/js'

const route = useRoute()
const router = useRouter()

// Form state
const form = ref({
  id: '',
  name: '',
  address: '',
  mapUrl: '',
  location: '',
  contactPersonName: '',
  contactPhone: '',
  contactEmail: ''
})

// Sample location data - REMOVED: Mock data has been removed

// Computed properties
const isFormValid = computed(() => {
  return form.value.name && 
         form.value.address && 
         form.value.contactPersonName && 
         form.value.contactPhone && 
         form.value.contactEmail
})

// Methods
function loadLocationData() {
  // In a real app, this would fetch data based on route.params.id
  const locationId = route.params.id
  
  // TODO: Implement API call to fetch location data
  console.log('Loading location data for:', locationId)
}

function updateLocation() {
  // In a real app, this would make an API call to update the location
  console.log('Updating location:', form.value)
  
  // Simulate success and redirect
  router.push('/locations')
}

// Initialize component
onMounted(loadLocationData)
</script>
