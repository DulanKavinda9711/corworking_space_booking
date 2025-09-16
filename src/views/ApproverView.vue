<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
            </svg>
            <span class="text-sm font-medium text-green-700">
              Pending Approvals:
              <span class="font-bold text-green-800">{{ filteredRequests.length }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      

      <!-- Approvals Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden border-gray-200">
        <div class="bg-white  p-6 border-b sticky top-0 z-30">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Customers</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search by name, email, or phone..." v-model="searchQuery"
                class="w-full h-10 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div class="relative">
              <input
                type="text"
                v-model="dateRangeDisplay"
                @click.stop="showDatePicker = !showDatePicker"
                readonly
                class="date-input w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer"
                placeholder="Select Date"
              />
              <!-- Date Range Picker -->
              <div v-if="showDatePicker" @click.stop class="date-picker-container absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-gray-900">
              <div class="flex justify-between items-center mb-4">
                <button @click="previousMonth" class="p-1 hover:bg-green-100 rounded">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </button>
                <span class="font-medium">{{ currentMonthYear }}</span>
                <button @click="nextMonth" class="p-1 hover:bg-green-100 rounded">
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
                    isDateSelected(date) ? 'bg-green-600 text-white' : '',
                    isDateInRange(date) ? 'bg-green-100' : '',
                    'hover:bg-green-50'
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
                    class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
          <div class="flex items-end justify-end">
            <button
              @click="resetFilters"
              class="h-10 px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
        <div class="overflow-x-auto max-h-96 overflow-y-auto border b">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0 z-20">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested Date
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
              <tr v-for="request in paginatedRequests" :key="request.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ request.customerName }}</div>
                      <div class="text-sm text-gray-500">{{ request.customerEmail }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">LKR {{ request.rewardValue.toLocaleString() }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate" :title="request.reason">
                    {{ request.reason }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(request.requestedDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="approveRequest(request)"
                      :disabled="processingRequest === request.id"
                      class="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                      <svg v-if="processingRequest === request.id" class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{{ processingRequest === request.id ? 'Processing...' : 'Approve' }}</span>
                    </button>
                    <button
                      @click="rejectRequest(request)"
                      :disabled="processingRequest === request.id"
                      class="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                      <svg v-if="processingRequest === request.id" class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{{ processingRequest === request.id ? 'Processing...' : 'Reject' }}</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredRequests.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing {{ startItem }} to {{ endItem }} of {{ filteredRequests.length }} results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="typeof page === 'number' ? goToPage(page) : null"
                    :class="[
                      page === currentPage
                        ? 'z-10 bg-green-50 border-green-500 text-green-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                      typeof page === 'string' ? 'cursor-default' : 'cursor-pointer',
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                    ]"
                    :disabled="typeof page === 'string'"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredRequests.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
          <p class="mt-1 text-sm text-gray-500" v-if="searchQuery">No requests match your current filters.</p>
          <p class="mt-1 text-sm text-gray-500" v-else>All reward requests have been processed.</p>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeSuccessModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="flex-shrink-0">
              <svg class="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Success!</h3>
            <p class="text-sm text-gray-600">{{ successMessage }}</p>
          </div>
          <div class="mt-6 flex justify-center">
            <button @click="closeSuccessModal" class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeErrorModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="flex-shrink-0">
              <svg class="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Error!</h3>
            <p class="text-sm text-gray-600">{{ errorMessage }}</p>
          </div>
          <div class="mt-6 flex justify-center">
            <button @click="closeErrorModal" class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRewardsStore } from '@/stores/rewards'

// Use rewards store
const rewardsStore = useRewardsStore()

// State
const processingRequest = ref<string | null>(null)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const searchQuery = ref('')
const showDatePicker = ref(false)
const currentDate = ref(new Date())
const filters = ref({
  dateFrom: '',
  dateTo: ''
})
const dropdownStates = ref({})

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed properties
const pendingRequests = computed(() => rewardsStore.getPendingRequests())

const filteredRequests = computed(() => {
  let requests = pendingRequests.value

  // Filter by date range
  if (filters.value.dateFrom) {
    requests = requests.filter(request => request.requestedDate >= filters.value.dateFrom)
  }
  if (filters.value.dateTo) {
    requests = requests.filter(request => request.requestedDate <= filters.value.dateTo)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    requests = requests.filter(request =>
      request.customerName.toLowerCase().includes(query) ||
      request.customerEmail.toLowerCase().includes(query)
    )
  }

  return requests
})

// Date picker computed properties
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

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredRequests.value.length / itemsPerPage.value))

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRequests.value.slice(start, end)
})

const startItem = computed(() => {
  if (filteredRequests.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return Math.min(end, filteredRequests.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Date picker methods
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

  // Use setTimeout to allow the click event to process first
  setTimeout(() => {
    if (!datePickerContainer && !dateInput && showDatePicker.value) {
      showDatePicker.value = false
    }
  }, 10)
}



const resetFilters = () => {
  searchQuery.value = ''
  filters.value.dateFrom = ''
  filters.value.dateTo = ''
  currentPage.value = 1 // Reset to first page when filters change
}

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const approveRequest = async (request: any) => {
  processingRequest.value = request.id

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const success = rewardsStore.approveRewardRequest(request.id, 'Admin Approver')
    if (success) {
      successMessage.value = `Reward request for ${request.customerName} has been approved successfully. LKR ${request.rewardValue.toLocaleString()} has been added to their rewards.`
      showSuccessModal.value = true
    } else {
      throw new Error('Failed to approve request')
    }
  } catch (error) {
    console.error('Error approving request:', error)
    errorMessage.value = 'Failed to approve the reward request. Please try again.'
    showErrorModal.value = true
  } finally {
    processingRequest.value = null
  }
}

const rejectRequest = async (request: any) => {
  processingRequest.value = request.id

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const success = rewardsStore.rejectRewardRequest(request.id, 'Admin Approver')
    if (success) {
      successMessage.value = `Reward request for ${request.customerName} has been rejected.`
      showSuccessModal.value = true
    } else {
      throw new Error('Failed to reject request')
    }
  } catch (error) {
    console.error('Error rejecting request:', error)
    errorMessage.value = 'Failed to reject the reward request. Please try again.'
    showErrorModal.value = true
  } finally {
    processingRequest.value = null
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  successMessage.value = ''
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

onMounted(() => {
  // Initialize rewards store
  rewardsStore.initializeRewards()

  // Add click outside listener for date picker
  document.addEventListener('click', handleClickOutside)
})

// Watchers to reset page when filters change
watch(searchQuery, () => {
  currentPage.value = 1
})

watch(() => filters.value, () => {
  currentPage.value = 1
}, { deep: true })

onUnmounted(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
})
</script>