<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/user-management?tab=role-creation" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Role Details</h1>
            <p class="text-sm text-gray-500" v-if="role">{{ role.name }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button
            @click="editRole"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Role</span>
          </button>
        </div>
      </div>

      <!-- Role Information & Activity Information Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-6">
        <!-- Role Information Card -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="px-6 py-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center space-x-2 mb-4">
              <svg class="w-5 h-5 text-blue-600" fill="black" viewBox="0 0 24 24">
                <path :d="mdiInformationOutline" />
              </svg>
              <span>Role Information</span>
            </h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiAccountGroup" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Role Name</p>
                  <p class="text-sm font-medium text-gray-900">{{ role?.name }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiShieldCheck" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Total Permissions</p>
                  <p class="text-sm font-medium text-gray-900">{{ role?.permissions?.length || 0 }} Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Information Card -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="px-6 py-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center space-x-2 mb-4">
              <svg class="w-5 h-5 text-blue-600" fill="black" viewBox="0 0 24 24">
                <path :d="mdiChartBar" />
              </svg>
              <span>Activity Information</span>
            </h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCalendar" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Created At</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(role?.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions Card -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden max-w-6xl mx-auto">
        <div class="px-6 py-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="black" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Permissions</span>
          </h3>

          <div v-if="role?.permissions?.length" class="space-y-6">
            <div v-for="category in availablePermissions" :key="category.category">
              <div v-if="hasPermissionsInCategory(category)" class="mb-4">
                <h4 class="text-md font-medium text-gray-800 mb-3">{{ category.category }}</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-4">
                  <div v-for="permission in category.permissions" :key="permission"
                       v-show="role?.permissions?.includes(permission)"
                       class="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCheckCircle" />
                    </svg>
                    <span class="text-sm font-medium text-green-800">{{ permission }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="text-gray-500 text-sm">No permissions assigned to this role.</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiInformationOutline, mdiAccountGroup, mdiShieldCheck, mdiChartBar, mdiCalendar, mdiUpdate } from '@mdi/js'
import {
  mdiCheckCircle
} from '@mdi/js'

// Types
interface Role {
  id: string
  name: string
  userLevel: 'super-admin' | 'admin'
  permissions: string[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'blocked'
}

// Route and Router
const route = useRoute()
const router = useRouter()

// State
const role = ref<Role | null>(null)

// Available permissions
const availablePermissions = [
  {
    category: 'Bookings',
    permissions: [
      'Bookings - View',
      'Bookings - Cancel',
      'Bookings - Export',
      'Subscriptions - View',
      'Subscriptions - Cancel',
      'Booking History - View',
      'Booking History - Delete'
    ]
  },
  {
    category: 'Customer Information',
    permissions: [
      'Customer Profile - View',
      'Customer Profile - Send Message',
      'Customer Management - View',
      'Customer Management - Block/Unblock'
    ]
  },
  {
    category: 'Facilities',
    permissions: [
      'Facilities - Create',
      'Facilities - Update',
      'Facilities - Delete',
      'Facilities - View'
    ]
  },
  {
    category: 'Products',
    permissions: [
      'Products - Create',
      'Products - Update',
      'Products - Edit',
      'Products - Delete',
      'Products - Activate/Deactivate'
    ]
  },
  {
    category: 'Locations',
    permissions: [
      'Locations - Create',
      'Locations - Update',
      'Locations - Edit',
      'Locations - Activate/Deactivate',
      'Locations - Delete'
    ]
  },
  {
    category: 'Payments',
    permissions: [
      'Payments - View',
      'Payments - Download Invoice',
      'Payments - Export CSV',
      'Payments - Commission Setup'
    ]
  },
  {
    category: 'User Management',
    permissions: [
      'User Management - Create',
      'User Management - Edit',
      'User Management - Update',
      'User Management - Delete',
      'User Management - Block/Unblock'
    ]
  },
  {
    category: 'Reports',
    permissions: [
      'Reports - Booking Report Download',
      'Reports - Payment Report Download'
    ]
  },
  {
    category: 'General',
    permissions: [
      'Dashboard Access',
      'Company Management',
      'Activity Logs',
      'System Settings',
      'Bulk Operations',
      'Export Data',
      'Audit Trail'
    ]
  }
]

// Computed properties
const roleId = computed(() => route.params.id as string)

// Methods


const formatUserLevel = (userLevel?: string) => {
  const levelMap: Record<string, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Admin'
  }
  return levelMap[userLevel || ''] || userLevel || ''
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Mock role data - in a real app, this would be fetched from an API
const loadRole = () => {
  // Sample roles data (same as in UserManagementView)
  const roles: Role[] = [
    {
      id: 'ROLE-001',
      name: 'Super Admin',
      userLevel: 'super-admin',
      permissions: [
        'Dashboard Access',
        'User Management - Create',
        'User Management - Edit',
        'User Management - Update',
        'User Management - Delete',
        'User Management - Block/Unblock',
        'System Settings',
        'Audit Trail',
        'Reports - Booking Report Download',
        'Reports - Payment Report Download',
        'Bookings - View',
        'Bookings - Cancel',
        'Bookings - Export',
        'Subscriptions - View',
        'Subscriptions - Cancel',
        'Booking History - View',
        'Booking History - Delete',
        'Customer Profile - View',
        'Customer Profile - Send Message',
        'Customer Management - View',
        'Customer Management - Block/Unblock',
        'Facilities - Create',
        'Facilities - Update',
        'Facilities - Delete',
        'Facilities - View',
        'Products - Create',
        'Products - Update',
        'Products - Edit',
        'Products - Delete',
        'Products - Activate/Deactivate',
        'Locations - Create',
        'Locations - Update',
        'Locations - Edit',
        'Locations - Activate/Deactivate',
        'Locations - Delete',
        'Payments - View',
        'Payments - Download Invoice',
        'Payments - Export CSV',
        'Payments - Commission Setup',
        'Company Management',
        'Activity Logs',
        'Bulk Operations',
        'Export Data'
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 'ROLE-002',
      name: 'Admin',
      userLevel: 'admin',
      permissions: [
        'Dashboard Access',
        'Bookings - View',
        'Bookings - Cancel',
        'Bookings - Export',
        'Subscriptions - View',
        'Subscriptions - Cancel',
        'Booking History - View',
        'Customer Profile - View',
        'Customer Profile - Send Message',
        'Customer Management - View',
        'Customer Management - Block/Unblock',
        'Facilities - Create',
        'Facilities - Update',
        'Facilities - Delete',
        'Facilities - View',
        'Products - Create',
        'Products - Update',
        'Products - Edit',
        'Products - Delete',
        'Products - Activate/Deactivate',
        'Locations - Create',
        'Locations - Update',
        'Locations - Edit',
        'Locations - Activate/Deactivate',
        'Locations - Delete',
        'Payments - View',
        'Payments - Download Invoice',
        'Payments - Export CSV',
        'Payments - Commission Setup',
        'Reports - Booking Report Download',
        'Reports - Payment Report Download',
        'Company Management',
        'Activity Logs',
        'Bulk Operations',
        'Export Data'
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 'ROLE-003',
      name: 'Manager',
      userLevel: 'admin',
      permissions: [
        'Dashboard Access',
        'Bookings - View',
        'Bookings - Cancel',
        'Subscriptions - View',
        'Subscriptions - Cancel',
        'Booking History - View',
        'Customer Profile - View',
        'Customer Profile - Send Message',
        'Customer Management - View',
        'Customer Management - Block/Unblock',
        'Facilities - View',
        'Products - View',
        'Products - Update',
        'Locations - View',
        'Locations - Update',
        'Payments - View',
        'Payments - Download Invoice',
        'Reports - Booking Report Download',
        'Reports - Payment Report Download',
        'Activity Logs'
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 'ROLE-004',
      name: 'Operator',
      userLevel: 'admin',
      permissions: [
        'Dashboard Access',
        'Customer Profile - View',
        'Customer Management - View',
        'Facilities - View',
        'Products - View',
        'Locations - View',
        'Payments - View',
        'Activity Logs'
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'blocked'
    }
  ]

  role.value = roles.find(r => r.id === roleId.value) || null
}

const hasPermissionsInCategory = (category: { category: string; permissions: string[] }) => {
  return category.permissions.some(permission => role.value?.permissions?.includes(permission))
}

const editRole = () => {
  if (!role.value) return
  router.push(`/user-management/role/${roleId.value}/edit`)
}

// Lifecycle
onMounted(() => {
  loadRole()
})
</script>
