import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  customerType: 'registered' | 'guest'
  totalBookings: number
  status: 'active' | 'inactive'
  dateJoined?: string
  address?: string
  city?: string
  country?: string
}

export const useCustomersStore = defineStore('customers', () => {
  // State
  const customers = ref<Customer[]>([])
  const customerStatuses = ref<Record<string, Customer['status']>>({})

  // Initialize with dummy data if no customers exist
  const initializeCustomers = () => {
    if (customers.value.length === 0) {
      customers.value = [
        
      ]
    }
    // Load persisted statuses
    loadPersistedStatuses()
  }

  // Load persisted customer statuses from localStorage
  const loadPersistedStatuses = () => {
    try {
      const persistedStatuses = JSON.parse(localStorage.getItem('customerStatuses') || '{}')
      customerStatuses.value = persistedStatuses
      
      // Apply persisted statuses to current customers
      customers.value.forEach(customer => {
        if (persistedStatuses[customer.id]) {
          customer.status = persistedStatuses[customer.id]
        }
      })
    } catch (error) {
      console.error('Error loading persisted customer statuses:', error)
    }
  }  // Actions
  const updateCustomerStatus = (customerId: string, newStatus: Customer['status']) => {
    const index = customers.value.findIndex(c => c.id === customerId)
    if (index !== -1) {
      customers.value[index].status = newStatus
      customerStatuses.value[customerId] = newStatus
      
      // Persist to localStorage
      const persistedStatuses = JSON.parse(localStorage.getItem('customerStatuses') || '{}')
      persistedStatuses[customerId] = newStatus
      localStorage.setItem('customerStatuses', JSON.stringify(persistedStatuses))
    }
  }

  const toggleCustomerStatus = (customerId: string): Customer['status'] | null => {
    const customer = customers.value.find(c => c.id === customerId)
    if (customer) {
      const newStatus: Customer['status'] = customer.status === 'inactive' ? 'active' : 'inactive'
      updateCustomerStatus(customerId, newStatus)
      return newStatus
    }
    return null
  }

  const getCustomerById = (id: string) => {
    return computed(() => customers.value.find(customer => customer.id === id))
  }

  // Getters
  const activeCustomers = computed(() =>
    customers.value.filter(customer => customer.status === 'active')
  )

  const inactiveCustomers = computed(() =>
    customers.value.filter(customer => customer.status === 'inactive')
  )

  // Initialize on store creation
  initializeCustomers()

  return {
    // State
    customers,
    customerStatuses,

    // Actions
    initializeCustomers,
    updateCustomerStatus,
    toggleCustomerStatus,
    getCustomerById,
    loadPersistedStatuses,

    // Getters
    activeCustomers,
    inactiveCustomers
  }
})