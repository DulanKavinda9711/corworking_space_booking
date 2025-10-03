import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { permissionApi } from '@/services/api'

export interface Permission {
  id: number
  code_name: string
  description: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isActive: boolean
}

export interface UserRole {
  id: string
  name: string
  permissions: string[]
}

export const usePermissionsStore = defineStore('permissions', () => {
  // State
  const permissions = ref<Permission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // RBAC State
  const userPermissions = ref<string[]>([])
  const userRole = ref<UserRole | null>(null)
  const availableRoles = ref<Role[]>([])
  const rbacLoading = ref(false)

  // Getters
  const allPermissions = computed(() => permissions.value)

  const getPermissionById = (id: number) => {
    return permissions.value.find(permission => permission.id === id)
  }

  // RBAC Getters
  const hasPermission = computed(() => {
    return (permission: string): boolean => {
      // Super admin has all permissions
      if (userPermissions.value.includes('*') || userPermissions.value.includes('super_admin')) {
        return true
      }
      return userPermissions.value.includes(permission)
    }
  })

  const hasAnyPermission = computed(() => {
    return (permissionList: string[]): boolean => {
      if (userPermissions.value.includes('*') || userPermissions.value.includes('super_admin')) {
        return true
      }
      return permissionList.some(permission => userPermissions.value.includes(permission))
    }
  })

  const hasAllPermissions = computed(() => {
    return (permissionList: string[]): boolean => {
      if (userPermissions.value.includes('*') || userPermissions.value.includes('super_admin')) {
        return true
      }
      return permissionList.every(permission => userPermissions.value.includes(permission))
    }
  })

  const getUserRoleName = computed(() => {
    return userRole.value?.name || 'Unknown'
  })

  // Actions
  const fetchPermissions = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await permissionApi.getAllPermissions()
      if (response.success && response.data) {
        permissions.value = response.data
      } else {
        throw new Error(response.message || 'Failed to fetch permissions')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch permissions'
      console.error('Error fetching permissions:', err)
    } finally {
      loading.value = false
    }
  }

  const createPermission = async (permission: Omit<Permission, 'id'>) => {
    // TODO: Implement API call
    console.log('Creating permission:', permission)
  }

  const updatePermission = async (id: number, updates: Partial<Permission>) => {
    // TODO: Implement API call
    console.log('Updating permission:', id, updates)
  }

  const deletePermission = async (id: number) => {
    // TODO: Implement API call
    console.log('Deleting permission:', id)
  }

  // RBAC Actions
  const setUserPermissions = (permissions: string[]) => {
    userPermissions.value = permissions
  }

  const setUserRole = (role: UserRole) => {
    userRole.value = role
    userPermissions.value = role.permissions
  }

  const clearUserPermissions = () => {
    userPermissions.value = []
    userRole.value = null
  }

  const setAvailableRoles = (roles: Role[]) => {
    availableRoles.value = roles
  }

  const addUserPermission = (permission: string) => {
    if (!userPermissions.value.includes(permission)) {
      userPermissions.value.push(permission)
    }
  }

  const removeUserPermission = (permission: string) => {
    const index = userPermissions.value.indexOf(permission)
    if (index > -1) {
      userPermissions.value.splice(index, 1)
    }
  }

  // Utility methods
  const canAccessRoute = (routePermissions: string[], requireAll = false): boolean => {
    if (!routePermissions || routePermissions.length === 0) {
      return true
    }

    if (requireAll) {
      return hasAllPermissions.value(routePermissions)
    } else {
      return hasAnyPermission.value(routePermissions)
    }
  }

  const getRoleById = (roleId: string): Role | undefined => {
    return availableRoles.value.find(role => role.id === roleId)
  }

  // Debug helper
  const debugPermissions = () => {
    console.log('=== Permissions Debug ===')
    console.log('User Role:', userRole.value)
    console.log('User Permissions:', userPermissions.value)
    console.log('All Available Permissions:', allPermissions.value)
    console.log('Available Roles:', availableRoles.value)
    console.log('========================')
  }

  return {
    // State
    permissions,
    loading,
    error,
    userPermissions,
    userRole,
    availableRoles,
    rbacLoading,

    // Getters
    allPermissions,
    getPermissionById,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserRoleName,

    // Actions
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    setUserPermissions,
    setUserRole,
    clearUserPermissions,
    setAvailableRoles,
    addUserPermission,
    removeUserPermission,

    // Utilities
    canAccessRoute,
    getRoleById,
    debugPermissions
  }
}, {
  persist: true
})