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
          <div class="bg-white rounded-xl shadow-card overflow-visible border-gray-200">
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

                <!-- Date Range Picker -->
                <div class="relative flex-no min-w-0">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <AdvancedDateRangePicker
                    :dateRange="roleCreationDateRange"
                    @dateRangeChange="handleRoleCreationDateRangeChange"
                  />
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
                        <div v-for="option in roleOptions" :key="option.value" @click="selectRole(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
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
                    <select v-model="filters.status" @focus="toggleDropdown('status')" @blur="closeDropdown('status')"
                      class="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg class="h-4 w-4 text-gray-400 transform transition-transform"
                        :class="{ 'rotate-180': dropdownStates.status }" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
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
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created
                      At</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated
                      At</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
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
                        <span v-for="permission in role.permissions.slice(0, 2)" :key="permission"
                          class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {{ permission }}
                        </span>
                        <span v-if="role.permissions.length > 2"
                          class="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                          +{{ role.permissions.length - 2 }} more
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(role.createdAt) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(role.updatedAt) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(role.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ role.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                      <div class="flex items-center justify-end space-x-2">
                        <button @click.stop="toggleRoleStatus(role)"
                          :class="role.status === 'active' ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'"
                          class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors border flex items-center justify-center space-x-1"
                          :title="role.status === 'active' ? 'Make Role Inactive' : 'Make Role Active'">
                          <span>{{ role.status === 'active' ? 'Inactive' : 'Active' }}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State for Roles -->
            <div v-if="filteredRoles.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
              <p class="mt-1 text-sm text-gray-500">No roles match the current search criteria.</p>
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

                <!-- Date Range Picker -->
                <div class="relative flex-no min-w-0">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <AdvancedDateRangePicker
                    :dateRange="userCreationDateRange"
                    @dateRangeChange="handleUserCreationDateRangeChange"
                  />
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
                        <div v-for="option in roleOptions" :key="option.value" @click="selectRole(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
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
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created
                      At</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated
                      At</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 cursor-pointer"
                    @click="viewUser(user)">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img class="h-10 w-10 rounded-full object-cover" :src="user.avatar" :alt="user.name">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.name.split(' ')[0] }} {{ user.name.split(' ')[1] || '' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.username }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getRoleClass(user.role)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ formatRole(user.role) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.updatedAt) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(user.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                      <div class="flex items-center justify-end space-x-2">
                        <button @click.stop="toggleUserStatus(user)"
                          :class="user.status === 'active' ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'"
                          class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors border cursor-pointer flex items-center justify-center space-x-1"
                          :title="user.status === 'active' ? 'Make User Inactive' : 'Make User Active'">
                          <span>{{ user.status === 'active' ? 'Inactive' : 'Active' }}</span>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p class="mt-1 text-sm text-gray-500">No users match the current search and filters.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </AdminLayout>

  <!-- Status Toggle Confirmation Modal -->
  <div v-if="showStatusToggleModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusToggleModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
      <div class="mt-3">
        <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full" :class="(selectedUser?.status === 'active' || selectedRole?.status === 'active') ? 'bg-red-100' : 'bg-green-100'">
          <svg class="w-6 h-6" :class="(selectedUser?.status === 'active' || selectedRole?.status === 'active') ? 'text-red-600' : 'text-green-600'" fill="currentColor" viewBox="0 0 24 24">
            <path :d="(selectedUser?.status === 'active' || selectedRole?.status === 'active') ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' : 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 text-center mt-4">
          {{ (selectedUser?.status === 'active' || selectedRole?.status === 'active') ? 'Make Inactive' : 'Make Active' }} {{ selectedUser ? 'User' : 'Role' }}
        </h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500 text-center">
            Are you sure you want to {{ (selectedUser?.status === 'active' || selectedRole?.status === 'active') ? 'make inactive' : 'make active' }} {{ selectedUser ? selectedUser.name : selectedRole?.name }}?
          </p>
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
                  <div class="text-gray-500">{{ selectedRole.permissions.length }} permissions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center pt-4 space-x-4">
          <button
            @click="closeStatusToggleModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmStatusToggle"
            :disabled="isTogglingStatus"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            :class="(selectedUser?.status === 'active' || selectedRole?.status === 'active') ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'"
          >
            <svg v-if="isTogglingStatus" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isTogglingStatus ? 'Processing...' : ((selectedUser?.status === 'active' || selectedRole?.status === 'active') ? 'Make Inactive' : 'Make Active') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Status Success Modal -->
  <div v-if="showStatusSuccessModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusSuccessModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
      <div class="mt-3">
        <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-100">
          <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Success!</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500 text-center">{{ statusModalMessage }}</p>
        </div>
        <div class="flex items-center justify-center pt-4">
          <button
            @click="closeStatusSuccessModal"
            class="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Status Error Modal -->
  <div v-if="showStatusErrorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusErrorModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
      <div class="mt-3">
        <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100">
          <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Error</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500 text-center">{{ statusModalMessage }}</p>
        </div>
        <div class="flex items-center justify-center pt-4">
          <button
            @click="closeStatusErrorModal"
            class="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import AdvancedDateRangePicker from '@/components/ui/AdvancedDateRangePicker.vue'
import { mdiShieldAccount } from '@mdi/js'

// Role interface
interface Role {
  id: string
  name: string
  userLevel: 'super-admin' | 'admin'
  permissions: string[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive'
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

// Sample roles data
const roles = ref<Role[]>([
  {
    id: 'ROLE-001',
    name: 'Super Admin',
    userLevel: 'super-admin',
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
    userLevel: 'admin',
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
    userLevel: 'admin',
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
    userLevel: 'admin',
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
    status: 'inactive'
  }
])

// State
const router = useRouter()
const searchQuery = ref('')

// Modal state
const showStatusToggleModal = ref(false)
const isTogglingStatus = ref(false)
const showStatusSuccessModal = ref(false)
const showStatusErrorModal = ref(false)
const statusModalMessage = ref('')
const selectedUser = ref<User | null>(null)
const selectedRole = ref<Role | null>(null)

// Date range state for both tabs
const userCreationDateRange = ref({
  startDate: '',
  endDate: ''
})
const roleCreationDateRange = ref({
  startDate: '',
  endDate: ''
})

// Dropdown states for rotating arrows
const dropdownStates = ref({
  role: false,
  status: false
})

// Dropdown options
const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'super-admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'operator', label: 'Operator' }
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

// Filters
const filters = ref({
  startDate: '',
  endDate: '',
  role: '',
  status: ''
})

// Sample users data
const users = ref<User[]>([
  {
    id: 'USR-001',
    name: 'John Administrator',
    username: 'johnadmin',
    email: 'john.admin@cowork.com',
    phone: '+1 (555) 123-4567',
    department: 'IT',
    role: 'super-admin',
    status: 'active',
    lastLogin: '2024-08-15T10:30:00Z',
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
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-08-15T10:30:00Z'
  },
  {
    id: 'USR-002',
    name: 'Sarah Manager',
    username: 'sarahmanager',
    email: 'sarah.manager@cowork.com',
    phone: '+1 (555) 987-6543',
    department: 'Operations',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-08-15T08:45:00Z',
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
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c2?w=100&h=100&fit=crop&crop=faces',
    createdAt: '2024-02-10T08:45:00Z',
    updatedAt: '2024-08-15T08:45:00Z'
  },
  {
    id: 'USR-003',
    name: 'Mike Operator',
    username: 'mikeoperator',
    email: 'mike.operator@cowork.com',
    phone: '+1 (555) 456-7890',
    department: 'Customer Service',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-08-14T16:20:00Z',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    createdAt: '2024-03-05T16:20:00Z',
    updatedAt: '2024-08-14T16:20:00Z'
  },
  {
    id: 'USR-004',
    name: 'Emma Support',
    username: 'emmasupport',
    email: 'emma.support@cowork.com',
    phone: '+1 (555) 234-5678',
    department: 'Support',
    role: 'operator',
    status: 'active',
    lastLogin: null,
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
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    createdAt: '2024-04-20T12:00:00Z',
    updatedAt: '2024-08-01T12:00:00Z'
  },
  {
    id: 'USR-005',
    name: 'David Analyst',
    username: 'davidanalyst',
    email: 'david.analyst@cowork.com',
    phone: '+1 (555) 345-6789',
    department: 'Analytics',
    role: 'operator',
    status: 'inactive',
    lastLogin: '2024-08-10T12:15:00Z',
    permissions: [
      'Dashboard Access',
      'Reports - Booking Report Download',
      'Reports - Payment Report Download',
      'Activity Logs'
    ],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    createdAt: '2024-05-15T12:15:00Z',
    updatedAt: '2024-08-10T12:15:00Z'
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

  // Apply date range filter
  if (filters.value.startDate && filters.value.endDate) {
    filtered = filtered.filter(user => {
      const userDate = new Date(user.createdAt).toISOString().split('T')[0]
      return userDate >= filters.value.startDate && userDate <= filters.value.endDate
    })
  } else if (filters.value.startDate) {
    filtered = filtered.filter(user => {
      const userDate = new Date(user.createdAt).toISOString().split('T')[0]
      return userDate === filters.value.startDate
    })
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

const filteredRoles = computed(() => {
  let filtered = roles.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(role =>
      role.name.toLowerCase().includes(query) ||
      role.permissions.some(permission => permission.toLowerCase().includes(query))
    )
  }

  // Apply date range filter
  if (filters.value.startDate && filters.value.endDate) {
    filtered = filtered.filter(role => {
      const roleDate = new Date(role.createdAt).toISOString().split('T')[0]
      return roleDate >= filters.value.startDate && roleDate <= filters.value.endDate
    })
  } else if (filters.value.startDate) {
    filtered = filtered.filter(role => {
      const roleDate = new Date(role.createdAt).toISOString().split('T')[0]
      return roleDate === filters.value.startDate
    })
  }

  return filtered
})

// Computed property for date range display
const dateRangeDisplay = computed(() => {
  if (filters.value.startDate && filters.value.endDate) {
    const startParts = filters.value.startDate.split('-')
    const endParts = filters.value.endDate.split('-')
    const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]))
    const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]))
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  } else if (filters.value.startDate) {
    const startParts = filters.value.startDate.split('-')
    const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]))
    return `${startDate.toLocaleDateString()}`
  }
  return ''
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
      return 'bg-red-100 text-red-800'
    // case 'blocked':
    //   return 'bg-red-100 text-red-800'
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
    startDate: '',
    endDate: '',
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
  const option = roleOptions.find(opt => opt.value === value)
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

const toggleUserStatus = (user: User) => {
  selectedUser.value = user
  selectedRole.value = null
  showStatusToggleModal.value = true
}

// Handle date range change for user creation tab
const handleUserCreationDateRangeChange = (newDateRange: { startDate: string; endDate: string }) => {
  userCreationDateRange.value = newDateRange
  filters.value.startDate = newDateRange.startDate
  filters.value.endDate = newDateRange.endDate
}

// Handle date range change for role creation tab
const handleRoleCreationDateRangeChange = (newDateRange: { startDate: string; endDate: string }) => {
  roleCreationDateRange.value = newDateRange
  filters.value.startDate = newDateRange.startDate
  filters.value.endDate = newDateRange.endDate
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
  if (tabId === 'user-creation') return filteredUsers.value.length
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
  showStatusToggleModal.value = true
}

// Modal handler functions
const closeStatusToggleModal = () => {
  showStatusToggleModal.value = false
  selectedUser.value = null
  selectedRole.value = null
}

const closeStatusSuccessModal = () => {
  showStatusSuccessModal.value = false
  statusModalMessage.value = ''
}

const closeStatusErrorModal = () => {
  showStatusErrorModal.value = false
  statusModalMessage.value = ''
}

const confirmStatusToggle = async () => {
  if (!selectedUser.value && !selectedRole.value) return

  isTogglingStatus.value = true
  showStatusToggleModal.value = false

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (selectedUser.value) {
      const index = users.value.findIndex(u => u.id === selectedUser.value!.id)
      if (index !== -1) {
        const newStatus = users.value[index].status === 'inactive' ? 'active' : 'inactive'
        users.value[index].status = newStatus
        const action = newStatus === 'active' ? 'made active' : 'made inactive'
        statusModalMessage.value = `User ${selectedUser.value.name} has been successfully ${action}.`
      }
    } else if (selectedRole.value) {
      const index = roles.value.findIndex(r => r.id === selectedRole.value!.id)
      if (index !== -1) {
        const newStatus = roles.value[index].status === 'inactive' ? 'active' : 'inactive'
        roles.value[index].status = newStatus
        roles.value[index].updatedAt = new Date().toISOString()
        const action = newStatus === 'active' ? 'made active' : 'made inactive'
        statusModalMessage.value = `Role ${selectedRole.value.name} has been successfully ${action}.`
      }
    }

    showStatusSuccessModal.value = true
  } catch (error) {
    console.error('Error toggling status:', error)
    statusModalMessage.value = 'Failed to update status. Please try again.'
    showStatusErrorModal.value = true
  } finally {
    isTogglingStatus.value = false
    selectedUser.value = null
    selectedRole.value = null
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
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
