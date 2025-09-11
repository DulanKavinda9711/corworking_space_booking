/**
 * Centralized API Service
 * 
 * This file contains all API calls for the dashboard application.
 * Currently using mock data - replace with real API calls when backend is ready.
 * 
 * Usage Examples:
 * import { bookingApi, customerApi, authApi } from '@/services/api'
 * 
 * const bookings = await bookingApi.getAllBookings()
 * const customer = await customerApi.getCustomerById('CU-001')
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: 'active' | 'inactive' | 'blocked'
  lastLogin?: string
  permissions: string[]
}

export interface Booking {
  id: string
  productName: string
  productType: string
  productId: string
  productImage: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  userType: 'registered' | 'guest'
  date: string
  startTime: string
  endTime: string
  duration: string
  totalPrice: number
  basePrice?: number
  additionalFacilities?: number
  taxes?: number
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending'
  location: string
  locationName: string
  companyName: string
  capacity?: number
  facilities?: string[]
  subscriptionType?: string
  subscribedDate?: string
  nextBillingDate?: string
  customerMessage?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  customerType: 'registered' | 'guest'
  totalBookings: number
  status: 'active' | 'inactive' | 'blocked'
  dateJoined: string
  address?: string
  city?: string
  country?: string
  totalSpent?: number
  avatar?: string
}

export interface Company {
  id: number
  name: string
  registrationNumber: string
  address: string
  city: string
  country: string
  contactPerson: string
  email: string
  phone: string
  totalSpaces: number
  status: 'active' | 'inactive'
  logo?: string
}

export interface Location {
  id: string
  name: string
  street?: string
  street2?: string
  postalCode?: string
  town?: string
  district?: string
  city: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  mapUrl?: string
  status: 'active' | 'inactive'
}

export interface Facility {
  id: Number
  name: string
  status: 'active' | 'inactive' | 'maintenance'
  Icon?: string
}

export interface OperationSchedule {
  day: string
  start_time: string
  end_time: string
  is_enabled: boolean
}

export interface Product {
  id: string
  name: string
  type: 'Meeting Room' | 'Hot Desk' | 'Dedicated Desk'
  description: string
  locationName: string
  locationAddress: string
  companyName: string
  companyId: string
  locationId: string
  maxSeatingCapacity: number
  status: 'active' | 'inactive'
  pricePerHour: number
  pricePerDay: number
  pricePerMonth: number
  pricePerYear: number
  images: string[]
  openHours: {
    start: string
    end: string
  }
  openDays: string[]
  operation_schedule?: OperationSchedule[]
  defaultFacilities: string[]
  additionalFacilities: Array<{
    id: string
    name: string
    pricePerHour: number
    pricePerDay: number
    pricePerMonth: number
    pricePerYear: number
  }>
  totalReviews?: number
  averageRating?: number
  locationUrl?: string
}

export interface Payment {
  id: string
  bookingId: string
  customerName: string
  amount: number
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'digital_wallet'
  transactionDate: string
  description: string
  receiptUrl?: string
}

export interface Message {
  id: string
  bookingId?: string
  customerId?: string
  customerName: string
  customerEmail: string
  subject: string
  message: string
  contactMethod: 'email' | 'sms' | 'phone'
  recipientContact: string
  sentAt: string
  sentBy: string
  status: 'sent' | 'delivered' | 'failed'
  priority: 'low' | 'normal' | 'high'
}

export interface CancellationRequest {
  id: string
  bookingId: string
  subscriptionId?: string
  customerName: string
  reason: string
  additionalNotes?: string
  refundRequested: boolean
  paymentSlipUploaded: boolean
  paymentSlipFile?: File
  requestDate: string
  status: 'pending' | 'approved' | 'rejected' | 'processed'
  processedBy?: string
  processedDate?: string
}

export interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  totalCustomers: number
  totalSubscriptions: number
  activeBookings: number
  pendingPayments: number
  cancellationRequests: number
  occupancyRate: number
  monthlyGrowth: {
    bookings: number
    revenue: number
    customers: number
  }
}

// ============================================================================
// MOCK DATA STORAGE
// ============================================================================

// ============================================================================
// API UTILITY FUNCTIONS
// ============================================================================

/**
 * Simulate API delay for realistic testing
 */
const delay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create successful API response
 */
const successResponse = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    success: true,
    data,
    message
  }
}

/**
 * Create error API response
 */
const errorResponse = (message: string, errors?: string[]): ApiResponse => {
  return {
    success: false,
    message,
    errors
  }
}

/**
 * Paginate array data
 */
const paginate = <T>(data: T[], page: number = 1, limit: number = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = data.slice(startIndex, endIndex)
  
  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalItems: data.length,
      itemsPerPage: limit
    }
  }
}

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const authApi = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(1000)

    // Real API call - uncomment when backend is ready
    // try {
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(credentials)
    //   })
    //   
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.token && data.user) {
    //     // Store token and user info
    //     localStorage.setItem('authToken', data.token)
    //     localStorage.setItem('user', JSON.stringify(data.user))
    //     
    //     return successResponse({ user: data.user, token: data.token }, 'Login successful')
    //   } else {
    //     return errorResponse(data.message || 'Login failed', data.errors)
    //   }
    // } catch (error) {
    //   console.error('Login error:', error)
    //   return errorResponse('Network error during login', [error.message])
    // }
    
    // Mock authentication - remove when real API is implemented
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      const user: User = {
        id: 'USR-001',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: new Date().toISOString(),
        permissions: ['read', 'write', 'delete', 'manage_users'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
      }
      const token = 'mock-jwt-token-' + Date.now()
      
      // Store token in localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return successResponse({ user, token }, 'Login successful')
    }

    return errorResponse('Invalid credentials', ['Email or password is incorrect'])
  },

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse> {
    await delay(500)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     console.warn('Logout API call failed, but clearing local data anyway')
    //   }
    // } catch (error) {
    //   console.warn('Logout API error:', error)
    //   // Continue with local cleanup even if API fails
    // }

    // Mock logout - remove when real API is implemented
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')

    return successResponse(null, 'Logged out successfully')
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(500)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   if (!token) {
    //     return errorResponse('No authentication token found')
    //   }
    //   
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.user) {
    //     // Update local storage with fresh user data
    //     localStorage.setItem('user', JSON.stringify(data.user))
    //     return successResponse(data.user)
    //   } else {
    //     return errorResponse(data.message || 'Failed to get user info')
    //   }
    // } catch (error) {
    //   console.error('Get user error:', error)
    //   return errorResponse('Network error while getting user info', [error.message])
    // }

    // Mock implementation - remove when real API is implemented
    const userJson = localStorage.getItem('user')
    if (userJson) {
      const user = JSON.parse(userJson)
      return successResponse(user)
    }

    return errorResponse('User not authenticated')
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    await delay(500)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   if (!token) {
    //     return errorResponse('No authentication token found')
    //   }
    //   
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/auth/refresh`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.token) {
    //     localStorage.setItem('authToken', data.token)
    //     return successResponse({ token: data.token }, 'Token refreshed successfully')
    //   } else {
    //     return errorResponse(data.message || 'Token refresh failed')
    //   }
    // } catch (error) {
    //   console.error('Token refresh error:', error)
    //   return errorResponse('Network error during token refresh', [error.message])
    // }

    // Mock implementation - remove when real API is implemented
    const token = 'mock-refreshed-token-' + Date.now()
    localStorage.setItem('authToken', token)

    return successResponse({ token }, 'Token refreshed')
  }
}

// ============================================================================
// BOOKINGS API
// ============================================================================

export const bookingApi = {
  /**
   * Get all bookings with optional filtering
   */
  async getAllBookings(filters?: {
    page?: number
    limit?: number
    status?: string
    customerType?: string
    location?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<ApiResponse<Booking[]>> {
    await delay(800)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const queryParams = new URLSearchParams()
    //   
    //   if (filters?.page) queryParams.append('page', filters.page.toString())
    //   if (filters?.limit) queryParams.append('limit', filters.limit.toString())
    //   if (filters?.status) queryParams.append('status', filters.status)
    //   if (filters?.customerType) queryParams.append('customerType', filters.customerType)
    //   if (filters?.location) queryParams.append('location', filters.location)
    //   if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
    //   if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
    //   
    //   const url = `${API_CONFIG.BASE_URL}/bookings${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    //   
    //   const response = await fetch(url, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success) {
    //     return {
    //       success: true,
    //       data: data.bookings || data.data,
    //       pagination: data.pagination
    //     }
    //   } else {
    //     return errorResponse(data.message || 'Failed to fetch bookings', data.errors)
    //   }
    // } catch (error) {
    //   console.error('Get bookings error:', error)
    //   return errorResponse('Network error while fetching bookings', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    // For now, return empty data since MockDataStore is removed
    return {
      success: true,
      data: [],
      pagination: {
        currentPage: filters?.page || 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: filters?.limit || 10
      }
    }
  },

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    await delay(500)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${id}`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 404) {
    //       return errorResponse('Booking not found', [`Booking with ID ${id} does not exist`])
    //     }
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.booking) {
    //     return successResponse(data.booking)
    //   } else {
    //     return errorResponse(data.message || 'Failed to fetch booking')
    //   }
    // } catch (error) {
    //   console.error('Get booking error:', error)
    //   return errorResponse('Network error while fetching booking', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return errorResponse('Booking not found', [`Booking with ID ${id} does not exist`])
  },

  /**
   * Create new booking
   */
  async createBooking(bookingData: Omit<Booking, 'id' | 'status'>): Promise<ApiResponse<Booking>> {
    await delay(1000)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/bookings`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(bookingData)
    //   })
    //   
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.booking) {
    //     // Update local storage for immediate UI updates
    //     const bookings = MockDataStore.getInstance().getBookings()
    //     bookings.push(data.booking)
    //     MockDataStore.getInstance().updateBookings(bookings)
    //     
    //     return successResponse(data.booking, 'Booking created successfully')
    //   } else {
    //     return errorResponse(data.message || 'Failed to create booking', data.errors)
    //   }
    // } catch (error) {
    //   console.error('Create booking error:', error)
    //   return errorResponse('Network error while creating booking', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return errorResponse('Booking creation not implemented', ['Real API not yet implemented'])
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(id: string, status: Booking['status']): Promise<ApiResponse<Booking>> {
    await delay(800)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${id}/status`, {
    //     method: 'PATCH',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ status })
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 404) {
    //       return errorResponse('Booking not found')
    //     }
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.booking) {
    //     // Update local storage for immediate UI updates
    //     const bookings = MockDataStore.getInstance().getBookings()
    //     const bookingIndex = bookings.findIndex(b => b.id === id)
    //     if (bookingIndex !== -1) {
    //       bookings[bookingIndex] = data.booking
    //       MockDataStore.getInstance().updateBookings(bookings)
    //     }
    //     
    //     // Also update localStorage for immediate persistence
    //     const bookingStatuses = JSON.parse(localStorage.getItem('bookingStatuses') || '{}')
    //     bookingStatuses[id] = status
    //     localStorage.setItem('bookingStatuses', JSON.stringify(bookingStatuses))
    //     
    //     return successResponse(data.booking, 'Booking status updated successfully')
    //   } else {
    //     return errorResponse(data.message || 'Failed to update booking status')
    //   }
    // } catch (error) {
    //   console.error('Update booking status error:', error)
    //   return errorResponse('Network error while updating booking status', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return errorResponse('Booking status update not implemented', ['Real API not yet implemented'])
  },

  /**
   * Cancel booking
   */
  async cancelBooking(id: string, reason: string): Promise<ApiResponse<Booking>> {
    await delay(1000)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${id}/cancel`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ reason })
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 404) {
    //       return errorResponse('Booking not found')
    //     }
    //     if (response.status === 403) {
    //       return errorResponse('You do not have permission to cancel this booking')
    //     }
    //     const errorData = await response.json().catch(() => ({}))
    //     return errorResponse(errorData.message || 'Failed to cancel booking', errorData.errors)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.booking) {
    //     // Update local storage for immediate UI updates
    //     const bookings = MockDataStore.getInstance().getBookings()
    //     const bookingIndex = bookings.findIndex(b => b.id === id)
    //     if (bookingIndex !== -1) {
    //       bookings[bookingIndex] = data.booking
    //       MockDataStore.getInstance().updateBookings(bookings)
    //     }
    //     
    //     return successResponse(data.booking, 'Booking cancelled successfully')
    //   } else {
    //     return errorResponse(data.message || 'Failed to cancel booking')
    //   }
    // } catch (error) {
    //   console.error('Cancel booking error:', error)
    //   return errorResponse('Network error while cancelling booking', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return await this.updateBookingStatus(id, 'cancelled')
  },

  /**
   * Delete booking (admin only)
   */
  async deleteBooking(id: string): Promise<ApiResponse> {
    await delay(800)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${id}`, {
    //     method: 'DELETE',
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 404) {
    //       return errorResponse('Booking not found')
    //     }
    //     if (response.status === 403) {
    //       return errorResponse('You do not have permission to delete this booking')
    //     }
    //     const errorData = await response.json().catch(() => ({}))
    //     return errorResponse(errorData.message || 'Failed to delete booking', errorData.errors)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   // Update local storage for immediate UI updates
    //   const bookings = MockDataStore.getInstance().getBookings()
    //   const bookingIndex = bookings.findIndex(b => b.id === id)
    //   if (bookingIndex !== -1) {
    //     const deletedBooking = bookings.splice(bookingIndex, 1)[0]
    //     MockDataStore.getInstance().updateBookings(bookings)
    //     
    //     // Log deletion for audit
    //     const deletedBookings = JSON.parse(localStorage.getItem('deletedBookings') || '[]')
    //     deletedBookings.push({
    //       ...deletedBooking,
    //       deletedAt: new Date().toISOString(),
    //       deletedBy: 'Admin'
    //     })
    //     localStorage.setItem('deletedBookings', JSON.stringify(deletedBookings))
    //   }
    //   
    //   return successResponse(data, 'Booking deleted successfully')
    // } catch (error) {
    //   console.error('Delete booking error:', error)
    //   return errorResponse('Network error while deleting booking', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return errorResponse('Booking deletion not implemented', ['Real API not yet implemented'])
  }
}

// ============================================================================
// SUBSCRIPTION API
// ============================================================================

export const subscriptionApi = {
  /**
   * Get all subscriptions
   */
  async getAllSubscriptions(filters?: {
    page?: number
    limit?: number
    status?: string
    type?: string
  }): Promise<ApiResponse<Booking[]>> {
    await delay(700)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const queryParams = new URLSearchParams()
    //   
    //   if (filters?.page) queryParams.append('page', filters.page.toString())
    //   if (filters?.limit) queryParams.append('limit', filters.limit.toString())
    //   if (filters?.status) queryParams.append('status', filters.status)
    //   if (filters?.type) queryParams.append('type', filters.type)
    //   
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/subscriptions?${queryParams}`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 401) {
    //       // Handle token expiry
    //       return errorResponse('Please log in again')
    //     }
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.subscriptions) {
    //     // Update local storage for offline access
    //     const existingBookings = MockDataStore.getInstance().getBookings()
    //     const nonSubscriptions = existingBookings.filter(b => b.productType !== 'Subscription')
    //     MockDataStore.getInstance().updateBookings([...nonSubscriptions, ...data.subscriptions])
    //     
    //     return {
    //       success: true,
    //       data: data.subscriptions,
    //       pagination: data.pagination,
    //       message: 'Subscriptions retrieved successfully'
    //     }
    //   } else {
    //     return errorResponse(data.message || 'Failed to retrieve subscriptions')
    //   }
    // } catch (error) {
    //   console.error('Get subscriptions error:', error)
    //   return errorResponse('Network error while fetching subscriptions', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return {
      success: true,
      data: [],
      pagination: {
        currentPage: filters?.page || 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: filters?.limit || 10
      }
    }
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(id: string, cancellationData: {
    reason: string
    additionalNotes?: string
    refundRequested: boolean
    paymentSlipFile?: File
  }): Promise<ApiResponse<CancellationRequest>> {
    await delay(1200)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   
    //   // Create FormData for file upload if needed
    //   let body: string | FormData
    //   let contentTypeHeaders: Record<string, string> = {}
    //   
    //   if (cancellationData.paymentSlipFile) {
    //     const formData = new FormData()
    //     formData.append('reason', cancellationData.reason)
    //     if (cancellationData.additionalNotes) {
    //       formData.append('additionalNotes', cancellationData.additionalNotes)
    //     }
    //     formData.append('refundRequested', cancellationData.refundRequested.toString())
    //     formData.append('paymentSlipFile', cancellationData.paymentSlipFile)
    //     body = formData
    //   } else {
    //     body = JSON.stringify(cancellationData)
    //     contentTypeHeaders['Content-Type'] = 'application/json'
    //   }
    //   
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/subscriptions/${id}/cancel`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       ...contentTypeHeaders
    //     },
    //     body
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 404) {
    //       return errorResponse('Subscription not found')
    //     }
    //     if (response.status === 403) {
    //       return errorResponse('You do not have permission to cancel this subscription')
    //     }
    //     const errorData = await response.json().catch(() => ({}))
    //     return errorResponse(errorData.message || 'Failed to cancel subscription', errorData.errors)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.cancellationRequest) {
    //     // Update subscription status in local storage
    //     await bookingApi.updateBookingStatus(id, 'cancelled')
    //     
    //     return successResponse(data.cancellationRequest, 'Subscription cancellation requested successfully')
    //   } else {
    //     return errorResponse(data.message || 'Failed to cancel subscription')
    //   }
    // } catch (error) {
    //   console.error('Cancel subscription error:', error)
    //   return errorResponse('Network error while cancelling subscription', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return errorResponse('Subscription cancellation not implemented', ['Real API not yet implemented'])
  }
}

// ============================================================================
// CUSTOMER API
// ============================================================================

export const customerApi = {
  /**
   * Get all customers
   */
  async getAllCustomers(filters?: {
    page?: number
    limit?: number
    status?: string
    type?: string
    search?: string
  }): Promise<ApiResponse<Customer[]>> {
    await delay(600)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const queryParams = new URLSearchParams()
    //   
    //   if (filters?.page) queryParams.append('page', filters.page.toString())
    //   if (filters?.limit) queryParams.append('limit', filters.limit.toString())
    //   if (filters?.status) queryParams.append('status', filters.status)
    //   if (filters?.type) queryParams.append('type', filters.type)
    //   if (filters?.search) queryParams.append('search', filters.search)
    //   
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/customers?${queryParams}`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 401) {
    //       return errorResponse('Please log in again')
    //     }
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.customers) {
    //     // Update local storage for offline access
    //     MockDataStore.getInstance().updateCustomers(data.customers)
    //     
    //     return {
    //       success: true,
    //       data: data.customers,
    //       pagination: data.pagination,
    //       message: 'Customers retrieved successfully'
    //     }
    //   } else {
    //     return errorResponse(data.message || 'Failed to retrieve customers')
    //   }
    // } catch (error) {
    //   console.error('Get customers error:', error)
    //   return errorResponse('Network error while fetching customers', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return {
      success: true,
      data: [],
      pagination: {
        currentPage: filters?.page || 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: filters?.limit || 10
      }
    }
  },

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<ApiResponse<Customer>> {
    await delay(500)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/customers/${id}`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 404) {
    //       return errorResponse('Customer not found')
    //     }
    //     if (response.status === 401) {
    //       return errorResponse('Please log in again')
    //     }
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.customer) {
    //     return successResponse(data.customer)
    //   } else {
    //     return errorResponse(data.message || 'Customer not found')
    //   }
    // } catch (error) {
    //   console.error('Get customer error:', error)
    //   return errorResponse('Network error while fetching customer', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return errorResponse('Customer not found')
  },

  /**
   * Update customer status
   */
  async updateCustomerStatus(id: string, status: Customer['status']): Promise<ApiResponse<Customer>> {
    await delay(700)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/customers/${id}/status`, {
    //     method: 'PATCH',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ status })
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 404) {
    //       return errorResponse('Customer not found')
    //     }
    //     if (response.status === 403) {
    //       return errorResponse('You do not have permission to update this customer')
    //     }
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.customer) {
    //     // Update local storage
    //     const customers = MockDataStore.getInstance().getCustomers()
    //     const customerIndex = customers.findIndex(c => c.id === id)
    //     if (customerIndex !== -1) {
    //       customers[customerIndex] = data.customer
    //       MockDataStore.getInstance().updateCustomers(customers)
    //     }
    //     
    //     return successResponse(data.customer, 'Customer status updated successfully')
    //   } else {
    //     return errorResponse(data.message || 'Failed to update customer status')
    //   }
    // } catch (error) {
    //   console.error('Update customer status error:', error)
    //   return errorResponse('Network error while updating customer status', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return errorResponse('Customer status update not implemented', ['Real API not yet implemented'])
  },

  /**
   * Get customer booking history
   */
  async getCustomerBookings(customerId: string): Promise<ApiResponse<Booking[]>> {
    await delay(600)

    // Real API call - uncomment when backend is ready
    // try {
    //   const token = localStorage.getItem('authToken')
    //   const response = await fetch(`${API_CONFIG.BASE_URL}/customers/${customerId}/bookings`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   
    //   if (!response.ok) {
    //     if (response.status === 404) {
    //       return errorResponse('Customer not found')
    //     }
    //     if (response.status === 401) {
    //       return errorResponse('Please log in again')
    //     }
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   
    //   const data = await response.json()
    //   
    //   if (data.success && data.bookings) {
    //     return successResponse(data.bookings, `Retrieved ${data.bookings.length} bookings for customer`)
    //   } else {
    //     return errorResponse(data.message || 'Failed to retrieve customer bookings')
    //   }
    // } catch (error) {
    //   console.error('Get customer bookings error:', error)
    //   return errorResponse('Network error while fetching customer bookings', [error.message])
    // }

    // Mock API call - remove when real API is implemented
    return errorResponse('Customer bookings retrieval not implemented', ['Real API not yet implemented'])
  }
}

// ============================================================================
// COMPANY API
// ============================================================================

export const companyApi = {
  /**
   * Get all companies
   */
  async getAllCompanies(): Promise<ApiResponse<Company[]>> {
    await delay(600)

    return successResponse([])
  },

  /**
   * Get company by ID
   */
  async getCompanyById(id: number): Promise<ApiResponse<Company>> {
    await delay(500)

    return errorResponse('Company not found')
  },

  /**
   * Create new company
   */
  async createCompany(companyData: Omit<Company, 'id'>): Promise<ApiResponse<Company>> {
    await delay(800)

    return errorResponse('Company creation not implemented', ['Real API not yet implemented'])
  },

  /**
   * Update company
   */
  async updateCompany(id: number, companyData: Partial<Company>): Promise<ApiResponse<Company>> {
    await delay(800)

    return errorResponse('Company update not implemented', ['Real API not yet implemented'])
  }
}

// ============================================================================
// LOCATION API
// ============================================================================

export const locationApi = {
  /**
   * Get all locations
   */
  async getAllLocations(): Promise<ApiResponse<Location[]>> {
    try {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/locations/get-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status_code === 200 && data.data) {
        // Transform API response to match our Location interface
        const locations: Location[] = data.data.map((location: any) => {
          // Use individual address fields from API response
          const street = location.street || ''
          const street2 = location.street_two || ''
          const postalCode = location.postal_code ? location.postal_code.toString() : ''
          const town = location.town || ''
          const district = location.district || ''

          // Build combined address string
          const addressParts = [street, street2, postalCode, town, district].filter(part => part.trim() !== '')

          return {
            id: location.id.toString(),
            name: location.name || '',
            street: street,
            street2: street2,
            postalCode: postalCode,
            town: town,
            district: district,
            city: town, // Use town as city since API doesn't have separate city field
            contactName: location.contact_name || '',
            contactEmail: location.contact_email || '',
            contactPhone: location.contact_phone || '',
            mapUrl: location.url || '', // API uses 'url' instead of 'map_url'
            status: location.is_active ? 'active' : 'inactive'
          }
        })

        return successResponse(locations, data.message || 'Locations retrieved successfully')
      } else {
        return errorResponse(data.message || 'Failed to load locations')
      }
    } catch (error) {
      console.error('Get locations error:', error)
      return errorResponse('Network error while loading locations', [(error as Error).message])
    }
  },

  /**
   * Get location by ID
   */
  async getLocationById(id: string): Promise<ApiResponse<Location>> {
    try {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/locations/get-by-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: parseInt(id)
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status_code === 200 && data.data) {
        // Transform API response to match our Location interface
        const locationData = data.data

        // Use individual address fields from API response
        const street = locationData.street || ''
        const street2 = locationData.street_two || ''
        const postalCode = locationData.postal_code ? locationData.postal_code.toString() : ''
        const town = locationData.town || ''
        const district = locationData.district || ''

        const location: Location = {
          id: locationData.id.toString(),
          name: locationData.name || '',
          street: street,
          street2: street2,
          postalCode: postalCode,
          town: town,
          district: district,
          city: town, // Use town as city since API doesn't have separate city field
          contactName: locationData.contact_name || '',
          contactEmail: locationData.contact_email || '',
          contactPhone: locationData.contact_phone || '',
          mapUrl: locationData.url || '', // API uses 'url' instead of 'map_url'
          status: locationData.is_active ? 'active' : 'inactive'
        }

        return successResponse(location, data.message || 'Location retrieved successfully')
      } else {
        return errorResponse(data.message || 'Failed to load location')
      }
    } catch (error) {
      console.error('Get location by ID error:', error)
      return errorResponse('Network error while loading location', [(error as Error).message])
    }
  },

  /**
   * Create a new location
   */
  async createLocation(locationData: {
    Name: string
    Street: string
    StreetTwo?: string
    PostalCode: string
    Town: string
    Url: string
    District: string
    ContactName: string
    ContactEmail: string
    ContactPhone: string
  }): Promise<ApiResponse<string>> {
    try {
      // Build full address from individual fields

      // Create FormData as required by the API
      const formData = new FormData()
      formData.append('Name', locationData.Name)
      formData.append('ContactName', locationData.ContactName)
      formData.append('ContactEmail', locationData.ContactEmail)
      formData.append('ContactPhone', locationData.ContactPhone)
      formData.append('Street', locationData.Street)
      if (locationData.StreetTwo) {
        formData.append('StreetTwo', locationData.StreetTwo)
      }
      formData.append('PostalCode', locationData.PostalCode)
      formData.append('Url', locationData.Url)
      formData.append('Town', locationData.Town)
      formData.append('District', locationData.District)
      formData.append('IsActive', 'true')
      formData.append('City', locationData.Town) // Use Town as City if not provided

      // Debug: Log the FormData contents
      console.log('FormData contents:')
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`)
      }

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/locations/create`, {
        method: 'POST',
        body: formData
      })

      // Debug: Log response details
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.text()
          console.log('Error response body:', errorData)
          errorMessage += ` - ${errorData}`
        } catch (e) {
          console.log('Could not read error response body')
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Success response:', data)

      if (data.status_code === 200) {
        return successResponse(data.data, data.message || 'Location created successfully')
      } else {
        return errorResponse(data.message || 'Failed to create location')
      }
    } catch (error) {
      console.error('Create location error:', error)
      return errorResponse('Network error while creating location', [(error as Error).message])
    }
  },

  /**
   * Update an existing location
   */
  async updateLocation(id: string, locationData: {
    Name: string
    Street: string
    StreetTwo?: string
    PostalCode: string
    Town: string
    Url: string
    District: string
    ContactName: string
    ContactEmail: string
    ContactPhone: string
  }): Promise<ApiResponse<string>> {
    try {
      // Create FormData as required by the API
      const formData = new FormData()
      formData.append('Id', id)
      formData.append('Name', locationData.Name)
      formData.append('ContactName', locationData.ContactName)
      formData.append('ContactEmail', locationData.ContactEmail)
      formData.append('ContactPhone', locationData.ContactPhone)
      formData.append('Street', locationData.Street)
      if (locationData.StreetTwo) {
        formData.append('StreetTwo', locationData.StreetTwo)
      }
      formData.append('PostalCode', locationData.PostalCode)
      formData.append('Url', locationData.Url)
      formData.append('Town', locationData.Town)
      formData.append('District', locationData.District)
      formData.append('IsActive', 'true')
      formData.append('City', locationData.Town) // Use Town as City if not provided

      // Debug: Log the FormData contents
      console.log('Update FormData contents:')
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`)
      }

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/locations/update`, {
        method: 'POST',
        body: formData
      })

      // Debug: Log response details
      console.log('Update response status:', response.status)
      console.log('Update response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.text()
          console.log('Update error response body:', errorData)
          errorMessage += ` - ${errorData}`
        } catch (e) {
          console.log('Could not read error response body')
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Update success response:', data)

      if (data.status_code === 200) {
        return successResponse(data.data, data.message || 'Location updated successfully')
      } else {
        return errorResponse(data.message || 'Failed to update location')
      }
    } catch (error) {
      console.error('Update location error:', error)
      return errorResponse('Network error while updating location', [(error as Error).message])
    }
  },

  /**
   * Delete a location
   */
  async deleteLocation(id: string): Promise<ApiResponse<string>> {
    try {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/locations/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: parseInt(id)
        })
      })

      console.log('Delete location response status:', response.status)

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.text()
          console.log('Delete error response body:', errorData)
          errorMessage += ` - ${errorData}`
        } catch (e) {
          console.log('Could not read error response body')
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Delete location success response:', data)

      if (data.status_code === 200) {
        return successResponse(data.data, data.message || 'Location deleted successfully')
      } else {
        return errorResponse(data.message || 'Failed to delete location')
      }
    } catch (error) {
      console.error('Delete location error:', error)
      return errorResponse('Network error while deleting location', [(error as Error).message])
    }
  },

  /**
   * Activate or deactivate a location
   */
  async activateLocation(locationId: string | number, isActive: boolean): Promise<ApiResponse<string>> {
    try {
      console.log('API - Updating location activation status:', { locationId, isActive })

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/locations/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: Number(locationId),
          is_active: isActive
        })
      })

      console.log('API - Activate location response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Activate location success response:', data)

      if (data.status_code === 200) {
        return successResponse(data.data, data.message)
      } else {
        return errorResponse(data.message || 'Failed to update location status', data.errors)
      }
    } catch (error) {
      console.error('API - Activate location error:', error)
      return errorResponse('Network error while updating location status', [(error as Error).message])
    }
  }
}

// ============================================================================
// FACILITY API
// ============================================================================

export const facilityApi = {
  /**
   * Get all facilities
   */
  async getAllFacilities(): Promise<ApiResponse<Facility[]>> {
    try {
      console.log('API - Fetching all facilities...')
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/facility-type/get-facility-type-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('API - Get facilities response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API - Get facilities response data:', data)

      if (data.status_code === 200 && data.data) {
        // Transform API response to match our Facility interface
        const facilities: Facility[] = data.data.map((facility: any, index: number) => ({
          id: facility.facility_id,
          name: facility.facility_name || facility.name || '',
          status: facility.is_active ? 'active' : 'inactive',
          Icon: facility.Icon || facility.icon || ''
        }))

        console.log('API - Transformed facilities:', facilities)
        return successResponse(facilities, data.message || 'Facilities retrieved successfully')
      } else {
        console.error('API - Failed to load facilities:', data.message)
        return errorResponse(data.message || 'Failed to load facilities')
      }
    } catch (error) {
      console.error('Get facilities error:', error)
      return errorResponse('Network error while fetching facilities', [(error as Error).message])
    }
  },

  /**
   * Get facility by ID
   */
  async getFacilityById(id: string): Promise<ApiResponse<Facility>> {
    await delay(500)

    return errorResponse('Facility not found')
  },

  /**
   * Create a new facility
   */
  async createFacility(facilityData: { FacilityName: string; IsActive: boolean; Icon?: string; }): Promise<ApiResponse<null>> {
    try {
      // Create FormData as required by the API
      const formData = new FormData()
      formData.append('FacilityName', facilityData.FacilityName)
      formData.append('IsActive', facilityData.IsActive.toString())

      // Add Icon if provided
      if (facilityData.Icon) {
        formData.append('Icon', facilityData.Icon)
      }

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/facility-type/create-facility-type`, {
        method: 'POST',
        body: formData
        // Note: Don't set Content-Type header for FormData - browser will set it automatically with boundary
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status_code === 200) {
        return successResponse(null, data.message || 'Facility created successfully')
      } else {
        return errorResponse(data.message || 'Failed to create facility')
      }
    } catch (error) {
      console.error('Create facility error:', error)
      return errorResponse('Network error while creating facility', [(error as Error).message])
    }
  },

  /**
   * Update an existing facility
   */
  async updateFacility(id: string, facilityData: { FacilityName: string; IsActive: boolean; Icon?: string; }): Promise<ApiResponse<null>> {
    try {
      console.log('API - Updating facility with ID:', id)
      console.log('API - Facility data:', facilityData)

      // Check if ID is valid
      if (!id) {
        console.error('API - Invalid facility ID:', id)
        return errorResponse('Invalid facility ID')
      }

      // Create FormData as required by the API and include Id field per backend requirements
      const formData = new FormData()
      formData.append('Id', id)
      formData.append('FacilityName', facilityData.FacilityName)
      formData.append('IsActive', facilityData.IsActive.toString())

      // Add Icon if provided
      if (facilityData.Icon) {
        formData.append('Icon', facilityData.Icon)
      }

      // Log the FormData entries
      console.log('API - FormData entries:')
      for (const pair of formData.entries()) {
        console.log('API -', pair[0], pair[1])
      }

      // POST to endpoint (backend expects Id in form-data rather than URL param)
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/facility-type/update-facility-type`, {
        method: 'POST',
        body: formData
        // Note: Don't set Content-Type header for FormData - browser will set it automatically with boundary
      })

      console.log('API - Update facility response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          // Try to parse the error response as JSON
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Update facility response data:', data)

      if (data.status_code === 200) {
        return successResponse(null, data.message || 'Facility updated successfully')
      } else {
        return errorResponse(data.message || 'Failed to update facility')
      }
    } catch (error) {
      console.error('API - Update facility error:', error)
      return errorResponse('Network error while updating facility', [(error as Error).message])
    }
  },

  /**
   * Update facility status (active/inactive)
   */
  async updateFacilityStatus(id: string, isActive: boolean, facilityName?: string): Promise<ApiResponse<null>> {
    try {
      console.log('API - Updating facility status with ID:', id, 'isActive:', isActive, 'name:', facilityName)

      // Check if ID is valid
      if (!id) {
        console.error('API - Invalid facility ID:', id)
        return errorResponse('Invalid facility ID')
      }

      // Create FormData with all required fields
      const formData = new FormData()
      formData.append('Id', id)
      formData.append('IsActive', isActive.toString())
      // Use provided facility name or a placeholder
      formData.append('FacilityName', facilityName || 'Facility Status Update')

      console.log('API - FormData entries for status update:')
      for (const pair of formData.entries()) {
        console.log('API -', pair[0], pair[1])
      }

      // Use the same endpoint as regular updates since update-facility-type-status doesn't exist
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/facility-type/update-facility-type`, {
        method: 'POST',
        body: formData
        // Note: Don't set Content-Type header for FormData - browser will set it automatically with boundary
      })

      console.log('API - Update facility status response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Update facility status response data:', data)

      if (data.status_code === 200) {
        return successResponse(null, data.message || 'Facility status updated successfully')
      } else {
        return errorResponse(data.message || 'Failed to update facility status')
      }
    } catch (error) {
      console.error('API - Update facility status error:', error)
      return errorResponse('Network error while updating facility status', [(error as Error).message])
    }
  },

  /**
   * Delete a facility
   */
  async deleteFacility(id: string): Promise<ApiResponse<null>> {
    try {
      console.log('API - Deleting facility with ID:', id)

      // Check if ID is valid
      if (!id) {
        console.error('API - Invalid facility ID:', id)
        return errorResponse('Invalid facility ID')
      }

      // Create JSON payload with the facility ID
      const payload = {
        Id: parseInt(id) // Convert to number as expected by backend
      }

      console.log('API - Delete payload:', payload)

      // Use delete-facility-type endpoint with JSON
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/facility-type/delete-facility-type`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      console.log('API - Delete facility response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Delete facility response data:', data)

      if (data.status_code === 200) {
        return successResponse(null, data.message || 'Facility deleted successfully')
      } else {
        return errorResponse(data.message || 'Failed to delete facility')
      }
    } catch (error) {
      console.error('API - Delete facility error:', error)
      return errorResponse('Network error while deleting facility', [(error as Error).message])
    }
  }
}

// ============================================================================
// PRODUCT API
// ============================================================================

// Helper function to map API product types to our valid types
const mapProductType = (apiType: string): 'Meeting Room' | 'Hot Desk' | 'Dedicated Desk' => {
  if (!apiType) return 'Meeting Room'
  
  const normalizedType = apiType.toLowerCase().trim()
  
  if (normalizedType.includes('meeting') || normalizedType.includes('conference') || normalizedType.includes('room')) {
    return 'Meeting Room'
  } else if (normalizedType.includes('hot') || normalizedType.includes('hotdesk') || normalizedType.includes('hot desk')) {
    return 'Hot Desk'
  } else if (normalizedType.includes('dedicated') || normalizedType.includes('fixed') || normalizedType.includes('private desk')) {
    return 'Dedicated Desk'
  }
  
  // Default fallback
  return 'Meeting Room'
}

export const productApi = {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    try {
      console.log('API - Fetching products from server...')

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/product/admin-get-product-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })

      console.log('API - Get products response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Get products success response:', data)

      if (data.status_code === 200) {
        // Transform the API response data to match our Product interface if needed
        const products = data.data || []
        
        // Apply transformations to each product
        const transformedProducts = products.map((apiProduct: any) => ({
          ...apiProduct,
          locationName: apiProduct.location_name || 'Unknown Location',
          locationAddress: apiProduct.address || apiProduct.location_address || 'Unknown Address',
          companyName: apiProduct.company_name || 'Unknown Company',
          companyId: apiProduct.company_id || 'unknown',
          locationId: apiProduct.location_id || 'unknown',
          maxSeatingCapacity: apiProduct.capacity || 1,
          status: (apiProduct.is_active === true || apiProduct.is_active === 1) ? 'active' : 'inactive',
          type: mapProductType(apiProduct.type || apiProduct.product_type || apiProduct.category || apiProduct.ProductType || apiProduct.productType),
          openDays: apiProduct.openDays || [],
          openHours: apiProduct.openHours || { start: '09:00', end: '17:00' },
          defaultFacilities: apiProduct.facilities || [],
          additionalFacilities: apiProduct.additionalFacilities || []
        }))
        
        return successResponse(transformedProducts, data.message || 'Products retrieved successfully')
      } else {
        return errorResponse(data.message || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('API - Get products error:', error)
      return errorResponse('Network error while fetching products', [(error as Error).message])
    }
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      console.log('API - Fetching product by ID:', id)

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/product/get-product-by-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: parseInt(id) // Convert string ID to number as expected by API
        })
      })

      console.log('API - Get product by ID response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Get product by ID success response:', data)

      if (data.status_code === 200) {
        // Transform the API response data to match our Product interface if needed
        const product = data.data
        if (product) {
          // Apply comprehensive transformations for the product detail
          const transformedProduct: Product = {
            id: product.id?.toString() || '',
            name: product.name || '',
            type: mapProductType(product.type),
            description: product.product_description || product.description || '',
            locationName: product.location_name || 'Unknown Location',
            locationAddress: product.address || 'Unknown Address',
            companyName: product.company_name || 'Unknown Company',
            companyId: product.company_id?.toString() || 'unknown',
            locationId: product.location_id?.toString() || 'unknown',
            maxSeatingCapacity: product.capacity || 1,
            status: (product.is_active === true || product.is_active === 1) ? 'active' as const : 'inactive' as const,
            
            // Pricing - extract from pricing array
            pricePerHour: product.pricing?.[0]?.hourly || 0,
            pricePerDay: product.pricing?.[0]?.daily || 0,
            pricePerMonth: product.pricing?.[0]?.monthly || 0,
            pricePerYear: product.pricing?.[0]?.yearly || 0,
            
            // Images - convert relative paths to full URLs
            images: (product.images || []).map((img: string) => 
              img.startsWith('/') ? `${API_CONFIG.BASE_URL}${img}` : img
            ),
            
            // Operating hours
            openHours: {
              start: product.start_operation_time || '09:00:00',
              end: product.end_operation_time || '17:00:00'
            },
            
            // Open days - extract from operation_schedule
            openDays: (product.operation_schedule || [])
              .filter((schedule: any) => schedule.is_enabled)
              .map((schedule: any) => schedule.day),
            
            // Operation schedule
            operation_schedule: product.operation_schedule || [],
            
            // Default facilities
            defaultFacilities: (product.default_facilities || []).map((facility: any) => 
              facility.facility_name || facility.name || facility
            ),
            
            // Additional facilities
            additionalFacilities: (product.additional_facilities || []).map((facility: any) => ({
              id: facility.facility_id?.toString() || facility.id?.toString() || Math.random().toString(),
              name: facility.facility_name || facility.name || '',
              pricePerHour: facility.hourly_price || facility.pricePerHour || 0,
              pricePerDay: facility.daily_price || facility.pricePerDay || 0,
              pricePerMonth: facility.monthly_price || facility.pricePerMonth || 0,
              pricePerYear: facility.yearly_price || facility.pricePerYear || 0
            })),
            
            // Additional fields from API (excluding recent_ratings)
            totalReviews: product.total_reviews || 0,
            averageRating: product.average_rating || 0,
            locationUrl: product.location_url || ''
            // Note: recent_ratings is intentionally excluded
          }
          return successResponse(transformedProduct, data.message || 'Product retrieved successfully')
        } else {
          return errorResponse('Product not found')
        }
      } else {
        return errorResponse(data.message || 'Failed to fetch product')
      }
    } catch (error: any) {
      console.error('API - Get product by ID error:', error)
      return errorResponse('Network error while fetching product', [error.message])
    }
  },

  /**
   * Create a new product
   */
  async createProduct(productData: {
    LocationId: string
    ProductType: string
    ProductName: string
    Description: string
    MaxSeatingCapacity: number
    PricePerHour?: number
    PricePerDay?: number
    PricePerMonth?: number
    PricePerYear?: number
    OpeningTime: string
    ClosingTime: string
    DefaultFacilities: Number[]
    AdditionalFacilities: Array<{
      id: number
      name: string
      pricePerHour: number
      pricePerDay: number
      pricePerMonth: number
      pricePerYear: number
    }>
    Images?: string[]
    IsActive?: boolean
    OperationTime: {
      IsMonday: boolean
      IsTuesday: boolean
      IsWednesday: boolean
      IsThursday: boolean
      IsFriday: boolean
      IsSaturday: boolean
      IsSunday: boolean
      MondayStart: string
      MondayEnd: string
      TuesdayStart: string
      TuesdayEnd: string
      WednesdayStart: string
      WednesdayEnd: string
      ThursdayStart: string
      ThursdayEnd: string
      FridayStart: string
      FridayEnd: string
      SaturdayStart: string
      SaturdayEnd: string
      SundayStart: string
      SundayEnd: string
    }
  }): Promise<ApiResponse<string>> {
    try {
      console.log('API - Creating product with data:', productData)

      // Create FormData as required by the API
      const formData = new FormData()
      formData.append('LocationId', productData.LocationId)
      formData.append('Type', productData.ProductType)
      formData.append('Name', productData.ProductName)
      formData.append('Description', productData.Description)
      formData.append('Capacity', productData.MaxSeatingCapacity.toString())
      
      // Add pricing based on product type
      if (productData.PricePerHour !== undefined) {
        formData.append('Hourly', productData.PricePerHour.toString())
      }
      if (productData.PricePerDay !== undefined) {
        formData.append('Daily', productData.PricePerDay.toString())
      }
      if (productData.PricePerMonth !== undefined) {
        formData.append('Monthly', productData.PricePerMonth.toString())
      }
      if (productData.PricePerYear !== undefined) {
        formData.append('Yearly', productData.PricePerYear.toString())
      }
      
      formData.append('StartOperationTime', productData.OpeningTime)
      formData.append('EndOperationTime', productData.ClosingTime)
      
      // Add operation time details
      formData.append('OperationTime.IsMonday', productData.OperationTime.IsMonday.toString())
      formData.append('OperationTime.IsTuesday', productData.OperationTime.IsTuesday.toString())
      formData.append('OperationTime.IsWednesday', productData.OperationTime.IsWednesday.toString())
      formData.append('OperationTime.IsThursday', productData.OperationTime.IsThursday.toString())
      formData.append('OperationTime.IsFriday', productData.OperationTime.IsFriday.toString())
      formData.append('OperationTime.IsSaturday', productData.OperationTime.IsSaturday.toString())
      formData.append('OperationTime.IsSunday', productData.OperationTime.IsSunday.toString())
      formData.append('OperationTime.MondayStart', productData.OperationTime.MondayStart)
      formData.append('OperationTime.MondayEnd', productData.OperationTime.MondayEnd)
      formData.append('OperationTime.TuesdayStart', productData.OperationTime.TuesdayStart)
      formData.append('OperationTime.TuesdayEnd', productData.OperationTime.TuesdayEnd)
      formData.append('OperationTime.WednesdayStart', productData.OperationTime.WednesdayStart)
      formData.append('OperationTime.WednesdayEnd', productData.OperationTime.WednesdayEnd)
      formData.append('OperationTime.ThursdayStart', productData.OperationTime.ThursdayStart)
      formData.append('OperationTime.ThursdayEnd', productData.OperationTime.ThursdayEnd)
      formData.append('OperationTime.FridayStart', productData.OperationTime.FridayStart)
      formData.append('OperationTime.FridayEnd', productData.OperationTime.FridayEnd)
      formData.append('OperationTime.SaturdayStart', productData.OperationTime.SaturdayStart)
      formData.append('OperationTime.SaturdayEnd', productData.OperationTime.SaturdayEnd)
      formData.append('OperationTime.SundayStart', productData.OperationTime.SundayStart)
      formData.append('OperationTime.SundayEnd', productData.OperationTime.SundayEnd)
      
      // Add default facilities - send as individual array entries
      productData.DefaultFacilities.forEach((facilityId, index) => {
        formData.append(`DefaultFacilities[${index}]`, facilityId.toString())
      })
      
      // Transform and add additional facilities in the required format
      // Convert from frontend format to API format: [{"FacilityId":1,"HourlyPrice":150.00}]
      const transformedAdditionalFacilities = productData.AdditionalFacilities.map(facility => ({
        FacilityId: facility.id,
        HourlyPrice: facility.pricePerHour || 0
      }))
      
      formData.append('AdditionalFacilities', JSON.stringify(transformedAdditionalFacilities))
      
      // Add images if provided - convert base64 to files
      if (productData.Images && productData.Images.length > 0) {
        console.log('API - Processing', productData.Images.length, 'images')
        
        // Convert base64 images to File objects and add them to FormData
        productData.Images.forEach((base64String, index) => {
          try {
            // Extract the base64 data and mime type
            const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
            if (matches && matches.length === 3) {
              const mimeType = matches[1]
              const base64Data = matches[2]
              
              // Convert base64 to binary
              const binaryString = atob(base64Data)
              const bytes = new Uint8Array(binaryString.length)
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
              }
              
              // Create a File object
              const fileExtension = mimeType.split('/')[1] || 'jpg'
              const fileName = `product_image_${index + 1}.${fileExtension}`
              const file = new File([bytes], fileName, { type: mimeType })
              
              // Add the file to FormData
              formData.append('Images', file)
              console.log('API - Added image file:', fileName, 'size:', file.size, 'bytes')
            } else {
              console.warn('API - Invalid base64 format for image', index)
            }
          } catch (error) {
            console.error('API - Error processing image', index, ':', error)
          }
        })
      }
      
      // Set status - use IsActive if provided, otherwise default to true (active)
      const isActiveValue = productData.IsActive !== undefined 
        ? productData.IsActive 
        : true
      formData.append('IsActive', isActiveValue.toString())

      // Debug: Log the FormData contents
      console.log('API - FormData contents:')
      for (const [key, value] of formData.entries()) {
        console.log('API -', key, ':', value)
      }

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/product/create-product`, {
        method: 'POST',
        body: formData
      })

      console.log('API - Create product response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Create product success response:', data)

      if (data.status_code === 200) {
        return successResponse(data.data, data.message || 'Product created successfully')
      } else {
        return errorResponse(data.message || 'Failed to create product')
      }
    } catch (error) {
      console.error('API - Create product error:', error)
      return errorResponse('Network error while creating product', [(error as Error).message])
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(id: string, productData: {
    LocationId: string
    ProductType: string
    ProductName: string
    Description: string
    MaxSeatingCapacity: number
    PricePerHour?: number
    PricePerDay?: number
    PricePerMonth?: number
    PricePerYear?: number
    OpeningTime: string
    ClosingTime: string
    DefaultFacilities: Number[]
    AdditionalFacilities: Array<{
      id: number
      name: string
      pricePerHour: number
      pricePerDay: number
      pricePerMonth: number
      pricePerYear: number
    }>
    Images?: string[]
    IsActive?: boolean
    OperationTime: {
      IsMonday: boolean
      IsTuesday: boolean
      IsWednesday: boolean
      IsThursday: boolean
      IsFriday: boolean
      IsSaturday: boolean
      IsSunday: boolean
      MondayStart: string
      MondayEnd: string
      TuesdayStart: string
      TuesdayEnd: string
      WednesdayStart: string
      WednesdayEnd: string
      ThursdayStart: string
      ThursdayEnd: string
      FridayStart: string
      FridayEnd: string
      SaturdayStart: string
      SaturdayEnd: string
      SundayStart: string
      SundayEnd: string
    }
  }): Promise<ApiResponse<any>> {
    try {
      console.log('API - Updating product with ID:', id)
      console.log('API - Update product data:', productData)
      
      // Create FormData for multipart/form-data request
      const formData = new FormData()
      
      // Add product ID for the update
      formData.append('id', Number(id).toString())
      
      // Basic product information
      formData.append('LocationId', productData.LocationId)
      formData.append('Type', productData.ProductType)
      formData.append('Name', productData.ProductName)
      formData.append('Description', productData.Description)
      formData.append('Capacity', productData.MaxSeatingCapacity.toString())
      
      // Pricing - only append if value exists and is greater than 0
      if (productData.PricePerHour && productData.PricePerHour > 0) {
        formData.append('Hourly', productData.PricePerHour.toString())
      }
      if (productData.PricePerDay && productData.PricePerDay > 0) {
        formData.append('Daily', productData.PricePerDay.toString())
      }
      if (productData.PricePerMonth && productData.PricePerMonth > 0) {
        formData.append('Monthly', productData.PricePerMonth.toString())
      }
      if (productData.PricePerYear && productData.PricePerYear > 0) {
        formData.append('Yearly', productData.PricePerYear.toString())
      }
      
      // Operating hours
      formData.append('StartOperationTime', productData.OpeningTime)
      formData.append('EndOperationTime', productData.ClosingTime)
      
      // Operation schedule for each day
      formData.append('OperationTime.IsMonday', productData.OperationTime.IsMonday.toString())
      formData.append('OperationTime.IsTuesday', productData.OperationTime.IsTuesday.toString())
      formData.append('OperationTime.IsWednesday', productData.OperationTime.IsWednesday.toString())
      formData.append('OperationTime.IsThursday', productData.OperationTime.IsThursday.toString())
      formData.append('OperationTime.IsFriday', productData.OperationTime.IsFriday.toString())
      formData.append('OperationTime.IsSaturday', productData.OperationTime.IsSaturday.toString())
      formData.append('OperationTime.IsSunday', productData.OperationTime.IsSunday.toString())
      
      // Time slots for each day
      formData.append('OperationTime.MondayStart', productData.OperationTime.MondayStart)
      formData.append('OperationTime.MondayEnd', productData.OperationTime.MondayEnd)
      formData.append('OperationTime.TuesdayStart', productData.OperationTime.TuesdayStart)
      formData.append('OperationTime.TuesdayEnd', productData.OperationTime.TuesdayEnd)
      formData.append('OperationTime.WednesdayStart', productData.OperationTime.WednesdayStart)
      formData.append('OperationTime.WednesdayEnd', productData.OperationTime.WednesdayEnd)
      formData.append('OperationTime.ThursdayStart', productData.OperationTime.ThursdayStart)
      formData.append('OperationTime.ThursdayEnd', productData.OperationTime.ThursdayEnd)
      formData.append('OperationTime.FridayStart', productData.OperationTime.FridayStart)
      formData.append('OperationTime.FridayEnd', productData.OperationTime.FridayEnd)
      formData.append('OperationTime.SaturdayStart', productData.OperationTime.SaturdayStart)
      formData.append('OperationTime.SaturdayEnd', productData.OperationTime.SaturdayEnd)
      formData.append('OperationTime.SundayStart', productData.OperationTime.SundayStart)
      formData.append('OperationTime.SundayEnd', productData.OperationTime.SundayEnd)
      
      // Add default facilities - send as individual array entries
      productData.DefaultFacilities.forEach((facilityId, index) => {
        formData.append(`DefaultFacilities[${index}]`, facilityId.toString())
      })
      
      // Transform and add additional facilities in the required format
      // Convert from frontend format to API format: [{"FacilityId":1,"HourlyPrice":150.00}]
      const transformedAdditionalFacilities = productData.AdditionalFacilities.map(facility => ({
        FacilityId: facility.id,
        HourlyPrice: facility.pricePerHour || 0
      }))
      
      formData.append('AdditionalFacilities', JSON.stringify(transformedAdditionalFacilities))
      
      // Add images if provided - convert base64 to files
      if (productData.Images && productData.Images.length > 0) {
        console.log('API - Processing', productData.Images.length, 'images for update')
        
        // Convert base64 images to File objects and add them to FormData
        productData.Images.forEach((base64String, index) => {
          try {
            // Extract the base64 data and mime type
            const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
            if (matches && matches.length === 3) {
              const mimeType = matches[1]
              const base64Data = matches[2]
              
              // Convert base64 to binary
              const binaryString = atob(base64Data)
              const bytes = new Uint8Array(binaryString.length)
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
              }
              
              // Create a File object
              const file = new File([bytes], `image_${index}.${mimeType.split('/')[1]}`, { type: mimeType })
              formData.append('Images', file)
            } else if (base64String.startsWith('http')) {
              // Handle existing image URLs - these will be kept as-is by the backend
              console.log('API - Keeping existing image URL:', base64String)
            } else {
              console.warn('API - Invalid image format for index', index, ':', base64String.substring(0, 50))
            }
          } catch (error) {
            console.error('API - Error processing image', index, ':', error)
          }
        })
      }
      
      // Set status - use IsActive if provided, otherwise default to true (active)
      const isActiveValue = productData.IsActive !== undefined 
        ? productData.IsActive 
        : true
      formData.append('IsActive', isActiveValue.toString())

      // Debug: Log the FormData contents
      console.log('API - Update FormData contents:')
      for (const [key, value] of formData.entries()) {
        console.log('API -', key, ':', value)
      }

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/product/update-product`, {
        method: 'POST',
        body: formData
      })

      console.log('API - Update product response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Update product success response:', data)

      if (data.status_code === 200) {
        return successResponse(data.data, data.message || 'Product updated successfully')
      } else {
        return errorResponse(data.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('API - Update product error:', error)
      return errorResponse('Network error while updating product', [(error as Error).message])
    }
  },

  /**
   * Activate or deactivate a product
   */
  async activateProduct(productId: string | number, isActive: boolean): Promise<ApiResponse<string>> {
    try {
      console.log('API - Updating product activation status:', { productId, isActive })

      const response = await fetch(buildApiUrl('/product/activate-product'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: Number(productId),
          is_active: isActive
        })
      })

      console.log('API - Activate product response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Activate product success response:', data)

      if (data.status_code === 200) {
        return successResponse(data.data, data.message)
      } else {
        return errorResponse(data.message || 'Failed to update product status', data.errors)
      }
    } catch (error) {
      console.error('API - Activate product error:', error)
      return errorResponse('Network error while updating product status', [(error as Error).message])
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(productId: string | number): Promise<ApiResponse<string>> {
    try {
      console.log('API - Deleting product:', { productId })

      const response = await fetch(buildApiUrl('/product/delete-product'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: Number(productId)
        })
      })

      console.log('API - Delete product response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          return errorResponse(errorJson.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API - Delete product success response:', data)

      if (data.status_code === 200) {
        return successResponse(data.data, data.message)
      } else {
        return errorResponse(data.message || 'Failed to delete product', data.errors)
      }
    } catch (error) {
      console.error('API - Delete product error:', error)
      return errorResponse('Network error while deleting product', [(error as Error).message])
    }
  }
}

// ============================================================================
// PAYMENT API
// ============================================================================

export const paymentApi = {
  /**
   * Get all payments
   */
  async getAllPayments(filters?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<ApiResponse<Payment[]>> {
    await delay(600)

    return {
      success: true,
      data: [],
      pagination: {
        currentPage: filters?.page || 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: filters?.limit || 10
      }
    }
  },

  /**
   * Get payment by ID
   */
  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    await delay(500)

    return errorResponse('Payment not found')
  }
}

// ============================================================================
// MESSAGING API
// ============================================================================

export const messageApi = {
  /**
   * Send message to customer
   */
  async sendMessage(messageData: Omit<Message, 'id' | 'sentAt' | 'status'>): Promise<ApiResponse<Message>> {
    await delay(1000)

    // Mock API call - replace with real implementation
    // const response = await fetch('/api/messages/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(messageData)
    // })

    const message: Message = {
      id: `MSG-${Date.now()}`,
      ...messageData,
      sentAt: new Date().toISOString(),
      status: 'sent'
    }

  // Store message for audit
  const sentMessages = JSON.parse(localStorage.getItem('sentCustomerMessages') || '[]')
  sentMessages.push(message)
  localStorage.setItem('sentCustomerMessages', JSON.stringify(sentMessages))
  return successResponse(message, 'Message sent successfully')
  },

  /**
   * Get all sent messages
   */
  async getAllMessages(): Promise<ApiResponse<Message[]>> {
    await delay(500)

    const messages = JSON.parse(localStorage.getItem('sentCustomerMessages') || '[]')
    return successResponse(messages)
  }
}

// ============================================================================
// ============================================================================
// DASHBOARD STATS API
// ============================================================================

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(800)

    // Mock API call - replace with real implementation
    const stats: DashboardStats = {
      totalBookings: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      totalSubscriptions: 0,
      activeBookings: 0,
      pendingPayments: 0,
      cancellationRequests: JSON.parse(localStorage.getItem('cancellationRequests') || '[]').length,
      occupancyRate: 75, // Mock calculation
      monthlyGrowth: {
        bookings: 12.5,
        revenue: 18.3,
        customers: 8.7
      }
    }

    return successResponse(stats)
  },

  /**
   * Search across all entities
   */
  async globalSearch(query: string): Promise<ApiResponse<{
    bookings: Booking[]
    customers: Customer[]
    companies: Company[]
    locations: Location[]
  }>> {
    await delay(600)

    const searchTerm = query.toLowerCase()

    // For now, return empty arrays since MockDataStore is removed
    const bookings: Booking[] = []
    const customers: Customer[] = []
    const companies: Company[] = []

    // TODO: Implement API call to fetch and filter locations
    // const locations = MockDataStore.getInstance().getLocations()
    //   .filter(l => 
    //     l.name.toLowerCase().includes(searchTerm) ||
    //     l.city.toLowerCase().includes(searchTerm)
    //   )

    // For now, return empty array since mock data is removed
    const locations: Location[] = []

    return successResponse({
      bookings,
      customers,
      companies,
      locations
    })
  }
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Create HTTP client with common configuration
 * Use this when implementing real API calls
 */
export const createHttpClient = (baseURL: string) => {
  const client = {
    get: async (url: string, headers?: Record<string, string>) => {
      const token = localStorage.getItem('authToken')
      return fetch(`${baseURL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...headers
        }
      })
    },
    
    post: async (url: string, data?: any, headers?: Record<string, string>) => {
      const token = localStorage.getItem('authToken')
      return fetch(`${baseURL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...headers
        },
        body: data ? JSON.stringify(data) : undefined
      })
    },
    
    put: async (url: string, data?: any, headers?: Record<string, string>) => {
      const token = localStorage.getItem('authToken')
      return fetch(`${baseURL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...headers
        },
        body: data ? JSON.stringify(data) : undefined
      })
    },
    
    delete: async (url: string, headers?: Record<string, string>) => {
      const token = localStorage.getItem('authToken')
      return fetch(`${baseURL}${url}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          ...headers
        }
      })
    }
  }
  
  return client
}

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: 'http://192.168.56.1:9011',
  API_BASE_URL: 'http://192.168.56.1:9011/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
}

/**
 * Pre-configured HTTP client using the default API base URL
 */
export const apiClient = createHttpClient(API_CONFIG.API_BASE_URL)

/**
 * Utility function to build API URLs
 * @param endpoint - The API endpoint (e.g., '/locations/get-all')
 * @returns Full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${API_CONFIG.API_BASE_URL}${cleanEndpoint}`
}

/**
 * Utility function to build base URLs
 * @param path - The path (e.g., '/uploads/image.jpg')
 * @returns Full base URL
 */
export const buildBaseUrl = (path: string): string => {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_CONFIG.BASE_URL}${cleanPath}`
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

// Export will be added at the end of the file after all APIs are defined

export default {
  auth: authApi,
  booking: bookingApi,
  subscription: subscriptionApi,
  customer: customerApi,
  company: companyApi,
  location: locationApi,
  facility: facilityApi,
  product: productApi,
  payment: paymentApi,
  message: messageApi,
  dashboard: dashboardApi
}
