<template>
  <div class="bg-white rounded-xl shadow-card p-6">
    <h2 v-if="title" class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h2>
    
    <div :class="gridClass">
      <slot></slot>
    </div>
    
    <div v-if="showResetButton" class="mt-4 flex justify-end">
      <button
        @click="$emit('reset')"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  columns?: number
  showResetButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Filters',
  columns: 3,
  showResetButton: true
})

const gridClass = computed(() => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-6'
  }
  
  return `grid gap-4 ${gridCols[props.columns as keyof typeof gridCols] || gridCols[3]}`
})
</script>
