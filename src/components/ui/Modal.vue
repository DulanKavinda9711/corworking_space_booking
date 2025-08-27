<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        :class="modalClass"
        @click.stop
      >
        <!-- Header -->
        <div v-if="title || $slots.header" class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <slot name="header">
              <div>
                <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
                <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
              </div>
            </slot>
            <button 
              v-if="showCloseButton"
              @click="closeModal" 
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Body -->
        <div :class="bodyClass">
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div v-if="$slots.footer" class="flex justify-end space-x-4 pt-6 border-t border-gray-200 px-6 pb-6">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showCloseButton: true,
  persistent: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const slots = useSlots()

const modalClass = computed(() => {
  const baseClass = 'bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto'
  
  const sizeClasses = {
    sm: 'max-w-sm w-full',
    md: 'max-w-md w-full',
    lg: 'max-w-2xl w-full',
    xl: 'max-w-4xl w-full',
    full: 'max-w-7xl w-full mx-4'
  }
  
  return `${baseClass} ${sizeClasses[props.size]}`
})

const bodyClass = computed(() => {
  return slots.footer ? 'p-6' : 'p-6 pb-6'
})

const closeModal = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>
