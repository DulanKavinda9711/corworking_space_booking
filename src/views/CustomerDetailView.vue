<template>
  <AdminLayout>
    <div class="space-y-6" v-if="customer && !loading">
      <!-- Back Button -->
      <div class="flex items-center">
        <router-link to="/customers" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Customers
        </router-link>
      </div>

      <!-- Customer Profile Card -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-6">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiAccount" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ customer.name }}</h1>
              
              
              <!-- Profile Information -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-3">
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiEmail" />
                    </svg>
                    {{ customer.email }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiPhone" />
                    </svg>
                    {{ customer.phone }}
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCalendarAccount" />
                    </svg>
                    Joined {{ formatDate(customer.dateJoined) }}
                  </div>
                  <div class="flex items-center">
                    <span :class="getCustomerTypeClass(customer.customerType)" class="px-2 py-1 text-xs font-medium rounded-full mr-3">
                      {{ customer.customerType }}
                    </span>
                    <span :class="getStatusClass(customer.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ customer.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button 
              @click="toggleCustomerStatus"
              :class="customer.status === 'blocked' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
              class="px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path :d="customer.status === 'blocked' ? mdiAccountCheck : mdiAccountCancel" />
              </svg>
              <span>{{ customer.status === 'blocked' ? 'Unblock User' : 'Block User' }}</span>
            </button>
            
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCalendarCheck" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Total Bookings</h3>
              <p class="text-2xl font-bold text-gray-900">{{ customer.totalBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCurrencyUsd" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Total Spent</h3>
              <p class="text-2xl font-bold text-gray-900">${{ customerStats.totalSpent.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCalendarClock" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Upcoming</h3>
              <p class="text-2xl font-bold text-gray-900">{{ customerStats.upcomingBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCancel" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Cancellations</h3>
              <p class="text-2xl font-bold text-gray-900">{{ customerStats.cancellations }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking History -->
      <div class="bg-white rounded-xl shadow-card">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Booking History</h2>
          <div class="flex items-center space-x-3">
            <select v-model="bookingFilter" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
              <option value="">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div class="overflow-x-auto">
      
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span class="ml-2 text-gray-600">Loading booking history...</span>
          </div>
          
         
          <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
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
              <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ booking.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(booking.date) }}</div>
                  <div class="text-sm text-gray-500">{{ booking.startTime }} - {{ booking.endTime }}</div>
                </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <img class="h-8 w-8 rounded object-cover" :src="booking.productImage" :alt="booking.productName">
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">
                          {{ booking.productType === 'Subscription' ? 'Dedicated Desk' : booking.productType }}
                        </div>
                      </div>
                    </div>
                  </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ booking.duration }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ booking.totalPrice }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getBookingStatusClass(booking.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ booking.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link :to="`/bookings/${booking.id}`" class="text-primary-600 hover:text-primary-900 flex items-center space-x-1" title="View Booking">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiEye" />
                    </svg>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

       
        <div v-if="!loading && filteredBookings.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p class="mt-1 text-sm text-gray-500">This customer has no booking history matching the selected filter.</p>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useCustomers } from '@/composables/useCustomers'
import { useBookings } from '@/composables/useBookings'
import { customerApi } from '@/services/api'
import type { Booking } from '@/services/api'
import { 
  mdiAccount, 
  mdiEmail, 
  mdiPhone, 
  mdiCalendarAccount, 
  mdiAccountCheck, 
  mdiAccountCancel, 
  mdiKeyVariant,
  mdiCalendarCheck,
  mdiCurrencyUsd,
  mdiCalendarClock,
  mdiCancel,
  mdiEye
} from '@mdi/js'

const route = useRoute()
const bookingFilter = ref('')
const { getCustomerById, toggleCustomerStatus: toggleStatus, loadPersistedStatuses } = useCustomers()
const { allBookings } = useBookings()

// Loading state
const loading = ref(true)
const customerBookings = ref<Booking[]>([])

// Get customer data from shared store
const customerId = route.params.id as string
const customer = computed(() => {
  // Get customer from shared store only
  const sharedCustomer = getCustomerById(customerId)
  if (sharedCustomer.value) {
    // Update total bookings with actual data
    return {
      ...sharedCustomer.value,
      totalBookings: customerBookings.value.length
    }
  }
  // If not found, return null
  return null
})

// Customer statistics
const customerStats = computed(() => {
  if (!customer.value) {
    return {
      totalSpent: 0,
      upcomingBookings: 0,
      cancellations: 0
    }
  }
  const customerBookingsList = customerBookings.value
  const totalSpent = customerBookingsList.reduce((sum, booking) => sum + booking.totalPrice, 0)
  const upcomingBookings = customerBookingsList.filter(booking => {
    const bookingDate = new Date(booking.date)
    const today = new Date()
    return bookingDate > today && (booking.status === 'confirmed' || booking.status === 'pending')
  }).length
  const cancellations = customerBookingsList.filter(booking => booking.status === 'cancelled').length
  return {
    totalSpent,
    upcomingBookings,
    cancellations
  }
})

// Only show booking history for real customers
const bookingHistory = computed(() => customer.value ? customerBookings.value : [])

// Computed properties
const filteredBookings = computed(() => {
  if (!bookingFilter.value) return bookingHistory.value
  return bookingHistory.value.filter(booking => booking.status === bookingFilter.value)
})

// Methods
const getCustomerTypeClass = (type: string) => {
  return type === 'registered' 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800'
    case 'blocked':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getBookingStatusClass = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'completed':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const toggleCustomerStatus = () => {
  if (!customer.value) return
  const action = customer.value.status === 'blocked' ? 'unblock' : 'block'
  if (confirm(`Are you sure you want to ${action} ${customer.value.name}?`)) {
    toggleStatus(customer.value.id)
  }
}

const resetPassword = () => {
  if (!customer.value) return
  if (confirm(`Are you sure you want to reset the password for ${customer.value.name}?`)) {
    alert(`Password reset link has been sent to ${customer.value.email}`)
  }
}

// Function to fetch customer bookings using booking page data only
const fetchCustomerBookings = async () => {
  loading.value = true
  try {
    // Use booking page data for history
    if (customer.value) {
      customerBookings.value = allBookings.value.filter(booking => {
        if (!customer.value) return false
        return booking.customerEmail === customer.value.email || booking.customerName === customer.value.name
      })
    } else {
      customerBookings.value = []
    }
  } catch (error) {
    console.error('Error filtering customer bookings:', error)
    customerBookings.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Load persisted customer statuses from localStorage
  loadPersistedStatuses()
  console.log('Loading customer details for ID:', route.params.id)
  
  // Fetch customer bookings
  await fetchCustomerBookings()
})
</script>
