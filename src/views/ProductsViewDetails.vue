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
      <div v-else-if="!product" class="bg-white rounded-xl shadow-card p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Product Not Found</h3>
        <p class="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
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
                       @click="openImageModal(image, index)">
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
              <div v-if="product.pricePerHour" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="text-sm font-medium text-green-600 mb-1">Per Hour</div>
                <div class="text-2xl font-bold text-green-800">${{ product.pricePerHour }}</div>
              </div>
              <div v-if="product.pricePerDay" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="text-sm font-medium text-blue-600 mb-1">Per Day</div>
                <div class="text-2xl font-bold text-blue-800">${{ product.pricePerDay }}</div>
              </div>
              <div v-if="product.pricePerMonth" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div class="text-sm font-medium text-purple-600 mb-1">Per Month</div>
                <div class="text-2xl font-bold text-purple-800">${{ product.pricePerMonth }}</div>
              </div>
              <div v-if="product.pricePerYear" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div class="text-sm font-medium text-orange-600 mb-1">Per Year</div>
                <div class="text-2xl font-bold text-orange-800">${{ product.pricePerYear }}</div>
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
                        :class="product.openDays.includes(day) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'"
                        class="px-3 py-1 text-sm font-medium rounded-full">
                    {{ day.substring(0, 3) }}
                  </span>
                </div>
              </div>

              <!-- Open Hours -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-3">Operating Hours</h4>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiClockOutline" />
                    </svg>
                    <span class="text-gray-900 font-medium">
                      {{ formatTime(product.openHours.start) }} - {{ formatTime(product.openHours.end) }}
                    </span>
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
                     class="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCurrencyUsd" />
                    </svg>
                    <span class="text-blue-800 font-medium">{{ facility.name }}</span>
                  </div>
                  <span class="text-blue-900 font-bold">${{ facility.pricePerHour }}/hr</span>
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

// Data
const productId = route.params.id as string
const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Sample products data - in real app, this would come from API
const sampleProducts = [
  {
    id: 'PROD001',
    name: 'Executive Meeting Room',
    type: 'Meeting Room',
    locationName: 'Downtown Office',
    locationAddress: '123 Business St',
    companyName: 'ABC Corporation',
    companyId: 'COMP001',
    locationId: 'LOC001',
    status: 'active',
    maxSeatingCapacity: 12,
    pricePerHour: 50,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=500',
      'https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=500'
    ],
    description: 'Spacious executive meeting room with state-of-the-art video conferencing facilities, perfect for important business meetings and presentations. Features floor-to-ceiling windows with city views.',
    openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    openHours: { start: '08:00', end: '18:00' },
    defaultFacilities: ['High-Speed WiFi', 'HD Projector & Screen', 'Whiteboard', 'Video Conferencing Setup'],
    additionalFacilities: [
      { id: 'FAC001', name: 'Coffee Machine', pricePerHour: 5 },
      { id: 'FAC002', name: 'Catering Service', pricePerHour: 15 },
      { id: 'FAC003', name: 'Printing Services', pricePerHour: 3 }
    ]
  },
  {
    id: 'PROD002',
    name: 'Modern Hot Desk',
    type: 'Hot Desk',
    locationName: 'Tech Hub',
    locationAddress: '456 Innovation Ave',
    companyName: 'Tech Innovations Ltd.',
    companyId: 'COMP004',
    locationId: 'LOC002',
    status: 'active',
    maxSeatingCapacity: 1,
    pricePerHour: 8,
    pricePerDay: 60,
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'
    ],
    description: 'Modern hot desk in a vibrant coworking environment with ergonomic furniture and high-speed connectivity. Perfect for freelancers and remote workers.',
    openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    openHours: { start: '07:00', end: '19:00' },
    defaultFacilities: ['High-Speed WiFi', 'Power Outlets', 'Ergonomic Chair', 'Desk Lamp'],
    additionalFacilities: [
      { id: 'FAC004', name: 'External Monitor', pricePerHour: 3 },
      { id: 'FAC005', name: 'Keyboard & Mouse', pricePerHour: 2 }
    ]
  },
  {
    id: 'PROD003',
    name: 'Private Dedicated Workspace',
    type: 'Dedicated Desk',
    locationName: 'Business Center',
    locationAddress: '789 Corporate Blvd',
    companyName: 'Global Solutions Inc.',
    companyId: 'COMP003',
    locationId: 'LOC003',
    status: 'active',
    maxSeatingCapacity: 1,
    pricePerMonth: 800,
    pricePerYear: 8500,
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500'
    ],
    description: 'Private dedicated workspace with personal storage and 24/7 access. Ideal for entrepreneurs and small business owners who need a permanent office solution.',
    openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    openHours: { start: '00:00', end: '23:59' },
    defaultFacilities: ['High-Speed WiFi', 'Storage Locker', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line'],
    additionalFacilities: [
      { id: 'FAC006', name: 'Printer Access', pricePerHour: 1 },
      { id: 'FAC007', name: 'Meeting Room Credits', pricePerHour: 10 }
    ]
  }
]

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

const loadProduct = () => {
  isLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    product.value = sampleProducts.find(p => p.id === productId) || null
    isLoading.value = false
  }, 500)
}

const openImageModal = (image: string, index: number) => {
  selectedImage.value = image
  selectedImageIndex.value = index
}

const closeImageModal = () => {
  selectedImage.value = null
  selectedImageIndex.value = 0
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, make API call to delete product
    console.log('Deleting product:', product.value.id)
    
    // Navigate back to products list
    router.push('/products')
  } catch (error) {
    console.error('Error deleting product:', error)
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
