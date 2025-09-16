import { computed } from 'vue'
import { useCustomersStore } from '@/stores/customers'

// Customer interface
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  customerType: 'registered' | 'guest'
  totalBookings: number
  status: 'active' | 'blocked'
  dateJoined: string
  address: string
  city: string
  country: string
}


export const useCustomers = () => {
  const customersStore = useCustomersStore()

  // Get all customers as computed property
  const customers = computed(() => customersStore.customers)

  // Get all customers
  const getCustomers = () => {
    return customersStore.customers
  }

  // Get customer by ID
  const getCustomerById = (id: string) => {
    return customersStore.getCustomerById(id)
  }

  // Update customer status
  const updateCustomerStatus = (id: string, status: Customer['status']) => {
    customersStore.updateCustomerStatus(id, status)
  }

  // Toggle customer status
  const toggleCustomerStatus = (id: string) => {
    return customersStore.toggleCustomerStatus(id)
  }

  // Load persisted statuses
  const loadPersistedStatuses = () => {
    customersStore.initializeCustomers()
  }

  // Get active customers
  const getActiveCustomers = () => {
    return customersStore.activeCustomers
  }

  // Get blocked customers
  const getBlockedCustomers = () => {
    return customersStore.blockedCustomers
  }

  return {
    customers,
    getCustomers,
    getCustomerById,
    updateCustomerStatus,
    toggleCustomerStatus,
    loadPersistedStatuses,
    getActiveCustomers,
    getBlockedCustomers
  }
}

// Export customersData for compatibility with existing code
export const customersData = computed(() => useCustomersStore().customers)
