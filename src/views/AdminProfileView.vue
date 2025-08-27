<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Profile</h1>
          <p class="text-gray-600">Manage your account settings and preferences</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="editMode = !editMode"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="editMode ? mdiClose : mdiPencil" />
            </svg>
            <span>{{ editMode ? 'Cancel' : 'Edit Profile' }}</span>
          </button>
          <button
            v-if="editMode"
            @click="saveProfile"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiContentSave" />
            </svg>
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Overview Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-card p-6">
            <div class="text-center">
              <div class="relative inline-block">
                <img 
                  class="h-24 w-24 rounded-full object-cover mx-auto"
                  :src="profile.avatar"
                  :alt="profile.name"
                />
                <button 
                  v-if="editMode"
                  class="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors"
                  @click="changeAvatar"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCamera" />
                  </svg>
                </button>
              </div>
              <h3 class="mt-4 text-lg font-semibold text-gray-900">{{ profile.name }}</h3>
              <p class="text-gray-600">{{ profile.role }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ profile.email }}</p>
              
              <div class="mt-6 pt-6 border-t border-gray-200">
                <div class="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiClockOutline" />
                  </svg>
                  <span>Last login: {{ formatDate(profile.lastLogin) }}</span>
                </div>
                <div class="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCalendarPlus" />
                  </svg>
                  <span>Joined: {{ formatDate(profile.joinDate) }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Profile Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white rounded-xl shadow-card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  v-if="editMode"
                  type="text"
                  v-model="profile.name"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
                <p v-else class="text-gray-900">{{ profile.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  v-if="editMode"
                  type="email"
                  v-model="profile.email"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
                <p v-else class="text-gray-900">{{ profile.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  v-if="editMode"
                  type="tel"
                  v-model="profile.phone"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
                <p v-else class="text-gray-900">{{ profile.phone }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <p class="text-gray-900 flex items-center">
                  <span :class="getRoleClass(profile.roleKey)" class="px-2 py-1 text-xs font-medium rounded-full mr-2">
                    {{ profile.role }}
                  </span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  mdiPencil,
  mdiClose,
  mdiContentSave,
  mdiCamera,
  mdiClockOutline,
  mdiCalendarPlus,
  mdiCheck
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

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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
