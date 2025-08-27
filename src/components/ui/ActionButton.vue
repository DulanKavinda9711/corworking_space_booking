<template>
  <component
    :is="isLink ? 'router-link' : 'button'"
    :to="isLink ? to : undefined"
    :title="title"
    :class="buttonClass"
    @click="!isLink && $emit('click', $event)"
  >
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path :d="icon" />
    </svg>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  title: string
  variant?: 'view' | 'edit' | 'delete' | 'activate' | 'suspend' | 'primary' | 'secondary'
  to?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const isLink = computed(() => !!props.to)

const buttonClass = computed(() => {
  const baseClass = 'transition-colors'
  
  const variantClasses = {
    view: 'text-primary-600 hover:text-primary-900',
    edit: 'text-blue-600 hover:text-blue-900',
    delete: 'text-red-600 hover:text-red-900',
    activate: 'text-green-600 hover:text-green-900',
    suspend: 'text-red-600 hover:text-red-900',
    primary: 'text-primary-600 hover:text-primary-900',
    secondary: 'text-gray-600 hover:text-gray-900'
  }
  
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  }
  
  return `${baseClass} ${variantClasses[props.variant]} ${sizeClasses[props.size]}`
})
</script>
