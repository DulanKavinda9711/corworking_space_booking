<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <router-link :to="getBackNavigationPath()" class="flex items-center text-gray-600 hover:text-gray-900">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
            {{ getBackNavigationLabel() }}
          </router-link>
        </div>
          <div>
        <h1 class="text-xl font-bold text-gray-900">Create New User</h1>
          </div>
        </div>
      </div>

      <!-- User Creation Form -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden max-w-6xl mx-auto">
        <form @submit.prevent="createUser" class="p-6 space-y-10">
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
                  v-model="newUser.name"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input
                  type="text"
                  v-model="newUser.username"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  v-model="newUser.email"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  v-model="newUser.phone"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <!-- Role and Permissions & Account Status -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Role and Permissions -->
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiShieldCheck" />
                </svg>
                <span>Role & Permissions</span>
              </h3>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <select v-model="newUser.role" @change="updateUserPermissions"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900">
                    <option value="super-admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="operator">Operator</option>
                  </select>
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <label v-for="permission in getRolePermissions(newUser.role)" :key="permission"
                    class="flex items-center">
                    <input type="checkbox" :value="permission" v-model="newUser.permissions"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700">{{ permission }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiAccountCog" />
                </svg>
                <span>Account Status</span>
              </h3>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select v-model="newUser.status"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900">
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button type="button" @click="router.push('/user-management')"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="isCreating"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
              <svg v-if="isCreating" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
import { mdiAccountDetails, mdiShieldCheck, mdiAccountCog } from '@mdi/js'

// User interface
interface User {
  id: string
  name: string
  username: string
  email: string
  phone: string | null
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

const getBackNavigationPath = () => {
  return '/user-management?tab=user-creation'
}

const getBackNavigationLabel = () => {
  return ''
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

<style scoped>
input[type="checkbox"] {
  transition: all 0.2s ease;
  accent-color: #16a34a; /* Green-600 for fill color */
}
</style>
