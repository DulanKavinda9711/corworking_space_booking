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
            <h1 class="text-xl font-bold text-gray-900">Facility Details</h1>
          </div>
        </div>
        
      </div>

      <!-- Facility Information -->
      <div class="max-w-6xl mx-auto">
        <div v-if="facility" class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8 space-y-8">
            <!-- Facility Details Section -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCog" />
                </svg>
                Facility Information
              </h2>
              
              <!-- Information Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">Facility Name</label>
                    <div class="text-lg font-semibold text-gray-900">{{ facility.name }}</div>
                  </div>
                </div>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span :class="getStatusClass(facility.status)" class="inline-flex px-3 py-1 text-sm font-medium rounded-full">
                      {{ facility.status }}
                    </span>
                  </div>
                </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1">Created Date</label>
                    <div class="text-lg text-gray-900">{{ formatDate(facility.createdAt) }}</div>
                  </div>
              </div>
            </div>
            

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <router-link to="/facilities"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Back to Facilities
              </router-link>
              <router-link :to="`/facilities/${facility.id}/edit`"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiPencil" />
                </svg>
                <span>Edit Facility</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Facility Not Found -->
        <div v-else class="bg-white rounded-xl shadow-card overflow-hidden p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Facility not found</h3>
          <p class="mt-1 text-sm text-gray-500">The facility you're looking for doesn't exist or has been removed.</p>
          <div class="mt-6">
            <router-link to="/facilities"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              Back to Facilities
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiCog, mdiPencil } from '@mdi/js'

const route = useRoute()
const router = useRouter()

// Facility data
const facility = ref<any>(null)

// Sample facilities data to find the facility to view
const sampleFacilities = [
  { 
    id: 'FC-001', 
    name: 'High-Speed WiFi', 
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  { 
    id: 'FC-002', 
    name: 'Projector & Screen', 
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  { 
    id: 'FC-003', 
    name: 'Whiteboard', 
    status: 'active',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  { 
    id: 'FC-004', 
    name: 'Video Conferencing Setup', 
    status: 'active',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  },
  { 
    id: 'FC-005', 
    name: 'Coffee & Refreshments', 
    status: 'active',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15'
  },
  { 
    id: 'FC-006', 
    name: 'Printing Services', 
    status: 'inactive',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05'
  },
  { 
    id: 'FC-007', 
    name: 'Climate Control', 
    status: 'active',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  },
  { 
    id: 'FC-008', 
    name: 'Parking Space', 
    status: 'active',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  }
]

// Load facility data on component mount
onMounted(() => {
  const facilityId = route.params.id as string
  const foundFacility = sampleFacilities.find(f => f.id === facilityId)
  
  if (foundFacility) {
    facility.value = foundFacility
  }
})

// Methods
const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
