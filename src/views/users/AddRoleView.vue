<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link :to="getBackNavigationPath()" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ getBackNavigationLabel() }}
        </router-link>
        <div>
        <h1 class="text-xl font-bold text-gray-900">Create New Role</h1>
        </div>
      </div>
    </div>

      <!-- Role Creation Form -->
      <div class="bg-white rounded-xl shadow-card p-6 max-w-6xl mx-auto">
        <form @submit.prevent="createRole" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
            <input
              v-model="newRole.name"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter role name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">User Level</label>
            <select
              v-model="newRole.userLevel"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="super-admin">Super Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="newRole.status"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
            <div class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <div class="space-y-6">
                <div v-for="category in permissionCategories" :key="category.category">
                  <h4 class="text-md font-medium text-gray-900 mb-3">{{ category.category }}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label v-for="permission in category.permissions" :key="permission" class="flex items-center">
                      <input
                        type="checkbox"
                        :value="permission"
                        v-model="newRole.permissions"
                        class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ permission }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          

          <div class="md:col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              @click="router.back()"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiCheckCircle" />
          </svg>
          <span class="text-green-800">Role created successfully!</span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiCheckCircle } from '@mdi/js'

// Role interface
interface Role {
  id: string
  name: string
  userLevel: 'super-admin' | 'admin'
  permissions: string[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'blocked'
}

// All available permissions organized by category
const permissionCategories = [
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

// State
const router = useRouter()
const showSuccess = ref(false)

// Form state
const newRole = ref({
  name: '',
  userLevel: 'admin' as 'super-admin' | 'admin',
  permissions: [] as string[],
  status: 'active' as 'active' | 'blocked'
})

// Navigation functions
const getBackNavigationPath = () => {
  return '/user-management?tab=roles'
}

const getBackNavigationLabel = () => {
  return
}

// Methods
const createRole = () => {
  const role: Role = {
    id: `ROLE-${Date.now()}`,
    name: newRole.value.name,
    userLevel: newRole.value.userLevel,
    permissions: newRole.value.permissions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: newRole.value.status
  }

  // In a real application, you would make an API call here
  console.log('Creating role:', role)

  // Show success message
  showSuccess.value = true

  // Reset form
  newRole.value = {
    name: '',
    userLevel: 'admin',
    permissions: [],
    status: 'active'
  }

  // Redirect back after a short delay
  setTimeout(() => {
    router.push('/user-management')
  }, 2000)
}
</script>
