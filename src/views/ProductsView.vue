<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiBookOpen" />
          </svg>
          <span class="text-sm font-medium text-green-700">
            Total Products:
            <span class="font-bold text-green-800">{{ filteredProducts.length }}</span>
          </span>
        </div>
        <router-link to="/products/add"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Product</span>
        </router-link>
      </div>

      <!-- Search and Filters -->
      

      <!-- Products Table -->
       
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="bg-white border-b shadow-card p-6">

        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div class="relative">
              <select 
                v-model="filters.location" 
                @focus="toggleDropdown('location')"
                @blur="closeDropdown('location')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black appearance-none cursor-pointer"
              >
                <option value="">All Locations</option>
                <option v-for="loc in availableLocations" :key="loc" :value="loc">{{ loc }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.location ? 'transform rotate-180' : ''
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <div class="relative">
              <select 
                v-model="filters.productType" 
                @focus="toggleDropdown('productType')"
                @blur="closeDropdown('productType')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Meeting Room">Meeting Room</option>
                <option value="Hot Desk">Hot Desk</option>
                <option value="Dedicated Desk">Dedicated Desk</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.productType ? 'transform rotate-180' : ''
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
          <div class="md:col-span-2 flex items-end justify-end">
            <button @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
        <div class="overflow-x-auto">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="flex items-center space-x-3">
              <svg class="animate-spin h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">Loading products...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-red-900">Error Loading Products</h3>
            <p class="mt-2 text-sm text-red-700">{{ error }}</p>
            <button @click="loadProducts" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Try Again
            </button>
          </div>

          <!-- Products Table -->
          <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              <tr v-for="product in filteredProducts" :key="product.id" 
                  class="hover:bg-gray-50 cursor-pointer"
                  @click="viewProductDetails(product.id)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="getProductIcon(product.type)" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ product.locationName }}</div>
                  <div class="text-sm text-gray-500">{{ product.locationAddress }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(product.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ product.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                  <div class="flex items-center justify-end space-x-2">
                    <button @click.stop="editProduct(product.id)"
                      class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center space-x-1"
                      title="Edit Product">
                      <span>Edit</span>
                    </button>
                    <button @click.stop="toggleProductStatus(product)"
                      :class="product.status === 'active' ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'"
                      class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors border flex items-center justify-center space-x-1"
                      :title="product.status === 'active' ? 'Deactivate Product' : 'Activate Product'">
                      <span>{{ product.status === 'active' ? 'Deactivate' : 'Activate' }}</span>
                    </button>
                    <button @click.stop="confirmDeleteProduct(product)"
                      class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 flex items-center justify-center space-x-1"
                      title="Delete Product">
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && !error && filteredProducts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V5a2 2 0 00-2-2H9a2 2 0 00-2-2v2h10z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ products.length === 0 ? 'Get started by creating a new product.' : 'Try adjusting your search or filters.' }}
          </p>
          <div class="mt-6">
            <router-link to="/products/add" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeDeleteModal">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiDelete" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Delete Product</h3>
        
        <div v-if="productToDelete" class="bg-gray-100 rounded-lg p-4 mb-4">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="getProductIcon(productToDelete.type)" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ productToDelete.name }}</p>
              <p class="text-sm text-gray-500">{{ productToDelete.type }} • {{ productToDelete.companyName }}</p>
            </div>
          </div>
        </div>
        
        
        <div class="my-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-xs text-red-700">
          <strong>Warning:</strong> This will permanently remove the product from the system and affect any products that use it.
              </p>
            </div>
        
        <div class="flex space-x-3">
          <button
            @click="closeDeleteModal"
            :disabled="isDeleting"
            class="flex-1 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 flex-1"
          >
            Cancel
          </button>
          <button
            @click="deleteProduct"
            :disabled="isDeleting"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center"
          >
            <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isDeleting ? 'Deleting...' : 'Delete Product' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiPackageVariant, mdiEye, mdiPencil, mdiDelete, mdiDeskLamp, mdiAccountGroup, mdiChairRolling, mdiBookOpen } from '@mdi/js'
import { productApi } from '@/services/api'

// Types
interface Product {
  id: string
  name: string
  type: 'Meeting Room' | 'Hot Desk' | 'Dedicated Desk'
  locationName: string
  locationAddress: string
  companyName: string
  companyId: string
  locationId: string
  status: 'active' | 'inactive'
  maxSeatingCapacity: number
  pricePerHour?: number
  pricePerDay?: number
  pricePerMonth?: number
  pricePerYear?: number
  images: string[]
  description: string
  openDays: string[]
  openHours: { start: string; end: string }
  defaultFacilities: string[]
  additionalFacilities: Array<{
    id: string
    name: string
    pricePerHour?: number
    pricePerDay?: number
    pricePerMonth?: number
    pricePerYear?: number
  }>
}

// State
const searchQuery = ref('')
const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)
const isDeleting = ref(false)
const isLoading = ref(false)
const error = ref('')

// Dropdown states for arrow rotation
const dropdownStates = ref({
  status: false,
  location: false,
  productType: false
})

// Filters
const filters = ref({
  status: '',
  productType: '',
  location: ''
})

// Products data - now properly typed
const products = ref<Product[]>([])

// Available locations (derived from product data)
const availableLocations = computed(() => {
  const set = new Set<string>()
  products.value.forEach(p => set.add(p.locationName))
  return Array.from(set)
})

// Load products from API
const loadProducts = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await productApi.getAllProducts()
    if (response.success && response.data) {
      // Transform API data to match our Product interface
      products.value = response.data.map((apiProduct: any) => ({
        ...apiProduct,
        locationName: apiProduct.location_name || 'Unknown Location',
        locationAddress: apiProduct.address || apiProduct.location_address || 'Unknown Address',
        companyName: apiProduct.company_name || 'Unknown Company',
        companyId: apiProduct.company_id || 'unknown',
        locationId: apiProduct.location_id || 'unknown',
        maxSeatingCapacity: apiProduct.capacity || 1,
        openDays: [],
        openHours: { start: '09:00', end: '17:00' },
        defaultFacilities: apiProduct.facilities || [],
        additionalFacilities: []
      })) as Product[]
    } else {
      error.value = response.message || 'Failed to load products'
    }
  } catch (err) {
    console.error('Error loading products:', err)
    error.value = 'An error occurred while loading products'
  } finally {
    isLoading.value = false
  }
}

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.type.toLowerCase().includes(query) ||
      product.companyName.toLowerCase().includes(query) ||
      product.locationName.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(product => product.status === filters.value.status)
  }

  // Product type filter
  if (filters.value.productType) {
    filtered = filtered.filter(product => product.type === filters.value.productType)
  }

  // Location filter
  if (filters.value.location) {
    filtered = filtered.filter(product => product.locationName === filters.value.location)
  }

  return filtered
})

// Methods
const getProductIcon = (type: string) => {
  switch (type) {
    case 'Meeting Room':
      return mdiAccountGroup
    case 'Hot Desk':
      return mdiDeskLamp
    case 'Dedicated Desk':
      return mdiChairRolling
    default:
      return mdiPackageVariant
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Dropdown toggle functions
const toggleDropdown = (dropdownName: string) => {
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = !dropdownStates.value[dropdownName as keyof typeof dropdownStates.value]
}

const closeDropdown = (dropdownName: string) => {
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = false
}

const closeAllDropdowns = () => {
  Object.keys(dropdownStates.value).forEach(key => {
    dropdownStates.value[key as keyof typeof dropdownStates.value] = false
  })
}

// Row click handler to view product details
const viewProductDetails = (productId: string) => {
  // Navigate to product details page
  window.location.href = `/products/${productId}`
}

// Edit product handler
const editProduct = (productId: string) => {
  // Navigate to product edit page
  window.location.href = `/products/${productId}/edit`
}

const confirmDeleteProduct = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  if (!isDeleting.value) {
    showDeleteModal.value = false
    productToDelete.value = null
  }
}

const deleteProduct = async () => {
  if (!productToDelete.value) return
  
  isDeleting.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = products.value.findIndex(p => p.id === productToDelete.value!.id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
    
    // Add to localStorage for audit trail
    const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]')
    deletedProducts.push({
      ...productToDelete.value,
      deletedAt: new Date().toISOString(),
      deletedBy: 'Admin User'
    })
    localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts))
    
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting product:', error)
  } finally {
    isDeleting.value = false
  }
}

const toggleProductStatus = async (product: Product) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Toggle the status
    product.status = product.status === 'active' ? 'inactive' : 'active'
    
    // You could also make an API call here to update the status on the server
    // await productApi.updateProductStatus(product.id, product.status)
    
    console.log(`Product ${product.name} status changed to ${product.status}`)
  } catch (error) {
    console.error('Error toggling product status:', error)
    // Revert the status change if API call fails
    product.status = product.status === 'active' ? 'inactive' : 'active'
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    status: '',
  productType: '',
  location: ''
  }
}

// Load products on component mount
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>