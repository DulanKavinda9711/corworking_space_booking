<template>
  <div class="relative">
    <input
      type="text"
      :value="displayValue"
      @click="showPicker = !showPicker"
      readonly
      class="date-input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 cursor-pointer"
      :placeholder="placeholder"
    />

    <!-- Date Range Picker -->
    <div v-if="showPicker"
      class="date-picker-container absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-gray-900">

      <div class="flex justify-between items-center mb-4">
        <!-- Month/Year Header -->
        <div v-if="calendarView === 'dates'" class="flex items-center space-x-1">
          <button @click.stop="calendarView = 'years'"
            class="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors px-2 py-1 rounded hover:bg-gray-100">
            {{ selectedYear }}
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7z"/>
          </svg>
          <button @click.stop="calendarView = 'months'"
            class="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors px-2 py-1 rounded hover:bg-gray-100">
            {{ monthNames[selectedMonth] }}
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7z"/>
          </svg>
        </div>

        <!-- Back button for months/years view -->
        <div v-else class="flex items-center">
          <button @click.stop="calendarView = 'dates'"
            class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="text-sm font-medium">{{ calendarView === 'months' ? 'Select Month' : 'Select Year' }}</span>
          </button>
        </div>
      </div>

      <!-- Month Selection View -->
      <div v-if="calendarView === 'months'" class="grid grid-cols-3 gap-2 mb-4">
        <button v-for="(month, index) in monthNames" :key="index" @click.stop="selectMonth(index)" :class="[
          'py-3 px-2 text-sm font-medium rounded-lg transition-colors',
          selectedMonth === index
            ? 'bg-green-600 text-white'
            : 'text-gray-900 hover:bg-gray-100'
        ]">
          {{ month.slice(0, 3) }}
        </button>
      </div>

      <!-- Year Selection View -->
      <div v-if="calendarView === 'years'" class="grid grid-cols-4 gap-2 mb-4 max-h-48 overflow-y-auto">
        <button v-for="year in yearOptions" :key="year" @click.stop="selectYear(year)" :class="[
          'py-3 px-2 text-sm font-medium rounded-lg transition-colors',
          selectedYear === year
            ? 'bg-green-600 text-white'
            : 'text-gray-900 hover:bg-gray-100'
        ]">
          {{ year }}
        </button>
      </div>

      <!-- Calendar Grid - Only show when in dates view -->
      <div v-if="calendarView === 'dates'">
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day"
            class="text-xs font-medium text-gray-500 text-center py-2">
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <div v-for="date in calendarDates" :key="date.dateString" @click.stop="selectDate(date)" :class="[
            'text-sm text-center py-2 cursor-pointer rounded',
            !date.isCurrentMonth ? 'text-gray-300' : 'text-gray-900',
            isDateSelected(date) ? 'bg-green-600 text-white' : '',
            isDateInRange(date) ? 'bg-green-100' : '',
            'hover:bg-green-50'
          ]">
            {{ date.day }}
          </div>
        </div>
      </div>

      <div class="flex justify-end items-end mt-4 pt-4 border-t border-gray-200">
        <div class="flex space-x-2">
          <button @click="clearDateRange"
            class="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
            Clear
          </button>
          <button @click="applyDateRange" :disabled="!startDate"
            class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue?: {
    startDate: string
    endDate: string
  }
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: { startDate: string; endDate: string }): void
  (e: 'change', value: { startDate: string; endDate: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select Date Range'
})

const emit = defineEmits<Emits>()

// State
const showPicker = ref(false)
const currentDate = ref(new Date())

// Calendar view mode
const calendarView = ref('dates') // 'dates', 'months', 'years'

// Month/Year selector state
const selectedMonth = ref(currentDate.value.getMonth())
const selectedYear = ref(currentDate.value.getFullYear())

// Date selection state
const startDate = ref('')
const endDate = ref('')

// Computed properties
const displayValue = computed(() => {
  if (startDate.value && endDate.value) {
    const startParts = startDate.value.split('-')
    const endParts = endDate.value.split('-')
    const startDateObj = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]))
    const endDateObj = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]))
    return `${startDateObj.toLocaleDateString()} - ${endDateObj.toLocaleDateString()}`
  } else if (startDate.value) {
    const startParts = startDate.value.split('-')
    const startDateObj = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]))
    return `${startDateObj.toLocaleDateString()}`
  }
  return ''
})

// Calendar computed properties
const monthNames = computed(() => [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
])

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear - 5; year <= currentYear + 20; year++) {
    years.push(year)
  }
  return years
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startCalendar = new Date(firstDay)
  startCalendar.setDate(startCalendar.getDate() - firstDay.getDay())
  const dates = []
  const current = new Date(startCalendar)
  for (let i = 0; i < 42; i++) {
    const currentDateObj = new Date(current)
    const year = currentDateObj.getFullYear()
    const monthStr = (currentDateObj.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDateObj.getDate().toString().padStart(2, '0')
    const dateString = `${year}-${monthStr}-${day}`
    dates.push({
      day: currentDateObj.getDate(),
      dateString: dateString,
      isCurrentMonth: currentDateObj.getMonth() === month,
      date: currentDateObj
    })
    current.setDate(current.getDate() + 1)
  }
  return dates
})

// Methods
const selectDate = (date: any) => {
  if (!date.isCurrentMonth) return
  const selectedDate = date.dateString
  if (!startDate.value || (startDate.value && endDate.value)) {
    startDate.value = selectedDate
    endDate.value = ''
  } else if (startDate.value && !endDate.value) {
    if (selectedDate >= startDate.value) {
      endDate.value = selectedDate
    } else {
      endDate.value = startDate.value
      startDate.value = selectedDate
    }
  }
}

const isDateSelected = (date: any) => {
  return date.dateString === startDate.value || date.dateString === endDate.value
}

const isDateInRange = (date: any) => {
  if (!startDate.value || !endDate.value) return false
  const dateString = date.dateString
  return dateString > startDate.value && dateString < endDate.value
}

const updateMonthYear = () => {
  currentDate.value = new Date(selectedYear.value, selectedMonth.value, 1)
}

const selectMonth = (monthIndex: number) => {
  selectedMonth.value = monthIndex
  updateMonthYear()
  calendarView.value = 'dates'
}

const selectYear = (year: number) => {
  selectedYear.value = year
  updateMonthYear()
  calendarView.value = 'dates'
}

const clearDateRange = () => {
  startDate.value = ''
  endDate.value = ''
  const now = new Date()
  currentDate.value = new Date(now.getFullYear(), now.getMonth(), 1)
  selectedMonth.value = now.getMonth()
  selectedYear.value = now.getFullYear()
  calendarView.value = 'dates'
}

const applyDateRange = () => {
  if (startDate.value) {
    const value = {
      startDate: startDate.value,
      endDate: endDate.value || startDate.value
    }
    emit('update:modelValue', value)
    emit('change', value)
    showPicker.value = false
  }
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const datePickerContainer = target.closest('.date-picker-container')
  const dateInput = target.closest('.date-input')
  if (!datePickerContainer && !dateInput && showPicker.value) {
    showPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // Initialize from props if provided
  if (props.modelValue) {
    startDate.value = props.modelValue.startDate
    endDate.value = props.modelValue.endDate
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>