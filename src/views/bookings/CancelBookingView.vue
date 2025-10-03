<template>
  <AdminLayout>
    <div class="space-y-6">
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
              
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-red-600">Cancellation Process</span>
          </div>
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
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
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
              <span class="text-sm font-bold text-gray-900">LKR {{ booking.totalPrice }}</span>
            </div>

            <!-- Status -->
            <div class="flex justify-between items-center py-3">
              <span class="text-sm font-medium text-gray-600">Current Status</span>
              <span :class="getStatusClass(getDynamicStatus(booking))" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusDisplayText(getDynamicStatus(booking)) }}
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
            <!-- Customer Notification -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Send via</label>
                <div class="space-y-3">
                  <label class="flex items-center space-x-3">
                    <input
                      v-model="cancellationForm.sendVia"
                      type="radio"
                      value="email"
                      class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span class="text-sm text-gray-700">Email</span>
                  </label>
                  <label class="flex items-center space-x-3">
                    <input
                      v-model="cancellationForm.sendVia"
                      type="radio"
                      value="phone"
                      class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span class="text-sm text-gray-700">Phone</span>
                  </label>
                </div>
              </div>

              <!-- Subject Field (only for email) -->
              <div v-if="cancellationForm.sendVia === 'email'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  v-model="cancellationForm.subject"
                  type="text"
                  class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md
"
                  placeholder="Message to customer"
                />
              </div>

              <!-- Message Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  v-model="cancellationForm.message"
                  rows="4"
                  class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md
"
                  placeholder="Enter your message to the customer..."
                ></textarea>
              </div>

              <!-- Email Address Field (only for email) -->
              <div v-if="cancellationForm.sendVia === 'email'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  v-model="cancellationForm.emailAddress"
                  type="email"
                  class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md
"
                  :placeholder="customerInfo.email"
                />
                
                <!-- File Upload for Email (can be used as refund proof) -->
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Attach Refund Proof (Optional)</label>
                  <div class="flex items-center space-x-3">
                    <button
                      type="button"
                      @click="triggerFileInput"
                      class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                      </svg>
                      Choose File
                    </button>
                    <span v-if="attachedFile" class="text-sm text-gray-600">{{ attachedFile.name }}</span>
                    <button
                      v-if="attachedFile"
                      type="button"
                      @click="removeAttachedFile"
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                </div>
              </div>

              <!-- Phone Number Field (only for phone) -->
              <div v-if="cancellationForm.sendVia === 'phone'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  v-model="cancellationForm.phoneNumber"
                  type="tel"
                  class="appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-md
"
                  :placeholder="customerInfo.mobile"
                />
                
                <!-- File Upload for Phone (refund proof) -->
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Attach Refund Proof (Optional)</label>
                  <div class="flex items-center space-x-3">
                    <button
                      type="button"
                      @click="triggerFileInput"
                      class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                      </svg>
                      Choose File
                    </button>
                    <span v-if="attachedFile" class="text-sm text-gray-600">{{ attachedFile.name }}</span>
                    <button
                      v-if="attachedFile"
                      type="button"
                      @click="removeAttachedFile"
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                </div>
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

    <!-- Error Modal -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeErrorModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiAlertCircle" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Cancellation Failed</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">{{ errorMessage }}</p>
          </div>
          <div class="flex items-center justify-center pt-4">
            <button
              @click="closeErrorModal"
              class="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Close
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
import { mdiArrowLeft, mdiCancel, mdiInformationOutline, mdiAlertCircle, mdiCheckCircle } from '@mdi/js'
import { useBookings } from '@/composables/useBookings'
import { customerApi, bookingApi } from '@/services/api'

// Router
const route = useRoute()
const router = useRouter()

// Bookings composable (single source of truth)
const { getBookingById, updateBookingStatus } = useBookings()

// State
const loading = ref(true)
const error = ref('')
const booking = ref<any>(null)
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const isCancelling = ref(false)
const cancellationResult = ref<any>(null)
const errorMessage = ref('')

// File upload state (removed as not needed)

// Cancellation Form
const cancellationForm = ref({
  sendVia: 'email',
  subject: '',
  message: '',
  emailAddress: '',
  phoneNumber: ''
})

// File upload state
const attachedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

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
  if (cancellationForm.value.sendVia === 'email') {
    return cancellationForm.value.subject.trim() !== '' && 
           cancellationForm.value.message.trim() !== '' &&
           cancellationForm.value.emailAddress.trim() !== ''
  } else {
    return cancellationForm.value.message.trim() !== '' &&
           cancellationForm.value.phoneNumber.trim() !== ''
  }
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
    case 'on going':
    case 'ongoing':
      return 'bg-blue-100 text-blue-800'
    case 'up comming':
    case 'upcoming':
      return 'bg-yellow-100 text-yellow-800'
    case 'complete':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusDisplayText = (status: string) => {
  switch (status) {
    case 'on going':
      return 'Ongoing'
    case 'up comming':
      return 'Upcoming'
    case 'complete':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    case 'confirmed':
      return 'Confirmed'
    case 'completed':
      return 'Completed'
    case 'ongoing':
      return 'Ongoing'
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

// Get dynamic status based on current time and booking time
const getDynamicStatus = (booking: any) => {
  // Handle cancelled bookings - they stay cancelled
  if (booking.status === 'cancelled') {
    return 'cancelled'
  }

  // Handle subscriptions differently
  if (booking.productType === 'Subscription') {
    const now = new Date()
    const subscribedDate = new Date(booking.subscribedDate)

    if (booking.subscriptionType === 'monthly') {
      // For monthly subscriptions, check if current month is within subscription period
      const nextBillingDate = new Date(booking.nextBillingDate)
      if (now >= subscribedDate && now < nextBillingDate) {
        return 'on going'
      } else if (now < subscribedDate) {
        return 'up comming'
      } else {
        return 'complete'
      }
    } else if (booking.subscriptionType === 'annually') {
      // For annual subscriptions, check if current year is within subscription period
      const nextBillingDate = new Date(booking.nextBillingDate)
      if (now >= subscribedDate && now < nextBillingDate) {
        return 'on going'
      } else if (now < subscribedDate) {
        return 'up comming'
      } else {
        return 'complete'
      }
    }
    return booking.status
  }

  // Handle regular bookings - always calculate based on current time
  const now = new Date()
  const bookingDate = new Date(booking.date)

  // Set the booking date with start and end times
  const [startHour, startMinute] = parseTime(booking.startTime)
  const [endHour, endMinute] = parseTime(booking.endTime)

  const bookingStartTime = new Date(bookingDate)
  bookingStartTime.setHours(startHour, startMinute, 0, 0)

  const bookingEndTime = new Date(bookingDate)
  bookingEndTime.setHours(endHour, endMinute, 0, 0)

  // Compare current time with booking times
  if (now >= bookingStartTime && now <= bookingEndTime) {
    return 'on going'
  } else if (now < bookingStartTime) {
    return 'up comming'
  } else {
    return 'complete'
  }
}

// Helper function to parse time strings like "10:00 AM" or "2:00 PM"
const parseTime = (timeStr: string) => {
  const [time, period] = timeStr.split(' ')
  const [hours, minutes] = time.split(':').map(Number)

  let hour24 = hours
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0
  }

  return [hour24, minutes]
}

const loadBookingDetails = async () => {
  try {
    loading.value = true
    error.value = ''

    const bookingId = route.params.id as string

    // First, check if we have stored customer data from the BookingsView
    let storedCustomerData = null
    try {
      const storedData = sessionStorage.getItem(`cancelBooking_${bookingId}`)
      if (storedData) {
        storedCustomerData = JSON.parse(storedData)
        console.log('Found stored customer data for booking:', storedCustomerData)
      }
    } catch (storageErr) {
      console.warn('Error parsing stored customer data:', storageErr)
    }

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

    // Use stored customer data if available, otherwise fetch from API or fallback to booking data
    if (storedCustomerData && storedCustomerData.email && storedCustomerData.phone) {
      // Use the stored customer data from BookingsView (most accurate)
      console.log('Using stored customer data from BookingsView')
      customerInfo.value = {
        email: storedCustomerData.email,
        mobile: storedCustomerData.phone
      }
    } else if (booking.value.customerEmail) {
      // Fallback to API call if no stored data
      try {
        const customerResponse = await customerApi.getAllCustomers({ email: booking.value.customerEmail })
        if (customerResponse.success && customerResponse.data && customerResponse.data.length > 0) {
          const customer = customerResponse.data[0] // Get the first matching customer
          customerInfo.value = {
            email: customer.email || booking.value.customerEmail,
            mobile: customer.phone || booking.value.customerPhone || '+1 (555) 000-0000'
          }
        } else {
          // Fallback to booking data if customer not found
          customerInfo.value = {
            email: booking.value.customerEmail,
            mobile: booking.value.customerPhone || '+1 (555) 000-0000'
          }
        }
      } catch (customerErr) {
        console.error('Error fetching customer data:', customerErr)
        // Fallback to booking data if API fails
        customerInfo.value = {
          email: booking.value.customerEmail || `${booking.value.customerName?.toLowerCase().replace(' ', '.')}@example.com`,
          mobile: booking.value.customerPhone || '+1 (555) 000-0000'
        }
      }
    } else {
      // Final fallback if no customer email in booking
      customerInfo.value = {
        email: `${booking.value.customerName?.toLowerCase().replace(' ', '.')}@example.com`,
        mobile: booking.value.customerPhone || '+1 (555) 000-0000'
      }
    }

    // Set default form values
    cancellationForm.value.emailAddress = customerInfo.value.email
    cancellationForm.value.phoneNumber = customerInfo.value.mobile
    cancellationForm.value.subject = `Booking Cancellation - ${booking.value.id}`

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

    if (!booking.value) {
      throw new Error('No booking data available')
    }

    // Prepare form data for API call
    const cancellationData = {
      OrderId: booking.value.id,
      ProductId: booking.value.productId || booking.value.id, // Use productId if available, otherwise fallback to booking id
      CancellationReason: cancellationForm.value.message,
      Email: cancellationForm.value.emailAddress,
      Phone: cancellationForm.value.phoneNumber,
      SmsContent: cancellationForm.value.sendVia === 'phone' ? cancellationForm.value.message : '',
      RefundProof: attachedFile.value || undefined
    }

    console.log('Submitting cancellation request:', cancellationData)

    // Call the admin cancel booking API
    const response = await bookingApi.adminCancelBooking(cancellationData)

    if (response.success && response.data) {
      // Update local booking status using composable
      updateBookingStatus(booking.value.id, 'cancelled')

      // Set cancellation result from API response
      cancellationResult.value = {
        cancellationId: response.data.cancellationId,
        message: response.data.message
      }

      // Log cancellation for audit trail
      const cancellationLogs = JSON.parse(localStorage.getItem('cancellationLogs') || '[]')
      cancellationLogs.push({
        bookingId: booking.value.id,
        cancelledAt: new Date().toISOString(),
        cancelledBy: 'Admin',
        sendVia: cancellationForm.value.sendVia,
        subject: cancellationForm.value.subject,
        message: cancellationForm.value.message,
        emailAddress: cancellationForm.value.emailAddress,
        phoneNumber: cancellationForm.value.phoneNumber,
        attachedFile: attachedFile.value?.name || null,
        customerEmail: customerInfo.value.email,
        customerMobile: customerInfo.value.mobile,
        apiResponse: response.data
      })
      localStorage.setItem('cancellationLogs', JSON.stringify(cancellationLogs))

      // Update booking status in local view
      booking.value.status = 'cancelled'

      // Clean up stored customer data after successful cancellation
      try {
        sessionStorage.removeItem(`cancelBooking_${booking.value.id}`)
        console.log('Cleaned up stored customer data for booking:', booking.value.id)
      } catch (cleanupErr) {
        console.warn('Error cleaning up stored customer data:', cleanupErr)
      }

      // Close confirm modal and show success modal
      showConfirmModal.value = false
      showSuccessModal.value = true
    } else {
      // Handle API error response
      const apiErrorMessage = response.message || 'Failed to cancel booking'
      console.error('API cancellation failed:', response)
      errorMessage.value = `Cancellation failed: ${apiErrorMessage}`
      showErrorModal.value = true
    }

  } catch (err: any) {
    console.error('Error cancelling booking:', err)
    const apiErrorMessage = err.message || 'An unexpected error occurred while cancelling the booking'
    errorMessage.value = `Error: ${apiErrorMessage}`
    showErrorModal.value = true
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

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
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
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(files[0].type)) {
      alert('Please select a PDF, JPG, PNG, or DOC file.')
      return
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (files[0].size > maxSize) {
      alert('File size must be less than 10MB.')
      return
    }
    
    attachedFile.value = files[0]
  }
}

const removeAttachedFile = () => {
  attachedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Lifecycle
onMounted(() => {
  loadBookingDetails()
})
</script>
<style>
input[type="checkbox"] {
  transition: all 0.2s ease;
  accent-color: #16a34a; /* Green-600 for fill color */
}
</style>