import { computed } from 'vue'
import { useCustomersStore } from '@/stores/customers'
import { customerApi } from '@/services/api'

// Customer interface
export interface Customer {
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


export const useCustomers = () => {
  const customersStore = useCustomersStore()

  // Get all customers as computed property
  const customers = computed(() => customersStore.customers)

  // Get all customers
  const getCustomers = () => {
    return customersStore.customers
  }

  // Get customer by ID
  const getCustomerById = async (id: string) => {
    try {
      console.log('Fetching customer by ID from API:', id)
      const response = await customerApi.getCustomerById(id)
      console.log('Customer API response:', response)

      if (response.success && response.data) {
        console.log('Customer data received:', response.data)

        // Map API response to match our Customer interface
        const apiData = response.data as any
        const mappedCustomer = {
          id: String(apiData.id || apiData.user_id || ''),
          name: apiData.name || `${apiData.first_name || ''} ${apiData.last_name || ''}`.trim() || apiData.full_name || '',
          email: apiData.email || '',
          phone: apiData.phone || '',
          customerType: apiData.customer_type || apiData.customerType || 'registered',
          totalBookings: apiData.total_bookings || apiData.totalBookings || 0,
          status: (apiData.status === true || apiData.status === 'true' || apiData.status === 'active') ? 'active' as const : 'inactive' as const,
          dateJoined: apiData.joined_date || apiData.dateJoined
        }

        console.log('Mapped customer data:', mappedCustomer)
        return mappedCustomer
      } else {
        console.error('Failed to fetch customer:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error fetching customer by ID:', error)
      return null
    }
  }

  // Update customer status
  const updateCustomerStatus = (id: string, status: Customer['status']) => {
    customersStore.updateCustomerStatus(id, status)
  }

  // Toggle customer status
  const toggleCustomerStatus = async (id: string, currentStatus?: Customer['status']) => {
    try {
      // Get current customer status - either from parameter or from store
      let customerStatus = currentStatus
      if (!customerStatus) {
        const customer = customersStore.customers.find(c => c.id === id)
        if (!customer) {
          console.error('Customer not found:', id)
          return null
        }
        customerStatus = customer.status
      }

      // Determine new status (opposite of current)
      const newStatus = customerStatus === 'inactive' ? 'active' : 'inactive'
      const isActive = newStatus === 'active'

      console.log('Toggling customer status:', { id, currentStatus: customerStatus, newStatus, isActive })

      // Call API to update status
      const response = await customerApi.activateUser({ id: parseInt(id), is_active: isActive })
      
      if (response.success) {
        // Update local store
        customersStore.updateCustomerStatus(id, newStatus)
        console.log('Customer status updated successfully:', { id, newStatus })
        return newStatus
      } else {
        console.error('Failed to update customer status:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error toggling customer status:', error)
      return null
    }
  }

  // Load persisted statuses
  const loadPersistedStatuses = () => {
    customersStore.initializeCustomers()
  }

  // Fetch customers from API
  const fetchCustomers = async (requestData?: {
    id?: string
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    status?: string
    total_bookings?: number
    customer_type?: string
  }) => {
    try {
      console.log('Fetching customers from API...')
      const response = await customerApi.getAllCustomers(requestData)
      console.log('API Response:', response)
      
      if (response.success && response.data) {
        console.log('Raw customer data received:', response.data)
        
        // Map API response to match our Customer interface
        const mappedCustomers = response.data.map((customer: any) => ({
          id: String(customer.id || customer.user_id || ''),
          name: customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.full_name || '',
          email: customer.email || '',
          phone: customer.phone || '',
          customerType: customer.customer_type || customer.customerType || 'registered',
          totalBookings: customer.total_bookings || customer.totalBookings || 0,
          status: (customer.status === true || customer.status === 'true' || customer.status === 'active') ? 'active' as const : 'inactive' as const,
          dateJoined: customer.joined_date || customer.dateJoined
        }))
        
        console.log('Mapped customer data:', mappedCustomers)
        // Update the store with fetched data
        customersStore.customers = mappedCustomers
        console.log('Customers stored in store:', customersStore.customers)
        
        // Apply persisted status changes to the fresh data
        customersStore.loadPersistedStatuses()
        
        return mappedCustomers
      } else {
        console.error('Failed to fetch customers:', response.message)
        return []
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      return []
    }
  }

  // Get active customers
  const getActiveCustomers = () => {
    return customersStore.activeCustomers
  }

  // Get inactive customers
  const getInactiveCustomers = () => {
    return customersStore.inactiveCustomers
  }

  return {
    customers,
    getCustomers,
    getCustomerById,
    updateCustomerStatus,
    toggleCustomerStatus,
    loadPersistedStatuses,
    fetchCustomers,
    getActiveCustomers,
    getInactiveCustomers
  }
}

// Export customersData for compatibility with existing code
export const customersData = computed(() => useCustomersStore().customers)
