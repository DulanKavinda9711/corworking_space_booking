import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

export const useBookingsStore = defineStore('bookings', () => {
  // State
  const allBookings = ref<Booking[]>([])
  const bookingStatuses = ref<Record<string, Booking['status']>>({})

  // Initialize from localStorage
  const initializeBookings = () => {
    try {
      const savedBookings = localStorage.getItem('allBookings')
      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings)
        if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
          allBookings.value = parsedBookings
          console.log('✅ Loaded bookings from localStorage:', parsedBookings.length)
        }
      }

      // Update booking statuses from localStorage
      const savedStatuses = localStorage.getItem('bookingStatuses')
      if (savedStatuses) {
        bookingStatuses.value = JSON.parse(savedStatuses)
        // Apply statuses to bookings
        allBookings.value.forEach(booking => {
          if (bookingStatuses.value[booking.id]) {
            booking.status = bookingStatuses.value[booking.id]
          }
        })
      }
    } catch (error) {
      console.warn('⚠️ Error initializing bookings from localStorage:', error)
    }
  }

  // Actions
  const saveBookings = () => {
    try {
      localStorage.setItem('allBookings', JSON.stringify(allBookings.value))
    } catch (error) {
      console.warn('⚠️ Error saving bookings to localStorage:', error)
    }
  }

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    const booking = allBookings.value.find(b => b.id === id)
    if (booking) {
      booking.status = status
      bookingStatuses.value[id] = status
      localStorage.setItem('bookingStatuses', JSON.stringify(bookingStatuses.value))
      saveBookings()
    }
  }

  const getBookingById = (id: string): Booking | null => {
    const foundBooking = allBookings.value.find(b => b.id === id)

    if (foundBooking) {
      // Return booking with fallbacks for missing fields
      return {
        ...foundBooking,
        customerEmail: foundBooking.customerEmail || `${foundBooking.customerName?.toLowerCase().replace(' ', '.')}@example.com`,
        customerPhone: foundBooking.customerPhone || '+1 (555) 000-0000',
        customerMessage: foundBooking.customerMessage || '',
        basePrice: foundBooking.basePrice || foundBooking.totalPrice || 0,
        additionalFacilities: foundBooking.additionalFacilities || 0,
        taxes: foundBooking.taxes || 0,
        capacity: foundBooking.capacity || (foundBooking.productType === 'Meeting Room' ? 12 : 1),
        facilities: foundBooking.facilities || getFacilitiesByProductType(foundBooking.productType)
      }
    }

    return null
  }

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

  // Getters (computed)
  const confirmedBookings = computed(() =>
    allBookings.value.filter(b => b.status === 'confirmed' && b.productType !== 'Subscription')
  )

  const completedBookings = computed(() =>
    allBookings.value.filter(b => b.status === 'completed')
  )

  const cancelledBookings = computed(() =>
    allBookings.value.filter(b => b.status === 'cancelled')
  )

  const subscriptions = computed(() =>
    allBookings.value.filter(b => b.productType === 'Subscription')
  )

  const activeSubscriptions = computed(() =>
    subscriptions.value.filter(b => b.status === 'confirmed')
  )

  // Initialize on store creation
  initializeBookings()

  return {
    // State
    allBookings,
    bookingStatuses,

    // Actions
    initializeBookings,
    saveBookings,
    updateBookingStatus,
    getBookingById,

    // Getters
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    subscriptions,
    activeSubscriptions
  }
})