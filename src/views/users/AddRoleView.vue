<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link :to="getBackNavigationPath()" class="p-2 items-center rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
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
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              placeholder="Enter role name"
              required
              :disabled="isSubmitting"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="newRole.status"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              :disabled="isSubmitting"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
            <div class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <div v-if="permissionsStore.loading" class="text-center py-4">
                <div class="text-gray-500">Loading permissions...</div>
              </div>
              <div v-else-if="permissionsStore.error" class="text-center py-4">
                <div class="text-red-500">{{ permissionsStore.error }}</div>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label v-for="permission in permissionsStore.permissions" :key="permission.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="permission.id"
                    v-model="selectedPermissionIds"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div class="ml-2">
                    <div class="text-sm text-gray-700 font-medium">{{ permission.code_name }}</div>
                    <div class="text-xs text-gray-500">{{ permission.description }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          

          <div class="md:col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              @click="router.back()"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Creating Role...' : 'Create Role' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Success Modal -->
      <SuccessModal
        v-model="showSuccessModal"
        message="Role created successfully"
        @close="closeSuccessModal"
      />

      <!-- Error Modal -->
      <ErrorModal
        v-model="showErrorModal"
        :message="errorMessage"
        :show-retry="true"
        @close="closeErrorModal"
        @retry="retryCreateRole"
      />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SuccessModal from '@/components/ui/SuccessModal.vue'
import ErrorModal from '@/components/ui/ErrorModal.vue'
import { usePermissionsStore } from '@/stores/permissions'
import { permissionApi } from '@/services/api'

// Role interface
interface Role {
  id: string
  name: string
  permissions: string[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive'
}

// Store
const permissionsStore = usePermissionsStore()

// State
const router = useRouter()
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref<string>('')

// Form state
const newRole = ref({
  name: '',
  permissions: [] as string[],
  status: 'active' as 'active' | 'inactive'
})

// Selected permission IDs
const selectedPermissionIds = ref<number[]>([])

// Fetch permissions on component mount
onMounted(async () => {
  await permissionsStore.fetchPermissions()
})

// Navigation functions
const getBackNavigationPath = () => {
  return '/user-management?tab=role-creation'
}

const getBackNavigationLabel = () => {
  return ""
}

// Methods
const createRole = async () => {
  if (selectedPermissionIds.value.length === 0) {
    errorMessage.value = 'Please select at least one permission'
    showErrorModal.value = true
    return
  }

  isSubmitting.value = true

  try {
    // Prepare data for API call
    const roleData = {
      name: newRole.value.name,
      is_active: newRole.value.status === 'active',
      permission_ids: selectedPermissionIds.value
    }

    // Call the API
    const response = await permissionApi.createRole(roleData)

    if (response.success) {
      // Show success modal
      showSuccessModal.value = true

      // Reset form
      newRole.value = {
        name: '',
        permissions: [],
        status: 'active'
      }
      selectedPermissionIds.value = []

      // Don't auto-redirect, let user click OK
    } else {
      errorMessage.value = response.message || 'Failed to create role'
      showErrorModal.value = true
    }
  } catch (error: any) {
    console.error('Error creating role:', error)
    errorMessage.value = error.message || 'An error occurred while creating the role'
    showErrorModal.value = true
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/user-management?tab=role-creation')
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

const retryCreateRole = () => {
  showErrorModal.value = false
  errorMessage.value = ''
  createRole()
}
</script>
