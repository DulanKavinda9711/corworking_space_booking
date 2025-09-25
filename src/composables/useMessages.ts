import { ref, computed } from 'vue'
import { messageApi, type Message as ApiMessage } from '@/services/api'

// Local Message interface for the composable (adapted for UI needs)
export interface Message {
  id: string
  name: string
  email: string
  message: string
  date: string
  status: 'unread' | 'read' | 'replied'
}

// Filter interface
export interface MessageFilters {
  startDate?: string
  endDate?: string
  name?: string
  email?: string
  status?: string
}

// Adapter functions to convert between API and local formats
const apiMessageToLocal = (apiMessage: ApiMessage): Message => ({
  id: apiMessage.id,
  name: apiMessage.customerName,
  email: apiMessage.customerEmail,
  message: apiMessage.message,
  date: apiMessage.sentAt,
  status: apiMessage.status === 'sent' ? 'unread' : apiMessage.status === 'delivered' ? 'read' : 'replied'
})

const localMessageToApi = (localMessage: Message): ApiMessage => ({
  id: localMessage.id,
  customerName: localMessage.name,
  customerEmail: localMessage.email,
  subject: '', // Not used in current implementation
  message: localMessage.message,
  contactMethod: 'email' as const,
  recipientContact: localMessage.email,
  sentAt: localMessage.date,
  sentBy: 'admin',
  status: localMessage.status === 'unread' ? 'sent' : localMessage.status === 'read' ? 'delivered' : 'failed',
  priority: 'normal' as const
})

// API service functions using real API
const fetchMessages = async (): Promise<Message[]> => {
  try {
    const response = await messageApi.getAllMessages()
    if (response.success && response.data) {
      return response.data.map(apiMessageToLocal)
    } else {
      console.error('Failed to fetch messages:', response.message)
      return []
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

const updateMessageStatus = async (messageId: string, status: Message['status']): Promise<void> => {
  // Note: This would need a specific API endpoint for updating message status
  // For now, we'll just log it as the API might not have this endpoint yet
  console.log(`Message ${messageId} status would be updated to ${status}`)
  // You can implement this when the backend provides the endpoint
}

const deleteMessage = async (messageId: string): Promise<void> => {
  // Note: This would need a specific API endpoint for deleting messages
  // For now, we'll just log it as the API might not have this endpoint yet
  console.log(`Message ${messageId} would be deleted`)
  // You can implement this when the backend provides the endpoint
}

const sendReply = async (messageId: string, replyData: { subject: string; message: string; contactMethod: string }, messageData: Message): Promise<void> => {
  try {
    const response = await messageApi.sendMessage({
      customerId: messageId,
      customerName: messageData.name,
      customerEmail: messageData.email,
      subject: replyData.subject,
      message: replyData.message,
      contactMethod: replyData.contactMethod as 'email' | 'sms' | 'phone',
      recipientContact: messageData.email,
      sentBy: 'admin',
      priority: 'normal'
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to send reply')
    }
  } catch (error) {
    console.error('Error sending reply:', error)
    throw error
  }
}

// Composable function
export const useMessages = () => {
  // Reactive state
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const filters = ref<MessageFilters>({
    startDate: '',
    endDate: '',
    name: '',
    email: '',
    status: ''
  })

  // Computed filtered messages
  const filteredMessages = computed(() => {
    let filtered = messages.value

    // Date range filter
    if (filters.value.startDate && filters.value.endDate) {
      filtered = filtered.filter(message => {
        const messageDate = new Date(message.date)
        const startDate = new Date(filters.value.startDate!)
        const endDate = new Date(filters.value.endDate!)
        endDate.setHours(23, 59, 59, 999)
        return messageDate >= startDate && messageDate <= endDate
      })
    }

    // Name filter
    if (filters.value.name) {
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(filters.value.name!.toLowerCase())
      )
    }

    // Email filter
    if (filters.value.email) {
      filtered = filtered.filter(message =>
        message.email.toLowerCase().includes(filters.value.email!.toLowerCase())
      )
    }

    // Status filter
    if (filters.value.status) {
      filtered = filtered.filter(message => message.status === filters.value.status)
    }

    return filtered
  })

  // Computed stats
  const unreadCount = computed(() => messages.value.filter(m => m.status === 'unread').length)
  const totalCount = computed(() => messages.value.length)

  // Actions
  const loadMessages = async () => {
    loading.value = true
    error.value = null

    try {
      messages.value = await fetchMessages()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load messages'
      console.error('Error loading messages:', err)
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await updateMessageStatus(messageId, 'read')
      const message = messages.value.find(m => m.id === messageId)
      if (message) {
        message.status = 'read'
      }
    } catch (err) {
      console.error('Error marking message as read:', err)
      throw err
    }
  }

  const markAsReplied = async (messageId: string) => {
    try {
      await updateMessageStatus(messageId, 'replied')
      const message = messages.value.find(m => m.id === messageId)
      if (message) {
        message.status = 'replied'
      }
    } catch (err) {
      console.error('Error marking message as replied:', err)
      throw err
    }
  }

  const removeMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId)
      const index = messages.value.findIndex(m => m.id === messageId)
      if (index > -1) {
        messages.value.splice(index, 1)
      }
    } catch (err) {
      console.error('Error deleting message:', err)
      throw err
    }
  }

  const replyToMessage = async (messageId: string, replyData: { subject: string; message: string; contactMethod: string }) => {
    try {
      const message = messages.value.find(m => m.id === messageId)
      if (!message) {
        throw new Error('Message not found')
      }
      await sendReply(messageId, replyData, message)
      await markAsReplied(messageId)
    } catch (err) {
      console.error('Error sending reply:', err)
      throw err
    }
  }

  const resetFilters = () => {
    filters.value = {
      startDate: '',
      endDate: '',
      name: '',
      email: '',
      status: ''
    }
  }

  return {
    // State
    messages,
    loading,
    error,
    filters,

    // Computed
    filteredMessages,
    unreadCount,
    totalCount,

    // Actions
    loadMessages,
    markAsRead,
    markAsReplied,
    removeMessage,
    replyToMessage,
    resetFilters
  }
}