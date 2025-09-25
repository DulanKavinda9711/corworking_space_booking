<template>
  <AdminLayout>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <!-- <div class="text-center">
        <svg class="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Loading Booking Details</h3>
        <p class="text-gray-600">Please wait while we fetch the booking information...</p>
      </div> -->
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-64">
      <div class="text-center">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Booking</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <router-link :to="getBackNavigationPath()" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ getBackNavigationLabel() }}
        </router-link>
      </div>
    </div>

    <!-- Booking Details -->
    <div v-else-if="booking" class="space-y-6 max-w-6xl mx-auto">
      <!-- Back Button -->
      <div class="flex items-center">
        <router-link :to="getBackNavigationPath()" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ getBackNavigationLabel() }}
        </router-link>
      </div>

      <!-- Booking Header -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Booking Details – {{ booking.id }}</h1>
            <p class="text-gray-600 mt-1">{{ booking.productName }} • {{ formatDate(booking.date) }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <span :class="getStatusClass(booking.status)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{ booking.status }}
            </span>
            <!-- <button 
              v-if="booking.status !== 'cancelled'"
              @click="confirmCancelBooking"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Cancel Booking
            </button> -->
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Customer Information -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiAccount" />
            </svg>
            Customer Information
          </h2>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiAccount" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ booking.customerName }}</h3>
                <p class="text-sm text-gray-500">{{ booking.customerEmail }}</p>
                <div v-if="getCustomerDetails(booking).isRegistered" class="flex items-center space-x-2 mt-1">
                  <span class="text-xs text-blue-600 font-medium">ID: {{ getCustomerDetails(booking).customerId }}</span>
                  <span class="text-xs text-gray-400">•</span>
                  <span class="text-xs text-gray-600">{{ getCustomerDetails(booking).totalBookings }} total bookings</span>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                <p class="text-sm text-gray-900">{{ booking.customerPhone }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</label>
                <div class="flex items-center space-x-2 mt-1">
                  <span :class="booking.userType === 'registered' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" 
                        class="inline-block px-2 py-1 text-xs font-medium rounded-full">
                    {{ booking.userType }}
                  </span>
                  <span v-if="getCustomerDetails(booking).isRegistered"
                        :class="getCustomerStatusClass(getCustomerDetails(booking).customerStatus || 'inactive')"
                        class="inline-block px-2 py-1 text-xs font-medium rounded-full">
                    {{ getCustomerDetails(booking).customerStatus || 'inactive' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="booking.customerMessage" class="pt-4 border-t border-gray-200">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Message</label>
              <p class="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">{{ booking.customerMessage }}</p>
            </div>
            <!-- <div v-if="booking.userType === 'registered'" class="pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-4">
                <button v-if="getCustomerDetails(booking).isRegistered" 
                        @click="viewCustomerProfile" 
                        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiEye" />
                  </svg>
                  View Profile
                </button>
                <span v-else class="text-gray-400 text-sm">Profile not available</span>
                <button v-if="getCustomerDetails(booking).isRegistered" 
                        @click="openSendMessageModal" 
                        class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiMessage" />
                  </svg>
                  Send Message
                </button>
              </div>
            </div> -->
          </div>
        </div>

        <!-- Product Information -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiOfficeBuilding" />
            </svg>
            Product Information
          </h2>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <img class="w-16 h-16 rounded-lg object-cover" :src="booking.productImage" :alt="booking.productName">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ booking.productName }}</h3>
                <p class="text-sm text-gray-500">{{ booking.productType }}</p>
                <p class="text-sm text-gray-500">{{ booking.locationName }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</label>
                <p class="text-sm text-gray-900">{{ booking.capacity }} {{ booking.capacity === 1 ? 'person' : 'people' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Facilities</label>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="facility in booking.facilities" :key="facility" 
                        class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {{ facility }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Time / Subscription Info -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiCalendarClock" />
          </svg>
          {{ booking.productType === 'Subscription' ? 'Subscription Details' : 'Booking Time' }}
        </h2>
        
        <!-- For Meeting Room and Hot Desk (hourly booking) -->
        <div v-if="booking.productType === 'Meeting Room' || booking.productType === 'Hot Desk'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <label class="text-xs font-medium text-blue-600 uppercase tracking-wider">Date</label>
            <p class="text-lg font-semibold text-blue-900 mt-1">{{ formatDate(booking.date) }}</p>
            <span class="text-xs text-blue-600 mt-1 block">Hourly Booking</span>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <label class="text-xs font-medium text-green-600 uppercase tracking-wider">Start Time</label>
            <p class="text-lg font-semibold text-green-900 mt-1">{{ booking.startTime }}</p>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <label class="text-xs font-medium text-orange-600 uppercase tracking-wider">End Time</label>
            <p class="text-lg font-semibold text-orange-900 mt-1">{{ booking.endTime }}</p>
          </div>
        </div>
        
        <!-- For Dedicated Desk (monthly or annually) -->
        <div v-else-if="booking.productType === 'Dedicated Desk'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <label class="text-xs font-medium text-purple-600 uppercase tracking-wider">Start Date</label>
            <p class="text-lg font-semibold text-purple-900 mt-1">{{ formatDate(booking.date) }}</p>
            <span class="text-xs text-purple-600 mt-1 block">Subscription Based</span>
          </div>
          <div class="text-center p-4 bg-teal-50 rounded-lg">
            <label class="text-xs font-medium text-teal-600 uppercase tracking-wider">Billing Period</label>
            <p class="text-lg font-semibold text-teal-900 mt-1 capitalize">{{ booking.subscriptionType || 'Monthly' }}</p>
            <span class="text-xs text-teal-600 mt-1 block">{{ booking.subscriptionType === 'annually' ? 'Annual' : 'Monthly' }} Rate</span>
          </div>
          <div class="text-center p-4 bg-indigo-50 rounded-lg">
            <label class="text-xs font-medium text-indigo-600 uppercase tracking-wider">Next Billing</label>
            <p class="text-lg font-semibold text-indigo-900 mt-1">{{ formatSubscriptionDate(booking.nextBillingDate) }}</p>
          </div>
        </div>
        
        <!-- For subscriptions (legacy) -->
        <div v-else-if="booking.productType === 'Subscription'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <label class="text-xs font-medium text-blue-600 uppercase tracking-wider">Subscribed Date</label>
            <p class="text-lg font-semibold text-blue-900 mt-1">{{ formatSubscriptionDate(booking.subscribedDate) }}</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <label class="text-xs font-medium text-green-600 uppercase tracking-wider">Subscription Type</label>
            <p class="text-lg font-semibold text-green-900 mt-1 capitalize">{{ booking.subscriptionType }}</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <label class="text-xs font-medium text-purple-600 uppercase tracking-wider">Next Billing</label>
            <p class="text-lg font-semibold text-purple-900 mt-1">{{ formatSubscriptionDate(booking.nextBillingDate) }}</p>
          </div>
        </div>
        
        <!-- Default for other product types -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ formatDate(booking.date) }}</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ booking.startTime }}</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ booking.endTime }}</p>
          </div>
        </div>
      </div>

      <!-- Price Breakdown -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiCurrencyUsd" />
          </svg>
          Price Breakdown
        </h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Base Price</span>
            <span class="text-gray-900">LKR {{ booking.basePrice }}</span>
          </div>
          
          <!-- Show individual facilities if available -->
          <div v-if="booking.facilities && booking.facilities.length > 0" class="space-y-2">
            <div class="text-sm font-medium text-gray-700">Additional Facilities:</div>
            <div v-for="facility in getFacilityDetails()" :key="facility.name" class="flex justify-between text-sm">
              <span class="text-gray-600">{{ facility.name }}</span>
              <span class="text-gray-900">LKR {{ facility.price }}</span>
            </div>
          </div>
          <div v-else class="flex justify-between">
            <span class="text-gray-600">Additional Facilities</span>
            <span class="text-gray-900">LKR {{ booking.additionalFacilities }}</span>
          </div>
          
          <div class="border-t border-gray-200 pt-3">
            <div class="flex justify-between">
              <span class="text-lg font-semibold text-gray-900">Total</span>
              <span class="text-lg font-bold text-primary-600">LKR {{ booking.totalPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading/Not Found state -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Booking Not Found</h3>
        <p class="text-gray-600 mb-4">The booking with ID "{{ route.params.id }}" could not be found.</p>
        <router-link :to="getBackNavigationPath()" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ getBackNavigationLabel() }}
        </router-link>
      </div>
    </div>

    

    <!-- Send Message Modal -->
    <div v-if="showSendMessageModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeSendMessageModal">
      <div class="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiMessage" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Send Message to Customer</h3>
          <div class="mt-2 px-4 py-3">
            <div v-if="booking" class="mb-4 p-3 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-900">
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiAccount" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium">{{ booking.customerName }}</div>
                    <div class="text-xs text-gray-500">{{ booking.customerEmail }}</div>
                  </div>
                </div>
                <div class="text-xs text-gray-600">
                  <span class="font-medium">Booking:</span> {{ booking.productName }} - {{ formatDate(booking.date) }}
                </div>
              </div>
            </div>
            
            <form @submit.prevent="sendMessage">
              <div class="mb-4">
                <label for="messageSubject" class="block text-sm font-medium text-gray-900 mb-2">Subject</label>
                <input
                  id="messageSubject"
                  v-model="messageForm.subject"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  placeholder="Enter message subject"
                />
              </div>
              <div class="mb-4">
                <label for="messageBody" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="messageBody"
                  v-model="messageForm.message"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                  placeholder="Enter your message to the customer..."
                ></textarea>
              </div>
              <div class="mb-4">
                <label for="contactMethod" class="block text-sm font-medium text-gray-700 mb-2">Send via</label>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input
                      v-model="messageForm.contactMethod"
                      type="radio"
                      value="email"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="messageForm.contactMethod"
                      type="radio"
                      value="phone"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Phone Number</span>
                  </label>
                </div>
              </div>
              <div v-if="messageForm.contactMethod === 'email'" class="mb-4">
                <label for="recipientEmail" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  id="recipientEmail"
                  v-model="messageForm.recipientEmail"
                  type="email"
                  placeholder="Enter email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                />
              </div>
              <div v-if="messageForm.contactMethod === 'phone'" class="mb-4">
                <label for="recipientPhone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  id="recipientPhone"
                  v-model="messageForm.recipientPhone"
                  type="tel"
                  :placeholder="booking?.customerPhone || ''"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                />
              </div>
            </form>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeSendMessageModal"
              type="button"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="sendMessage"
              :disabled="isSendingMessage || !messageForm.subject.trim() || !messageForm.message.trim()"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="isSendingMessage" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSendingMessage ? 'Sending...' : 'Send Message' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useCustomers, type Customer } from '@/composables/useCustomers'
import { type Booking } from '@/services/api'
import { mdiAccount, mdiOfficeBuilding, mdiCalendarClock, mdiCurrencyUsd, mdiEye, mdiMessage } from '@mdi/js'
import { bookingApi } from '@/services/api'

const route = useRoute()
const router = useRouter()
const { customers } = useCustomers()

// Modal state

// Send message modal state
const showSendMessageModal = ref(false)
const isSendingMessage = ref(false)
const messageForm = ref({
  subject: '',
  message: '',
  contactMethod: 'email',
  recipientEmail: '',
  recipientPhone: ''
})

// Reactive state for booking data
const booking = ref<Booking | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Store original API data for facility details
const apiBookingData = ref<any>(null)

// Customer lookup function
const getCustomerDetails = (booking: any) => {
  if (!booking) return { isRegistered: false, customerData: null, customerId: null }
  
  if (booking.userType === 'registered') {
    // Find customer by email match
    const customerData = customers.value.find((customer: Customer) => 
      customer.email.toLowerCase() === booking.customerEmail?.toLowerCase()
    )
    
    if (customerData) {
      return {
        isRegistered: true,
        customerData,
        customerId: customerData.id,
        displayName: customerData.name,
        totalBookings: customerData.totalBookings,
        memberSince: customerData.dateJoined,
        customerStatus: customerData.status
      }
    }
  }
  
  // Guest user or customer not found in database
  return {
    isRegistered: false,
    customerData: null,
    customerId: null,
    displayName: booking.customerName,
    totalBookings: 0,
    memberSince: null,
    customerStatus: 'guest'
  }
}

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

const getCustomerStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800'
    case 'blocked':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)

  // Return in YYYY-MM-DD format
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const formatSubscriptionDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  
  // Return in YYYY-MM-DD format
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// Get facility details from stored API data
const getFacilityDetails = () => {
  if (!apiBookingData.value?.products?.[0]?.facility_list) return []
  return apiBookingData.value.products[0].facility_list.map((facility: any) => ({
    name: facility.facility_name || 'Unknown Facility',
    price: facility.price || 0
  }))
}

// Modal functions



const viewCustomerProfile = () => {
  if (!booking.value) return
  
  const customerDetails = getCustomerDetails(booking.value)
  
  if (customerDetails.isRegistered && customerDetails.customerId) {
    // Navigate to customer profile page
    router.push({
      name: 'CustomerDetail',
      params: { id: customerDetails.customerId }
    })
  } else {
    // Show error message for guest users or unregistered customers
    console.warn('Customer profile not available for guest users or unregistered customers')
    alert('Customer profile is only available for registered customers.')
  }
}

// Send message functions
const openSendMessageModal = () => {
  // Reset form when opening modal
  messageForm.value = {
    subject: `Regarding your booking: ${booking.value?.productName} - ${booking.value?.id}`,
    message: '',
    contactMethod: 'email',
    recipientEmail: booking.value?.customerEmail || '',
    recipientPhone: booking.value?.customerPhone || ''
  }
  showSendMessageModal.value = true
}

const closeSendMessageModal = () => {
  showSendMessageModal.value = false
  isSendingMessage.value = false
  // Reset form
  messageForm.value = {
    subject: '',
    message: '',
    contactMethod: 'email',
    recipientEmail: '',
    recipientPhone: ''
  }
}

const sendMessage = async () => {
  if (!booking.value || !messageForm.value.subject.trim() || !messageForm.value.message.trim()) return
  
  isSendingMessage.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Log the message for audit purposes
    const sentMessages = JSON.parse(localStorage.getItem('sentCustomerMessages') || '[]')
    const recipientContact = messageForm.value.contactMethod === 'email' 
      ? messageForm.value.recipientEmail || booking.value.customerEmail
      : messageForm.value.recipientPhone || booking.value.customerPhone
      
    const newMessage = {
      id: `MSG-${Date.now()}`,
      bookingId: booking.value.id,
      customerName: booking.value.customerName,
      customerEmail: booking.value.customerEmail,
      subject: messageForm.value.subject,
      message: messageForm.value.message,
      contactMethod: messageForm.value.contactMethod,
      recipientContact: recipientContact,
      sentAt: new Date().toISOString(),
      sentBy: 'Admin', // In real app, get from auth context
      status: 'sent'
    }
    
    sentMessages.push(newMessage)
    localStorage.setItem('sentCustomerMessages', JSON.stringify(sentMessages))
    
    console.log('Message sent successfully to:', recipientContact)
    console.log('Message details:', newMessage)
    
    // Close modal and show success
    closeSendMessageModal()
    
    // Show success message (in real app, use toast notification)
    const contactType = messageForm.value.contactMethod === 'email' ? 'email' : 'phone'
    const contactDisplay = messageForm.value.contactMethod === 'email' 
      ? messageForm.value.recipientEmail || booking.value.customerEmail
      : messageForm.value.recipientPhone || booking.value.customerPhone
    
    alert(`Message sent successfully to ${booking.value.customerName} via ${contactType}!\n\nContact: ${contactDisplay}\nSubject: ${messageForm.value.subject}`)
    
  } catch (error) {
    console.error('rror sending message:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    isSendingMessage.value = false
  }
}

// Navigation methods for determining correct back button destination
const isHistoricalBooking = (booking: any) => {
  if (!booking) return false
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  // Check if booking is historical based on BookingsView logic
  // 1. Cancelled subscriptions
  if (booking.productType === 'Subscription' && booking.status === 'cancelled') {
    return true
  }
  
  // 2. Completed or cancelled regular bookings
  if (booking.productType !== 'Subscription' && (booking.status === 'completed' || booking.status === 'cancelled')) {
    return true
  }
  
  // 3. Past confirmed bookings (confirmed bookings before today)
  if (booking.status === 'confirmed' && booking.productType !== 'Subscription' && booking.date && booking.date < todayStr) {
    return true
  }
  
  return false
}

const getBackNavigationPath = () => {
  // Check if current booking is historical
  if (booking.value && isHistoricalBooking(booking.value)) {
    return '/bookings?tab=history'
  }
  
  // Check if it's a subscription
  if (booking.value && booking.value.productType === 'Subscription') {
    return '/bookings?tab=subscriptions'
  }
  
  // Default to bookings tab for active/confirmed bookings
  return '/bookings'
}

const getBackNavigationLabel = () => {
  // Check if current booking is historical
  if (booking.value && isHistoricalBooking(booking.value)) {
    return 'Back to History'
  }
  
  // Check if it's a subscription
  if (booking.value && booking.value.productType === 'Subscription') {
    return 'Back to Subscriptions'
  }
  
  // Default label
  return 'Back to Bookings'
}

onMounted(async () => {
  const bookingId = route.params.id as string
  
  if (!bookingId) {
    error.value = 'No booking ID provided'
    isLoading.value = false
    return
  }

  try {
    console.log('Fetching booking details for ID:', bookingId)
    const response = await bookingApi.getAdminBookingView(bookingId)
    
    if (response.success && response.data) {
      const bookingData = response.data
      apiBookingData.value = bookingData // Store original API data
      
      // Extract product data (assuming first product for now)
      const product = bookingData.products?.[0] || {}
      
      // Calculate additional facilities cost
      const additionalFacilitiesCost = product.facility_list?.reduce((total: number, facility: any) => 
        total + (facility.price || 0), 0) || 0
      
      // Map API response to expected booking format
      booking.value = {
        id: bookingData.order_id || bookingId,
        productName: product.product_type || 'Unknown Product',
        productType: product.product_type === 'MeetingRoom' ? 'Meeting Room' : (product.product_type || 'Unknown Type'),
        productId: product.product_id || '',
        productImage: product.product_image || '/assets/meeting-room.png',
        customerName: `${bookingData.first_name || ''} ${bookingData.last_name || ''}`.trim() || 'Unknown Customer',
        customerEmail: bookingData.email || '',
        customerPhone: bookingData.phone || '',
        userType: bookingData.customer_type?.toLowerCase() === 'guest' ? 'guest' : 'registered',
        date: product.booking_date || '',
        startTime: product.start_time || '',
        endTime: product.end_time || '',
        duration: product.duration || '',
        totalPrice: product.total_price || 0,
        basePrice: product.product_price || 0,
        additionalFacilities: additionalFacilitiesCost,
        taxes: bookingData.taxes || 0,
        status: bookingData.status?.toLowerCase() === 'success' ? 'confirmed' : (bookingData.status?.toLowerCase() || 'confirmed'),
        location: product.location_name || '',
        locationName: product.location_name || 'Location Not Specified',
        companyName: bookingData.company_name || '',
        capacity: product.capacity || 1,
        facilities: product.facility_list?.map((f: any) => f.facility_name).filter(Boolean) || ['WiFi', 'Basic Amenities'],
        subscriptionType: product.subscription_type || 'monthly',
        subscribedDate: product.subscribed_date || product.booking_date || '',
        nextBillingDate: product.next_billing_date || product.booking_date || '',
        customerMessage: bookingData.customer_message || ''
      }
      
      console.log('✅ Booking loaded from API:', booking.value.id, booking.value.productName)
      console.log('📋 Full API response:', bookingData)
    } else {
      throw new Error(response.message || 'Failed to load booking details')
    }
  } catch (err) {
    console.error('❌ Error fetching booking:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load booking details'
  } finally {
    isLoading.value = false
  }
})
</script>
