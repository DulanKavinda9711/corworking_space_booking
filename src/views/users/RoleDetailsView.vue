<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/user-management?tab=role-creation" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Role Details</h1>
            <p class="text-sm text-gray-500" v-if="role">{{ role.name }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button
            @click="editRole"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Role</span>
          </button>
        </div>
      </div>

      <!-- Role Information Card -->
      <div class="max-w-6xl mx-auto mb-6">
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="px-6 py-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center space-x-2 mb-4">
              <svg class="w-5 h-5 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>Role Information</span>
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiAccountGroup" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Role Name</p>
                  <p class="text-sm font-medium text-gray-900">{{ role?.name }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiShieldCheck" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span :class="role?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ role?.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiShieldAccount" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Total Permissions</p>
                  <p class="text-sm font-medium text-gray-900">{{ role?.permission_details?.length || 0 }} Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions Card -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden max-w-6xl mx-auto">
        <div class="px-6 py-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <svg class="w-5 h-5 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
            <span>Permissions</span>
          </h3>

          <div v-if="role?.permission_details?.length" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div v-for="permission in role.permission_details" :key="permission.id"
                   class="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCheckCircle" />
                </svg>
                <div>
                  <span class="text-sm font-medium text-green-800">{{ permission.code_name }}</span>
                  <p class="text-xs text-green-600">{{ permission.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="text-gray-500 text-sm">No permissions assigned to this role.</p>
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
import { mdiInformationOutline, mdiAccountGroup, mdiShieldCheck, mdiChartBar, mdiCalendar, mdiUpdate, mdiShieldAccount } from '@mdi/js'
import {
  mdiCheckCircle
} from '@mdi/js'

// Types
interface Role {
  id: number
  name: string
  is_active: boolean
  created_date: string
  permission_details: Array<{
    id: number
    code_name: string
    description: string
  }>
}

// Route and Router
const route = useRoute()
const router = useRouter()

// State
const role = ref<Role | null>(null)

// Computed properties
const roleId = computed(() => route.params.id as string)

// Methods


const formatUserLevel = (userLevel?: string) => {
  const levelMap: Record<string, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Admin'
  }
  return levelMap[userLevel || ''] || userLevel || ''
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Mock role data - in a real app, this would be fetched from an API
const loadRole = () => {
  // Sample roles data matching API response structure
  const roles: Role[] = [
    {
      id: 1,
      name: 'SuperAdmin',
      is_active: true,
      created_date: '2025-09-22T14:10:06.300137',
      permission_details: []
    },
    {
      id: 2,
      name: 'Admin 1',
      is_active: true,
      created_date: '2025-09-22T14:12:37.124291',
      permission_details: [
        {
          id: 1,
          code_name: 'Role.Create',
          description: 'Allows creation of new roles'
        },
        {
          id: 3,
          code_name: 'Role.ViewAll',
          description: 'Allows viewing all roles'
        },
        {
          id: 5,
          code_name: 'Admin.Delete',
          description: 'Allows soft-deletion of admin accounts'
        },
        {
          id: 7,
          code_name: 'Admin.AssignRole',
          description: 'Allows assigning roles to admins'
        },
        {
          id: 9,
          code_name: 'Admin.ForcePasswordChange',
          description: 'Allows forcing a password change on an admin'
        },
        {
          id: 11,
          code_name: 'Permission.Delete',
          description: 'Allows deletion of permissions'
        },
        {
          id: 13,
          code_name: 'Permission.ViewAll',
          description: 'Allows viewing all permissions'
        }
      ]
    }
  ]

  const roleIdNum = parseInt(roleId.value)
  role.value = roles.find(r => r.id === roleIdNum) || null
}

const editRole = () => {
  if (!role.value) return
  router.push(`/user-management/role/${roleId.value}/edit`)
}

// Lifecycle
onMounted(() => {
  loadRole()
})
</script>
