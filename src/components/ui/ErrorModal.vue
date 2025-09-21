<template>
  <BaseModal
    :model-value="modelValue"
    size="sm"
    :persistent="persistent"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="$emit('close')"
  >
    <div class="text-center">
      <!-- Error Icon -->
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      <!-- Title -->
      <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">
        {{ title || 'Error' }}
      </h3>

      <!-- Message -->
      <div class="mt-2 px-7 py-3">
        <p class="text-sm text-gray-500">{{ message }}</p>
      </div>

      <!-- Actions -->
      <div class="items-center px-4 py-3 flex space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 flex-1 transition-colors"
        >
          {{ closeButtonText || 'Close' }}
        </button>
        <button
          v-if="showRetry"
          @click="$emit('retry')"
          class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 flex-1 transition-colors"
        >
          {{ retryButtonText || 'Retry' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  closeButtonText?: string
  retryButtonText?: string
  showRetry?: boolean
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRetry: false,
  persistent: false
})

defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'retry': []
}>()
</script>