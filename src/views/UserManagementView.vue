<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header with User Count and Add Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiAccountSettings" />
            </svg>
            <span class="text-sm font-medium text-green-700">
              Total Users:
              <span class="font-bold text-green-800">{{ filteredUsers.length }}</span>
            </span>
          </div>
        </div>

        <button
          @click="$router.push('/user-management/add')"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New User</span>
        </button>
      </div>

      <!-- User Statistics -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiAccountGroup" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Total Users</h3>
              <p class="text-2xl font-bold text-gray-900">{{ userStats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiAccountCheck" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Active Users</h3>
              <p class="text-2xl font-bold text-gray-900">{{ userStats.activeUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiAccountCancel" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Blocked Users</h3>
              <p class="text-2xl font-bold text-gray-900">{{ userStats.blockedUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiShieldCheck" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Admins</h3>
              <p class="text-2xl font-bold text-gray-900">{{ userStats.adminUsers }}</p>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Filters -->
      

      <!-- Users Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="bg-white border b shadow-card p-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                v-model="searchQuery"
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 ">Role Filter</label>
            <div class="relative">
              <select 
                v-model="filters.role" 
                @focus="toggleDropdown('role')"
                @blur="closeDropdown('role')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer text-gray-900"
              >
                <option value="">All Roles</option>
                <option value="super-admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="operator">Operator</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.role ? 'transform rotate-180' : ''
                  ]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <div class="relative">
              <select 
                v-model="filters.status" 
                @focus="toggleDropdown('status')"
                @blur="closeDropdown('status')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer text-gray-900"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.status ? 'transform rotate-180' : ''
                  ]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div class="md:col-span-2 flex items-end justify-end">
            <button
              @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 cursor-pointer" @click="viewUser(user)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full object-cover" :src="user.avatar" :alt="user.name">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleClass(user.role)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ formatRole(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="permission in user.permissions.slice(0, 2)" :key="permission" 
                          class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {{ permission }}
                    </span>
                    <span v-if="user.permissions.length > 2" 
                          class="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                      +{{ user.permissions.length - 2 }} more
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(user.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                  <div class="flex items-center justify-end space-x-2">
                  <button @click.stop="editUser(user)"
                    class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center space-x-1"
                    title="Edit User">
                    <span>Edit</span>
                  </button>
                  <button @click.stop="toggleUserStatus(user)"
                    :disabled="toggleStatusLoading.has(user.id)"
                    :class="[
                    user.status === 'active' ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200',
                    toggleStatusLoading.has(user.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    ]"
                    class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors border flex items-center justify-center space-x-1"
                    :title="toggleStatusLoading.has(user.id) ? 'Updating...' : (user.status === 'active' ? 'Block User' : 'Unblock User')">
                    <svg v-if="toggleStatusLoading.has(user.id)" class="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span v-else>{{ user.status === 'active' ? 'Block' : 'Unblock' }}</span>
                  </button>
                  <button @click.stop="confirmDeleteUser(user)"
                    class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 flex items-center justify-center space-x-1"
                    title="Delete User">
                    <span>Delete</span>
                  </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredUsers.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p class="mt-1 text-sm text-gray-500">No users match the current search and filters.</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  mdiAccountGroup, 
  mdiAccountCheck, 
  mdiClockAlert, 
  mdiShieldCheck, 
  mdiEye, 
  mdiPencil, 
  mdiAccountCancel,
  mdiCheckCircle,
  mdiAccountSettings
} from '@mdi/js'

// User interface
interface User {
  id: string
  name: string
  email: string
  phone: string | null
  department: string | null
  role: 'super-admin' | 'admin' | 'manager' | 'operator'
  status: 'active' | 'blocked'
  lastLogin: string | null
  permissions: string[]
  avatar: string
}

// State
const router = useRouter()
const searchQuery = ref('')
const showEditModal = ref(false)
const showSuccessModal = ref(false)
const toggleStatusLoading = ref(new Set<string>())

// Dropdown states for rotating arrows
const dropdownStates = ref({
  role: false,
  status: false
})

// Filters
const filters = ref({
  role: '',
  status: ''
})

// User statistics
const userStats = ref({
  totalUsers: 12,
  activeUsers: 9,
  adminUsers: 3,
  blockedUsers: 1
})

// Sample users data
const users = ref<User[]>([
  {
    id: 'USR-001',
    name: 'John Administrator',
    email: 'john.admin@cowork.com',
    phone: '+1 (555) 123-4567',
    department: 'IT',
    role: 'super-admin',
    status: 'active',
    lastLogin: '2024-08-15T10:30:00Z',
    permissions: ['Dashboard Access', 'User Management', 'System Settings', 'Audit Trail', 'Reports Access'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'USR-002',
    name: 'Sarah Manager',
    email: 'sarah.manager@cowork.com',
    phone: '+1 (555) 987-6543',
    department: 'Operations',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-08-15T08:45:00Z',
    permissions: ['Dashboard Access', 'Company Management', 'Booking Management', 'Reports Access'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c2?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'USR-003',
    name: 'Mike Operator',
    email: 'mike.operator@cowork.com',
    phone: '+1 (555) 456-7890',
    department: 'Customer Service',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-08-14T16:20:00Z',
    permissions: ['Dashboard Access', 'Customer Management', 'Booking Management'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'USR-004',
    name: 'Emma Support',
    email: 'emma.support@cowork.com',
    phone: '+1 (555) 234-5678',
    department: 'Support',
    role: 'operator',
    status: 'active',
    lastLogin: null,
    permissions: ['Dashboard Access', 'Customer Management'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'USR-005',
    name: 'David Analyst',
    email: 'david.analyst@cowork.com',
    phone: '+1 (555) 345-6789',
    department: 'Analytics',
    role: 'operator',
    status: 'blocked',
    lastLogin: '2024-08-10T12:15:00Z',
    permissions: ['Dashboard Access', 'Reports Access'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
  }
])

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.department?.toLowerCase().includes(query)
    )
  }

  // Apply role filter
  if (filters.value.role) {
    filtered = filtered.filter(user => user.role === filters.value.role)
  }

  // Apply status filter
  if (filters.value.status) {
    filtered = filtered.filter(user => user.status === filters.value.status)
  }

  return filtered
})

// Methods
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

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'blocked':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatRole = (role: string) => {
  const roleMap: Record<string, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Admin',
    'manager': 'Manager',
    'operator': 'Operator'
  }
  return roleMap[role] || role
}

const formatDate = (dateString: string | null) => {
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

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    role: '',
    status: ''
  }
}

// Dropdown control functions
const toggleDropdown = (dropdown: string) => {
  dropdownStates.value[dropdown as keyof typeof dropdownStates.value] = true
}

const closeDropdown = (dropdown: string) => {
  setTimeout(() => {
    dropdownStates.value[dropdown as keyof typeof dropdownStates.value] = false
  }, 150)
}

const closeAllDropdowns = () => {
  Object.keys(dropdownStates.value).forEach(key => {
    dropdownStates.value[key as keyof typeof dropdownStates.value] = false
  })
}

const viewUser = (user: User) => {
  router.push(`/user-management/${user.id}`)
}

const editUser = (user: User) => {
  router.push(`/user-management/${user.id}/edit`)
}

const toggleUserStatus = (user: User) => {
  const action = user.status === 'blocked' ? 'unblock' : 'block'
  
  if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
    toggleStatusLoading.value.add(user.id)
    
    // Simulate async operation
    setTimeout(() => {
      const index = users.value.findIndex(u => u.id === user.id)
      if (index !== -1) {
        users.value[index].status = user.status === 'blocked' ? 'active' : 'blocked'
      }
      toggleStatusLoading.value.delete(user.id)
    }, 1000)
  }
}

const confirmDeleteUser = (user: User) => {
  if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }
}
</script>
