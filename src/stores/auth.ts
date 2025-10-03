import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePermissionsStore } from './permissions'

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

  // Permission integration methods
  const loadUserPermissions = async (userId: string) => {
    const permissionsStore = usePermissionsStore()
    
    console.log('⚠️ Auth Store: loadUserPermissions called - this should not happen if JWT contains permissions')
    
    // If we reach here, it means JWT token doesn't contain permissions
    // Use mock permissions as fallback
    const mockRole = {
      id: userId,
      name: user.value?.role || 'user',
      permissions: getMockPermissionsForRole(user.value?.role || 'user')
    }
    
    permissionsStore.setUserRole(mockRole)
    console.log('🔄 Auth Store: Using mock permissions as fallback for role:', user.value?.role)
  }

  const getMockPermissionsForRole = (roleName: string): string[] => {
    // Permission assignment based on role - Updated for .NET Identity
    const rolePermissions: Record<string, string[]> = {
      'superadmin': ['*'], // All permissions
      'super admin': ['*'], // All permissions (space separated)
      'admin': [
        'view_dashboard', 'view_users', 'create_users', 'edit_users', 'delete_users',
        'view_bookings', 'create_bookings', 'edit_bookings', 'cancel_bookings', 'delete_bookings',
        'view_companies', 'create_companies', 'edit_companies', 'delete_companies',
        'view_facilities', 'create_facilities', 'edit_facilities', 'delete_facilities',
        'view_locations', 'create_locations', 'edit_locations', 'delete_locations',
        'view_products', 'create_products', 'edit_products', 'delete_products',
        'view_customers', 'edit_customers',
        'view_payments', 'view_squrehub_commission'
      ],
      'manager': [
        'view_dashboard', 'view_users', 'view_bookings', 'create_bookings', 'edit_bookings', 'cancel_bookings',
        'view_companies', 'view_facilities', 'view_locations', 'view_products', 'view_customers', 'view_payments'
      ],
      'staff': [
        'view_dashboard', 'view_bookings', 'create_bookings', 'edit_bookings',
        'view_companies', 'view_facilities', 'view_locations', 'view_products'
      ],
      'user': [
        'view_dashboard', 'view_bookings', 'create_bookings'
      ]
    }
    
    const normalizedRole = roleName.toLowerCase()
    return rolePermissions[normalizedRole] || rolePermissions['user']
  }

  const setUserWithPermissions = async (userData: any) => {
    const permissionsStore = usePermissionsStore()
    
    setUser(userData)
    
    // If user data includes permissions (from JWT token), use them directly
    if (userData?.permissions && Array.isArray(userData.permissions) && userData.permissions.length > 0) {
      const userRole = {
        id: userData.id?.toString() || '1',
        name: userData.role || 'user',
        permissions: userData.permissions
      }
      
      permissionsStore.setUserRole(userRole)
      console.log('✅ Auth Store: Set permissions from JWT token:', userData.permissions.length, 'permissions')
    } else {
      // No permissions in JWT token - use role-based fallback
      console.log('⚠️ Auth Store: No permissions in JWT token, using role-based fallback for role:', userData.role)
      
      const rolePermissions = getMockPermissionsForRole(userData.role || 'user')
      const userRole = {
        id: userData.id?.toString() || '1',
        name: userData.role || 'user',
        permissions: rolePermissions
      }
      
      permissionsStore.setUserRole(userRole)
      console.log('✅ Auth Store: Set role-based permissions:', rolePermissions.length, 'permissions for role:', userData.role)
    }
  }

  const clearAuth = () => {
    const permissionsStore = usePermissionsStore()
    
    setAuthToken(null)
    setUser(null)
    setUserPassword(null)
    setPasswordReset(null)
    setOnboardingComplete(null)
    setDemoPasswordDisabled(null)
    setCompanySetup(null)
    
    // Clear permissions when logging out
    permissionsStore.clearUserPermissions()
  }

  const initializeFromStorage = () => {
    // This method is called when the app starts to restore auth state
    const permissionsStore = usePermissionsStore()
    
    console.log('🔄 Auth Store: Initializing from storage')
    console.log('- Auth token:', !!authToken.value)
    console.log('- User:', !!user.value)
    console.log('- User role:', user.value?.role)
    
    // If we have auth token and user but no permissions, restore them
    if (authToken.value && user.value && user.value.permissions) {
      console.log('🔄 Auth Store: Restoring permissions from user data')
      const userRole = {
        id: user.value.id?.toString() || '1',
        name: user.value.role || 'user',
        permissions: user.value.permissions
      }
      
      permissionsStore.setUserRole(userRole)
      console.log('✅ Auth Store: Permissions restored from storage:', user.value.permissions.length, 'permissions')
    }
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
    setUserWithPermissions,
    setUserPassword,
    setPasswordReset,
    setOnboardingComplete,
    setDemoPasswordDisabled,
    setCompanySetup,
    loadUserPermissions,
    clearAuth,
    initializeFromStorage
  }
}, {
  persist: true
})