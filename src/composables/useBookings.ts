import { computed } from 'vue'
import { useBookingsStore } from '@/stores/bookings'

// Booking interface
interface Booking {
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
  status: 'confirmed' | 'completed' | 'cancelled'
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

export const useBookings = () => {
  const bookingsStore = useBookingsStore()

  // Get all bookings as computed property
  const allBookings = computed(() => bookingsStore.allBookings)

  // Get all bookings
  const getBookings = () => {
    return bookingsStore.allBookings
  }

  // Get booking by ID with fallbacks
  const getBookingById = (id: string) => {
    return bookingsStore.getBookingById(id)
  }

  // Update booking status
  const updateBookingStatus = (id: string, status: Booking['status']) => {
    bookingsStore.updateBookingStatus(id, status)
  }

  // Initialize bookings
  const initializeBookings = () => {
    bookingsStore.initializeBookings()
  }

  // Get confirmed bookings
  const getConfirmedBookings = () => {
    return bookingsStore.confirmedBookings
  }

  // Get completed bookings
  const getCompletedBookings = () => {
    return bookingsStore.completedBookings
  }

  // Get cancelled bookings
  const getCancelledBookings = () => {
    return bookingsStore.cancelledBookings
  }

  // Get subscriptions
  const getSubscriptions = () => {
    return bookingsStore.subscriptions
  }

  // Get active subscriptions
  const getActiveSubscriptions = () => {
    return bookingsStore.activeSubscriptions
  }

  // Get facilities by product type
  const getFacilitiesByProductType = (productType: string): string[] => {
    switch (productType) {
      case 'Meeting Room':
        return ['WiFi', 'Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning']
      case 'Hot Desk':
        return ['WiFi', 'Power Outlet', 'Shared Kitchen', 'Printer Access']
      case 'Dedicated Desk':
        return ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line']
      case 'Subscription':
        return ['High-speed WiFi', 'Storage Locker', '24/7 Access', 'Printing Credits']
      default:
        return ['WiFi', 'Basic Amenities']
    }
  }

  return {
    allBookings,
    getBookings,
    getBookingById,
    updateBookingStatus,
    initializeBookings,
    getConfirmedBookings,
    getCompletedBookings,
    getCancelledBookings,
    getSubscriptions,
    getActiveSubscriptions,
    getFacilitiesByProductType
  }
}
