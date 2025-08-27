<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/facilities" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Add New Facility</h1>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <form @submit.prevent="saveFacility" class="space-y-6">
          <!-- Single Card with All Information -->
          <div class="bg-white rounded-xl shadow-card overflow-hidden">
            <div class="p-8 space-y-16">
              <!-- Facility Details Section -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCog" />
                  </svg>
                  Facility Details
                </h2>
                
                <!-- Form Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Facility Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.name"
                      :class="[
                        'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                        showValidation && !form.name.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                      ]"
                      placeholder="Enter facility name" />
                    <div v-if="showValidation && !form.name.trim()" class="mt-1 text-sm text-red-600">
                      Facility name is required
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select v-model="form.status"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Action Buttons - Bottom Right -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <router-link to="/facilities"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </router-link>
                <button type="submit"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create Facility</span>
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
import { mdiCog } from '@mdi/js'

const router = useRouter()

// Form data - only name and status as requested
const form = ref({
  name: '',
  status: 'active' as 'active' | 'inactive'
})

// Validation state
const showValidation = ref(false)

// Form validation
const isFormValid = computed(() => {
  return form.value.name.trim() !== ''
})

// Methods
const saveFacility = () => {
  // Show validation
  showValidation.value = true
  
  // Check if form is valid
  if (!form.value.name.trim()) {
    return
  }

  // Here you would typically send the data to your API
  console.log('Creating facility:', form.value)
  
  // Show success message
  alert('Facility created successfully!')
  
  // Navigate back to facilities list
  router.push('/facilities')
}
</script>
