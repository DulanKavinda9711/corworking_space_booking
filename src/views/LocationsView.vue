<template>
  <AdminLayout>
    <div class="space-y-6" @click="closeAllDropdowns">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiMapMarker" />
            </svg>
            <span class="text-sm font-medium text-green-700">
              Total Locations:
              <span class="font-bold text-green-800">{{ filteredLocations.length }}</span>
            </span>
          </div>
        
        <!-- Add New Location Button - Hidden if no create permission -->
        <PermissionGuard permission="create_locations">
          <router-link to="/locations/add"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Location</span>
          </router-link>
        </PermissionGuard>
      </div>

      <!-- Error Message
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-red-800">{{ errorMessage }}</span>
          <button @click="fetchLocations" class="ml-auto text-red-600 hover:text-red-800 font-medium">
            Retry
          </button>
        </div>
      </div> -->

      

      <!-- Locations Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="bg-white  shadow-card p-6 border-b">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Locations</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by location name or address..."
                v-model="searchQuery"
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:ring-1 focus:z-10 text-black"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative" @click.stop>
              <div @click="toggleDropdown('status')" :class="['w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center', dropdownStates.status ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                <span class="text-gray-900 leading-5 h-5 flex items-center">{{ getStatusLabel(filters.status) }}</span>
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
          <div class="md:w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div class="relative" @click.stop>
              <div @click="toggleDropdown('location')" :class="['w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center', dropdownStates.location ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                <span class="text-gray-900 leading-5 h-5 flex items-center truncate">{{ getLocationLabel(filters.location) }}</span>
              </div>

              <!-- Dropdown Options -->
              <div v-if="dropdownStates.location" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div class="p-2">
                  <div v-for="option in locationOptions" :key="option.value" @click="selectLocation(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                    {{ option.label }}
                  </div>
                </div>
              </div>

              <!-- Dropdown Arrow -->
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg :class="[
                  'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                  dropdownStates.location ? 'transform rotate-180' : ''
                ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div class="md:col-span-2 flex items-end justify-end">
            <button @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <!-- <div v-if="isLoading" class="bg-white rounded-xl shadow-card p-8">
        <div class="flex items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-gray-600">Loading locations...</span>
        </div>
      </div> -->

        <!-- Locations Table -->
        <div class="overflow-x-auto h-[410px]">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody v-if="filteredLocations.length > 0" class="bg-white divide-y divide-gray-200">
              <tr v-for="location in filteredLocations" :key="location.id" 
                  class="hover:bg-gray-50 cursor-pointer transition-colors"
                  @click="navigateToLocationDetail(location.id)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="mdiMapMarker" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ location.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ getLocationAddress(location) }}</div>
                  <!-- <div class="text-sm text-gray-500">{{ location.city || '' }}</div> -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(location.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ location.status }}
                  </span>
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-center" @click.stop>
                  <div class="flex items-center justify-center space-x-2">
                    <!-- Edit Button - Hidden if no edit permission -->
                    <PermissionGuard permission="edit_locations">
                      <button @click.stop="editLocation(location.id)"
                        class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 flex items-center justify-center space-x-1"
                        title="Edit Location">
                        <span>Edit</span>
                      </button>
                    </PermissionGuard>
                    
                    <!-- Toggle Status Button - Hidden if no edit permission -->
                    <PermissionGuard permission="edit_locations">
                      <button @click.stop="toggleLocationStatus(location)"
                        :disabled="toggleStatusLoading.has(location.id)"
                        :class="[
                          location.status === 'active' ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200',
                          toggleStatusLoading.has(location.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        ]"
                        class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors border flex items-center justify-center space-x-1"
                        :title="toggleStatusLoading.has(location.id) ? 'Updating...' : (location.status === 'active' ? 'Make Location Inactive' : 'Make Location Active')">
                        <svg v-if="toggleStatusLoading.has(location.id)" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span v-else>{{ location.status === 'active' ? 'Inactive' : 'Active' }}</span>
                      </button>
                    </PermissionGuard>
                    
                    <!-- Show message if no actions available -->
                    <div v-if="!hasAnyLocationPermissions" class="text-sm text-gray-500 italic">
                      No actions available
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- Empty State Row -->
            <tbody v-if="filteredLocations.length === 0" class="bg-white">
              <tr>
                <td colspan="4" class="px-6 py-12 text-center">
                  <div>
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No locations found</h3>
                    <p class="mt-1 text-sm text-gray-500">No locations match the current search and filters.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Location Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            Add New Location
          </h2>
        </div>
        
        <form @submit.prevent="saveLocation" class="p-6 space-y-6">
          <!-- Company Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Company *</label>
            <select v-model="form.companyId" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select a company</option>
              <option value="1">WorkHub Co.</option>
              <option value="2">FlexSpace Inc.</option>
              <option value="3">Creative Spaces LLC</option>
            </select>
          </div>

          <!-- Location Details -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Location Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Location Name *</label>
                <input
                  type="text"
                  v-model="form.name"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter location name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select v-model="form.status" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <textarea
                v-model="form.address"
                required
                rows="3"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter complete address"
              ></textarea>
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  v-model="form.city"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  v-model="form.country"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Map URL</label>
              <input
                type="url"
                v-model="form.mapUrl"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Person Name</label>
                <input
                  type="text"
                  v-model="form.contactPersonName"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter contact person name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Phone Number</label>
                <input
                  type="tel"
                  v-model="form.contactPhone"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter contact phone"
                />
              </div>
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
              {{ showAddModal ? 'Add Location' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Status Change Confirmation Modal -->
    <div v-if="showStatusConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="cancelStatusChange">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Confirm Status Change</h3>

        <div v-if="locationToToggle" class="bg-gray-100 border-gray-200 rounded-lg p-4 mb-4">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiMapMarker" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ locationToToggle.name }}</p>
              <p class="text-sm text-gray-500">{{ getLocationAddress(locationToToggle) }}</p>
            </div>
          </div>
        </div>

        <div class="my-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-700 text-center">
            Are you sure you want to <strong>{{ locationToToggle?.status === 'active' ? 'make this location inactive' : 'make this location active' }}</strong>?
          </p>
        </div>

        <div class="flex space-x-3">
          <button
            @click="cancelStatusChange"
            :disabled="toggleStatusLoading.has(locationToToggle?.id || '')"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Cancel
          </button>
            <button
              @click="confirmStatusChange"
              :disabled="toggleStatusLoading.has(locationToToggle?.id || '')"
              class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-center"
              :class="locationToToggle?.status === 'active' ? 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100' : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'"
            >
              <svg v-if="toggleStatusLoading.has(locationToToggle?.id || '')" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ toggleStatusLoading.has(locationToToggle?.id || '') ? 'Processing...' : (locationToToggle?.status === 'active' ? 'Inactive' : 'Active') }}</span>
            </button>
        </div>
      </div>
    </div>

    <!-- Success Popup Modal -->
    <div v-if="showSuccessPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showSuccessPopup = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 transform transition-all" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Success!</h3>
        <p class="text-sm text-gray-600 text-center mb-6">{{ popupMessage }}</p>
        
        <div class="flex justify-center">
          <button
            @click="showSuccessPopup = false"
            class="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Error Popup Modal -->
    <div v-if="showErrorPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showErrorPopup = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 transform transition-all" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Error</h3>
        <p class="text-sm text-gray-600 text-center mb-6">{{ popupMessage }}</p>
        
        <div class="flex justify-center">
          <button
            @click="showErrorPopup = false"
            class="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PermissionGuard from '@/components/ui/PermissionGuard.vue'
import { locationApi } from '@/services/api'
import { usePermissions } from '@/composables/usePermissions'
import { mdiMapMarker } from '@mdi/js'

const router = useRouter()
const permissionsStore = usePermissions()

// Check if user has any location permissions
const hasAnyLocationPermissions = computed(() => {
  return permissionsStore.hasPermission('create_locations') || 
         permissionsStore.hasPermission('edit_locations')
})

// State
const searchQuery = ref('')
const showAddModal = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Delete modal state
// const showDeleteModal = ref(false)
// const locationToDelete = ref<any>(null)
// const isDeleting = ref(false)

// Status change modal state
const showStatusConfirmModal = ref(false)
const locationToToggle = ref<any>(null)
const toggleStatusLoading = ref<Set<string>>(new Set())

// Success/Error popup states
const showSuccessPopup = ref(false)
const showErrorPopup = ref(false)
const popupMessage = ref('')

// Filters
const filters = ref({
  status: '',
  location: ''
})

// Dropdown states for rotating arrows
const dropdownStates = ref({
  status: false,
  location: false
})

// Dropdown options
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const locationOptions = computed(() => {
  const options = [{ value: '', label: 'All Locations' }]
  locations.value.forEach(location => {
    options.push({
      value: location.id,
      label: location.name
    })
  })
  return options
})

// Form data
const form = ref({
  id: null as string | null,
  name: '',
  address: '',
  city: '',
  country: '',
  mapUrl: '',
  contactPersonName: '',
  contactPhone: '',
  companyId: '',
  status: 'active' as 'active' | 'inactive'
})

// Locations data from API
const locations = ref<any[]>([])

// Computed properties
const filteredLocations = computed(() => {
  let filtered = locations.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(location => {
      const name = (location.name || '').toLowerCase()
      const street = (location.street || '').toLowerCase()
      const town = (location.town || '').toLowerCase()
      const city = (location.city || '').toLowerCase()
      const district = (location.district || '').toLowerCase()
      
      return name.includes(query) ||
             street.includes(query) ||
             town.includes(query) ||
             city.includes(query) ||
             district.includes(query)
    })
  }

  // Apply status filter
  if (filters.value.status) {
    filtered = filtered.filter(location => location.status === filters.value.status)
  }

  // Apply location filter
  if (filters.value.location) {
    filtered = filtered.filter(location => location.id === filters.value.location)
  }

  return filtered
})

// Methods
const getLocationAddress = (location: any) => {
  const addressParts = [
    location.street,
    location.street2,
    location.town,
    location.district,
    location.postalCode
  ].filter(part => part && part.trim()) // Remove null, undefined, and empty strings
  
  return addressParts.join(', ') || 'Address not available'
}

const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    status: '',
    location: ''
  }
}

// Dropdown control functions
const toggleDropdown = (dropdownName: string) => {
  // Close all dropdowns first
  closeAllDropdowns()
  // Then open the clicked dropdown
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = true
}

const closeDropdown = (dropdownName: string) => {
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = false
}

const closeAllDropdowns = () => {
  dropdownStates.value.status = false
  dropdownStates.value.location = false
}

// Dropdown label functions
const getStatusLabel = (value: string) => {
  const option = statusOptions.find(opt => opt.value === value)
  return option ? option.label : 'All Status'
}

const getLocationLabel = (value: string) => {
  const option = locationOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All Locations'
}

// Dropdown select functions
const selectStatus = (value: string) => {
  filters.value.status = value
  closeAllDropdowns()
}

const selectLocation = (value: string) => {
  filters.value.location = value
  closeAllDropdowns()
}

const navigateToLocationDetail = (locationId: string) => {
  router.push(`/locations/${locationId}`)
}

const editLocation = (locationId: string) => {
  router.push(`/locations/${locationId}/edit`)
}

const toggleLocationStatus = async (location: any) => {
  locationToToggle.value = location
  showStatusConfirmModal.value = true
}

const confirmStatusChange = async () => {
  if (!locationToToggle.value) return

  const location = locationToToggle.value
  const originalStatus = location.status
  const newStatus = location.status === 'active' ? 'inactive' : 'active'
  const isActive = newStatus === 'active'

  try {
    // Add to loading state
    toggleStatusLoading.value.add(location.id)

    // Optimistically update the UI
    location.status = newStatus

    // Call the API
    const response = await locationApi.activateLocation(location.id, isActive)

    if (response.success) {
      console.log(`Location ${location.name} status changed to ${location.status}`)
      const customMessage = isActive ? 'Location made active successfully' : 'Location made inactive successfully'
      popupMessage.value = customMessage
      showSuccessPopup.value = true
    } else {
      console.error('Failed to toggle location status:', response.message)
      // Revert the status change if API call fails
      location.status = originalStatus
      popupMessage.value = response.message || 'Failed to update location status'
      showErrorPopup.value = true
    }
  } catch (error) {
    console.error('Error toggling location status:', error)
    // Revert the status change if API call fails
    location.status = originalStatus
    popupMessage.value = 'An error occurred while updating location status'
    showErrorPopup.value = true
  } finally {
    // Remove from loading state
    toggleStatusLoading.value.delete(location.id)
    // Close the confirmation modal
    showStatusConfirmModal.value = false
    locationToToggle.value = null
  }
}

const cancelStatusChange = () => {
  showStatusConfirmModal.value = false
  locationToToggle.value = null
}

// Delete functions removed
// const confirmDeleteLocation = (location: any) => {
//   locationToDelete.value = location
//   showDeleteModal.value = true
// }

// const closeDeleteModal = () => {
//   if (!isDeleting.value) {
//     showDeleteModal.value = false
//     locationToDelete.value = null
//   }
// }

// const confirmDelete = async () => {
//   if (!locationToDelete.value) return

//   isDeleting.value = true

//   try {
//     const response = await locationApi.deleteLocation(locationToDelete.value.id)

//     if (response.success) {
//       // Remove location from local array
//       const index = locations.value.findIndex(l => l.id === locationToDelete.value.id)
//       if (index !== -1) {
//         locations.value.splice(index, 1)
//       }

//       // Hide delete modal first
//       showDeleteModal.value = false
//       locationToDelete.value = null

//       // Show success popup
//       popupMessage.value = response.message || 'Location deleted successfully'
//       showSuccessPopup.value = true
//     } else {
//       // Hide delete modal first
//       showDeleteModal.value = false
//       locationToDelete.value = null

//       // Show error popup
//       popupMessage.value = response.message || 'Failed to delete location'
//       showErrorPopup.value = true
//     }
//   } catch (error) {
//     console.error('Error deleting location:', error)
    
//     // Hide delete modal first
//     showDeleteModal.value = false
//     locationToDelete.value = null

//     // Show error popup
//     popupMessage.value = 'Network error while deleting location'
//     showErrorPopup.value = true
//   } finally {
//     isDeleting.value = false
//   }
// }

const closeModal = () => {
  showAddModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    address: '',
    city: '',
    country: '',
    mapUrl: '',
    contactPersonName: '',
    contactPhone: '',
    companyId: '',
    status: 'active'
  }
}

const saveLocation = () => {
  const companyNames: Record<string, string> = {
    '1': 'WorkHub Co.',
    '2': 'FlexSpace Inc.',
    '3': 'Creative Spaces LLC'
  }

  if (showAddModal.value) {
    // Add new location
    const newLocation = {
      ...form.value,
      id: `LC-${String(locations.value.length + 1).padStart(3, '0')}`,
      companyName: companyNames[form.value.companyId],
      totalSpaces: 0
    }
    locations.value.push(newLocation)
  } else {
    // Edit existing location
    if (form.value.id) {
      const index = locations.value.findIndex(l => l.id === form.value.id)
      if (index !== -1) {
        locations.value[index] = { 
          ...locations.value[index],
          ...form.value,
          id: form.value.id,
          companyName: companyNames[form.value.companyId]
        }
      }
    }
  }
  closeModal()
}

// Fetch locations from API
const fetchLocations = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await locationApi.getAllLocations()

    if (response.success && response.data) {
      locations.value = response.data
    } else {
      errorMessage.value = response.message || 'Failed to load locations'
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    errorMessage.value = 'An unexpected error occurred while loading locations'
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchLocations()
})
</script>
