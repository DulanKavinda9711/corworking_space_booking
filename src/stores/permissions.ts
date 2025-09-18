import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { permissionApi } from '@/services/api'

export interface Permission {
  id: number
  code_name: string
  description: string
}

export const usePermissionsStore = defineStore('permissions', () => {
  // State
  const permissions = ref<Permission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const allPermissions = computed(() => permissions.value)

  const getPermissionById = (id: number) => {
    return permissions.value.find(permission => permission.id === id)
  }

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

  return {
    // State
    permissions,
    loading,
    error,

    // Getters
    allPermissions,
    getPermissionById,

    // Actions
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission
  }
})