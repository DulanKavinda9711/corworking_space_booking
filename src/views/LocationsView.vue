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
            <select v-model="filters.status" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <select v-model="filters.company" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black">
              <option value="">All Companies</option>
              <option value="workhub">WorkHub Co.</option>
              <option value="flexspace">FlexSpace Inc.</option>
              <option value="creativespaces">Creative Spaces LLC</option>
            </select>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="location in filteredLocations" :key="location.id" class="hover:bg-gray-50">
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
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <router-link :to="`/locations/${location.id}`" class="text-primary-600 hover:text-primary-900 flex items-center space-x-1" title="View Details">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiEye" />
                      </svg>
                    </router-link>
                    <router-link :to="`/locations/${location.id}/edit`" class="text-blue-600 hover:text-blue-900 flex items-center space-x-1" title="Edit Location">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiPencil" />
                      </svg>
                    </router-link>
                    <button @click="deleteLocation(location)" class="text-red-600 hover:text-red-900 flex items-center space-x-1" title="Delete Location">
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
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { locationApi } from '@/services/api'
import { mdiMapMarker, mdiEye, mdiPencil, mdiDelete } from '@mdi/js'

// State
const searchQuery = ref('')
const showAddModal = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Filters
const filters = ref({
  status: '',
  company: ''
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

const deleteLocation = (location: any) => {
  if (confirm(`Are you sure you want to delete "${location.name}"?`)) {
    const index = locations.value.findIndex(l => l.id === location.id)
    if (index !== -1) {
      locations.value.splice(index, 1)
    }
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
