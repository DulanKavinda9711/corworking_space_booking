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
        <h2 class="mt-6 text-center text-xl font-extrabold text-gray-900">
          Welcome to Your Admin Dashboard
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ currentStep === 1 ? 'First, let\'s set up a secure password' : 'Setup complete! You can now access your dashboard' }}
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
        </div>
        <div class="flex justify-center mt-4 space-x-16 text-sm text-gray-600">
          <span :class="[currentStep >= 1 ? 'text-green-600 font-medium' : '']">Password</span>
          <span :class="[currentStep >= 2 ? 'text-green-600 font-medium' : '']">Complete</span>
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
              {{ loading ? 'Updating Password...' : 'Complete Onboarding' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Step 2: Success -->
      <div v-if="currentStep === 2" class="bg-white rounded-xl shadow-lg p-8 text-center">
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
import { useAuthStore } from '@/stores/auth'
import { mdiEye, mdiEyeOff, mdiCheckCircle, mdiAlert } from '@mdi/js'

const router = useRouter()
const authStore = useAuthStore()

const logo = '/assets/logo.png'

// Form state for password change
const passwordForm = ref({
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
    authStore.setUserPassword(passwordForm.value.newPassword)
    authStore.setPasswordReset('true')
    authStore.setOnboardingComplete('true')
    
    // Move to success step
    currentStep.value = 2
  } catch {
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

<style scoped>
</style>
