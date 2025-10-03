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
            <h1 class="text-xl font-bold text-gray-900">Admin Details</h1>
            <p class="text-sm text-gray-500" v-if="admin">{{ admin.full_name }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button
            @click="editAdmin"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Admin</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="flex items-center space-x-3">
          <svg class="animate-spin h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-500">Loading admin details...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-12">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading admin details</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <div class="mt-6">
            <button @click="fetchAdminDetails" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Admin Information & Permissions Cards -->
      <div v-else-if="admin" class="space-y-6 max-w-7xl mx-auto">
        <!-- Admin Information Card -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="px-6 py-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center space-x-2 mb-4">
              <svg class="w-5 h-5 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>Admin Information</span>
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Full Name</p>
                  <p class="font-medium text-gray-900">{{ admin.full_name }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="font-medium text-gray-900">{{ admin.email }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Username</p>
                  <p class="font-medium text-gray-900">{{ admin.username }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Role</p>
                  <p class="font-medium text-gray-900">{{ admin.role_name }}</p>
                </div>
              </div>

              <div v-if="admin.phone" class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Phone</p>
                  <p class="font-medium text-gray-900">{{ admin.phone }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span :class="admin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ admin.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Permissions Card -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="px-6 py-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center space-x-2 mb-4">
              <svg class="w-5 h-5 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              <span>Permissions</span>
            </h3>
            
            <!-- Permissions List -->
            <div v-if="adminPermissions.length > 0" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div v-for="(permission, index) in adminPermissions" :key="index"
                     class="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCheckCircle" />
                  </svg>
                  <div>
                    <div class="text-sm text-gray-700 font-medium">{{ formatPermissionName(permission) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Permissions State -->
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No permissions found</h3>
              <p class="mt-1 text-sm text-gray-500">This admin has no assigned permissions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { dashboardApi } from '@/services/api'
import type { Admin } from '@/services/api'
import { mdiCheckCircle } from '@mdi/js'

// State
const route = useRoute()
const admin = ref<Admin | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const adminPermissions = ref<string[]>([])

// Helper function to format permission names
const formatPermissionName = (permissionCode: string): string => {
  return permissionCode
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Methods
const fetchAdminDetails = async () => {
  try {
    isLoading.value = true
    error.value = null

    const adminId = parseInt(route.params.id as string)
    if (!adminId) {
      error.value = 'Invalid admin ID'
      return
    }

    const response = await dashboardApi.getAdminById(adminId)

    if (response.success && response.data) {
      admin.value = response.data
      // Set permissions directly from admin data
      adminPermissions.value = admin.value.permission_list || []
    } else {
      error.value = response.message || 'Failed to load admin details'
    }
  } catch (err: any) {
    console.error('Error fetching admin details:', err)
    error.value = 'Failed to load admin details'
  } finally {
    isLoading.value = false
  }
}

const editAdmin = () => {
  // TODO: Implement edit admin functionality
  console.log('Edit admin:', admin.value?.id)
}

// Lifecycle
onMounted(() => {
  fetchAdminDetails()
})
</script>