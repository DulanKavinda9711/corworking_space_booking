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
              <h1 class="text-2xl font-bold text-gray-900">Cancel Subscription</h1>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-orange-600">Subscription Cancellation</span>
          </div>
        </div>

      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-card p-12">
        <div class="flex flex-col items-center justify-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p class="text-gray-600">Loading subscription details...</p>
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
          <h3 class="text-lg font-medium text-gray-900">Subscription Not Found</h3>
          <p class="text-gray-600 text-center">{{ error }}</p>
          <button
            @click="goBack"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      <!-- Subscription Details and Cancellation Form -->
      <div v-if="subscription && !loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Subscription Information -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiInformationOutline" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Subscription Details</h2>
          </div>

          <div class="space-y-4">
            <!-- Subscription ID -->
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Subscription ID</span>
              <span class="text-sm font-semibold text-gray-900">{{ subscription.id }}</span>
            </div>

            <!-- Customer -->
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Customer</span>
              <span class="text-sm text-gray-900">{{ subscription.customerName }}</span>
            </div>

            <!-- Product -->
            <div class="flex justify-between items-start py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Product</span>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">{{ subscription.productName }}</div>
                <div class="text-xs text-gray-500">{{ subscription.locationName }}</div>
              </div>
            </div>

            <!-- Subscription Type -->
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Subscription Type</span>
              <span class="text-sm text-gray-900 capitalize">{{ subscription.subscriptionType }}</span>
            </div>

            <!-- Subscribed Date -->
            <div class="flex justify-between items-start py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Subscribed Date</span>
              <div class="text-right">
                <div class="text-sm text-gray-900">{{ formatDate(subscription.subscribedDate) }}</div>
              </div>
            </div>

            <!-- Next Billing Date -->
            <div class="flex justify-between items-start py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Next Billing Date</span>
              <div class="text-right">
                <div class="text-sm text-gray-900">{{ formatDate(subscription.nextBillingDate) }}</div>
                <div class="text-xs text-orange-600 font-medium">Service ends on this date</div>
              </div>
            </div>

            <!-- Monthly Price -->
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">{{ subscription.subscriptionType === 'annually' ? 'Annual' : 'Monthly' }} Price</span>
              <span class="text-sm font-bold text-gray-900">${{ subscription.totalPrice }}</span>
            </div>

            <!-- Status -->
            <div class="flex justify-between items-center py-3">
              <span class="text-sm font-medium text-gray-600">Current Status</span>
              <span :class="getStatusClass(subscription.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ subscription.status === 'confirmed' ? 'Active' : subscription.status }}
              </span>
            </div>
          </div>

          <!-- Billing Information Box -->
          <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">
                  Billing Information
                </h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>• Service continues until: <strong>{{ formatDate(subscription.nextBillingDate) }}</strong></p>
                  <p>• No further charges will be made</p>
                  <p>• Access remains active for {{ calculateDaysUntilEnd() }} days</p>
                </div>
              </div>
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
                rows="4"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900"
                placeholder="Please provide the reason for cancellation..."
              ></textarea>
            </div>

            <!-- Send payment slip option -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <label class="flex items-start space-x-3">
                <input
                  type="checkbox"
                  v-model="cancellationForm.sendPaymentSlip"
                  class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div>
                  <div class="text-sm font-medium text-gray-900">Send payment slip to customer</div>
                  <div class="text-xs text-gray-600 mt-1">Check this option to send a payment slip/receipt to the customer via email</div>
                </div>
              </label>

              <!-- Upload Payment Slip Section - Shows when checkbox is checked -->
              <div v-if="cancellationForm.sendPaymentSlip" class="mt-4 pt-4 border-t border-green-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Upload Payment Slip <span class="text-red-500">*</span>
                </label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer" @click="triggerFileUpload">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                    </svg>
                    <div class="text-sm text-gray-600 mb-2">
                      <span class="text-blue-600 font-medium hover:text-blue-500">Click to upload</span>
                      <span> or drag and drop</span>
                    </div>
                    <div class="text-xs text-gray-500">PDF, PNG, JPG, DOC up to 10MB</div>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    class="hidden"
                    @change="handleFileUpload"
                  />
                </div>
                
                <!-- Display uploaded file name -->
                <div v-if="uploadedFileName" class="mt-2 flex items-center text-sm text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ uploadedFileName }}
                </div>
              </div>
            </div>

            <!-- Customer Notification Options -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="text-sm font-medium text-blue-800 mb-3">Customer Notification</h3>
              <div class="space-y-4">
                <div class="text-sm text-gray-700">Notifications will be sent to the customer's contact below. Choose which channels to use.</div>

                <!-- Email Notification -->
                <div class="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                  <input
                    type="checkbox"
                    v-model="cancellationForm.notifyEmail"
                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-3"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">Email</div>
                    <div class="text-xs text-gray-600">{{ subscription?.customerEmail || 'No email available' }}</div>
                  </div>
                </div>

                <!-- Mobile Notification -->
                <div class="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                  <input
                    type="checkbox"
                    v-model="cancellationForm.notifySms"
                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-3"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">Mobile (SMS)</div>
                    <div class="text-xs text-gray-600">{{ subscription?.customerPhone || 'No phone available' }}</div>
                  </div>
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
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-orange-100">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Confirm Subscription Cancellation</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to cancel this subscription? This action cannot be undone.
            </p>
            <div v-if="subscription" class="mt-4 p-3 bg-gray-50 rounded-lg text-gray-900">
              <div class="text-sm space-y-1">
                <div><strong>Subscription:</strong> {{ subscription.productName }}</div>
                <div><strong>Customer:</strong> {{ subscription.customerName }}</div>
                <div><strong>End Date:</strong> {{ formatDate(subscription.nextBillingDate) }}</div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeConfirmModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Keep Subscription
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
              <span>{{ isCancelling ? 'Cancelling...' : 'Yes, Cancel Subscription' }}</span>
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
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Subscription Cancelled Successfully</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              The subscription has been cancelled and the customer has been notified.
            </p>
            <div v-if="cancellationResult" class="mt-4 p-3 bg-gray-50 rounded-lg text-gray-900">
              <div class="text-sm space-y-1">
                <div><strong>Cancellation ID:</strong> {{ cancellationResult.cancellationId }}</div>
                <div><strong>End Date:</strong> {{ formatDate(subscription.nextBillingDate) }}</div>
                <div v-if="cancellationResult.refundAmount > 0">
                  <strong>Refund Amount:</strong> ${{ cancellationResult.refundAmount }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4">
            <button
              @click="goBackToSubscriptions"
              class="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              Back to Subscriptions
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiArrowLeft, mdiCancel, mdiInformationOutline, mdiAlertCircle, mdiCheckCircle } from '@mdi/js'

// Router
const route = useRoute()
const router = useRouter()

// State
const loading = ref(true)
const error = ref('')
const subscription = ref<any>(null)
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const isCancelling = ref(false)
const cancellationResult = ref<any>(null)
const uploadedFileName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Cancellation Form
const cancellationForm = ref({
  reason: '',
  sendPaymentSlip: false,
  paymentSlipFile: null as File | null,
  notifyEmail: true,
  notifySms: false
})

// Sample subscription data (fallback when API fails)
const allSubscriptions = ref([
  {
    id: '1001',
    bookingId: '1001',
    productName: 'Dedicated Desk',
    productType: 'Subscription',
    productId: 'SUB001',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    subscriptionType: 'monthly',
    subscribedDate: '2025-08-01',
    nextBillingDate: '2025-11-01',
    totalPrice: 800,
    basePrice: 750,
    additionalFacilities: 50,
    status: 'ongoing',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.',
    capacity: 1,
    facilities: ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line']
  },
  {
    id: '1002',
    bookingId: '1002',
    productName: 'Hot Desk',
    productType: 'Subscription',
    productId: 'SUB002',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'registered',
    subscriptionType: 'monthly',
    subscribedDate: '2025-09-01',
    nextBillingDate: '2025-12-01',
    totalPrice: 500,
    basePrice: 450,
    additionalFacilities: 50,
    status: 'ongoing',
    location: 'business-center',
    locationName: 'Business Center',
    companyName: 'Global Solutions Inc.',
    capacity: 1,
    facilities: ['WiFi', 'Shared Workspace', 'Coffee Machine Access']
  }
])

// Computed properties
const canCancel = computed(() => {
  const hasReason = cancellationForm.value.reason.trim() !== ''
  const hasPaymentSlipIfRequired = !cancellationForm.value.sendPaymentSlip || cancellationForm.value.paymentSlipFile !== null
  return hasReason && hasPaymentSlipIfRequired
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateDaysUntilEnd = () => {
  if (!subscription.value?.nextBillingDate) return 0
  
  const today = new Date()
  const endDate = new Date(subscription.value.nextBillingDate)
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(0, diffDays)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, PNG, JPG, and DOC files are allowed')
      return
    }
    
    cancellationForm.value.paymentSlipFile = file
    uploadedFileName.value = file.name
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const loadSubscriptionDetails = async () => {
  try {
    loading.value = true
    error.value = ''

    const subscriptionId = route.params.id as string

    try {
      // Import bookingApi to fetch subscription data (same as BookingsView)
      const { bookingApi } = await import('@/services/api')
      
      console.log('Fetching subscription data from API...')
      
      // Fetch subscriptions from API (same as BookingsView)
      const response = await bookingApi.getAdminSubscriptionTable()

      if (response.success && response.data && response.data.length > 0) {
        console.log('API response success, mapping data:', response.data.length, 'subscriptions')
        
        // Map API response to expected format (same as BookingsView)
        allSubscriptions.value = response.data.map((item: any) => ({
          id: item.booking_id,
          bookingId: item.booking_id,
          productName: item.product_type,
          productType: 'Subscription',
          productId: `SUB${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
          customerName: `${item.first_name} ${item.last_name}`,
          customerEmail: item.email,
          customerPhone: item.phone || '+1 (555) 000-0000',
          userType: item.customer_type ? String(item.customer_type).charAt(0).toUpperCase() + String(item.customer_type).slice(1).toLowerCase() : 'Registered',
          subscriptionType: item.package_type,
          subscribedDate: item.subscribed_date,
          nextBillingDate: item.next_billing_date,
          subscriptionEndDate: item.subscription_end_date,
          totalPrice: item.total_price,
          basePrice: Math.floor(item.total_price * 0.9), // Calculate base price as 90% of total
          additionalFacilities: Math.floor(item.total_price * 0.1), // Calculate additional facilities as 10% of total
          status: item.status.toLowerCase() === 'unknown' ? 'ongoing' : item.status.toLowerCase(),
          location: item.location_name ? item.location_name.toLowerCase().replace(/\s/g, '-') : 'main-branch',
          locationName: item.location_name,
          companyName: 'Premium Co-working Ltd.',
          capacity: 1,
          facilities: ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line']
        }))
        
        console.log('Successfully mapped', allSubscriptions.value.length, 'subscriptions')
      } else {
        console.warn('API call failed or returned no data:', response.message || 'No data')
        console.log('Using fallback sample data')
      }
    } catch (apiError) {
      console.error('Error calling subscription API:', apiError)
      console.log('Using fallback sample data due to API error')
    }

    // Find subscription
    console.log('Looking for subscription ID:', subscriptionId)
    console.log('Available subscription IDs:', allSubscriptions.value.map(s => s.id))
    
    const found = allSubscriptions.value.find(s => s.id === subscriptionId)
    if (!found) {
      console.error('Subscription not found. Available subscriptions:', allSubscriptions.value)
      error.value = `Subscription with ID ${subscriptionId} not found.`
      return
    }
    
    console.log('Found subscription:', found)

    // If customerEmail or customerPhone is missing, fetch from customersData
    if (!found.customerEmail || !found.customerPhone) {
      try {
        // Dynamically import customersData from useCustomers.ts
        // Use relative import for Vite/Vue
        const { customersData } = await import('../../composables/useCustomers')
  const customer = customersData.value.find((c: any) => c.name === found.customerName)
        if (customer) {
          if (!found.customerEmail && customer.email) found.customerEmail = customer.email
          if (!found.customerPhone && customer.phone) found.customerPhone = customer.phone
        }
      } catch (err) {
        console.warn('Could not fetch customer contact from useCustomers:', err)
      }
    }

    subscription.value = found

    // Check if subscription can be cancelled
    const cancellableStatuses = ['confirmed', 'ongoing', 'upcoming']
    if (!cancellableStatuses.includes(subscription.value.status)) {
      error.value = `Only active subscriptions can be cancelled. Current status: ${subscription.value.status}`
      return
    }

  } catch (err) {
    console.error('Error loading subscription:', err)
    error.value = 'An error occurred while loading the subscription details.'
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
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update subscription status
    if (subscription.value && subscription.value.id) {
      // Update in allSubscriptions
      const index = allSubscriptions.value.findIndex(s => s.id === subscription.value.id)
      if (index > -1) {
        allSubscriptions.value[index].status = 'cancelled'
      }

      // Update in localStorage
      const savedBookings = JSON.parse(localStorage.getItem('allBookings') || '[]')
      const bookingIndex = savedBookings.findIndex((b: any) => b.id === subscription.value.id)
      if (bookingIndex > -1) {
        savedBookings[bookingIndex].status = 'cancelled'
        localStorage.setItem('allBookings', JSON.stringify(savedBookings))
      }

      // Save status update
      const bookingStatuses = JSON.parse(localStorage.getItem('bookingStatuses') || '{}')
      bookingStatuses[subscription.value.id] = 'cancelled'
      localStorage.setItem('bookingStatuses', JSON.stringify(bookingStatuses))
    }

    // Generate cancellation result
    cancellationResult.value = {
      cancellationId: `CANCEL-${Date.now()}`,
      refundAmount: 0
    }

    // Log cancellation
    const cancellationLogs = JSON.parse(localStorage.getItem('subscriptionCancellationLogs') || '[]')
    cancellationLogs.push({
      subscriptionId: subscription.value.id,
      cancelledAt: new Date().toISOString(),
      reason: cancellationForm.value.reason,
      sendPaymentSlip: cancellationForm.value.sendPaymentSlip,
      paymentSlipFileName: cancellationForm.value.paymentSlipFile?.name || null,
      cancelledBy: 'Admin',
      customerNotified: cancellationForm.value.notifyEmail || cancellationForm.value.notifySms,
      emailNotified: cancellationForm.value.notifyEmail,
      smsNotified: cancellationForm.value.notifySms,
      customerEmail: subscription.value.customerEmail,
      customerPhone: subscription.value.customerPhone
    })
    localStorage.setItem('subscriptionCancellationLogs', JSON.stringify(cancellationLogs))

    closeConfirmModal()
    showSuccessModal.value = true

    console.log('Subscription cancelled successfully:', subscription.value.id)

  } catch (error) {
    console.error('Error cancelling subscription:', error)
    alert('Error cancelling subscription. Please try again.')
  } finally {
    isCancelling.value = false
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  isCancelling.value = false
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}

const goBack = () => {
  router.push('/bookings?tab=subscriptions')
}

const goBackToSubscriptions = () => {
  router.push('/bookings?tab=subscriptions')
}

onMounted(() => {
  loadSubscriptionDetails()
})

// Watch for checkbox changes to clear file when unchecked
watch(() => cancellationForm.value.sendPaymentSlip, (newValue) => {
  if (!newValue) {
    cancellationForm.value.paymentSlipFile = null
    uploadedFileName.value = ''
    // Clear file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
})
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
