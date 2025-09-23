<template>
  <BaseModal
    :model-value="modelValue"
    size="sm"
    :persistent="persistent"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="$emit('close')"
  >
    <div class="text-center">
      <!-- Success Icon -->
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <img v-if="icon" :src="icon" :alt="title || 'Success'" class="h-6 w-6 object-contain" />
        <svg v-else class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <!-- Title -->
      <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">
        {{ title || 'Success!' }}
      </h3>

      <!-- Message -->
      <div class="mt-2 px-7 py-3">
        <p class="text-sm text-gray-500">{{ message }}</p>
      </div>

      <!-- Actions -->
      <div class="items-center px-4 py-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
        >
          {{ buttonText || 'OK' }}
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
  buttonText?: string
  persistent?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  persistent: false
})

defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()
</script>