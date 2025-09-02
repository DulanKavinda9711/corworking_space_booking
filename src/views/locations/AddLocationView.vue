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
            <h1 class="text-xl font-bold text-gray-900">Add New Location</h1>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-red-800">{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <form @submit.prevent="saveLocation" class="space-y-6">
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
                
                <!-- Location Name Field -->
                <div class="mb-8">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Location Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.name"
                      :class="[
                        'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                        showValidation && !form.name.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                      ]"
                      placeholder="Enter location name" />
                    <div v-if="showValidation && !form.name.trim()" class="mt-1 text-sm text-red-600">
                      Location name is required
                    </div>
                  </div>
                </div>

                <!-- Address Section -->
                <div>
                  <h3 class="text-sm font-medium text-gray-800 mb-4">Address</h3>
                  
                  <!-- Address Form Fields -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Street <span class="text-red-500">*</span>
                      </label>
                      <input type="text" v-model="form.street"
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                          showValidation && !form.street.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                        ]"
                        placeholder="Enter street address" />
                      <div v-if="showValidation && !form.street.trim()" class="mt-1 text-sm text-red-600">
                        Street address is required
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Street 2
                      </label>
                      <input type="text" v-model="form.streetTwo"
                        class="w-full rounded-lg px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-primary-500 text-gray-900 transition-colors"
                        placeholder="Additional street address (optional)" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code <span class="text-red-500">*</span>
                      </label>
                      <input type="text" v-model="form.postalCode"
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                          showValidation && !form.postalCode.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                        ]"
                        placeholder="Enter postal code" />
                      <div v-if="showValidation && !form.postalCode.trim()" class="mt-1 text-sm text-red-600">
                        Postal code is required
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Town <span class="text-red-500">*</span>
                      </label>
                      <input type="text" v-model="form.town"
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                          showValidation && !form.town.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                        ]"
                        placeholder="Enter town/city" />
                      <div v-if="showValidation && !form.town.trim()" class="mt-1 text-sm text-red-600">
                        Town is required
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        District <span class="text-red-500">*</span>
                      </label>
                      <input type="text" v-model="form.district"
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                          showValidation && !form.district.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                        ]"
                        placeholder="Enter district" />
                      <div v-if="showValidation && !form.district.trim()" class="mt-1 text-sm text-red-600">
                        District is required
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Map URL <span class="text-red-500">*</span>
                      </label>
                      <input type="url" v-model="form.mapUrl"
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                          showValidation && !form.mapUrl.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                        ]"
                        placeholder="https://maps.google.com/..." />
                      <div v-if="showValidation && !form.mapUrl.trim()" class="mt-1 text-sm text-red-600">
                        Map URL is required
                      </div>
                    </div>
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
                    <input type="text" v-model="form.contactName"
                      :class="[
                        'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                        showValidation && !form.contactName.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                      ]"
                      placeholder="Enter contact person name" />
                    <div v-if="showValidation && !form.contactName.trim()" class="mt-1 text-sm text-red-600">
                      Contact person name is required
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone Number <span class="text-red-500">*</span>
                    </label>
                    <input type="tel" v-model="form.contactPhone"
                      :class="[
                        'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                        showValidation && !form.contactPhone.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                      ]"
                      placeholder="+1-555-0123" />
                    <div v-if="showValidation && !form.contactPhone.trim()" class="mt-1 text-sm text-red-600">
                      Contact phone number is required
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input type="email" v-model="form.contactEmail"
                      :class="[
                        'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                        showValidation && !form.contactEmail.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                      ]"
                      placeholder="contact@company.com" />
                    <div v-if="showValidation && !form.contactEmail.trim()" class="mt-1 text-sm text-red-600">
                      Email is required
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons - Bottom Right -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <router-link to="/locations"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </router-link>
                <button type="submit"
                  :disabled="isLoading"
                  class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2">
                  <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ isLoading ? 'Creating...' : 'Create Location' }}</span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { locationApi } from '@/services/api'
import { mdiMapMarker, mdiAccount } from '@mdi/js'

const router = useRouter()

// Form data
const form = ref({
  name: '',
  street: '',
  streetTwo: '',
  postalCode: '',
  town: '',
  district: '',
  mapUrl: '',
  contactName: '',
  contactPhone: '',
  contactEmail: ''
})

// Validation state for custom error display
const showValidation = ref(false)

// Loading state
const isLoading = ref(false)

// Error message
const errorMessage = ref('')

// Form validation
const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.street.trim() !== '' &&
         form.value.postalCode.trim() !== '' &&
         form.value.town.trim() !== '' &&
         form.value.district.trim() !== '' &&
         form.value.mapUrl.trim() !== '' &&
         form.value.contactName.trim() !== '' &&
         form.value.contactPhone.trim() !== '' &&
         form.value.contactEmail.trim() !== ''
})

// Methods
const saveLocation = async () => {
  showValidation.value = true
  errorMessage.value = ''

  if (!isFormValid.value) {
    return
  }

  isLoading.value = true

  try {
    // Build full address from individual fields

    const response = await locationApi.createLocation({
      Name: form.value.name,
      Street: form.value.street,
      StreetTwo: form.value.streetTwo,
      PostalCode: form.value.postalCode,
      Town: form.value.town,
      Url: form.value.mapUrl,
      District: form.value.district,
      ContactName: form.value.contactName,
      ContactEmail: form.value.contactEmail,
      ContactPhone: form.value.contactPhone
    })

    if (response.success) {
      // Show success message
      alert(response.message || 'Location created successfully!')

      // Navigate back to locations list
      router.push('/locations')
    } else {
      // Show error message
      errorMessage.value = response.message || 'Failed to create location'
    }
  } catch (error) {
    console.error('Error creating location:', error)
    errorMessage.value = 'An unexpected error occurred while creating the location'
  } finally {
    isLoading.value = false
  }
}
</script>
