<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-gray-600">Manage admin users, roles, and permissions</p>
        </div>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New User</span>
        </button>
      </div>

      <!-- User Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiClockAlert" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Pending Approval</h3>
              <p class="text-2xl font-bold text-gray-900">{{ userStats.pendingApproval }}</p>
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
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Role Filter</label>
            <div class="relative">
              <select 
                v-model="filters.role" 
                @focus="toggleDropdown('role')"
                @blur="closeDropdown('role')"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
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
                class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending Approval</option>
                <option value="suspended">Suspended</option>
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
        </div>
        <div class="mt-4 flex justify-end">
          <button
            @click="resetFilters"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Users ({{ filteredUsers.length }})</h2>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
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
                  <div class="text-sm text-gray-900">{{ formatDate(user.lastLogin) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(user.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <button @click="viewUser(user)" class="text-primary-600 hover:text-primary-900" title="View Details">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiEye" />
                      </svg>
                    </button>
                    <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900" title="Edit User">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiPencil" />
                      </svg>
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.status === 'suspended' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'"
                      :title="user.status === 'suspended' ? 'Activate User' : 'Suspend User'"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="user.status === 'suspended' ? mdiAccountCheck : mdiAccountCancel" />
                      </svg>
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

    <!-- Add/Edit User Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ showAddModal ? 'Add New User' : 'Edit User' }}
          </h2>
          <p v-if="showAddModal" class="text-sm text-gray-600 mt-1">
            New users require dual authentication approval before activation
          </p>
        </div>
        
        <form @submit.prevent="saveUser" class="p-6 space-y-6">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  v-model="form.name"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  v-model="form.email"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  v-model="form.phone"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  v-model="form.department"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter department"
                />
              </div>
            </div>
          </div>

          <!-- Role and Permissions -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Role and Permissions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <div class="relative">
                  <select 
                    v-model="form.role" 
                    required 
                    @focus="toggleDropdown('formRole')"
                    @blur="closeDropdown('formRole')"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Select role</option>
                    <option value="super-admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="operator">Operator</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg 
                      :class="[
                        'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                        dropdownStates.formRole ? 'transform rotate-180' : ''
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div class="relative">
                  <select 
                    v-model="form.status" 
                    @focus="toggleDropdown('formStatus')"
                    @blur="closeDropdown('formStatus')"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending Approval</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg 
                      :class="[
                        'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                        dropdownStates.formStatus ? 'transform rotate-180' : ''
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
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                <label v-for="permission in availablePermissions" :key="permission" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :value="permission" 
                    v-model="form.permissions"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ permission }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Access Settings -->
          <div v-if="showAddModal">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Access Settings</h3>
            <div class="space-y-3">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="form.sendWelcomeEmail"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Send welcome email with login instructions</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="form.requirePasswordChange"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Require password change on first login</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="form.enable2FA"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Enable two-factor authentication</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {{ showAddModal ? 'Submit for Approval' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View User Modal -->
    <div v-if="showViewModal && selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">User Details</h2>
            <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- User Profile -->
          <div class="flex items-center space-x-4">
            <img class="h-16 w-16 rounded-full object-cover" :src="selectedUser.avatar" :alt="selectedUser.name">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedUser.name }}</h3>
              <p class="text-gray-600">{{ selectedUser.email }}</p>
              <span :class="getStatusClass(selectedUser.status)" class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1">
                {{ selectedUser.status }}
              </span>
            </div>
          </div>

          <!-- User Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
              <div class="space-y-2 text-sm">
                <p><span class="text-gray-500">Phone:</span> {{ selectedUser.phone || 'Not provided' }}</p>
                <p><span class="text-gray-500">Department:</span> {{ selectedUser.department || 'Not specified' }}</p>
                <p><span class="text-gray-500">Last Login:</span> {{ formatDate(selectedUser.lastLogin) }}</p>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Role & Permissions</h4>
              <div class="space-y-2">
                <div>
                  <span :class="getRoleClass(selectedUser.role)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ formatRole(selectedUser.role) }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-1">
                  <span v-for="permission in selectedUser.permissions" :key="permission" 
                        class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {{ permission }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              @click="editUser(selectedUser)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit User
            </button>
            <button
              @click="showViewModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dual Auth Approval Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiCheckCircle" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">User Submitted for Approval</h3>
          <p class="text-gray-600 mb-6">
            The new user has been submitted to the Dual Authentication system for approval. They will be notified once approved.
          </p>
          <div class="flex justify-center space-x-3">
            <router-link to="/dual-auth" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              View Dual Auth Queue
            </router-link>
            <button
              @click="showSuccessModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
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
  mdiAccountGroup, 
  mdiAccountCheck, 
  mdiClockAlert, 
  mdiShieldCheck, 
  mdiEye, 
  mdiPencil, 
  mdiAccountCancel,
  mdiCheckCircle
} from '@mdi/js'

// User interface
interface User {
  id: string
  name: string
  email: string
  phone: string | null
  department: string | null
  role: 'super-admin' | 'admin' | 'manager' | 'operator'
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  lastLogin: string | null
  permissions: string[]
  avatar: string
}

// State
const searchQuery = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showSuccessModal = ref(false)
const selectedUser = ref<User | null>(null)

// Dropdown states for rotating arrows
const dropdownStates = ref({
  role: false,
  status: false,
  formRole: false,
  formStatus: false
})

// Filters
const filters = ref({
  role: '',
  status: ''
})

// User statistics
const userStats = ref({
  totalUsers: 12,
  activeUsers: 8,
  pendingApproval: 2,
  adminUsers: 3
})

// Available permissions
const availablePermissions = [
  'Dashboard Access',
  'User Management',
  'Company Management',
  'Booking Management',
  'Customer Management',
  'Facility Management',
  'Product Management',
  'Location Management',
  'Payment Management',
  'Reports Access',
  'Activity Logs',
  'System Settings',
  'Bulk Operations',
  'Export Data',
  'Audit Trail'
]

// Form data
const form = ref({
  id: null as string | null,
  name: '',
  email: '',
  phone: '',
  department: '',
  role: '' as 'super-admin' | 'admin' | 'manager' | 'operator' | '',
  status: 'pending' as 'active' | 'inactive' | 'pending' | 'suspended',
  permissions: [] as string[],
  sendWelcomeEmail: true,
  requirePasswordChange: true,
  enable2FA: false
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
    status: 'pending',
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
    status: 'suspended',
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
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'suspended':
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
  selectedUser.value = user
  showViewModal.value = true
}

const editUser = (user: User) => {
  form.value = { 
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    department: user.department || '',
    role: user.role,
    status: user.status,
    permissions: [...user.permissions],
    sendWelcomeEmail: false,
    requirePasswordChange: false,
    enable2FA: false
  }
  showEditModal.value = true
  showViewModal.value = false
}

const toggleUserStatus = (user: User) => {
  const action = user.status === 'suspended' ? 'activate' : 'suspend'
  
  if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].status = user.status === 'suspended' ? 'active' : 'suspended'
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    status: 'pending',
    permissions: [],
    sendWelcomeEmail: true,
    requirePasswordChange: true,
    enable2FA: false
  }
}

const saveUser = () => {
  if (showAddModal.value) {
    // Add new user - send to dual auth
    const newUser: User = {
      id: `USR-${String(users.value.length + 1).padStart(3, '0')}`,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone || null,
      department: form.value.department || null,
      role: form.value.role as User['role'], // Type assertion since we validate in template
      status: 'pending', // Always pending for new users
      lastLogin: null,
      permissions: [...form.value.permissions],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
    }
    
    // In a real app, this would be sent to dual auth system
    users.value.push(newUser)
    closeModal()
    showSuccessModal.value = true
    
    // Update pending approval count
    userStats.value.pendingApproval++
  } else {
    // Edit existing user
    const index = users.value.findIndex(u => u.id === form.value.id)
    if (index !== -1 && form.value.id) {
      users.value[index] = { 
        id: form.value.id,
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone || null,
        department: form.value.department || null,
        role: form.value.role as User['role'],
        status: form.value.status,
        lastLogin: users.value[index].lastLogin,
        permissions: [...form.value.permissions],
        avatar: users.value[index].avatar
      }
    }
    closeModal()
  }
}
</script>
