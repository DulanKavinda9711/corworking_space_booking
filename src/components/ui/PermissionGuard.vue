<template>
  <div v-if="hasAccess">
    <slot />
  </div>
  <div v-else-if="showFallback">
    <slot name="fallback">
      <div class="permission-denied-message">
        <p class="text-gray-500 text-sm">{{ fallbackMessage }}</p>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissionsStore } from '@/stores/permissions'
import type { PermissionValue } from '@/constants/permissions'

interface Props {
  /** Single permission required to access the content */
  permission?: PermissionValue | string
  /** Multiple permissions - by default user needs ANY of these permissions */
  permissions?: (PermissionValue | string)[]
  /** If true, user must have ALL permissions. If false, user needs ANY permission */
  requireAll?: boolean
  /** Whether to show fallback content when access is denied */
  showFallback?: boolean
  /** Custom fallback message */
  fallbackMessage?: string
  /** Role-based access - user must have one of these roles */
  roles?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  requireAll: false,
  showFallback: false,
  fallbackMessage: 'You do not have permission to view this content.',
  roles: () => []
})

const permissionsStore = usePermissionsStore()

const hasAccess = computed(() => {
  // If no permissions or roles specified, allow access
  if (!props.permission && (!props.permissions || props.permissions.length === 0) && props.roles.length === 0) {
    return true
  }

  // Check role-based access first
  if (props.roles.length > 0) {
    const userRole = permissionsStore.userRole?.name?.toLowerCase()
    if (userRole && props.roles.map(r => r.toLowerCase()).includes(userRole)) {
      return true
    }
  }

  // Check single permission
  if (props.permission) {
    return permissionsStore.hasPermission(props.permission)
  }

  // Check multiple permissions
  if (props.permissions && props.permissions.length > 0) {
    if (props.requireAll) {
      return permissionsStore.hasAllPermissions(props.permissions)
    } else {
      return permissionsStore.hasAnyPermission(props.permissions)
    }
  }

  return false
})
</script>

<style scoped>
.permission-denied-message {
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  text-align: center;
}
</style>