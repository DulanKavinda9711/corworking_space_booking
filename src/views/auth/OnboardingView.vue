<template>
  <div class="h-screen flex bg-white">
    <!-- Left Section - Image -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-100 to-green-200 items-center justify-center">
      <img :src="loginImage" alt="Login" class="w-full h-full object-cover" />
    </div>

    <!-- Right Section - Password Change Form -->
    <div class="flex-1 lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div class="w-full max-w-md space-y-6">
        <div>
          <div class="mx-auto flex items-center justify-center mb-4">
            <img
              :src="logo"
              class="h-15 w-auto"
            />
          </div>
          
          <!-- <h2 class="mt-6 text-center text-xl font-extrabold text-gray-900">
            Welcome to Your Admin Dashboard
          </h2> -->
          <!-- <p class="mt-2 text-center text-sm text-gray-600">
            Let's set up a secure password for your account
          </p> -->

          <!-- Back to Login Button -->
          <!-- <div class="mt-4 text-center">
            <button
              @click="goToLogin"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Login
            </button>
          </div> -->
        </div>

        <!-- Set New Password -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Set Your New Password</h3>
          <form class="space-y-4" @submit.prevent="handlePasswordChange">
            <div class="space-y-7">
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div class="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    readonly
                    :value="currentUsername"
                    class="appearance-none relative block w-full px-3 py-3 border border-gray-300 bg-gray-50 text-gray-500 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm cursor-not-allowed"
                    placeholder="Your username"
                  />
                </div>
              </div>

              <div>
                <label for="old-password" class="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div class="mt-1 relative">
                  <input
                    id="old-password"
                    name="old-password"
                    :type="showOldPassword ? 'text' : 'password'"
                    required
                    v-model="passwordForm.oldPassword"
                    class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    @click="showOldPassword = !showOldPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="showOldPassword ? mdiEyeOff : mdiEye" />
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

        <!-- Logo below form -->
        <div class="mt-6 flex justify-center">
          <img :src="logo2" alt="Logo" class="h-10 w-auto" />
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <SuccessModal
      v-model="showSuccessModal"
      title="Password Updated Successfully!"
      message="Your password has been changed. Please login with your new password."
      :icon="'/assets/desk.png'"
      @close="closeSuccessModal"
    />

    <!-- Error Modal -->
    <ErrorModal
      v-model="showErrorModal"
      :message="error"
      @close="closeErrorModal"
    />
  </div>


</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/services/api'
import SuccessModal from '@/components/ui/SuccessModal.vue'
import ErrorModal from '@/components/ui/ErrorModal.vue'
import { mdiEye, mdiEyeOff, mdiCheckCircle, mdiAlert } from '@mdi/js'

const router = useRouter()
const authStore = useAuthStore()

// Prevent page refresh/close
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  // Show confirmation dialog
  event.preventDefault()
  event.returnValue = 'Are you sure you want to leave? Your progress will be lost.'
}

// Setup page protection
onMounted(() => {
  // Add beforeunload listener to handle page refresh/close
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const logo = '/assets/logo.png'
const loginImage = '/assets/loginImage.png'
const logo2 = '/assets/logo2.png'

// Form state for password change
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const passwordError = ref('')
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Modal states
const showSuccessModal = ref(false)
const showErrorModal = ref(false)

// Get current username from auth store or session storage
const currentUsername = computed(() => {
  // First try to get from auth store user data
  if (authStore.user?.username) {
    return authStore.user.username
  }
  // Fallback to session storage (used for 403 password change flow)
  if (sessionStorage.getItem('tempUsername')) {
    return sessionStorage.getItem('tempUsername')
  }
  // Final fallback
  return 'Unknown User'
})

// Password validation
const passwordLength = computed(() => passwordForm.value.newPassword.length >= 8)
const hasNumber = computed(() => /\d/.test(passwordForm.value.newPassword))
const hasSpecial = computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordForm.value.newPassword))
const isPasswordValid = computed(() => 
  passwordLength.value && 
  hasNumber.value && 
  hasSpecial.value && 
  passwordForm.value.newPassword === passwordForm.value.confirmPassword
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

// Handle password change
const handlePasswordChange = async () => {
  loading.value = true
  error.value = ''

  if (!isPasswordValid.value) {
    showErrorModal.value = true
    error.value = 'Please ensure your password meets all requirements'
    loading.value = false
    return
  }

  try {
    // Call API to change password
    const response = await authApi.changePassword({
      username: currentUsername.value,
      old_password: passwordForm.value.oldPassword,
      new_password: passwordForm.value.newPassword
    })

    if (response.success) {
      // Clear temporary sessionStorage flags used for 403 password change flow
      sessionStorage.removeItem('passwordChangeRequired')
      sessionStorage.removeItem('tempUsername')
      
      // Update auth store flags
      authStore.setUserPassword(passwordForm.value.newPassword)
      authStore.setPasswordReset('true')
      authStore.setOnboardingComplete('true')
      
      // Show success modal
      showSuccessModal.value = true
    } else {
      throw new Error(response.message || 'Failed to change password')
    }
  } catch (err: any) {
    error.value = 'Error changing password. Try again'
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}

// Modal handlers
const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Clear auth and redirect to login for user to log in with new password
  authStore.clearAuth()
  router.push('/login')
}

const closeErrorModal = () => {
  showErrorModal.value = false
}

// Go to login page
const goToLogin = () => {
  // Clear authentication state to allow navigation to login
  authStore.clearAuth()
  
  // Clear temporary session storage flags
  sessionStorage.removeItem('passwordChangeRequired')
  sessionStorage.removeItem('tempUsername')
  
  // Navigate to login
  router.push('/login')
}
</script>

<style scoped>
</style>
