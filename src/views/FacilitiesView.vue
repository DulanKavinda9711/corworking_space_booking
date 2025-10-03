<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiWifi" />
          </svg>
          <span class="text-sm font-medium text-green-700">
            Total Facilities:
            <span class="font-bold text-green-800">{{ filteredFacilities.length }}</span>
          </span>
        </div>
        <div class="flex items-center space-x-3">
          <!-- View Toggle Button -->
          <button @click="toggleViewMode" 
            class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            :title="viewMode === 'tile' ? 'Switch to Table View' : 'Switch to Tile View'">
            <svg v-if="viewMode === 'tile'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
          <PermissionGuard permission="create_facilities">
            <router-link to="/facilities/add"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Facility</span>
            </router-link>
          </PermissionGuard>
        </div>
      </div>

      <!-- Facilities Content -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <!-- Search and Filters -->
        <div class="bg-white  p-5 ">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <div class="md:mr-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Facilities</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search by name..." v-model="searchQuery"
                class="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:ring-1 focus:z-10 sm:text-md text-gray-900 w-96" />
            </div>
          </div>
          <div class="md:ml-8">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative">
              <div @click="toggleDropdown('status')"
                :class="['w-[150px] rounded-lg px-3 py-2 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center justify-between', dropdownStates.status ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                <span class="text-gray-900">{{ getStatusLabel(filters.status) }}</span>
                <svg :class="[
                  'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                  dropdownStates.status ? 'transform rotate-180' : ''
                ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!-- Dropdown Options -->
              <div v-if="dropdownStates.status" class="absolute z-10 mt-1 w-[150px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div class="p-2">
                  <div v-for="option in statusOptions" :key="option.value" @click="selectStatus(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                    {{ option.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-end justify-end">
            <button
              @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600"
            >
              Reset Filters
            </button>
          </div>

        </div>
        </div>

        <!-- Table View -->
        <div v-if="viewMode === 'table'">
          <div class="overflow-x-auto h-[410px]">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody v-if="filteredFacilities.length > 0" class="bg-white divide-y divide-gray-200">
                <tr v-for="facility in paginatedFacilities" :key="facility.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path :d="getFacilityIcon(facility)" />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ facility.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(facility.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ facility.status }}
                    </span>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm font-medium w-48" @click.stop>
                    <div class="flex items-center justify-end space-x-2">
                      <!-- Edit Button - Hidden if no edit permission -->
                      <PermissionGuard permission="edit_facilities">
                        <button @click.stop="$router.push(`/facilities/${facility.id}/edit`)"
                          class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center space-x-1"
                          title="Edit Facility">
                          <span>Edit</span>
                        </button>
                      </PermissionGuard>
                      
                      <!-- Toggle Status Button - Hidden if no edit permission -->
                      <PermissionGuard permission="edit_facilities">
                        <button @click.stop="toggleFacilityStatus(facility)"
                          :class="facility.status === 'active' ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100' : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'"
                          class="w-20 px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center justify-center"
                          :title="facility.status === 'active' ? 'Make Facility Inactive' : 'Activate Facility'">
                          <span>{{ facility.status === 'active' ? 'Inactive' : 'Activate' }}</span>
                        </button>
                      </PermissionGuard>
                      
                      <!-- Show message if no actions available -->
                      <div v-if="!hasAnyFacilityPermissions" class="text-sm text-gray-500 italic">
                        No actions available
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>

              <!-- Empty State Row -->
              <tbody v-if="filteredFacilities.length === 0" class="bg-white">
                <tr>
                  <td colspan="3" class="px-6 py-12 text-center">
                    <div>
                      <svg class="mx-auto h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiWifi" />
                      </svg>
                      <h3 class="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
                      <p class="mt-1 text-sm text-gray-500">
                        {{ facilities.length === 0 ? 'Get started by creating a new facility.' : 'No facilities match the current filters.' }}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tile View -->
        <div v-else class="p-6">
          <!-- Facilities Grid -->
          <div v-if="filteredFacilities.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="facility in paginatedFacilities" :key="facility.id"
              class="group relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <!-- Gradient overlay on hover -->
              <div class="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <!-- Card content -->
              <div class="relative p-6">
                <!-- Header with icon and status -->
                <div class="flex items-start justify-between mb-5">
                  <div class="flex items-center space-x-4">
                    <!-- Modern icon container -->
                    <div class="relative">
                      <div class="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                        <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="getFacilityIcon(facility)" />
                        </svg>
                      </div>
                      <!-- Subtle glow effect -->
                      <div class="absolute inset-0 bg-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>

                    <div class="flex-1 min-w-0">
                      <h3 class="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 truncate">
                        {{ facility.name }}
                      </h3>
                      <!-- <div class="flex items-center mt-2 space-x-2">
                        <span :class="getStatusClass(facility.status)"
                          class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
                          {{ facility.status }}
                        </span>
                      </div> -->
                    </div>
                  </div>
                </div>

                <!-- Action buttons with modern styling -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div class="flex items-center space-x-1">
                    <!-- Edit Button - Hidden if no edit permission -->
                    <PermissionGuard permission="edit_facilities">
                      <router-link :to="`/facilities/${facility.id}/edit`"
                        class="group/btn flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                        title="Edit Facility">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="mdiPencil" />
                        </svg>
                      </router-link>
                    </PermissionGuard>
                    
                    <!-- Show message if no actions available -->
                    <div v-if="!hasAnyFacilityPermissions" class="text-xs text-gray-500 italic ml-2">
                      No actions available
                    </div>
                  </div>

                  <!-- Modern indicator -->
                  <div class="flex items-center space-x-1">
                    <div :class="[
                      'w-2 h-2 rounded-full',
                      facility.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                    ]"></div>
                    <span :class="[
                      'text-xs font-medium',
                      facility.status === 'active' ? 'text-gray-500' : 'text-red-500'
                    ]">
                      {{ facility.status === 'active' ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Subtle bottom accent -->
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </div>

          <!-- Empty State for Tile View -->
          <div v-else-if="filteredFacilities.length === 0" class="text-center py-12">
            <div>
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiWifi" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ facilities.length === 0 ? 'Get started by creating a new facility.' : 'No facilities match the current filters.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Pagination (only show if there are facilities) -->
        <!-- <div v-if="filteredFacilities.length > 0 && !isLoading" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing {{ startItem }} to {{ endItem }} of {{ filteredFacilities.length }} results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button @click="previousPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                    page === currentPage
                      ? 'z-10 bg-green-50 border-green-500 text-green-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]">
                    {{ page }}
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div> -->
        
        <div class="overflow-x-auto"></div>


      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeDeleteModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Delete Facility</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to delete this facility permanently? This action cannot be undone.
            </p>
            <div v-if="facilityToDelete" class="mt-4 p-3 bg-gray-100 rounded-lg text-gray-900">
              <div class="text-sm space-y-1">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="getFacilityIcon(facilityToDelete)" />
                    </svg>
                  </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ facilityToDelete.name }}</div>
                      <div class="text-gray-500">Status: {{ facilityToDelete.status }}</div>
                    </div>
                  </div>
              </div>
            </div>
            <div class="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-xs text-red-700">
                <strong>Warning:</strong> This will permanently remove the facility from the system and affect any products that use it.
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 bg-gray-500 text-gray-100 text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteFacility"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isDeleting ? 'Deleting...' : 'Delete Facility' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeSuccessModal">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6 text-center">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-100 mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
          <p class="text-gray-600 mb-6">{{ modalMessage || 'Facility status updated successfully!' }}</p>
          <button
            @click="closeSuccessModal"
            type="button"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6 text-center">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100 mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p class="text-gray-600 mb-6">{{ modalMessage || 'An error occurred while deleting the facility.' }}</p>
          <button
            @click="closeErrorModal"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Status Toggle Confirmation Modal -->
    <div v-if="showStatusToggleModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusToggleModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full" :class="facilityToToggle?.status === 'active' ? 'bg-orange-100' : 'bg-green-100'">
            <svg class="w-6 h-6" :class="facilityToToggle?.status === 'active' ? 'text-orange-600' : 'text-green-600'" fill="currentColor" viewBox="0 0 24 24">
              <path :d="facilityToToggle?.status === 'active' ? mdiAccountCancel : mdiAccountCheck" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">
            {{ facilityToToggle?.status === 'active' ? 'Make Facility Inactive' : 'Make Facility Active' }}
          </h3>
          <div class="mt-2 px-7 py-3">
            
            <div v-if="facilityToToggle" class="mt-4 p-3 bg-gray-50 rounded-lg">
              <div class="text-sm space-y-1">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="getFacilityIcon(facilityToToggle)" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900">{{ facilityToToggle.name }}</div>
                    <div class="text-gray-500">Current Status: {{ facilityToToggle.status }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div v-if="facilityToToggle?.status === 'active'" class="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
              <p class="text-xs text-orange-700">
                <strong>Note:</strong> Making inactive will prevent users from booking this facility.
              </p>
            </div> -->
            <div class="my-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-700 text-center">
                Are you sure you want to <strong>{{ facilityToToggle?.status === 'active' ? 'make this facility inactive' : 'make this facility active' }}</strong>?
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeStatusToggleModal"
              class="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmStatusToggle"
              :disabled="isTogglingStatus"
              class="px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              :class="facilityToToggle?.status === 'active' ? 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100' : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'"
            >
              <svg v-if="isTogglingStatus" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isTogglingStatus ? 'Processing...' : (facilityToToggle?.status === 'active' ? 'Inactive' : 'Active') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onBeforeMount, watch, nextTick } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PermissionGuard from '@/components/ui/PermissionGuard.vue'
import { facilityApi } from '@/services/api'
import { usePermissions } from '@/composables/usePermissions'
import {
  mdiPencil,
  mdiDelete,
  mdiSeat,
  mdiAccountCancel,
  mdiAccountCheck,
  mdiWifi
} from '@mdi/js'

// Permissions
const permissionsStore = usePermissions()

// Check if user has any facility permissions
const hasAnyFacilityPermissions = computed(() => {
  return permissionsStore.hasPermission('create_facilities') || 
         permissionsStore.hasPermission('edit_facilities')
})

// State
const searchQuery = ref('')
const facilities = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const viewMode = ref<'tile' | 'table'>('table') // Default to table view

// Dropdown states for rotating arrows
const dropdownStates = ref({
  status: false
})

const filters = ref({
  status: ''
})

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

// Modal state
const showDeleteModal = ref(false)
const facilityToDelete = ref<any>(null)
const isDeleting = ref(false)

// Status toggle modal state
const showStatusToggleModal = ref(false)
const facilityToToggle = ref<any>(null)
const isTogglingStatus = ref(false)

// Success and error modal state
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const modalMessage = ref('')

// Pagination
const currentPage = ref(1)

// Dynamic items per page based on view mode
const itemsPerPage = computed(() => viewMode.value === 'tile' ? 12 : 10)

// Computed properties
const filteredFacilities = computed(() => {
  let filtered = facilities.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(facility =>
      facility.name.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (filters.value.status) {
    filtered = filtered.filter(facility => facility.status === filters.value.status)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredFacilities.value.length / itemsPerPage.value))

const paginatedFacilities = computed(() => {
  console.log('FacilitiesView: Paginating facilities - total:', filteredFacilities.value.length, 'itemsPerPage:', itemsPerPage.value, 'currentPage:', currentPage.value)
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredFacilities.value.slice(start, end)
})

// Watch for changes in facilities and filtered facilities to debug empty state
watch(facilities, (newFacilities) => {
  console.log('FacilitiesView: facilities array changed:', newFacilities.length, 'items')
}, { immediate: true })

watch(filteredFacilities, (newFiltered) => {
  console.log('FacilitiesView: filteredFacilities changed:', newFiltered.length, 'items')
  console.log('FacilitiesView: isLoading:', isLoading.value, 'error:', error.value)
}, { immediate: true })

watch(isLoading, (newLoading) => {
  console.log('FacilitiesView: isLoading changed to:', newLoading)
}, { immediate: true })

const startItem = computed(() => {
  if (filteredFacilities.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return Math.min(end, filteredFacilities.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

const getFacilityIcon = (facility: any) => {
  // If facility has an Icon property (SVG path data from database), use it
  if (facility.Icon) {
    return facility.Icon
  }

  // If facility has an iconSVG property (from backend), use it
  if (facility.iconSVG) {
    return facility.iconSVG
  }
  // If facility has an iconType property, map it to the corresponding SVG
  if (facility.iconType) {
    const iconMap: { [key: string]: string } = {
      'tv': 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z',
      'ac': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
      'wifi': 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.65-4.35-1.65-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
      'catering': 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 .89-5 2z',
      'coffee': 'M2 21h18v-2H2v2zm0-4h18v-2H2v2zm0-4h18v-2H2v2zm0-4h18V7H2v2zM0 3v18h20V3H0z',
      'water': 'M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z',
      'tea': 'M4 19h16v2H4v-2zm0-4h16v2H4v-2zm0-4h16v2H4v-2zm0-4h16v2H4v-2zM3 3v2h18V3H3z',
      'meeting-room': 'M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6h-7zm-9 7h2v2H5v-2z',
      'desk': 'M20 7h-4V4c0-1.11-.89-2-2-2H10c-1.11 0-2 .89-2 2v3H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V9c0-1.11-.89-2-2-2zM10 4h4v3h-4V4zm0 7l-3 3 1.41 1.41L10 12.83V18H8v-5.17l1.59 1.59L12 14l-2-2z',
      'parking': 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z',
      'printer': 'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h14V3z',
      'kitchen': 'M8 5h2v3H8V5zm0 7h2v5H8v-5zm10-9.5V6c0 .55-.45 1-1 1h-2v9c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-9H4c-.55 0-1-.45-1-1V3.5c0-.55.45-1 1-1h16c.55 0 1 .45 1 1zM12 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z',
      'restroom': 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9Z',
      'elevator': 'M7 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L17 2H7M7 4H17V6H7V4M5 8H19V20H5V8M7 10V12H11V10H7M13 10V12H17V10H13M7 14V16H11V14H7M13 14V16H17V14H13Z',
      'security': 'M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z',
      'cleaning': 'M16 11H14V9C14 7.9 13.1 7 12 7S10 7.9 10 9V11H8V9C8 6.79 9.79 5 12 5S16 6.79 16 9V11M12 13C13.66 13 15 11.66 15 10S13.66 7 12 7 9 8.34 9 10 10.34 12 12 12 13.66 12 15 13M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z',
      'maintenance': 'M22.7 19L13.6 9.9C14.5 7.6 16.7 6 19 6C21.8 6 24.2 7.8 24.9 10.3L22.7 19M19 13C17.3 13 16 14.3 16 16S17.3 19 19 19 22 17.7 22 16 20.7 14 19 14 17.3 14 16 15.3 16 16M10 3C8.3 3 7 4.3 7 6S8.3 9 10 9 13 7.7 13 6 11.7 4 10 4 8.3 4 7 5.3 7 6M2 21V19L9.6 11.9C9.2 11.7 8.8 11.5 8.4 11.3L1.1 19.1C.4 19.7 0 20.3 0 21H2Z',
      'projector': 'M6 3C4.89 3 4 3.89 4 5V19C4 20.11 4.89 21 6 21H18C19.11 21 20 20.11 20 19V5C20 3.89 19.11 3 18 3H6M6 5H18V19H6V5M8 7V9H16V7H8M8 11V13H16V11H8M8 15V17H13V15H8Z',
      'whiteboard': 'M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19M7 7H17V9H7V7M7 11H17V13H7V11M7 15H13V17H7V15Z',
      'lockers': 'M8 2H16V4H8V2M6 5V21H18V5H6M8 7H16V9H8V7M8 11H16V13H8V11M8 15H16V17H8V15M8 19H16V21H8V19Z',
      'phone': 'M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z',
      'internet': 'M4.26 11.02C3.73 11.02 3.31 11.44 3.31 12C3.31 12.56 3.73 13 4.26 13C4.79 13 5.21 12.56 5.21 12C5.21 11.44 4.79 11.02 4.26 11.02M20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C13.04 20 14.04 19.77 14.93 19.35L13.65 18.07C13.03 18.32 12.52 18.71 12.14 19.2C11.76 19.69 11.5 20.26 11.5 20.85C11.5 21.44 11.76 22.01 12.14 22.5C12.52 22.99 13.03 23.38 13.65 23.63L14.93 22.35C14.04 21.93 13.04 21.7 12 21.7C8.69 21.7 6 19.01 6 15.7C6 12.39 8.69 9.7 12 9.7C15.31 9.7 18 12.39 18 15.7C18 16.29 17.74 16.86 17.36 17.35C16.98 17.84 16.47 18.23 15.85 18.48L17.13 19.76C18.02 19.33 19.02 19.06 20 19.06V12Z'
    }
    return iconMap[facility.iconType] || 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z'
  }
  // If facility has a name, try to generate a relevant icon based on keywords
  if (facility.name) {
    const name = facility.name.toLowerCase()
    const keywordMappings = [
      // Meeting & Conference
      { keywords: ['meeting', 'conference', 'boardroom', 'discussion'], icon: 'M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6h-7zm-9 7h2v2H5v-2z' },
      { keywords: ['presentation', 'seminar'], icon: 'M6 3C4.89 3 4 3.89 4 5V19C4 20.11 4.89 21 6 21H18C19.11 21 20 20.11 20 19V5C20 3.89 19.11 3 18 3H6M6 5H18V19H6V5M8 7V9H16V7H8M8 11V13H16V11H8M8 15V17H13V15H8Z' },

      // Workspaces
      { keywords: ['desk', 'workspace', 'workstation'], icon: 'M20 7h-4V4c0-1.11-.89-2-2-2H10c-1.11 0-2 .89-2 2v3H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V9c0-1.11-.89-2-2-2zM10 4h4v3h-4V4zm0 7l-3 3 1.41 1.41L10 12.83V18H8v-5.17l1.59 1.59L12 14l-2-2z' },
      { keywords: ['hot desk', 'flexible', 'shared desk'], icon: 'M4 6H20V16H4M20 18H4C2.89 18 2 17.11 2 16V6C2 4.89 2.89 4 4 4H20C21.11 4 22 4.89 22 6V16C22 17.11 21.11 18 20 18Z' },
      { keywords: ['private', 'office', 'executive'], icon: 'M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2M3 13H21V21H3V13Z' },
      { keywords: ['open', 'space', 'collaborative'], icon: 'M3 3V21H21V3H3M5 5H19V19H5V5M7 7H17V17H7V7Z' },
      { keywords: ['cubicle', 'partition'], icon: 'M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M7 7V17H17V7H7Z' },
      { keywords: ['locker', 'storage'], icon: 'M8 2H16V4H8V2M6 5V21H18V5H6M8 7H16V9H8V7M8 11H16V13H8V11M8 15H16V17H8V15M8 19H16V21H8V19Z' },

      // Technology
      { keywords: ['wifi', 'internet', 'network'], icon: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.65-4.35-1.65-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z' },
      { keywords: ['tv', 'display', 'screen', 'monitor'], icon: 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z' },
      { keywords: ['printer', 'print', 'copy'], icon: 'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h14V3z' },
      { keywords: ['projector', 'projection'], icon: 'M6 3C4.89 3 4 3.89 4 5V19C4 20.11 4.89 21 6 21H18C19.11 21 20 20.11 20 19V5C20 3.89 19.11 3 18 3H6M6 5H18V19H6V5M8 7V9H16V7H8M8 11V13H16V11H8M8 15V17H13V15H8Z' },
      { keywords: ['scanner', 'scan'], icon: 'M6 6V18H18V6H6M8 8H16V16H8V8M4 4V20H20V22H4C2.9 22 2 21.1 2 20V4H4Z' },
      { keywords: ['computer', 'pc', 'laptop'], icon: 'M20 18C20.55 18 21 17.55 21 17V7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H0V20H24V18H20M4 7H20V17H4V7Z' },
      { keywords: ['phone', 'telephone', 'call'], icon: 'M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z' },

      // Facilities & Services
      { keywords: ['ac', 'air conditioning', 'cooling'], icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
      { keywords: ['elevator', 'lift'], icon: 'M7 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L17 2H7M7 4H17V6H7V4M5 8H19V20H5V8M7 10V12H11V10H7M13 10V12H17V10H13M7 14V16H11V14H7M13 14V16H17V14H13Z' },
      { keywords: ['restroom', 'bathroom', 'toilet', 'washroom'], icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9Z' },
      { keywords: ['kitchen', 'pantry', 'break room'], icon: 'M8 5h2v3H8V5zm0 7h2v5H8v-5zm10-9.5V6c0 .55-.45 1-1 1h-2v9c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-9H4c-.55 0-1-.45-1-1V3.5c0-.55.45-1 1-1h16c.55 0 1 .45 1 1zM12 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z' },
      { keywords: ['parking', 'car park'], icon: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z' },
      { keywords: ['security', 'guard'], icon: 'M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z' },
      { keywords: ['cleaning', 'maintenance'], icon: 'M16 11H14V9C14 7.9 13.1 7 12 7S10 7.9 10 9V11H8V9C8 6.79 9.79 5 12 5S16 6.79 16 9V11M12 13C13.66 13 15 11.66 15 10S13.66 7 12 7 9 8.34 9 10 10.34 12 12 12 13.66 12 15 13M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z' },

      // Food & Beverage
      { keywords: ['coffee', 'cafe', 'café'], icon: 'M2 21h18v-2H2v2zm0-4h18v-2H2v2zm0-4h18v-2H2v-2zm0-4h18V7H2v2zM0 3v18h20V3H0z' },
      { keywords: ['tea', 'teahouse'], icon: 'M4 19h16v2H4v-2zm0-4h16v2H4v-2zm0-4h16v2H4v-2zm0-4h16v2H4v-2zM3 3v2h18V3H3z' },
      { keywords: ['water', 'drinking'], icon: 'M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z' },
      { keywords: ['catering', 'food', 'dining'], icon: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 .89-5 2z' },
      { keywords: ['microwave', 'microwave oven'], icon: 'M4 5H20C20.55 5 21 5.45 21 6V18C21 18.55 20.55 19 20 19H4C3.45 19 3 18.55 3 18V6C3 5.45 3.45 5 4 5M4 7V17H20V7H4M6 9H18V15H6V9M8 11V13H16V11H8Z' },
      { keywords: ['refrigerator', 'fridge', 'cooler'], icon: 'M7 2H17C18.11 2 19 2.9 19 4V20C19 21.11 18.11 22 17 22H7C5.9 22 5 21.11 5 20V4C5 2.9 5.9 2 7 2M7 4V8H17V4H7M7 10V12H17V10H7M7 14V16H17V14H7M7 18V20H17V18H7Z' },
      { keywords: ['vending', 'snack'], icon: 'M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M7 7H17V9H7V7M7 11H17V13H7V11M7 15H17V17H7V15M7 19H17V21H7V19Z' },

      // Health & Wellness
      { keywords: ['first aid', 'medical', 'health'], icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
      { keywords: ['gym', 'fitness', 'workout'], icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14  20 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
      { keywords: ['meditation', 'quiet', 'zen'], icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },

      // Transportation
      { keywords: ['bike', 'bicycle', 'cycle'], icon: 'M19 7H18V6C18 5.45 17.55 5 17 5S16 5.45 16 6V7H8V6C8 5.45 7.55 5 7 5S6 5.45 6 6V7H5C3.89 7 3 7.89 3 9V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V9C21 7.89 20.11 7 19 7M5 9H19V19H5V9M7 11V13H17V11H7Z' },
      { keywords: ['car', 'automobile', 'vehicle'], icon: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z' },
      { keywords: ['shuttle', 'transport'], icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },

      // Office Equipment
      { keywords: ['whiteboard', 'board', 'chalkboard'], icon: 'M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19M7 7H17V9H7V7M7 11H17V13H7V11M7 15H13V17H7V15Z' },
      { keywords: ['copy machine', 'photocopier'], icon: 'M16 6H8V8H16V6M16 10H8V12H16V10M16 14H8V16H16V14M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19Z' },
      { keywords: ['shredder', 'shredding'], icon: 'M6 3H18C19.11 3 20 3.89 20 5V19C20 20.11 19.11 21 18 21H6C4.89 21 4 20.11 4 19V5C4 3.89 4.89 3 6 3M6 5V19H18V5H6M8 7H16V9H8V7M8 11H16V13H8V11M8 15H16V17H8V15Z' },
      { keywords: ['filing', 'cabinet', 'archive'], icon: 'M4 4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4H4M4 6H20V8H4V6M4 10H20V12H4V10M4 14H20V16H4V14M4 18H20V20H4V18Z' },
      { keywords: ['library', 'book', 'reading'], icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
      { keywords: ['atm', 'cash machine'], icon: 'M8 3H16C17.11 3 18 3.89 18 5V19C18 20.11 17.11 21 16 21H8C6.89 21 6 20.11 6 19V5C6 3.89 6.89 3 8 3M8 5V19H16V5H8M10 7H14V9H10V7M10 11H14V13H10V11M10 15H14V17H10V15Z' },
      { keywords: ['clock', 'time'], icon: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12S17.5 2 12 2M12 4C16.4 4 20 7.6 20 12S16.4 20 12 20 7.6 20 4 16.4 4 12S7.6 4 12 4M12 6V12L16 14V12H14V6H12M8 8H6V10H8V8M16 8H18V10H16V8M8 14H6V16H8V14M16 14H18V16H16V14Z' },
      { keywords: ['calendar', 'schedule'], icon: 'M19 19H5V8H19M16 1V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M17 12H12V17H17V12Z' },
      { keywords: ['clock in', 'time clock'], icon: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12S17.5 2 12 2M12 4C16.4 4 20 7.6 20 12S16.4 20 12 20 7.6 20 4 16.4 4 12S7.6 4 12 4M12 6V12L16 14V12H14V6H12M8 8H6V10H8V8M16 8H18V10H16V8M8 14H6V16H8V14M16 14H18V16H16V14Z' },
      { keywords: ['id card', 'badge'], icon: 'M4 4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4H4M4 6H20V8H4V6M4 10H14V12H4V10M4 14H20V16H4V14M16 10H20V12H16V10Z' },

      // Safety & Emergency
      { keywords: ['fire', 'extinguisher'], icon: 'M10 2C9.45 2 9 2.45 9 3V5H11V3C11 2.45 10.55 2 10 2M6 7V21C6 21.55 6.45 22 7 22H13C13.55 22 14 21.55 14 21V7C14 6.45 13.55 6 13 6H7C6.45 6 6 6.45 6 7M8 8H12V20H8V8Z' },
      { keywords: ['emergency', 'exit'], icon: 'M16 3C16.55 3 17 3.45 17 4V20C17 20.55 16.55 21 16 21H8C7.45 21 7 20.55 7 20V4C7 3.45 7.45 3 8 3H16M16 5H8V19H16V5M12 7L14 9L12 11L10 9L12 7Z' },
      { keywords: ['cctv', 'camera', 'surveillance'], icon: 'M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z' },
      { keywords: ['alarm', 'alert'], icon: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12S17.5 2 12 2M12 4C16.4 4 20 7.6 20 12S16.4 20 12 20 7.6 20 4 16.4 4 12S7.6 4 12 4M12 6V12L16 14V12H14V6H12M8 8H6V10H8V8M16 8H18V10H16V8M8 14H6V16H8V14M16 14H18V16H16V14Z' },

      // Environmental
      { keywords: ['solar', 'panel'], icon: 'M4 2H20C20.55 2 21 2.45 21 3V21C21 21.55 20.55 22 20 22H4C3.45 22 3 21.55 3 21V3C3 2.45 3.45 2 4 2M4 4V20H20V4H4M6 6H18V8H6V6M6 10H18V12H6V10M6 14H18V16H6V14M6 18H18V20H6V18Z' },
      { keywords: ['green', 'eco', 'sustainable'], icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
      { keywords: ['recycling', 'recycle'], icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' }
    ]

    for (const mapping of keywordMappings) {
      for (const keyword of mapping.keywords) {
        if (name.includes(keyword)) {
          return mapping.icon
        }
      }
    }
  }

  // Default fallback - generic building/facility icon
  return 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z'
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'tile' ? 'table' : 'tile'
}

const toggleFacilityStatus = (facility: any) => {
  facilityToToggle.value = facility
  showStatusToggleModal.value = true
}

const closeStatusToggleModal = () => {
  showStatusToggleModal.value = false
  facilityToToggle.value = null
  isTogglingStatus.value = false
}

const confirmStatusToggle = async () => {
  if (!facilityToToggle.value) return
  isTogglingStatus.value = true
  try {
    const newIsActive = facilityToToggle.value.status === 'active' ? false : true
    const facilityName = facilityToToggle.value.name // Capture name before closing modal
    
    const response = await facilityApi.activateFacilityType(facilityToToggle.value.id, newIsActive)
    
    if (response.success) {
      // Update local state
      facilityToToggle.value.status = newIsActive ? 'active' : 'inactive'
      closeStatusToggleModal()
      
      // Show success modal after a short delay
      setTimeout(() => {
        modalMessage.value = `Facility "${facilityName}" status updated to ${newIsActive ? 'active' : 'inactive'}`
        showSuccessModal.value = true
        console.log('Success modal should be showing now:', modalMessage.value)
      }, 400)
    } else {
      throw new Error(response.message || 'Failed to update facility status')
    }
  } catch (error) {
    console.error('Error updating facility status:', error)
    closeStatusToggleModal()
    modalMessage.value = error instanceof Error ? error.message : 'Error updating facility status.'
    showErrorModal.value = true
  } finally {
    isTogglingStatus.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.value.status = '' // Clear status filter to show all facilities
  currentPage.value = 1
}

// Dropdown control functions
const toggleDropdown = (dropdown: string) => {
  // Close all dropdowns first
  closeAllDropdowns()
  // Then open the clicked dropdown
  dropdownStates.value[dropdown as keyof typeof dropdownStates.value] = true
}

const closeDropdown = (dropdown: string) => {
  dropdownStates.value[dropdown as keyof typeof dropdownStates.value] = false
}

const closeAllDropdowns = () => {
  Object.keys(dropdownStates.value).forEach(key => {
    dropdownStates.value[key as keyof typeof dropdownStates.value] = false
  })
}

const getStatusLabel = (value: string) => {
  const option = statusOptions.find(opt => opt.value === value)
  return option ? option.label : 'All Status'
}

const selectStatus = (value: string) => {
  filters.value.status = value
  closeDropdown('status')
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const dropdownContainer = target.closest('.relative')
  
  // Close all dropdowns if clicking outside any dropdown container
  if (!dropdownContainer) {
    closeAllDropdowns()
  }
}

// Pagination methods
// const goToPage = (page: number) => {
//   currentPage.value = page
// }

// const nextPage = () => {
//   if (currentPage.value < totalPages.value) {
//     currentPage.value++
//   }
// }

// const previousPage = () => {
//   if (currentPage.value > 1) {
//     currentPage.value--
//   }
// }

// API methods
const loadFacilities = async () => {
  try {
    console.log('FacilitiesView: Starting to load facilities...')
    isLoading.value = true
    error.value = null
    
    // Clear existing facilities to ensure clean state
    facilities.value = []

    const response = await facilityApi.getAllFacilities()
    console.log('FacilitiesView: API response received:', response)

    if (response.success && response.data) {
      console.log('FacilitiesView: Facilities data:', response.data)
      
      // Ensure each facility has a valid ID
      facilities.value = response.data.map(facility => {
        // Make sure ID is properly set and is a string
        return {
          ...facility,
          id: facility.id ? facility.id.toString() : null
        }
      })
      
      // Log transformed facilities
      console.log('FacilitiesView: Facilities processed and assigned to reactive array:', facilities.value)
      console.log('FacilitiesView: Total facilities loaded:', facilities.value.length)
      console.log('FacilitiesView: Filtered facilities count:', filteredFacilities.value.length)
      
      // Force reactivity update
      await nextTick()
    } else {
      console.error('FacilitiesView: API response not successful:', response.message)
      error.value = response.message || 'Failed to load facilities'
      facilities.value = [] // Ensure empty array on failure
    }
  } catch (err) {
    console.error('FacilitiesView: Error in loadFacilities:', err)
    error.value = 'Network error while loading facilities'
    facilities.value = [] // Ensure empty array on error
  } finally {
    isLoading.value = false
    console.log('FacilitiesView: Finished loading facilities')
    console.log('FacilitiesView: Final state - isLoading:', isLoading.value, 'facilities count:', facilities.value.length, 'error:', error.value)
  }
}

// Modal functions
const confirmDeleteFacility = (facility: any) => {
  console.log('Confirming delete for facility:', facility)
  // Make sure we're capturing the facility id correctly
  facilityToDelete.value = { 
    ...facility,
    id: facility.id ? facility.id.toString() : null
  }
  showDeleteModal.value = true
  console.log('facilityToDelete set to:', facilityToDelete.value)
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  facilityToDelete.value = null
  isDeleting.value = false
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  modalMessage.value = ''
}

const closeErrorModal = () => {
  showErrorModal.value = false
  modalMessage.value = ''
}

const deleteFacility = async () => {
  if (!facilityToDelete.value) return

  isDeleting.value = true

  try {
    // Use the actual API call we implemented
    console.log('Attempting to delete facility:', facilityToDelete.value)
    
    // Check if ID exists and is valid
    if (!facilityToDelete.value.id) {
      console.error('Cannot delete facility: ID is missing or invalid')
      modalMessage.value = 'Cannot delete facility: ID is missing or invalid'
      showErrorModal.value = true
      isDeleting.value = false
      return
    }
    
    console.log('Deleting facility with ID:', facilityToDelete.value.id)
    const response = await facilityApi.deleteFacility(facilityToDelete.value.id)

    if (response.success) {
      // Store facility name before clearing
      const deletedFacilityName = facilityToDelete.value.name
      
      // Remove facility from local array
      const index = facilities.value.findIndex(f => f.id === facilityToDelete.value.id)
      if (index !== -1) {
        facilities.value.splice(index, 1)
      }

      closeDeleteModal()

      // Show success message
      console.log('Facility deleted successfully:', deletedFacilityName)
      console.log('API Response:', response.message)
      modalMessage.value = `Facility "${deletedFacilityName}" has been deleted successfully!`
      showSuccessModal.value = true

    } else {
      console.error('Failed to delete facility:', response.message)
      modalMessage.value = response.message || 'Failed to delete facility'
      showErrorModal.value = true
    }

  } catch (error) {
    console.error('Error deleting facility:', error)
    modalMessage.value = 'Network error while deleting facility. Please try again.'
    showErrorModal.value = true
  } finally {
    isDeleting.value = false
  }
}

// Watch for view mode changes and reset to page 1
watch(viewMode, () => {
  currentPage.value = 1
})

// Initialize state before component mounts
onBeforeMount(() => {
  console.log('FacilitiesView: onBeforeMount - Initializing state')
  // Reset state to ensure clean start
  facilities.value = []
  isLoading.value = false
  error.value = null
  searchQuery.value = ''
  filters.value.status = ''
})

// Load facilities on component mount
onMounted(async () => {
  console.log('FacilitiesView: onMounted - Loading facilities and setting up listeners')
  document.addEventListener('click', handleClickOutside)
  
  // Add a small delay to ensure component is fully mounted
  await nextTick()
  await loadFacilities()
})

// Handle route updates (when navigating back to this view)
onBeforeRouteUpdate(async (to, from) => {
  console.log('FacilitiesView: Route update detected', { to: to.path, from: from.path })
  if (to.path === '/facilities' || to.path.startsWith('/facilities')) {
    console.log('FacilitiesView: Reloading data due to route update')
    await loadFacilities()
  }
})

// Cleanup event listener
onUnmounted(() => {
  console.log('FacilitiesView: onUnmounted - Cleaning up listeners')
  document.removeEventListener('click', handleClickOutside)
})
</script>
<style scope>
/* Custom dropdown styles */
.appearance-none {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}</style>
