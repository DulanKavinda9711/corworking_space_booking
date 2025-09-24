<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/locations" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Add New Location</h1>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeSuccessModal">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
          <div class="mt-3 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Success!</h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">Product Save Successfully</p>
            </div>
            <div class="items-center px-4 py-3">
              <button @click="closeSuccessModal"
                class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Modal -->
      <div v-if="showErrorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeErrorModal">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
          <div class="mt-3 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Error</h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">{{ errorMessage }}</p>
            </div>
            <div class="items-center px-4 py-3 flex space-x-3">
              <button @click="closeErrorModal"
                class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 flex-1">
                Close
              </button>
              <button @click="retryCreateLocation"
                class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 flex-1">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <form @submit.prevent="saveLocation" class="space-y-6">
          <!-- Single Card with All Information -->
          <div class="bg-white rounded-xl shadow-card overflow-hidden">
            <div class="p-8 space-y-16">
              
              <!-- Location Details Section -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiMapMarker" />
                  </svg>
                  Location Details
                </h2>
                
                <!-- Location Name Field -->
                <div class="mb-8">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Location Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.name"
                      :class="[
                        'appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md',
                        showValidation && !form.name.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : ''
                      ]"
                      placeholder="Enter location name" />
                    <div v-if="showValidation && !form.name.trim()" class="mt-1 text-sm text-red-600">
                      Location name is required
                    </div>
                  </div>
                </div>

                <!-- Address Section -->
                <div>
                  <h3 class="text-sm font-medium text-gray-800 mb-4">Address</h3>
                  
                  <!-- Address Form Fields -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Street <span class="text-red-500">*</span>
                      </label>
                      <input type="text" v-model="form.street"
                        :class="[
                          'appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md',
                          showValidation && !form.street.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : ''
                        ]"
                        placeholder="Enter street address" />
                      <div v-if="showValidation && !form.street.trim()" class="mt-1 text-sm text-red-600">
                        Street address is required
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Street 2
                      </label>
                      <input type="text" v-model="form.streetTwo"
                        class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md"
                        placeholder="Additional street address (optional)" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code <span class="text-red-500">*</span>
                      </label>
                      <input type="text" v-model="form.postalCode"
                        :class="[
                          'appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md',
                          showValidation && (!form.postalCode.trim() || !isValidPostalCode(form.postalCode)) ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : ''
                        ]"
                        placeholder="Enter 5-digit postal code"
                        maxlength="5"
                        @input="validatePostalCode" />
                      <div v-if="showValidation && !form.postalCode.trim()" class="mt-1 text-sm text-red-600">
                        Postal code is required
                      </div>
                      <div v-else-if="showValidation && !isValidPostalCode(form.postalCode)" class="mt-1 text-sm text-red-600">
                        Postal code must be exactly 5 digits
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Town <span class="text-red-500">*</span>
                      </label>
                      <input type="text" v-model="form.town"
                        :class="[
                          'appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md',
                          showValidation && !form.town.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : ''
                        ]"
                        placeholder="Enter town/city" />
                      <div v-if="showValidation && !form.town.trim()" class="mt-1 text-sm text-red-600">
                        Town is required
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        District <span class="text-red-500">*</span>
                      </label>
                      <div class="relative" ref="districtDropdownRef">
                        <div @click="toggleDropdown('district')" :class="[
                          'w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center',
                          dropdownStates.district ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300',
                          showValidation && !form.district.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : ''
                        ]">
                          <span class="text-gray-900 leading-5 h-5 flex items-center truncate">{{ form.district || 'Select District' }}</span>
                        </div>

                        <!-- Dropdown Options -->
                        <div v-if="dropdownStates.district" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div class="p-2">
                            <div v-for="district in districtOptions" :key="district.value" @click="selectDistrict(district.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                              {{ district.label }}
                            </div>
                          </div>
                        </div>

                        <!-- Dropdown Arrow -->
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg :class="[
                            'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                            dropdownStates.district ? 'transform rotate-180' : ''
                          ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div v-if="showValidation && !form.district.trim()" class="mt-1 text-sm text-red-600">
                        District is required
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Map URL <span class="text-red-500">*</span>
                      </label>
                      <input type="url" v-model="form.mapUrl"
                        :class="[
                          'appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md',
                          showValidation && !form.mapUrl.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : ''
                        ]"
                        placeholder="https://maps.google.com/..." />
                      <div v-if="showValidation && !form.mapUrl.trim()" class="mt-1 text-sm text-red-600">
                        Map URL is required
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Information Section -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiAccount" />
                  </svg>
                  Contact Information
                </h2>
                
                <!-- Contact Fields -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.contactName"
                      :class="[
                        'appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md',
                        showValidation && !form.contactName.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : ''
                      ]"
                      placeholder="Enter contact person name" />
                    <div v-if="showValidation && !form.contactName.trim()" class="mt-1 text-sm text-red-600">
                      Contact person name is required
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone Number <span class="text-red-500">*</span>
                    </label>
                    <input type="tel" v-model="form.contactPhone"
                      :class="[
                        'appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md',
                        showValidation && (!form.contactPhone.trim() || !isValidPhoneNumber(form.contactPhone)) ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : ''
                      ]"
                      placeholder="+94701234567"
                      maxlength="12"
                      @input="formatPhoneNumber" />
                    <div v-if="showValidation && !form.contactPhone.trim()" class="mt-1 text-sm text-red-600">
                      Contact phone number is required
                    </div>
                    <div v-else-if="showValidation && !isValidPhoneNumber(form.contactPhone)" class="mt-1 text-sm text-red-600">
                      Phone number must be in format +94701234567 (12 characters)
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input type="email" v-model="form.contactEmail"
                      :class="[
                        'appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md',
                        showValidation && !form.contactEmail.trim() ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : ''
                      ]"
                      placeholder="contact@company.com" />
                    <div v-if="showValidation && !form.contactEmail.trim()" class="mt-1 text-sm text-red-600">
                      Email is required
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons - Bottom Right -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <router-link to="/locations"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </router-link>
                <button type="submit"
                  :disabled="isLoading"
                  class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2">
                  <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ isLoading ? 'Creating...' : 'Create Location' }}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { locationApi } from '@/services/api'
import { mdiMapMarker, mdiAccount } from '@mdi/js'

const router = useRouter()

// Form data
const form = ref({
  name: '',
  street: '',
  streetTwo: '',
  postalCode: '',
  town: '',
  district: '',
  mapUrl: '',
  contactName: '',
  contactPhone: '',
  contactEmail: ''
})

// Validation state for custom error display
const showValidation = ref(false)

// Loading state
const isLoading = ref(false)

// Error message
const errorMessage = ref('')

// Modal states
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const successMessage = ref('')

// Form validation
const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.street.trim() !== '' &&
         form.value.postalCode.trim() !== '' &&
         isValidPostalCode(form.value.postalCode) &&
         form.value.town.trim() !== '' &&
         form.value.district.trim() !== '' &&
         form.value.mapUrl.trim() !== '' &&
         form.value.contactName.trim() !== '' &&
         form.value.contactPhone.trim() !== '' &&
         isValidPhoneNumber(form.value.contactPhone) &&
         form.value.contactEmail.trim() !== ''
})

// Validation methods
const isValidPostalCode = (postalCode: string) => {
  // Must be exactly 5 digits
  const postalCodeRegex = /^\d{5}$/
  return postalCodeRegex.test(postalCode.trim())
}

const isValidPhoneNumber = (phoneNumber: string) => {
  // Must be exactly +94701234567 format (12 characters)
  const phoneRegex = /^\+947\d{8}$/
  return phoneRegex.test(phoneNumber.trim())
}

const validatePostalCode = (event: Event) => {
  const target = event.target as HTMLInputElement
  // Only allow digits and limit to 5 characters
  target.value = target.value.replace(/\D/g, '').substring(0, 5)
  form.value.postalCode = target.value
}

const formatPhoneNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '') // Remove non-digits

  // If user starts typing with 0, remove it (Sri Lankan numbers don't start with 0 after +94)
  if (value.startsWith('0')) {
    value = value.substring(1)
  }

  // Handle different scenarios based on input length
  if (value.length === 0) {
    // Empty field, do nothing
    target.value = ''
    form.value.contactPhone = ''
    return
  } else if (value.length === 1) {
    // Single digit, prepend 94
    value = '94' + value
  } else if (value.length === 2) {
    // Two digits, check if it's 94 or prepend
    if (value !== '94') {
      value = '94' + value
    }
  } else if (value.length > 2 && !value.startsWith('94')) {
    // More than 2 digits but doesn't start with 94, prepend it
    value = '94' + value
  }

  // Format as +94701234567 (12 characters total)
  if (value.length >= 2) {
    value = '+' + value.substring(0, 11) // +94 + 8 digits = 12 characters
  }

  target.value = value
  form.value.contactPhone = value
}

// Methods
const saveLocation = async () => {
  showValidation.value = true
  errorMessage.value = ''

  if (!isFormValid.value) {
    return
  }

  isLoading.value = true

  try {
    // Build full address from individual fields

    const response = await locationApi.createLocation({
      Name: form.value.name,
      Street: form.value.street,
      StreetTwo: form.value.streetTwo,
      PostalCode: form.value.postalCode,
      Town: form.value.town,
      Url: form.value.mapUrl,
      District: form.value.district,
      ContactName: form.value.contactName,
      ContactEmail: form.value.contactEmail,
      ContactPhone: form.value.contactPhone
    })

    if (response.success) {
      // Show success modal
      successMessage.value = response.message || 'Location created successfully!'
      showSuccessModal.value = true
    } else {
      // Show error modal
      errorMessage.value = response.message || 'Failed to create location'
      showErrorModal.value = true
    }
  } catch (error) {
    console.error('Error creating location:', error)
    errorMessage.value = 'An unexpected error occurred while creating the location'
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

// Modal methods
const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Navigate back to locations list after closing success modal
  router.push('/locations')
}

const closeErrorModal = () => {
  showErrorModal.value = false
}

const retryCreateLocation = () => {
  showErrorModal.value = false
  saveLocation()
}

// Dropdown states
const dropdownStates = ref({
  district: false
})

// Dropdown refs
const districtDropdownRef = ref<HTMLElement | null>(null)

// District options
const districtOptions = [
  { value: 'Ampara', label: 'Ampara' },
  { value: 'Anuradhapura', label: 'Anuradhapura' },
  { value: 'Badulla', label: 'Badulla' },
  { value: 'Batticaloa', label: 'Batticaloa' },
  { value: 'Colombo', label: 'Colombo' },
  { value: 'Galle', label: 'Galle' },
  { value: 'Gampaha', label: 'Gampaha' },
  { value: 'Hambantota', label: 'Hambantota' },
  { value: 'Jaffna', label: 'Jaffna' },
  { value: 'Kalutara', label: 'Kalutara' },
  { value: 'Kandy', label: 'Kandy' },
  { value: 'Kegalle', label: 'Kegalle' },
  { value: 'Kilinochchi', label: 'Kilinochchi' },
  { value: 'Kurunegala', label: 'Kurunegala' },
  { value: 'Mannar', label: 'Mannar' },
  { value: 'Matale', label: 'Matale' },
  { value: 'Matara', label: 'Matara' },
  { value: 'Monaragala', label: 'Monaragala' },
  { value: 'Mullaitivu', label: 'Mullaitivu' },
  { value: 'Nuwara Eliya', label: 'Nuwara Eliya' },
  { value: 'Polonnaruwa', label: 'Polonnaruwa' },
  { value: 'Puttalam', label: 'Puttalam' },
  { value: 'Ratnapura', label: 'Ratnapura' },
  { value: 'Trincomalee', label: 'Trincomalee' },
  { value: 'Vavuniya', label: 'Vavuniya' }
]

// Dropdown methods
const toggleDropdown = (dropdown: string) => {
  if (dropdown === 'district') {
    dropdownStates.value.district = !dropdownStates.value.district
    if (dropdownStates.value.district) {
      // Add click outside listener when dropdown opens
      document.addEventListener('click', handleClickOutside)
    } else {
      // Remove click outside listener when dropdown closes
      document.removeEventListener('click', handleClickOutside)
    }
  }
}

const selectDistrict = (value: string) => {
  form.value.district = value
  dropdownStates.value.district = false
  document.removeEventListener('click', handleClickOutside)
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (districtDropdownRef.value && !districtDropdownRef.value.contains(target)) {
    dropdownStates.value.district = false
    document.removeEventListener('click', handleClickOutside)
  }
}

// Cleanup event listener on component unmount
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
