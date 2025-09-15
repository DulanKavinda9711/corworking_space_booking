<template>
  <div :class="containerClass">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div class="relative">
      <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :class="inputClass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  label?: string
  type?: 'text' | 'email' | 'tel'
  size?: 'sm' | 'md' | 'lg'
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  type: 'text',
  size: 'md'
})

const inputClass = computed(() => {
  const baseClass = 'pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black'
  
  const sizeClasses = {
    sm: 'py-1.5',
    md: 'py-2',
    lg: 'py-3'
  }
  
  return `${baseClass} ${sizeClasses[props.size]}`
})
</script>
