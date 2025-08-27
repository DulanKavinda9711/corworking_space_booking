<template>
  <div class="bg-white rounded-xl shadow-card p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div :class="iconContainerClass">
          <svg class="w-6 h-6" :class="iconClass" fill="currentColor" viewBox="0 0 24 24">
            <path :d="icon" />
          </svg>
        </div>
      </div>
      <div class="ml-4">
        <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
        <p class="text-2xl font-bold text-gray-900">{{ formattedValue }}</p>
        <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
        <div v-if="trend" class="flex items-center mt-2">
          <svg 
            class="w-4 h-4 mr-1" 
            :class="trend.direction === 'up' ? 'text-green-500' : 'text-red-500'"
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path v-if="trend.direction === 'up'" d="M7 14l5-5 5 5z" />
            <path v-else d="M7 10l5 5 5-5z" />
          </svg>
          <span 
            class="text-sm font-medium" 
            :class="trend.direction === 'up' ? 'text-green-600' : 'text-red-600'"
          >
            {{ trend.value }}
          </span>
          <span class="text-sm text-gray-500 ml-1">{{ trend.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Trend {
  direction: 'up' | 'down'
  value: string
  label: string
}

interface Props {
  title: string
  value: number | string
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  subtitle?: string
  trend?: Trend
  formatType?: 'number' | 'currency' | 'percentage'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  formatType: 'number'
})

const formattedValue = computed(() => {
  const value = props.value
  
  switch (props.formatType) {
    case 'currency':
      return typeof value === 'number' 
        ? `$${value.toLocaleString()}` 
        : value
    case 'percentage':
      return typeof value === 'number' 
        ? `${value}%` 
        : value
    case 'number':
    default:
      return typeof value === 'number' 
        ? value.toLocaleString() 
        : value
  }
})

const iconContainerClass = computed(() => {
  const baseClass = 'w-12 h-12 rounded-lg flex items-center justify-center'
  const colorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
    gray: 'bg-gray-100'
  }
  return `${baseClass} ${colorClasses[props.color]}`
})

const iconClass = computed(() => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  }
  return colorClasses[props.color]
})
</script>
