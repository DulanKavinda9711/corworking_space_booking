/**
 * Example: Updated useBookings composable using centralized API
 * 
 * This shows how to migrate from direct localStorage usage to using the centralized API service
 */

import { ref, computed, onMounted } from 'vue'
import { bookingApi, subscriptionApi, type Booking } from '@/services/api'

// State management
const bookings = ref<Booking[]>([])
const loading = ref(false)
const error = ref('')

// Computed filters
const confirmedBookings = computed(() => 
  bookings.value.filter(b => b.status === 'confirmed' && b.productType !== 'Subscription')
)

const subscriptions = computed(() => 
  bookings.value.filter(b => b.productType === 'Subscription')
)

const historyBookings = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return bookings.value.filter(b => {
    // Include cancelled subscriptions
    if (b.productType === 'Subscription' && b.status === 'cancelled') {
      return true
    }
    
    // Include completed or cancelled regular bookings
    if (b.productType !== 'Subscription' && (b.status === 'completed' || b.status === 'cancelled')) {
      return true
    }
    
    // Include past confirmed bookings (before today)
    if (b.status === 'confirmed' && b.productType !== 'Subscription' && b.date && b.date < today) {
      return true
    }
    
    return false
  })
})

export const useBookingsWithApi = () => {
  /**
   * Load all bookings from API
   */
  const loadBookings = async (filters?: {
    status?: string
    location?: string
    customerType?: string
  }) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await bookingApi.getAllBookings(filters)
      
      if (response.success && response.data) {
        bookings.value = response.data
      } else {
        error.value = response.message || 'Failed to load bookings'
      }
    } catch (err) {
      error.value = 'Network error while loading bookings'
      console.error('Error loading bookings:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get booking by ID from API
   */
  const getBookingById = async (id: string) => {
    try {
      const response = await bookingApi.getBookingById(id)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Booking not found')
      }
    } catch (err) {
      console.error('Error getting booking:', err)
      throw err
    }
  }

  /**
   * Update booking status via API
   */
  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const response = await bookingApi.updateBookingStatus(id, status)
      
      if (response.success && response.data) {
        // Update local state
        const index = bookings.value.findIndex(b => b.id === id)
        if (index !== -1) {
          bookings.value[index] = response.data
        }
        return response.data
      } else {
        throw new Error(response.message || 'Failed to update booking status')
      }
    } catch (err) {
      console.error('Error updating booking status:', err)
      throw err
    }
  }

  /**
   * Cancel booking via API
   */
  const cancelBooking = async (id: string, reason: string) => {
    try {
      const response = await bookingApi.cancelBooking(id, reason)
      
      if (response.success && response.data) {
        // Update local state
        const index = bookings.value.findIndex(b => b.id === id)
        if (index !== -1) {
          bookings.value[index] = response.data
        }
        return response.data
      } else {
        throw new Error(response.message || 'Failed to cancel booking')
      }
    } catch (err) {
      console.error('Error cancelling booking:', err)
      throw err
    }
  }

  /**
   * Delete booking via API (admin only)
   */
  const deleteBooking = async (id: string) => {
    try {
      const response = await bookingApi.deleteBooking(id)
      
      if (response.success) {
        // Remove from local state
        bookings.value = bookings.value.filter(b => b.id !== id)
        return true
      } else {
        throw new Error(response.message || 'Failed to delete booking')
      }
    } catch (err) {
      console.error('Error deleting booking:', err)
      throw err
    }
  }

  /**
   * Cancel subscription via API
   */
  const cancelSubscription = async (id: string, cancellationData: {
    reason: string
    additionalNotes?: string
    refundRequested: boolean
    paymentSlipFile?: File
  }) => {
    try {
      const response = await subscriptionApi.cancelSubscription(id, cancellationData)
      
      if (response.success) {
        // Refresh bookings to get updated status
        await loadBookings()
        return response.data
      } else {
        throw new Error(response.message || 'Failed to cancel subscription')
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err)
      throw err
    }
  }

  /**
   * Create new booking via API
   */
  const createBooking = async (bookingData: Omit<Booking, 'id' | 'status'>) => {
    try {
      const response = await bookingApi.createBooking(bookingData)
      
      if (response.success && response.data) {
        // Add to local state
        bookings.value.unshift(response.data)
        return response.data
      } else {
        throw new Error(response.message || 'Failed to create booking')
      }
    } catch (err) {
      console.error('Error creating booking:', err)
      throw err
    }
  }

  // Initialize on first use
  onMounted(() => {
    loadBookings()
  })

  return {
    // State
    bookings: computed(() => bookings.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Filtered data
    confirmedBookings,
    subscriptions,
    historyBookings,
    
    // Methods
    loadBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    deleteBooking,
    cancelSubscription,
    createBooking,
    
    // Utility methods
    refreshData: () => loadBookings(),
    clearError: () => { error.value = '' }
  }
}
