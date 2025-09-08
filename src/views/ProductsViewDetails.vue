<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/products" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Product Details</h1>
            <p class="text-sm text-gray-500" v-if="product">{{ product.type }} • {{ product.locationName }}</p>
          </div>
        </div>
        <div class="flex space-x-3">
          <router-link :to="`/products/${productId}/edit`" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiPencil" />
            </svg>
            <span>Edit Product</span>
          </router-link>
          <button @click="confirmDeleteProduct" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiDelete" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Product Not Found -->
      <div v-else-if="!product || error" class="bg-white rounded-xl shadow-card p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ error || 'Product Not Found' }}</h3>
        <p class="text-gray-500 mb-6">{{ error ? 'Please try again later.' : 'The product you\'re looking for doesn\'t exist or has been removed.' }}</p>
        <router-link to="/products" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </router-link>
      </div>

      <!-- Product Details -->
      <div v-else class="space-y-6">
        <!-- Overview Card -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <div class="flex items-start justify-between mb-6">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                  <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="getProductIcon(product.type)" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">{{ product.name }}</h2>
                  <div class="flex items-center space-x-4 mt-2">
                    <span :class="getStatusClass(product.status)" class="px-3 py-1 text-sm font-medium rounded-full">
                      {{ product.status }}
                    </span>
                    <span class="text-sm text-gray-500">
                      Product ID: {{ product.id }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Key Information -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm font-medium text-gray-500 mb-1">Product Type</div>
                <div class="text-lg font-semibold text-gray-900">{{ product.type }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm font-medium text-gray-500 mb-1">Max Capacity</div>
                <div class="text-lg font-semibold text-gray-900">{{ product.maxSeatingCapacity }} {{ product.maxSeatingCapacity === 1 ? 'person' : 'people' }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm font-medium text-gray-500 mb-1">Location</div>
                <div class="text-lg font-semibold text-gray-900">{{ product.locationName }}</div>
                <div class="text-sm text-gray-500">{{ product.locationAddress }}</div>
                <a v-if="product.locationUrl" :href="product.locationUrl" target="_blank" 
                   class="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View on Map
                </a>
              </div>
              
            </div>

            <!-- Description -->
            <div v-if="product.description">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
            </div>
          </div>
        </div>

        <!-- Images Section -->
        <div v-if="product.images && product.images.length > 0" class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Product Images</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div v-for="(image, index) in product.images" :key="index" class="relative group">
                <div class="aspect-w-16 aspect-h-10 bg-gray-200 rounded-lg overflow-hidden">
                  <img :src="image" :alt="`Product image ${index + 1}`" 
                       class="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                       @click="openImageModal(image, index)"
                       @error="handleImageError($event)">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Section -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCurrencyUsd" />
              </svg>
              Pricing
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-if="product.pricePerHour && product.pricePerHour > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="text-sm font-medium text-green-600 mb-1">Per Hour</div>
                <div class="text-2xl font-bold text-green-800">${{ product.pricePerHour }}</div>
              </div>
              <div v-if="product.pricePerDay && product.pricePerDay > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="text-sm font-medium text-blue-600 mb-1">Per Day</div>
                <div class="text-2xl font-bold text-blue-800">${{ product.pricePerDay }}</div>
              </div>
              <div v-if="product.pricePerMonth && product.pricePerMonth > 0" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div class="text-sm font-medium text-purple-600 mb-1">Per Month</div>
                <div class="text-2xl font-bold text-purple-800">${{ product.pricePerMonth }}</div>
              </div>
              <div v-if="product.pricePerYear && product.pricePerYear > 0" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div class="text-sm font-medium text-orange-600 mb-1">Per Year</div>
                <div class="text-2xl font-bold text-orange-800">${{ product.pricePerYear }}</div>
              </div>
              <!-- Show no pricing message if no pricing is available -->
              <div v-if="!product.pricePerHour && !product.pricePerDay && !product.pricePerMonth && !product.pricePerYear" 
                   class="col-span-full text-center py-8 text-gray-500">
                <svg class="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <p class="text-sm">No pricing information available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Availability Section -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiClockOutline" />
              </svg>
              Availability
            </h3>
            <div class="space-y-6">
              <!-- Open Days -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-3">Open Days</h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="day in allDays" :key="day" 
                        :class="(product.openDays && product.openDays.includes(day)) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'"
                        class="px-3 py-1 text-sm font-medium rounded-full">
                    {{ day.substring(0, 3) }}
                  </span>
                </div>
                <div v-if="!product.openDays || product.openDays.length === 0" class="text-sm text-gray-500 mt-2">
                  No schedule information available
                </div>
              </div>

              <!-- Open Hours -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-3">Operating Hours</h4>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div v-if="product.openHours && product.openHours.start && product.openHours.end" class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiClockOutline" />
                    </svg>
                    <span class="text-gray-900 font-medium">
                      {{ formatTime(product.openHours.start) }} - {{ formatTime(product.openHours.end) }}
                    </span>
                  </div>
                  <div v-else class="flex items-center space-x-2 text-gray-500">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiClockOutline" />
                    </svg>
                    <span class="text-sm">Operating hours not specified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Facilities Section -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCog" />
              </svg>
              Facilities & Amenities
            </h3>
            
            <!-- Default Facilities -->
            <div v-if="product.defaultFacilities && product.defaultFacilities.length > 0" class="mb-8">
              <h4 class="text-sm font-medium text-gray-700 mb-4">Included Facilities (Free)</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="facility in product.defaultFacilities" :key="facility" 
                     class="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCheckCircle" />
                  </svg>
                  <span class="text-green-800 font-medium">{{ facility }}</span>
                </div>
              </div>
            </div>

            <!-- Additional Facilities -->
            <div v-if="product.additionalFacilities && product.additionalFacilities.length > 0">
              <h4 class="text-sm font-medium text-gray-700 mb-4">Premium Add-ons (Paid)</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="facility in product.additionalFacilities" :key="facility.id" 
                     class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3 mb-2">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCurrencyUsd" />
                    </svg>
                    <span class="text-blue-800 font-medium">{{ facility.name || facility }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div v-if="facility.pricePerHour && facility.pricePerHour > 0" class="text-blue-900">
                      <span class="font-medium">${{ facility.pricePerHour }}</span> /hour
                    </div>
                    <div v-if="facility.pricePerDay && facility.pricePerDay > 0" class="text-blue-900">
                      <span class="font-medium">${{ facility.pricePerDay }}</span> /day
                    </div>
                    <div v-if="facility.pricePerMonth && facility.pricePerMonth > 0" class="text-blue-900">
                      <span class="font-medium">${{ facility.pricePerMonth }}</span> /month
                    </div>
                    <div v-if="facility.pricePerYear && facility.pricePerYear > 0" class="text-blue-900">
                      <span class="font-medium">${{ facility.pricePerYear }}</span> /year
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Facilities -->
            <div v-if="(!product.defaultFacilities || product.defaultFacilities.length === 0) && 
                      (!product.additionalFacilities || product.additionalFacilities.length === 0)"
                 class="text-center py-8 text-gray-500">
              <svg class="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p class="text-sm">No facilities information available</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" @click="closeImageModal">
      <div class="relative max-w-4xl max-h-full" @click.stop>
        <button @click="closeImageModal" class="absolute -top-10 -right-10 text-white hover:text-gray-300 z-10">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="selectedImage" :alt="`Product image ${selectedImageIndex + 1}`" 
             class="max-w-full max-h-full object-contain rounded-lg">
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
        <p class="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete "{{ product?.name }}"? This action cannot be undone.
        </p>
        
        <div class="flex space-x-3">
          <button @click="closeDeleteModal" :disabled="isDeleting"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50">
            Cancel
          </button>
          <button @click="deleteProduct" :disabled="isDeleting"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center">
            <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { productApi } from '@/services/api'
import { 
  mdiPencil, 
  mdiDelete, 
  mdiAccountGroup, 
  mdiDeskLamp, 
  mdiChairRolling, 
  mdiPackageVariant,
  mdiCurrencyUsd,
  mdiClockOutline,
  mdiCog,
  mdiCheckCircle
} from '@mdi/js'

const route = useRoute()
const router = useRouter()

// State
const product = ref<any>(null)
const isLoading = ref(true)
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const selectedImage = ref<string | null>(null)
const selectedImageIndex = ref(0)
const error = ref('')

// Data
const productId = route.params.id as string
const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const loadProduct = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    console.log('Loading product with ID:', productId)
    
    // Use the new getProductById API method
    const response = await productApi.getProductById(productId)
    
    console.log('API Response:', response)
    
    if (response.success && response.data) {
      console.log('Product loaded successfully:', response.data)
      console.log('Product images:', response.data.images)
      console.log('Product pricing:', {
        hourly: response.data.pricePerHour,
        daily: response.data.pricePerDay,
        monthly: response.data.pricePerMonth,
        yearly: response.data.pricePerYear
      })
      console.log('Product facilities:', {
        default: response.data.defaultFacilities,
        additional: response.data.additionalFacilities
      })
      console.log('Product schedule:', response.data.openDays)
      
      product.value = response.data
    } else {
      error.value = response.message || 'Product not found'
      console.error('Failed to load product:', response.message)
    }
  } catch (err) {
    console.error('Error loading product:', err)
    error.value = 'Failed to load product details'
  } finally {
    isLoading.value = false
  }
}

const openImageModal = (image: string, index: number) => {
  selectedImage.value = image
  selectedImageIndex.value = index
}

const closeImageModal = () => {
  selectedImage.value = null
  selectedImageIndex.value = 0
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDMuMDEySDNDMS44OTUgMy4wMTIgMSAzLjkwNyAxIDUuMDEyVjE5LjAxMkMxIDIwLjExNyAxLjg5NSAyMS4wMTIgMyAyMS4wMTJIMjFDMjIuMTA1IDIxLjAxMiAyMyAyMC4xMTcgMjMgMTkuMDEyVjUuMDEyQzIzIDMuOTA3IDIyLjEwNSAzLjAxMiAyMSAzLjAxMlpNMjEgMTkuMDEySDNWNS4wMTJIMjFWMTkuMDEyWiIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNNy41IDEwLjUxMkM4LjMyOCAxMC41MTIgOSA5Ljg0IDkgOS4wMTJDOSA4LjE4NCA4LjMyOCA3LjUxMiA3LjUgNy41MTJDNS42NzIgNy41MTIgNiA4LjE4NCA2IDkuMDEyQzYgOS44NCA2LjY3MiAxMC41MTIgNy41IDEwLjUxMloiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTMgMTcuMDEySDIxTDE4IDE0LjAxMkwxNC41IDE2LjUxMkwxMSAxMy4wMTJMMyAxNy4wMTJaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo='
  img.className = 'w-full h-32 object-contain rounded-lg opacity-50'
  img.title = 'Image not available'
}

const confirmDeleteProduct = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  if (!isDeleting.value) {
    showDeleteModal.value = false
  }
}

const deleteProduct = async () => {
  if (!product.value) return
  
  isDeleting.value = true
  
  try {
    // Since deleteProduct API is not implemented yet, we'll show a warning
    alert('Delete functionality is not yet implemented in the API. This would delete product: ' + product.value.name)
    
    // TODO: Implement when API is ready
    // const response = await productApi.deleteProduct(product.value.id)
    // if (response.success) {
    //   router.push('/products')
    // } else {
    //   alert(`Failed to delete product: ${response.message}`)
    // }
    
    // For now, just close the modal
    showDeleteModal.value = false
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('An error occurred while deleting the product')
  } finally {
    isDeleting.value = false
  }
}

// Initialize
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-w-16 > * {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
