<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Profile Card -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <!-- Profile Overview Card -->
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <!-- Avatar Section -->
          <div class="flex-shrink-0 text-center">
            <div class="relative">
              <img
                class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                :src="profile.avatar"
                :alt="profile.name"
              />
              <button
                v-if="editMode"
                @click="changeAvatar"
                class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
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
              <input
                v-if="editMode"
                type="text"
                v-model="profile.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p v-else class="text-xl font-semibold text-gray-900">{{ profile.name }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                v-if="editMode"
                type="email"
                v-model="profile.email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p v-else class="text-gray-600">{{ profile.email }}</p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                v-if="editMode"
                type="tel"
                v-model="profile.phone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p v-else class="text-gray-600">{{ profile.phone }}</p>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <span :class="getRoleClass(profile.roleKey)" class="px-3 py-1 text-sm font-medium rounded-full">
                {{ profile.role }}
              </span>
            </div>

            <!-- Account Info -->
            <div class="pt-4 border-t border-gray-200 space-y-2">
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiClockOutline" />
                </svg>
                <span>Last login: {{ formatDate(profile.lastLogin) }}</span>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCalendarPlus" />
                </svg>
                <span>Joined: {{ formatDate(profile.joinDate) }}</span>
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
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  mdiPencil,
  mdiClose,
  mdiContentSave,
  mdiCamera,
  mdiClockOutline,
  mdiCalendarPlus
} from '@mdi/js'

// State
const editMode = ref(false)
const showSaveMessage = ref(false)

// Profile data
const profile = ref({
  name: 'John Administrator',
  email: 'john.admin@cowork.com',
  phone: '+1 (555) 123-4567',
  role: 'Super Administrator',
  roleKey: 'super-admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  joinDate: '2023-01-15T09:00:00Z',
  lastLogin: '2024-08-15T14:30:00Z'
})

// Computed properties

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getRoleClass = (role: string) => {
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

const saveProfile = () => {
  // In a real app, this would save to backend
  console.log('Saving profile:', profile.value)
  
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
