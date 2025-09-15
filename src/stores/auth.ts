import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const authToken = ref<string | null>(localStorage.getItem('auth-token'))
  const user = ref<any>(JSON.parse(localStorage.getItem('user') || 'null'))
  const userPassword = ref<string | null>(localStorage.getItem('user-password'))
  const passwordReset = ref<string | null>(localStorage.getItem('password-reset'))
  const onboardingComplete = ref<string | null>(localStorage.getItem('onboarding-complete'))
  const demoPasswordDisabled = ref<string | null>(localStorage.getItem('demo-password-disabled'))
  const companySetup = ref<string | null>(localStorage.getItem('company-setup'))

  // Getters
  const isAuthenticated = computed(() => !!authToken.value)
  const isOnboardingComplete = computed(() => !!onboardingComplete.value)
  const isPasswordReset = computed(() => !!passwordReset.value)
  const isDemoPasswordDisabled = computed(() => !!demoPasswordDisabled.value)

  // Actions
  const setAuthToken = (token: string | null) => {
    authToken.value = token
    if (token) {
      localStorage.setItem('auth-token', token)
    } else {
      localStorage.removeItem('auth-token')
    }
  }

  const setUser = (userData: any) => {
    user.value = userData
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }

  const setUserPassword = (password: string | null) => {
    userPassword.value = password
    if (password) {
      localStorage.setItem('user-password', password)
    } else {
      localStorage.removeItem('user-password')
    }
  }

  const setPasswordReset = (reset: string | null) => {
    passwordReset.value = reset
    if (reset) {
      localStorage.setItem('password-reset', reset)
    } else {
      localStorage.removeItem('password-reset')
    }
  }

  const setOnboardingComplete = (complete: string | null) => {
    onboardingComplete.value = complete
    if (complete) {
      localStorage.setItem('onboarding-complete', complete)
    } else {
      localStorage.removeItem('onboarding-complete')
    }
  }

  const setDemoPasswordDisabled = (disabled: string | null) => {
    demoPasswordDisabled.value = disabled
    if (disabled) {
      localStorage.setItem('demo-password-disabled', disabled)
    } else {
      localStorage.removeItem('demo-password-disabled')
    }
  }

  const setCompanySetup = (setup: string | null) => {
    companySetup.value = setup
    if (setup) {
      localStorage.setItem('company-setup', setup)
    } else {
      localStorage.removeItem('company-setup')
    }
  }

  const clearAuth = () => {
    setAuthToken(null)
    setUser(null)
    setUserPassword(null)
    setPasswordReset(null)
    setOnboardingComplete(null)
    setDemoPasswordDisabled(null)
    setCompanySetup(null)
  }

  return {
    // State
    authToken,
    user,
    userPassword,
    passwordReset,
    onboardingComplete,
    demoPasswordDisabled,
    companySetup,

    // Getters
    isAuthenticated,
    isOnboardingComplete,
    isPasswordReset,
    isDemoPasswordDisabled,

    // Actions
    setAuthToken,
    setUser,
    setUserPassword,
    setPasswordReset,
    setOnboardingComplete,
    setDemoPasswordDisabled,
    setCompanySetup,
    clearAuth
  }
})