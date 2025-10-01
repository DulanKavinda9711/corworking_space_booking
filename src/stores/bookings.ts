import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bookingApi } from '@/services/api'

// Helper functions
const mapProductType = (apiType: string): 'Meeting Room' | 'Hot Desk' | 'Dedicated Desk' => {
  if (!apiType) return 'Meeting Room'
  
  const normalizedType = apiType.toLowerCase().trim()
  
  // Check for dedicated desk first (most specific)
  if (normalizedType.includes('dedicated') || normalizedType.includes('fixed') || normalizedType.includes('private desk')) {
    return 'Dedicated Desk'
  }
  // Then check for hot desk
  if (normalizedType.includes('hot') || normalizedType.includes('hotdesk') || normalizedType.includes('hot desk') || normalizedType.includes('shared desk')) {
    return 'Hot Desk'
  }
  // Then check for meeting room
  if (normalizedType.includes('meeting') || normalizedType.includes('conference') || normalizedType.includes('room')) {
    return 'Meeting Room'
  }
  
  return 'Meeting Room' // default
}

const mapStatus = (apiStatus: string): Booking['status'] => {
  const normalizedStatus = apiStatus.toLowerCase().trim()
  if (normalizedStatus === 'upcoming') return 'confirmed'
  if (normalizedStatus === 'ongoing') return 'ongoing'
  if (normalizedStatus === 'completed') return 'completed'
  if (normalizedStatus === 'cancelled') return 'cancelled'
  return 'confirmed' // default
}

const convertTo12Hour = (time24: string): string => {
  if (!time24) return ''
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`
}

const calculateDynamicStatus = (booking: any): string => {
  // Handle cancelled bookings - they stay cancelled
  if (booking.status === 'cancelled') {
    return 'cancelled'
  }

  // Handle subscriptions differently
  if (booking.productType === 'Subscription') {
    const now = new Date()
    const subscribedDate = new Date(booking.subscribedDate)

    if (booking.subscriptionType === 'monthly') {
      const nextBillingDate = new Date(booking.nextBillingDate)
      if (now >= subscribedDate && now < nextBillingDate) {
        return 'on going'
      } else if (now < subscribedDate) {
        return 'up comming'
      } else {
        return 'complete'
      }
    } else if (booking.subscriptionType === 'annually') {
      const nextBillingDate = new Date(booking.nextBillingDate)
      if (now >= subscribedDate && now < nextBillingDate) {
        return 'on going'
      } else if (now < subscribedDate) {
        return 'up comming'
      } else {
        return 'complete'
      }
    }
    return booking.status
  }

  // Handle regular bookings - always calculate based on current time
  const now = new Date()
  const bookingDate = new Date(booking.date)

  if (!booking.startTime || !booking.endTime) {
    return booking.status // If no times, keep current status
  }

  // Parse time strings like "10:00 AM" or "2:00 PM"
  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(' ')
    const [hours, minutes] = time.split(':').map(Number)

    let hour24 = hours
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0
    }

    return [hour24, minutes]
  }

  const [startHour, startMinute] = parseTime(booking.startTime)
  const [endHour, endMinute] = parseTime(booking.endTime)

  const bookingStartTime = new Date(bookingDate)
  bookingStartTime.setHours(startHour, startMinute, 0, 0)

  const bookingEndTime = new Date(bookingDate)
  bookingEndTime.setHours(endHour, endMinute, 0, 0)

  // Compare current time with booking times
  if (now >= bookingStartTime && now <= bookingEndTime) {
    return 'on going'
  } else if (now < bookingStartTime) {
    return 'up comming'
  } else {
    return 'complete'
  }
}

interface Booking {
  id: string
  productName: string
  productType: string
  productId: string
  productImage: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  customerType?: string
  userType: 'registered' | 'guest'
  date?: string
  startTime?: string
  endTime?: string
  duration?: string
  totalPrice: number
  basePrice?: number
  additionalFacilities?: number
  taxes?: number
  status: 'confirmed' | 'completed' | 'cancelled' | 'ongoing'
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

  // Actions
  const updateBookingStatus = (id: string, status: Booking['status']) => {
    const booking = allBookings.value.find(b => b.id === id)
    if (booking) {
      booking.status = status
      bookingStatuses.value[id] = status
    }
  }

  const fetchBookings = async (filters?: any) => {
    try {
      const response = await bookingApi.getAdminBookingTabTable(filters)
      if (response.success && response.data) {
        const mappedBookings = response.data.map((item: any) => {
          const mappedProductType = mapProductType(item.product_type)
          
          // Debug logging for product type mapping
          if (item.product_type && item.product_type.toLowerCase().includes('dedicated')) {
            console.log('Dedicated product type mapping:', {
              original: item.product_type,
              mapped: mappedProductType,
              bookingId: item.booking_id
            })
          }
          
          const booking = {
            id: item.booking_id,
            productName: item.product_type,
            productType: mappedProductType,
            productId: '',
            productImage: '',
            customerName: `${item.first_name} ${item.last_name}`,
            customerEmail: '',
            customerPhone: '',
            customerType: item.customer_type || 'Registered',
            userType: (item.customer_type ? item.customer_type.toLowerCase() : 'registered') as 'registered' | 'guest',
            date: item.booking_date,
            startTime: item.start_time ? convertTo12Hour(item.start_time) : '',
            endTime: item.end_time ? convertTo12Hour(item.end_time) : '',
            duration: item.duration || '',
            totalPrice: item.total_price,
            basePrice: item.total_price,
            additionalFacilities: 0,
            taxes: 0,
            status: mapStatus(item.status), // Initial status from API
            location: '',
            locationName: item.location_name,
            companyName: '',
            capacity: 0,
            facilities: [],
            subscriptionType: '',
            subscribedDate: '',
            nextBillingDate: '',
            customerMessage: ''
          }

          // Calculate real-time status based on current time
          const dynamicStatus = calculateDynamicStatus(booking)
          booking.status = dynamicStatus === 'on going' ? 'ongoing' :
                          dynamicStatus === 'up comming' ? 'confirmed' :
                          dynamicStatus === 'complete' ? 'completed' :
                          dynamicStatus === 'cancelled' ? 'cancelled' : booking.status

          return booking
        })
        allBookings.value = mappedBookings
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
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
        facilities: foundBooking.facilities || []
      }
    }

    return null
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

  return {
    // State
    allBookings,
    bookingStatuses,

    // Actions
    updateBookingStatus,
    getBookingById,
    fetchBookings,

    // Getters
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    subscriptions,
    activeSubscriptions
  }
})