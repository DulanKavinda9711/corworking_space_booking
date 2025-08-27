<template>
  <span :class="badgeClass">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: string
  type?: 'status' | 'role' | 'activity' | 'payment' | 'booking'
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'status'
})

const text = computed(() => props.text || formatStatus(props.status))

const badgeClass = computed(() => {
  const baseClass = 'px-2 py-1 text-xs font-medium rounded-full'
  
  let colorClass = ''
  
  switch (props.type) {
    case 'status':
      colorClass = getStatusColor(props.status)
      break
    case 'role':
      colorClass = getRoleColor(props.status)
      break
    case 'activity':
      colorClass = getActivityColor(props.status)
      break
    case 'payment':
      colorClass = getPaymentColor(props.status)
      break
    case 'booking':
      colorClass = getBookingColor(props.status)
      break
    default:
      colorClass = 'bg-gray-100 text-gray-800'
  }
  
  return `${baseClass} ${colorClass}`
})

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Admin',
    'manager': 'Manager',
    'operator': 'Operator',
    'user': 'User Action',
    'booking': 'Booking',
    'payment': 'Payment',
    'system': 'System',
    'security': 'Security',
    'audit': 'Audit'
  }
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'suspended':
    case 'cancelled':
    case 'failed':
    case 'error':
      return 'bg-red-100 text-red-800'
    case 'success':
    case 'completed':
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'super-admin':
      return 'bg-red-100 text-red-800'
    case 'admin':
      return 'bg-purple-100 text-purple-800'
    case 'manager':
      return 'bg-blue-100 text-blue-800'
    case 'operator':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'user':
      return 'bg-blue-100 text-blue-800'
    case 'booking':
      return 'bg-green-100 text-green-800'
    case 'payment':
      return 'bg-purple-100 text-purple-800'
    case 'system':
      return 'bg-orange-100 text-orange-800'
    case 'security':
      return 'bg-red-100 text-red-800'
    case 'audit':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentColor = (status: string) => {
  switch (status) {
    case 'paid':
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getBookingColor = (status: string) => {
  switch (status) {
    case 'confirmed':
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
