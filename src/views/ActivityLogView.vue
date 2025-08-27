<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2 flex items-center space-x-2 md:sticky md:top-0 z-50">
            <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiHistory" />
            </svg>
            <span class="text-sm font-medium text-primary-700">
              Total Activities:
              <span class="font-bold text-primary-800">{{ activities.length }}</span>
            </span>
          </div>
        
        <div class="flex items-center space-x-3">
          <button
            @click="exportActivityLog"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiDownload" />
            </svg>
            <span>Export Log</span>
          </button>
          <button
            @click="refreshLog"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiRefresh" />
            </svg>
            <span>Refresh</span>
          </button>
          
        </div>
      </div>


      <!-- Filters -->
            <!-- Filters -->
      

      <!-- Activity Log Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <!-- <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">All Activities ({{ filteredActivities.length }})</h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Auto-refresh:</span>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="autoRefresh"
                @change="toggleAutoRefresh"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">On</span>
            </label>
          </div>
        </div> -->
        <div class="overflow-x-auto">
          <div class="bg-white border-b shadow-card p-6">
        <div class="flex flex-col  md:flex-row md:items-end md:space-x-4 gap-4 relative">
          <div class="relative md:w-64">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Activities</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by user, action, or description..."
                v-model="searchQuery"
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
              />
            </div>
          </div>
          <div class="md:w-40">
            <label class="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
            <select v-model="filters.activityType" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
              <option value="">All Types</option>
              <option value="user">User Action</option>
              <option value="booking">Booking</option>
              <option value="payment">Payment</option>
              <option value="system">System</option>
              <option value="security">Security</option>
              <option value="audit">Audit</option>
            </select>
          </div>
          <div class="md:w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">User</label>
            <select v-model="filters.user" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
              <option value="">All Users</option>
              <option value="john.admin">John Administrator</option>
              <option value="sarah.manager">Sarah Manager</option>
              <option value="mike.operator">Mike Operator</option>
              <option value="system">System</option>
            </select>
          </div>
          <div class="relative md:w-64">
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
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="activity in paginatedActivities" :key="activity.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDateTime(activity.timestamp) }}</div>
                  <div class="text-sm text-gray-500">{{ getTimeAgo(activity.timestamp) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <img v-if="activity.userAvatar" class="h-8 w-8 rounded-full object-cover" :src="activity.userAvatar" :alt="activity.user">
                      <div v-else class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="activity.activityType === 'system' ? mdiCog : mdiAccount" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ activity.user }}</div>
                      <div class="text-sm text-gray-500">{{ activity.userRole }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getActivityTypeClass(activity.activityType)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ formatActivityType(activity.activityType) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ activity.action }}</div>
                  <div class="text-sm text-gray-500">{{ activity.module }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">{{ activity.details }}</div>
                  <div v-if="activity.resourceId" class="text-sm text-gray-500">ID: {{ activity.resourceId }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 font-mono">{{ activity.ipAddress }}</div>
                  <div class="text-sm text-gray-500">{{ activity.userAgent }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(activity.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ activity.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
                  Showing {{ startItem }} to {{ endItem }} of {{ filteredActivities.length }} results
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
                    @click="goToPage(page)"
                    :class="[
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                    ]"
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
        <div v-if="filteredActivities.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
          <p class="mt-1 text-sm text-gray-500">No activities match the current search and filters.</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  mdiDownload,
  mdiRefresh,
  mdiAccount,
  mdiCog,
  mdiHistory
} from '@mdi/js'

// State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 20
const autoRefresh = ref(false)
const refreshInterval = ref<ReturnType<typeof setTimeout> | null>(null)
const showDatePicker = ref(false)
const currentDate = ref(new Date())

// Filters
const filters = ref({
  activityType: '',
  user: '',
  dateFrom: '',
  dateTo: ''
})


// Sample activity data
const activities = ref([
  {
    id: 'ACT-001',
    timestamp: '2024-08-15T14:30:25Z',
    user: 'John Administrator',
    userRole: 'Super Admin',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces',
    activityType: 'user',
    action: 'User Created',
    module: 'User Management',
    details: 'Created new user account for Emma Support with Operator role',
    resourceId: 'USR-005',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/91.0',
    status: 'success'
  },
  {
    id: 'ACT-002',
    timestamp: '2024-08-15T14:28:15Z',
    user: 'Sarah Manager',
    userRole: 'Admin',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c2?w=50&h=50&fit=crop&crop=faces',
    activityType: 'booking',
    action: 'Booking Cancelled',
    module: 'Booking Management',
    details: 'Cancelled booking BR-2031 for Meeting Room Small due to customer request',
    resourceId: 'BR-2031',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox/89.0',
    status: 'success'
  },
  {
    id: 'ACT-003',
    timestamp: '2024-08-15T14:25:10Z',
    user: 'System',
    userRole: 'System',
    userAvatar: null,
    activityType: 'payment',
    action: 'Payment Processed',
    module: 'Payment System',
    details: 'Payment of $150.00 processed successfully for booking BR-2034',
    resourceId: 'PAY-001',
    ipAddress: '10.0.0.1',
    userAgent: 'System/1.0',
    status: 'success'
  },
  {
    id: 'ACT-004',
    timestamp: '2024-08-15T14:22:45Z',
    user: 'Mike Operator',
    userRole: 'Manager',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=faces',
    activityType: 'user',
    action: 'Customer Profile Updated',
    module: 'Customer Management',
    details: 'Updated contact information for customer John Doe',
    resourceId: 'CU-001',
    ipAddress: '192.168.1.102',
    userAgent: 'Safari/14.1',
    status: 'success'
  },
  {
    id: 'ACT-005',
    timestamp: '2024-08-15T14:20:30Z',
    user: 'John Administrator',
    userRole: 'Super Admin',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces',
    activityType: 'system',
    action: 'Commission Rate Updated',
    module: 'System Settings',
    details: 'Updated commission rate for Main Branch from 10% to 12.5%',
    resourceId: 'LC-001',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/91.0',
    status: 'success'
  },
  {
    id: 'ACT-006',
    timestamp: '2024-08-15T14:18:20Z',
    user: 'System',
    userRole: 'System',
    userAvatar: null,
    activityType: 'security',
    action: 'Failed Login Attempt',
    module: 'Authentication',
    details: 'Multiple failed login attempts detected for user admin@example.com',
    resourceId: null,
    ipAddress: '203.0.113.45',
    userAgent: 'Unknown',
    status: 'warning'
  },
  {
    id: 'ACT-007',
    timestamp: '2024-08-15T14:15:55Z',
    user: 'Sarah Manager',
    userRole: 'Admin',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c2?w=50&h=50&fit=crop&crop=faces',
    activityType: 'booking',
    action: 'New Booking Created',
    module: 'Booking Management',
    details: 'Created new booking BR-2035 for Executive Board Room',
    resourceId: 'BR-2035',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox/89.0',
    status: 'success'
  },
  {
    id: 'ACT-008',
    timestamp: '2024-08-15T14:12:40Z',
    user: 'Mike Operator',
    userRole: 'Manager',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=faces',
    activityType: 'user',
    action: 'Customer Account Blocked',
    module: 'Customer Management',
    details: 'Blocked customer account for Sarah Wilson due to policy violation',
    resourceId: 'CU-004',
    ipAddress: '192.168.1.102',
    userAgent: 'Safari/14.1',
    status: 'warning'
  },
  {
    id: 'ACT-009',
    timestamp: '2024-08-15T14:10:15Z',
    user: 'System',
    userRole: 'System',
    userAvatar: null,
    activityType: 'audit',
    action: 'Data Export',
    module: 'Reports',
    details: 'Generated and exported transaction report for August 2024',
    resourceId: 'RPT-001',
    ipAddress: '10.0.0.1',
    userAgent: 'System/1.0',
    status: 'success'
  },
  {
    id: 'ACT-010',
    timestamp: '2024-08-15T14:08:30Z',
    user: 'John Administrator',
    userRole: 'Super Admin',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces',
    activityType: 'system',
    action: 'Backup Completed',
    module: 'System Maintenance',
    details: 'Daily database backup completed successfully',
    resourceId: null,
    ipAddress: '10.0.0.1',
    userAgent: 'System/1.0',
    status: 'success'
  }
])

// Computed properties
const filteredActivities = computed(() => {
  let filtered = activities.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(activity =>
      activity.user.toLowerCase().includes(query) ||
      activity.action.toLowerCase().includes(query) ||
      activity.details.toLowerCase().includes(query) ||
      activity.module.toLowerCase().includes(query)
    )
  }

  // Apply activity type filter
  if (filters.value.activityType) {
    filtered = filtered.filter(activity => activity.activityType === filters.value.activityType)
  }

  // Apply user filter
  if (filters.value.user) {
    filtered = filtered.filter(activity => activity.user.includes(filters.value.user))
  }

  // Apply date filter
  if (filters.value.dateFrom) {
    filtered = filtered.filter(activity => activity.timestamp >= filters.value.dateFrom + 'T00:00:00Z')
  }
  if (filters.value.dateTo) {
    filtered = filtered.filter(activity => activity.timestamp <= filters.value.dateTo + 'T23:59:59Z')
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

const totalPages = computed(() => Math.ceil(filteredActivities.value.length / itemsPerPage))

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredActivities.value.slice(start, end)
})

const startItem = computed(() => {
  return filteredActivities.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredActivities.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const totalPagesCount = totalPages.value
  const current = currentPage.value
  
  for (let i = Math.max(1, current - 2); i <= Math.min(totalPagesCount, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
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

// Methods
const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes === 1) return '1 minute ago'
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours === 1) return '1 hour ago'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return '1 day ago'
  return `${diffInDays} days ago`
}

const getActivityTypeClass = (type: string) => {
  switch (type) {
    case 'user':
      return 'bg-blue-100 text-blue-800'
    case 'booking':
      return 'bg-green-100 text-green-800'
    case 'payment':
      return 'bg-purple-100 text-purple-800'
    case 'system':
      return 'bg-orange-100 text-orange-800'
    case 'security':
      return 'bg-red-100 text-red-800'
    case 'audit':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatActivityType = (type: string) => {
  const typeMap: Record<string, string> = {
    'user': 'User Action',
    'booking': 'Booking',
    'payment': 'Payment',
    'system': 'System',
    'security': 'Security',
    'audit': 'Audit'
  }
  return typeMap[type] || type
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    activityType: '',
    user: '',
    dateFrom: '',
    dateTo: ''
  }
  currentPage.value = 1
}

const exportActivityLog = () => {
  // In a real app, this would generate and download an activity log file
  alert('Activity log export started. The file will be downloaded shortly.')
}

const refreshLog = () => {
  // In a real app, this would fetch the latest activities from the server
  console.log('Refreshing activity log...')
  alert('Activity log refreshed successfully!')
}

const toggleAutoRefresh = () => {
  if (autoRefresh.value) {
    refreshInterval.value = setInterval(refreshLog, 30000) // Refresh every 30 seconds
  } else {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
  }
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
  currentPage.value = page
}

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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
  document.removeEventListener('click', handleClickOutside)
})

// Click outside handler for closing date picker
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const datePickerContainer = target.closest('.date-picker-container')
  const dateInput = target.closest('.date-input')
  if (!datePickerContainer && !dateInput && showDatePicker.value) {
    showDatePicker.value = false
  }
}
</script>
