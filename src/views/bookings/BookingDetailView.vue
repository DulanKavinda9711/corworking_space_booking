<template>
  <AdminLayout>
    <div class="space-y-6 max-w-6xl mx-auto" v-if="booking">
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
            <div v-if="booking.userType === 'registered'" class="pt-4 border-t border-gray-200">
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
            </div>
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
          <div class="flex justify-between">
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
import { useCustomers } from '@/composables/useCustomers'
import { mdiAccount, mdiOfficeBuilding, mdiCalendarClock, mdiCurrencyUsd, mdiCancel, mdiEye, mdiMessage } from '@mdi/js'

const route = useRoute()
const router = useRouter()
const { customers } = useCustomers()

// Modal state
const showCancelModal = ref(false)
const isCancelling = ref(false)

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

// Reactive bookings data - same as BookingsView
const allBookings = ref([
  // Confirmed Bookings (Active)
  {
    id: 'BR-2034',
    productName: 'Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    date: '2025-08-20',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    basePrice: 100,
    additionalFacilities: 0,
    taxes: 0,
    status: 'confirmed',
    location: 'main-branch',
    locationName: 'Main Branch',
    capacity: 12,
    facilities: ['WiFi', 'Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning']
  },
  {
    id: 'BR-2035',
    productName: 'Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Michael Brown',
    customerEmail: 'michael.brown@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'guest',
    date: '2025-08-21',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: '8 hours',
    totalPrice: 64, // $8/hour * 8 hours
    basePrice: 64,
    additionalFacilities: 0,
    taxes: 0,
    status: 'confirmed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    capacity: 1,
    facilities: ['WiFi', 'Power Outlet', 'Shared Kitchen', 'Printer Access']
  },
  {
    id: 'BR-2036',
    productName: 'Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'registered',
    date: '2025-08-22',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    duration: '2 hours',
    totalPrice: 100,
    basePrice: 100,
    additionalFacilities: 0,
    taxes: 0,
    status: 'confirmed',
    location: 'main-branch',
    locationName: 'Main Branch',
    capacity: 12,
    facilities: ['WiFi', 'Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning']
  },
  {
    id: 'BR-2037',
    productName: 'Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-23',
    startTime: '8:00 AM',
    endTime: '12:00 PM',
    duration: '4 hours',
    totalPrice: 32,
    basePrice: 32,
    additionalFacilities: 0,
    taxes: 0,
    status: 'confirmed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    capacity: 1,
    facilities: ['WiFi', 'Power Outlet', 'Shared Kitchen', 'Printer Access']
  },
  {
    id: 'BR-2038',
    productName: 'Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200&h=200&fit=crop&crop=center',
    customerName: 'Emma Davis',
    customerEmail: 'emma.davis@example.com',
    customerPhone: '+1 (555) 567-8901',
    userType: 'guest',
    date: '2025-08-24',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    duration: '9 hours',
    totalPrice: 450,
    basePrice: 450,
    additionalFacilities: 0,
    taxes: 0,
    status: 'confirmed',
    location: 'business-center',
    locationName: 'Business Center',
    capacity: 1,
    facilities: ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line']
  },
  {
    id: 'BR-2039',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    date: '2025-08-25',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    duration: '2 hours',
    totalPrice: 100,
    basePrice: 100,
    additionalFacilities: 0,
    taxes: 0,
    status: 'confirmed',
    location: 'main-branch',
    locationName: 'Main Branch',
    capacity: 12,
    facilities: ['WiFi', 'Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning']
  },
  {
    id: 'BR-2040',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'registered',
    date: '2025-08-26',
    startTime: '10:00 AM',
    endTime: '6:00 PM',
    duration: '8 hours',
    totalPrice: 64,
    basePrice: 64,
    additionalFacilities: 0,
    taxes: 0,
    status: 'confirmed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    capacity: 1,
    facilities: ['WiFi', 'Power Outlet', 'Shared Kitchen', 'Printer Access']
  },
  {
    id: 'BR-2041',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200&h=200&fit=crop&crop=center',
    customerName: 'Robert Taylor',
    customerEmail: 'robert.taylor@example.com',
    customerPhone: '+1 (555) 890-1234',
    userType: 'guest',
    date: '2025-08-27',
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    duration: '9 hours',
    totalPrice: 450,
    basePrice: 450,
    additionalFacilities: 0,
    taxes: 0,
    status: 'confirmed',
    location: 'business-center',
    locationName: 'Business Center',
    capacity: 1,
    facilities: ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line']
  },
  // Completed Bookings (History)
  {
    id: 'BR-2020',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-15',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    duration: '2 hours',
    totalPrice: 100,
    basePrice: 100,
    additionalFacilities: 0,
    taxes: 0,
    status: 'completed',
    location: 'main-branch',
    locationName: 'Main Branch',
    capacity: 12,
    facilities: ['WiFi', 'Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning']
  },
  {
    id: 'BR-2021',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    date: '2025-08-16',
    startTime: '8:00 AM',
    endTime: '4:00 PM',
    duration: '8 hours',
    totalPrice: 64,
    basePrice: 64,
    additionalFacilities: 0,
    taxes: 0,
    status: 'completed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    capacity: 1,
    facilities: ['WiFi', 'Power Outlet', 'Shared Kitchen', 'Printer Access']
  },
  {
    id: 'BR-2022',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200&h=200&fit=crop&crop=center',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.anderson@example.com',
    customerPhone: '+1 (555) 345-6789',
    userType: 'guest',
    date: '2025-08-17',
    startTime: '10:00 AM',
    endTime: '6:00 PM',
    duration: '8 hours',
    totalPrice: 400,
    basePrice: 400,
    additionalFacilities: 0,
    taxes: 0,
    status: 'completed',
    location: 'business-center',
    locationName: 'Business Center',
    capacity: 1,
    facilities: ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line']
  },
  {
    id: 'BR-2023',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'registered',
    date: '2025-08-18',
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    duration: '3 hours',
    totalPrice: 150,
    basePrice: 150,
    additionalFacilities: 0,
    taxes: 0,
    status: 'completed',
    location: 'main-branch',
    locationName: 'Main Branch',
    capacity: 12,
    facilities: ['WiFi', 'Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning']
  },
  {
    id: 'BR-2024',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop&crop=center',
    customerName: 'David Miller',
    customerEmail: 'david.miller@example.com',
    customerPhone: '+1 (555) 456-7890',
    userType: 'guest',
    date: '2025-08-14',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    duration: '4 hours',
    totalPrice: 32,
    basePrice: 32,
    additionalFacilities: 0,
    taxes: 0,
    status: 'completed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    capacity: 1,
    facilities: ['WiFi', 'Power Outlet', 'Shared Kitchen', 'Printer Access']
  },
  {
    id: 'BR-2025',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200&h=200&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    date: '2025-08-13',
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    duration: '9 hours',
    totalPrice: 450,
    basePrice: 450,
    additionalFacilities: 0,
    taxes: 0,
    status: 'completed',
    location: 'business-center',
    locationName: 'Business Center',
    capacity: 1,
    facilities: ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line']
  },
  // Cancelled Bookings
  {
    id: 'BR-2010',
    productName: 'Executive Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=center',
    customerName: 'Jennifer Wilson',
    customerEmail: 'jennifer.wilson@example.com',
    customerPhone: '+1 (555) 567-8901',
    userType: 'guest',
    date: '2025-08-12',
    startTime: '3:00 PM',
    endTime: '5:00 PM',
    duration: '2 hours',
    totalPrice: 100,
    basePrice: 100,
    additionalFacilities: 0,
    taxes: 0,
    status: 'cancelled',
    location: 'main-branch',
    locationName: 'Main Branch',
    capacity: 12,
    facilities: ['WiFi', 'Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning']
  },
  {
    id: 'BR-2011',
    productName: 'Flexible Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop&crop=center',
    customerName: 'Kevin Martinez',
    customerEmail: 'kevin.martinez@example.com',
    customerPhone: '+1 (555) 678-9012',
    userType: 'guest',
    date: '2025-08-11',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    duration: '4 hours',
    totalPrice: 32,
    basePrice: 32,
    additionalFacilities: 0,
    taxes: 0,
    status: 'cancelled',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    capacity: 1,
    facilities: ['WiFi', 'Power Outlet', 'Shared Kitchen', 'Printer Access']
  },
  {
    id: 'BR-2012',
    productName: 'Private Dedicated Desk',
    productType: 'Dedicated Desk',
    productId: 'PROD003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200&h=200&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-10',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: '8 hours',
    totalPrice: 400,
    basePrice: 400,
    additionalFacilities: 0,
    taxes: 0,
    status: 'cancelled',
    location: 'business-center',
    locationName: 'Business Center',
    capacity: 1,
    facilities: ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line']
  },
  
  // Subscription Data
  {
    id: 'SUB-3001',
    productName: 'Monthly Dedicated Desk',
    productType: 'Subscription',
    productId: 'SUB001',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200&h=200&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-01',
    startTime: '8:00 AM',
    endTime: '6:00 PM',
    duration: 'Monthly',
    totalPrice: 800,
    basePrice: 750,
    additionalFacilities: 50,
    taxes: 0,
    status: 'confirmed',
    location: 'main-branch',
    locationName: 'Main Branch',
    subscriptionType: 'monthly',
    subscribedDate: '2025-08-01',
    nextBillingDate: '2025-09-01',
    capacity: 1,
    facilities: ['High-speed WiFi', 'Storage Locker', '24/7 Access', 'Printing Credits']
  },
  {
    id: 'SUB-3002',
    productName: 'Weekly Hot Desk Pass',
    productType: 'Subscription',
    productId: 'SUB002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+1 (555) 234-5678',
    userType: 'registered',
    date: '2025-08-15',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: 'Weekly',
    totalPrice: 120,
    basePrice: 100,
    additionalFacilities: 20,
    taxes: 0,
    status: 'confirmed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    subscriptionType: 'weekly',
    subscribedDate: '2025-08-15',
    nextBillingDate: '2025-08-22',
    capacity: 1,
    facilities: ['WiFi Access', 'Coffee/Tea', 'Meeting Room Credits']
  },
  {
    id: 'SUB-3003',
    productName: 'Enterprise Team Space',
    productType: 'Subscription',
    productId: 'SUB003',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=center',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    userType: 'registered',
    date: '2025-07-01',
    startTime: '8:00 AM',
    endTime: '7:00 PM',
    duration: 'Monthly',
    totalPrice: 2500,
    basePrice: 2200,
    additionalFacilities: 300,
    taxes: 0,
    status: 'confirmed',
    location: 'business-center',
    locationName: 'Business Center',
    subscriptionType: 'monthly',
    subscribedDate: '2025-07-01',
    nextBillingDate: '2025-09-01',
    capacity: 10,
    facilities: ['Private Office Space', 'Conference Room', 'Dedicated Phone Line', 'Admin Support']
  },
  {
    id: 'SUB-3004',
    productName: 'Virtual Office Package',
    productType: 'Subscription',
    productId: 'SUB004',
    productImage: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7a5?w=200&h=200&fit=crop&crop=center',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    userType: 'registered',
    date: '2025-08-10',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: 'Monthly',
    totalPrice: 150,
    basePrice: 120,
    additionalFacilities: 30,
    taxes: 0,
    status: 'completed',
    location: 'main-branch',
    locationName: 'Main Branch',
    subscriptionType: 'monthly',
    subscribedDate: '2025-07-10',
    nextBillingDate: '2025-08-10',
    capacity: 0,
    facilities: ['Business Address', 'Mail Handling', 'Phone Answering Service', 'Meeting Room Credits']
  }
])

// Current booking based on route parameter - now reactive with fallbacks
const booking = computed(() => {
  const bookingId = route.params.id as string
  const foundBooking = allBookings.value.find(b => b.id === bookingId)
  
  if (foundBooking) {
    console.log('Booking found:', foundBooking.id, foundBooking)
    
    // Return booking with fallbacks for missing fields
    return {
      ...foundBooking,
      // Ensure all required fields have fallback values
      customerEmail: foundBooking.customerEmail || `${foundBooking.customerName?.toLowerCase().replace(' ', '.')}@example.com`,
      customerPhone: foundBooking.customerPhone || '+1 (555) 000-0000',
      customerMessage: (foundBooking as any).customerMessage || '',
      basePrice: foundBooking.basePrice || foundBooking.totalPrice || 0,
      additionalFacilities: foundBooking.additionalFacilities || 0,
      taxes: foundBooking.taxes || 0,
      capacity: foundBooking.capacity || 1,
      facilities: foundBooking.facilities || ['WiFi', 'Basic Amenities'],
      locationName: foundBooking.locationName || 'Location Not Specified',
      // Subscription-specific fields
      subscriptionType: (foundBooking as any).subscriptionType || 'monthly',
      subscribedDate: (foundBooking as any).subscribedDate || foundBooking.date,
      nextBillingDate: (foundBooking as any).nextBillingDate || foundBooking.date
    }
  } else {
    console.warn('Booking not found for ID:', bookingId)
    console.log('Available booking IDs:', allBookings.value.map(b => b.id))
  }
  
  return null
})

// Customer lookup function
const getCustomerDetails = (booking: any) => {
  if (!booking) return { isRegistered: false, customerData: null, customerId: null }
  
  if (booking.userType === 'registered') {
    // Find customer by email match
    const customerData = customers.value.find(customer => 
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatSubscriptionDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Modal functions
const confirmCancelBooking = () => {
  if (booking.value) {
    // Navigate to the cancel booking page
    router.push(`/bookings/${booking.value.id}/cancel`)
  }
}

const closeCancelModal = () => {
  showCancelModal.value = false
  isCancelling.value = false
}



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

onMounted(() => {
  console.log('Loading booking details for ID:', route.params.id)
  
  // Method to sync missing bookings from BookingsView
  const syncBookingsData = () => {
    // Load bookings from localStorage if available (same as BookingsView)
    const savedBookings = localStorage.getItem('allBookings')
    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings)
        if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
          // Replace current bookings with saved data to ensure sync
          allBookings.value = parsedBookings
          console.log('✅ Synced bookings from localStorage:', parsedBookings.length)
          return true
        }
      } catch (error) {
        console.warn('⚠️ Error loading bookings from localStorage:', error)
      }
    }
    return false
  }
  
  // Try to sync data first
  const synced = syncBookingsData()
  
  // Update booking statuses from localStorage (sync with BookingsView)
  const bookingStatuses = JSON.parse(localStorage.getItem('bookingStatuses') || '{}')
  allBookings.value.forEach(booking => {
    if (bookingStatuses[booking.id]) {
      booking.status = bookingStatuses[booking.id]
    }
  })
  
  // Log current booking lookup for debugging
  const bookingId = route.params.id as string
  const foundBooking = allBookings.value.find(b => b.id === bookingId)
  
  if (foundBooking) {
    console.log('✅ Booking found and loaded:', foundBooking.id, foundBooking.productName)
  } else {
    console.error('❌ Booking not found for ID:', bookingId)
    console.log('📋 Available bookings:', allBookings.value.map(b => ({ id: b.id, name: b.productName })))
    
    if (!synced) {
      console.log('💡 Tip: Make sure BookingsView and BookingDetailView are using the same data source')
    }
  }
})
</script>
