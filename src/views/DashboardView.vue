<template>
  <AdminLayout>
    <!-- Success Snackbar -->
    <div v-if="showSnackbar" class="fixed top-4 right-4 z-50">
      <div class="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path :d="mdiCheckCircle" />
        </svg>
        <span class="font-medium">{{ snackbarMessage }}</span>
        <button @click="closeSnackbar" class="ml-2 text-white hover:text-gray-200 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        

        <!-- Search (keeps existing behavior) -->
        <div class="w-full md:w-1/3">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search bookings by ID, name, or email"
              v-model="searchQuery"
              @input="handleSearchInput"
              @focus="showSearchResults = true"
              class="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-800"
            />

            <div v-if="showSearchResults && filteredResults.length > 0" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                v-for="result in filteredResults"
                :key="result.id"
                @click="selectBooking(result)"
                class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
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

            <div v-if="showSearchResults && searchQuery && filteredResults.length === 0" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
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

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Card: Today's Bookings (white card with icon) -->
        <div class="relative overflow-hidden rounded-2xl p-5 shadow-sm bg-white border border-gray-100 hover:shadow-md transition-transform duration-300 cursor-pointer">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">Today's Bookings</p>
              <p class="text-3xl font-bold mt-2 text-gray-900">{{ stats.todayBookings }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ stats.todayBookings }} new bookings today</p>
            </div>
            <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
              <svg class="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiCalendarCheck"/></svg>
            </div>
          </div>
        </div>

        <!-- Card: Upcoming Bookings (white card with icon) -->
        <div class="relative overflow-hidden rounded-2xl p-5 shadow-sm bg-white border border-gray-100 hover:shadow-md transition-transform duration-300 cursor-pointer">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">Upcoming (7d)</p>
              <p class="text-3xl font-bold mt-2 text-gray-900">{{ stats.upcomingBookings }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ stats.upcomingBookings }} bookings for the next 7 days</p>
            </div>
            <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
              <svg class="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiCalendarClock"/></svg>
            </div>
          </div>
        </div>

        <!-- Card: Revenue Today (white card with icon & percent) -->
        <div class="relative overflow-hidden rounded-2xl p-5 shadow-sm bg-white border border-gray-100 hover:shadow-md transition-transform duration-300 cursor-pointer">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Revenue Today</p>
              <p class="text-3xl font-bold mt-2 text-gray-900">LKR {{ stats.todayRevenue.toLocaleString() }}</p>
              <p class="text-xs text-green-600 mt-1 font-medium">+55% since yesterday</p>
            </div>
            <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100">
              <svg class="w-7 h-7 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiCurrencyUsd"/></svg>
            </div>
          </div>
        </div>

        <!-- Card: Cancellations (white card with icon) -->
        <div class="relative overflow-hidden rounded-2xl p-5 shadow-sm bg-white border border-gray-100 hover:shadow-md transition-transform duration-300 cursor-pointer">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">Cancellations</p>
              <p class="text-3xl font-bold mt-2 text-gray-900">{{ stats.cancellations }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ stats.cancellations }} cancelled today</p>
            </div>
            <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <svg class="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiCancel"/></svg>
            </div>
          </div>
        </div>

        <!-- Card: SquareHub Commission (white card with icon) -->
        <div class="relative overflow-hidden rounded-2xl p-5 shadow-sm bg-white border border-gray-100 hover:shadow-md transition-transform duration-300 cursor-pointer">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">SquareHub Commission</p>
              <p class="text-3xl font-bold mt-2 text-gray-900">LKR {{ stats.SquareHubCommission.toLocaleString() }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ stats.SquareHubPeriod }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center border border-yellow-100">
              <svg class="w-7 h-7 text-yellow-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiCashMultiple"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content: charts + lists -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chart area -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Bookings — Last 30 days</h2>
              <p class="text-sm text-gray-500 mt-1">Daily booking trends and patterns</p>
            </div>
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-600">Bookings</span>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-900">{{ chartSeries[0].data.slice(-1)[0] }}</div>
                <div class="text-xs text-green-600 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiTrendingUp"/></svg>
                  +12% from last week
                </div>
              </div>
            </div>
          </div>
          <div class="relative">
            <apex-chart
              type="area"
              :options="chartOptions"
              :series="chartSeries"
              height="280"
              class="apex-chart"
            />
          </div>
        </div>

        <!-- Right column: Recent & Actions -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-md font-medium text-gray-900">Recent Bookings</h3>
              <router-link to="/bookings" class="text-sm text-green-600">View all</router-link>
            </div>
            <div class="space-y-3">
              <div v-for="booking in recentBookings" :key="booking.id" 
                   @click="viewBookingDetails(booking.id)"
                   class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiCalendarCheck"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ booking.id }} — {{ booking.customer }}</p>
                    <p class="text-xs text-gray-500">{{ booking.product }} · {{ booking.date }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="getStatusClass(booking.status)" class="px-2 py-1 text-xs font-medium rounded-full">{{ booking.status }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 class="text-md font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              <router-link to="/companies" class="flex flex-col items-center p-3 rounded-lg border border-gray-100 hover:shadow-sm">
                <div class="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiOfficeBuilding"/></svg>
                </div>
                <p class="text-xs text-gray-700">Add Company</p>
              </router-link>
              <router-link to="/bookings" class="flex flex-col items-center p-3 rounded-lg border border-gray-100 hover:shadow-sm">
                <div class="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiCalendarPlus"/></svg>
                </div>
                <p class="text-xs text-gray-700">New Booking</p>
              </router-link>
              <router-link to="/locations" class="flex flex-col items-center p-3 rounded-lg border border-gray-100 hover:shadow-sm">
                <div class="w-8 h-8 bg-purple-50 rounded-md flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiMapMarker"/></svg>
                </div>
                <p class="text-xs text-gray-700">Add Location</p>
              </router-link>
              <router-link to="/reports" class="flex flex-col items-center p-3 rounded-lg border border-gray-100 hover:shadow-sm">
                <div class="w-8 h-8 bg-yellow-50 rounded-md flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiChartLine"/></svg>
                </div>
                <p class="text-xs text-gray-700">View Reports</p>
              </router-link>
            </div>
          </div> -->
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
  mdiCheckCircle
} from '@mdi/js'

const router = useRouter()

// Chart data and options
const chartOptions = ref({
  chart: {
    type: 'area',
    height: 280,
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  colors: ['#10b981', '#059669'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.25,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.85,
      opacityTo: 0.25,
      stops: [0, 100]
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  grid: {
    show: true,
    borderColor: '#f1f5f9',
    strokeDashArray: 3,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  xaxis: {
    categories: [
      'Aug 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5', 'Aug 6', 'Aug 7',
      'Aug 8', 'Aug 9', 'Aug 10', 'Aug 11', 'Aug 12', 'Aug 13', 'Aug 14',
      'Aug 15', 'Aug 16', 'Aug 17', 'Aug 18', 'Aug 19', 'Aug 20', 'Aug 21',
      'Aug 22', 'Aug 23', 'Aug 24', 'Aug 25', 'Aug 26', 'Aug 27', 'Aug 28'
    ],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      style: {
        colors: '#64748b',
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#64748b',
        fontSize: '12px'
      }
    }
  },
  tooltip: {
    theme: 'light',
    x: {
      format: 'MMM dd, yyyy'
    },
    y: {
      formatter: function(value: number) {
        return value + ' bookings'
      }
    }
  },
  responsive: [{
    breakpoint: 640,
    options: {
      chart: {
        height: 200
      },
      xaxis: {
        labels: {
          rotate: -45,
          style: {
            fontSize: '10px'
          }
        }
      }
    }
  }]
})

const chartSeries = ref([{
  name: 'Bookings',
  data: [12, 19, 15, 25, 22, 18, 14, 21, 28, 24, 31, 27, 23, 19, 26, 33, 29, 24, 21, 28, 35, 31, 27, 22, 18, 25, 32, 29]
}])

// Search state
const searchQuery = ref('')
const showSearchResults = ref(false)
const filteredResults = ref<any[]>([])

// Snackbar state
const showSnackbar = ref(false)
const snackbarMessage = ref('')

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
  SquareHubCommission: 875,
  SquareHubPeriod: 'This week: LKR 875 | This month: LKR 3,420'
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

const viewBookingDetails = (bookingId: string) => {
  router.push(`/bookings/${bookingId}`)
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

const closeSnackbar = () => {
  showSnackbar.value = false
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

  // Check for login success message
  const loginSuccessMessage = sessionStorage.getItem('loginSuccessMessage')
  if (loginSuccessMessage) {
    snackbarMessage.value = loginSuccessMessage
    showSnackbar.value = true
    sessionStorage.removeItem('loginSuccessMessage')
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
