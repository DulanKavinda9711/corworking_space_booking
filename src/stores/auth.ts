import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State - Pinia persistence will handle sessionStorage automatically
  const authToken = ref<string | null>(null)
  const user = ref<any>(null)
  const userPassword = ref<string | null>(null)
  const passwordReset = ref<string | null>(null)
  const onboardingComplete = ref<string | null>(null)
  const demoPasswordDisabled = ref<string | null>(null)
  const companySetup = ref<string | null>(null)
  const isFirstLogin  = ref<boolean | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!authToken.value)
  const isOnboardingComplete = computed(() => !!onboardingComplete.value)
  const isPasswordReset = computed(() => !!passwordReset.value)
  const isDemoPasswordDisabled = computed(() => !!demoPasswordDisabled.value)


  const setFirstTimeLogin = (firstLogin: boolean) => {
    isFirstLogin.value = firstLogin
  }

  // Actions
  const setAuthToken = (token: string | null) => {
    authToken.value = token
  }

  const setUser = (userData: any) => {
    user.value = userData
  }

  const setUserPassword = (password: string | null) => {
    userPassword.value = password
  }

  const setPasswordReset = (reset: string | null) => {
    passwordReset.value = reset
  }

  const setOnboardingComplete = (complete: string | null) => {
    onboardingComplete.value = complete
  }

  const setDemoPasswordDisabled = (disabled: string | null) => {
    demoPasswordDisabled.value = disabled
  }

  const setCompanySetup = (setup: string | null) => {
    companySetup.value = setup
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
}, {
  persist: true
})