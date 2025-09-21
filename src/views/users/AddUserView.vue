<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <router-link :to="getBackNavigationPath()" class="p-2 items-center rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
            {{ getBackNavigationLabel() }}
          </router-link>
        </div>
          <div>
        <h1 class="text-xl font-bold text-gray-900">Create New Admin</h1>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  v-model="newUser.firstName"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  v-model="newUser.lastName"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <!-- Role and Status -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiAccountCog" />
              </svg>
              <span>Role & Status</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <div class="relative">
                  <select v-model="newUser.role" @change="updateUserPermissions"
                    :disabled="isLoadingRoles"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="" disabled v-if="isLoadingRoles">Loading roles...</option>
                    <option value="" disabled v-else-if="availableRoles.length === 0 && !isLoadingRoles">No roles available</option>
                    <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                      {{ role.name }}
                    </option>
                  </select>
                  <div v-if="isLoadingRoles" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                <p v-if="rolesError" class="mt-1 text-sm text-red-600">{{ rolesError }}</p>
              </div>
            </div>
          </div>

          <!-- Permissions -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              
              <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiShieldCheck" />
              </svg>
              <span>Permissions</span>
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <label v-for="permission in getRolePermissions(newUser.role)" :key="permission"
                class="flex items-center">
                <input type="checkbox" :value="permission" v-model="newUser.permissions"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span class="ml-2 text-sm text-gray-700">{{ permission }}</span>
              </label>
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

      <!-- Success Modal -->
      <SuccessModal
        v-model="showSuccessModal"
        :message="successMessage"
        @close="closeSuccessModal"
      />

      <!-- Error Modal -->
      <ErrorModal
        v-model="showErrorModal"
        :message="errorMessage"
        :show-retry="true"
        @close="closeErrorModal"
        @retry="retryCreateUser"
      />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SuccessModal from '@/components/ui/SuccessModal.vue'
import ErrorModal from '@/components/ui/ErrorModal.vue'
import { mdiAccountDetails, mdiShieldCheck, mdiAccountCog } from '@mdi/js'
import { permissionApi } from '@/services/api'
import { authApi } from '@/services/api'

// Role interface from API
interface ApiRole {
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

// User interface
interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string | null
  role: string
  status: 'active' | 'blocked'
  lastLogin: string | null
  permissions: string[]
  avatar: string
  createdAt: string
  updatedAt: string
}

// State for fetched roles
const roles = ref<ApiRole[]>([])
const isLoadingRoles = ref(false)
const rolesError = ref<string | null>(null)

// Computed property to transform API roles into the format expected by the template
const availableRoles = computed(() => {
  // Transform API roles to match the expected format
  return roles.value
    .filter(role => role.is_active) // Only show active roles
    .map(role => ({
      name: role.name,
      value: role.id.toString(),
      permissions: role.permission_details.map(perm => perm.code_name)
    }))
})

// Function to add a new role (can be called when creating roles)
const addNewRole = (roleName: string, permissions: string[]) => {
  const roleValue = roleName.toLowerCase().replace(/\s+/g, '-')
  // Note: This would need to be updated to work with the new dynamic system
  console.log('Adding new role:', roleName, permissions)
}

// State
const router = useRouter()
const isCreating = ref(false)

// Modal states
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const newUser = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  role: '' as string,
  permissions: [] as string[],
  status: 'active' as 'active' | 'blocked'
})

// Fetch roles from API
const fetchRoles = async () => {
  try {
    isLoadingRoles.value = true
    rolesError.value = null

    const response = await permissionApi.getAllRoles()

    if (response.success && response.data) {
      roles.value = response.data
      console.log('Roles fetched successfully:', response.data)
    } else {
      console.error('Failed to fetch roles:', response.message)
      rolesError.value = response.message || 'Failed to load roles'
      roles.value = []
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
    rolesError.value = 'Failed to load roles'
    roles.value = []
  } finally {
    isLoadingRoles.value = false
  }
}

// Methods
const getRolePermissions = (roleValue: string) => {
  const role = availableRoles.value.find(r => r.value === roleValue)
  return role ? role.permissions : []
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
    // Prepare admin data for API
    const adminData = {
      first_name: newUser.value.firstName,
      last_name: newUser.value.lastName,
      user_name: newUser.value.username,
      role_id: parseInt(newUser.value.role),
      email: newUser.value.email,
      phone: newUser.value.phone || ''
    }

    // Call the API to create new admin
    const response = await authApi.createNewAdmin(adminData)

    if (response.success) {
      console.log('Admin created successfully:', response.data)

      // Reset form
      newUser.value = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        role: '',
        permissions: [],
        status: 'active'
      }

      // Show success message and redirect
      successMessage.value = 'Admin created successfully!'
      showSuccessModal.value = true
    } else {
      console.error('Failed to create admin:', response.message)
      errorMessage.value = `Failed to create admin: ${response.message}`
      showErrorModal.value = true
    }

  } catch (error) {
    console.error('Error creating admin:', error)
    errorMessage.value = 'Failed to create admin. Please try again.'
    showErrorModal.value = true
  } finally {
    isCreating.value = false
  }
}

// Modal handlers
const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/user-management')
}

const closeErrorModal = () => {
  showErrorModal.value = false
}

const retryCreateUser = () => {
  showErrorModal.value = false
  // Optionally retry the creation, for now just close
}

// Initialize on mount
import { onMounted } from 'vue'

onMounted(() => {
  // Fetch roles from API
  fetchRoles()

  // Update permissions when component mounts
  updateUserPermissions()
})
</script>

<style scoped>
input[type="checkbox"] {
  transition: all 0.2s ease;
  accent-color: #16a34a; /* Green-600 for fill color */
}
</style>
