import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State with localStorage persistence
  const authToken = ref<string | null>(localStorage.getItem('authToken'))
  const user = ref<any>(JSON.parse(localStorage.getItem('user') || 'null'))
  const userPassword = ref<string | null>(localStorage.getItem('userPassword'))
  const passwordReset = ref<string | null>(localStorage.getItem('passwordReset'))
  const onboardingComplete = ref<string | null>(localStorage.getItem('onboardingComplete'))
  const demoPasswordDisabled = ref<string | null>(localStorage.getItem('demoPasswordDisabled'))
  const companySetup = ref<string | null>(localStorage.getItem('companySetup'))

  // Getters
  const isAuthenticated = computed(() => !!authToken.value)
  const isOnboardingComplete = computed(() => !!onboardingComplete.value)
  const isPasswordReset = computed(() => !!passwordReset.value)
  const isDemoPasswordDisabled = computed(() => !!demoPasswordDisabled.value)

  // Actions
  const setAuthToken = (token: string | null) => {
    authToken.value = token
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
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
      localStorage.setItem('userPassword', password)
    } else {
      localStorage.removeItem('userPassword')
    }
  }

  const setPasswordReset = (reset: string | null) => {
    passwordReset.value = reset
    if (reset) {
      localStorage.setItem('passwordReset', reset)
    } else {
      localStorage.removeItem('passwordReset')
    }
  }

  const setOnboardingComplete = (complete: string | null) => {
    onboardingComplete.value = complete
    if (complete) {
      localStorage.setItem('onboardingComplete', complete)
    } else {
      localStorage.removeItem('onboardingComplete')
    }
  }

  const setDemoPasswordDisabled = (disabled: string | null) => {
    demoPasswordDisabled.value = disabled
    if (disabled) {
      localStorage.setItem('demoPasswordDisabled', disabled)
    } else {
      localStorage.removeItem('demoPasswordDisabled')
    }
  }

  const setCompanySetup = (setup: string | null) => {
    companySetup.value = setup
    if (setup) {
      localStorage.setItem('companySetup', setup)
    } else {
      localStorage.removeItem('companySetup')
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