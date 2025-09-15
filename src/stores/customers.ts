import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Customer {
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

export const useCustomersStore = defineStore('customers', () => {
  // State
  const customers = ref<Customer[]>([])
  const customerStatuses = ref<Record<string, Customer['status']>>({})

  // Initialize from localStorage
  const initializeCustomers = () => {
    try {
      const savedCustomers = localStorage.getItem('customers')
      if (savedCustomers) {
        const parsedCustomers = JSON.parse(savedCustomers)
        if (Array.isArray(parsedCustomers) && parsedCustomers.length > 0) {
          customers.value = parsedCustomers
        }
      }

      const savedStatuses = localStorage.getItem('customerStatuses')
      if (savedStatuses) {
        customerStatuses.value = JSON.parse(savedStatuses)
        // Apply statuses to customers
        customers.value.forEach(customer => {
          if (customerStatuses.value[customer.id]) {
            customer.status = customerStatuses.value[customer.id]
          }
        })
      }
    } catch (error) {
      console.warn('⚠️ Error initializing customers from localStorage:', error)
    }
  }

  // Actions
  const updateCustomerStatus = (customerId: string, newStatus: Customer['status']) => {
    const index = customers.value.findIndex(c => c.id === customerId)
    if (index !== -1) {
      customers.value[index].status = newStatus
      customerStatuses.value[customerId] = newStatus

      // Save to localStorage
      localStorage.setItem('customers', JSON.stringify(customers.value))
      localStorage.setItem('customerStatuses', JSON.stringify(customerStatuses.value))
    }
  }

  const toggleCustomerStatus = (customerId: string): Customer['status'] | null => {
    const customer = customers.value.find(c => c.id === customerId)
    if (customer) {
      const newStatus: Customer['status'] = customer.status === 'blocked' ? 'active' : 'blocked'
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

  const blockedCustomers = computed(() =>
    customers.value.filter(customer => customer.status === 'blocked')
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

    // Getters
    activeCustomers,
    blockedCustomers
  }
})