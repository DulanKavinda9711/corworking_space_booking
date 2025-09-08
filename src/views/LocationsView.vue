<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiMapMarker" />
            </svg>
            <span class="text-sm font-medium text-green-700">
              Total Locations:
              <span class="font-bold text-green-800">{{ filteredLocations.length }}</span>
            </span>
          </div>
        <router-link to="/locations/add"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Location</span>
        </router-link>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-red-800">{{ errorMessage }}</span>
          <button @click="fetchLocations" class="ml-auto text-red-600 hover:text-red-800 font-medium">
            Retry
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-xl shadow-card p-8">
        <div class="flex items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-gray-600">Loading locations...</span>
        </div>
      </div>

      <!-- Locations Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="bg-white  shadow-card p-6 border-b">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Locations</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by location name or address..."
                v-model="searchQuery"
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative">
              <select 
                v-model="filters.status" 
                @focus="toggleDropdown('status')"
                @blur="closeDropdown('status')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black appearance-none cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.status ? 'transform rotate-180' : ''
                  ]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <div class="relative">
              <select 
                v-model="filters.company" 
                @focus="toggleDropdown('company')"
                @blur="closeDropdown('company')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black appearance-none cursor-pointer"
              >
                <option value="">All Companies</option>
                <option value="workhub">WorkHub Co.</option>
                <option value="flexspace">FlexSpace Inc.</option>
                <option value="creativespaces">Creative Spaces LLC</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.company ? 'transform rotate-180' : ''
                  ]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div class="flex items-end justify-end">
            <button
              @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600"
            >
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
                  Location Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="location in filteredLocations" :key="location.id" 
                  class="hover:bg-gray-50 cursor-pointer transition-colors"
                  @click="navigateToLocationDetail(location.id)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="mdiMapMarker" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ location.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ getLocationAddress(location) }}</div>
                  <!-- <div class="text-sm text-gray-500">{{ location.city || '' }}</div> -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(location.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ location.status }}
                  </span>
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-center" @click.stop>
                  <div class="flex items-center justify-center space-x-2">
                    <button @click.stop="editLocation(location.id)"
                      class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-1"
                      title="Edit Location">
                      <span>Edit</span>
                    </button>
                    <button @click.stop="confirmDeleteLocation(location)"
                      class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1"
                      title="Delete Location">
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredLocations.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No locations found</h3>
          <p class="mt-1 text-sm text-gray-500">No locations match the current search and filters.</p>
        </div>
      </div>
    </div>

    <!-- Add Location Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            Add New Location
          </h2>
        </div>
        
        <form @submit.prevent="saveLocation" class="p-6 space-y-6">
          <!-- Company Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Company *</label>
            <select v-model="form.companyId" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select a company</option>
              <option value="1">WorkHub Co.</option>
              <option value="2">FlexSpace Inc.</option>
              <option value="3">Creative Spaces LLC</option>
            </select>
          </div>

          <!-- Location Details -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Location Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Location Name *</label>
                <input
                  type="text"
                  v-model="form.name"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter location name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select v-model="form.status" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <textarea
                v-model="form.address"
                required
                rows="3"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter complete address"
              ></textarea>
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  v-model="form.city"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  v-model="form.country"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Map URL</label>
              <input
                type="url"
                v-model="form.mapUrl"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Person Name</label>
                <input
                  type="text"
                  v-model="form.contactPersonName"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter contact person name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Phone Number</label>
                <input
                  type="tel"
                  v-model="form.contactPhone"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter contact phone"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {{ showAddModal ? 'Add Location' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeDeleteModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Delete Location</h3>
          <div class="mt-2 px-7 py-3">
            <p class="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700">
              Are you sure you want to delete <strong>"{{ locationToDelete?.name }}"</strong>? 
              This action cannot be undone and will remove all associated data.
            </p>
          </div>
          <div class="items-center px-4 py-3 flex space-x-3">
            <button @click="closeDeleteModal"
              :disabled="isDeleting"
              class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 flex-1 disabled:opacity-50">
              Cancel
            </button>
            <button @click="confirmDelete"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 flex-1 disabled:opacity-50 flex items-center justify-center">
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Popup Modal -->
    <div v-if="showSuccessPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showSuccessPopup = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 transform transition-all" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Success!</h3>
        <p class="text-sm text-gray-600 text-center mb-6">{{ popupMessage }}</p>
        
        <div class="flex justify-center">
          <button
            @click="showSuccessPopup = false"
            class="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Error Popup Modal -->
    <div v-if="showErrorPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showErrorPopup = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 transform transition-all" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Error</h3>
        <p class="text-sm text-gray-600 text-center mb-6">{{ popupMessage }}</p>
        
        <div class="flex justify-center">
          <button
            @click="showErrorPopup = false"
            class="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { locationApi } from '@/services/api'
import { mdiMapMarker, mdiEye, mdiPencil, mdiDelete } from '@mdi/js'

const router = useRouter()

// State
const searchQuery = ref('')
const showAddModal = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Delete modal state
const showDeleteModal = ref(false)
const locationToDelete = ref<any>(null)
const isDeleting = ref(false)

// Success/Error popup states
const showSuccessPopup = ref(false)
const showErrorPopup = ref(false)
const popupMessage = ref('')

// Filters
const filters = ref({
  status: '',
  company: ''
})

// Dropdown states for rotating arrows
const dropdownStates = ref({
  status: false,
  company: false
})

// Form data
const form = ref({
  id: null as string | null,
  name: '',
  address: '',
  city: '',
  country: '',
  mapUrl: '',
  contactPersonName: '',
  contactPhone: '',
  companyId: '',
  status: 'active' as 'active' | 'inactive'
})

// Locations data from API
const locations = ref<any[]>([])

// Computed properties
const filteredLocations = computed(() => {
  let filtered = locations.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(location => {
      const name = (location.name || '').toLowerCase()
      const street = (location.street || '').toLowerCase()
      const town = (location.town || '').toLowerCase()
      const city = (location.city || '').toLowerCase()
      const district = (location.district || '').toLowerCase()
      
      return name.includes(query) ||
             street.includes(query) ||
             town.includes(query) ||
             city.includes(query) ||
             district.includes(query)
    })
  }

  // Apply status filter
  if (filters.value.status) {
    filtered = filtered.filter(location => location.status === filters.value.status)
  }

  // Apply company filter
  if (filters.value.company) {
    const companyMap: Record<string, string> = {
      'workhub': 'WorkHub Co.',
      'flexspace': 'FlexSpace Inc.',
      'creativespaces': 'Creative Spaces LLC'
    }
    filtered = filtered.filter(location => location.companyName === companyMap[filters.value.company])
  }

  return filtered
})

// Methods
const getLocationAddress = (location: any) => {
  const addressParts = [
    location.street,
    location.street2,
    location.town,
    location.district,
    location.postalCode
  ].filter(part => part && part.trim()) // Remove null, undefined, and empty strings
  
  return addressParts.join(', ') || 'Address not available'
}

const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    status: '',
    company: ''
  }
}

// Dropdown control functions
const toggleDropdown = (dropdown: string) => {
  dropdownStates.value[dropdown as keyof typeof dropdownStates.value] = true
}

const closeDropdown = (dropdown: string) => {
  setTimeout(() => {
    dropdownStates.value[dropdown as keyof typeof dropdownStates.value] = false
  }, 150)
}

const closeAllDropdowns = () => {
  Object.keys(dropdownStates.value).forEach(key => {
    dropdownStates.value[key as keyof typeof dropdownStates.value] = false
  })
}

const navigateToLocationDetail = (locationId: string) => {
  router.push(`/locations/${locationId}`)
}

const editLocation = (locationId: string) => {
  router.push(`/locations/${locationId}/edit`)
}

const confirmDeleteLocation = (location: any) => {
  locationToDelete.value = location
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  if (!isDeleting.value) {
    showDeleteModal.value = false
    locationToDelete.value = null
  }
}

const confirmDelete = async () => {
  if (!locationToDelete.value) return

  isDeleting.value = true

  try {
    const response = await locationApi.deleteLocation(locationToDelete.value.id)

    if (response.success) {
      // Remove location from local array
      const index = locations.value.findIndex(l => l.id === locationToDelete.value.id)
      if (index !== -1) {
        locations.value.splice(index, 1)
      }

      // Hide delete modal first
      showDeleteModal.value = false
      locationToDelete.value = null

      // Show success popup
      popupMessage.value = response.message || 'Location deleted successfully'
      showSuccessPopup.value = true
    } else {
      // Hide delete modal first
      showDeleteModal.value = false
      locationToDelete.value = null

      // Show error popup
      popupMessage.value = response.message || 'Failed to delete location'
      showErrorPopup.value = true
    }
  } catch (error) {
    console.error('Error deleting location:', error)
    
    // Hide delete modal first
    showDeleteModal.value = false
    locationToDelete.value = null

    // Show error popup
    popupMessage.value = 'Network error while deleting location'
    showErrorPopup.value = true
  } finally {
    isDeleting.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    address: '',
    city: '',
    country: '',
    mapUrl: '',
    contactPersonName: '',
    contactPhone: '',
    companyId: '',
    status: 'active'
  }
}

const saveLocation = () => {
  const companyNames: Record<string, string> = {
    '1': 'WorkHub Co.',
    '2': 'FlexSpace Inc.',
    '3': 'Creative Spaces LLC'
  }

  if (showAddModal.value) {
    // Add new location
    const newLocation = {
      ...form.value,
      id: `LC-${String(locations.value.length + 1).padStart(3, '0')}`,
      companyName: companyNames[form.value.companyId],
      totalSpaces: 0
    }
    locations.value.push(newLocation)
  } else {
    // Edit existing location
    if (form.value.id) {
      const index = locations.value.findIndex(l => l.id === form.value.id)
      if (index !== -1) {
        locations.value[index] = { 
          ...locations.value[index],
          ...form.value,
          id: form.value.id,
          companyName: companyNames[form.value.companyId]
        }
      }
    }
  }
  closeModal()
}

// Fetch locations from API
const fetchLocations = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await locationApi.getAllLocations()

    if (response.success && response.data) {
      locations.value = response.data
    } else {
      errorMessage.value = response.message || 'Failed to load locations'
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    errorMessage.value = 'An unexpected error occurred while loading locations'
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchLocations()
})
</script>
