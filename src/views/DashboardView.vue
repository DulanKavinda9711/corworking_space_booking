<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <!-- <div class="flex items-end justify-end ">
        <div class="text-sm text-gray-500 ">
          Last updated: {{ currentTime }}
        </div>
      </div> -->

      <!-- Search Section -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex flex-col gap-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by booking ID, name, or email..."
              v-model="searchQuery"
              @input="handleSearchInput"
              @focus="showSearchResults = true"
              class="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
            />
            
            <!-- Search Results Dropdown -->
            <div v-if="showSearchResults && filteredResults.length > 0" class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                v-for="result in filteredResults"
                :key="result.id"
                @click="selectBooking(result)"
                class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCalendarCheck" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ result.id }}</p>
                    <p class="text-xs text-gray-500">{{ result.customerName }} • {{ result.productName }}</p>
                    <p class="text-xs text-gray-400">{{ result.date }} • ${{ result.totalPrice }}</p>
                  </div>
                </div>
                <span :class="getStatusClass(result.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ result.status }}
                </span>
              </div>
            </div>
            
            <!-- No Results -->
            <div v-if="showSearchResults && searchQuery && filteredResults.length === 0" class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
              <div class="text-center text-gray-500">
                <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm">No bookings found</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Widgets -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <!-- Today's Bookings -->
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-card p-4 hover:shadow-card-hover transition-shadow">
          <div class="text-center">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCalendarCheck" />
              </svg>
            </div>
            <h3 class="text-xs font-medium text-blue-600 mb-1">Today's Bookings</h3>
            <p class="text-xl font-bold text-blue-900 mb-1">{{ stats.todayBookings }}</p>
            <p class="text-xs text-blue-700">{{ stats.todayBookings }} new bookings today</p>
          </div>
        </div>

        <!-- Upcoming Bookings -->
        <div class="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-card p-4 hover:shadow-card-hover transition-shadow">
          <div class="text-center">
            <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCalendarClock" />
              </svg>
            </div>
            <h3 class="text-xs font-medium text-purple-600 mb-1">Upcoming Bookings</h3>
            <p class="text-xl font-bold text-purple-900 mb-1">{{ stats.upcomingBookings }}</p>
            <p class="text-xs text-purple-700">{{ stats.upcomingBookings }} bookings for the next 7 days</p>
          </div>
        </div>

        <!-- PayMedia Commission -->
        <div class="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl shadow-card p-4 hover:shadow-card-hover transition-shadow">
          <div class="text-center">
            <div class="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCashMultiple" />
              </svg>
            </div>
            <h3 class="text-xs font-medium text-teal-600 mb-1">PayMedia Commission</h3>
            <p class="text-xl font-bold text-teal-900 mb-1">${{ stats.payMediaCommission.toLocaleString() }}</p>
            <p class="text-xs text-teal-700">{{ stats.payMediaPeriod }}</p>
          </div>
        </div>

        <!-- Total Revenue Today -->
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-card p-4 hover:shadow-card-hover transition-shadow">
          <div class="text-center">
            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCurrencyUsd" />
              </svg>
            </div>
            <h3 class="text-xs font-medium text-green-600 mb-1">Total Revenue Today</h3>
            <p class="text-xl font-bold text-green-900 mb-1">${{ stats.todayRevenue.toLocaleString() }}</p>
            <p class="text-xs text-green-700">Revenue earned today</p>
          </div>
        </div>

        <!-- Cancellations -->
        <div class="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl shadow-card p-4 hover:shadow-card-hover transition-shadow">
          <div class="text-center">
            <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCancel" />
              </svg>
            </div>
            <h3 class="text-xs font-medium text-orange-600 mb-1">Cancellations</h3>
            <p class="text-xl font-bold text-orange-900 mb-1">{{ stats.cancellations }}</p>
            <p class="text-xs text-orange-700">{{ stats.cancellations }} cancelled today</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Bookings -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <router-link to="/bookings" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </router-link>
          </div>
          <div class="space-y-4">
            <div v-for="booking in recentBookings" :key="booking.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCalendarCheck" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ booking.id }}</p>
                  <p class="text-xs text-gray-500">{{ booking.customer }} • {{ booking.product }}</p>
                  <p class="text-xs text-gray-400">{{ booking.date }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="getStatusClass(booking.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ booking.status }}
                </span>
                <router-link :to="`/bookings/${booking.id}`" class="text-primary-600 hover:text-primary-900" title="View Details">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiEye" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <router-link to="/companies" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiOfficeBuilding" />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-900">Add Company</p>
            </router-link>
            
            <router-link to="/bookings" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCalendarPlus" />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-900">New Booking</p>
            </router-link>
            
            <router-link to="/locations" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiMapMarker" />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-900">Add Location</p>
            </router-link>
            
            <router-link to="/reports" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiChartLine" />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-900">View Reports</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  mdiEmail,
  mdiCalendarCheck,
  mdiCalendarClock,
  mdiCancel,
  mdiCurrencyUsd,
  mdiTrendingUp,
  mdiCashMultiple,
  mdiOfficeBuilding,
  mdiCalendarPlus,
  mdiMapMarker,
  mdiChartLine,
  mdiEye
} from '@mdi/js'

const router = useRouter()

// Search state
const searchQuery = ref('')
const showSearchResults = ref(false)
const filteredResults = ref<any[]>([])

// All bookings data for search
const allBookings = ref([
  // Confirmed Bookings
  {
    id: 'BR-2034',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    date: '2025-08-20',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    totalPrice: 100,
    status: 'confirmed'
  },
  {
    id: 'BR-2035',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    date: '2025-08-21',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    totalPrice: 64,
    status: 'confirmed'
  },
  {
    id: 'BR-2036',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    customerName: 'Robert Chen',
    customerEmail: 'robert.chen@example.com',
    date: '2025-08-22',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    totalPrice: 100,
    status: 'confirmed'
  },
  {
    id: 'BR-2037',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.rodriguez@example.com',
    date: '2025-08-23',
    startTime: '8:00 AM',
    endTime: '12:00 PM',
    totalPrice: 32,
    status: 'confirmed'
  },
  {
    id: 'BR-2038',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    customerName: 'David Kim',
    customerEmail: 'david.kim@example.com',
    date: '2025-08-24',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    totalPrice: 450,
    status: 'confirmed'
  },
  // Completed Bookings
  {
    id: 'BR-2020',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    customerName: 'Mike Johnson',
    customerEmail: 'mike.johnson@example.com',
    date: '2025-08-15',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    totalPrice: 100,
    status: 'completed'
  },
  {
    id: 'BR-2021',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    customerName: 'Lisa Thompson',
    customerEmail: 'lisa.thompson@example.com',
    date: '2025-08-16',
    startTime: '8:00 AM',
    endTime: '4:00 PM',
    totalPrice: 64,
    status: 'completed'
  },
  // Cancelled Bookings
  {
    id: 'BR-2010',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    date: '2025-08-12',
    startTime: '3:00 PM',
    endTime: '5:00 PM',
    totalPrice: 100,
    status: 'cancelled'
  }
])

// Current time
const currentTime = ref('')

// Stats data
const stats = ref({
  todayBookings: 12,
  upcomingBookings: 18,
  cancellations: 2,
  todayRevenue: 1250,
  payMediaCommission: 875,
  payMediaPeriod: 'This week: $875 | This month: $3,420'
})

// Recent bookings data
const recentBookings = ref([
  {
    id: 'BR-2034',
    customer: 'John Doe',
    product: 'Board Room – Main Branch',
    date: '12 Aug 2025, 10:00 AM',
    status: 'confirmed'
  },
  {
    id: 'BR-2033',
    customer: 'Jane Smith',
    product: 'Hot Desk – Second Floor',
    date: '12 Aug 2025, 2:00 PM',
    status: 'confirmed'
  },
  {
    id: 'BR-2032',
    customer: 'Mike Johnson',
    product: 'Private Office – Building A',
    date: '11 Aug 2025, 9:00 AM',
    status: 'completed'
  },
  {
    id: 'BR-2031',
    customer: 'Sarah Wilson',
    product: 'Meeting Room – Ground Floor',
    date: '11 Aug 2025, 3:00 PM',
    status: 'cancelled'
  }
])

// Methods
const handleSearchInput = () => {
  if (!searchQuery.value.trim()) {
    filteredResults.value = []
    showSearchResults.value = false
    return
  }

  const query = searchQuery.value.toLowerCase().trim()
  filteredResults.value = allBookings.value.filter(booking => 
    booking.id.toLowerCase().includes(query) ||
    booking.customerName.toLowerCase().includes(query) ||
    booking.customerEmail.toLowerCase().includes(query) ||
    booking.productName.toLowerCase().includes(query)
  ).slice(0, 8) // Limit to 8 results for better UX

  showSearchResults.value = true
}

const selectBooking = (booking: any) => {
  showSearchResults.value = false
  searchQuery.value = booking.id
  
  // Navigate to booking detail page
  router.push(`/bookings/${booking.id}`)
}

const performSearch = () => {
  // Legacy method - now handled by autocomplete
  if (searchQuery.value) {
    handleSearchInput()
  }
}

const getStatusClass = (status: string) => {
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

const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Close search results when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const searchContainer = target.closest('.relative')
  
  if (!searchContainer) {
    showSearchResults.value = false
  }
}

onMounted(() => {
  updateCurrentTime()
  // Update time every minute
  setInterval(updateCurrentTime, 60000)
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
