<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link :to="getBackNavigationPath()" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Role Details</h1>
            <p class="text-sm text-gray-500" v-if="role">{{ role.name }}</p>
          </div>
        </div>
      </div>

      <!-- Role Edit Form -->
      <div class="bg-white rounded-xl shadow-card p-6 max-w-6xl mx-auto">
        <form @submit.prevent="updateRole" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 ">Role Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              placeholder="Enter role name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 ">Status</label>
            <select
              v-model="formData.status"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
            >
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
            <div class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <div class="space-y-6">
                <div v-for="category in permissionCategories" :key="category.category">
                  <h4 class="text-md font-medium text-gray-900 mb-3">{{ category.category }}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label v-for="permission in category.permissions" :key="permission" class="flex items-center">
                      <input
                        type="checkbox"
                        :value="permission"
                        v-model="selectedPermissions"
                        class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ permission }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="md:col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              @click="cancelEdit"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <svg v-if="saving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ saving ? 'Updating...' : 'Update Role' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiCheckCircle" />
          </svg>
          <span class="text-green-800">Role updated successfully!</span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiCheckCircle } from '@mdi/js'

// Types
interface Role {
  id: string
  name: string
  permissions: string[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'blocked'
}

// Route and Router
const route = useRoute()
const router = useRouter()

// State
const role = ref<Role | null>(null)
const saving = ref(false)
const showSuccess = ref(false)
const formData = ref({
  name: '',
  status: 'active' as 'active' | 'blocked'
})
const selectedPermissions = ref<string[]>([])

// All available permissions organized by category
const permissionCategories = [
  {
    category: 'Bookings',
    permissions: [
      'Bookings - View',
      'Bookings - Cancel',
      'Bookings - Export',
      'Subscriptions - View',
      'Subscriptions - Cancel',
      'Booking History - View',
      'Booking History - Delete'
    ]
  },
  {
    category: 'Customer Information',
    permissions: [
      'Customer Profile - View',
      'Customer Profile - Send Message',
      'Customer Management - View',
      'Customer Management - Block/Unblock'
    ]
  },
  {
    category: 'Facilities',
    permissions: [
      'Facilities - Create',
      'Facilities - Update',
      'Facilities - Delete',
      'Facilities - View'
    ]
  },
  {
    category: 'Products',
    permissions: [
      'Products - Create',
      'Products - Update',
      'Products - Edit',
      'Products - Delete',
      'Products - Activate/Deactivate'
    ]
  },
  {
    category: 'Locations',
    permissions: [
      'Locations - Create',
      'Locations - Update',
      'Locations - Edit',
      'Locations - Activate/Deactivate',
      'Locations - Delete'
    ]
  },
  {
    category: 'Payments',
    permissions: [
      'Payments - View',
      'Payments - Download Invoice',
      'Payments - Export CSV',
      'Payments - Commission Setup'
    ]
  },
  {
    category: 'User Management',
    permissions: [
      'User Management - Create',
      'User Management - Edit',
      'User Management - Update',
      'User Management - Delete',
      'User Management - Block/Unblock'
    ]
  },
  {
    category: 'Reports',
    permissions: [
      'Reports - Booking Report Download',
      'Reports - Payment Report Download'
    ]
  },
  {
    category: 'General',
    permissions: [
      'Dashboard Access',
      'Company Management',
      'Activity Logs',
      'System Settings',
      'Bulk Operations',
      'Export Data',
      'Audit Trail'
    ]
  }
]

// Computed properties
const roleId = computed(() => route.params.id as string)

// Navigation functions
const getBackNavigationPath = () => {
  return `/user-management/role/${roleId.value}`
}

const getBackNavigationLabel = () => {
  return 
}

// Methods
const loadRole = () => {
  // Sample roles data (same as in UserManagementView)
  const roles: Role[] = [
    {
      id: 'ROLE-001',
      name: 'Super Admin',
      permissions: [
        'Dashboard Access',
        'User Management - Create',
        'User Management - Edit',
        'User Management - Update',
        'User Management - Delete',
        'User Management - Block/Unblock',
        'System Settings',
        'Audit Trail',
        'Reports - Booking Report Download',
        'Reports - Payment Report Download',
        'Bookings - View',
        'Bookings - Cancel',
        'Bookings - Export',
        'Subscriptions - View',
        'Subscriptions - Cancel',
        'Booking History - View',
        'Booking History - Delete',
        'Customer Profile - View',
        'Customer Profile - Send Message',
        'Customer Management - View',
        'Customer Management - Block/Unblock',
        'Facilities - Create',
        'Facilities - Update',
        'Facilities - Delete',
        'Facilities - View',
        'Products - Create',
        'Products - Update',
        'Products - Edit',
        'Products - Delete',
        'Products - Activate/Deactivate',
        'Locations - Create',
        'Locations - Update',
        'Locations - Edit',
        'Locations - Activate/Deactivate',
        'Locations - Delete',
        'Payments - View',
        'Payments - Download Invoice',
        'Payments - Export CSV',
        'Payments - Commission Setup',
        'Company Management',
        'Activity Logs',
        'Bulk Operations',
        'Export Data'
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 'ROLE-002',
      name: 'Admin',
      permissions: [
        'Dashboard Access',
        'Bookings - View',
        'Bookings - Cancel',
        'Bookings - Export',
        'Subscriptions - View',
        'Subscriptions - Cancel',
        'Booking History - View',
        'Customer Profile - View',
        'Customer Profile - Send Message',
        'Customer Management - View',
        'Customer Management - Block/Unblock',
        'Facilities - Create',
        'Facilities - Update',
        'Facilities - Delete',
        'Facilities - View',
        'Products - Create',
        'Products - Update',
        'Products - Edit',
        'Products - Delete',
        'Products - Activate/Deactivate',
        'Locations - Create',
        'Locations - Update',
        'Locations - Edit',
        'Locations - Activate/Deactivate',
        'Locations - Delete',
        'Payments - View',
        'Payments - Download Invoice',
        'Payments - Export CSV',
        'Payments - Commission Setup',
        'Reports - Booking Report Download',
        'Reports - Payment Report Download',
        'Company Management',
        'Activity Logs',
        'Bulk Operations',
        'Export Data'
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 'ROLE-003',
      name: 'Manager',
      permissions: [
        'Dashboard Access',
        'Bookings - View',
        'Bookings - Cancel',
        'Subscriptions - View',
        'Subscriptions - Cancel',
        'Booking History - View',
        'Customer Profile - View',
        'Customer Profile - Send Message',
        'Customer Management - View',
        'Customer Management - Block/Unblock',
        'Facilities - View',
        'Products - View',
        'Products - Update',
        'Locations - View',
        'Locations - Update',
        'Payments - View',
        'Payments - Download Invoice',
        'Reports - Booking Report Download',
        'Reports - Payment Report Download',
        'Activity Logs'
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 'ROLE-004',
      name: 'Operator',
      permissions: [
        'Dashboard Access',
        'Customer Profile - View',
        'Customer Management - View',
        'Facilities - View',
        'Products - View',
        'Locations - View',
        'Payments - View',
        'Activity Logs'
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'blocked'
    }
  ]

  role.value = roles.find(r => r.id === roleId.value) || null

  if (role.value) {
    // Populate form data
    formData.value = {
      name: role.value.name,
      status: role.value.status
    }
    selectedPermissions.value = [...role.value.permissions]
  }
}

const updateRole = async () => {
  if (!role.value) return

  saving.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update role data
    role.value.name = formData.value.name
    role.value.status = formData.value.status
    role.value.permissions = [...selectedPermissions.value]
    role.value.updatedAt = new Date().toISOString()

    // Show success message
    showSuccess.value = true

    // Redirect back after a short delay
    setTimeout(() => {
      router.push(`/user-management/role/${roleId.value}`)
    }, 2000)
  } catch (error) {
    console.error('Error updating role:', error)
    alert('Error updating role. Please try again.')
  } finally {
    saving.value = false
  }
}

const cancelEdit = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    router.push(`/user-management/role/${roleId.value}`)
  }
}

// Lifecycle
onMounted(() => {
  loadRole()
})
</script>
<style scoped>
input[type="checkbox"] {
  transition: all 0.2s ease;
  accent-color: #16a34a; /* Green-600 for fill color */
}</style>
