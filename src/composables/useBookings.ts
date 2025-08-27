import { ref, computed } from 'vue'

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

// Shared booking data - single source of truth
const allBookings = ref<Booking[]>([
  // Confirmed Bookings (Active)
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
    totalPrice: 100, // $50/hour * 2 hours
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
    id: 'BR-2035',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-21',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: '8 hours',
    totalPrice: 64, // $8/hour * 8 hours
    status: 'confirmed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  {
    id: 'BR-2036',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-22',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    status: 'confirmed',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2037',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'registered',
    date: '2025-08-23',
    startTime: '8:00 AM',
    endTime: '12:00 PM',
    duration: '4 hours',
    totalPrice: 32, // $8/hour * 4 hours
    status: 'confirmed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  {
    id: 'BR-2038',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'Michael Torres',
    customerEmail: 'michael.torres@company.com',
    customerPhone: '+1 (555) 890-1234',
    userType: 'guest',
    date: '2025-08-24',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    duration: '9 hours',
    totalPrice: 450, // Daily rate calculation
    status: 'confirmed',
    location: 'business-center',
    locationName: 'Business Center',
    companyName: 'Global Solutions Inc.'
  },
  {
    id: 'BR-2039',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    date: '2025-08-25',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    status: 'confirmed',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2040',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'registered',
    date: '2025-08-26',
    startTime: '10:00 AM',
    endTime: '6:00 PM',
    duration: '8 hours',
    totalPrice: 64, // $8/hour * 8 hours
    status: 'confirmed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  {
    id: 'BR-2041',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'Robert Kim',
    customerEmail: 'robert.kim@guest.com',
    customerPhone: '+1 (555) 555-0123',
    userType: 'guest',
    date: '2025-08-27',
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    duration: '9 hours',
    totalPrice: 450, // Daily rate calculation
    status: 'confirmed',
    location: 'business-center',
    locationName: 'Business Center',
    companyName: 'Global Solutions Inc.'
  },

  // Completed Bookings (History)
  {
    id: 'BR-2020',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    date: '2025-08-15',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    status: 'completed',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2021',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-16',
    startTime: '8:00 AM',
    endTime: '4:00 PM',
    duration: '8 hours',
    totalPrice: 64, // $8/hour * 8 hours
    status: 'completed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  {
    id: 'BR-2022',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'guest',
    date: '2025-08-17',
    startTime: '10:00 AM',
    endTime: '6:00 PM',
    duration: '8 hours',
    totalPrice: 400, // Daily rate calculation
    status: 'completed',
    location: 'business-center',
    locationName: 'Business Center',
    companyName: 'Global Solutions Inc.'
  },
  {
    id: 'BR-2023',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    date: '2025-08-18',
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    duration: '3 hours',
    totalPrice: 150, // $50/hour * 3 hours
    status: 'completed',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2024',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'guest',
    date: '2025-08-14',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    duration: '4 hours',
    totalPrice: 32, // $8/hour * 4 hours
    status: 'completed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  {
    id: 'BR-2025',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'David Wilson',
    customerEmail: 'david.wilson@guest.com',
    customerPhone: '+1 (555) 555-0456',
    userType: 'registered',
    date: '2025-08-13',
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    duration: '9 hours',
    totalPrice: 450, // Daily rate calculation
    status: 'completed',
    location: 'business-center',
    locationName: 'Business Center',
    companyName: 'Global Solutions Inc.'
  },

  // Cancelled Bookings (History)
  {
    id: 'BR-2010',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    userType: 'guest',
    date: '2025-08-12',
    startTime: '3:00 PM',
    endTime: '5:00 PM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    status: 'cancelled',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2011',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'guest',
    date: '2025-08-11',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    duration: '4 hours',
    totalPrice: 32, // $8/hour * 4 hours
    status: 'cancelled',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  {
    id: 'BR-2012',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'Linda Martinez',
    customerEmail: 'linda.martinez@guest.com',
    customerPhone: '+1 (555) 555-0789',
    userType: 'registered',
    date: '2025-08-10',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: '8 hours',
    totalPrice: 400, // Daily rate calculation
    status: 'cancelled',
    location: 'business-center',
    locationName: 'Business Center',
    companyName: 'Global Solutions Inc.'
  },
  
  // Subscription Data
  {
    id: 'SUB-3001',
    productName: 'Monthly Dedicated Desk',
    productType: 'Subscription',
    productId: 'SUB001',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    date: '2025-08-01',
    startTime: '8:00 AM',
    endTime: '6:00 PM',
    duration: 'Monthly',
    totalPrice: 800,
    status: 'confirmed',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.',
    subscriptionType: 'monthly',
    subscribedDate: '2025-08-01',
    nextBillingDate: '2025-09-01',
    capacity: 1,
    facilities: ['High-speed WiFi', 'Storage Locker', '24/7 Access', 'Printing Credits']
  },
  {
    id: 'SUB-3002',
    productName: 'Weekly Hot Desk Pass',
    productType: 'Subscription',
    productId: 'SUB002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-15',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: 'Weekly',
    totalPrice: 120,
    status: 'confirmed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.',
    subscriptionType: 'weekly',
    subscribedDate: '2025-08-15',
    nextBillingDate: '2025-08-22',
    capacity: 1,
    facilities: ['WiFi Access', 'Coffee/Tea', 'Meeting Room Credits']
  },
  {
    id: 'SUB-3003',
    productName: 'Enterprise Team Space',
    productType: 'Subscription',
    productId: 'SUB003',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'registered',
    date: '2025-07-01',
    startTime: '8:00 AM',
    endTime: '7:00 PM',
    duration: 'Monthly',
    totalPrice: 2500,
    status: 'confirmed',
    location: 'business-center',
    locationName: 'Business Center',
    companyName: 'Global Solutions Inc.',
    subscriptionType: 'monthly',
    subscribedDate: '2025-07-01',
    nextBillingDate: '2025-09-01',
    capacity: 10,
    facilities: ['Private Office Space', 'Conference Room', 'Dedicated Phone Line', 'Admin Support']
  },
  {
    id: 'SUB-3004',
    productName: 'Virtual Office Package',
    productType: 'Subscription',
    productId: 'SUB004',
    productImage: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7a5?w=100&h=100&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-10',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: 'Monthly',
    totalPrice: 150,
    status: 'completed',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.',
    subscriptionType: 'monthly',
    subscribedDate: '2025-07-10',
    nextBillingDate: '2025-08-10',
    capacity: 0,
    facilities: ['Business Address', 'Mail Handling', 'Phone Answering Service', 'Meeting Room Credits']
  }
])

let isInitialized = false

export const useBookings = () => {
  // Initialize data from localStorage if available
  const initializeBookings = () => {
    if (isInitialized) return
    
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
      const bookingStatuses = JSON.parse(localStorage.getItem('bookingStatuses') || '{}')
      allBookings.value.forEach(booking => {
        if (bookingStatuses[booking.id]) {
          booking.status = bookingStatuses[booking.id]
        }
      })
      
      isInitialized = true
    } catch (error) {
      console.warn('⚠️ Error initializing bookings from localStorage:', error)
    }
  }

  // Save bookings to localStorage
  const saveBookings = () => {
    try {
      localStorage.setItem('allBookings', JSON.stringify(allBookings.value))
    } catch (error) {
      console.warn('⚠️ Error saving bookings to localStorage:', error)
    }
  }

  // Get all bookings
  const getBookings = () => {
    initializeBookings()
    return allBookings.value
  }

  // Get booking by ID with fallbacks
  const getBookingById = (id: string) => {
    initializeBookings()
    const foundBooking = allBookings.value.find(b => b.id === id)
    
    if (foundBooking) {
      // Return booking with fallbacks for missing fields
      return {
        ...foundBooking,
        // Ensure all required fields have fallback values
        customerEmail: foundBooking.customerEmail || `${foundBooking.customerName?.toLowerCase().replace(' ', '.')}@example.com`,
        customerPhone: foundBooking.customerPhone || '+1 (555) 000-0000',
        customerMessage: foundBooking.customerMessage || '',
        basePrice: foundBooking.basePrice || foundBooking.totalPrice || 0,
        additionalFacilities: foundBooking.additionalFacilities || 0,
        taxes: foundBooking.taxes || 0,
        capacity: foundBooking.capacity || (foundBooking.productType === 'Meeting Room' ? 12 : 1),
        facilities: foundBooking.facilities || getFacilitiesByProductType(foundBooking.productType),
        locationName: foundBooking.locationName || 'Location Not Specified',
        companyName: foundBooking.companyName || 'Company Not Specified',
        // Subscription-specific fields
        subscriptionType: foundBooking.subscriptionType || 'monthly',
        subscribedDate: foundBooking.subscribedDate || foundBooking.date,
        nextBillingDate: foundBooking.nextBillingDate || foundBooking.date
      }
    }
    
    return null
  }

  // Update booking status
  const updateBookingStatus = (id: string, status: string) => {
    initializeBookings()
    const booking = allBookings.value.find(b => b.id === id)
    if (booking) {
      booking.status = status as any
      
      // Save to localStorage for persistence
      const bookingStatuses = JSON.parse(localStorage.getItem('bookingStatuses') || '{}')
      bookingStatuses[id] = status
      localStorage.setItem('bookingStatuses', JSON.stringify(bookingStatuses))
      
      saveBookings()
    }
  }

  // Helper function to get default facilities by product type
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

  // Computed properties for filtering
  const confirmedBookings = computed(() => 
    getBookings().filter(b => b.status === 'confirmed' && b.productType !== 'Subscription')
  )

  const subscriptions = computed(() => 
    getBookings().filter(b => b.productType === 'Subscription')
  )

  const historyBookings = computed(() => 
    getBookings().filter(b => b.status === 'completed' || b.status === 'cancelled')
  )

  return {
    // Data
    allBookings: computed(() => allBookings.value),
    
    // Methods
    getBookings,
    getBookingById,
    updateBookingStatus,
    initializeBookings,
    saveBookings,
    
    // Filtered data
    confirmedBookings,
    subscriptions,
    historyBookings
  }
}
