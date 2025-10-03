<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2 flex items-center space-x-2">
            <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiOfficeBuilding" />
            </svg>
            <span class="text-sm font-medium text-primary-700">
              Total Companies:
              <span class="font-bold text-primary-800">{{ filteredCompanies.length }}</span>
            </span>
          </div>
        </div>
        <PermissionGuard permission="create_companies">
          <router-link to="/companies/add"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Company</span>
          </router-link>
        </PermissionGuard>
      </div>

      <!-- Companies Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <!-- <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Companies ({{ filteredCompanies.length }})</h2>
        </div> -->
        <div class="bg-white shadow-card p-6  border-b">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select v-model="filters.status"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select v-model="filters.location"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                <option value="">All Locations</option>
                <option value="new-york">New York</option>
                <option value="california">California</option>
                <option value="texas">Texas</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Listed Spaces</label>
              <select v-model="filters.spaces"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                <option value="">All</option>
                <option value="1-5">1-5 spaces</option>
                <option value="6-10">6-10 spaces</option>
                <option value="11+">11+ spaces</option>
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




        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Listed Spaces
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
              <tr v-for="company in paginatedCompanies" :key="company.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-lg object-cover" :src="company.logo" :alt="company.name">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ company.name }}</div>
                      <div class="text-sm text-gray-500">{{ company.registrationNumber }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ company.contactPerson }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ company.email }}</div>
                  <div class="text-sm text-gray-500">{{ company.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ company.totalSpaces }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(company.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ company.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <!-- View Details - Always visible (just viewing) -->
                    <router-link :to="`/companies/${company.id}`"
                      class="text-primary-600 hover:text-primary-900 flex items-center space-x-1" title="View Details">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiEye" />
                      </svg>
                    </router-link>
                    
                    <!-- Edit Company - Hidden if no edit permission -->
                    <PermissionGuard permission="edit_companies">
                      <router-link :to="`/companies/${company.id}/edit`"
                        class="text-blue-600 hover:text-blue-900 flex items-center space-x-1" title="Edit Company">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="mdiPencil" />
                        </svg>
                      </router-link>
                    </PermissionGuard>
                    
                    <!-- Toggle Status - Hidden if no edit permission -->
                    <PermissionGuard permission="edit_companies">
                      <button @click="toggleCompanyStatus(company)"
                        :class="company.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                        class="flex items-center space-x-1"
                        :title="company.status === 'active' ? 'Deactivate Company' : 'Activate Company'">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="company.status === 'active' ? mdiCloseCircle : mdiCheckCircle" />
                        </svg>
                        <!-- <span class="hidden sm:inline">{{ company.status === 'active' ? 'Deactivate' : 'Activate' }}</span> -->
                      </button>
                    </PermissionGuard>
                    
                    <!-- Delete Company - Hidden if no delete permission -->
                    <PermissionGuard permission="delete_companies">
                      <button @click="deleteCompany(company)"
                        class="text-red-600 hover:text-red-900 flex items-center space-x-1" title="Delete Company">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="mdiDelete" />
                        </svg>
                      </button>
                    </PermissionGuard>
                    
                    <!-- Show message if no actions available (excluding view) -->
                    <div v-if="!hasAnyCompanyPermissions" class="text-sm text-gray-500 italic">
                      No actions available
                    </div>
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
                  Showing {{ startItem }} to {{ endItem }} of {{ filteredCompanies.length }} results
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
      </div>
    </div>

    <!-- Status Toggle Confirmation Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full" :class="companyToToggle?.status === 'active' ? 'bg-orange-100' : 'bg-green-100'">
            <svg class="w-6 h-6" :class="companyToToggle?.status === 'active' ? 'text-orange-600' : 'text-green-600'" fill="currentColor" viewBox="0 0 24 24">
              <path :d="companyToToggle?.status === 'active' ? mdiCloseCircle : mdiCheckCircle" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">
            {{ companyToToggle?.status === 'active' ? 'Deactivate' : 'Activate' }} Company
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to {{ companyToToggle?.status === 'active' ? 'deactivate' : 'activate' }} this company?
            </p>
            <div v-if="companyToToggle" class="mt-4 p-3 bg-gray-50 rounded-lg">
              <div class="text-sm space-y-1">
                <div class="flex items-center space-x-2">
                  <img class="w-8 h-8 rounded object-cover" :src="companyToToggle.logo" :alt="companyToToggle.name">
                  <div>
                    <div class="font-medium text-gray-900">{{ companyToToggle.name }}</div>
                    <div class="text-gray-500">{{ companyToToggle.registrationNumber }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeStatusModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmToggleStatus"
              :disabled="isProcessing"
              class="px-4 py-2 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              :class="companyToToggle?.status === 'active' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'"
            >
              <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isProcessing ? 'Processing...' : (companyToToggle?.status === 'active' ? 'Deactivate' : 'Activate') }}</span>
            </button>
          </div>
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
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Delete Company</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to delete this company permanently? This action cannot be undone.
            </p>
            <div v-if="companyToDelete" class="mt-4 p-3 bg-gray-50 rounded-lg">
              <div class="text-sm space-y-1">
                <div class="flex items-center space-x-2">
                  <img class="w-8 h-8 rounded object-cover" :src="companyToDelete.logo" :alt="companyToDelete.name">
                  <div>
                    <div class="font-medium text-gray-900">{{ companyToDelete.name }}</div>
                    <div class="text-gray-500">{{ companyToDelete.registrationNumber }}</div>
                    <div class="text-gray-500">{{ companyToDelete.totalSpaces }} spaces listed</div>
                  </div>
                </div>
              </div>
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
              @click="confirmDeleteCompany"
              :disabled="isProcessing"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isProcessing ? 'Deleting...' : 'Delete' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PermissionGuard from '@/components/ui/PermissionGuard.vue'
import { useCompanies } from '@/composables/useCompanies'
import { usePermissions } from '@/composables/usePermissions'
import { mdiEye, mdiPencil, mdiCheckCircle, mdiCloseCircle, mdiDelete, mdiOfficeBuilding } from '@mdi/js'

// Use shared companies data
const { companies, toggleCompanyStatus: toggleStatus, deleteCompany: removeCompany } = useCompanies()
const permissionsStore = usePermissions()

// Check if user has any company permissions
const hasAnyCompanyPermissions = computed(() => {
  return permissionsStore.hasPermission('create_companies') || 
         permissionsStore.hasPermission('edit_companies') ||
         permissionsStore.hasPermission('delete_companies')
})

// Filters
const filters = ref({
  status: '',
  location: '',
  spaces: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Modal states
const showStatusModal = ref(false)
const showDeleteModal = ref(false)
const companyToToggle = ref<any>(null)
const companyToDelete = ref<any>(null)
const isProcessing = ref(false)

// Computed
const filteredCompanies = computed(() => {
  return companies.value.filter(company => {
    if (filters.value.status && company.status !== filters.value.status) return false
    if (filters.value.spaces) {
      const [min, max] = filters.value.spaces.split('-').map(n => parseInt(n) || Infinity)
      if (filters.value.spaces === '11+' && company.totalSpaces < 11) return false
      if (filters.value.spaces !== '11+' && (company.totalSpaces < min || company.totalSpaces > max)) return false
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredCompanies.value.length / itemsPerPage))

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCompanies.value.slice(start, end)
})

const startItem = computed(() => {
  if (filteredCompanies.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return Math.min(end, filteredCompanies.value.length)
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
  filters.value = {
    status: '',
    location: '',
    spaces: ''
  }
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

const toggleCompanyStatus = (company: any) => {
  companyToToggle.value = company
  showStatusModal.value = true
}

const confirmToggleStatus = async () => {
  if (!companyToToggle.value) return
  
  isProcessing.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    toggleStatus(companyToToggle.value.id)
    closeStatusModal()
  } catch (error) {
    console.error('Error toggling company status:', error)
  } finally {
    isProcessing.value = false
  }
}

const closeStatusModal = () => {
  showStatusModal.value = false
  companyToToggle.value = null
  isProcessing.value = false
}

const deleteCompany = (company: any) => {
  companyToDelete.value = company
  showDeleteModal.value = true
}

const confirmDeleteCompany = async () => {
  if (!companyToDelete.value) return
  
  isProcessing.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    removeCompany(companyToDelete.value.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting company:', error)
  } finally {
    isProcessing.value = false
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  companyToDelete.value = null
  isProcessing.value = false
}
</script>
