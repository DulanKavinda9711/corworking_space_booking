<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
  <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2 md:sticky md:top-0 z-50">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiWallet" />
            </svg>
            <span class="text-sm font-medium text-green-700">
              Total Payments:
              <span class="font-bold text-green-800">{{ filteredPayments.length }}</span>
            </span>
          </div>
        <div class="flex items-center space-x-3">
          <button
            @click="exportToCSV"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            @click="goToCommissionSetup"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiCog" />
            </svg>
            <span>Commission Setup</span>
          </button>
        </div>
      </div>

      <!-- Filters: All in one row on desktop -->
      

      <!-- Payments Table -->
       <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="bg-white shadow-card p-6 border-b">
        <div class="flex flex-col md:flex-row md:items-end md:space-x-1 gap-4 relative">
          <div class="relative md:w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input
              type="text"
              v-model="dateRangeDisplay"
              @click="showDatePicker = !showDatePicker"
              readonly
              class="date-input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 cursor-pointer"
              placeholder="Select Date"
            />
            <!-- Booking.com Style Date Range Picker -->
            <div v-if="showDatePicker" class="date-picker-container absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-gray-900">
              <div class="flex justify-between items-center mb-4">
                <button @click="previousMonth" class="p-1 hover:bg-gray-100 rounded">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </button>
                <span class="font-medium">{{ currentMonthYear }}</span>
                <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </button>
              </div>
              <!-- Calendar Grid -->
              <div class="grid grid-cols-7 gap-1 mb-2">
                <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="text-xs font-medium text-gray-500 text-center py-2">
                  {{ day }}
                </div>
              </div>
              <div class="grid grid-cols-7 gap-1">
                <div
                  v-for="date in calendarDates"
                  :key="date.dateString"
                  @click="selectDate(date)"
                  :class="[
                    'text-sm text-center py-2 cursor-pointer rounded',
                    !date.isCurrentMonth ? 'text-gray-300' : 'text-gray-900',
                    isDateSelected(date) ? 'bg-primary-600 text-white' : '',
                    isDateInRange(date) ? 'bg-primary-100' : '',
                    'hover:bg-primary-50'
                  ]"
                >
                  {{ date.day }}
                </div>
              </div>
              <div class="flex justify-end items-end mt-4 pt-4 border-t border-gray-200">
                <div class="flex space-x-2">
                  <button
                    @click="clearDateRange"
                    class="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    @click="showDatePicker = false"
                    :disabled="!filters.dateFrom"
                    class="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="md:w-40">
            <label class="block text-sm font-medium text-gray-700 mb-2">Product</label>
            <div class="relative">
              <select 
                v-model="filters.product" 
                @focus="toggleDropdown('product')"
                @blur="closeDropdown('product')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">All Products</option>
                <option value="meeting-room">Meeting Room</option>
                <option value="hot-desk">Hot Desk</option>
                <option value="private-office">Private Office</option>
                <option value="event-space">Event Space</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.product ? 'transform rotate-180' : ''
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
          <div class="md:w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div class="relative">
              <select 
                v-model="filters.location" 
                @focus="toggleDropdown('location')"
                @blur="closeDropdown('location')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">All Locations</option>
                <option value="main-branch">Main Branch - Downtown</option>
                <option value="tech-hub">Tech Hub - Silicon Valley</option>
                <option value="creative-quarter">Creative Quarter</option>
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
          <div class="md:w-40">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative">
              <select 
                v-model="filters.status" 
                @focus="toggleDropdown('status')"
                @blur="closeDropdown('status')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending (Subscription)</option>
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
          <div class="md:w-40">
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div class="relative">
              <select 
                v-model="sortBy" 
                @focus="toggleDropdown('sortBy')"
                @blur="closeDropdown('sortBy')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 appearance-none cursor-pointer"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="booking">Booking ID</option>
                <option value="commission">Commission</option>
                <option value="subscriptions">Subscriptions</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.sortBy ? 'transform rotate-180' : ''
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
          <div class="flex items-end md:absolute md:right-0 md:top-6">
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
                  Booking ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Additional Facilities
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PayMedia Commission
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="payment in sortedPayments" 
                :key="payment.id" 
                @click="navigateToPaymentDetail(payment.id)"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ payment.bookingId }}</div>
                 
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
              
                  <div class="text-sm text-gray-500">{{ payment.productType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="payment.additionalFacilities.length > 0" class="space-y-1">
                    <div v-for="facility in payment.additionalFacilities" :key="facility.name" class="text-sm">
                      <span class="text-gray-900">{{ facility.name }}</span>
                    
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-500">No additional facilities</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">${{ payment.totalAmount }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-blue-600">${{ payment.payMediaCommission }}</div>
                  <div class="text-sm text-gray-500">{{ payment.payMediaRate }}%</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(payment.status)"
                  >
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">{{ payment.date }}</div>
                  <div class="text-sm text-gray-500">{{ payment.time }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPayments.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
          <p class="mt-1 text-sm text-gray-500">No payments match the current filters.</p>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  mdiCog, 
  mdiMapMarker, 
  mdiEye,
  mdiWallet
} from '@mdi/js'

const router = useRouter()

// State
const showDatePicker = ref(false)
const currentDate = ref(new Date())

// Filters
const filters = ref({
  dateFrom: '', // startDate
  dateTo: '',   // endDate
  product: '',
  location: '',
  status: ''
})

// Computed property for date range display
const dateRangeDisplay = computed(() => {
  if (filters.value.dateFrom && filters.value.dateTo) {
    const startParts = filters.value.dateFrom.split('-')
    const endParts = filters.value.dateTo.split('-')
    const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]))
    const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]))
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  } else if (filters.value.dateFrom) {
    const startParts = filters.value.dateFrom.split('-')
    const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]))
    return `${startDate.toLocaleDateString()}`
  }
  return ''
})

// Calendar computed properties
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startCalendar = new Date(firstDay)
  startCalendar.setDate(startCalendar.getDate() - firstDay.getDay())
  const dates = []
  const current = new Date(startCalendar)
  for (let i = 0; i < 42; i++) {
    const currentDateObj = new Date(current)
    const year = currentDateObj.getFullYear()
    const monthStr = (currentDateObj.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDateObj.getDate().toString().padStart(2, '0')
    const dateString = `${year}-${monthStr}-${day}`
    dates.push({
      day: currentDateObj.getDate(),
      dateString: dateString,
      isCurrentMonth: currentDateObj.getMonth() === month,
      date: currentDateObj
    })
    current.setDate(current.getDate() + 1)
  }
  return dates
})

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDate = (date: any) => {
  if (!date.isCurrentMonth) return
  const selectedDate = date.dateString
  if (!filters.value.dateFrom || (filters.value.dateFrom && filters.value.dateTo)) {
    filters.value.dateFrom = selectedDate
    filters.value.dateTo = ''
  } else if (filters.value.dateFrom && !filters.value.dateTo) {
    if (selectedDate >= filters.value.dateFrom) {
      filters.value.dateTo = selectedDate
    } else {
      filters.value.dateTo = filters.value.dateFrom
      filters.value.dateFrom = selectedDate
    }
  }
}

const isDateSelected = (date: any) => {
  return date.dateString === filters.value.dateFrom || date.dateString === filters.value.dateTo
}
const isDateInRange = (date: any) => {
  if (!filters.value.dateFrom || !filters.value.dateTo) return false
  const dateString = date.dateString
  return dateString > filters.value.dateFrom && dateString < filters.value.dateTo
}
const clearDateRange = () => {
  filters.value.dateFrom = ''
  filters.value.dateTo = ''
}

// Click outside handler for closing date picker
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const datePickerContainer = target.closest('.date-picker-container')
  const dateInput = target.closest('.date-input')
  if (!datePickerContainer && !dateInput && showDatePicker.value) {
    showDatePicker.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Sorting
const sortBy = ref('date')
const sortOrder = ref('desc')

// Dropdown states for rotating arrows
const dropdownStates = ref({
  product: false,
  location: false,
  status: false,
  sortBy: false
})

// Sample payments data with new commission structure
const payments = ref([
  {
    id: 'PAY-001',
    bookingId: 'BR-2034',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    productName: 'Executive Board Room',
    productType: 'Meeting Room',
    locationName: 'Main Branch - Downtown',
    baseAmount: 120,
    additionalFacilities: [
      { name: 'Projector', price: 20 },
      { name: 'Catering', price: 10 }
    ],
    totalAmount: 150,
    // Updated commission structure
    payMediaCommission: 75.00,
    payMediaRate: 50.0,
    ceylincoCommission: 75.00,
    ceylincoRate: 50.0,
    totalCommission: 150.00,
    status: 'paid',
    date: '2025-08-15',
    time: '10:30 AM'
  },
  {
    id: 'PAY-002',
    bookingId: 'BR-2033',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    productName: 'Hot Desk Area',
    productType: 'Hot Desk',
    locationName: 'Tech Hub - Silicon Valley',
    baseAmount: 50,
    additionalFacilities: [
      { name: 'Monitor', price: 10 }
    ],
    totalAmount: 60,
    // Updated commission structure
    payMediaCommission: 30.00,
    payMediaRate: 50.0,
    ceylincoCommission: 30.00,
    ceylincoRate: 50.0,
    totalCommission: 60.00,
    status: 'paid',
    date: '2025-08-15',
    time: '2:15 PM'
  },
  {
    id: 'PAY-003',
    bookingId: 'BR-2032',
    customerName: 'Mike Johnson',
    customerEmail: 'mike.johnson@example.com',
    productName: 'Private Office Suite',
    productType: 'Private Office',
    locationName: 'Main Branch - Downtown',
    baseAmount: 350,
    additionalFacilities: [
      { name: 'Printer Access', price: 25 },
      { name: 'Phone Line', price: 25 }
    ],
    totalAmount: 400,
    // Updated commission structure
    payMediaCommission: 200.00,
    payMediaRate: 50.0,
    ceylincoCommission: 200.00,
    ceylincoRate: 50.0,
    totalCommission: 400.00,
    status: 'pending',
    date: '2025-08-14',
    time: '9:45 AM'
  },
  {
    id: 'PAY-004',
    bookingId: 'BR-2031',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    productName: 'Meeting Room Small',
    productType: 'Meeting Room',
    locationName: 'Creative Quarter',
    baseAmount: 50,
    additionalFacilities: [],
    totalAmount: 50,
    // Updated commission structure
    payMediaCommission: 25.00,
    payMediaRate: 50.0,
    ceylincoCommission: 25.00,
    ceylincoRate: 50.0,
    totalCommission: 50.00,
    status: 'paid',
    date: '2025-08-14',
    time: '3:20 PM'
  },
  {
    id: 'PAY-005',
    bookingId: 'BR-2030',
    customerName: 'Robert Davis',
    customerEmail: 'robert.davis@example.com',
    productName: 'Conference Room',
    productType: 'Meeting Room',
    locationName: 'Tech Hub - Silicon Valley',
    baseAmount: 150,
    additionalFacilities: [
      { name: 'Video Conference', price: 30 }
    ],
    totalAmount: 180,
    // Updated commission structure
    payMediaCommission: 90.00,
    payMediaRate: 50.0,
    ceylincoCommission: 90.00,
    ceylincoRate: 50.0,
    totalCommission: 180.00,
    status: 'pending',
    date: '2025-08-13',
    time: '11:00 AM'
  }
])

// Computed properties
const filteredPayments = computed(() => {
  let filtered = payments.value

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
      'private-office': ['Private Office'],
      'event-space': ['Event Space']
    }
    filtered = filtered.filter(payment => 
      productMap[filters.value.product]?.includes(payment.productType)
    )
  }

  // Apply location filter
  if (filters.value.location) {
    const locationMap: Record<string, string> = {
      'main-branch': 'Main Branch - Downtown',
      'tech-hub': 'Tech Hub - Silicon Valley',
      'creative-quarter': 'Creative Quarter'
    }
    filtered = filtered.filter(payment => 
      payment.locationName === locationMap[filters.value.location]
    )
  }

  // Apply status filter
  if (filters.value.status) {
    filtered = filtered.filter(payment => payment.status === filters.value.status)
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
        aVal = a.payMediaCommission
        bVal = b.payMediaCommission
        break
      case 'subscriptions':
        aVal = a.status === 'pending' ? 1 : 0
        bVal = b.status === 'pending' ? 1 : 0
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
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const resetFilters = () => {
  filters.value = {
    dateFrom: '',
    dateTo: '',
    product: '',
    location: '',
    status: ''
  }
  sortBy.value = 'date'
  sortOrder.value = 'desc'
}

// Dropdown control functions
const toggleDropdown = (dropdown: string) => {
  dropdownStates.value[dropdown as keyof typeof dropdownStates.value] = true
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

const exportToCSV = () => {
  // Fallback CSV export (no xlsx dependency)
  const rows = filteredPayments.value.map(payment => ({
    bookingId: payment.bookingId,
    location: payment.locationName,
    product: payment.productType,
    additionalFacilities: payment.additionalFacilities.map((f: any) => f.name).join('; '),
    totalAmount: payment.totalAmount,
    payMediaCommission: payment.payMediaCommission,
    payMediaRate: payment.payMediaRate,
    status: payment.status,
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

const goToCommissionSetup = () => {
  // Navigate to the commission setup page
  router.push('/payments/commission-setup')
}

const navigateToPaymentDetail = (paymentId: string) => {
  // Navigate to the payment detail page
  router.push(`/payments/${paymentId}`)
}
</script>