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
  address: string
  city: string
  country: string
  phone: string
  email: string
  manager: string
  totalSpaces: number
  availableSpaces: number
  facilities: string[]
  mapUrl?: string
  status: 'active' | 'inactive'
}

export interface Facility {
  id: string
  name: string
  description: string
  type: string
  location: string
  capacity: number
  pricePerHour: number
  status: 'active' | 'inactive' | 'maintenance'
  amenities: string[]
  images: string[]
  bookings?: number
}

export interface Product {
  id: string
  name: string
  type: 'Meeting Room' | 'Hot Desk' | 'Dedicated Desk' | 'Private Office'
  description: string
  pricePerHour: number
  capacity: number
  facilities: string[]
  location: string
  status: 'active' | 'inactive'
  images: string[]
  availability: {
    [key: string]: boolean // date -> available
  }
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

// Mock data for development - replace with real API calls
class MockDataStore {
  private static instance: MockDataStore
  
  // Sample data
  private mockBookings: Booking[] = [
    {
      id: 'BR-2034',
      productName: 'Executive Meeting Room',
      productType: 'Meeting Room',
      productId: 'PROD001',
      productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+1 (555) 123-4567',
      userType: 'registered',
      date: '2025-08-20',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      duration: '2 hours',
      totalPrice: 100,
      basePrice: 100,
      additionalFacilities: 0,
      taxes: 0,
      status: 'confirmed',
      location: 'main-branch',
      locationName: 'Main Branch',
      companyName: 'Premium Co-working Ltd.',
      capacity: 12,
      facilities: ['WiFi', 'Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning']
    },
    {
      id: 'SUB-3001',
      productName: 'Monthly Dedicated Desk',
      productType: 'Subscription',
      productId: 'SUB001',
      productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      customerPhone: '+1 (555) 987-6543',
      userType: 'registered',
      date: '2025-08-01',
      startTime: '8:00 AM',
      endTime: '6:00 PM',
      duration: 'Monthly',
      totalPrice: 800,
      basePrice: 750,
      additionalFacilities: 50,
      taxes: 0,
      status: 'confirmed',
      location: 'main-branch',
      locationName: 'Main Branch',
      companyName: 'Premium Co-working Ltd.',
      subscriptionType: 'monthly',
      subscribedDate: '2025-08-01',
      nextBillingDate: '2025-09-01',
      capacity: 1,
      facilities: ['High-speed WiFi', 'Storage Locker', '24/7 Access', 'Printing Credits']
    }
  ]

  private mockCustomers: Customer[] = [
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
      country: 'USA',
      totalSpent: 2850
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
      country: 'USA',
      totalSpent: 1650
    }
  ]

  private mockCompanies: Company[] = [
    {
      id: 1,
      name: 'WorkHub Co.',
      registrationNumber: 'REG-001-2024',
      address: '123 Business St, New York, NY 10001',
      city: 'New York',
      country: 'USA',
      contactPerson: 'John Smith',
      email: 'john@workhub.com',
      phone: '+1 (555) 123-4567',
      totalSpaces: 15,
      status: 'active',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center'
    }
  ]

  private mockLocations: Location[] = [
    {
      id: 'LOC-001',
      name: 'Main Branch',
      address: '123 Business Avenue, Downtown',
      city: 'New York',
      country: 'USA',
      phone: '+1 (555) 123-4567',
      email: 'main@example.com',
      manager: 'John Smith',
      totalSpaces: 50,
      availableSpaces: 23,
      facilities: ['WiFi', 'Parking', 'Kitchen', 'Meeting Rooms'],
      mapUrl: 'https://maps.google.com/example1',
      status: 'active'
    }
  ]

  private mockFacilities: Facility[] = [
    {
      id: 'FAC-001',
      name: 'Conference Room A',
      description: 'Large conference room with video conferencing capabilities',
      type: 'Meeting Room',
      location: 'main-branch',
      capacity: 12,
      pricePerHour: 50,
      status: 'active',
      amenities: ['Video Conference', 'Projector', 'Whiteboard', 'WiFi'],
      images: ['https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=300&fit=crop'],
      bookings: 8
    }
  ]

  private mockProducts: Product[] = [
    {
      id: 'PROD001',
      name: 'Executive Meeting Room',
      type: 'Meeting Room',
      description: 'Premium meeting room with all modern amenities',
      pricePerHour: 50,
      capacity: 12,
      facilities: ['WiFi', 'Projector', 'Whiteboard', 'Video Conference'],
      location: 'main-branch',
      status: 'active',
      images: ['https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=300&fit=crop'],
      availability: {
        '2025-08-21': true,
        '2025-08-22': false,
        '2025-08-23': true
      }
    }
  ]

  private mockPayments: Payment[] = [
    {
      id: 'PAY-001',
      bookingId: 'BR-2034',
      customerName: 'John Doe',
      amount: 100,
      status: 'paid',
      paymentMethod: 'card',
      transactionDate: '2025-08-20T10:30:00Z',
      description: 'Executive Meeting Room - 2 hours',
      receiptUrl: '/receipts/PAY-001.pdf'
    }
  ]

  private mockUsers: User[] = [
    {
      id: 'USR-001',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-08-21T09:00:00Z',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
    }
  ]

  static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore()
    }
    return MockDataStore.instance
  }

  // Initialize data from localStorage if available
  constructor() {
    this.loadFromLocalStorage()
  }

  private loadFromLocalStorage() {
    try {
      const savedBookings = localStorage.getItem('allBookings')
      if (savedBookings) {
        this.mockBookings = JSON.parse(savedBookings)
      }

      const savedCustomers = localStorage.getItem('customers')
      if (savedCustomers) {
        this.mockCustomers = JSON.parse(savedCustomers)
      }

      // Load other data similarly if needed
    } catch (error) {
      console.warn('Error loading data from localStorage:', error)
    }
  }

  // Save data to localStorage for persistence
  private saveToLocalStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn('Error saving to localStorage:', error)
    }
  }

  // Data getters
  getBookings() { return [...this.mockBookings] }
  getCustomers() { return [...this.mockCustomers] }
  getCompanies() { return [...this.mockCompanies] }
  getLocations() { return [...this.mockLocations] }
  getFacilities() { return [...this.mockFacilities] }
  getProducts() { return [...this.mockProducts] }
  getPayments() { return [...this.mockPayments] }
  getUsers() { return [...this.mockUsers] }

  // Data setters
  updateBookings(bookings: Booking[]) {
    this.mockBookings = bookings
    this.saveToLocalStorage('allBookings', bookings)
  }

  updateCustomers(customers: Customer[]) {
    this.mockCustomers = customers
    this.saveToLocalStorage('customers', customers)
  }
}

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
      const user = MockDataStore.getInstance().getUsers()[0]
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
    let bookings = MockDataStore.getInstance().getBookings()

    // Apply filters
    if (filters?.status) {
      bookings = bookings.filter(b => b.status === filters.status)
    }
    if (filters?.location) {
      bookings = bookings.filter(b => b.location === filters.location)
    }
    if (filters?.customerType) {
      bookings = bookings.filter(b => b.userType === filters.customerType)
    }

    // Apply pagination
    const { data, pagination } = paginate(bookings, filters?.page, filters?.limit)

    return {
      success: true,
      data,
      pagination
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
    const booking = MockDataStore.getInstance().getBookings().find(b => b.id === id)

    if (booking) {
      return successResponse(booking)
    }

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
    const newBooking: Booking = {
      id: `BR-${Date.now()}`,
      ...bookingData,
      status: 'confirmed'
    }

    const bookings = MockDataStore.getInstance().getBookings()
    bookings.push(newBooking)
    MockDataStore.getInstance().updateBookings(bookings)

    return successResponse(newBooking, 'Booking created successfully')
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
    const bookings = MockDataStore.getInstance().getBookings()
    const bookingIndex = bookings.findIndex(b => b.id === id)

    if (bookingIndex === -1) {
      return errorResponse('Booking not found')
    }

    bookings[bookingIndex].status = status
    MockDataStore.getInstance().updateBookings(bookings)

    // Also update localStorage for immediate persistence
    const bookingStatuses = JSON.parse(localStorage.getItem('bookingStatuses') || '{}')
    bookingStatuses[id] = status
    localStorage.setItem('bookingStatuses', JSON.stringify(bookingStatuses))

    return successResponse(bookings[bookingIndex], 'Booking status updated successfully')
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
    const bookings = MockDataStore.getInstance().getBookings()
    const bookingIndex = bookings.findIndex(b => b.id === id)

    if (bookingIndex === -1) {
      return errorResponse('Booking not found')
    }

    const deletedBooking = bookings.splice(bookingIndex, 1)[0]
    MockDataStore.getInstance().updateBookings(bookings)

    // Log deletion for audit
    const deletedBookings = JSON.parse(localStorage.getItem('deletedBookings') || '[]')
    deletedBookings.push({
      ...deletedBooking,
      deletedAt: new Date().toISOString(),
      deletedBy: 'Admin'
    })
    localStorage.setItem('deletedBookings', JSON.stringify(deletedBookings))

    return successResponse(null, 'Booking deleted successfully')
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
    let subscriptions = MockDataStore.getInstance().getBookings()
      .filter(b => b.productType === 'Subscription')

    // Apply filters
    if (filters?.status) {
      subscriptions = subscriptions.filter(s => s.status === filters.status)
    }
    if (filters?.type) {
      subscriptions = subscriptions.filter(s => s.subscriptionType === filters.type)
    }

    const { data, pagination } = paginate(subscriptions, filters?.page, filters?.limit)

    return {
      success: true,
      data,
      pagination
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
    // Mock API call - replace with real implementation
    // const formData = new FormData()
    // formData.append('reason', cancellationData.reason)
    // if (cancellationData.paymentSlipFile) {
    //   formData.append('paymentSlip', cancellationData.paymentSlipFile)
    // }
    // const response = await fetch(`/api/subscriptions/${id}/cancel`, {
    //   method: 'POST',
    //   body: formData
    // })

    const subscription = MockDataStore.getInstance().getBookings().find(b => b.id === id)
    
    if (!subscription) {
      return errorResponse('Subscription not found')
    }

    // Create cancellation request
    const cancellationRequest: CancellationRequest = {
      id: `CANCEL-${Date.now()}`,
      bookingId: subscription.id,
      subscriptionId: id,
      customerName: subscription.customerName,
      reason: cancellationData.reason,
      additionalNotes: cancellationData.additionalNotes,
      refundRequested: cancellationData.refundRequested,
      paymentSlipUploaded: !!cancellationData.paymentSlipFile,
      paymentSlipFile: cancellationData.paymentSlipFile,
      requestDate: new Date().toISOString(),
      status: 'pending'
    }

    // Update subscription status
    await bookingApi.updateBookingStatus(id, 'cancelled')

    // Store cancellation request
    const cancellationRequests = JSON.parse(localStorage.getItem('cancellationRequests') || '[]')
    cancellationRequests.push(cancellationRequest)
    localStorage.setItem('cancellationRequests', JSON.stringify(cancellationRequests))

    return successResponse(cancellationRequest, 'Subscription cancellation request submitted successfully')
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
    let customers = MockDataStore.getInstance().getCustomers()

    // Apply filters
    if (filters?.status) {
      customers = customers.filter(c => c.status === filters.status)
    }
    if (filters?.type) {
      customers = customers.filter(c => c.customerType === filters.type)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      customers = customers.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.includes(search)
      )
    }

    const { data, pagination } = paginate(customers, filters?.page, filters?.limit)

    return {
      success: true,
      data,
      pagination
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
    const customer = MockDataStore.getInstance().getCustomers().find(c => c.id === id)

    if (customer) {
      return successResponse(customer)
    }

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
    const customers = MockDataStore.getInstance().getCustomers()
    const customerIndex = customers.findIndex(c => c.id === id)

    if (customerIndex === -1) {
      return errorResponse('Customer not found')
    }

    customers[customerIndex].status = status
    MockDataStore.getInstance().updateCustomers(customers)

    return successResponse(customers[customerIndex], 'Customer status updated successfully')
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
    const customer = MockDataStore.getInstance().getCustomers().find(c => c.id === customerId)
    if (!customer) {
      return errorResponse('Customer not found')
    }

    const bookings = MockDataStore.getInstance().getBookings()
      .filter(b => b.customerEmail === customer.email || b.customerName === customer.name)

    return successResponse(bookings, `Retrieved ${bookings.length} bookings for ${customer.name}`)
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

    const companies = MockDataStore.getInstance().getCompanies()
    return successResponse(companies)
  },

  /**
   * Get company by ID
   */
  async getCompanyById(id: number): Promise<ApiResponse<Company>> {
    await delay(500)

    const company = MockDataStore.getInstance().getCompanies().find(c => c.id === id)

    if (company) {
      return successResponse(company)
    }

    return errorResponse('Company not found')
  },

  /**
   * Create new company
   */
  async createCompany(companyData: Omit<Company, 'id'>): Promise<ApiResponse<Company>> {
    await delay(800)

    const companies = MockDataStore.getInstance().getCompanies()
    const maxId = Math.max(...companies.map(c => c.id), 0)
    
    const newCompany: Company = {
      id: maxId + 1,
      ...companyData
    }

    companies.push(newCompany)

    return successResponse(newCompany, 'Company created successfully')
  },

  /**
   * Update company
   */
  async updateCompany(id: number, companyData: Partial<Company>): Promise<ApiResponse<Company>> {
    await delay(800)

    const companies = MockDataStore.getInstance().getCompanies()
    const companyIndex = companies.findIndex(c => c.id === id)

    if (companyIndex === -1) {
      return errorResponse('Company not found')
    }

    companies[companyIndex] = { ...companies[companyIndex], ...companyData }

    return successResponse(companies[companyIndex], 'Company updated successfully')
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
    await delay(600)

    const locations = MockDataStore.getInstance().getLocations()
    return successResponse(locations)
  },

  /**
   * Get location by ID
   */
  async getLocationById(id: string): Promise<ApiResponse<Location>> {
    await delay(500)

    const location = MockDataStore.getInstance().getLocations().find(l => l.id === id)

    if (location) {
      return successResponse(location)
    }

    return errorResponse('Location not found')
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
    await delay(600)

    const facilities = MockDataStore.getInstance().getFacilities()
    return successResponse(facilities)
  },

  /**
   * Get facility by ID
   */
  async getFacilityById(id: string): Promise<ApiResponse<Facility>> {
    await delay(500)

    const facility = MockDataStore.getInstance().getFacilities().find(f => f.id === id)

    if (facility) {
      return successResponse(facility)
    }

    return errorResponse('Facility not found')
  }
}

// ============================================================================
// PRODUCT API
// ============================================================================

export const productApi = {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    await delay(600)

    const products = MockDataStore.getInstance().getProducts()
    return successResponse(products)
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    await delay(500)

    const product = MockDataStore.getInstance().getProducts().find(p => p.id === id)

    if (product) {
      return successResponse(product)
    }

    return errorResponse('Product not found')
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

    let payments = MockDataStore.getInstance().getPayments()

    if (filters?.status) {
      payments = payments.filter(p => p.status === filters.status)
    }

    const { data, pagination } = paginate(payments, filters?.page, filters?.limit)

    return {
      success: true,
      data,
      pagination
    }
  },

  /**
   * Get payment by ID
   */
  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    await delay(500)

    const payment = MockDataStore.getInstance().getPayments().find(p => p.id === id)

    if (payment) {
      return successResponse(payment)
    }

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
// DASHBOARD STATS API
// ============================================================================

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(800)

    // Mock API call - replace with real implementation
    const bookings = MockDataStore.getInstance().getBookings()
    const customers = MockDataStore.getInstance().getCustomers()
    const payments = MockDataStore.getInstance().getPayments()

    const stats: DashboardStats = {
      totalBookings: bookings.length,
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      totalCustomers: customers.length,
      totalSubscriptions: bookings.filter(b => b.productType === 'Subscription').length,
      activeBookings: bookings.filter(b => b.status === 'confirmed').length,
      pendingPayments: payments.filter(p => p.status === 'pending').length,
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

    const bookings = MockDataStore.getInstance().getBookings()
      .filter(b => 
        b.customerName.toLowerCase().includes(searchTerm) ||
        b.productName.toLowerCase().includes(searchTerm) ||
        b.id.toLowerCase().includes(searchTerm)
      )

    const customers = MockDataStore.getInstance().getCustomers()
      .filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm) ||
        c.id.toLowerCase().includes(searchTerm)
      )

    const companies = MockDataStore.getInstance().getCompanies()
      .filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        c.contactPerson.toLowerCase().includes(searchTerm)
      )

    const locations = MockDataStore.getInstance().getLocations()
      .filter(l => 
        l.name.toLowerCase().includes(searchTerm) ||
        l.city.toLowerCase().includes(searchTerm)
      )

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
  BASE_URL: import.meta.env.PROD 
    ? 'https://your-production-api.com/api'
    : 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

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
