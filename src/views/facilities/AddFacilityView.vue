<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/facilities" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Add New Facility</h1>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <form @submit.prevent="saveFacility" class="space-y-6">
          <!-- Single Card with All Information -->
          <div class="bg-white rounded-xl shadow-card overflow-visible">
            <div class="p-8 space-y-16">
              <!-- Facility Details Section -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCog" />
                  </svg>
                  Facility Details
                </h2>
                
                <!-- Form Fields -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Facility Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.name"
                      :class="[
                        'w-full rounded-lg px-4 py-3 text-left rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md',
                        showValidation && !form.name.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                      ]"
                      placeholder="Enter facility name" />
                    <div v-if="showValidation && !form.name.trim()" class="mt-1 text-sm text-red-600">
                      Facility name is required
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Facility Icon <span class="text-red-500">*</span>
                    </label>
                    <!-- Custom Icon Dropdown -->
                    <div class="relative">
                      <button
                        @click="showIconDropdown = !showIconDropdown"
                        type="button"
                        :class="[
                          'w-full rounded-lg px-4 py-3 text-left focus:ring-1 transition-colors flex items-center justify-between',
                          showValidation && !form.selectedIcon ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300 border'
                        ]"
                      >
                        <div class="flex items-center">
                          <svg v-if="form.selectedIcon" class="w-6 h-6 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path :d="getSelectedIconSVG()" />
                          </svg>
                          <span :class="form.selectedIcon ? 'text-gray-900' : 'text-gray-500'">
                            {{ form.selectedIcon ? getSelectedIconName() : 'Select facility icon' }}
                          </span>
                        </div>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <!-- Dropdown Options -->
                      <div
                        v-if="showIconDropdown"
                        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        <div class="p-2">
                          <div class="grid grid-cols-6 gap-2">
                            <div
                              @click="selectIcon('')"
                              class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 cursor-pointer border-2 border-dashed border-gray-300"
                              title="Clear selection"
                            >
                              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <div
                              v-for="icon in availableIcons"
                              :key="icon.value"
                              @click="selectIcon(icon.value)"
                              class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-green-50 hover:border-green-300 cursor-pointer border border-gray-200 transition-colors"
                              :class="form.selectedIcon === icon.value ? 'bg-green-100 border-green-400' : ''"
                              :title="icon.name"
                            >
                              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path :d="icon.svg" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="showValidation && !form.selectedIcon" class="mt-1 text-sm text-red-600">
                      Facility icon is required
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select v-model="form.status"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Action Buttons - Bottom Right -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <router-link to="/facilities"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </router-link>
                <button type="submit"
                  :disabled="isLoading"
                  class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2">
                  <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ isLoading ? 'Creating...' : 'Create Facility' }}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div class="p-6 text-center">
            <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
            <p class="text-gray-600 mb-6">{{ successMessage }}</p>
            <div class="flex space-x-3 justify-center">
              <button
                @click="closeSuccessModal"
                type="button"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Facilities
              </button>
              <button
                @click="addAnotherFacility"
                type="button"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Add Another
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { facilityApi } from '@/services/api'
import { mdiCog } from '@mdi/js'

const router = useRouter()

// Form data - name, selected icon, and status
const form = ref({
  name: '',
  selectedIcon: '',
  status: 'active' as 'active' | 'inactive'
})

// Validation state
const showValidation = ref(false)
const showIconDropdown = ref(false)

// Success modal state
const showSuccessModal = ref(false)
const successMessage = ref('')

// Loading state
const isLoading = ref(false)

// Form validation
// const isFormValid = computed(() => {
//   return form.value.name.trim() !== '' && form.value.selectedIcon !== ''
// })

// Available icons for selection
const availableIcons = ref([
  // Technology & Equipment
  { name: 'TV', value: 'tv', svg: 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z' },
  { name: 'Wi-Fi', value: 'wifi', svg: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.65-4.35-1.65-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z' },
  { name: 'Printer', value: 'printer', svg: 'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h14V3z' },
  { name: 'Projector', value: 'projector', svg: 'M6 3C4.89 3 4 3.89 4 5V19C4 20.11 4.89 21 6 21H18C19.11 21 20 20.11 20 19V5C20 3.89 19.11 3 18 3H6M6 5H18V19H6V5M8 7V9H16V7H8M8 11V13H16V11H8M8 15V17H13V15H8Z' },
  { name: 'Scanner', value: 'scanner', svg: 'M6 6V18H18V6H6M8 8H16V16H8V8M4 4V20H20V22H4C2.9 22 2 21.1 2 20V4H4Z' },
  { name: 'Computer', value: 'computer', svg: 'M20 18C20.55 18 21 17.55 21 17V7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H0V20H24V18H20M4 7H20V17H4V7Z' },
  { name: 'Laptop', value: 'laptop', svg: 'M4 6H20V16H4M20 18H4C2.89 18 2 17.11 2 16V6C2 4.89 2.89 4 4 4H20C21.11 4 22 4.89 22 6V16C22 17.11 21.11 18 20 18Z' },
  { name: 'Monitor', value: 'monitor', svg: 'M21 16H3V4H21M21 2H3C1.89 2 1 2.89 1 4V16C1 17.11 1.89 18 3 18H10V20H8V22H16V20H14V18H21C22.11 18 23 17.11 23 16V4C23 2.89 22.11 2 21 2Z' },
  { name: 'Keyboard', value: 'keyboard', svg: 'M19 10H17V8H19M19 13H17V11H19M16 10H14V8H16M16 13H14V11H16M13 10H11V8H13M13 13H11V11H13M10 10H8V8H10M10 13H8V11H10M7 10H5V8H7M7 13H5V11H7M21 5H3C1.89 5 1 5.89 1 7V17C1 18.11 1.89 19 3 19H21C22.11 19 23 18.11 23 17V7C23 5.89 22.11 5 21 5Z' },
  { name: 'Mouse', value: 'mouse', svg: 'M11 1C8.79 1 7 2.79 7 5V9C7 11.21 8.79 13 11 13S15 11.21 15 9V5C15 2.79 13.21 1 11 1M11 3C12.1 3 13 3.9 13 5V9C13 10.1 12.1 11 11 11S9 10.1 9 9V5C9 3.9 9.9 3 11 3M11 14C7.69 14 5 16.69 5 20V22H17V20C17 16.69 14.31 14 11 14Z' },

  // Facilities & Services
  { name: 'A/C', value: 'ac', svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
  { name: 'Elevator', value: 'elevator', svg: 'M7 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L17 2H7M7 4H17V6H7V4M5 8H19V20H5V8M7 10V12H11V10H7M13 10V12H17V10H13M7 14V16H11V14H7M13 14V16H17V14H13Z' },
  { name: 'Restroom', value: 'restroom', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9Z' },
  { name: 'Kitchen', value: 'kitchen', svg: 'M8 5h2v3H8V5zm0 7h2v5H8v-5zm10-9.5V6c0 .55-.45 1-1 1h-2v9c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-9H4c-.55 0-1-.45-1-1V3.5c0-.55.45-1 1-1h16c.55 0 1 .45 1 1zM12 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z' },
  { name: 'Parking', value: 'parking', svg: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z' },
  { name: 'Security', value: 'security', svg: 'M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z' },
  { name: 'Cleaning', value: 'cleaning', svg: 'M16 11H14V9C14 7.9 13.1 7 12 7S10 7.9 10 9V11H8V9C8 6.79 9.79 5 12 5S16 6.79 16 9V11M12 13C13.66 13 15 11.66 15 10S13.66 7 12 7 9 8.34 9 10 10.34 12 12 12 13.66 12 15 13M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z' },
  { name: 'Maintenance', value: 'maintenance', svg: 'M22.7 19L13.6 9.9C14.5 7.6 16.7 6 19 6C21.8 6 24.2 7.8 24.9 10.3L22.7 19M19 13C17.3 13 16 14.3 16 16S17.3 19 19 19 22 17.7 22 16 20.7 14 19 14 17.3 14 16 15.3 16 16M10 3C8.3 3 7 4.3 7 6S8.3 9 10 9 13 7.7 13 6 11.7 4 10 4 8.3 4 7 5.3 7 6M2 21V19L9.6 11.9C9.2 11.7 8.8 11.5 8.4 11.3L1.1 19.1C.4 19.7 0 20.3 0 21H2Z' },
  { name: 'Reception', value: 'reception', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'Mail', value: 'mail', svg: 'M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4M20 6L12 13L4 6V6H20V6Z' },

  // Workspaces
  { name: 'Meeting Room', value: 'meeting-room', svg: 'M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6h-7zm-9 7h2v2H5v-2z' },
  { name: 'Desk', value: 'desk', svg: 'M20 7h-4V4c0-1.11-.89-2-2-2H10c-1.11 0-2 .89-2 2v3H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V9c0-1.11-.89-2-2-2zM10 4h4v3h-4V4zm0 7l-3 3 1.41 1.41L10 12.83V18H8v-5.17l1.59 1.59L12 14l-2-2z' },
  { name: 'Whiteboard', value: 'whiteboard', svg: 'M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19M7 7H17V9H7V7M7 11H17V13H7V11M7 15H13V17H7V15Z' },
  { name: 'Lockers', value: 'lockers', svg: 'M8 2H16V4H8V2M6 5V21H18V5H6M8 7H16V9H8V7M8 11H16V13H8V11M8 15H16V17H8V15M8 19H16V21H8V19Z' },
  { name: 'Cubicle', value: 'cubicle', svg: 'M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M7 7V17H17V7H7Z' },
  { name: 'Open Space', value: 'open-space', svg: 'M3 3V21H21V3H3M5 5H19V19H5V5M7 7H17V17H7V7Z' },
  { name: 'Private Office', value: 'private-office', svg: 'M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2M3 13H21V21H3V13Z' },
  { name: 'Conference Room', value: 'conference-room', svg: 'M17 17H7V14H17V17M22 21V7C22 5.89 21.11 5 20 5H4C2.89 5 2 5.89 2 7V21C2 22.11 2.89 23 4 23H20C21.11 23 22 22.11 22 21M20 7V19H4V7H20M17 10H7V12H17V10Z' },
  { name: 'Hot Desk', value: 'hot-desk', svg: 'M4 6H20V16H4M20 18H4C2.89 18 2 17.11 2 16V6C2 4.89 2.89 4 4 4H20C21.11 4 22 4.89 22 6V16C22 17.11 21.11 18 20 18Z' },

  // Food & Beverage
  { name: 'Catering', value: 'catering', svg: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 .89-5 2z' },
  { name: 'Coffee', value: 'coffee', svg: 'M2 21h18v-2H2v2zm0-4h18v-2H2v2zm0-4h18v-2H2v2zm0-4h18V7H2v2zM0 3v18h20V3H0z' },
  { name: 'Water', value: 'water', svg: 'M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z' },
  { name: 'Tea', value: 'tea', svg: 'M4 19h16v2H4v-2zm0-4h16v2H4v-2zm0-4h16v2H4v-2zm0-4h16v2H4v-2zM3 3v2h18V3H3z' },
  { name: 'Microwave', value: 'microwave', svg: 'M4 5H20C20.55 5 21 5.45 21 6V18C21 18.55 20.55 19 20 19H4C3.45 19 3 18.55 3 18V6C3 5.45 3.45 5 4 5M4 7V17H20V7H4M6 9H18V15H6V9M8 11V13H16V11H8Z' },
  { name: 'Refrigerator', value: 'refrigerator', svg: 'M7 2H17C18.11 2 19 2.9 19 4V20C19 21.11 18.11 22 17 22H7C5.9 22 5 21.11 5 20V4C5 2.9 5.9 2 7 2M7 4V8H17V4H7M7 10V12H17V10H7M7 14V16H17V14H7M7 18V20H17V18H7Z' },
  { name: 'Vending Machine', value: 'vending-machine', svg: 'M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M7 7H17V9H7V7M7 11H17V13H7V11M7 15H17V17H7V15M7 19H17V21H7V19Z' },

  // Communication
  { name: 'Phone', value: 'phone', svg: 'M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z' },
  { name: 'Video Call', value: 'video-call', svg: 'M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z' },
  { name: 'Intercom', value: 'intercom', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM19 11V10C19 6.13 15.87 3 12 3S5 6.13 5 10V11C4.45 11 4 11.45 4 12V21C4 21.55 4.45 22 5 22H19C19.55 22 20 21.55 20 21V12C20 11.45 19.55 11 19 11Z' },
  { name: 'Mailbox', value: 'mailbox', svg: 'M17 4H7C5.9 4 5 4.9 5 6V18C5 19.1 5.9 20 7 20H17C18.1 20 19 19.1 19 18V6C19 4.9 18.1 4 17 4M17 6L12 10.5L7 6V6H17V6Z' },

  // Health & Wellness
  { name: 'First Aid', value: 'first-aid', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'Medical', value: 'medical', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9Z' },
  { name: 'Gym', value: 'gym', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'Meditation', value: 'meditation', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },

  // Transportation
  { name: 'Bike Parking', value: 'bike-parking', svg: 'M19 7H18V6C18 5.45 17.55 5 17 5S16 5.45 16 6V7H8V6C8 5.45 7.55 5 7 5S6 5.45 6 6V7H5C3.89 7 3 7.89 3 9V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V9C21 7.89 20.11 7 19 7M5 9H19V19H5V9M7 11V13H17V11H7Z' },
  { name: 'Car Parking', value: 'car-parking', svg: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z' },
  { name: 'Shuttle', value: 'shuttle', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },

  // Miscellaneous Office
  { name: 'Copy Machine', value: 'copy-machine', svg: 'M16 6H8V8H16V6M16 10H8V12H16V10M16 14H8V16H16V14M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19Z' },
  { name: 'Shredder', value: 'shredder', svg: 'M6 3H18C19.11 3 20 3.89 20 5V19C20 20.11 19.11 21 18 21H6C4.89 21 4 20.11 4 19V5C4 3.89 4.89 3 6 3M6 5V19H18V5H6M8 7H16V9H8V7M8 11H16V13H8V11M8 15H16V17H8V15Z' },
  { name: 'Filing Cabinet', value: 'filing-cabinet', svg: 'M4 4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4H4M4 6H20V8H4V6M4 10H20V12H4V10M4 14H20V16H4V14M4 18H20V20H4V18Z' },
  { name: 'Storage', value: 'storage', svg: 'M4 4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4H4M4 6H20V8H4V6M4 10H20V12H4V10M4 14H20V16H4V14M4 18H20V20H4V18Z' },
  { name: 'Library', value: 'library', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'ATM', value: 'atm', svg: 'M8 3H16C17.11 3 18 3.89 18 5V19C18 20.11 17.11 21 16 21H8C6.89 21 6 20.11 6 19V5C6 3.89 6.89 3 8 3M8 5V19H16V5H8M10 7H14V9H10V7M10 11H14V13H10V11M10 15H14V17H10V15Z' },
  { name: 'Clock', value: 'clock', svg: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12S17.5 2 12 2M12 4C16.4 4 20 7.6 20 12S16.4 20 12 20 7.6 20 4 16.4 4 12S7.6 4 12 4M12 6V12L16 14V12H14V6H12Z' },
  { name: 'Calendar', value: 'calendar', svg: 'M19 19H5V8H19M16 1V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M17 12H12V17H17V12Z' },
  { name: 'Clock In/Out', value: 'clock-in-out', svg: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12S17.5 2 12 2M12 4C16.4 4 20 7.6 20 12S16.4 20 12 20 7.6 20 4 16.4 4 12S7.6 4 12 4M12 6V12L16 14V12H14V6H12M8 8H6V10H8V8M16 8H18V10H16V8M8 14H6V16H8V14M16 14H18V16H16V14Z' },
  { name: 'ID Card', value: 'id-card', svg: 'M4 4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4H4M4 6H20V8H4V6M4 10H14V12H4V10M4 14H20V16H4V14M16 10H20V12H16V10Z' },
  { name: 'Badge', value: 'badge', svg: 'M14 12C14 10.9 13.1 10 12 10S10 10.9 10 12 10.9 14 12 14 13.1 14 14 13.1 14 12M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'Visitor Badge', value: 'visitor-badge', svg: 'M14 12C14 10.9 13.1 10 12 10S10 10.9 10 12 10.9 14 12 14 13.1 14 14 13.1 14 12M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'Fire Extinguisher', value: 'fire-extinguisher', svg: 'M10 2C9.45 2 9 2.45 9 3V5H11V3C11 2.45 10.55 2 10 2M6 7V21C6 21.55 6.45 22 7 22H13C13.55 22 14 21.55 14 21V7C14 6.45 13.55 6 13 6H7C6.45 6 6 6.45 6 7M8 8H12V20H8V8Z' },
  { name: 'Emergency Exit', value: 'emergency-exit', svg: 'M16 3C16.55 3 17 3.45 17 4V20C17 20.55 16.55 21 16 21H8C7.45 21 7 20.55 7 20V4C7 3.45 7.45 3 8 3H16M16 5H8V19H16V5M12 7L14 9L12 11L10 9L12 7Z' },
  { name: 'CCTV', value: 'cctv', svg: 'M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z' },
  { name: 'Alarm', value: 'alarm', svg: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12S17.5 2 12 2M12 4C16.4 4 20 7.6 20 12S16.4 20 12 20 7.6 20 4 16.4 4 12S7.6 4 12 4M12 6V12L16 14V12H14V6H12M8 8H6V10H8V8M16 8H18V10H16V8M8 14H6V16H8V14M16 14H18V16H16V14Z' },
  { name: 'Power Outlet', value: 'power-outlet', svg: 'M8 7V9H16V7H8M8 11V13H16V11H8M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'USB Charging', value: 'usb-charging', svg: 'M8 7V9H16V7H8M8 11V13H16V11H8M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'Ethernet', value: 'ethernet', svg: 'M7 3H17C18.11 3 19 3.89 19 5V19C19 20.11 18.11 21 17 21H7C5.89 21 5 20.11 5 19V5C5 3.89 5.89 3 7 3M7 5V19H17V5H7M9 7H15V9H9V7M9 11H15V13H9V11M9 15H15V17H9V15Z' },
  { name: 'Router', value: 'router', svg: 'M4 1C2.89 1 2 1.89 2 3V5C2 6.11 2.89 7 4 7H20C21.11 7 22 6.11 22 5V3C22 1.89 21.11 1 20 1H4M4 3H20V5H4V3M4 9C2.89 9 2 9.89 2 11V13C2 14.11 2.89 15 4 15H20C21.11 15 22 14.11 22 13V11C22 9.89 21.11 9 20 9H4M4 11H20V13H4V11M4 17C2.89 17 2 17.89 2 19V21C2 22.11 2.89 23 4 23H20C21.11 23 22 22.11 22 21V19C22 17.89 21.11 17 20 17H4M4 19H20V21H4V19Z' },
  { name: 'Server Room', value: 'server-room', svg: 'M2 3H22C22.55 3 23 3.45 23 4V20C23 20.55 22.55 21 22 21H2C1.45 21 1 20.55 1 20V4C1 3.45 1.45 3 2 3M3 5V19H21V5H3M5 7H19V9H5V7M5 11H19V13H5V11M5 15H19V17H5V15Z' },
  { name: 'Data Center', value: 'data-center', svg: 'M2 3H22C22.55 3 23 3.45 23 4V20C23 20.55 22.55 21 22 21H2C1.45 21 1 20.55 1 20V4C1 3.45 1.45 3 2 3M3 5V19H21V5H3M5 7H19V9H5V7M5 11H19V13H5V11M5 15H19V17H5V15M7 7V17H9V7H7M11 7V17H13V7H11M15 7V17H17V7H15Z' },
  { name: 'Backup Power', value: 'backup-power', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'Solar Panel', value: 'solar-panel', svg: 'M4 2H20C20.55 2 21 2.45 21 3V21C21 21.55 20.55 22 20 22H4C3.45 22 3 21.55 3 21V3C3 2.45 3.45 2 4 2M4 4V20H20V4H4M6 6H18V8H6V6M6 10H18V12H6V10M6 14H18V16H6V14M6 18H18V20H6V18Z' },
  { name: 'Green Energy', value: 'green-energy', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'Recycling', value: 'recycling', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' },
  { name: 'Sustainability', value: 'sustainability', svg: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V19H19V21M19 17H5V15H19V17M19 13H5V11H19V13M13 9H5V7H13V9M12 14C16.42 14 20 15.79 20 18V19H4V18C4 15.79 7.58 14 12 14Z' }
])

// Get SVG string for selected icon
const getSelectedIconSVG = () => {
  const icon = availableIcons.value.find(icon => icon.value === form.value.selectedIcon)
  return icon ? icon.svg : ''
}

// Get name of selected icon
const getSelectedIconName = () => {
  const icon = availableIcons.value.find(icon => icon.value === form.value.selectedIcon)
  return icon ? icon.name : ''
}

// Select icon from dropdown
const selectIcon = (iconValue: string) => {
  form.value.selectedIcon = iconValue
  showIconDropdown.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showIconDropdown.value = false
  }
}

// Watch form changes
watch(form, () => {
  // Form data changed - no logging needed
}, { deep: true })

// Component mounted
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Component mounted successfully
})

// Component unmounted
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Methods
const saveFacility = async () => {
  // Show validation
  showValidation.value = true

  // Check if form is valid
  if (!form.value.name.trim() || !form.value.selectedIcon) {
    return
  }

  // Set loading state
  isLoading.value = true

  try {
    // Convert form data to API format
    const facilityData = {
      FacilityName: form.value.name.trim(),
      Icon: getSelectedIconSVG(),
      IsActive: form.value.status === 'active'
    }

    // Call the API to create the facility
    const response = await facilityApi.createFacility(facilityData)

    // Add delay to increase loading time (4 seconds)
    await new Promise(resolve => setTimeout(resolve, 4000))

    if (response.success) {
      // Show success modal
      successMessage.value = 'Facility created successfully!'
      showSuccessModal.value = true
    } else {
      // Show error modal
      successMessage.value = `Failed to create facility: ${response.message || 'Unknown error'}`
      showSuccessModal.value = true
    }
  } catch {
    successMessage.value = 'Network error while creating facility. Please try again.'
    showSuccessModal.value = true
  } finally {
    // Reset loading state
    isLoading.value = false
  }
}

// Success modal methods
const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/facilities')
}

const addAnotherFacility = () => {
  showSuccessModal.value = false
  // Reset form
  form.value.name = ''
  form.value.selectedIcon = ''
  form.value.status = 'active'
  showValidation.value = false
}
</script>
