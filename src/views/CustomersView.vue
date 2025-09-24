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
          <div class="md:mr-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Customers</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search by name, email, or phone..." v-model="searchQuery"
                class="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:ring-1 focus:z-10 sm:text-md text-gray-900 w-96" />
            </div>
          </div>
          <div class="md:ml-8">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative">
              <div @click="toggleDropdown('status')"
                :class="['w-[150px] rounded-lg px-3 py-2 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center justify-between', dropdownStates.status ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                <span class="text-gray-900">{{ getStatusLabel(filters.status) }}</span>
                <svg :class="[
                  'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                  dropdownStates.status ? 'transform rotate-180' : ''
                ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!-- Dropdown Options -->
              <div v-if="dropdownStates.status" class="absolute z-10 mt-1 w-[150px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div class="p-2">
                  <div v-for="option in statusOptions" :key="option.value" @click="selectStatus(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                    {{ option.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-end justify-end">
            <button
              @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600"
            >
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
                <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Rewards
                </th> -->
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody v-if="filteredCustomers.length > 0" class="bg-white divide-y divide-gray-200">
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
                <!-- <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">LKR {{ getCustomerRewards(customer.id) }}</div>
                </td> -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(customer.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ customer.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <button @click.stop="confirmToggleStatus(customer)"
                      :class="customer.status === 'active' 
                        ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100' 
                        : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'"
                      class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center justify-center space-x-1"
                      :title="customer.status === 'active' ? 'Make Customer Inactive' : 'Make Customer Active'">
                      <!-- <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="customer.status === 'active' ? mdiAccountCancel : mdiAccountCheck" />
                      </svg> -->
                      <span>{{ customer.status === 'active' ? 'Inactive' : 'Active' }}</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- Empty State Row -->
            <tbody v-if="filteredCustomers.length === 0" class="bg-white">
              <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                  <div>
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                    <p class="mt-1 text-sm text-gray-500">No customers match the current filters.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Status Toggle Confirmation Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full" :class="customerToToggle?.status === 'active' ? 'bg-amber-100' : 'bg-green-100'">
            <svg class="w-6 h-6" :class="customerToToggle?.status === 'active' ? 'text-amber-600' : 'text-green-600'" fill="currentColor" viewBox="0 0 24 24">
              <path :d="customerToToggle?.status === 'active' ? mdiAccountCancel : mdiAccountCheck" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">
            {{ customerToToggle?.status === 'active' ? 'Make Inactive' : 'Make Active' }} Customer
          </h3>
          <div class="mt-2 px-7 py-3">
            
                <div v-if="customerToToggle" class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                    <!-- <div class="text-gray-500">Total Bookings: {{ customerToToggle.totalBookings }}</div> -->
                  </div>
                </div>
              </div>
            </div>
            <!-- <div v-if="customerToToggle?.status === 'active'" class="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p class="text-xs text-amber-700">
                <strong>Note:</strong> Making inactive will prevent the customer from making new bookings and accessing their account.
              </p>
            </div> -->
            <div class="my-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-700 text-center">
                Are you sure you want to <strong>{{ customerToToggle?.status === 'active' ? 'make this customer inactive' : 'make this customer active' }}</strong>?
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeStatusModal"
              class="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmToggleCustomerStatus"
              :disabled="isProcessing"
              class="px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              :class="customerToToggle?.status === 'active' ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100' : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'"
            >
              <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isProcessing ? 'Processing...' : (customerToToggle?.status === 'active' ? 'Inactive' : 'Active') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeSuccessModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-100 mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useCustomers, type Customer } from '@/composables/useCustomers'
import { useRewardsStore } from '@/stores/rewards'
import { mdiAccount, mdiAccountCheck, mdiAccountCancel } from '@mdi/js'

// Use router for navigation
const router = useRouter()

// Use shared customers data
const { customers, toggleCustomerStatus: toggleStatus, fetchCustomers } = useCustomers()
const rewardsStore = useRewardsStore()

// State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Modal state
const showStatusModal = ref(false)
const customerToToggle = ref<any>(null)
const isProcessing = ref(false)

// Success and Error modal state
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Dropdown states for arrow rotation
const dropdownStates = ref({
  status: false
})

// Filters
const filters = ref({
  status: ''
})

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

// Computed properties
const filteredCustomers = computed(() => {
  console.log('Computing filtered customers...')
  console.log('All customers:', customers.value)
  // Start with all customers (temporarily remove the registered filter)
  let filtered = customers.value // .filter((customer: Customer) => customer.customerType === 'registered')
  console.log('All customers (no filter):', filtered)
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((customer: Customer) =>
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    )
  }

  // Apply status filter
  if (filters.value.status) {
    filtered = filtered.filter((customer: Customer) => customer.status === filters.value.status)
  }

  console.log('Final filtered customers:', filtered)
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
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-red-100 text-red-800'
  }
}

const getCustomerRewards = (customerId: string) => {
  return rewardsStore.getCustomerRewards(customerId)
}

// Dropdown toggle functions
const toggleDropdown = (dropdownName: string) => {
  // Close all dropdowns first
  closeAllDropdowns()
  // Then open the clicked dropdown
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = true
}

const closeDropdown = (dropdownName: string) => {
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = false
}

const closeAllDropdowns = () => {
  Object.keys(dropdownStates.value).forEach(key => {
    dropdownStates.value[key as keyof typeof dropdownStates.value] = false
  })
}

const getStatusLabel = (value: string) => {
  const option = statusOptions.find(opt => opt.value === value)
  return option ? option.label : 'All Status'
}

const selectStatus = (value: string) => {
  filters.value.status = value
  closeDropdown('status')
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

// Success and Error modal helper functions
const showSuccessModalWithMessage = (message: string) => {
  successMessage.value = message
  showSuccessModal.value = true
}

const showErrorModalWithMessage = (message: string) => {
  errorMessage.value = message
  showErrorModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  successMessage.value = ''
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

const confirmToggleCustomerStatus = async () => {
  if (!customerToToggle.value) return
  
  isProcessing.value = true
  
  try {
    const newStatus = await toggleStatus(customerToToggle.value.id)
    if (newStatus) {
      // Update the local customer object immediately for UI responsiveness
      customerToToggle.value.status = newStatus
      const action = newStatus === 'active' ? 'activated' : 'made inactive'
      const message = `Customer ${customerToToggle.value.name} has been ${action} successfully.`
      showSuccessModalWithMessage(message)
    } else {
      showErrorModalWithMessage('Failed to update customer status. Please try again.')
    }
    
    closeStatusModal()
  } catch (error) {
    console.error('Error toggling customer status:', error)
    showErrorModalWithMessage('An error occurred while updating customer status. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

// Pagination methods
// const previousPage = () => {
//   if (currentPage.value > 1) {
//     currentPage.value--
//   }
// }

// const nextPage = () => {
//   if (currentPage.value < totalPages.value) {
//     currentPage.value++
//   }
// }

// const goToPage = (page: number) => {
//   currentPage.value = page
// }

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const dropdownContainer = target.closest('.relative')
  
  // Close all dropdowns if clicking outside any dropdown container
  if (!dropdownContainer) {
    closeAllDropdowns()
  }
}

// Load persisted customer statuses on component mount
onMounted(async () => {
  await fetchCustomers() // Load customer data from API (this will also apply persisted statuses)
  document.addEventListener('click', handleClickOutside)
})

// Cleanup event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom dropdown styles */
.appearance-none {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Enhance dropdown arrow animation */
.rotate-180 {
  transform: rotate(180deg);
}

/* Custom select hover effects */
select:hover {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
}

/* Smooth transitions for focus states */
select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Enhanced arrow styling */
.pointer-events-none svg {
  transition: all 0.2s ease-in-out;
}

select:focus + .absolute svg {
  color: #10b981;
}

/* Custom scrollbar for select options (webkit browsers) */
select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Additional styling for better visual feedback */
select {
  cursor: pointer;
}

select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
