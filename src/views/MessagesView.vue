<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiMessage" />
            </svg>
            <span class="text-sm font-medium text-green-700">
              Total Messages:
              <span class="font-bold text-green-800">{{ filteredMessages.length }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      

      <!-- Messages Table -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="overflow-x-auto">
            <div class="bg-white shadow-card p-6 border b">
        <div class="flex items-end gap-6">
          <!-- Filter Grid -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-5 flex-1">
            <!-- Date Range Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <AdvancedDateRangePicker
                v-model="dateRange"
                placeholder="Select Date Range"
                @change="handleDateRangeChange"
              />
            </div>

            <!-- Name Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                v-model="filters.name"
                type="text"
                placeholder="Search by name..."
                class="w-full px-3 py-2 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md"
              />
            </div>

            <!-- Email Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                v-model="filters.email"
                type="text"
                placeholder="Search by email..."
                class="w-full px-3 py-2 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md"
              />
            </div>

            <!-- Status Filter -->
            <!-- <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="filters.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div> -->
          </div>

          <!-- Reset Button -->
          <div class="flex-shrink-0">
            <button
              @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
          <table class="overflow-x-auto h-[410px] min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody v-if="filteredMessages.length > 0" class="bg-white divide-y divide-gray-200 align-top">
              <tr
                v-for="message in paginatedMessages"
                :key="message.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="viewMessage(message)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-green-800">
                          {{ getInitials(message.name) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ message.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ message.email }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate" :title="message.message">
                    {{ message.message }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(message.date) }}</div>
                  <div class="text-sm text-gray-500">{{ formatTime(message.date) }}</div>
                </td>
              </tr>
            </tbody>

            <!-- Empty State -->
            <tbody v-if="filteredMessages.length === 0" class="bg-white align-top">
              <tr>
                <td colspan="4" class="px-6 py-12 text-center">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                  <p class="text-gray-600">There are no messages matching your current filters.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <!-- <div v-if="filteredMessages.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ startItem }} to {{ endItem }} of {{ filteredMessages.length }} messages
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div> -->
      </div>
    </div>

    <!-- Message Detail Modal -->
    <div v-if="selectedMessage" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeMessageModal">
      <div class="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Message Details</h3>
            <button @click="closeMessageModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span class="text-sm font-medium text-green-800">
                  {{ getInitials(selectedMessage.name) }}
                </span>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ selectedMessage.name }}</h4>
                <p class="text-sm text-gray-500">{{ selectedMessage.email }}</p>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Date:</span>
                <span class="text-sm text-gray-900">{{ formatDate(selectedMessage.date) }} {{ formatTime(selectedMessage.date) }}</span>
              </div>
              <!-- <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-gray-700">Status:</span>
                <span :class="getStatusClass(selectedMessage.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ selectedMessage.status }}
                </span>
              </div> -->
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Message:</label>
              <div class="mt-2 p-4 bg-gray-50 border b rounded-lg">
                <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ selectedMessage.message }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end pt-4 space-x-4">
            <!-- <button
              v-if="selectedMessage.status === 'unread'"
              @click="markAsRead(selectedMessage)"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              Mark as Read
            </button> -->
            <!-- <button
              @click="handleReply(selectedMessage)"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Reply
            </button> -->
            <button
              @click="closeMessageModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <div v-if="showReplyModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click.self="showReplyModal = false">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Reply to Message</h3>
            <button @click="showReplyModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">To:</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedMessage?.name }} ({{ selectedMessage?.email }})</p>
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700">Subject:</label>
              <input
                id="subject"
                v-model="replyForm.subject"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label for="contactMethod" class="block text-sm font-medium text-gray-700">Contact Method:</label>
              <select
                id="contactMethod"
                v-model="replyForm.contactMethod"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700">Message:</label>
              <textarea
                id="message"
                v-model="replyForm.message"
                rows="6"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your reply here..."
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end pt-4 space-x-4">
            <button
              @click="showReplyModal = false"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              @click="() => handleReplySubmit(replyForm)"
              :disabled="!replyForm.message.trim()"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import AdvancedDateRangePicker from '@/components/ui/AdvancedDateRangePicker.vue'
import { useMessages } from '@/composables/useMessages'
import { mdiMessage } from '@mdi/js'

// Use the messages composable
const {
  messages,
  loading,
  error,
  filters,
  filteredMessages,
  unreadCount,
  loadMessages,
  markAsRead,
  removeMessage,
  replyToMessage,
  resetFilters
} = useMessages()

// Reactive state for UI
const selectedMessage = ref<any>(null)
const showReplyModal = ref(false)
const replyForm = ref({
  subject: '',
  message: '',
  contactMethod: 'email'
})
const dateRange = ref({
  startDate: '',
  endDate: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(filteredMessages.value.length / itemsPerPage))

const paginatedMessages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMessages.value.slice(start, end)
})

const startItem = computed(() => {
  if (filteredMessages.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return Math.min(end, filteredMessages.value.length)
})

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

const formatTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes} ${ampm}`
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'unread':
      return 'bg-red-100 text-red-800'
    case 'read':
      return 'bg-green-100 text-green-800'
    case 'replied':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const handleDateRangeChange = (newDateRange: { startDate: string; endDate: string }) => {
  filters.value.startDate = newDateRange.startDate
  filters.value.endDate = newDateRange.endDate
  currentPage.value = 1
}

const viewMessage = (message: any) => {
  selectedMessage.value = message
  if (message.status === 'unread') {
    handleMarkAsRead(message)
  }
}

const closeMessageModal = () => {
  selectedMessage.value = null
}

const handleMarkAsRead = async (message: any) => {
  try {
    await markAsRead(message.id)
  } catch (err) {
    console.error('Failed to mark message as read:', err)
  }
}

const handleReply = async (message: any) => {
  selectedMessage.value = message
  replyForm.value = {
    subject: `Re: Message from ${message.name}`,
    message: '',
    contactMethod: 'email'
  }
  showReplyModal.value = true
}

const handleDelete = async (message: any) => {
  if (confirm('Are you sure you want to delete this message?')) {
    try {
      await removeMessage(message.id)
    } catch (err) {
      console.error('Failed to delete message:', err)
    }
  }
}

const handleReplySubmit = async (replyData: { subject: string; message: string; contactMethod: string }) => {
  if (selectedMessage.value) {
    try {
      await replyToMessage(selectedMessage.value.id, replyData)
      showReplyModal.value = false
      selectedMessage.value = null
    } catch (err) {
      console.error('Failed to send reply:', err)
    }
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Lifecycle
onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>