import { computed } from 'vue'
import { usePermissionsStore } from '@/stores/permissions'
import type { PermissionValue } from '@/constants/permissions'

/**
 * Composable for permission checking in Vue components
 * Provides convenient methods for checking user permissions
 */
export function usePermissions() {
  const permissionsStore = usePermissionsStore()

  // Computed properties for reactive permission checking
  const userPermissions = computed(() => permissionsStore.userPermissions)
  const userRole = computed(() => permissionsStore.userRole)
  const isAuthenticated = computed(() => !!permissionsStore.userRole)

  /**
   * Check if user has a specific permission
   */
  function hasPermission(permission: PermissionValue | string): boolean {
    return permissionsStore.hasPermission(permission)
  }

  /**
   * Check if user has any of the specified permissions
   */
  function hasAnyPermission(permissions: (PermissionValue | string)[]): boolean {
    return permissionsStore.hasAnyPermission(permissions)
  }

  /**
   * Check if user has all of the specified permissions
   */
  function hasAllPermissions(permissions: (PermissionValue | string)[]): boolean {
    return permissionsStore.hasAllPermissions(permissions)
  }

  /**
   * Check if user has a specific role
   */
  function hasRole(roleName: string): boolean {
    return userRole.value?.name?.toLowerCase() === roleName.toLowerCase()
  }

  /**
   * Check if user has any of the specified roles
   */
  function hasAnyRole(roles: string[]): boolean {
    const currentRole = userRole.value?.name?.toLowerCase()
    return !!currentRole && roles.map(r => r.toLowerCase()).includes(currentRole)
  }

  /**
   * Check if user can access a specific route
   */
  function canAccessRoute(routePermissions: string[], requireAll = false): boolean {
    return permissionsStore.canAccessRoute(routePermissions, requireAll)
  }

  /**
   * Reactive computed for checking permissions
   * Useful for v-if directives and computed properties
   */
  function createPermissionChecker(
    permission?: PermissionValue | string,
    permissions?: (PermissionValue | string)[],
    requireAll: boolean = false
  ) {
    return computed(() => {
      if (permission) {
        return hasPermission(permission)
      }
      if (permissions && permissions.length > 0) {
        return requireAll 
          ? hasAllPermissions(permissions)
          : hasAnyPermission(permissions)
      }
      return true
    })
  }

  /**
   * Get permissions for a specific category
   */
  function getPermissionsByCategory(category: string) {
    return userPermissions.value.filter(permission => 
      permission.includes(category.toLowerCase())
    )
  }

  /**
   * Check if user is superadmin
   */
  const isSuperAdmin = computed(() => hasRole('superadmin'))

  /**
   * Check if user is admin (admin or superadmin)
   */
  const isAdmin = computed(() => hasAnyRole(['admin', 'superadmin']))

  /**
   * Get user's permission level for display
   */
  const permissionLevel = computed(() => {
    if (isSuperAdmin.value) return 'Super Administrator'
    if (isAdmin.value) return 'Administrator'
    if (hasRole('manager')) return 'Manager'
    if (hasRole('staff')) return 'Staff'
    return 'User'
  })

  return {
    // State
    userPermissions,
    userRole,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    permissionLevel,

    // Methods
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canAccessRoute,
    createPermissionChecker,
    getPermissionsByCategory,

    // Store methods
    setUserRole: permissionsStore.setUserRole,
    clearUserPermissions: permissionsStore.clearUserPermissions,
    setUserPermissions: permissionsStore.setUserPermissions
  }
}