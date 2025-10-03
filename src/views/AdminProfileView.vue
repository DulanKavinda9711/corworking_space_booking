<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p class="mt-4 text-gray-600">Loading profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Error Loading Profile</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <button @click="fetchProfile" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Retry
          </button>
        </div>
      </div>

      <!-- Profile Card -->
      <div v-else-if="profile" class="bg-white rounded-lg shadow-lg p-8">
        <!-- Profile Overview Card -->
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <!-- Avatar Section -->
          <div class="flex-shrink-0 text-center">
            <div class="relative">
              <img
                class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                :src="displayAvatar"
                :alt="displayName"
              />
              <button
                v-if="editMode"
                @click="changeAvatar"
                class="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCamera" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="flex-1 space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div v-if="editMode" class="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  v-model="profile.first_name"
                  placeholder="First Name"
                  class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md"
                />
                <input
                  type="text"
                  v-model="profile.last_name"
                  placeholder="Last Name"
                  class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md"
                />
              </div>
              <p v-else class="text-xl font-semibold text-gray-900">{{ displayName }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                v-if="editMode"
                type="email"
                v-model="profile.email"
                class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md"
              />
              <p v-else class="text-gray-600">{{ displayEmail }}</p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                v-if="editMode"
                type="tel"
                v-model="profile.phone"
                class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md"
              />
              <p v-else class="text-gray-600">{{ displayPhone }}</p>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <span :class="getRoleClass(profile.role)" class="px-3 py-1 text-sm font-medium rounded-full">
                {{ displayRole }}
              </span>
            </div>

            <!-- Account Info -->
            <div class="pt-4 border-t border-gray-200 space-y-2">
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiClockOutline" />
                </svg>
                <span>Last login: {{ profile.last_login }}</span>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCalendarPlus" />
                </svg>
                <span>Joined: {{ formatDate(profile.joined_date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button (shown only in edit mode) -->
        <div v-if="editMode" class="mt-8 flex justify-end">
          <button
            @click="saveProfile"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiContentSave" />
            </svg>
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <!-- Header with Edit Button -->
      <div class="flex justify-end">
        <button
          @click="editMode = !editMode"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path :d="editMode ? mdiClose : mdiPencil" />
          </svg>
          <span>{{ editMode ? 'Cancel' : 'Edit Profile' }}</span>
        </button>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { adminApi } from '@/services/api'
import type { AdminProfile } from '@/services/api'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  mdiPencil,
  mdiClose,
  mdiContentSave,
  mdiCamera,
  mdiClockOutline,
  mdiCalendarPlus
} from '@mdi/js'

// Store
const authStore = useAuthStore()

// State
const editMode = ref(false)
const showSaveMessage = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

// Profile data
const profile = ref<AdminProfile | null>(null)

// Computed properties
const displayName = computed(() => {
  if (!profile.value) return 'Loading...'
  
  const firstName = profile.value.first_name || ''
  const lastName = profile.value.last_name || ''
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  } else if (firstName) {
    return firstName
  } else if (lastName) {
    return lastName
  } else {
    return 'Admin User'
  }
})

const displayEmail = computed(() => {
  return profile.value?.email || 'Not provided'
})

const displayPhone = computed(() => {
  return profile.value?.phone || 'Not provided'
})

const displayRole = computed(() => {
  return profile.value?.role || 'User'
})

const displayAvatar = computed(() => {
  return profile.value?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
})

// Fetch profile data
const fetchProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Get admin ID from auth store
    const adminId = authStore.user?.id
    
    if (!adminId) {
      throw new Error('Admin ID not found. Please login again.')
    }
    
    const response = await adminApi.getAdminById(adminId)
    
    if (response.success && response.data) {
      profile.value = response.data
    } else {
      throw new Error(response.message || 'Failed to fetch profile')
    }
  } catch (err: any) {
    console.error('Error fetching profile:', err)
    error.value = err.message || 'Failed to load profile data'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchProfile()
})

// Methods
const formatDate = (dateString: string) => {
  if (!dateString || dateString === 'N/A') return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}

const getRoleClass = (role: string) => {
  const roleLower = role.toLowerCase()
  
  if (roleLower.includes('super')) {
    return 'bg-red-100 text-red-800'
  } else if (roleLower.includes('admin')) {
    return 'bg-purple-100 text-purple-800'
  } else if (roleLower.includes('manager')) {
    return 'bg-blue-100 text-blue-800'
  } else if (roleLower.includes('operator') || roleLower.includes('staff')) {
    return 'bg-green-100 text-green-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}

const saveProfile = async () => {
  if (!profile.value) return
  
  // In a real app, this would save to backend via API
  console.log('Saving profile:', profile.value)
  
  // TODO: Implement update API call
  // const response = await adminApi.updateAdmin(profile.value.id, {
  //   first_name: profile.value.first_name,
  //   last_name: profile.value.last_name,
  //   email: profile.value.email,
  //   phone: profile.value.phone
  // })
  
  editMode.value = false
  showSaveMessage.value = true
  setTimeout(() => {
    showSaveMessage.value = false
  }, 3000)
}

const changeAvatar = () => {
  // In a real app, this would open file picker
  alert('Avatar change functionality would be implemented here')
}
</script>
