<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiArrowLeft" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ isSubscription ? 'Cancel Subscription' : 'Cancel Booking' }}</h1>
              <p class="text-sm text-gray-600 mt-1">{{ isSubscription ? 'Cancel subscription and manage refunds' : 'Cancel booking and manage refunds' }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-red-600">Cancellation Process</span>
          </div>
        </div>

        <!-- Payment slip quick summary -->
        <div class="mt-4 text-sm text-gray-600">
          <strong>Payment Slip:</strong>
          <span v-if="cancellationForm.sendPaymentSlip">
            Will be sent to customer
            <span v-if="paymentSlipFile" class="text-gray-600"> ({{ paymentSlipFile.name }})</span>
          </span>
          <span v-else>Will not be sent</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-card p-12">
        <div class="flex flex-col items-center justify-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p class="text-gray-600">Loading booking details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error && !loading" class="bg-white rounded-xl shadow-card p-12">
        <div class="flex flex-col items-center justify-center space-y-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiAlertCircle" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">{{ isSubscription ? 'Subscription Not Found' : 'Booking Not Found' }}</h3>
          <p class="text-gray-600 text-center">{{ error }}</p>
          <button
            @click="goBack"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      <!-- Booking Details and Cancellation Form -->
      <div v-if="booking && !loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Booking Information -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiInformationOutline" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">{{ isSubscription ? 'Subscription Details' : 'Booking Details' }}</h2>
          </div>

          <div class="space-y-4">
            <!-- Booking/Subscription ID -->
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">{{ isSubscription ? 'Subscription ID' : 'Booking ID' }}</span>
              <span class="text-sm font-semibold text-gray-900">{{ booking.id }}</span>
            </div>

            <!-- Customer -->
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Customer</span>
              <span class="text-sm text-gray-900">{{ booking.customerName }}</span>
            </div>

            <!-- Product -->
            <div class="flex justify-between items-start py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Product</span>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">{{ booking.productName || booking.productType }}</div>
                <div class="text-xs text-gray-500">{{ booking.locationName }}</div>
              </div>
            </div>

            <!-- Date & Time / Subscription Date -->
            <div class="flex justify-between items-start py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">{{ isSubscription ? 'Subscribed Date' : 'Date & Time' }}</span>
              <div class="text-right">
                <div v-if="isSubscription" class="text-sm text-gray-900">{{ booking.subscribedDate }}</div>
                <div v-else>
                  <div class="text-sm text-gray-900">{{ booking.formattedDate || booking.date }}</div>
                  <div class="text-xs text-gray-500">{{ booking.timeSlot }}</div>
                </div>
              </div>
            </div>

            <!-- Duration & Price (for bookings only) -->
            <div v-if="!isSubscription" class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Duration</span>
              <span class="text-sm text-gray-900">{{ booking.duration }}</span>
            </div>

            <!-- Subscription Type (for subscriptions only) -->
            <div v-if="isSubscription" class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Subscription Type</span>
              <span class="text-sm text-gray-900">{{ booking.subscriptionType }}</span>
            </div>

            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">{{ isSubscription ? 'Monthly/Annual Price' : 'Total Price' }}</span>
              <span class="text-sm font-bold text-gray-900">${{ booking.totalPrice }}</span>
            </div>

            <!-- Status -->
            <div class="flex justify-between items-center py-3">
              <span class="text-sm font-medium text-gray-600">Current Status</span>
              <span :class="getStatusClass(booking.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ booking.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Cancellation Form -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCancel" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Cancellation Details</h2>
          </div>

          <form @submit.prevent="submitCancellation" class="space-y-6">
            <!-- Cancellation Reason -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Reason for Cancellation <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="cancellationForm.reason"
                rows="3"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Please provide the reason for cancellation..."
              ></textarea>
            </div>

            <!-- Payment Slip Option -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <label class="flex items-start space-x-3">
                <input
                  v-model="cancellationForm.sendPaymentSlip"
                  type="checkbox"
                  class="mt-0.5 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div>
                  <div class="text-sm font-medium text-gray-900">Send payment slip to customer</div>
                  <div class="text-xs text-gray-600">Check this option to send a payment slip/receipt to the customer via email</div>
                </div>
              </label>
              
              <!-- Payment Slip Upload Section -->
              <div v-if="cancellationForm.sendPaymentSlip" class="mt-4 pt-4 border-t border-green-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Upload Payment Slip <span class="text-red-500">*</span>
                </label>
                
                <!-- File Upload Area -->
                <div
                  @drop="handleFileDrop"
                  @dragover.prevent="isDragOver = true"
                  @dragenter.prevent="isDragOver = true"
                  @dragleave="dragLeave"
                  :class="[
                    'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                    isDragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-gray-400',
                    paymentSlipFile ? 'bg-green-50 border-green-300' : ''
                  ]"
                  @click="triggerFileInput"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  
                  <div v-if="!paymentSlipFile" class="space-y-2">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div>
                      <p class="text-sm text-gray-600">
                        <span class="font-medium text-primary-600">Click to upload</span> or drag and drop
                      </p>
                      <p class="text-xs text-gray-500">PDF, PNG, JPG, DOC up to 10MB</p>
                    </div>
                  </div>
                  
                  <!-- Selected File Display -->
                  <div v-else class="space-y-2">
                    <svg class="mx-auto h-12 w-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiFileDocument" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ paymentSlipFile.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(paymentSlipFile.size) }}</p>
                    </div>
                    <button
                      type="button"
                      @click.stop="removeFile"
                      class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                    >
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiDelete" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
                
                <!-- File Upload Error -->
                <div v-if="fileUploadError" class="mt-2 text-sm text-red-600">
                  {{ fileUploadError }}
                </div>
              </div>
            </div>

            <!-- Notification Options -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="text-sm font-medium text-blue-800 mb-3">Customer Notification</h3>
              <div class="space-y-4">
                <div class="text-sm text-gray-700">Notifications will be sent to the customer's contact below. Choose which channels to use.</div>

                <label class="flex items-start space-x-3 p-2 bg-white rounded-lg">
                  <input
                    v-model="cancellationForm.notifyEmail"
                    type="checkbox"
                    class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">Email</div>
                    <div class="text-xs text-gray-500">{{ customerInfo.email }}</div>
                  </div>
                </label>

                <label class="flex items-start space-x-3 p-2 bg-white rounded-lg">
                  <input
                    v-model="cancellationForm.notifySms"
                    type="checkbox"
                    class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">Mobile (SMS)</div>
                    <div class="text-xs text-gray-500">{{ customerInfo.mobile }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="goBack"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Bookings
              </button>
              
              <div class="flex items-center space-x-3">
                <button
                  type="button"
                  @click="showConfirmModal = true"
                  :disabled="!canCancel"
                  class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCancel" />
                  </svg>
                  <span>Cancel Booking</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeConfirmModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiAlertCircle" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">{{ isSubscription ? 'Confirm Subscription Cancellation' : 'Confirm Cancellation' }}</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to cancel this {{ isSubscription ? 'subscription' : 'booking' }}? This action cannot be undone.
            </p>
            <div class="mt-4 p-3 bg-gray-50 rounded-lg text-gray-900">
              <div class="text-sm space-y-1">
                <div><strong>{{ isSubscription ? 'Subscription' : 'Booking' }}:</strong> {{ booking?.id }}</div>
                <div><strong>Reason:</strong> {{ cancellationForm.reason }}</div>
                <div><strong>Payment Slip:</strong> 
                  <span v-if="cancellationForm.sendPaymentSlip">Will be sent to customer</span>
                  <span v-else>Will not be sent</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeConfirmModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              {{ isSubscription ? 'Keep Subscription' : 'Keep Booking' }}
            </button>
            <button
              @click="confirmCancellation"
              :disabled="isCancelling"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="isCancelling" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isCancelling ? 'Cancelling...' : (isSubscription ? 'Yes, Cancel Subscription' : 'Yes, Cancel Booking') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeSuccessModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiCheckCircle" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">{{ isSubscription ? 'Subscription Cancelled Successfully' : 'Booking Cancelled Successfully' }}</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              The {{ isSubscription ? 'subscription' : 'booking' }} has been cancelled and the customer has been notified.
            </p>
            <div v-if="cancellationResult" class="mt-4 p-3 bg-gray-50 rounded-lg text-gray-900">
              <div class="text-sm space-y-1">
                <div><strong>Cancellation ID:</strong> {{ cancellationResult.cancellationId }}</div>
                <div><strong>Payment Slip:</strong> 
                  <span v-if="cancellationResult.paymentSlipSent">
                    Sent to customer
                    <span v-if="cancellationResult.paymentSlipFileName" class="text-gray-600">
                      ({{ cancellationResult.paymentSlipFileName }})
                    </span>
                  </span>
                  <span v-else>Not sent</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4">
            <button
              @click="goBackToBookings"
              class="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiArrowLeft, mdiCancel, mdiInformationOutline, mdiAlertCircle, mdiCheckCircle, mdiFileDocument, mdiDelete } from '@mdi/js'
import { useBookings } from '@/composables/useBookings'

// Router
const route = useRoute()
const router = useRouter()

// Bookings composable (single source of truth)
const { getBookingById, updateBookingStatus, initializeBookings } = useBookings()

// State
const loading = ref(true)
const error = ref('')
const booking = ref<any>(null)
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const isCancelling = ref(false)
const cancellationResult = ref<any>(null)

// File upload state
const paymentSlipFile = ref<File | null>(null)
const isDragOver = ref(false)
const fileUploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Cancellation Form
const cancellationForm = ref({
  reason: '',
  sendPaymentSlip: false,
  notifyEmail: true,
  notifySms: false
})

// Customer Information (auto-populated from booking)
const customerInfo = ref({
  email: '',
  mobile: ''
})

// Computed properties
const isSubscription = computed(() => {
  return route.path.includes('/subscriptions/')
})

const canCancel = computed(() => {
  const hasReason = cancellationForm.value.reason.trim() !== ''
  const hasFileIfRequired = !cancellationForm.value.sendPaymentSlip || paymentSlipFile.value !== null
  return hasReason && hasFileIfRequired
})

// Methods
const getStatusClass = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'completed':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const loadBookingDetails = async () => {
  try {
    loading.value = true
    error.value = ''

    // Ensure composable has initialized data
    initializeBookings()

    const bookingId = route.params.id as string

    // Use composable to get booking by id (no hard-coded localStorage logic here)
    const found = getBookingById(bookingId)
    if (!found) {
      error.value = `${isSubscription.value ? 'Subscription' : 'Booking'} with ID ${bookingId} not found.`
      return
    }

    // Normalize booking for display
    booking.value = {
      ...found,
      formattedDate: found.date ? new Date(found.date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }) : found.subscribedDate || 'N/A',
      timeSlot: found.startTime && found.endTime ? `${found.startTime} - ${found.endTime}` : found.duration || 'N/A'
    }

    // Populate customer information automatically
    customerInfo.value = {
      email: booking.value.customerEmail || `${booking.value.customerName?.toLowerCase().replace(' ', '.')}@example.com`,
      mobile: booking.value.customerPhone || '+1 (555) 000-0000'
    }

    // Check if booking/subscription can be cancelled
    if (booking.value.status !== 'confirmed') {
      error.value = `Only confirmed ${isSubscription.value ? 'subscriptions' : 'bookings'} can be cancelled.`
      return
    }

  } catch (err) {
    console.error('Error loading booking:', err)
    error.value = `An error occurred while loading the ${isSubscription.value ? 'subscription' : 'booking'} details.`
  } finally {
    loading.value = false
  }
}

const submitCancellation = () => {
  if (!canCancel.value) return
  showConfirmModal.value = true
}

const confirmCancellation = async () => {
  try {
    isCancelling.value = true

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Use composable to update booking status (single source of truth)
    if (booking.value && booking.value.id) {
      updateBookingStatus(booking.value.id, 'cancelled')
    }

    // Generate cancellation result
    cancellationResult.value = {
      cancellationId: `CANCEL-${Date.now()}`,
      paymentSlipSent: cancellationForm.value.sendPaymentSlip,
      paymentSlipFileName: paymentSlipFile.value?.name || null
    }

    // Log cancellation
    const cancellationLogs = JSON.parse(localStorage.getItem('cancellationLogs') || '[]')
    cancellationLogs.push({
      bookingId: booking.value.id,
      cancelledAt: new Date().toISOString(),
      reason: cancellationForm.value.reason,
      sendPaymentSlip: cancellationForm.value.sendPaymentSlip,
      paymentSlipFileName: paymentSlipFile.value?.name || null,
      cancelledBy: 'Admin',
      customerNotified: cancellationForm.value.notifyEmail,
      smsNotified: cancellationForm.value.notifySms,
      customerEmail: customerInfo.value.email,
      customerMobile: customerInfo.value.mobile
    })
    localStorage.setItem('cancellationLogs', JSON.stringify(cancellationLogs))

    // Update booking status in local view
    if (booking.value) booking.value.status = 'cancelled'

    // Close confirm modal and show success modal
    showConfirmModal.value = false
    showSuccessModal.value = true

  } catch (err) {
    console.error('Error cancelling booking:', err)
  } finally {
    isCancelling.value = false
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}

const goBack = () => {
  router.back()
}

const goBackToBookings = () => {
  if (isSubscription.value) {
    router.push({ path: '/bookings', query: { tab: 'subscriptions' } })
  } else {
    router.push('/bookings')
  }
}

// File handling methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files[0]) {
    handleFile(files[0])
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    handleFile(files[0])
  }
}

const dragLeave = () => {
  isDragOver.value = false
}

const handleFile = (file: File) => {
  // Reset error
  fileUploadError.value = ''
  
  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    fileUploadError.value = 'Please select a PDF, JPG, PNG, or DOC file.'
    return
  }
  
  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    fileUploadError.value = 'File size must be less than 10MB.'
    return
  }
  
  // Set the file
  paymentSlipFile.value = file
}

const removeFile = () => {
  paymentSlipFile.value = null
  fileUploadError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Lifecycle
onMounted(() => {
  loadBookingDetails()
})
</script>
