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
              placeholder="Search bookings by ID, customer name, or email"
              v-model="searchQuery"
              @input="handleSearchInput"
              @focus="showSearchResults = true"
              @blur="hideSearchResults"
              class="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:ring-1 focus:z-10 sm:text-md text-gray-900"
            />

                        <div v-if="showSearchResults && filteredResults.length > 0" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                v-for="booking in filteredResults"
                :key="booking.id"
                @click="selectBooking(booking)"
                class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCalendarCheck" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ booking.id }}</div>
                    <div class="text-xs text-gray-500">{{ booking.customerName }}</div>
                    <div v-if="booking.customerEmail" class="text-xs text-gray-400">{{ booking.customerEmail }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-900">{{ booking.productName || booking.productType }}</div>
                  <div class="text-xs text-gray-500">{{ formatBookingDate(booking) }}</div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="getStatusClass(booking.status)">
                    {{ booking.status }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="showSearchResults && searchQuery && filteredResults.length === 0" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              <div class="text-center text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                <p class="mt-1 text-sm text-gray-500">No bookings match "{{ searchQuery }}". Try searching by booking ID, customer name, or email.</p>
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
              <div v-if="statsLoading" class="mt-2">
                <div class="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-3 bg-gray-200 rounded animate-pulse mt-1 w-3/4"></div>
              </div>
              <div v-else>
                <p class="text-3xl font-bold mt-2 text-gray-900">{{ stats.todayBookings }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ stats.todayBookings }} new bookings today</p>
              </div>
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
              <div v-if="statsLoading" class="mt-2">
                <div class="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-3 bg-gray-200 rounded animate-pulse mt-1 w-4/5"></div>
              </div>
              <div v-else>
                <p class="text-3xl font-bold mt-2 text-gray-900">{{ stats.upcomingBookings }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ stats.upcomingBookings }} bookings for the next 7 days</p>
              </div>
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
              <div v-if="statsLoading" class="mt-2">
                <div class="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-3 bg-gray-200 rounded animate-pulse mt-1 w-2/3"></div>
              </div>
              <div v-else>
                <p class="text-3xl font-bold mt-2 text-gray-900">LKR {{ stats.todayRevenue.toLocaleString() }}</p>
                <p class="text-xs text-green-600 mt-1 font-medium">+55% since yesterday</p>
              </div>
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
              <div v-if="statsLoading" class="mt-2">
                <div class="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-3 bg-gray-200 rounded animate-pulse mt-1 w-3/5"></div>
              </div>
              <div v-else>
                <p class="text-3xl font-bold mt-2 text-gray-900">{{ stats.cancellations }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ stats.cancellations }} cancelled today</p>
              </div>
            </div>
            <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <svg class="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiCancel"/></svg>
            </div>
          </div>
        </div>

        <!-- Card: SquareHub Commission (white card with icon) - Protected by permissions -->
        <PermissionGuard
          permission="view_squrehub_commission"
          :show-fallback="false"
        >
          <div class="relative overflow-hidden rounded-2xl p-5 shadow-sm bg-white border border-gray-100 hover:shadow-md transition-transform duration-300 cursor-pointer">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-gray-500">SquareHub Commission</p>
                <div v-if="statsLoading" class="mt-2">
                  <div class="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-3 bg-gray-200 rounded animate-pulse mt-1 w-4/6"></div>
                </div>
                <div v-else>
                  <p class="text-3xl font-bold mt-2 text-gray-900">LKR {{ stats.SquareHubCommission.toLocaleString() }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ stats.SquareHubPeriod }}</p>
                </div>
              </div>
              <div class="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center border border-yellow-100">
                <svg class="w-7 h-7 text-yellow-600" fill="currentColor" viewBox="0 0 24 24"><path :d="mdiCashMultiple"/></svg>
              </div>
            </div>
          </div>

          <template #fallback>
            <div class="relative overflow-hidden rounded-2xl p-5 shadow-sm bg-gray-50 border border-gray-200">
              <div class="flex items-center justify-center h-20">
                <div class="text-center">
                  <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p class="text-xs text-gray-500">Access Restricted</p>
                  <p class="text-xs text-gray-400 mt-1">Contact administrator</p>
                </div>
              </div>
            </div>
          </template>
        </PermissionGuard>
      </div>

      <!-- Main content: charts + lists -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chart area -->
        <div class="lg:col-span-2 max-h-85 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Bookings</h2>
              <p class="text-xs text-gray-500">Showing last {{ rangeDays }} days</p>
            </div>

            <!-- Advanced chart controls -->
            <div class="flex items-center space-x-3">
              <!-- Range buttons -->
              <div class="inline-flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                <button
                  v-for="d in [7,30]"
                  :key="d"
                  @click="changeRange(d)"
                  :class="['px-3 py-1 text-sm rounded-md font-medium', rangeDays === d ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100']"
                >
                  {{ d }}d
                </button>
              </div>

              <!-- Chart type toggle -->
              <!-- <div class="inline-flex items-center bg-gray-50 rounded-lg p-1">
                <button @click="toggleChartType" class="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">{{ chartType === 'area' ? 'Area' : 'Line' }}</button>
              </div> -->

              <!-- Export & Refresh -->
              <button @click="exportCSV" :disabled="isExporting" class="px-3 py-1 bg-white border rounded-md text-sm text-gray-700 hover:shadow-sm">
                <svg v-if="!isExporting" class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5"/></svg>
                <svg v-else class="animate-spin w-4 h-4 inline mr-1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.3" fill="none"/><path d="M22 12A10 10 0 0012 2" stroke="currentColor" stroke-width="4"/></svg>
                Export
              </button>

              <button @click="refreshChart" class="px-3 py-1 bg-white border rounded-md text-sm text-gray-700 hover:shadow-sm">
                <svg class="w-4 h-4 inline mr-1" viewBox="0 0 122.88 118.66" fill="currentColor">
                  <path d="M16.68,22.2c-1.78,2.21-3.43,4.55-5.06,7.46C5.63,40.31,3.1,52.39,4.13,64.2c1.01,11.54,5.43,22.83,13.37,32.27 c2.85,3.39,5.91,6.38,9.13,8.97c11.11,8.93,24.28,13.34,37.41,13.22c13.13-0.13,26.21-4.78,37.14-13.98 c3.19-2.68,6.18-5.73,8.91-9.13c6.4-7.96,10.51-17.29,12.07-27.14c1.53-9.67,0.59-19.83-3.07-29.66 c-3.49-9.35-8.82-17.68-15.78-24.21C96.7,8.33,88.59,3.76,79.2,1.48c-2.94-0.71-5.94-1.18-8.99-1.37c-3.06-0.2-6.19-0.13-9.4,0.22 c-2.01,0.22-3.46,2.03-3.24,4.04c0.22,2.01,2.03,3.46,4.04,3.24c2.78-0.31,5.49-0.37,8.14-0.2c2.65,0.17,5.23,0.57,7.73,1.17 c8.11,1.96,15.1,5.91,20.84,11.29c6.14,5.75,10.85,13.12,13.94,21.43c3.21,8.61,4.04,17.51,2.7,25.96 C113.59,75.85,110,84,104.4,90.96c-2.47,3.07-5.12,5.78-7.91,8.13c-9.59,8.07-21.03,12.15-32.5,12.26 c-11.47,0.11-23-3.76-32.76-11.61c-2.9-2.33-5.62-4.98-8.13-7.97c-6.92-8.22-10.77-18.09-11.66-28.2 c-0.91-10.37,1.32-20.99,6.57-30.33c1.59-2.82,3.21-5.07,5.01-7.24l0.53,14.7c0.07,2.02,1.76,3.6,3.78,3.52 c2.02-0.07,3.6-1.76,3.52-3.78l-0.85-23.42c-0.07-2.02-1.76-3.6-3.78-3.52c-0.13,0-0.25,0.02-0.37,0.03l0,0l-22.7,3.19 c-2,0.28-3.4,2.12-3.12,4.13c0.28,2,2.12,3.4,4.13,3.12L16.68,22.2L16.68,22.2z"/>
                </svg>
                Refresh
              </button>
            </div>
          </div>
          <div class="relative">
            <div v-if="chartLoading" class="flex items-center justify-center h-64">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
            <apex-chart
              v-else
              type="area"
              :options="chartOptions"
              :series="chartSeries"
              height="270"
              class="apex-chart"
            />
          </div>
        </div>

        <!-- Right column: Recent & Actions -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 max-h-85">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-md font-medium text-gray-900">Recent Bookings</h3>
              <router-link to="/bookings" class="text-sm text-green-600">View all</router-link>
            </div>
            <div class="space-y-3 max-h-80 overflow-y-auto">
              <div v-if="recentBookings.length === 0" class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm">No recent bookings</p>
                <p class="text-xs text-gray-400 mt-1">Recent bookings will appear here</p>
              </div>
              <div v-for="booking in recentBookings.slice(0, 5)" :key="booking.id" 
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
import PermissionGuard from '@/components/ui/PermissionGuard.vue'
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
import { dashboardApi } from '@/services/api'
import { useBookingsStore } from '@/stores/bookings'

const router = useRouter()
const bookingsStore = useBookingsStore()

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
    categories: [] as string[],
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
    },
    forceNiceScale: false,
    max: 10
  },
  tooltip: {
    style: {
        colors: '#059669',
    },
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
  data: [] as number[]
}])

// Advanced chart controls state
const rangeDays = ref<number>(7)
const chartType = ref<'area' | 'line'>('area')
const isExporting = ref(false)


// Search state
const searchQuery = ref('')
const showSearchResults = ref(false)
const filteredResults = ref<any[]>([])

// Snackbar state
const showSnackbar = ref(false)
const snackbarMessage = ref('')

// Loading state for stats
const statsLoading = ref(true)

// Loading state for chart
const chartLoading = ref(true)

// All bookings data for search
const allBookings = ref<any[]>([])

// Current time
const currentTime = ref('')

// Stats data
const stats = ref({
  todayBookings: 0,
  upcomingBookings: 0,
  cancellations: 0,
  todayRevenue: 0,
  SquareHubCommission: 0,
  SquareHubPeriod: 'Loading...'
})

// Recent bookings data
const recentBookings = ref<any[]>([])

// Methods
const loadBookingSummary = async () => {
  try {
    statsLoading.value = true
    const response = await dashboardApi.getBookingSummary()
    
    if (response.success && response.data) {
      stats.value = {
        todayBookings: response.data.todays_booking_count,
        upcomingBookings: response.data.upcoming_booking_count,
        cancellations: response.data.todays_cancelled_booking_count,
        todayRevenue: response.data.todays_revenue,
        SquareHubCommission: response.data.square_hub_commission,
        SquareHubPeriod: `This week: LKR ${response.data.square_hub_commission} | This month: LKR ${(response.data.square_hub_commission * 4).toLocaleString()}`
      }
    } else {
      console.error('Failed to load booking summary:', response.message)
      // Keep default values on error
    }
  } catch (error) {
    console.error('Error loading booking summary:', error)
    // Keep default values on error
  } finally {
    statsLoading.value = false
  }
}

const loadLast30DaysBookings = async (days = 30) => {
  try {
    chartLoading.value = true
    const response = await dashboardApi.getLast30DaysBookings()
    
    if (response.success && response.data) {
      // Extract dates and booking counts
      // API returns full 30+ days; slice the last `days` entries
      const raw = response.data.last30_days_summary
      const sliced = raw.slice(-days)
      const dates = sliced.map(item => {
        const date = new Date(item.date)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
      const bookings = sliced.map(item => item.total_bookings)
      
      // Update chart data
      chartOptions.value.xaxis.categories = dates
      chartSeries.value[0].data = bookings
    } else {
      console.error('Failed to load last 30 days bookings:', response.message)
      // Keep default values on error
    }
  } catch (error) {
    console.error('Error loading last 30 days bookings:', error)
    // Keep default values on error
  } finally {
    chartLoading.value = false
  }
}

// Change displayed range (7/30/90)
const changeRange = (d: number) => {
  rangeDays.value = d
  loadLast30DaysBookings(d)
}

// Toggle chart type between area and line
const toggleChartType = () => {
  chartType.value = chartType.value === 'area' ? 'line' : 'area'
  // Update chart options so ApexChart re-renders
  chartOptions.value.chart.type = chartType.value
}

// Export current series to CSV
const exportCSV = async () => {
  isExporting.value = true
  try {
    const labels = chartOptions.value.xaxis.categories || []
    const data = chartSeries.value[0].data || []
    const rows = [['date','bookings'], ...labels.map((l:any, i:number) => [l, data[i] ?? 0])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings_last_${rangeDays.value}d.csv`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Export failed', e)
  } finally {
    isExporting.value = false
  }
}

const refreshChart = async () => {
  await loadLast30DaysBookings(rangeDays.value)
}

const loadUpcomingBookings = async () => {
  try {
    const response = await dashboardApi.getUpcomingTenBookings()
    
    if (response.success && response.data) {
      // Map API response to component expected format
      recentBookings.value = response.data.map(booking => ({
        id: booking.order_id,
        customer: `${booking.first_name} ${booking.last_name}`,
        product: booking.product_name,
        date: `${booking.booking_date} ${booking.start_time}-${booking.end_time}`,
        status: 'upcoming' // Since these are upcoming bookings
      }))
    } else {
      console.error('Failed to load upcoming bookings:', response.message)
      recentBookings.value = []
    }
  } catch (error) {
    console.error('Error loading upcoming bookings:', error)
    recentBookings.value = []
  }
}

const handleSearchInput = () => {
  if (!searchQuery.value.trim()) {
    filteredResults.value = []
    showSearchResults.value = false
    return
  }

  const query = searchQuery.value.toLowerCase().trim()
  
  // Get all bookings from store (regular bookings + subscriptions + history)
  const allBookings = [
    ...bookingsStore.allBookings,
    ...bookingsStore.allSubscriptions,
    ...bookingsStore.bookingHistory
  ]
  
  // Filter bookings by ID, customer name, or email
  filteredResults.value = allBookings.filter(booking => {
    const bookingId = booking.id?.toLowerCase() || ''
    const customerName = booking.customerName?.toLowerCase() || ''
    const customerEmail = booking.customerEmail?.toLowerCase() || ''
    
    return bookingId.includes(query) || 
           customerName.includes(query) || 
           customerEmail.includes(query)
  }).slice(0, 10) // Limit to 10 results for better performance
  
  showSearchResults.value = true
}

const selectBooking = (booking: any) => {
  showSearchResults.value = false
  searchQuery.value = booking.id
  
  // Navigate to appropriate page based on booking type
  if (booking.productType === 'Subscription') {
    router.push(`/subscriptions/${booking.id}`)
  } else {
    // Check if it's a history booking
    const isHistoryBooking = booking.status === 'completed' || booking.status === 'cancelled'
    if (isHistoryBooking) {
      router.push(`/bookings?tab=history`)
    } else {
      router.push(`/bookings/${booking.id}`)
    }
  }
}

const viewBookingDetails = (bookingId: string) => {
  router.push(`/bookings/${bookingId}`)
}

const formatBookingDate = (booking: any) => {
  if (booking.productType === 'Subscription') {
    return booking.subscribedDate || 'N/A'
  }
  
  const date = booking.date || 'N/A'
  const startTime = booking.startTime
  const endTime = booking.endTime
  
  if (startTime && endTime) {
    return `${date} ${startTime}-${endTime}`
  }
  
  return date
}

const hideSearchResults = () => {
  // Hide search results after a small delay to allow click events to fire
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'confirmed':
    case 'ongoing':
      return 'bg-green-100 text-green-800'
    case 'upcoming':
      return 'bg-blue-100 text-blue-800'
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

onMounted(async () => {
  updateCurrentTime()
  // Update time every minute
  setInterval(updateCurrentTime, 60000)
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)

  // Load booking data for search functionality
  await Promise.all([
    bookingsStore.fetchBookings(),
    bookingsStore.fetchSubscriptions(),
    bookingsStore.fetchBookingHistory()
  ])

  // Load booking summary data
  loadBookingSummary()

  // Load chart data (respect selected range)
  loadLast30DaysBookings(rangeDays.value)

  // Load upcoming bookings for recent bookings section
  loadUpcomingBookings()

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
