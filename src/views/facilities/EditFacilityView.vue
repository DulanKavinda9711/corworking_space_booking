<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBackToDetail" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Edit Facility</h1>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <form @submit.prevent="updateFacility" class="space-y-6">
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
                    <input type="text" v-model="form.name" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter facility name" />
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
                <button @click="goBackToDetail"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" :disabled="!isFormValid"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Update Facility</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiCog } from '@mdi/js'

const router = useRouter()
const route = useRoute()

// Form data - only name and status as requested
const form = ref({
  id: '',
  name: '',
  status: 'active' as 'active' | 'inactive'
})

// Form validation
const isFormValid = computed(() => {
  return form.value.name.trim() !== ''
})

// Sample facilities data to find the facility to edit
const sampleFacilities = [
  { id: 'FC-001', name: 'High-Speed WiFi', status: 'active' },
  { id: 'FC-002', name: 'Projector & Screen', status: 'active' },
  { id: 'FC-003', name: 'Whiteboard', status: 'active' },
  { id: 'FC-004', name: 'Video Conferencing Setup', status: 'active' },
  { id: 'FC-005', name: 'Coffee & Refreshments', status: 'active' },
  { id: 'FC-006', name: 'Printing Services', status: 'inactive' },
  { id: 'FC-007', name: 'Climate Control', status: 'active' },
  { id: 'FC-008', name: 'Parking Space', status: 'active' }
]

// Load facility data on component mount
onMounted(() => {
  const facilityId = route.params.id as string
  const facility = sampleFacilities.find(f => f.id === facilityId)
  
  if (facility) {
    form.value = {
      id: facility.id,
      name: facility.name,
      status: facility.status as 'active' | 'inactive'
    }
  } else {
    // Facility not found, redirect to facilities list
    alert('Facility not found')
    router.push('/facilities')
  }
})

// Methods
const goBackToDetail = () => {
  // Navigate back to facility detail page
  router.push(`/facilities/${form.value.id}`)
}

const updateFacility = () => {
  if (!isFormValid.value) {
    alert('Please fill in the facility name')
    return
  }

  // Here you would typically send the data to your API
  console.log('Updating facility:', form.value)
  
  // Show success message
  alert('Facility updated successfully!')
  
  // Navigate back to facility detail page instead of facilities list
  router.push(`/facilities/${form.value.id}`)
}
</script>
