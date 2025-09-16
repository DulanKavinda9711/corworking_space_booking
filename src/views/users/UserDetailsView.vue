<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/user-management?tab=user-creation" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">User Details</h1>
            <!-- <p class="text-sm text-gray-500" v-if="user">{{ user.name }}</p> -->
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button
            @click="editUser"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit User</span>
          </button>
        </div>
      </div>

      <!-- Main User Card -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden max-w-6xl mx-auto">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
          <div class="flex items-center space-x-6">
            <img class="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                 :src="user?.avatar"
                 :alt="user?.name">
            <div class="flex-1 text-white">
              <h1 class="text-2xl font-bold">{{ user?.name }}</h1>
              
              <div class="flex items-center space-x-4 mt-2">
                <span :class="getRoleClass(user?.role)" class="px-3 py-1 text-sm font-medium rounded-full">
                  {{ formatRole(user?.role) }}
                </span>
                <span :class="getStatusClass(user?.status)" class="px-3 py-1 text-sm font-medium rounded-full">
                  {{ user?.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- User Details -->
        <div class="px-6 py-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Contact Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center space-x-2">
                <svg class="w-5 h-5 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCardAccountDetailsOutline" />
                </svg>
                <span>Contact Information</span>
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiAccount" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Full Name</p>
                    <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiAccountOutline" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Username</p>
                    <p class="text-sm font-medium text-gray-900">{{ user?.username || 'Not set' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiEmail" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="text-sm font-medium text-gray-900">{{ user?.email }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiPhone" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Phone</p>
                    <p class="text-sm font-medium text-gray-900">{{ user?.phone || 'Not provided' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center space-x-2">
                <svg class="w-5 h-5 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiChartBar" />
                </svg>
                <span>Quick Stats</span>
              </h3>
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiShieldCheck" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Permissions</p>
                    <p class="text-sm font-medium text-gray-900">{{ user?.permissions?.length || 0 }} Active</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiAccountCheck" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Status</p>
                    <p class="text-sm font-medium text-gray-900">
                      <span :class="user?.status === 'active' ? 'text-green-600' : 'text-red-600'">
                        {{ user?.status === 'active' ? 'Active' : 'Blocked' }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Permissions Section -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Permissions</span>
            </h3>

            <div v-if="user?.permissions?.length" class="space-y-6">
              <div v-for="category in availablePermissions" :key="category.category">
                <div v-if="hasPermissionsInCategory(category)" class="mb-4">
                  <h4 class="text-md font-medium text-gray-800 mb-3">{{ category.category }}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-4">
                    <div v-for="permission in category.permissions" :key="permission"
                         v-show="user?.permissions?.includes(permission)"
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
              <p class="text-gray-500 text-sm">No permissions assigned to this user.</p>
            </div>
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
import { mdiEmail, mdiPhone, mdiShieldCheck, mdiAccountCheck, mdiCardAccountDetailsOutline, mdiChartBar, mdiAccount, mdiAccountOutline } from '@mdi/js'
import {
  mdiCheckCircle
} from '@mdi/js'

// Types
interface User {
  id: string
  name: string
  username: string
  email: string
  phone: string | null
  department: string | null
  role: 'super-admin' | 'admin' | 'manager' | 'operator'
  status: 'active' | 'blocked'
  lastLogin: string | null
  permissions: string[]
  avatar: string
  enable2FA?: boolean
}

// Route and Router
const route = useRoute()
const router = useRouter()

// State
const user = ref<User | null>(null)

// Available permissions
const availablePermissions = [
  {
    category: 'Bookings',
    permissions: [
      'Bookings - View',
      'Bookings - Cancel',
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
const userId = computed(() => route.params.id as string)

// Methods
const getRoleClass = (role?: string) => {
  switch (role) {
    case 'super-admin':
      return 'bg-red-100 text-red-800'
    case 'admin':
      return 'bg-purple-100 text-purple-800'
    case 'manager':
      return 'bg-blue-100 text-blue-800'
    case 'operator':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusClass = (status?: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'blocked':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatRole = (role?: string) => {
  const roleMap: Record<string, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Admin',
    'manager': 'Manager',
    'operator': 'Operator'
  }
  return roleMap[role || ''] || role || ''
}

// Mock user data - in a real app, this would be fetched from an API
const loadUser = () => {
  // Sample users data (same as in UserManagementView)
  const users: User[] = [
    {
      id: 'USR-001',
      name: 'John Administrator',
      username: 'john.admin',
      email: 'john.admin@cowork.com',
      phone: '+1 (555) 123-4567',
      department: 'IT',
      role: 'super-admin',
      status: 'active',
      lastLogin: '2024-08-15T10:30:00Z',
      permissions: ['Bookings - View', 'Bookings - Cancel', 'Subscriptions - View', 'Subscriptions - Cancel', 'Booking History - View', 'Booking History - Delete', 'Customer Profile - View', 'Customer Profile - Send Message', 'Customer Management - View', 'Customer Management - Block/Unblock', 'Facilities - Create', 'Facilities - Update', 'Facilities - Delete', 'Facilities - View', 'Products - Create', 'Products - Update', 'Products - Edit', 'Products - Delete', 'Products - Activate/Deactivate', 'Locations - Create', 'Locations - Update', 'Locations - Edit', 'Locations - Activate/Deactivate', 'Locations - Delete', 'Payments - View', 'Payments - Download Invoice', 'Payments - Export CSV', 'Payments - Commission Setup', 'User Management - Create', 'User Management - Edit', 'User Management - Update', 'User Management - Delete', 'User Management - Block/Unblock', 'Reports - Booking Report Download', 'Reports - Payment Report Download', 'Dashboard Access', 'Company Management', 'Activity Logs', 'System Settings', 'Bulk Operations', 'Export Data', 'Audit Trail'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
      enable2FA: true
    },
    {
      id: 'USR-002',
      name: 'Sarah Manager',
      username: 'sarah.manager',
      email: 'sarah.manager@cowork.com',
      phone: '+1 (555) 987-6543',
      department: 'Operations',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-08-15T08:45:00Z',
      permissions: ['Bookings - View', 'Bookings - Cancel', 'Customer Profile - View', 'Customer Profile - Send Message', 'Customer Management - View', 'Customer Management - Block/Unblock', 'Reports - Booking Report Download', 'Reports - Payment Report Download', 'Dashboard Access', 'Company Management'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c2?w=100&h=100&fit=crop&crop=faces',
      enable2FA: false
    },
    {
      id: 'USR-003',
      name: 'Mike Operator',
      username: 'mike.operator',
      email: 'mike.operator@cowork.com',
      phone: '+1 (555) 456-7890',
      department: 'Customer Service',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-08-14T16:20:00Z',
      permissions: ['Bookings - View', 'Customer Profile - View', 'Customer Profile - Send Message', 'Customer Management - View', 'Dashboard Access'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      enable2FA: true
    },
    {
      id: 'USR-004',
      name: 'Emma Support',
      username: 'emma.support',
      email: 'emma.support@cowork.com',
      phone: '+1 (555) 234-5678',
      department: 'Support',
      role: 'operator',
      status: 'active',
      lastLogin: null,
      permissions: ['Customer Profile - View', 'Customer Management - View', 'Dashboard Access'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
      enable2FA: false
    },
    {
      id: 'USR-005',
      name: 'David Analyst',
      username: 'david.analyst',
      email: 'david.analyst@cowork.com',
      phone: '+1 (555) 345-6789',
      department: 'Analytics',
      role: 'operator',
      status: 'blocked',
      lastLogin: '2024-08-10T12:15:00Z',
      permissions: ['Reports - Booking Report Download', 'Reports - Payment Report Download', 'Dashboard Access'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      enable2FA: false
    }
  ]

  user.value = users.find(u => u.id === userId.value) || null
}

const hasPermissionsInCategory = (category: { category: string; permissions: string[] }) => {
  return category.permissions.some(permission => user.value?.permissions?.includes(permission))
}

const editUser = () => {
  if (!user.value) return
  router.push(`/user-management/${userId.value}/edit`)
}

// Lifecycle
onMounted(() => {
  loadUser()
})
</script>
