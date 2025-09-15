<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
    >
      <option value="">{{ placeholder }}</option>
      <option 
        v-for="option in options" 
        :key="typeof option === 'string' ? option : option.value"
        :value="typeof option === 'string' ? option : option.value"
      >
        {{ typeof option === 'string' ? option : option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  label: string
  options: (string | Option)[]
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'All'
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
