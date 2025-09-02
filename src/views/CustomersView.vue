<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiAccount" />
            </svg>
            <span class="text-sm font-medium text-green-700">
              Total Customers:
              <span class="font-bold text-green-800">{{ filteredCustomers.length }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      

      <!-- Customers Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden border-gray-200">
        <div class="bg-white  shadow-card p-6 border-b">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Customers</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search by name, email, or phone..." v-model="searchQuery"
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="filters.status"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div class="flex items-end justify-end">
            <button @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600">
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
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Bookings
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
              <tr v-for="customer in paginatedCustomers" :key="customer.id" 
                  class="hover:bg-gray-50 cursor-pointer"
                  @click="viewCustomerDetails(customer.id)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="mdiAccount" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ customer.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ customer.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getCustomerTypeClass(customer.customerType)"
                    class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ customer.customerType }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ customer.totalBookings }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(customer.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ customer.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <button @click.stop="confirmToggleStatus(customer)"
                      :class="customer.status === 'blocked' 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-orange-600 hover:bg-orange-700 text-white'"
                      class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center justify-center space-x-1"
                      :title="customer.status === 'blocked' ? 'Unblock Customer' : 'Block Customer'">
                      <!-- <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="customer.status === 'blocked' ? mdiAccountCheck : mdiAccountCancel" />
                      </svg> -->
                      <span>{{ customer.status === 'blocked' ? 'Unblock' : 'Block' }}</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing {{ startItem }} to {{ endItem }} of {{ filteredCustomers.length }} results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button @click="previousPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                    page === currentPage
                      ? 'z-10 bg-green-50 border-green-500 text-green-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]">
                    {{ page }}
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredCustomers.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p class="mt-1 text-sm text-gray-500">No customers match the current filters.</p>
        </div>
      </div>
    </div>

    <!-- Status Toggle Confirmation Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full" :class="customerToToggle?.status === 'blocked' ? 'bg-green-100' : 'bg-orange-100'">
            <svg class="w-6 h-6" :class="customerToToggle?.status === 'blocked' ? 'text-green-600' : 'text-orange-600'" fill="currentColor" viewBox="0 0 24 24">
              <path :d="customerToToggle?.status === 'blocked' ? mdiAccountCheck : mdiAccountCancel" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">
            {{ customerToToggle?.status === 'blocked' ? 'Unblock' : 'Block' }} Customer
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to {{ customerToToggle?.status === 'blocked' ? 'unblock' : 'block' }} this customer?
            </p>
                <div v-if="customerToToggle" class="mt-4 p-3 bg-gray-50 rounded-lg">
              <div class="text-sm space-y-1">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiAccount" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ customerToToggle.name }}</div>
                    <div class="text-gray-500">{{ customerToToggle.email }}</div>
                    <div class="text-gray-500">{{ customerToToggle.phone }}</div>
                    <div class="text-gray-500">Total Bookings: {{ customerToToggle.totalBookings }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="customerToToggle?.status !== 'blocked'" class="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
              <p class="text-xs text-orange-700">
                <strong>Note:</strong> Blocking will prevent the customer from making new bookings and accessing their account.
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeStatusModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmToggleCustomerStatus"
              :disabled="isProcessing"
              class="px-4 py-2 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              :class="customerToToggle?.status === 'blocked' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'"
            >
              <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isProcessing ? 'Processing...' : (customerToToggle?.status === 'blocked' ? 'Unblock' : 'Block') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useCustomers } from '@/composables/useCustomers'
import { mdiAccount, mdiEye, mdiAccountCheck, mdiAccountCancel, mdiKeyVariant } from '@mdi/js'

// Use router for navigation
const router = useRouter()

// Use shared customers data
const { customers, toggleCustomerStatus: toggleStatus, loadPersistedStatuses } = useCustomers()

// State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Modal state
const showStatusModal = ref(false)
const customerToToggle = ref<any>(null)
const isProcessing = ref(false)

// Filters
const filters = ref({
  status: ''
})

// Computed properties
const filteredCustomers = computed(() => {
  // Start with only registered customers
  let filtered = customers.value.filter(customer => customer.customerType === 'registered')

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    )
  }

  // Apply status filter
  if (filters.value.status) {
    filtered = filtered.filter(customer => customer.status === filters.value.status)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / itemsPerPage))

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCustomers.value.slice(start, end)
})

const startItem = computed(() => {
  return filteredCustomers.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredCustomers.value.length)
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

// Methods
const getCustomerTypeClass = (type: string) => {
  return type === 'registered'
    ? 'bg-green-100 text-green-800'
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

const resetFilters = () => {
  filters.value = {
    status: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
}

// View customer details method
const viewCustomerDetails = (customerId: string) => {
  router.push(`/customers/${customerId}`)
}

// Modal functions
const confirmToggleStatus = (customer: any) => {
  customerToToggle.value = customer
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  customerToToggle.value = null
  isProcessing.value = false
}

const confirmToggleCustomerStatus = async () => {
  if (!customerToToggle.value) return
  
  isProcessing.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newStatus = toggleStatus(customerToToggle.value.id)
    if (newStatus) {
      const action = newStatus === 'blocked' ? 'blocked' : 'unblocked'
      console.log(`Customer ${customerToToggle.value.name} has been ${action} successfully`)
    }
    
    closeStatusModal()
  } catch (error) {
    console.error('Error toggling customer status:', error)
  } finally {
    isProcessing.value = false
  }
}

const toggleCustomerStatus = (customer: any) => {
  // This method is now replaced by the modal workflow
  confirmToggleStatus(customer)
}

const resetPassword = (customer: any) => {
  if (confirm(`Are you sure you want to reset the password for ${customer.name}?`)) {
    alert(`Password reset link has been sent to ${customer.email}`)
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

// Load persisted customer statuses on component mount
onMounted(() => {
  loadPersistedStatuses()
})
</script>
