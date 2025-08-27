<template>
  <div class="bg-white rounded-xl shadow-card overflow-hidden">
    <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h2>
        <slot name="header"></slot>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              :class="column.headerClass"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(item, index) in data"
            :key="getItemKey(item, index)"
            class="hover:bg-gray-50"
            :class="rowClass"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4"
              :class="[column.cellClass, column.key === 'actions' ? 'whitespace-nowrap text-sm font-medium' : 'whitespace-nowrap']"
            >
              <slot 
                :name="column.key" 
                :item="item" 
                :value="getNestedValue(item, column.key)"
                :index="index"
              >
                <span v-if="column.key !== 'actions'">
                  {{ formatCellValue(getNestedValue(item, column.key), column) }}
                </span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="data.length === 0" class="text-center py-12">
      <slot name="empty">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ emptyTitle || 'No data found' }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ emptyMessage || 'No items match the current criteria.' }}</p>
      </slot>
    </div>

    <!-- Pagination Slot -->
    <div v-if="$slots.pagination" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  sortable?: boolean
  format?: 'date' | 'currency' | 'number' | 'text'
  headerClass?: string
  cellClass?: string
}

interface Props {
  data: any[]
  columns: Column[]
  title?: string
  emptyTitle?: string
  emptyMessage?: string
  rowClass?: string
  keyField?: string
}

const props = withDefaults(defineProps<Props>(), {
  keyField: 'id'
})

const getItemKey = (item: any, index: number) => {
  return item[props.keyField] || index
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const formatCellValue = (value: any, column: Column) => {
  if (value === null || value === undefined) return '-'
  
  switch (column.format) {
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'currency':
      return `$${Number(value).toLocaleString()}`
    case 'number':
      return Number(value).toLocaleString()
    case 'text':
    default:
      return String(value)
  }
}
</script>
