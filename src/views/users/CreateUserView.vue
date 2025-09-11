<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create New User</h1>
          <p class="text-gray-600 mt-1">Add a new user to the system with appropriate roles and permissions</p>
        </div>
        <button @click="router.push('/user-management')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Users</span>
        </button>
      </div>

      <!-- User Creation Form -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <form @submit.prevent="createUser" class="space-y-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input v-model="newUser.name" type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter full name" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input v-model="newUser.username" type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter username" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input v-model="newUser.email" type="email"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter email" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input v-model="newUser.phone" type="tel"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter phone number" />
              </div>
            </div>
          </div>

          <!-- Role and Permissions -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Role & Permissions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select v-model="newUser.role" @change="updateUserPermissions"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="super-admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="operator">Operator</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input v-model="newUser.department" type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter department" />
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label v-for="permission in getRolePermissions(newUser.role)" :key="permission"
                  class="flex items-center">
                  <input type="checkbox" :value="permission" v-model="newUser.permissions"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span class="ml-2 text-sm text-gray-700">{{ permission }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select v-model="newUser.status"
                class="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <button type="button" @click="router.push('/user-management')"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="isCreating"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
              <svg v-if="isCreating" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isCreating ? 'Creating...' : 'Create User' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// User interface
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
  createdAt: string
  updatedAt: string
}

// State
const router = useRouter()
const isCreating = ref(false)

const newUser = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  department: '',
  role: 'operator' as 'super-admin' | 'admin' | 'manager' | 'operator',
  permissions: [] as string[],
  status: 'active' as 'active' | 'blocked'
})

// Methods
const getRolePermissions = (role: string) => {
  const rolePermissions: Record<string, string[]> = {
    'super-admin': ['Dashboard Access', 'User Management', 'System Settings', 'Audit Trail', 'Reports Access'],
    'admin': ['Dashboard Access', 'Company Management', 'Booking Management', 'Reports Access'],
    'manager': ['Dashboard Access', 'Customer Management', 'Booking Management'],
    'operator': ['Dashboard Access', 'Customer Management']
  }
  return rolePermissions[role] || []
}

const updateUserPermissions = () => {
  newUser.value.permissions = getRolePermissions(newUser.value.role)
}

const createUser = async () => {
  if (isCreating.value) return

  isCreating.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const user: User = {
      id: `USR-${Date.now()}`,
      name: newUser.value.name,
      username: newUser.value.username,
      email: newUser.value.email,
      phone: newUser.value.phone || null,
      department: newUser.value.department || null,
      role: newUser.value.role,
      status: newUser.value.status,
      lastLogin: null,
      permissions: newUser.value.permissions,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Here you would typically make an API call to save the user
    console.log('Creating user:', user)

    // Reset form
    newUser.value = {
      name: '',
      username: '',
      email: '',
      phone: '',
      department: '',
      role: 'operator',
      permissions: [],
      status: 'active'
    }

    // Show success message and redirect
    alert('User created successfully!')
    router.push('/user-management')

  } catch (error) {
    console.error('Error creating user:', error)
    alert('Failed to create user. Please try again.')
  } finally {
    isCreating.value = false
  }
}

// Initialize permissions on mount
import { onMounted } from 'vue'

onMounted(() => {
  updateUserPermissions()
})
</script>
