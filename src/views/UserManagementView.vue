<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header with User Count and Add Button -->
      <div class="flex items-center justify-between">


      </div>

      <!-- Tab Section -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <nav class="flex space-x-8">
            <button v-for="tab in tabs" :key="tab.id" @click="setActiveTab(tab.id)" :class="[
              activeTab === tab.id
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]">
              {{ tab.name }}
              <span :class="[
                activeTab === tab.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]">
                {{ getTabCount(tab.id) }}
              </span>
            </button>
          </nav>
          <div class="flex items-center space-x-2">
            <button v-if="activeTab === 'role-creation'" @click="router.push('/user-management/add-role')"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New Role</span>
            </button>
            <button v-if="activeTab === 'user-creation'" @click="router.push('/user-management/add')"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New User</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Section -->


      <div>
        <!-- Role Creation Tab -->
        <div v-if="activeTab === 'role-creation'" class="space-y-6">
          <!-- Roles Table -->
          <div class="bg-white rounded-xl shadow-card overflow-hidden border-gray-200">
            <div class="bg-white border b shadow-card p-6">
              <div class="flex gap-4 items-end">
                <!-- Search Field -->
                <div class="relative flex-no min-w-0">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Search Roles</label>
                  <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Search by name, permissions..."
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900" />
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Role Filter -->
                <div class="relative flex-none w-40">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div class="relative">
                    <div @click="toggleDropdown('role')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
                      <span class="text-gray-900">{{ getRoleLabel(filters.role) }}</span>
                    </div>

                    <!-- Dropdown Options -->
                    <div v-if="dropdownStates.role" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div class="p-2">
                        <div v-if="isLoadingRoles" class="p-2 text-center text-sm text-gray-500">
                          <svg class="animate-spin h-4 w-4 mx-auto mb-1" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading roles...
                        </div>
                        <div v-for="option in roleOptions" :key="option.value" v-else @click="selectRole(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                          {{ option.label }}
                        </div>
                      </div>
                    </div>

                    <!-- Dropdown Arrow -->
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg :class="[
                        'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                        dropdownStates.role ? 'transform rotate-180' : ''
                      ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Status Filter -->
                <div class="relative flex-none w-40">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div class="relative">
                    <div @click="toggleDropdown('status')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
                      <span class="text-gray-900">{{ getStatusLabel(filters.status) }}</span>
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

                <!-- Reset Button -->
                <div class="flex items-end ml-auto">
                  <button @click="resetFilters"
                    class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600">
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto h-[410px]">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                    </th>
                  </tr>
                </thead>
                <tbody v-if="filteredRoles.length > 0" class="bg-white divide-y divide-gray-200">
                  <tr v-for="role in filteredRoles" :key="role.id" class="hover:bg-gray-50 cursor-pointer" @click="viewRole(role)">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path :d="mdiShieldAccount" />
                            </svg>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ role.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-wrap gap-1">
                        <span v-for="permission in role.permission_details.slice(0, 2)" :key="permission.id"
                          class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {{ permission.code_name }}
                        </span>
                        <span v-if="role.permission_details.length > 2"
                          class="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                          +{{ role.permission_details.length - 2 }} more
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(role.is_active ? 'active' : 'inactive')" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ role.is_active ? 'active' : 'inactive' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                      <div class="flex items-center justify-end space-x-2">
                        <button @click.stop="toggleRoleStatus(role)"
                          :class="[
                            role.is_active ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'
                          ]"
                          class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors border flex items-center justify-center space-x-1"
                          :title="role.is_active ? 'Make Role Inactive' : 'Make Role Active'">
                          <span>{{ role.is_active ? 'Inactive' : 'Active' }}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <!-- Loading State Row -->
                <tbody v-if="isLoadingRoles" class="bg-white">
                  <tr>
                    <td colspan="4" class="px-6 py-12 text-center">
                      <div class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-gray-500">Loading roles...</span>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <!-- Empty State Row -->
                <tbody v-if="!isLoadingRoles && filteredRoles.length === 0" class="bg-white">
                  <tr>
                    <td colspan="4" class="px-6 py-12 text-center">
                      <div>
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
                        <p class="mt-1 text-sm text-gray-500">No roles match the current search criteria.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- User Creation Tab -->
        <div v-if="activeTab === 'user-creation'" class="space-y-6">
          <!-- Filters Section -->
          <div class="bg-white rounded-xl shadow-card overflow-hidden border-gray-200">
            <div class="bg-white border b shadow-card p-6 overflow-visible">
              <div class="flex gap-4 items-end">
                <!-- Search Field -->
                <div class="relative flex-no min-w-0">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
                  <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Search by name, email, username..."
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900" />
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Role Filter -->
                <div class="relative flex-none w-40 overflow-visible">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div class="relative">
                    <div @click="toggleDropdown('role')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
                      <span class="text-gray-900">{{ getRoleLabel(filters.role) }}</span>
                    </div>

                    <!-- Dropdown Options -->
                    <div v-if="dropdownStates.role" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div class="p-2">
                        <div v-if="isLoadingRoles" class="p-2 text-center text-sm text-gray-500">
                          <svg class="animate-spin h-4 w-4 mx-auto mb-1" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading roles...
                        </div>
                        <div v-for="option in roleOptions" :key="option.value" v-else @click="selectRole(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                          {{ option.label }}
                        </div>
                      </div>
                    </div>

                    <!-- Dropdown Arrow -->
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg :class="[
                        'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                        dropdownStates.role ? 'transform rotate-180' : ''
                      ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Status Filter -->
                <div class="relative flex-none w-40">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div class="relative">
                    <div @click="toggleDropdown('status')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
                      <span class="text-gray-900">{{ getStatusLabel(filters.status) }}</span>
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

                <!-- Reset Button -->
                <div class="flex items-end ml-auto">
                  <button @click="resetFilters"
                    class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600">
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            <!-- Users Table -->
            <div class="overflow-x-auto h-[410px]">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                    </th>
                  </tr>
                </thead>
                <tbody v-if="filteredAdmins.length > 0" class="bg-white divide-y divide-gray-200">
                  <tr v-for="admin in filteredAdmins" :key="admin.id" class="hover:bg-gray-50 cursor-pointer" @click="viewAdmin(admin)">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ admin.full_name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ admin.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ admin.username }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getRoleClass(admin.role_name.toLowerCase().replace(' ', '-'))" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ admin.role_name }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(admin.is_active ? 'active' : 'inactive')" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ admin.is_active ? 'active' : 'inactive' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                      <div class="flex items-center justify-end space-x-2">
                        <button @click.stop="toggleAdminStatus(admin)"
                          :class="[
                            admin.is_active ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'
                          ]"
                          class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors border flex items-center justify-center space-x-1"
                          :title="admin.is_active ? 'Make Admin Inactive' : 'Make Admin Active'">
                          <span>{{ admin.is_active ? 'Inactive' : 'Active' }}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <!-- Loading State Row -->
                <tbody v-if="isLoadingAdmins" class="bg-white">
                  <tr>
                    <td colspan="6" class="px-6 py-12 text-center">
                      <div class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-gray-500">Loading admins...</span>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <!-- Empty State Row -->
                <tbody v-if="!isLoadingAdmins && filteredAdmins.length === 0" class="bg-white">
                  <tr>
                    <td colspan="6" class="px-6 py-12 text-center">
                      <div>
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No admins found</h3>
                        <p class="mt-1 text-sm text-gray-500">No admins match the current search and filters.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

    </div>
  </AdminLayout>

  <!-- Status Toggle Confirmation Modal -->
  <div v-if="showStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
      <div class="mt-3">
        <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full" :class="(selectedUser?.status === 'active' || selectedRole?.is_active || selectedAdmin?.is_active) ? 'bg-amber-100' : 'bg-green-100'">
          <svg class="w-6 h-6" :class="(selectedUser?.status === 'active' || selectedRole?.is_active || selectedAdmin?.is_active) ? 'text-amber-600' : 'text-green-600'" fill="currentColor" viewBox="0 0 24 24">
            <path :d="(selectedUser?.status === 'active' || selectedRole?.is_active || selectedAdmin?.is_active) ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' : 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 text-center mt-4">
          {{ (selectedUser?.status === 'active' || selectedRole?.is_active || selectedAdmin?.is_active) ? 'Make Inactive' : 'Make Active' }} {{ selectedUser ? 'User' : selectedRole ? 'Role' : 'Admin' }}
        </h3>
        <div class="mt-2 px-7 py-3">
          <div v-if="selectedUser" class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="text-sm space-y-1">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900">{{ selectedUser.name }}</div>
                  <div class="text-gray-500">{{ selectedUser.email }}</div>
                  <div class="text-gray-500">{{ selectedUser.username }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedRole" class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="text-sm space-y-1">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900">{{ selectedRole.name }}</div>
                  <div class="text-gray-500">{{ (selectedRole.permissions?.length || selectedRole.permission_details.length) }} permissions</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedAdmin" class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="text-sm space-y-1">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900">{{ selectedAdmin.full_name }}</div>
                  <div class="text-gray-500">{{ selectedAdmin.email }}</div>
                  <div class="text-gray-500">{{ selectedAdmin.username }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="my-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-700 text-center">
              Are you sure you want to <strong>{{ (selectedUser?.status === 'active' || selectedRole?.is_active || selectedAdmin?.is_active) ? 'make this ' + (selectedUser ? 'user' : selectedRole ? 'role' : 'admin') + ' inactive' : 'make this ' + (selectedUser ? 'user' : selectedRole ? 'role' : 'admin') + ' active' }}</strong>?
            </p>
          </div>
        </div>
        <div class="flex items-center justify-center pt-4 space-x-4">
          <button
            @click="closeStatusModal"
            class="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
              @click="confirmToggleCustomerStatus"
              :disabled="isProcessing"
              class="px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              :class="customerToToggle?.status === 'active' ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100' : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'"
            >
              <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isProcessing ? 'Processing...' : (customerToToggle?.status === 'active' ? 'Inactive' : 'Active') }}</span>
            </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Status Success Modal -->
  <SuccessModal
    v-model="showStatusSuccessModal"
    :message="statusModalMessage"
    @close="closeStatusSuccessModal"
  />

  <!-- Status Error Modal -->
  <ErrorModal
    v-model="showStatusErrorModal"
    :message="statusModalMessage"
    @close="closeStatusErrorModal"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SuccessModal from '@/components/ui/SuccessModal.vue'
import ErrorModal from '@/components/ui/ErrorModal.vue'
import { mdiShieldAccount } from '@mdi/js'
import { permissionApi, authApi } from '@/services/api'

// Role interface
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
  // Computed properties for compatibility
  status?: 'active' | 'inactive'
  permissions?: string[]
  createdAt?: string
  updatedAt?: string
}

// User interface
interface User {
  id: string
  name: string
  username: string
  email: string
  phone: string | null
  department: string | null
  role: 'super-admin' | 'admin' | 'manager' | 'operator'
  status: 'active' | 'inactive'
  lastLogin: string | null
  permissions: string[]
  avatar: string
  createdAt: string
  updatedAt: string
}

// Admin interface
interface Admin {
  id: number
  full_name: string
  email: string
  username: string
  role_name: string
  created_at: string
  updated_at: string
  is_active: boolean
}

// Sample roles data
const roles = ref<Role[]>([])

// State
const router = useRouter()
const searchQuery = ref('')

// Loading states
const isLoadingRoles = ref(false)
const isLoadingUsers = ref(false)
const isLoadingAdmins = ref(false)
const loadingError = ref<string | null>(null)

// Modal state
const showStatusModal = ref(false)
const customerToToggle = ref<any>(null)
const isProcessing = ref(false)
const showStatusSuccessModal = ref(false)
const showStatusErrorModal = ref(false)
const statusModalMessage = ref('')
const selectedUser = ref<User | null>(null)
const selectedRole = ref<Role | null>(null)
const selectedAdmin = ref<Admin | null>(null)

// Dropdown states for rotating arrows
const dropdownStates = ref({
  role: false,
  status: false
})

// Dropdown options
const roleOptions = computed(() => {
  const options = [{ value: '', label: 'All Roles' }]
  if (roles.value.length > 0) {
    roles.value.forEach(role => {
      options.push({
        value: role.id.toString(),
        label: role.name
      })
    })
  } else {
    // Fallback options while loading
    const roleOptions = computed(() => {
      const options = [{ value: '', label: 'All Roles' }]
      if (roles.value.length > 0) {
        roles.value.forEach(role => {
          options.push({
            value: role.id.toString(),
            label: role.name
          })
        })
      } else {
        // Fallback options while loading
      }
      return options
    })
  }
  return options
})

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

// Filters
const filters = ref({
  role: '',
  status: ''
})

// Sample users data
const users = ref<User[]>([])

// Sample admins data
const admins = ref<Admin[]>([])

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

const filteredAdmins = computed(() => {
  let filtered = admins.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(admin =>
      admin.full_name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.username.toLowerCase().includes(query) ||
      admin.role_name.toLowerCase().includes(query)
    )
  }

  return filtered
})

const filteredRoles = computed(() => {
  let filtered = roles.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(role =>
      role.name.toLowerCase().includes(query) ||
      (role.permissions && role.permissions.some((permission: string) => permission.toLowerCase().includes(query))) ||
      role.permission_details.some(permission => permission.code_name.toLowerCase().includes(query))
    )
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

// Data fetching functions
const fetchRoles = async () => {
  try {
    isLoadingRoles.value = true
    loadingError.value = null

    const response = await permissionApi.getAllRoles()
    
    if (response.success && response.data) {
      roles.value = response.data
    } else {
      console.error('Failed to fetch roles:', response.message)
      loadingError.value = response.message || 'Failed to load roles'
      roles.value = []
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
    loadingError.value = 'Failed to load roles'
    roles.value = []
  } finally {
    isLoadingRoles.value = false
  }
}

const fetchUsers = async () => {
  try {
    isLoadingUsers.value = true
    loadingError.value = null

    // TODO: Replace with actual API call
    // const response = await fetch('/api/users')
    // const data = await response.json()
    // users.value = data

    // For now, keep empty array
    users.value = []
  } catch (error) {
    console.error('Error fetching users:', error)
    loadingError.value = 'Failed to load users'
  } finally {
    isLoadingUsers.value = false
  }
}

const fetchAdmins = async () => {
  try {
    isLoadingAdmins.value = true
    loadingError.value = null

    const response = await authApi.getAllAdmins()

    if (response.success && response.data) {
      admins.value = response.data
    } else {
      console.error('Failed to fetch admins:', response.message)
      loadingError.value = response.message || 'Failed to load admins'
      admins.value = []
    }
  } catch (error) {
    console.error('Error fetching admins:', error)
    loadingError.value = 'Failed to load admins'
    admins.value = []
  } finally {
    isLoadingAdmins.value = false
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    // case 'blocked':
    //   return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
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
const toggleDropdown = (dropdownName: string) => {
  // Close all dropdowns first
  closeAllDropdowns()
  // Then open the clicked dropdown
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = true
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

// Dropdown label functions
const getRoleLabel = (value: string) => {
  const option = roleOptions.value.find((opt: { value: string; label: string }) => opt.value === value)
  return option ? option.label : 'All Roles'
}

const getStatusLabel = (value: string) => {
  const option = statusOptions.find(opt => opt.value === value)
  return option ? option.label : 'All Status'
}

// Dropdown select functions
const selectRole = (value: string) => {
  filters.value.role = value
  closeAllDropdowns()
}

const selectStatus = (value: string) => {
  filters.value.status = value
  closeAllDropdowns()
}

const viewUser = (user: User) => {
  router.push(`/user-management/${user.id}`)
}

const viewRole = (role: Role) => {
  router.push(`/user-management/role/${role.id}`)
}

const viewAdmin = (admin: Admin) => {
  router.push(`/user-management/admin/${admin.id}`)
}


const toggleAdminStatus = (admin: Admin) => {
  selectedUser.value = null
  selectedRole.value = null
  selectedAdmin.value = admin
  customerToToggle.value = { ...admin, status: admin.is_active ? 'active' : 'inactive' }
  showStatusModal.value = true
}

// Tabs definition with counts
const tabs = computed(() => [
  {
    id: 'user-creation',
    name: 'User Creation'
  },
  {
    id: 'role-creation',
    name: 'Role Creation'
  }
])

// Function to get tab count dynamically
const getTabCount = (tabId: string) => {
  if (tabId === 'role-creation') return filteredRoles.value.length
  if (tabId === 'user-creation') return filteredAdmins.value.length
  return 0
}

// Active tab
const activeTab = ref('user-creation')

// Initialize active tab from URL query parameter
const initializeActiveTab = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const tabParam = urlParams.get('tab')
  if (tabParam && (tabParam === 'role-creation' || tabParam === 'user-creation')) {
    activeTab.value = tabParam
  }
}

// Update URL when tab changes
const updateTabUrl = (tabId: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set('tab', tabId)
  window.history.replaceState({}, '', url.toString())
}

// Set active tab and update URL
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  updateTabUrl(tabId)
}

// Additional methods for roles and users

const toggleRoleStatus = (role: Role) => {
  selectedRole.value = role
  selectedUser.value = null
  selectedAdmin.value = null
  customerToToggle.value = { ...role, status: role.is_active ? 'active' : 'inactive' }
  showStatusModal.value = true
}

// Modal handler functions
const closeStatusModal = () => {
  showStatusModal.value = false
  selectedUser.value = null
  selectedRole.value = null
  selectedAdmin.value = null
  customerToToggle.value = null
}

const closeStatusSuccessModal = () => {
  showStatusSuccessModal.value = false
  statusModalMessage.value = ''
}

const closeStatusErrorModal = () => {
  showStatusErrorModal.value = false
  statusModalMessage.value = ''
}

const confirmToggleCustomerStatus = async () => {
  if (!customerToToggle.value) return
  
  isProcessing.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (customerToToggle.value.full_name) { // admin
      const response = await authApi.setAdminActiveStatus(customerToToggle.value.id, !customerToToggle.value.is_active)
      if (response.success) {
        const index = admins.value.findIndex(a => a.id === customerToToggle.value.id)
        if (index !== -1) {
          const newStatus = !admins.value[index].is_active
          admins.value[index].is_active = newStatus
          admins.value[index].updated_at = new Date().toISOString()
          const action = newStatus ? 'activated' : 'made inactive'
          const message = `Admin ${customerToToggle.value.full_name} has been ${action} successfully.`
          statusModalMessage.value = message
        }
        showStatusSuccessModal.value = true
      } else {
        statusModalMessage.value = 'Failed to update status. Please try again.'
        showStatusErrorModal.value = true
      }
    } else if (customerToToggle.value.permissions) { // role
      const index = roles.value.findIndex(r => r.id === customerToToggle.value.id)
      if (index !== -1) {
        const newStatus = roles.value[index].is_active ? 'inactive' : 'active'
        roles.value[index].is_active = newStatus === 'active'
        roles.value[index].updatedAt = new Date().toISOString()
        const action = newStatus === 'active' ? 'activated' : 'made inactive'
        const message = `Role ${customerToToggle.value.name} has been ${action} successfully.`
        statusModalMessage.value = message
      }
      showStatusSuccessModal.value = true
    } else { // user
      const index = users.value.findIndex(u => u.id === customerToToggle.value.id)
      if (index !== -1) {
        const newStatus = users.value[index].status === 'inactive' ? 'active' : 'inactive'
        users.value[index].status = newStatus
        const action = newStatus === 'active' ? 'activated' : 'made inactive'
        const message = `User ${customerToToggle.value.name} has been ${action} successfully.`
        statusModalMessage.value = message
      }
      showStatusSuccessModal.value = true
    }
    
    closeStatusModal()
  } catch (error) {
    console.error('Error toggling status:', error)
    statusModalMessage.value = 'An error occurred while updating status. Please try again.'
    showStatusErrorModal.value = true
  } finally {
    isProcessing.value = false
    customerToToggle.value = null
  }
}

// Lifecycle hooks
import { onMounted, onUnmounted } from 'vue'

// Handle click outside for dropdowns
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    closeAllDropdowns()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  initializeActiveTab()

  // Fetch data from APIs
  fetchRoles()
  fetchAdmins()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
