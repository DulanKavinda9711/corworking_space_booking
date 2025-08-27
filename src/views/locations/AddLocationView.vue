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
                
                <!-- Form Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Address <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.address"
                      :class="[
                        'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                        showValidation && !form.address.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                      ]"
                      placeholder="Enter full address" />
                    <div v-if="showValidation && !form.address.trim()" class="mt-1 text-sm text-red-600">
                      Address is required
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
                    <input type="text" v-model="form.contactPersonName"
                      :class="[
                        'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                        showValidation && !form.contactPersonName.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                      ]"
                      placeholder="Enter contact person name" />
                    <div v-if="showValidation && !form.contactPersonName.trim()" class="mt-1 text-sm text-red-600">
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
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create Location</span>
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
import { mdiMapMarker, mdiAccount } from '@mdi/js'

const router = useRouter()

// Form data
const form = ref({
  name: '',
  address: '',
  mapUrl: '',
  location: '',
  contactPersonName: '',
  contactPhone: '',
  contactEmail: ''
})

// Validation state for custom error display
const showValidation = ref(false)

// Form validation
const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.address.trim() !== '' &&
         form.value.mapUrl.trim() !== '' &&
         form.value.location.trim() !== '' &&
         form.value.contactPersonName.trim() !== '' &&
         form.value.contactPhone.trim() !== '' &&
         form.value.contactEmail.trim() !== ''
})

// Methods
const saveLocation = () => {
  showValidation.value = true
  if (!isFormValid.value) {
    return
  }

  // Here you would typically send the data to your API
  console.log('Creating location:', form.value)
  
  // Show success message
  alert('Location created successfully!')
  
  // Navigate back to locations list
  router.push('/locations')
}
</script>
