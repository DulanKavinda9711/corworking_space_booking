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
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
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

                <!-- Date Range Picker -->
                <div class="relative flex-no min-w-0">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div class="relative date-input" @click="showDatePicker = !showDatePicker">
                    <input :value="dateRangeDisplay" type="text" readonly placeholder="Select date range"
                      class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer bg-white text-gray-900" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Date Picker Dropdown -->
                  <div v-if="showDatePicker" class="date-picker-container absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-gray-900">
                    <div class="flex justify-between items-center mb-4">
                      <button @click="previousMonth" class="p-1 hover:bg-gray-100 rounded transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                      </button>
                      <span class="font-medium">{{ currentMonthYear }}</span>
                      <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Calendar Grid -->
                    <div class="grid grid-cols-7 gap-1 mb-2">
                      <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="text-xs font-medium text-gray-500 text-center py-2">
                        {{ day }}
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-7 gap-1">
                      <div
                        v-for="date in calendarDates"
                        :key="date.dateString"
                        @click="selectDate(date)"
                        :class="[
                          'text-sm text-center py-2 cursor-pointer rounded',
                          !date.isCurrentMonth ? 'text-gray-300' : 'text-gray-900',
                          isDateSelected(date) ? 'bg-green-600 text-white' : '',
                          isDateInRange(date) ? 'bg-green-100' : '',
                          'hover:bg-green-50'
                        ]"
                      >
                        {{ date.date.getDate() }}
                      </div>
                    </div>

                    <div class="flex justify-end items-end mt-4 pt-4 border-t border-gray-200">
                      <div class="flex space-x-2">
                        <button
                          @click="clearDateRange"
                          class="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          @click="showDatePicker = false"
                          :disabled="!filters.startDate"
                          class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Role Filter -->
                <div class="relative flex-none w-40">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div class="relative">
                    <select v-model="filters.role" @focus="toggleDropdown('role')" @blur="closeDropdown('role')"
                      class="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900">
                      <option value="">All Roles</option>
                      <option value="super-admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="operator">Operator</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg class="h-4 w-4 text-gray-400 transform transition-transform"
                        :class="{ 'rotate-180': dropdownStates.role }" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
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
                      <option value="blocked">Blocked</option>
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ role.name }}</td>
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center" @click.stop>
                      <button @click.stop="toggleRoleStatus(role)"
                        :class="role.status === 'active' ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'">
                        {{ role.status === 'active' ? 'Block' : 'Unblock' }}
                      </button>
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
                  <div class="relative date-input" @click="showDatePicker = !showDatePicker">
                    <input :value="dateRangeDisplay" type="text" readonly placeholder="Select date range"
                      class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer bg-white text-gray-900" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Date Picker Dropdown -->
                  <div v-if="showDatePicker" class="date-picker-container absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-gray-900">
                    <div class="flex justify-between items-center mb-4">
                      <button @click="previousMonth" class="p-1 hover:bg-gray-100 rounded transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                      </button>
                      <span class="font-medium">{{ currentMonthYear }}</span>
                      <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Calendar Grid -->
                    <div class="grid grid-cols-7 gap-1 mb-2">
                      <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="text-xs font-medium text-gray-500 text-center py-2">
                        {{ day }}
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-7 gap-1">
                      <div
                        v-for="date in calendarDates"
                        :key="date.dateString"
                        @click="selectDate(date)"
                        :class="[
                          'text-sm text-center py-2 cursor-pointer rounded',
                          !date.isCurrentMonth ? 'text-gray-300' : 'text-gray-900',
                          isDateSelected(date) ? 'bg-green-600 text-white' : '',
                          isDateInRange(date) ? 'bg-green-100' : '',
                          'hover:bg-green-50'
                        ]"
                      >
                        {{ date.date.getDate() }}
                      </div>
                    </div>

                    <div class="flex justify-end items-end mt-4 pt-4 border-t border-gray-200">
                      <div class="flex space-x-2">
                        <button
                          @click="clearDateRange"
                          class="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          @click="showDatePicker = false"
                          :disabled="!filters.startDate"
                          class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Role Filter -->
                <div class="relative flex-none w-40">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div class="relative">
                    <select v-model="filters.role" @focus="toggleDropdown('role')" @blur="closeDropdown('role')"
                      class="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                      <option value="">All Roles</option>
                      <option value="super-admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="operator">Operator</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg class="h-4 w-4 text-gray-400 transform transition-transform"
                        :class="{ 'rotate-180': dropdownStates.role }" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
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
                      <option value="blocked">Blocked</option>
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
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
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
                        <button @click.stop="toggleUserStatus(user)" :disabled="toggleStatusLoading.has(user.id)"
                          :class="[
                            user.status === 'active' ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200',
                            toggleStatusLoading.has(user.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          ]"
                          class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors border flex items-center justify-center space-x-1"
                          :title="toggleStatusLoading.has(user.id) ? 'Updating...' : (user.status === 'active' ? 'Block User' : 'Unblock User')">
                          <svg v-if="toggleStatusLoading.has(user.id)" class="animate-spin h-3 w-3 text-current"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Role interface
interface Role {
  id: string
  name: string
  userLevel: 'super-admin' | 'admin'
  permissions: string[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'blocked'
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
  status: 'active' | 'blocked'
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
    status: 'blocked'
  }
])

// State
const router = useRouter()
const searchQuery = ref('')
const toggleStatusLoading = ref(new Set<string>())

// Date picker state
const showDatePicker = ref(false)
const currentDate = ref(new Date())

// Dropdown states for rotating arrows
const dropdownStates = ref({
  role: false,
  status: false
})

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
    status: 'blocked',
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

// Calendar computed properties
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startCalendar = new Date(firstDay)
  startCalendar.setDate(startCalendar.getDate() - firstDay.getDay())

  const dates = []
  const current = new Date(startCalendar)

  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(current)
    const year = currentDate.getFullYear()
    const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')
    const dateString = `${year}-${monthStr}-${day}`

    dates.push({
      date: currentDate,
      dateString: dateString,
      isCurrentMonth: currentDate.getMonth() === month
    })
    current.setDate(current.getDate() + 1)
  }

  return dates
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
    startDate: '',
    endDate: '',
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

const viewUser = (user: User) => {
  router.push(`/user-management/${user.id}`)
}

const viewRole = (role: Role) => {
  router.push(`/user-management/role/${role.id}`)
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

// Calendar methods
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDate = (date: any) => {
  if (!date.isCurrentMonth) return

  if (!filters.value.startDate || (filters.value.startDate && filters.value.endDate)) {
    // Start new selection
    filters.value.startDate = date.dateString
    filters.value.endDate = ''
  } else if (filters.value.startDate && !filters.value.endDate) {
    // Select end date
    if (date.dateString >= filters.value.startDate) {
      filters.value.endDate = date.dateString
    } else {
      // If selected date is before start date, swap them
      filters.value.endDate = filters.value.startDate
      filters.value.startDate = date.dateString
    }
  }

  // Keep calendar open for multiple selections
}

const isDateSelected = (date: any) => {
  return date.dateString === filters.value.startDate || date.dateString === filters.value.endDate
}

const isDateInRange = (date: any) => {
  if (!filters.value.startDate || !filters.value.endDate) return false
  return date.dateString > filters.value.startDate && date.dateString < filters.value.endDate
}

const isDateCurrentMonth = (date: any) => {
  return date.isCurrentMonth
}

const clearDateRange = () => {
  filters.value.startDate = ''
  filters.value.endDate = ''
  showDatePicker.value = false
}

const applyDateRange = () => {
  showDatePicker.value = false
}

// Click outside handler for date picker
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const datePickerContainer = target.closest('.date-picker-container')
  const dateInput = target.closest('.date-input')

  if (!datePickerContainer && !dateInput && showDatePicker.value) {
    showDatePicker.value = false
  }
}

// Tabs definition with counts
const tabs = computed(() => [
  {
    id: 'role-creation',
    name: 'Role Creation'
  },
  {
    id: 'user-creation',
    name: 'User Creation'
  }
])

// Function to get tab count dynamically
const getTabCount = (tabId: string) => {
  if (tabId === 'role-creation') return filteredRoles.value.length
  if (tabId === 'user-creation') return filteredUsers.value.length
  return 0
}

// Active tab
const activeTab = ref('role-creation')

// Additional methods for roles and users
const getRolePermissions = (role: string) => {
  const rolePermissions: Record<string, string[]> = {
    'super-admin': [
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
    'admin': [
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
    'manager': [
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
    'operator': [
      'Dashboard Access',
      'Customer Profile - View',
      'Customer Management - View',
      'Facilities - View',
      'Products - View',
      'Locations - View',
      'Payments - View',
      'Activity Logs'
    ]
  }
  return rolePermissions[role] || []
}

const toggleRoleStatus = (role: Role) => {
  const index = roles.value.findIndex(r => r.id === role.id)
  if (index !== -1) {
    roles.value[index].status = role.status === 'active' ? 'blocked' : 'active'
    roles.value[index].updatedAt = new Date().toISOString()
  }
}

// Lifecycle hooks
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
