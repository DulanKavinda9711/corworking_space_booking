<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/user-management" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Edit User</h1>
            <p class="text-sm text-gray-500" v-if="user">{{ user.name }}</p>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden max-w-6xl mx-auto">
        <form @submit.prevent="saveUserChanges" class="p-6 space-y-10">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiAccountDetails" />
              </svg>
              <span>Personal Information</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  v-model="form.name"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  v-model="form.email"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  v-model="form.phone"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <!-- Role and Status -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiAccountCog" />
              </svg>
              <span>Role and Status</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  v-model="form.role"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="super-admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="operator">Operator</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  v-model="form.status"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Permissions -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiShieldCheck" />
              </svg>
              <span>Permissions</span>
            </h3>
            <div class="space-y-6 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <div v-for="category in availablePermissions" :key="category.category" class="space-y-3">
                <h4 class="font-semibold text-gray-900">{{ category.category }}</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                  <label v-for="permission in category.permissions" :key="permission" class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      :value="permission"
                      v-model="form.permissions"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-700">{{ permission }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="$router.go(-1)"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiAccountDetails, mdiAccountCog, mdiShieldCheck } from '@mdi/js'

// Types
interface User {
  id: string
  name: string
  email: string
  phone: string | null
  department: string | null
  role: 'super-admin' | 'admin' | 'manager' | 'operator'
  status: 'active' | 'blocked'
  lastLogin: string | null
  permissions: string[]
  avatar: string
}

// Route and Router
const route = useRoute()
const router = useRouter()

// State
const isLoading = ref(false)
const user = ref<User | null>(null)
const form = ref({
  name: '',
  email: '',
  phone: '',
  role: '' as User['role'],
  status: 'active' as User['status'],
  permissions: [] as string[]
})

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

// Mock user data - in a real app, this would be fetched from an API
const loadUser = () => {
  // Sample users data (same as in UserManagementView)
  const users: User[] = [
    {
      id: 'USR-001',
      name: 'John Administrator',
      email: 'john.admin@cowork.com',
      phone: '+1 (555) 123-4567',
      department: 'IT',
      role: 'super-admin',
      status: 'active',
      lastLogin: '2024-08-15T10:30:00Z',
      permissions: ['Bookings - View', 'Bookings - Cancel', 'Subscriptions - View', 'Subscriptions - Cancel', 'Booking History - View', 'Booking History - Delete', 'Customer Profile - View', 'Customer Profile - Send Message', 'Customer Management - View', 'Customer Management - Block/Unblock', 'Facilities - Create', 'Facilities - Update', 'Facilities - Delete', 'Facilities - View', 'Products - Create', 'Products - Update', 'Products - Edit', 'Products - Delete', 'Products - Activate/Deactivate', 'Locations - Create', 'Locations - Update', 'Locations - Edit', 'Locations - Activate/Deactivate', 'Locations - Delete', 'Payments - View', 'Payments - Download Invoice', 'Payments - Export CSV', 'Payments - Commission Setup', 'User Management - Create', 'User Management - Edit', 'User Management - Update', 'User Management - Delete', 'User Management - Block/Unblock', 'Reports - Booking Report Download', 'Reports - Payment Report Download', 'Dashboard Access', 'Company Management', 'Activity Logs', 'System Settings', 'Bulk Operations', 'Export Data', 'Audit Trail'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'USR-002',
      name: 'Sarah Manager',
      email: 'sarah.manager@cowork.com',
      phone: '+1 (555) 987-6543',
      department: 'Operations',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-08-15T08:45:00Z',
      permissions: ['Bookings - View', 'Bookings - Cancel', 'Customer Profile - View', 'Customer Profile - Send Message', 'Customer Management - View', 'Customer Management - Block/Unblock', 'Reports - Booking Report Download', 'Reports - Payment Report Download', 'Dashboard Access', 'Company Management'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c2?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'USR-003',
      name: 'Mike Operator',
      email: 'mike.operator@cowork.com',
      phone: '+1 (555) 456-7890',
      department: 'Customer Service',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-08-14T16:20:00Z',
      permissions: ['Bookings - View', 'Customer Profile - View', 'Customer Profile - Send Message', 'Customer Management - View', 'Dashboard Access'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'USR-004',
      name: 'Emma Support',
      email: 'emma.support@cowork.com',
      phone: '+1 (555) 234-5678',
      department: 'Support',
      role: 'operator',
      status: 'active',
      lastLogin: null,
      permissions: ['Customer Profile - View', 'Customer Management - View', 'Dashboard Access'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'USR-005',
      name: 'David Analyst',
      email: 'david.analyst@cowork.com',
      phone: '+1 (555) 345-6789',
      department: 'Analytics',
      role: 'operator',
      status: 'blocked',
      lastLogin: '2024-08-10T12:15:00Z',
      permissions: ['Reports - Booking Report Download', 'Reports - Payment Report Download', 'Dashboard Access'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
    }
  ]

  user.value = users.find(u => u.id === userId.value) || null

  if (user.value) {
    form.value = {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone || '',
      role: user.value.role,
      status: user.value.status,
      permissions: [...user.value.permissions]
    }
  }
}

const saveUserChanges = async () => {
  if (!user.value) return

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user data
    user.value.name = form.value.name
    user.value.email = form.value.email
    user.value.phone = form.value.phone || null
    user.value.role = form.value.role
    user.value.status = form.value.status
    user.value.permissions = [...form.value.permissions]

    // In a real app, you would make an API call here
    console.log('User updated:', user.value)

    // Navigate back to user details
    router.push(`/user-management/${userId.value}`)

  } catch (error) {
    console.error('Error saving user:', error)
    // Handle error (show toast, etc.)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadUser()
})
</script>
<style scoped>
input[type="checkbox"] {
  transition: all 0.2s ease;
  accent-color: #16a34a; /* Green-600 for fill color */
}
</style>
