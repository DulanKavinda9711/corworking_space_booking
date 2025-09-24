<!--
  Example Vue Component using Centralized API
  
  This demonstrates how to use the centralized API service in Vue components
  Replace the existing direct localStorage usage with API calls
-->

<template>
  <div class="api-example-component">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span class="ml-2 text-gray-600">Loading bookings...</span>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="text-red-700">{{ error }}</span>
        <button @click="clearError" class="ml-auto text-red-500 hover:text-red-700">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Controls -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select v-model="filters.status" @change="applyFilters" class="border border-gray-300 rounded-md px-3 py-2">
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Location</label>
          <select v-model="filters.location" @change="applyFilters" class="border border-gray-300 rounded-md px-3 py-2">
            <option value="">All Locations</option>
            <option value="main-branch">Main Branch</option>
            <option value="tech-hub">Tech Hub</option>
            <option value="business-center">Business Center</option>
          </select>
        </div>

        <div class="flex items-end">
          <button @click="refreshData" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Refresh Data
          </button>
        </div>

        <div class="flex items-end">
          <button @click="showCreateModal = true" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Create Booking
          </button>
        </div>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ booking.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ booking.customerName }}</div>
              <div class="text-sm text-gray-500">{{ booking.customerEmail }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ booking.productName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ booking.date ? formatDate(booking.date) : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(booking.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ booking.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${{ booking.totalPrice }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button @click="viewBooking(booking.id)" class="text-blue-600 hover:text-blue-900">
                  View
                </button>
                <button 
                  v-if="booking.status === 'confirmed'" 
                  @click="cancelBookingHandler(booking)" 
                  class="text-orange-600 hover:text-orange-900"
                >
                  Cancel
                </button>
                <button 
                  v-if="booking.status === 'completed' || booking.status === 'cancelled'" 
                  @click="deleteBookingHandler(booking)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="bookings.length === 0 && !loading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your filters or create a new booking.</p>
      </div>
    </div>

    <!-- Create Booking Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Booking</h3>
        <!-- Simple form for demo -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Customer Name</label>
            <input v-model="newBooking.customerName" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="newBooking.customerEmail" type="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Product</label>
            <input v-model="newBooking.productName" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div class="flex justify-end space-x-2">
            <button @click="showCreateModal = false" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button @click="createBookingHandler" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bookingApi, type Booking } from '@/services/api'

const router = useRouter()

// State
const bookings = ref<Booking[]>([])
const loading = ref(false)
const error = ref('')
const showCreateModal = ref(false)

// Filters
const filters = reactive({
  status: '',
  location: '',
  customerType: ''
})

// New booking form
const newBooking = reactive({
  customerName: '',
  customerEmail: '',
  productName: 'Meeting Room',
  productType: 'Meeting Room',
  productId: 'PROD001',
  productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
  userType: 'registered' as const,
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00 AM',
  endTime: '11:00 AM',
  duration: '2 hours',
  totalPrice: 100,
  location: 'main-branch',
  locationName: 'Main Branch',
  companyName: 'Premium Co-working Ltd.',
  customerPhone: '+1 (555) 000-0000'
})

// Methods
const loadBookings = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await bookingApi.getAllBookings(filters)
    
    if (response.success && response.data) {
      bookings.value = response.data
    } else {
      error.value = response.message || 'Failed to load bookings'
    }
  } catch (err) {
    error.value = 'Network error while loading bookings'
    console.error('Error loading bookings:', err)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  loadBookings()
}

const refreshData = () => {
  loadBookings()
}

const clearError = () => {
  error.value = ''
}

const viewBooking = (id: string) => {
  // Navigate to booking detail
  if (bookings.value.find(b => b.id === id)?.productType === 'Subscription') {
    router.push(`/subscriptions/${id}`)
  } else {
    router.push(`/bookings/${id}`)
  }
}

const cancelBookingHandler = async (booking: Booking) => {
  if (!confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
    return
  }

  try {
    loading.value = true
    const response = await bookingApi.cancelBooking(booking.id, 'Cancelled by admin')
    
    if (response.success) {
      // Refresh data to show updated status
      await loadBookings()
      alert('Booking cancelled successfully')
    } else {
      error.value = response.message || 'Failed to cancel booking'
    }
  } catch (err) {
    error.value = 'Error cancelling booking'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

const deleteBookingHandler = async (booking: Booking) => {
  if (!confirm(`Are you sure you want to permanently delete booking ${booking.id}?`)) {
    return
  }

  try {
    loading.value = true
    const response = await bookingApi.deleteBooking(booking.id)
    
    if (response.success) {
      // Remove from local list
      bookings.value = bookings.value.filter(b => b.id !== booking.id)
      alert('Booking deleted successfully')
    } else {
      error.value = response.message || 'Failed to delete booking'
    }
  } catch (err) {
    error.value = 'Error deleting booking'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

const createBookingHandler = async () => {
  if (!newBooking.customerName || !newBooking.customerEmail || !newBooking.productName) {
    alert('Please fill in all required fields')
    return
  }

  try {
    loading.value = true
    const response = await bookingApi.createBooking(newBooking)
    
    if (response.success && response.data) {
      bookings.value.unshift(response.data)
      showCreateModal.value = false
      
      // Reset form
      Object.assign(newBooking, {
        customerName: '',
        customerEmail: '',
        productName: 'Meeting Room'
      })
      
      alert('Booking created successfully')
    } else {
      error.value = response.message || 'Failed to create booking'
    }
  } catch (err) {
    error.value = 'Error creating booking'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'completed':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Initialize
onMounted(() => {
  loadBookings()
})
</script>

<style scoped>
/* Component specific styles can be added here when needed */
</style>
