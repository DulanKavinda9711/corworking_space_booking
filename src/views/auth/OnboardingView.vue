<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl w-full space-y-8">
      <div>
        <div class="mx-auto flex items-center justify-center mt-4 mb-2">
          <img 
            :src="logo" 
            class="h-15 w-80 "
          />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Your Admin Dashboard
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ currentStep === 1 ? 'First, let\'s set up a secure password' : 'Now, let\'s set up your company details' }}
        </p>
      </div>
      
      <div class="mt-8">
        <div class="flex items-center justify-center">
          <div class="flex items-center justify-center w-10 h-10 rounded-full" 
              :class="[currentStep >= 1 ? 'bg-green-600' : 'bg-gray-300']">
            <span class="text-white font-medium">1</span>
          </div>
          <div class="w-16 h-1" :class="[currentStep >= 2 ? 'bg-green-600' : 'bg-gray-300']"></div>
          <div class="flex items-center justify-center w-10 h-10 rounded-full" 
              :class="[currentStep >= 2 ? 'bg-green-600' : 'bg-gray-300']">
            <span class="text-white font-medium">2</span>
          </div>
          <div class="w-16 h-1" :class="[currentStep >= 3 ? 'bg-green-600' : 'bg-gray-300']"></div>
          <div class="flex items-center justify-center w-10 h-10 rounded-full" 
              :class="[currentStep >= 3 ? 'bg-green-600' : 'bg-gray-300']">
            <span class="text-white font-medium">3</span>
          </div>
        </div>
        <div class="flex justify-center mt-4 space-x-16 text-sm text-gray-600">
          <span :class="[currentStep >= 1 ? 'text-green-600 font-medium' : '']">Password</span>
          <span :class="[currentStep >= 2 ? 'text-green-600 font-medium' : '']">Company Setup</span>
          <span :class="[currentStep >= 3 ? 'text-green-600 font-medium' : '']">Complete</span>
        </div>
      </div>

      <!-- Step 1: Set New Password -->
      <div v-if="currentStep === 1" class="bg-white rounded-xl shadow-lg p-8">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Set Your New Password</h3>
        <form class="space-y-6" @submit.prevent="handlePasswordChange">
          <div class="space-y-4">
            <div>
              <label for="current-password" class="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div class="mt-1 relative">
                <input
                  id="current-password"
                  name="current-password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  required
                  v-model="passwordForm.currentPassword"
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your current password (admin123)"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="showCurrentPassword ? mdiEyeOff : mdiEye" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label for="new-password" class="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div class="mt-1 relative">
                <input
                  id="new-password"
                  name="new-password"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  v-model="passwordForm.newPassword"
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="showNewPassword ? mdiEyeOff : mdiEye" />
                  </svg>
                </button>
              </div>
              <!-- Password requirements -->
              <div class="mt-2 space-y-1">
                <div class="flex items-center text-xs" :class="passwordLength ? 'text-green-600' : 'text-gray-400'">
                  <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  At least 8 characters long
                </div>
                <div class="flex items-center text-xs" :class="hasNumber ? 'text-green-600' : 'text-gray-400'">
                  <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Contains at least one number
                </div>
                <div class="flex items-center text-xs" :class="hasSpecial ? 'text-green-600' : 'text-gray-400'">
                  <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Contains special characters
                </div>
              </div>
            </div>
            
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div class="mt-1 relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  v-model="passwordForm.confirmPassword"
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="showConfirmPassword ? mdiEyeOff : mdiEye" />
                  </svg>
                </button>
              </div>
              <div v-if="passwordError" class="mt-1 text-sm text-red-600">
                {{ passwordError }}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading || !isPasswordValid"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Updating Password...' : 'Continue to Company Setup' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Step 2: Company Setup -->
      <div v-if="currentStep === 2" class="bg-white rounded-xl shadow-lg p-8">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Company Setup</h3>
        <form class="space-y-6" @submit.prevent="handleCompanySetup">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Company Information -->
            <div class="md:col-span-2">
              <h4 class="text-md font-medium text-gray-900 mb-4">Company Information</h4>
            </div>
            
            <div>
              <label for="company-name" class="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                id="company-name"
                name="company-name"
                type="text"
                required
                v-model="companyForm.companyName"
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label for="company-address" class="block text-sm font-medium text-gray-700">
                Company Address *
              </label>
              <input
                id="company-address"
                name="company-address"
                type="text"
                required
                v-model="companyForm.companyAddress"
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter company address"
              />
            </div>

            

            <div>
              <label for="company-email" class="block text-sm font-medium text-gray-700">
                Company Email *
              </label>
              <input
                id="company-email"
                name="company-email"
                type="email"
                required
                v-model="companyForm.companyEmail"
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter company email"
              />
            </div>

            <!-- Contact Person Information -->
            <div class="md:col-span-2 mt-6">
              <h4 class="text-md font-medium text-gray-900 mb-4">Contact Person Details</h4>
            </div>

            <div>
              <label for="contact-name" class="block text-sm font-medium text-gray-700">
                Contact Person Name *
              </label>
              <input
                id="contact-name"
                name="contact-name"
                type="text"
                required
                v-model="companyForm.contactName"
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label for="contact-email" class="block text-sm font-medium text-gray-700">
                Contact Person Email *
              </label>
              <input
                id="contact-email"
                name="contact-email"
                type="email"
                required
                v-model="companyForm.contactEmail"
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter contact person email"
              />
            </div>

            <div>
              <label for="contact-mobile" class="block text-sm font-medium text-gray-700">
                Contact Person Mobile *
              </label>
              <input
                id="contact-mobile"
                name="contact-mobile"
                type="tel"
                required
                v-model="companyForm.contactMobile"
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter contact person mobile"
              />
            </div>

            <!-- Operating Hours -->
            <div class="md:col-span-2 mt-6">
              <h4 class="text-md font-medium text-gray-900 mb-4">Operating Hours & Days</h4>
              
              <!-- Days Selection -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Operating Days *
                </label>
                <div class="grid grid-cols-4 gap-3 md:grid-cols-7">
                  <div v-for="day in daysOfWeek" :key="day" class="flex items-center">
                    <input
                      :id="`day-${day.toLowerCase()}`"
                      :name="`day-${day.toLowerCase()}`"
                      type="checkbox"
                      :value="day"
                      v-model="companyForm.operatingDays"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label :for="`day-${day.toLowerCase()}`" class="ml-2 text-sm text-gray-700">
                      {{ day.slice(0, 3) }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Hours Selection -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="opening-time" class="block text-sm font-medium text-gray-700">
                    Opening Time *
                  </label>
                  <input
                    id="opening-time"
                    name="opening-time"
                    type="time"
                    required
                    v-model="companyForm.openingTime"
                    class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  />
                </div>

                <div>
                  <label for="closing-time" class="block text-sm font-medium text-gray-700">
                    Closing Time *
                  </label>
                  <input
                    id="closing-time"
                    name="closing-time"
                    type="time"
                    required
                    v-model="companyForm.closingTime"
                    class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between pt-6">
            <button
              type="button"
              @click="currentStep = 1"
              class="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Back to Password
            </button>
            
            <button
              type="submit"
              :disabled="loading || !isCompanyFormValid"
              class="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="mr-2">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Setting up...' : 'Complete Setup' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Step 3: Success -->
      <div v-if="currentStep === 3" class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg class="h-10 w-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiCheckCircle" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Setup Complete!</h3>
        <p class="text-gray-600 mb-8">
          Your account has been successfully set up. You can now access your admin dashboard.
        </p>
        <button
          @click="goToDashboard"
          class="px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiAlert" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Setup Error
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { mdiEye, mdiEyeOff, mdiCheckCircle, mdiAlert, mdiCircleOutline } from '@mdi/js'

const router = useRouter()

const logo = '/assets/logo.png'

// Form state for password change
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Form state for company setup
const companyForm = ref({
  companyName: '',
  companyAddress: '',
  companyEmail: '',
  contactName: '',
  contactEmail: '',
  contactMobile: '',
  operatingDays: [] as string[],
  openingTime: '09:00',
  closingTime: '17:00'
})

// Days of the week
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const loading = ref(false)
const error = ref('')
const currentStep = ref(1)
const passwordError = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Password validation
const passwordLength = computed(() => passwordForm.value.newPassword.length >= 8)
const hasNumber = computed(() => /\d/.test(passwordForm.value.newPassword))
const hasSpecial = computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordForm.value.newPassword))
const isPasswordValid = computed(() => 
  passwordLength.value && 
  hasNumber.value && 
  hasSpecial.value && 
  passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
  passwordForm.value.currentPassword === 'admin123'
)

// Company form validation
const isCompanyFormValid = computed(() => {
  return companyForm.value.companyName.trim() &&
         companyForm.value.companyAddress.trim() &&
         companyForm.value.companyEmail.trim() &&
         companyForm.value.contactName.trim() &&
         companyForm.value.contactEmail.trim() &&
         companyForm.value.contactMobile.trim() &&
         companyForm.value.operatingDays.length > 0 &&
         companyForm.value.openingTime &&
         companyForm.value.closingTime
})

// Password validation watchers
watch(() => passwordForm.value.newPassword, () => {
  if (passwordForm.value.confirmPassword && passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
  } else {
    passwordError.value = ''
  }
})

watch(() => passwordForm.value.confirmPassword, () => {
  if (passwordForm.value.confirmPassword && passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
  } else {
    passwordError.value = ''
  }
})

// Handle password change (Step 1)
const handlePasswordChange = async () => {
  loading.value = true
  error.value = ''

  if (!isPasswordValid.value) {
    error.value = 'Please ensure your password meets all requirements'
    loading.value = false
    return
  }

  try {
    // Simulate API call to change password
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Store the new password securely (in a real app, this would be hashed and stored server-side)
    localStorage.setItem('user-password', passwordForm.value.newPassword)
    localStorage.setItem('password-reset', 'true')
    
    // Move to company setup
    currentStep.value = 2
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// Handle company setup (Step 2)
const handleCompanySetup = async () => {
  loading.value = true
  error.value = ''

  if (!isCompanyFormValid.value) {
    error.value = 'Please fill in all required fields'
    loading.value = false
    return
  }

  try {
    // Simulate API call to save company setup
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Store company setup data (in a real app, this would be sent to the backend)
    localStorage.setItem('company-setup', JSON.stringify(companyForm.value))
    localStorage.setItem('onboarding-complete', 'true')
    
    // Move to success step
    currentStep.value = 3
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// Go to dashboard
const goToDashboard = () => {
  router.push('/dashboard')
}
</script>
