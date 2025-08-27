import { ref, computed } from 'vue'

// Sample customers data - this will be shared across components
export const customersData = ref([
  {
    id: 'CU-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    customerType: 'registered',
    totalBookings: 15,
    status: 'active',
    dateJoined: '2024-01-15',
    address: '123 Main St, New York, NY 10001',
    city: 'New York',
    country: 'USA'
  },
  {
    id: 'CU-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    customerType: 'registered',
    totalBookings: 8,
    status: 'active',
    dateJoined: '2024-02-20',
    address: '456 Oak Ave, San Francisco, CA 94102',
    city: 'San Francisco',
    country: 'USA'
  },
  {
    id: 'CU-003',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 456-7890',
    customerType: 'guest',
    totalBookings: 3,
    status: 'active',
    dateJoined: '2024-03-10',
    address: '789 Pine St, Austin, TX 73301',
    city: 'Austin',
    country: 'USA'
  },
  {
    id: 'CU-004',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 234-5678',
    customerType: 'registered',
    totalBookings: 22,
    status: 'blocked',
    dateJoined: '2023-12-05',
    address: '321 Elm St, Miami, FL 33101',
    city: 'Miami',
    country: 'USA'
  },
  {
    id: 'CU-005',
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+1 (555) 345-6789',
    customerType: 'guest',
    totalBookings: 1,
    status: 'inactive',
    dateJoined: '2024-04-02',
    address: '654 Maple Ave, Seattle, WA 98101',
    city: 'Seattle',
    country: 'USA'
  }
])

export const useCustomers = () => {
  const customers = customersData

  const getCustomerById = (id: string) => {
    return computed(() => customers.value.find(customer => customer.id === id))
  }

  const updateCustomerStatus = (customerId: string, newStatus: string) => {
    const index = customers.value.findIndex(c => c.id === customerId)
    if (index !== -1) {
      customers.value[index].status = newStatus
      
      // Save to localStorage to persist across pages
      localStorage.setItem('customers', JSON.stringify(customers.value))
      
      // Also store individual customer status for easy access
      const customerStatuses = JSON.parse(localStorage.getItem('customerStatuses') || '{}')
      customerStatuses[customerId] = newStatus
      localStorage.setItem('customerStatuses', JSON.stringify(customerStatuses))
    }
  }

  const toggleCustomerStatus = (customerId: string) => {
    const customer = customers.value.find(c => c.id === customerId)
    if (customer) {
      const newStatus = customer.status === 'blocked' ? 'active' : 'blocked'
      updateCustomerStatus(customerId, newStatus)
      return newStatus
    }
    return null
  }

  const loadPersistedStatuses = () => {
    const customerStatuses = JSON.parse(localStorage.getItem('customerStatuses') || '{}')
    customers.value.forEach(customer => {
      if (customerStatuses[customer.id]) {
        customer.status = customerStatuses[customer.id]
      }
    })
  }

  return {
    customers,
    getCustomerById,
    updateCustomerStatus,
    toggleCustomerStatus,
    loadPersistedStatuses
  }
}
