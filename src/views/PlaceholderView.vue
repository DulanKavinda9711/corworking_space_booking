<template>
  <AdminLayout>
    <div class="flex items-center justify-center h-96">
      <div class="text-center">
        <div class="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ pageTitle }}</h1>
        <p class="text-gray-600 mb-6 max-w-md">
          This section is under development. The {{ pageTitle.toLowerCase() }} functionality will be available soon.
        </p>
        <div class="space-y-3">
          <p class="text-sm text-gray-500">
            To continue building this section, please continue prompting with specific requirements.
          </p>
          <div class="flex justify-center space-x-4">
            <router-link 
              to="/dashboard" 
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Dashboard
            </router-link>
            <button 
              @click="showFeatureInfo = !showFeatureInfo"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Planned Features
            </button>
          </div>
        </div>
        
        <!-- Feature Info -->
        <div v-if="showFeatureInfo" class="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200 text-left max-w-2xl mx-auto">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">{{ pageTitle }} - Planned Features</h3>
          <div class="space-y-3 text-sm text-blue-800">
            <div v-for="feature in getPlannedFeatures()" :key="feature" class="flex items-start">
              <svg class="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const route = useRoute()
const showFeatureInfo = ref(false)

const pageTitle = computed(() => {
  return route.meta?.title as string || 'Page'
})

const getPlannedFeatures = () => {
  const features: Record<string, string[]> = {
    'Customers': [
      'Customer list with advanced filtering',
      'Customer profile management',
      'Booking history tracking',
      'User blocking/unblocking functionality',
      'Password reset for registered users',
      'Customer analytics and insights'
    ],
    'Facilities': [
      'Facility management system',
      'Pricing configuration (per hour, monthly, annually)',
      'Status management (active/inactive)',
      'Facility search and filtering',
      'Bulk operations for facilities'
    ],
    'Products': [
      'Product catalog management',
      'Product status tracking',
      'Advanced search and filtering',
      'Product category management',
      'Bulk product operations'
    ],
    'Locations': [
      'Location management system',
      'Company-based location filtering',
      'Map integration with location URLs',
      'Contact person management per location',
      'Product assignment to locations',
      'Additional facilities configuration'
    ],
    'Payments': [
      'Commission setup and management',
      'Location-based payment tracking',
      'Payment method management',
      'Transaction history and reporting',
      'Invoice generation and download',
      'Payment analytics dashboard'
    ],
    'User Management': [
      'User creation and editing',
      'Role-based access control',
      'Dual authentication workflow',
      'User permission management',
      'Audit trail for user actions'
    ],
    'Dual Authentication': [
      'Approval/rejection workflow',
      'Pending actions queue',
      'Multi-level approval system',
      'Audit trail for all approvals',
      'Notification system for pending items'
    ],
    'Reports': [
      'Transaction reports',
      'Audit reports',
      'Customer analytics',
      'Revenue tracking',
      'Booking trend analysis',
      'Export functionality (PDF, Excel)'
    ],
    'Activity Log': [
      'Comprehensive activity tracking',
      'User action logging',
      'System event monitoring',
      'Advanced filtering and search',
      'Real-time activity updates',
      'Activity export functionality'
    ]
  }
  
  return features[pageTitle.value] || [
    'Core functionality implementation',
    'Advanced filtering and search',
    'Data management capabilities',
    'User interface optimization',
    'Integration with existing systems'
  ]
}
</script>
