<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBackToDetail" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Edit Facility</h1>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <form @submit.prevent="updateFacility" class="space-y-6">
          <!-- Single Card with All Information -->
          <div class="bg-white rounded-xl shadow-card overflow-hidden">
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
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Facility Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.name" required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter facility name" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select v-model="form.status"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Facility Icon <span class="text-red-500">*</span>
                    </label>
                    <!-- Custom Icon Dropdown -->
                    <div class="relative">
                      <button
                        type="button"
                        @click="showIconDropdown = !showIconDropdown"
                        :class="[
                          'w-full rounded-lg px-4 py-3 text-left focus:ring-2 transition-colors flex items-center justify-between',
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
                              class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer border border-gray-200 transition-colors"
                              :class="form.selectedIcon === icon.value ? 'bg-blue-100 border-blue-400' : ''"
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
                    <p v-if="showValidation && !form.selectedIcon" class="mt-1 text-sm text-red-600">
                      Facility icon is required
                    </p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons - Bottom Right -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button type="button" @click="goBackToDetail"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" :disabled="!isFormValid"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Update Facility</span>
                </button>
              </div>
            </div>
          </div>
        </form>
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
              <p class="text-gray-600 mb-6">{{ modalMessage || 'Facility updated successfully!' }}</p>
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
              <p class="text-gray-600 mb-6">{{ modalMessage || 'An error occurred while updating the facility.' }}</p>
              <button
                @click="closeErrorModal"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { facilityApi } from '@/services/api'
import { mdiCog } from '@mdi/js'

const router = useRouter()
const route = useRoute()

// Form data
const form = ref({
  id: '',
  name: '',
  status: 'active' as 'active' | 'inactive',
  selectedIcon: ''
})

// Icon dropdown state
const showIconDropdown = ref(false)
const showValidation = ref(false)
// Modals
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const modalMessage = ref('')

// Available icons data
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
  { name: 'Reception', value: 'reception', svg: 'M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2M3 13H21V21H3V13Z' },
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
])

// Form validation
const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && form.value.selectedIcon !== ''
})

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

// Get icon value from SVG string
const getIconValueFromSVG = (svgString: string) => {
  const icon = availableIcons.value.find(icon => icon.svg === svgString)
  return icon ? icon.value : ''
}

// Select icon from dropdown
const selectIcon = (iconValue: string) => {
  form.value.selectedIcon = iconValue
  showIconDropdown.value = false
  showValidation.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showIconDropdown.value = false
  }
}

// Load facility data on component mount
onMounted(async () => {
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)

  const facilityId = route.params.id as string
  if (facilityId) {
    try {
      // Fetch facility data from API
      const response = await facilityApi.getAllFacilities()
      if (response.success && response.data) {
        const facility = response.data.find(f => f.id === facilityId)
        if (facility) {
          form.value = {
            id: facility.id,
            name: facility.name,
            status: facility.status as 'active' | 'inactive',
            selectedIcon: getIconValueFromSVG(facility.Icon || '') // Map stored SVG back to icon value
          }
        } else {
          alert('Facility not found')
          router.push('/facilities')
        }
      }
    } catch (error) {
      console.error('Error loading facility:', error)
      alert('Error loading facility data')
      router.push('/facilities')
    }
  }
})

// Methods
const goBackToDetail = () => {
  router.push(`/facilities/${form.value.id}`)
}

const updateFacility = async () => {
  if (!isFormValid.value) {
    showValidation.value = true
    return
  }

  try {
    const facilityData = {
      FacilityName: form.value.name.trim(),
      Icon: getSelectedIconSVG(),
      IsActive: form.value.status === 'active'
    }

    const response = await facilityApi.updateFacility(form.value.id, facilityData)

    if (response.success) {
      modalMessage.value = response.message || 'Facility updated successfully!'
      showSuccessModal.value = true
    } else {
      modalMessage.value = response.message || 'Failed to update facility'
      showErrorModal.value = true
    }
  } catch (error) {
    console.error('Error updating facility:', error)
    modalMessage.value = 'Network error while updating facility. Please try again.'
    showErrorModal.value = true
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Redirect to facility view
  router.push('/facilities')
}

const closeErrorModal = () => {
  showErrorModal.value = false
  // Redirect to facility view page on OK click (same behavior as success modal)
  router.push('/facilities')
}

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
