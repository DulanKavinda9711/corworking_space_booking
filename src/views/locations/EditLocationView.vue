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

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeSuccessModal">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
          <div class="mt-3 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Success!</h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">Update successful!</p>
            </div>
            <div class="items-center px-4 py-3">
              <button @click="closeSuccessModal"
                class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Modal -->
      <div v-if="showErrorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeErrorModal">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
          <div class="mt-3 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Error</h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">{{ error }}</p>
            </div>
            <div class="items-center px-4 py-3 flex space-x-3">
              <button @click="closeErrorModal"
                class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 flex-1">
                Close
              </button>
              <button @click="retryUpdateLocation"
                class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 flex-1">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="text-red-800">{{ error }}</p>
          </div>
        </div>

        <form @submit.prevent="updateLocation" class="space-y-6" v-if="!loading">
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
                      Street <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.street" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter street address" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Street 2
                    </label>
                    <input type="text" v-model="form.street2"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Additional street address (optional)" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.postalCode" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter postal code" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Town <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.town" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter town/city" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      District <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.district" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter district" />
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
                <button type="submit" :disabled="!isFormValid || loading"
                  class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                  <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ loading ? 'Updating...' : 'Update Location' }}</span>
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
import { locationApi } from '../../services/api'

const route = useRoute()
const router = useRouter()

// Loading state
const loading = ref(false)
const error = ref('')

// Modal states
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const successMessage = ref('')

// Form state
const form = ref({
  id: '',
  name: '',
  street: '',
  street2: '',
  postalCode: '',
  town: '',
  district: '',
  mapUrl: '',
  location: '',
  contactPersonName: '',
  contactPhone: '',
  contactEmail: ''
})

// Computed properties
const isFormValid = computed(() => {
  return form.value.name && 
         form.value.street && 
         form.value.postalCode && 
         form.value.town && 
         form.value.district && 
         form.value.contactPersonName && 
         form.value.contactPhone && 
         form.value.contactEmail
})

// Methods
async function loadLocationData() {
  const locationId = route.params.id as string
  
  if (!locationId) {
    error.value = 'No location ID provided'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await locationApi.getLocationById(locationId)
    if (response.success && response.data) {
      const location = response.data
      form.value = {
        id: location.id,
        name: location.name || '',
        street: location.street || '',
        street2: location.street2 || '',
        postalCode: location.postalCode || '',
        town: location.town || '',
        district: location.district || '',
        mapUrl: location.mapUrl || '',
        location: location.city || '',
        contactPersonName: location.contactName || '',
        contactPhone: location.contactPhone || '',
        contactEmail: location.contactEmail || ''
      }
    } else {
      error.value = response.message || 'Failed to load location data'
    }
  } catch (err) {
    console.error('Failed to load location data:', err)
    error.value = 'Network error while loading location data'
  } finally {
    loading.value = false
  }
}

async function updateLocation() {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await locationApi.updateLocation(form.value.id, {
      Name: form.value.name,
      Street: form.value.street,
      StreetTwo: form.value.street2,
      PostalCode: form.value.postalCode,
      Town: form.value.town,
      District: form.value.district,
      Url: form.value.mapUrl,
      ContactName: form.value.contactPersonName,
      ContactEmail: form.value.contactEmail,
      ContactPhone: form.value.contactPhone
    })

    if (response.success) {
      console.log('Location updated successfully:', response.data)
      successMessage.value = response.message || 'Location updated successfully!'
      showSuccessModal.value = true
    } else {
      error.value = response.message || 'Failed to update location'
      showErrorModal.value = true
    }
  } catch (err) {
    console.error('Failed to update location:', err)
    error.value = 'Network error while updating location'
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}

// Modal methods
const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Navigate back to locations list after closing success modal
  router.push('/locations')
}

const closeErrorModal = () => {
  showErrorModal.value = false
}

const retryUpdateLocation = () => {
  showErrorModal.value = false
  updateLocation()
}

// Initialize component
onMounted(loadLocationData)
</script>
