/**
 * Browser Console Migration Script
 * 
 * Run this script in the browser console to migrate data and test the API
 * 
 * Usage:
 * 1. Open browser developer tools (F12)
 * 2. Go to Console tab
 * 3. Copy and paste this script
 * 4. Run the commands as needed
 */

// Migration commands to run in browser console:

/*

// 1. Test API connectivity
import('/src/utils/migrationHelper.js').then(({ testApiConnectivity }) => {
  testApiConnectivity()
})

// 2. Run complete migration
import('/src/utils/migrationHelper.js').then(({ runCompleteMigration }) => {
  runCompleteMigration()
})

// 3. Validate data consistency
import('/src/utils/migrationHelper.js').then(({ validateDataConsistency }) => {
  validateDataConsistency()
})

// 4. Clear localStorage (use with caution!)
import('/src/utils/migrationHelper.js').then(({ clearAllLocalStorageData }) => {
  clearAllLocalStorageData()
})

// 5. Seed initial data
import('/src/utils/migrationHelper.js').then(({ seedInitialData }) => {
  seedInitialData()
})

// 6. Test individual API calls
import('/src/services/api.js').then(({ bookingApi, customerApi }) => {
  // Test bookings
  bookingApi.getAllBookings().then(response => {
    console.log('Bookings:', response)
  })
  
  // Test customers  
  customerApi.getAllCustomers().then(response => {
    console.log('Customers:', response)
  })
})

// 7. Quick API status check
import('/src/services/api.js').then(({ dashboardApi }) => {
  dashboardApi.getStats().then(stats => {
    console.log('Dashboard Stats:', stats)
  })
})

*/

// You can also use this simplified version:
console.log(`
🚀 API Migration Helper

Available commands:
1. Test API: testAPI()
2. Migrate data: migrateData()  
3. Validate data: validateData()
4. Clear storage: clearStorage() [⚠️ Use with caution]
5. Seed data: seedData()

Example: Just type "testAPI()" in the console and press Enter
`)

// Global helper functions for easier console usage
window.testAPI = async () => {
  const { testApiConnectivity } = await import('/src/utils/migrationHelper.js')
  return testApiConnectivity()
}

window.migrateData = async () => {
  const { runCompleteMigration } = await import('/src/utils/migrationHelper.js')
  return runCompleteMigration()
}

window.validateData = async () => {
  const { validateDataConsistency } = await import('/src/utils/migrationHelper.js')
  return validateDataConsistency()
}

window.clearStorage = async () => {
  const { clearAllLocalStorageData } = await import('/src/utils/migrationHelper.js')
  return clearAllLocalStorageData()
}

window.seedData = async () => {
  const { seedInitialData } = await import('/src/utils/migrationHelper.js')
  return seedInitialData()
}

window.quickApiTest = async () => {
  const { bookingApi, customerApi, dashboardApi } = await import('/src/services/api.js')
  
  console.log('🧪 Running quick API test...')
  
  try {
    const [bookings, customers, stats] = await Promise.all([
      bookingApi.getAllBookings(),
      customerApi.getAllCustomers(),
      dashboardApi.getStats()
    ])
    
    console.log('📋 Bookings API:', bookings.success ? '✅' : '❌', bookings.data?.length || 0, 'items')
    console.log('👥 Customers API:', customers.success ? '✅' : '❌', customers.data?.length || 0, 'items')  
    console.log('📊 Dashboard API:', stats.success ? '✅' : '❌')
    
    return {
      bookings: bookings.success,
      customers: customers.success,
      dashboard: stats.success,
      allPassed: bookings.success && customers.success && stats.success
    }
  } catch (error) {
    console.error('❌ Quick API test failed:', error)
    return { allPassed: false, error }
  }
}
