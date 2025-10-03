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
  const allBookingsAndSubscriptions = ref<any[]>([]) // Store for 'All' tab data
  const subscriptions = ref<any[]>([])
  const bookingHistory = ref<any[]>([]) // Store for history tab data
  const bookingStatuses = ref<Record<string, Booking['status']>>({})

  // Load persisted data on store initialization
  const loadPersistedData = () => {
    try {
      const savedBookings = localStorage.getItem('pinia_bookings_data')
      const savedSubscriptions = localStorage.getItem('pinia_subscriptions_data')
      const savedAllBookings = localStorage.getItem('pinia_all_bookings_data')
      
      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings)
        if (Array.isArray(parsedBookings)) {
          allBookings.value = parsedBookings
          console.log('Loaded persisted bookings:', parsedBookings.length, 'bookings')
          
          // Log dedicated desk bookings specifically
          const dedicatedDeskCount = parsedBookings.filter(b => b.productType === 'Dedicated Desk').length
          if (dedicatedDeskCount > 0) {
            console.log('Found', dedicatedDeskCount, 'dedicated desk bookings in persisted data')
          }
        }
      }
      
      if (savedSubscriptions) {
        const parsedSubscriptions = JSON.parse(savedSubscriptions)
        if (Array.isArray(parsedSubscriptions)) {
          subscriptions.value = parsedSubscriptions
          console.log('Loaded persisted subscriptions:', parsedSubscriptions.length, 'subscriptions')
        }
      }

      if (savedAllBookings) {
        const parsedAllBookings = JSON.parse(savedAllBookings)
        if (Array.isArray(parsedAllBookings)) {
          allBookingsAndSubscriptions.value = parsedAllBookings
          console.log('Loaded persisted all bookings:', parsedAllBookings.length, 'items')
        }
      }
    } catch (error) {
      console.error('Error loading persisted data:', error)
    }
  }

  // Save data to localStorage
  const persistData = () => {
    try {
      localStorage.setItem('pinia_bookings_data', JSON.stringify(allBookings.value))
      localStorage.setItem('pinia_subscriptions_data', JSON.stringify(subscriptions.value))
      localStorage.setItem('pinia_all_bookings_data', JSON.stringify(allBookingsAndSubscriptions.value))
      console.log('Persisted', allBookings.value.length, 'bookings,', subscriptions.value.length, 'subscriptions, and', allBookingsAndSubscriptions.value.length, 'all bookings')
    } catch (error) {
      console.error('Error persisting data:', error)
    }
  }

  // Actions
  const updateBookingStatus = (id: string, status: Booking['status']) => {
    const booking = allBookings.value.find(b => b.id === id)
    if (booking) {
      booking.status = status
      bookingStatuses.value[id] = status
      
      // Persist changes immediately
      persistData()
      
      // Log if it's a dedicated desk booking
      if (booking.productType === 'Dedicated Desk') {
        console.log('Updated dedicated desk booking status:', { id, status, productName: booking.productName })
      }
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
        
        // Persist the fetched and mapped bookings
        persistData()
        
        // Log dedicated desk bookings specifically
        const dedicatedDeskBookings = mappedBookings.filter(booking => booking.productType === 'Dedicated Desk')
        if (dedicatedDeskBookings.length > 0) {
          console.log('Fetched and stored', dedicatedDeskBookings.length, 'dedicated desk bookings:', 
            dedicatedDeskBookings.map(b => ({ id: b.id, productName: b.productName, customerName: b.customerName })))
        }
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

  // Fetch subscriptions from API
  const fetchSubscriptions = async () => {
    try {
      const response = await bookingApi.getAdminSubscriptionTable()
      if (response.success && response.data) {
        const mappedSubscriptions = response.data.map((item: any) => ({
          id: item.booking_id,
          bookingId: item.booking_id,
          customerName: `${item.first_name} ${item.last_name}`,
          customerEmail: item.email,
          productName: item.product_type,
          productType: 'Subscription',
          locationName: item.location_name,
          subscribedDate: item.subscribed_date,
          nextBillingDate: item.next_billing_date,
          subscriptionEndDate: item.subscription_end_date,
          totalPrice: item.total_price,
          status: item.status.toLowerCase() === 'unknown' ? 'ongoing' : item.status.toLowerCase(),
          subscriptionType: item.package_type,
          userType: item.customer_type ? String(item.customer_type).charAt(0).toUpperCase() + String(item.customer_type).slice(1).toLowerCase() : 'Registered'
        }))
        subscriptions.value = mappedSubscriptions
        
        // Persist subscription data
        persistData()
        
        console.log('Fetched and stored', mappedSubscriptions.length, 'subscriptions')
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    }
  }

  // Fetch all bookings and subscriptions for 'All' tab
  const fetchAllBookingsAndSubscriptions = async (filters?: any) => {
    try {
      const response = await bookingApi.getAdminAllBookingsTable(filters)
      if (response.success && response.data) {
        const mappedData = response.data.map((item: any) => {
          // Check if this is a subscription or regular booking
          const isSubscription = item.subscription_start_date && item.subscription_end_date && item.package_type
          
          let mappedProductType: string
          let productType: string
          
          if (isSubscription) {
            mappedProductType = 'Subscription'
            productType = 'Subscription'
          } else {
            mappedProductType = mapProductType(item.product_type)
            productType = mappedProductType
          }
          
          const booking = {
            id: item.booking_id,
            productName: item.product_type || 'Subscription',
            productType: productType,
            productId: '',
            productImage: '',
            customerName: item.first_name && item.last_name ? `${item.first_name} ${item.last_name}` : 'N/A',
            customerEmail: item.email || '',
            customerPhone: item.phone || '',
            customerType: item.customer_type || 'Registered',
            userType: (item.customer_type ? item.customer_type.toLowerCase() : 'registered') as 'registered' | 'guest',
            date: item.booking_date !== '0001-01-01' ? item.booking_date : '',
            startTime: item.start_time ? convertTo12Hour(item.start_time) : '',
            endTime: item.end_time ? convertTo12Hour(item.end_time) : '',
            duration: item.duration || '',
            totalPrice: item.total_price,
            basePrice: item.total_price,
            additionalFacilities: 0,
            taxes: 0,
            status: mapStatus(item.status),
            location: '',
            locationName: item.location_name,
            companyName: '',
            capacity: 0,
            facilities: [],
            subscriptionType: item.package_type || '',
            subscribedDate: item.subscription_start_date || '',
            nextBillingDate: item.subscription_end_date || '',
            customerMessage: ''
          }

          // Calculate real-time status for non-subscription bookings
          if (!isSubscription) {
            const dynamicStatus = calculateDynamicStatus(booking)
            booking.status = dynamicStatus === 'on going' ? 'ongoing' :
                            dynamicStatus === 'up comming' ? 'confirmed' :
                            dynamicStatus === 'complete' ? 'completed' :
                            dynamicStatus === 'cancelled' ? 'cancelled' : booking.status
          }

          return booking
        })
        
        allBookingsAndSubscriptions.value = mappedData
        persistData()
        
        console.log('Fetched and stored', mappedData.length, 'all bookings and subscriptions')
        console.log('Sample data from admin-all-bookings-table API:', mappedData.slice(0, 3).map(item => ({
          id: item.id,
          customerName: item.customerName,
          productType: item.productType,
          locationName: item.locationName,
          status: item.status
        })))
      } else {
        console.error('Failed to fetch all bookings and subscriptions:', response.message)
      }
    } catch (error) {
      console.error('Error fetching all bookings and subscriptions:', error)
    }
  }

  // Fetch booking history from API
  const fetchBookingHistory = async (filters?: any) => {
    try {
      const response = await bookingApi.getAdminBookingHistoryTable(filters)
      if (response.success && response.data) {
        const mappedHistory = response.data.map((item: any) => {
          const mappedProductType = mapProductType(item.product_type)
          
          return {
            id: item.booking_id,
            productName: item.product_type,
            productType: mappedProductType,
            productId: '',
            productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
            customerName: `${item.first_name} ${item.last_name}`,
            customerEmail: item.email || '',
            customerPhone: item.phone || '',
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
            status: item.status === 'SUCCESS' ? 'completed' : mapStatus(item.status),
            location: '',
            locationName: item.location_name,
            companyName: '',
            capacity: 0,
            facilities: [],
            subscriptionType: item.package_type || '',
            subscribedDate: item.subscription_start_date || '',
            nextBillingDate: item.subscription_end_date || '',
            customerMessage: ''
          }
        })
        
        bookingHistory.value = mappedHistory
        console.log('Fetched and stored', mappedHistory.length, 'booking history records')
      } else {
        console.error('Failed to fetch booking history:', response.message)
      }
    } catch (error) {
      console.error('Error fetching booking history:', error)
    }
  }

  // Add new booking to the store
  const addBooking = (booking: Booking) => {
    const existingIndex = allBookings.value.findIndex(b => b.id === booking.id)
    
    if (existingIndex >= 0) {
      allBookings.value[existingIndex] = booking
      console.log('Updated existing booking:', booking.id, booking.productType)
    } else {
      allBookings.value.push(booking)
      console.log('Added new booking:', booking.id, booking.productType)
    }
    
    // Log specifically for dedicated desk bookings
    if (booking.productType === 'Dedicated Desk') {
      console.log('Dedicated desk booking added/updated:', {
        id: booking.id,
        productName: booking.productName,
        customerName: booking.customerName,
        status: booking.status,
        date: booking.date
      })
    }
    
    // Persist changes
    persistData()
  }

  // Remove booking from the store
  const removeBooking = (id: string) => {
    const index = allBookings.value.findIndex(b => b.id === id)
    if (index >= 0) {
      const removedBooking = allBookings.value[index]
      allBookings.value.splice(index, 1)
      
      if (removedBooking.productType === 'Dedicated Desk') {
        console.log('Dedicated desk booking removed:', {
          id: removedBooking.id,
          productName: removedBooking.productName,
          customerName: removedBooking.customerName
        })
      }
      
      persistData()
      return removedBooking
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

  const allSubscriptions = computed(() => subscriptions.value)

  const activeSubscriptions = computed(() =>
    subscriptions.value.filter(b => b.status === 'confirmed' || b.status === 'ongoing')
  )

  // Dedicated Desk specific getters
  const dedicatedDeskBookings = computed(() =>
    allBookings.value.filter(b => b.productType === 'Dedicated Desk')
  )

  const activeDedicatedDeskBookings = computed(() =>
    dedicatedDeskBookings.value.filter(b => b.status === 'confirmed' || b.status === 'ongoing')
  )

  const completedDedicatedDeskBookings = computed(() =>
    dedicatedDeskBookings.value.filter(b => b.status === 'completed')
  )

  // Hot Desk specific getters
  const hotDeskBookings = computed(() =>
    allBookings.value.filter(b => b.productType === 'Hot Desk')
  )

  const activeHotDeskBookings = computed(() =>
    hotDeskBookings.value.filter(b => b.status === 'confirmed' || b.status === 'ongoing')
  )

  // Meeting Room specific getters
  const meetingRoomBookings = computed(() =>
    allBookings.value.filter(b => b.productType === 'Meeting Room')
  )

  const activeMeetingRoomBookings = computed(() =>
    meetingRoomBookings.value.filter(b => b.status === 'confirmed' || b.status === 'ongoing')
  )

  // Initialize store - load persisted data
  const initStore = () => {
    loadPersistedData()
  }

  // Call initialization immediately
  initStore()

  return {
    // State
    allBookings,
    allBookingsAndSubscriptions,
    subscriptions,
    bookingHistory,
    bookingStatuses,

    // Actions
    updateBookingStatus,
    getBookingById,
    fetchBookings,
    fetchSubscriptions,
    fetchAllBookingsAndSubscriptions,
    fetchBookingHistory,
    addBooking,
    removeBooking,
    persistData,
    loadPersistedData,
    initStore,

    // Getters
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    allSubscriptions,
    activeSubscriptions,
    
    // Product-specific getters
    dedicatedDeskBookings,
    activeDedicatedDeskBookings,
    completedDedicatedDeskBookings,
    hotDeskBookings,
    activeHotDeskBookings,
    meetingRoomBookings,
    activeMeetingRoomBookings
  }
})