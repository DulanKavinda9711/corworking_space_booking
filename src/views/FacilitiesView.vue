<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2 flex items-center space-x-2">
          <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiSeat" />
          </svg>
          <span class="text-sm font-medium text-primary-700">
            Total Facilities:
            <span class="font-bold text-primary-800">{{ filteredFacilities.length }}</span>
          </span>
        </div>
        <router-link to="/facilities/add"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Facility</span>
        </router-link>
      </div>

      <!-- Facilities Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <!-- Search and Filters -->
        <div class="bg-white shadow-card p-5 border-b">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Search Facilities</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search facilities by name..."
                  v-model="searchQuery"
                  class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select v-model="statusFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="flex items-end justify-end">
              <button @click="resetFilters"
                class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="facility in paginatedFacilities" :key="facility.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="mdiSeat" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ facility.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(facility.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ facility.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <button @click="viewFacility(facility)" class="text-primary-600 hover:text-primary-900 flex items-center space-x-1" title="View Details">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiEye" />
                      </svg>
                    </button>
                    <router-link :to="`/facilities/${facility.id}/edit`" class="text-blue-600 hover:text-blue-900 flex items-center space-x-1" title="Edit Facility">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiPencil" />
                      </svg>
                    </router-link>
                    <button @click="confirmDeleteFacility(facility)" class="text-red-600 hover:text-red-900 flex items-center space-x-1" title="Delete Facility">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiDelete" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing {{ startItem }} to {{ endItem }} of {{ filteredFacilities.length }} results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button @click="previousPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                    page === currentPage
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]">
                    {{ page }}
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredFacilities.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
          <p class="mt-1 text-sm text-gray-500">No facilities match the current search and filters.</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeDeleteModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Delete Facility</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to delete this facility permanently? This action cannot be undone.
            </p>
            <div v-if="facilityToDelete" class="mt-4 p-3 bg-gray-50 rounded-lg text-gray-900">
              <div class="text-sm space-y-1">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiSeat" />
                    </svg>
                  </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ facilityToDelete.name }}</div>
                      <div class="text-gray-500">Status: {{ facilityToDelete.status }}</div>
                    </div>
                  </div>
              </div>
            </div>
            <div class="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-xs text-red-700">
                <strong>Warning:</strong> This will permanently remove the facility from the system and affect any products that use it.
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteFacility"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isDeleting ? 'Deleting...' : 'Delete Facility' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  mdiEye,
  mdiPencil,
  mdiDelete,
  mdiSeat
} from '@mdi/js'

const router = useRouter()

// State
const searchQuery = ref('')
const statusFilter = ref('')

// Modal state
const showDeleteModal = ref(false)
const facilityToDelete = ref<any>(null)
const isDeleting = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Sample facilities data - simplified to show only name and status
const facilities = ref([
  {
    id: 'FC-001',
    name: 'High-Speed WiFi',
    status: 'active'
  },
  {
    id: 'FC-002',
    name: 'Projector & Screen',
    status: 'active'
  },
  {
    id: 'FC-003',
    name: 'Whiteboard',
    status: 'active'
  },
  {
    id: 'FC-004',
    name: 'Video Conferencing Setup',
    status: 'active'
  },
  {
    id: 'FC-005',
    name: 'Coffee & Refreshments',
    status: 'active'
  },
  {
    id: 'FC-006',
    name: 'Printing Services',
    status: 'inactive'
  },
  {
    id: 'FC-007',
    name: 'Climate Control',
    status: 'active'
  },
  {
    id: 'FC-008',
    name: 'Parking Space',
    status: 'active'
  }
])

// Computed properties
const filteredFacilities = computed(() => {
  let filtered = facilities.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(facility =>
      facility.name.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(facility => facility.status === statusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredFacilities.value.length / itemsPerPage))

const paginatedFacilities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredFacilities.value.slice(start, end)
})

const startItem = computed(() => {
  if (filteredFacilities.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return Math.min(end, filteredFacilities.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

// Pagination methods
const goToPage = (page: number) => {
  currentPage.value = page
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const viewFacility = (facility: any) => {
  // Navigate to facility detail view
  router.push(`/facilities/${facility.id}`)
}

// Modal functions
const confirmDeleteFacility = (facility: any) => {
  facilityToDelete.value = facility
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  facilityToDelete.value = null
  isDeleting.value = false
}

const deleteFacility = async () => {
  if (!facilityToDelete.value) return
  
  isDeleting.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove facility from the array
    const index = facilities.value.findIndex(f => f.id === facilityToDelete.value.id)
    if (index !== -1) {
      facilities.value.splice(index, 1)
    }
    
    // Save deletion for audit purposes
    const deletedFacilities = JSON.parse(localStorage.getItem('deletedFacilities') || '[]')
    deletedFacilities.push({
      ...facilityToDelete.value,
      deletedAt: new Date().toISOString(),
      deletedBy: 'Admin'
    })
    localStorage.setItem('deletedFacilities', JSON.stringify(deletedFacilities))
    
    closeDeleteModal()
    
    // Show success message
    console.log('Facility deleted successfully:', facilityToDelete.value.name)
    
  } catch (error) {
    console.error('Error deleting facility:', error)
    // Handle error (show toast notification, etc.)
  } finally {
    isDeleting.value = false
  }
}
</script>
