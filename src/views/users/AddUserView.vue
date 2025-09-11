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
        <h1 class="text-xl font-bold text-gray-900">Add New User</h1>
        </div>
      </div>
    </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden max-w-6xl mx-auto">
        <!-- <div class="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-9 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div class="text-white">
              <h2 class="text-xl font-semibold">Create User Account</h2>
            </div>
          </div>
        </div> -->

        <form @submit.prevent="saveUser" class="p-6 space-y-8">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <svg class="w-5 h-5 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiAccountDetails" />
              </svg>
              <span>Personal Information</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  v-model="form.name"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  v-model="form.email"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  v-model="form.phone"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  v-model="form.department"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="Enter department"
                />
              </div>
            </div>
          </div>

          <!-- Role and Status -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <svg class="w-5 h-5 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiAccountCog" />
              </svg>
              <span>Role and Status</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  v-model="form.role"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select role</option>
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
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Permissions -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <svg class="w-5 h-5 text-black-600" fill="currentColor" viewBox="0 0 24 24">
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
                      class="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
              <span>{{ isLoading ? 'Creating User...' : 'Create User' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiCheckCircle" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">User Created Successfully</h3>
          <p class="text-gray-600 mb-6">
            The new user has been created and is now active in the system.
          </p>
          <div class="flex justify-center space-x-3">
            <button
              @click="closeSuccessModal"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiAccountDetails, mdiAccountCog, mdiShieldCheck, mdiCheckCircle } from '@mdi/js'

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

// Router
const router = useRouter()

// State
const isLoading = ref(false)
const showSuccessModal = ref(false)

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '',
  department: '',
  role: '' as 'super-admin' | 'admin' | 'manager' | 'operator' | '',
  status: 'active' as 'active' | 'blocked',
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

// Methods
const saveUser = async () => {
  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In a real app, you would send this data to your backend
    const newUser: User = {
      id: `USR-${Date.now()}`,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone || null,
      department: form.value.department || null,
      role: form.value.role as User['role'],
      status: form.value.status,
      lastLogin: null,
      permissions: [...form.value.permissions],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
    }

    console.log('New user created:', newUser)

    // Show success modal
    showSuccessModal.value = true

  } catch (error) {
    console.error('Error creating user:', error)
    // Handle error (show toast, etc.)
  } finally {
    isLoading.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/user-management')
}
</script>
<style scoped>
input[type="checkbox"] {
  transition: all 0.2s ease;
  accent-color: #16a34a; /* Green-600 for fill color */
}
</style>
