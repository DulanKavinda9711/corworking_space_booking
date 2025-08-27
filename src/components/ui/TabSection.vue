<template>
  <div>
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.key
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center space-x-2">
            <svg v-if="tab.icon" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path :d="tab.icon" />
            </svg>
            <span>{{ tab.label }}</span>
            <span
              v-if="tab.count !== undefined"
              :class="[
                'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                activeTab === tab.key
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ tab.count }}
            </span>
          </div>
        </button>
      </nav>
    </div>
    
    <!-- Tab Content -->
    <div class="mt-6">
      <slot :activeTab="activeTab"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Tab {
  key: string
  label: string
  icon?: string
  count?: number
}

interface Props {
  tabs: Tab[]
  modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'tab-change': [tab: string]
}>()

const activeTab = ref(props.modelValue || props.tabs[0]?.key || '')

watch(activeTab, (newTab) => {
  emit('update:modelValue', newTab)
  emit('tab-change', newTab)
})

watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== activeTab.value) {
    activeTab.value = newValue
  }
})
</script>
