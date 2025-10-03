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
              class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md
"
              placeholder="Enter role name"
              required
              :disabled="isSubmitting"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative">
              <div @click="toggleDropdown('status')" :class="['w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center', dropdownStates.status ? 'border-2 border-green-500 focus:ring-0 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300', { 'opacity-50 cursor-not-allowed': isSubmitting }]">
                <span class="text-gray-900">{{ getStatusLabel(newRole.status) }}</span>
              </div>

              <!-- Dropdown Options -->
              <div v-if="dropdownStates.status" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div class="p-2">
                  <div v-for="option in statusOptions" :key="option.value" @click="selectStatus(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                    {{ option.label }}
                  </div>
                </div>
              </div>

              <!-- Dropdown Arrow -->
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg :class="[
                  'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                  dropdownStates.status ? 'transform rotate-180' : ''
                ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
            <div class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-6">
              <!-- Quick Role Templates -->
              <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 class="text-sm font-medium text-blue-900 mb-3">Quick Role Templates</h4>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="(permissions, roleName) in roleTemplates" 
                    :key="roleName"
                    @click="applyRoleTemplate(permissions)"
                    type="button"
                    class="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {{ roleName }}
                  </button>
                  <button 
                    @click="clearAllPermissions"
                    type="button"
                    class="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <!-- Permission Categories -->
              <div class="space-y-6">
                <div v-for="category in Object.keys(PERMISSIONS_BY_CATEGORY)" :key="category" class="border border-gray-100 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-medium text-gray-900">{{ getCategoryDisplayName(category) }}</h4>
                    <div class="flex items-center space-x-2">
                      <button 
                        @click="toggleCategoryPermissions(category, true)"
                        type="button"
                        class="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Select All
                      </button>
                      <span class="text-gray-300">|</span>
                      <button 
                        @click="toggleCategoryPermissions(category, false)"
                        type="button"
                        class="text-xs text-gray-600 hover:text-gray-800"
                      >
                        None
                      </button>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label 
                      v-for="permission in getCategoryPermissions(category)" 
                      :key="permission" 
                      class="flex items-center p-2 rounded hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        :value="permission"
                        v-model="selectedPermissions"
                        class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div class="ml-3">
                        <div class="text-sm text-gray-700 font-medium">{{ formatPermissionName(permission) }}</div>
                        <div class="text-xs text-gray-500">{{ getPermissionDescription(permission) }}</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Selected Permissions Summary -->
              <div class="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 class="text-sm font-medium text-green-900 mb-2">Selected Permissions ({{ selectedPermissions.length }})</h4>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="permission in selectedPermissions" 
                    :key="permission"
                    class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                  >
                    {{ formatPermissionName(permission) }}
                  </span>
                  <span v-if="selectedPermissions.length === 0" class="text-xs text-green-600">No permissions selected</span>
                </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SuccessModal from '@/components/ui/SuccessModal.vue'
import ErrorModal from '@/components/ui/ErrorModal.vue'
import { usePermissionsStore } from '@/stores/permissions'
import { permissionApi } from '@/services/api'
import { 
  PERMISSIONS, 
  PERMISSION_CATEGORIES, 
  PERMISSION_DESCRIPTIONS,
  PERMISSIONS_BY_CATEGORY 
} from '@/constants/permissions'

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

// Dropdown states
const dropdownStates = ref({
  status: false
})

// Form state
const newRole = ref({
  name: '',
  permissions: [] as string[],
  status: 'active' as 'active' | 'inactive'
})

// Selected permission IDs (legacy)
const selectedPermissionIds = ref<number[]>([])

// Selected permissions (new system)
const selectedPermissions = ref<string[]>([])

// Role templates for quick setup
const roleTemplates = {
  'Super Admin': ['*'], // All permissions
  'Admin': [
    'users.view', 'users.create', 'users.update', 'users.delete',
    'bookings.view', 'bookings.create', 'bookings.update', 'bookings.cancel',
    'companies.view', 'companies.create', 'companies.update',
    'facilities.view', 'facilities.create', 'facilities.update',
    'payments.view', 'reports.view', 'settings.view', 'settings.update'
  ],
  'Manager': [
    'users.view', 'bookings.view', 'bookings.create', 'bookings.update', 'bookings.cancel',
    'companies.view', 'facilities.view', 'payments.view', 'reports.view'
  ],
  'Staff': [
    'bookings.view', 'bookings.create', 'bookings.update',
    'companies.view', 'facilities.view'
  ],
  'User': [
    'bookings.view', 'bookings.create'
  ]
}

// Computed properties for status dropdown
const statusOptions = computed(() => [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
])

const getStatusLabel = (statusValue: string) => {
  const status = statusOptions.value.find(option => option.value === statusValue)
  return status ? status.label : 'Select Status'
}

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

// Dropdown methods
const toggleDropdown = (dropdown: 'status') => {
  dropdownStates.value[dropdown] = !dropdownStates.value[dropdown]
}

const selectStatus = (statusValue: string) => {
  newRole.value.status = statusValue as 'active' | 'inactive'
  dropdownStates.value.status = false
}

// Permission management methods
const formatPermissionName = (permission: string): string => {
  return permission.split('.').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ')
}

const applyRoleTemplate = (permissions: string[]) => {
  selectedPermissions.value = [...permissions]
}

const clearAllPermissions = () => {
  selectedPermissions.value = []
}

const toggleCategoryPermissions = (category: string, selectAll: boolean) => {
  const categoryPerms = PERMISSIONS_BY_CATEGORY[category as keyof typeof PERMISSIONS_BY_CATEGORY] as readonly string[]
  if (selectAll) {
    // Add all category permissions that aren't already selected
    categoryPerms.forEach(permission => {
      if (!selectedPermissions.value.includes(permission)) {
        selectedPermissions.value.push(permission)
      }
    })
  } else {
    // Remove all category permissions
    selectedPermissions.value = selectedPermissions.value.filter(
      permission => !categoryPerms.includes(permission)
    )
  }
}

// Helper functions for TypeScript compatibility
const getCategoryDisplayName = (category: string) => {
  return PERMISSION_CATEGORIES[category as keyof typeof PERMISSION_CATEGORIES] || category
}

const getCategoryPermissions = (category: string) => {
  return PERMISSIONS_BY_CATEGORY[category as keyof typeof PERMISSIONS_BY_CATEGORY] || []
}

const getPermissionDescription = (permission: string) => {
  return PERMISSION_DESCRIPTIONS[permission as keyof typeof PERMISSION_DESCRIPTIONS] || 'No description available'
}

// Methods
const createRole = async () => {
  if (selectedPermissions.value.length === 0) {
    errorMessage.value = 'Please select at least one permission'
    showErrorModal.value = true
    return
  }

  isSubmitting.value = true

  try {
    // Prepare role data with new permission system
    const roleData = {
      id: Date.now().toString(), // Generate temporary ID
      name: newRole.value.name,
      description: `${newRole.value.name} role with custom permissions`,
      permissions: selectedPermissions.value,
      isActive: newRole.value.status === 'active'
    }

    // For now, just add to the permissions store (mock API call)
    // In a real implementation, this would call: await permissionApi.createRole(roleData)
    console.log('Creating role:', roleData)
    
    // Simulate API success
    showSuccessModal.value = true

    // Reset form
    newRole.value = {
      name: '',
      permissions: [],
      status: 'active'
    }
    selectedPermissions.value = []
    selectedPermissionIds.value = []
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
