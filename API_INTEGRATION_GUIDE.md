# API Integration Guide

This document explains how to use the centralized API service (`src/services/api.ts`) throughout the application.

## Overview

All API calls are now centralized in `src/services/api.ts`. This file contains:
- Mock data for development (since backend is not implemented yet)
- Comprehensive API functions for all entities
- TypeScript interfaces for type safety
- Utility functions for common operations

## Quick Start

### 1. Import the API services you need:

```typescript
import { bookingApi, customerApi, authApi } from '@/services/api'
```

### 2. Use async/await to call API functions:

```typescript
// Get all bookings
const response = await bookingApi.getAllBookings()
if (response.success) {
  const bookings = response.data
}

// Get customer by ID
const customerResponse = await customerApi.getCustomerById('CU-001')
if (customerResponse.success) {
  const customer = customerResponse.data
}
```

## API Services Available

### Authentication API (`authApi`)
```typescript
// Login
const loginResult = await authApi.login({ email: 'admin@example.com', password: 'password' })

// Logout
await authApi.logout()

// Get current user
const userResult = await authApi.getCurrentUser()

// Refresh token
await authApi.refreshToken()
```

### Booking API (`bookingApi`)
```typescript
// Get all bookings with filters
const bookings = await bookingApi.getAllBookings({
  page: 1,
  limit: 10,
  status: 'confirmed',
  location: 'main-branch'
})

// Get specific booking
const booking = await bookingApi.getBookingById('BR-2034')

// Create new booking
const newBooking = await bookingApi.createBooking({
  productName: 'Meeting Room',
  productType: 'Meeting Room',
  customerName: 'John Doe',
  // ... other fields
})

// Update booking status
await bookingApi.updateBookingStatus('BR-2034', 'cancelled')

// Cancel booking
await bookingApi.cancelBooking('BR-2034', 'Customer request')

// Delete booking (admin only)
await bookingApi.deleteBooking('BR-2034')
```

### Subscription API (`subscriptionApi`)
```typescript
// Get all subscriptions
const subscriptions = await subscriptionApi.getAllSubscriptions({
  status: 'confirmed',
  type: 'monthly'
})

// Cancel subscription with file upload
await subscriptionApi.cancelSubscription('SUB-3001', {
  reason: 'No longer needed',
  refundRequested: true,
  paymentSlipFile: fileObject
})
```

### Customer API (`customerApi`)
```typescript
// Get all customers
const customers = await customerApi.getAllCustomers({
  status: 'active',
  search: 'john'
})

// Get customer by ID
const customer = await customerApi.getCustomerById('CU-001')

// Update customer status
await customerApi.updateCustomerStatus('CU-001', 'blocked')

// Get customer bookings
const bookings = await customerApi.getCustomerBookings('CU-001')
```

### Other APIs
- `companyApi` - Company management
- `locationApi` - Location management
- `facilityApi` - Facility management
- `productApi` - Product management
- `paymentApi` - Payment management
- `messageApi` - Messaging system
- `dashboardApi` - Dashboard statistics and search

## Error Handling

All API functions return a consistent response format:

```typescript
interface ApiResponse<T> {
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
```

### Example error handling:

```typescript
const response = await bookingApi.getAllBookings()

if (response.success) {
  // Handle success
  const bookings = response.data
} else {
  // Handle error
  console.error('Error:', response.message)
  if (response.errors) {
    response.errors.forEach(error => console.error(error))
  }
}
```

## Using in Vue Components

### Option 1: Direct API calls in component

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bookingApi } from '@/services/api'

const bookings = ref([])
const loading = ref(false)

const loadBookings = async () => {
  loading.value = true
  const response = await bookingApi.getAllBookings()
  
  if (response.success) {
    bookings.value = response.data
  }
  loading.value = false
}

onMounted(loadBookings)
</script>
```

### Option 2: Using updated composables

```vue
<script setup lang="ts">
import { useBookingsWithApi } from '@/composables/useBookingsWithApi'

const {
  bookings,
  loading,
  error,
  loadBookings,
  updateBookingStatus
} = useBookingsWithApi()

// Data is automatically loaded on component mount
</script>
```

## Migration from localStorage

### Before (using localStorage directly):
```typescript
const bookings = JSON.parse(localStorage.getItem('allBookings') || '[]')
```

### After (using centralized API):
```typescript
const response = await bookingApi.getAllBookings()
const bookings = response.success ? response.data : []
```

## Mock Data vs Real API

Currently, the API uses mock data stored in localStorage for development. When the backend is ready:

1. Uncomment the real API calls (marked with comments in the code)
2. Update `API_CONFIG.BASE_URL` in `api.ts`
3. Add proper authentication headers
4. Handle real HTTP errors

### Example real API implementation:
```typescript
async getAllBookings(): Promise<ApiResponse<Booking[]>> {
  // Replace mock implementation with real API call:
  const response = await fetch(`${API_CONFIG.BASE_URL}/bookings`)
  const data = await response.json()
  return data
}
```

## File Upload Handling

For file uploads (like payment slips), use FormData:

```typescript
const formData = new FormData()
formData.append('reason', 'Cancellation reason')
formData.append('paymentSlip', fileObject)

// The API handles file uploads automatically
await subscriptionApi.cancelSubscription('SUB-3001', {
  reason: 'No longer needed',
  paymentSlipFile: fileObject
})
```

## Best Practices

1. **Always handle errors**: Check `response.success` before accessing data
2. **Use TypeScript**: Import and use the provided interfaces
3. **Loading states**: Show loading indicators during API calls
4. **Error messages**: Display user-friendly error messages
5. **Consistent naming**: Follow the established API naming conventions

## Example Components

See the following example files:
- `src/composables/useBookingsWithApi.ts` - Updated composable using API
- `src/components/examples/ApiExampleComponent.vue` - Complete component example

## Updating Existing Components

To migrate an existing component:

1. Replace direct localStorage usage with API calls
2. Add error handling and loading states
3. Update import statements
4. Test all functionality

### Migration Checklist:
- [ ] Replace localStorage reads with API GET calls
- [ ] Replace localStorage writes with API POST/PUT/DELETE calls
- [ ] Add loading state management
- [ ] Add error handling
- [ ] Update TypeScript interfaces
- [ ] Test all user interactions
- [ ] Update navigation and routing if needed

## Support

For questions about API usage, refer to:
- Type definitions in `src/services/api.ts`
- Example implementations in `src/composables/useBookingsWithApi.ts`
- Complete component example in `src/components/examples/ApiExampleComponent.vue`
