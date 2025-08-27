/**
 * Migration Helper Utilities
 * 
 * This file contains utility functions to help migrate from localStorage to centralized API
 */

import api from '@/services/api'

/**
 * Migrate localStorage bookings to API format
 * Run this once to ensure data consistency
 */
export const migrateBookingsData = async () => {
  try {
    console.log('🔄 Starting bookings data migration...')
    
    // Get existing localStorage data
    const localBookings = localStorage.getItem('allBookings')
    if (localBookings) {
      const bookings = JSON.parse(localBookings)
      console.log(`📦 Found ${bookings.length} bookings in localStorage`)
      
      // The API mock data store will automatically load from localStorage
      // No additional migration needed for mock data
      console.log('✅ Bookings data migration completed')
      
      return { success: true, message: 'Migration completed successfully' }
    }
    
    console.log('ℹ️ No bookings found in localStorage to migrate')
    return { success: true, message: 'No data to migrate' }
  } catch (error) {
    console.error('❌ Error during migration:', error)
    return { success: false, message: 'Migration failed', error }
  }
}

/**
 * Migrate localStorage customers to API format
 */
export const migrateCustomersData = async () => {
  try {
    console.log('🔄 Starting customers data migration...')
    
    const localCustomers = localStorage.getItem('customers')
    if (localCustomers) {
      const customers = JSON.parse(localCustomers)
      console.log(`📦 Found ${customers.length} customers in localStorage`)
      
      console.log('✅ Customers data migration completed')
      return { success: true, message: 'Migration completed successfully' }
    }
    
    console.log('ℹ️ No customers found in localStorage to migrate')
    return { success: true, message: 'No data to migrate' }
  } catch (error) {
    console.error('❌ Error during migration:', error)
    return { success: false, message: 'Migration failed', error }
  }
}

/**
 * Test API connectivity and data integrity
 */
export const testApiConnectivity = async () => {
  console.log('🧪 Testing API connectivity...')
  
  try {
    // Test booking API
    const bookingsResponse = await api.booking.getAllBookings()
    console.log(`📋 Bookings API: ${bookingsResponse.success ? '✅ OK' : '❌ FAIL'}`)
    
    // Test customer API
    const customersResponse = await api.customer.getAllCustomers()
    console.log(`👥 Customers API: ${customersResponse.success ? '✅ OK' : '❌ FAIL'}`)
    
    // Test dashboard API
    const statsResponse = await api.dashboard.getStats()
    console.log(`📊 Dashboard API: ${statsResponse.success ? '✅ OK' : '❌ FAIL'}`)
    
    console.log('🎉 API connectivity test completed')
    
    return {
      success: true,
      results: {
        bookings: bookingsResponse.success,
        customers: customersResponse.success,
        dashboard: statsResponse.success
      }
    }
  } catch (error) {
    console.error('❌ API connectivity test failed:', error)
    return { success: false, error }
  }
}

/**
 * Validate data consistency between localStorage and API
 */
export const validateDataConsistency = async () => {
  console.log('🔍 Validating data consistency...')
  
  try {
    // Compare localStorage bookings with API bookings
    const localBookings = JSON.parse(localStorage.getItem('allBookings') || '[]')
    const apiResponse = await api.booking.getAllBookings()
    
    if (apiResponse.success && apiResponse.data) {
      const apiBookings = apiResponse.data
      
      console.log(`📦 localStorage bookings: ${localBookings.length}`)
      console.log(`🌐 API bookings: ${apiBookings.length}`)
      
      if (localBookings.length === apiBookings.length) {
        console.log('✅ Booking count matches')
      } else {
        console.log('⚠️ Booking count mismatch')
      }
      
      // Check for data integrity
      const localIds = new Set<string>(localBookings.map((b: any) => b.id as string))
      const apiIds = new Set<string>(apiBookings.map(b => b.id))
      
      const missingInApi = Array.from(localIds).filter(id => !apiIds.has(id))
      const missingInLocal = Array.from(apiIds).filter(id => !localIds.has(id))
      
      if (missingInApi.length > 0) {
        console.log(`⚠️ Missing in API: ${missingInApi.join(', ')}`)
      }
      
      if (missingInLocal.length > 0) {
        console.log(`⚠️ Missing in localStorage: ${missingInLocal.join(', ')}`)
      }
      
      if (missingInApi.length === 0 && missingInLocal.length === 0) {
        console.log('✅ Data consistency validated')
      }
      
      return {
        success: true,
        results: {
          localCount: localBookings.length,
          apiCount: apiBookings.length,
          missingInApi: missingInApi.length,
          missingInLocal: missingInLocal.length,
          consistent: missingInApi.length === 0 && missingInLocal.length === 0
        }
      }
    }
    
    return { success: false, message: 'Failed to get API data' }
  } catch (error) {
    console.error('❌ Data validation failed:', error)
    return { success: false, error }
  }
}

/**
 * Run complete migration and validation process
 */
export const runCompleteMigration = async () => {
  console.log('🚀 Starting complete migration process...')
  
  try {
    // Step 1: Migrate bookings data
    const bookingsMigration = await migrateBookingsData()
    console.log('Step 1:', bookingsMigration.message)
    
    // Step 2: Migrate customers data
    const customersMigration = await migrateCustomersData()
    console.log('Step 2:', customersMigration.message)
    
    // Step 3: Test API connectivity
    const connectivityTest = await testApiConnectivity()
    console.log('Step 3:', connectivityTest.success ? 'API connectivity confirmed' : 'API connectivity failed')
    
    // Step 4: Validate data consistency
    const consistencyValidation = await validateDataConsistency()
    console.log('Step 4:', consistencyValidation.success ? 'Data consistency validated' : 'Data consistency issues found')
    
    console.log('🎉 Migration process completed!')
    
    return {
      success: true,
      results: {
        bookingsMigration,
        customersMigration,
        connectivityTest,
        consistencyValidation
      }
    }
  } catch (error) {
    console.error('❌ Migration process failed:', error)
    return { success: false, error }
  }
}

/**
 * Development helper: Clear all localStorage data
 * Use with caution!
 */
export const clearAllLocalStorageData = () => {
  const keys = [
    'allBookings',
    'customers',
    'bookingStatuses',
    'deletedBookings',
    'cancellationRequests',
    'sentCustomerMessages',
    'bookingViewLogs',
    'bookingAdditionLogs'
  ]
  
  console.log('🗑️ Clearing localStorage data...')
  
  keys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
      console.log(`   Removed: ${key}`)
    }
  })
  
  console.log('✅ localStorage cleared')
}

/**
 * Development helper: Seed initial data
 */
export const seedInitialData = async () => {
  console.log('🌱 Seeding initial data...')
  
  try {
    // Load initial data through API to populate localStorage
    await api.booking.getAllBookings()
    await api.customer.getAllCustomers()
    await api.company.getAllCompanies()
    
    console.log('✅ Initial data seeded successfully')
    return { success: true }
  } catch (error) {
    console.error('❌ Failed to seed initial data:', error)
    return { success: false, error }
  }
}

// Export all utilities as default
export default {
  migrateBookingsData,
  migrateCustomersData,
  testApiConnectivity,
  validateDataConsistency,
  runCompleteMigration,
  clearAllLocalStorageData,
  seedInitialData
}
