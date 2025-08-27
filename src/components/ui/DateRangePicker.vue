<template>
  <div class="relative">
    <input
      type="text"
      :value="displayValue"
      @click="showPicker = !showPicker"
      readonly
      class="date-input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 cursor-pointer"
      placeholder="Select Date Range"
    />
    <div v-if="showPicker" class="date-picker-container absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-gray-900">
      <div class="flex justify-between items-center mb-4">
        <button @click="previousMonth" class="p-1 hover:bg-gray-100 rounded">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <span class="font-medium">{{ currentMonthYear }}</span>
        <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="text-xs font-medium text-gray-500 text-center py-2">
          {{ day }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="date in calendarDates"
          :key="date.dateString"
          @click="selectDate(date)"
          :class="[
            'text-sm text-center py-2 cursor-pointer rounded',
            !date.isCurrentMonth ? 'text-gray-300' : 'text-gray-900',
            isDateSelected(date) ? 'bg-primary-600 text-white' : '',
            isDateInRange(date) ? 'bg-primary-100' : '',
            'hover:bg-primary-50'
          ]"
        >
          {{ date.day }}
        </div>
      </div>
      <div class="flex justify-end items-end mt-4 pt-4 border-t border-gray-200">
        <div class="flex space-x-2">
          <button @click="clearDateRange" class="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50">Clear</button>
          <button @click="applyDateRange" :disabled="!startDate" class="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">Apply</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const props = defineProps<{ modelValue: { start: string, end: string } }>()
const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const startDate = ref(props.modelValue.start)
const endDate = ref(props.modelValue.end)

watch(() => props.modelValue, (val) => {
  startDate.value = val.start
  endDate.value = val.end
})

const displayValue = computed(() => {
  if (startDate.value && endDate.value) {
    return `${formatDate(startDate.value)} - ${formatDate(endDate.value)}`
  } else if (startDate.value) {
    return formatDate(startDate.value)
  }
  return ''
})

// Calendar logic (simplified for brevity)
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const currentMonthYear = computed(() => {
  return `${today.toLocaleString('default', { month: 'long' })} ${currentYear.value}`
})

const calendarDates = computed(() => {
  // Generate dates for the current month (simplified)
  const dates = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateObj = new Date(currentYear.value, currentMonth.value, i)
    dates.push({
      day: i,
      dateString: dateObj.toISOString().slice(0, 10),
      isCurrentMonth: true
    })
  }
  return dates
})

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}
function selectDate(date: any) {
  if (!startDate.value || (startDate.value && endDate.value)) {
    startDate.value = date.dateString
    endDate.value = ''
  } else if (startDate.value && !endDate.value) {
    if (date.dateString >= startDate.value) {
      endDate.value = date.dateString
    } else {
      startDate.value = date.dateString
      endDate.value = ''
    }
  }
}
function isDateSelected(date: any) {
  return date.dateString === startDate.value || date.dateString === endDate.value
}
function isDateInRange(date: any) {
  return startDate.value && endDate.value && date.dateString > startDate.value && date.dateString < endDate.value
}
function clearDateRange() {
  startDate.value = ''
  endDate.value = ''
}
function applyDateRange() {
  emit('update:modelValue', { start: startDate.value, end: endDate.value })
  showPicker.value = false
}
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.date-input {
  min-width: 180px;
}
.date-picker-container {
  left: 0;
}
</style>
