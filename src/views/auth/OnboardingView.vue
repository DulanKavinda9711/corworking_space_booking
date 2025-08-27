<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center">
          <svg class="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiOfficeBuilding" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Account Setup
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Set a new password to continue
        </p>
      </div>
      
      <div class="mt-8">
        <div class="flex items-center justify-center">
          <div class="flex items-center justify-center w-10 h-10 rounded-full" 
              :class="[currentStep >= 1 ? 'bg-primary-600' : 'bg-gray-300']">
            <span class="text-white font-medium">1</span>
          </div>
          <div class="w-16 h-1" :class="[currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300']"></div>
          <div class="flex items-center justify-center w-10 h-10 rounded-full" 
              :class="[currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300']">
            <span class="text-white font-medium">2</span>
          </div>
          <div class="w-16 h-1" :class="[currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-300']"></div>
          <div class="flex items-center justify-center w-10 h-10 rounded-full" 
              :class="[currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-300']">
            <span class="text-white font-medium">3</span>
          </div>
        </div>
      </div>

      <!-- Step 1: Password Reset -->
      <div v-if="currentStep === 1">
        <form class="mt-8 space-y-6" @submit.prevent="handleStepOne">
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
                  v-model="form.currentPassword"
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your current password"
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
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Verifying...' : 'Continue' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Step 2: Set New Password -->
      <div v-if="currentStep === 2">
        <form class="mt-8 space-y-6" @submit.prevent="handleStepTwo">
          <div class="space-y-4">
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
                  v-model="form.newPassword"
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
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
              <div class="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long and include numbers and special characters.
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
                  v-model="form.confirmPassword"
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
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
            </div>
            
            <div v-if="passwordError" class="mt-2 text-sm text-red-600">
              {{ passwordError }}
            </div>

            <div class="mt-4">
              <h4 class="text-sm font-medium text-gray-700">Password Requirements:</h4>
              <ul class="mt-1 text-xs text-gray-600 space-y-1">
                <li class="flex items-center" :class="{ 'text-green-600': passwordLength }">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="passwordLength ? mdiCheckCircle : mdiCircleOutline" />
                  </svg>
                  At least 8 characters long
                </li>
                <li class="flex items-center" :class="{ 'text-green-600': hasNumber }">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="hasNumber ? mdiCheckCircle : mdiCircleOutline" />
                  </svg>
                  Contains at least one number
                </li>
                <li class="flex items-center" :class="{ 'text-green-600': hasSpecial }">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="hasSpecial ? mdiCheckCircle : mdiCircleOutline" />
                  </svg>
                  Contains at least one special character
                </li>
              </ul>
            </div>
          </div>

          <div class="flex space-x-4">
            <button
              type="button"
              @click="currentStep = 1"
              class="group relative w-1/3 flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              :disabled="loading || !isPasswordValid"
              class="group relative w-2/3 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Updating Password...' : 'Set New Password' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Step 3: Confirmation -->
      <div v-if="currentStep === 3" class="mt-8 space-y-6">
        <div class="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg border border-green-200">
          <svg class="h-12 w-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiCheckCircle" />
          </svg>
          <h3 class="mt-2 text-xl font-medium text-green-800">Password Changed Successfully!</h3>
          <p class="mt-2 text-center text-sm text-green-600">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
        </div>

        <div>
          <button
            type="button"
            @click="goToDashboard"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiAlert" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { mdiOfficeBuilding, mdiEye, mdiEyeOff, mdiCheckCircle, mdiCircleOutline, mdiAlert } from '@mdi/js'

const router = useRouter()

// Form state
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const currentStep = ref(1)
const passwordError = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Password validation
const passwordLength = computed(() => form.value.newPassword.length >= 8)
const hasNumber = computed(() => /\d/.test(form.value.newPassword))
const hasSpecial = computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(form.value.newPassword))
const isPasswordValid = computed(() => 
  passwordLength.value && 
  hasNumber.value && 
  hasSpecial.value && 
  form.value.newPassword === form.value.confirmPassword
)

watch(() => form.value.newPassword, () => {
  if (form.value.confirmPassword && form.value.newPassword !== form.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
  } else {
    passwordError.value = ''
  }
})

watch(() => form.value.confirmPassword, () => {
  if (form.value.confirmPassword && form.value.newPassword !== form.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
  } else {
    passwordError.value = ''
  }
})

// Handle step 1 - verify current password
const handleStepOne = async () => {
  loading.value = true
  error.value = ''

  try {
    // Simulate API call to verify current password
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For demo purposes, we'll accept any non-empty password
    if (form.value.currentPassword) {
      currentStep.value = 2
    } else {
      error.value = 'Please enter your current password'
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// Handle step 2 - set new password
const handleStepTwo = async () => {
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

    // Store flag to indicate password has been reset
    localStorage.setItem('password-reset', 'true')
    
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
