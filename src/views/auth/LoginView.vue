<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div>
          <div class="mx-auto flex items-center justify-center mt-4 mb-6">
            <img 
              :src="logo" 
              class="h-15 w-max "
            />
          </div>
          
          <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h2>
          
          <p class="mt-2 text-center text-sm text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-5">
            <div>
              <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div class="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  v-model="form.username"
                  class="block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your username"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="h-5 w-5 text-gray-400" fill="gray" viewBox="0 0 24 24">
                    <path :d="mdiAccount" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  v-model="form.password"
                  class="block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                >
                  <svg class="h-5 w-5" fill="gray" viewBox="0 0 24 24">
                    <path :d="showPassword ? mdiEyeOff : mdiEye" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="form.remember"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 font-medium">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <button
                type="button"
                @click="showForgotPassword = true"
                class="font-semibold text-green-600 hover:text-green-500 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <!-- Error message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiAlert" />
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-semibold text-red-800">
                Sign in failed
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Reset Password</h3>
            <button
              @click="closeForgotPasswordModal"
              class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="!forgotPasswordSuccess">
            <p class="text-sm text-gray-600 mb-6 leading-relaxed">
              Enter your admin email address and we'll send you instructions to reset your password.
            </p>
            
            <form @submit.prevent="handleForgotPassword" class="space-y-4">
              <div>
                <label for="forgot-email" class="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Email
                </label>
                <input
                  id="forgot-email"
                  name="forgot-email"
                  type="email"
                  required
                  v-model="forgotPasswordForm.email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                  placeholder="Enter your email address"
                />
              </div>

              <div v-if="forgotPasswordError" class="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p class="text-sm text-red-600">{{ forgotPasswordError }}</p>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeForgotPasswordModal"
                  class="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="forgotPasswordLoading"
                  class="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {{ forgotPasswordLoading ? 'Sending...' : 'Send Reset Instructions' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Success message -->
          <div v-else class="text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg class="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCheckCircle" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Reset Instructions Sent!</h3>
            <p class="text-sm text-gray-600 mb-4 leading-relaxed">
              We've sent password reset instructions to {{ forgotPasswordForm.email }}
            </p>
            <button
              @click="showPasswordReset"
              class="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Enter Reset Code
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Reset Modal -->
    <div v-if="showResetForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Reset Password</h3>
            <button
              @click="closeResetForm"
              class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handlePasswordReset" class="space-y-4">
            <div>
              <label for="reset-code" class="block text-sm font-semibold text-gray-700 mb-2">
                Reset Code
              </label>
              <input
                id="reset-code"
                name="reset-code"
                type="text"
                required
                v-model="resetForm.code"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter reset code (RESET123)"
              />
            </div>

            <div>
              <label for="reset-new-password" class="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="reset-new-password"
                name="reset-new-password"
                type="password"
                required
                v-model="resetForm.newPassword"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label for="reset-confirm-password" class="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="reset-confirm-password"
                name="reset-confirm-password"
                type="password"
                required
                v-model="resetForm.confirmPassword"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Confirm new password"
              />
            </div>

            <div v-if="resetError" class="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p class="text-sm text-red-600">{{ resetError }}</p>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeResetForm"
                class="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="resetLoading"
                class="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {{ resetLoading ? 'Resetting...' : 'Reset Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiEye, mdiEyeOff, mdiAlert, mdiCheckCircle } from '@mdi/js'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/services/api'
import { jwtDecode } from 'jwt-decode'

const logo = '/assets/logo.png'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = ref({
  username: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const showForgotPassword = ref(false)
const forgotPasswordForm = ref({
  email: 'admin@coworkingspace.com'
})
const forgotPasswordLoading = ref(false)
const forgotPasswordError = ref('')
const forgotPasswordSuccess = ref(false)
const showResetForm = ref(false)
const resetForm = ref({
  code: '',
  newPassword: '',
  confirmPassword: ''
})
const resetLoading = ref(false)
const resetError = ref('')

// Handle login
const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    // Check if this is admin or superadmin login
    if (form.value.username === 'admin' || form.value.username === 'superadmin') {
      // Call the real admin API
      const response = await authApi.adminLogin({
        username: form.value.username,
        password: form.value.password
      })

      if (response.success && response.data) {
        const { token } = response.data

        // Decode JWT token to get user information
        const decodedToken: any = jwtDecode(token)
        
        // Extract user info from token claims
        const admin_id = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '1'
        const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || form.value.username
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Admin'

        // Ensure superadmin role is correctly set
        const finalRole = form.value.username === 'superadmin' ? 'SuperAdmin' : role

        // Store token and user data using auth store
        authStore.setAuthToken(token)
        authStore.setUser({
          id: admin_id.toString(),
          username: username,
          email: `${username}@coworkingspace.com`,
          name: finalRole === 'SuperAdmin' ? 'Super Administrator' : 'Administrator',
          role: finalRole === 'SuperAdmin' ? 'super-admin' : 'admin'
        })

        // For SuperAdmin, ensure onboarding flags are set to bypass checks
        if (finalRole === 'SuperAdmin') {
          authStore.setOnboardingComplete('true')
          authStore.setPasswordReset('true')
          authStore.setDemoPasswordDisabled('true')
        }

        // Force a small delay to ensure persistence is complete before routing
        await new Promise(resolve => setTimeout(resolve, 10))

        // Route based on role
        router.push('/dashboard')
        return
      } else {
        throw new Error(response.message || 'Login failed')
      }
    }

    // Regular demo login logic for other users
    // Check if onboarding is complete and password has been changed
    const onboardingComplete = authStore.onboardingComplete
    const passwordReset = authStore.passwordReset
    const storedPassword = authStore.userPassword

    let isValidLogin = false

    if (form.value.username === 'admin') {
      // If onboarding is complete and password has been reset, only allow new password
      if (onboardingComplete === 'true' && passwordReset === 'true' && storedPassword) {
        // Only allow login with the new password
        isValidLogin = form.value.password === storedPassword
        if (!isValidLogin && form.value.password === 'admin123') {
          throw new Error('Default password is no longer valid. Please use your updated password.')
        }
      } else {
        // First time login - allow demo password
        isValidLogin = form.value.password === 'admin123'
      }
    }

    if (isValidLogin) {
      // Store token and user data using auth store
      const token = 'demo-token-123'
      const user = {
        id: '1',
        username: 'admin',
        email: 'admin@coworkingspace.com',
        name: 'Administrator',
        role: 'admin'
      }

      authStore.setAuthToken(token)
      authStore.setUser(user)
      
      // Check if this is first time login or onboarding is incomplete
      if (form.value.password === 'admin123' || !onboardingComplete || onboardingComplete !== 'true') {
        // First login with default password or incomplete onboarding - redirect to onboarding
        authStore.setPasswordReset(null) // Remove the flag so router guard works correctly
        router.push('/onboarding')
      } else {
        // Password has been reset and onboarding complete - redirect to dashboard
        router.push('/dashboard')
      }
    } else {
      throw new Error('Invalid username or password')
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

// Forgot password functions
const closeForgotPasswordModal = () => {
  showForgotPassword.value = false
  forgotPasswordError.value = ''
  forgotPasswordSuccess.value = false
  forgotPasswordForm.value.email = 'admin@coworkingspace.com'
}

const handleForgotPassword = async () => {
  forgotPasswordError.value = ''
  forgotPasswordLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Success - show instructions sent
    forgotPasswordSuccess.value = true
  } catch (err: any) {
    forgotPasswordError.value = err.message || 'Failed to send reset instructions'
  } finally {
    forgotPasswordLoading.value = false
  }
}

const showPasswordReset = () => {
  showForgotPassword.value = false
  showResetForm.value = true
}

// Password reset functions
const closeResetForm = () => {
  showResetForm.value = false
  resetError.value = ''
  resetForm.value = {
    code: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const handlePasswordReset = async () => {
  resetError.value = ''
  resetLoading.value = true

  try {
    // Validate reset code
    if (resetForm.value.code !== 'RESET123') {
      throw new Error('Invalid reset code')
    }

    // Validate password match
    if (resetForm.value.newPassword !== resetForm.value.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    // Validate password strength
    if (resetForm.value.newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Store the new password and mark as reset
    authStore.setUserPassword(resetForm.value.newPassword)
    authStore.setPasswordReset('true')
    
    // Remove onboarding flag since password is now set via reset
    authStore.setOnboardingComplete('true')

    // Close modal and show success
    closeResetForm()
    alert('Password reset successfully! You can now log in with your new password.')
    
  } catch (err: any) {
    resetError.value = err.message || 'Failed to reset password'
  } finally {
    resetLoading.value = false
  }
}
</script>
