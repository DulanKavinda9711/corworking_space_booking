<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div
          class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2 md:sticky md:top-0 z-50">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiWallet" />
          </svg>
          <span class="text-sm font-medium text-green-700">
            Total Payments:
            <span class="font-bold text-green-800">{{ filteredPayments.length }}</span>
          </span>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="exportToCSV"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <svg class="-ml-1 mr-2 h-5 w-5 text-white-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>


      <!-- Payments Table -->
      <div class="bg-white rounded-xl shadow-card overflow-visible border-gray-200 ">
        <div class="bg-white shadow-card p-6 border-b rounded-t-xl">
          <div class="flex flex-col md:flex-row md:items-end md:space-x-1 gap-4 relative">
            <div class="relative md:w-48">
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <AdvancedDateRangePicker v-model="dateRange" placeholder="Select Date Range"
                @change="handleDateRangeChange" />
            </div>
            <div class="md:w-40">
              <label class="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <div class="relative">
                <div @click="toggleDropdown('product')" :class="['w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center', dropdownStates.product ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                  <span class="text-gray-900 leading-5 h-5 flex items-center">{{ getProductLabel(filters.product) }}</span>
                </div>

                <!-- Dropdown Options -->
                <div v-if="dropdownStates.product" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div class="p-2">
                    <div v-for="option in productOptions" :key="option.value" @click="selectProduct(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                      {{ option.label }}
                    </div>
                  </div>
                </div>

                <!-- Dropdown Arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.product ? 'transform rotate-180' : ''
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="md:w-48">
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div class="relative">
                <div @click="toggleDropdown('location')" :class="['w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center', dropdownStates.location ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                  <span class="text-gray-900 leading-5 h-5 flex items-center">{{ getLocationLabel(filters.location) }}</span>
                </div>

                <!-- Dropdown Options -->
                <div v-if="dropdownStates.location" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div class="p-2">
                    <div v-for="option in locationOptions" :key="option.value" @click="selectLocation(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                      {{ option.label }}
                    </div>
                  </div>
                </div>

                <!-- Dropdown Arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.location ? 'transform rotate-180' : ''
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="md:w-40">
              <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div class="relative">
                <div @click="toggleDropdown('sortBy')" :class="['w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center', dropdownStates.sortBy ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                  <span class="text-gray-900 leading-5 h-5 flex items-center">{{ getSortByLabel(sortBy) }}</span>
                </div>

                <!-- Dropdown Options -->
                <div v-if="dropdownStates.sortBy" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div class="p-2">
                    <div v-for="option in sortByOptions" :key="option.value" @click="selectSortBy(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                      {{ option.label }}
                    </div>
                  </div>
                </div>

                <!-- Dropdown Arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.sortBy ? 'transform rotate-180' : ''
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="flex items-end md:absolute md:right-0 md:top-6">
              <button @click="resetFilters"
                class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto h-[410px]">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SquareHub Commission
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ceylinco Commission
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody v-if="filteredPayments.length > 0" class="bg-white divide-y divide-gray-200">
              <tr v-for="payment in sortedPayments" :key="payment.id" @click="navigateToPaymentDetail(payment.id)"
                class="hover:bg-gray-50 cursor-pointer transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="mdiCreditCard" />
                        </svg>
                      </div>
                    </div>
                    <div class="text-sm font-medium text-gray-900 ml-3">{{ payment.bookingId }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <!-- <svg class="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiMapMarker" />
                    </svg> -->
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ payment.locationName }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                   
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ payment.customerName }}</div>
                      <div class="text-sm text-gray-500">{{ payment.customerEmail }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">LKR {{ payment.totalAmount }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-600">LKR {{ payment.SquareHubCommission }}</div>
                  <!-- <div class="text-sm text-gray-500">{{ payment.SquareHubRate }}%</div> -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-600">LKR {{ payment.ceylincoCommission }}</div>
                  <!-- <div class="text-sm text-gray-500">{{ payment.ceylincoRate }}%</div> -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">{{ payment.date }}</div>
                  <div class="text-sm text-gray-500">{{ payment.time }}</div>
                </td>
              </tr>
            </tbody>

            <!-- Empty State Row -->
            <tbody v-if="filteredPayments.length === 0" class="bg-white">
              <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                  <div>
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                    <p class="mt-1 text-sm text-gray-500">No payments match the current filters.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCommissionStore } from '@/stores/commission'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import AdvancedDateRangePicker from '@/components/ui/AdvancedDateRangePicker.vue'
import { paymentApi, locationApi } from '@/services/api'
import {
  mdiCog,
  mdiWallet,
  mdiCreditCard,
  mdiAccount
} from '@mdi/js'

interface Payment {
  id: string
  bookingId: string
  customerName: string
  customerEmail: string
  productName: string
  productType: string
  locationName: string
  baseAmount: number
  additionalFacilities: { name: string; price: number }[]
  totalAmount: number
  status: string
  date: string
  time: string
}

const router = useRouter()
const commissionStore = useCommissionStore()

// State
const dateRange = ref({
  startDate: '',
  endDate: ''
})

// Filters
const filters = ref({
  dateFrom: '', // startDate
  dateTo: '',   // endDate
  product: '',
  location: ''
})

// Handle date range change from the calendar component
const handleDateRangeChange = (newDateRange: { startDate: string; endDate: string }) => {
  dateRange.value = newDateRange
  filters.value.dateFrom = newDateRange.startDate
  filters.value.dateTo = newDateRange.endDate
}

// Click outside handler for closing date picker
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  // Close all dropdowns if clicking outside any dropdown container
  if (!target.closest('.relative')) {
    closeAllDropdowns()
  }
}
// Watch for commission settings changes in localStorage
const handleStorageChange = (event: StorageEvent) => {
  // Commission settings are handled by the store
}

// Listen for custom commission settings update event
const handleCommissionSettingsUpdate = (event: CustomEvent) => {
  // Commission settings are handled by the store
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Commission settings are handled by the store
  fetchPayments()
  fetchLocations()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Fetch payments data
const fetchPayments = async () => {
  try {
    const response = await paymentApi.getAllPayments()
    if (response.success && response.data) {
      payments.value = response.data.map((item: any) => {
        // Split payment_date into date and time
        let date = '', time = ''
        if (item.payment_date) {
          const [d, t] = item.payment_date.split(' ')
          date = d
          time = t || ''
        }
        return {
          id: item.booking_id,
          bookingId: item.booking_id,
          customerName: `${item.first_name} ${item.last_name}`,
          customerEmail: item.email || '',
          productName: item.product_name || '',
          productType: item.product_type || '',
          locationName: item.location_name || '',
          baseAmount: item.base_amount || 0,
          additionalFacilities: item.additional_facilities || [],
          totalAmount: item.total_price || 0,
          status: item.status || '',
          date,
          time,
          SquareHubCommission: item.squarehub_commission || 0,
          ceylincoCommission: item.celynco_commission || 0
        }
      })
    } else {
      console.error('Failed to fetch payments:', response.message)
    }
  } catch (error) {
    console.error('Error fetching payments:', error)
  }
}

// Fetch locations data
const fetchLocations = async () => {
  try {
    const response = await locationApi.getAllLocations()
    if (response.success && response.data) {
      locations.value = response.data
    } else {
      console.error('Failed to fetch locations:', response.message)
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
  }
}

// Sorting
const sortBy = ref('date')
const sortOrder = ref('desc')

// Dropdown states for rotating arrows
const dropdownStates = ref({
  product: false,
  location: false,
  sortBy: false
})

// Dropdown options
const productOptions = [
  { value: '', label: 'All Products' },
  { value: 'meeting-room', label: 'Meeting Room' },
  { value: 'hot-desk', label: 'Hot Desk' },
  { value: 'dedicated-desk', label: 'Dedicated Desk' }
]

const locationOptions = computed(() => {
  const options = [{ value: '', label: 'All Locations' }]
  locations.value.forEach(location => {
    options.push({
      value: location.id,
      label: location.name
    })
  })
  return options
})

const sortByOptions = [
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'booking', label: 'Booking ID' },
  { value: 'commission', label: 'Commission' }
]

// Commission settings from store
const commissionSettings = computed(() => commissionStore.commissionSettings)

// Calculate commission for a given amount
const calculateCommission = (amount: number, rate: number) => {
  return Math.round((amount * rate / 100) * 100) / 100 // Round to 2 decimal places
}

// Payments data (to be populated from API)
const payments = ref<Payment[]>([])

// Locations data (to be populated from API)
const locations = ref<any[]>([])

// Computed payments with dynamic commission calculation
const paymentsWithCommission = computed(() => {
  return payments.value.map(payment => ({
    ...payment,
    SquareHubCommission: calculateCommission(payment.totalAmount, commissionSettings.value.SquareHubRate),
    SquareHubRate: commissionSettings.value.SquareHubRate,
    ceylincoCommission: calculateCommission(payment.totalAmount, commissionSettings.value.ceylincoRate),
    ceylincoRate: commissionSettings.value.ceylincoRate,
    totalCommission: calculateCommission(payment.totalAmount, commissionSettings.value.SquareHubRate) + calculateCommission(payment.totalAmount, commissionSettings.value.ceylincoRate)
  }))
})

// Computed properties
const filteredPayments = computed(() => {
  let filtered = paymentsWithCommission.value

  // Apply date filters
  if (filters.value.dateFrom) {
    filtered = filtered.filter(payment => payment.date >= filters.value.dateFrom)
  }
  if (filters.value.dateTo) {
    filtered = filtered.filter(payment => payment.date <= filters.value.dateTo)
  }

  // Apply product filter
  if (filters.value.product) {
    const productMap: Record<string, string[]> = {
      'meeting-room': ['Meeting Room'],
      'hot-desk': ['Hot Desk'],
      'dedicated-desk': ['Dedicated Desk']
    }
    filtered = filtered.filter(payment =>
      productMap[filters.value.product]?.includes(payment.productType)
    )
  }

  // Apply location filter
  if (filters.value.location) {
    const selectedLocation = locations.value.find(location => location.id === filters.value.location)
    if (selectedLocation) {
      filtered = filtered.filter(payment =>
        payment.locationName === selectedLocation.name
      )
    }
  }

  return filtered
})

const sortedPayments = computed(() => {
  const sorted = [...filteredPayments.value]

  sorted.sort((a, b) => {
    let aVal, bVal

    switch (sortBy.value) {
      case 'date':
        aVal = new Date(a.date).getTime()
        bVal = new Date(b.date).getTime()
        break
      case 'amount':
        aVal = a.totalAmount
        bVal = b.totalAmount
        break
      case 'booking':
        aVal = a.bookingId
        bVal = b.bookingId
        break
      case 'commission':
        aVal = a.SquareHubCommission
        bVal = b.SquareHubCommission
        break
      default:
        aVal = a.date
        bVal = b.date
    }

    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return sorted
})

// Methods
// const formatDate = (dateString: string) => {
//   const date = new Date(dateString)
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   })
// }

const resetFilters = () => {
  filters.value = {
    dateFrom: '',
    dateTo: '',
    product: '',
    location: ''
  }
  dateRange.value = {
    startDate: '',
    endDate: ''
  }
  sortBy.value = 'date'
  sortOrder.value = 'desc'
}

// Dropdown control functions
const toggleDropdown = (dropdownName: string) => {
  // Close all dropdowns first
  closeAllDropdowns()
  // Then open the clicked dropdown
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = true
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

// Dropdown label functions
const getProductLabel = (value: string) => {
  const option = productOptions.find(opt => opt.value === value)
  return option ? option.label : 'All Products'
}

const getLocationLabel = (value: string) => {
  const option = locationOptions.value.find((opt: { value: string; label: string }) => opt.value === value)
  return option ? option.label : 'All Locations'
}

const getSortByLabel = (value: string) => {
  const option = sortByOptions.find(opt => opt.value === value)
  return option ? option.label : 'Date'
}

// Dropdown select functions
const selectProduct = (value: string) => {
  filters.value.product = value
  closeAllDropdowns()
}

const selectLocation = (value: string) => {
  filters.value.location = value
  closeAllDropdowns()
}

const selectSortBy = (value: string) => {
  sortBy.value = value
  closeAllDropdowns()
}

const exportToCSV = () => {
  // Fallback CSV export (no xlsx dependency)
  const rows = filteredPayments.value.map(payment => ({
    bookingId: payment.bookingId,
    location: payment.locationName,
    customerName: payment.customerName,
    customerEmail: payment.customerEmail,
    totalAmount: payment.totalAmount,
    SquareHubCommission: payment.SquareHubCommission,
    SquareHubRate: payment.SquareHubRate,
    ceylincoCommission: payment.ceylincoCommission,
    ceylincoRate: payment.ceylincoRate,
    date: payment.date,
    time: payment.time
  }))

  if (!rows.length) {
    alert('No payments to export')
    return
  }

  const header = Object.keys(rows[0]).join(',')
  const csv = [header]
    .concat(rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'payments.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const navigateToPaymentDetail = (paymentId: string) => {
  // Navigate to the payment detail page
  router.push(`/payments/${paymentId}`)
}
</script>