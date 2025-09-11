/**
 * Authentication Security Helper
 * Contains utility functions to manage password security and demo password restrictions
 */

export interface AuthSecurityState {
  isOnboardingComplete: boolean
  isPasswordReset: boolean
  isDemoPasswordDisabled: boolean
  hasStoredPassword: boolean
  storedPassword: string | null
}

/**
 * Get the current authentication security state
 */
export function getAuthSecurityState(): AuthSecurityState {
  return {
    isOnboardingComplete: localStorage.getItem('onboarding-complete') === 'true',
    isPasswordReset: localStorage.getItem('password-reset') === 'true',
    isDemoPasswordDisabled: localStorage.getItem('demo-password-disabled') === 'true',
    hasStoredPassword: !!localStorage.getItem('user-password'),
    storedPassword: localStorage.getItem('user-password')
  }
}

/**
 * Check if demo password should be allowed for login
 */
export function isDemoPasswordAllowed(): boolean {
  const state = getAuthSecurityState()
  
  // If demo password is explicitly disabled, never allow it
  if (state.isDemoPasswordDisabled) {
    return false
  }
  
  // If user has completed onboarding and set a password, demo password should not be allowed
  if (state.isOnboardingComplete && state.isPasswordReset && state.hasStoredPassword) {
    return false
  }
  
  // Otherwise, demo password is allowed (first-time users)
  return true
}

/**
 * Validate if a password attempt should be allowed
 */
export function validatePasswordAttempt(password: string): { isValid: boolean; errorMessage?: string } {
  const state = getAuthSecurityState()
  
  // Check if attempting to use demo password
  if (password === 'admin123') {
    if (!isDemoPasswordAllowed()) {
      return {
        isValid: false,
        errorMessage: state.isDemoPasswordDisabled 
          ? 'Demo password has been permanently disabled. Please use your updated password to continue.'
          : 'Default password is no longer valid. Please use your updated password.'
      }
    }
    return { isValid: true }
  }
  
  // Check if attempting to use custom password
  if (state.hasStoredPassword) {
    return {
      isValid: password === state.storedPassword,
      errorMessage: password !== state.storedPassword ? 'Invalid password' : undefined
    }
  }
  
  // No stored password and not demo password
  return {
    isValid: false,
    errorMessage: 'Invalid credentials'
  }
}

/**
 * Mark demo password as permanently disabled
 */
export function disableDemoPassword(): void {
  localStorage.setItem('demo-password-disabled', 'true')
}

/**
 * Check if user has fully completed security setup
 */
export function hasCompletedSecuritySetup(): boolean {
  const state = getAuthSecurityState()
  return state.isOnboardingComplete && 
         state.isPasswordReset && 
         state.hasStoredPassword && 
         state.isDemoPasswordDisabled
}

/**
 * Reset all authentication flags (for testing purposes only)
 */
export function resetAuthFlags(): void {
  localStorage.removeItem('onboarding-complete')
  localStorage.removeItem('password-reset')
  localStorage.removeItem('demo-password-disabled')
  localStorage.removeItem('user-password')
  localStorage.removeItem('auth-token')
  localStorage.removeItem('user')
  localStorage.removeItem('company-setup')
}
