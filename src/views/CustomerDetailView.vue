<template>
  <AdminLayout>
    <div class="space-y-6" v-if="customer && !loading">
      <!-- Error state -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading customer</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>
      <!-- Back Button -->
      <div class="flex items-center">
        <router-link to="/customers" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Customers
        </router-link>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCalendarCheck" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Total Bookings</h3>
              <p class="text-2xl font-bold text-gray-900">{{ customer.totalBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCurrencyUsd" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Total Spent</h3>
              <p class="text-2xl font-bold text-gray-900">LKR {{ customerStats.totalSpent.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCalendarClock" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Upcoming</h3>
              <p class="text-2xl font-bold text-gray-900">{{ customerStats.upcomingBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCancel" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Cancellations</h3>
              <p class="text-2xl font-bold text-gray-900">{{ customerStats.cancellations }}</p>
            </div>
          </div>
        </div>

        <!-- <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Total Rewards</h3>
              <p class="text-2xl font-bold text-gray-900">LKR {{ customerRewards.toLocaleString() }}</p>
            </div>
          </div>
        </div> -->
      </div>

      <!-- Customer Profile Card -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiAccount" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ customer.name }}</h1>
              
              
              <!-- Profile Information -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-3">
                    <div class="flex items-center text-sm text-gray-600">
                    <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                      <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiEmail" />
                      </svg>
                    </div>
                    {{ customer.email }}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                    <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                      <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiPhone" />
                      </svg>
                    </div>
                    {{ customer.phone }}
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="flex items-center text-sm text-gray-600">
                    <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                      <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCalendar" />
                      </svg>
                    </div>
                    Joined {{ formatDate(customer.dateJoined) }}
                    </div>
                  <div class="flex items-center">
                    <span :class="getCustomerTypeClass(customer.customerType)" class="px-2 py-1 text-xs font-medium rounded-full mr-3">
                      {{ customer.customerType }}
                    </span>
                    <span :class="getStatusClass(customer.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ customer.status === 'active' ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col items-start space-y-3">
            <button 
              @click="toggleCustomerStatus"
              :class="customer.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
              class="w-full px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path :d="customer.status === 'active' ? mdiAccountCancel : mdiAccountCheck" />
              </svg>
              <span>{{ customer.status === 'active' ? 'Make Inactive' : 'Make Active' }}</span>
            </button>
            
            <button 
              @click="openSendMessageModal" 
              class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiMessage" />
              </svg>
              <span>Send Message</span>
            </button>

            <!-- <button
              @click="openAddRewardsModal"
              class="w-full px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
              </svg>
              <span>Add Rewards</span>
            </button> -->
          </div>
        </div>
      </div>

      

      <!-- Booking History -->
      <!-- <div class="bg-white rounded-xl shadow-card">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Booking History</h2>
          <div class="flex items-center space-x-3">
            <select v-model="bookingFilter" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
              <option value="">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div class="overflow-x-auto">
      
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span class="ml-2 text-gray-600">Loading booking history...</span>
          </div>
          
         
          <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ booking.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(booking.date) }}</div>
                  <div class="text-sm text-gray-500">{{ booking.startTime }} - {{ booking.endTime }}</div>
                </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <img class="h-8 w-8 rounded object-cover" :src="booking.productImage" :alt="booking.productName">
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">
                          {{ booking.productType === 'Subscription' ? 'Dedicated Desk' : booking.productType }}
                        </div>
                      </div>
                    </div>
                  </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ booking.duration }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  LKR {{ booking.totalPrice }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getBookingStatusClass(booking.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ booking.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link :to="`/bookings/${booking.id}`" class="text-primary-600 hover:text-primary-900 flex items-center space-x-1" title="View Booking">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiEye" />
                    </svg>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

       
        <div v-if="!loading && filteredBookings.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p class="mt-1 text-sm text-gray-500">This customer has no booking history matching the selected filter.</p>
        </div>
      </div> -->
    </div>

      <!-- Reward Requests (Approved and Rejected) -->
      <!-- <div v-if="customerRewardRequests.length > 0" class="bg-white rounded-xl shadow-card overflow-hidden border-gray-200 mt-6">
        <div class="bg-white shadow-card p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">Reward Requests</h2>
         
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processed Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processed By
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="request in customerRewardRequests" :key="request.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">LKR {{ request.rewardValue.toLocaleString() }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate" :title="request.reason">
                    {{ request.reason }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(request.approvedDate!) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ request.status === 'approved' ? 'Approved' : 'Rejected' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ request.approvedBy }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->

      <!-- Send Message Modal -->
    <div v-if="showSendMessageModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeSendMessageModal">
      <div class="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiMessage" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Send Message to Customer</h3>
          <div class="mt-2 px-4 py-3">
            <div v-if="customer" class="mb-4 p-3 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-900">
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiAccount" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium">{{ customer.name }}</div>
                    <div class="text-xs text-gray-500">{{ customer.email }}</div>
                  </div>
                </div>
                <div class="text-xs text-gray-600">
                  <span class="font-medium">Customer Type:</span> {{ customer.customerType }} | <span class="font-medium">Status:</span> {{ customer.status === 'active' ? 'Active' : 'Inactive' }}
                </div>
              </div>
            </div>
            
            <form @submit.prevent="sendMessage">
              <div class="mb-4">
                <label for="contactMethod" class="block text-sm font-medium text-gray-700 mb-2">Send via</label>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input
                      v-model="messageForm.contactMethod"
                      type="radio"
                      value="email"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="messageForm.contactMethod"
                      type="radio"
                      value="phone"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Phone Number</span>
                  </label>
                </div>
              </div>
              
              <div v-if="messageForm.contactMethod === 'email'" class="mb-4">
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
                  :placeholder="customer?.phone || ''"
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
              :disabled="isSendingMessage || !messageForm.message.trim() || (messageForm.contactMethod === 'email' && !messageForm.subject.trim())"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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

    <!-- Add Rewards Modal -->
    <div v-if="showAddRewardsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeAddRewardsModal">
      <div class="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Add Rewards for Customer</h3>
          <div class="mt-2 px-4 py-3">
            <div v-if="customer" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="text-sm text-gray-900">
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium">{{ customer.name }}</div>
                    <div class="text-xs text-gray-500">{{ customer.email }}</div>
                  </div>
                </div>
                <div class="text-xs text-gray-600">
                  <span class="font-medium">Customer Type:</span> {{ customer.customerType }} | <span class="font-medium">Status:</span> {{ customer.status === 'active' ? 'Active' : 'Inactive' }}
                </div>
              </div>
            </div>

            <form @submit.prevent="submitRewardRequest">
              <div class="mb-4">
                <label for="customerName" class="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  id="customerName"
                  v-model="rewardsForm.customerName"
                  type="text"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50 text-gray-500"
                />
              </div>
              <div class="mb-4">
                <label for="rewardValue" class="block text-sm font-medium text-gray-700 mb-2">Reward Value (LKR)</label>
                <input
                  id="rewardValue"
                  v-model.number="rewardsForm.rewardValue"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter reward amount"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  id="reason"
                  v-model="rewardsForm.reason"
                  rows="3"
                  placeholder="Enter reason for the reward"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                  required
                ></textarea>
              </div>
            </form>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeAddRewardsModal"
              type="button"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitRewardRequest"
              :disabled="isSubmittingReward || !rewardsForm.rewardValue || !rewardsForm.reason.trim()"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="isSubmittingReward" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmittingReward ? 'Submitting...' : 'Send to Approver' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Toggle Confirmation Modal -->
    <div v-if="showStatusToggleModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusToggleModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full" :class="customer?.status === 'active' ? 'bg-red-100' : 'bg-green-100'">
            <svg class="w-6 h-6" :class="customer?.status === 'active' ? 'text-red-600' : 'text-green-600'" fill="currentColor" viewBox="0 0 24 24">
              <path :d="customer?.status === 'active' ? mdiAccountCancel : mdiAccountCheck" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">
            {{ customer?.status === 'active' ? 'Make Inactive' : 'Make Active' }} Customer
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to {{ customer?.status === 'active' ? 'make inactive' : 'make active' }} {{ customer?.name }}?
            </p>
            <div v-if="customer" class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="text-sm space-y-1">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiAccount" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900">{{ customer.name }}</div>
                    <div class="text-gray-500">{{ customer.email }}</div>
                    <div class="text-gray-500">{{ customer.phone }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeStatusToggleModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmStatusToggle"
              :disabled="isTogglingStatus"
              class="px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              :class="customer?.status === 'active' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'"
            >
              <svg v-if="isTogglingStatus" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isTogglingStatus ? 'Processing...' : (customer?.status === 'active' ? 'Make Inactive' : 'Make Active') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Success Modal -->
    <div v-if="showStatusSuccessModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusSuccessModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Success!</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">{{ statusModalMessage }}</p>
          </div>
          <div class="flex items-center justify-center pt-4">
            <button
              @click="closeStatusSuccessModal"
              class="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Error Modal -->
    <div v-if="showStatusErrorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeStatusErrorModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Error</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">{{ statusModalMessage }}</p>
          </div>
          <div class="flex items-center justify-center pt-4">
            <button
              @click="closeStatusErrorModal"
              class="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <!-- <div v-else class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div> -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useCustomers } from '@/composables/useCustomers'
import { useBookings } from '@/composables/useBookings'
import { useRewardsStore } from '@/stores/rewards'
import type { Booking } from '@/services/api'
import { messageApi } from '@/services/api'
import { 
  mdiAccount, 
  mdiEmail, 
  mdiPhone, 
  mdiCalendarAccount, 
  mdiAccountCheck,
  mdiAccountCancel, 
  mdiCalendarCheck,
  mdiCurrencyUsd,
  mdiCalendarClock,
  mdiCancel,
  mdiMessage,
  mdiCalendar
} from '@mdi/js'

const route = useRoute()
const { getCustomerById, toggleCustomerStatus: toggleStatus, loadPersistedStatuses } = useCustomers()
const { allBookings } = useBookings()
const rewardsStore = useRewardsStore()

// Loading state
const loading = ref(true)
const customerBookings = ref<Booking[]>([])

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

// Status toggle modal state
const showStatusToggleModal = ref(false)
const isTogglingStatus = ref(false)
const showStatusSuccessModal = ref(false)
const showStatusErrorModal = ref(false)
const statusModalMessage = ref('')

// Add rewards modal state
const showAddRewardsModal = ref(false)
const isSubmittingReward = ref(false)
const rewardsForm = ref({
  customerName: '',
  rewardValue: 0,
  reason: ''
})

// Get customer data from shared store
const customerId = route.params.id as string
const customer = ref<any>(null)
const error = ref<string | null>(null)

// Customer statistics
const customerStats = computed(() => {
  if (!customer.value) {
    return {
      totalSpent: 0,
      upcomingBookings: 0,
      cancellations: 0
    }
  }
  const customerBookingsList = customerBookings.value
  const totalSpent = customerBookingsList.reduce((sum, booking) => sum + booking.totalPrice, 0)
  const upcomingBookings = customerBookingsList.filter(booking => {
    const bookingDate = new Date(booking.date)
    const today = new Date()
    return bookingDate > today && (booking.status === 'confirmed' || booking.status === 'pending')
  }).length
  const cancellations = customerBookingsList.filter(booking => booking.status === 'cancelled').length
  return {
    totalSpent,
    upcomingBookings,
    cancellations
  }
})

// Customer rewards
const customerRewards = computed(() => {
  if (!customer.value) return 0
  return rewardsStore.getCustomerRewards(customer.value.id)
})

// Customer approved requests
const customerApprovedRequests = computed(() => {
  if (!customer.value) return []
  return rewardsStore.getApprovedRequests().filter(request => request.customerId === customer.value!.id)
})

// Customer reward requests (both approved and rejected)
const customerRewardRequests = computed(() => {
  if (!customer.value) return []
  return rewardsStore.getRequestsByCustomer(customer.value.id).filter(request => 
    request.status === 'approved' || request.status === 'rejected'
  )
})

// Methods
const getCustomerTypeClass = (type: string) => {
  return type === 'registered' 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-red-100 text-red-800'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const toggleCustomerStatus = () => {
  if (!customer.value) return
  showStatusToggleModal.value = true
}

// Send message functions
const openSendMessageModal = () => {
  if (!customer.value) return
  
  // Reset form when opening modal
  messageForm.value = {
    subject: `Message to ${customer.value.name}`,
    message: '',
    contactMethod: 'email',
    recipientEmail: customer.value.email || '',
    recipientPhone: customer.value.phone || ''
  }
  showSendMessageModal.value = true
}

const closeSendMessageModal = () => {
  showSendMessageModal.value = false
  messageForm.value = {
    subject: '',
    message: '',
    contactMethod: 'email',
    recipientEmail: '',
    recipientPhone: ''
  }
}

const confirmStatusToggle = async () => {
  if (!customer.value) return

  isTogglingStatus.value = true
  showStatusToggleModal.value = false

  try {
    // Toggle the status using the API
    const newStatus = await toggleStatus(customerId, customer.value.status)

    if (newStatus) {
      // Update local customer data
      customer.value.status = newStatus
      const action = newStatus === 'active' ? 'made active' : 'made inactive'
      statusModalMessage.value = `Customer ${customer.value.name} has been successfully ${action}.`
      showStatusSuccessModal.value = true
    } else {
      throw new Error('Failed to update customer status')
    }
  } catch (error) {
    console.error('Error toggling customer status:', error)
    statusModalMessage.value = 'Failed to update customer status. Please try again.'
    showStatusErrorModal.value = true
  } finally {
    isTogglingStatus.value = false
  }
}

const closeStatusToggleModal = () => {
  showStatusToggleModal.value = false
}

const closeStatusSuccessModal = () => {
  showStatusSuccessModal.value = false
  statusModalMessage.value = ''
}

const closeStatusErrorModal = () => {
  showStatusErrorModal.value = false
  statusModalMessage.value = ''
}

const sendMessage = async () => {
  if (!customer.value) return
  
  isSendingMessage.value = true
  
  try {
    if (messageForm.value.contactMethod === 'phone') {
      // Send SMS
      const result = await messageApi.sendSMS(
        messageForm.value.recipientPhone,
        messageForm.value.message
      )
      
      if (result.success) {
        alert(`SMS sent successfully to ${customer.value.name}`)
      } else {
        alert(`Failed to send SMS: ${result.message}`)
        return
      }
    } else if (messageForm.value.contactMethod === 'email') {
      // Send email (currently mock implementation)
      const result = await messageApi.sendMessage({
        customerId: customer.value.id,
        customerName: customer.value.name,
        customerEmail: messageForm.value.recipientEmail,
        subject: messageForm.value.subject,
        message: messageForm.value.message,
        contactMethod: 'email',
        recipientContact: messageForm.value.recipientEmail,
        sentBy: 'Admin', // TODO: Get from auth store
        priority: 'normal'
      })
      
      if (result.success) {
        alert(`Email sent successfully to ${customer.value.name}`)
      } else {
        alert(`Failed to send email: ${result.message}`)
        return
      }
    }
    
    // Close modal
    closeSendMessageModal()
  } catch (error) {
    console.error('Error sending message:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    isSendingMessage.value = false
  }
}

// Add rewards functions
const openAddRewardsModal = () => {
  if (!customer.value) return

  // Reset form when opening modal
  rewardsForm.value = {
    customerName: customer.value.name,
    rewardValue: 0,
    reason: ''
  }
  showAddRewardsModal.value = true
}

const closeAddRewardsModal = () => {
  showAddRewardsModal.value = false
  rewardsForm.value = {
    customerName: '',
    rewardValue: 0,
    reason: ''
  }
}

const submitRewardRequest = async () => {
  if (!customer.value) return

  isSubmittingReward.value = true

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Add reward request to store
    rewardsStore.addRewardRequest({
      customerId: customer.value.id,
      customerName: customer.value.name,
      customerEmail: customer.value.email,
      rewardValue: rewardsForm.value.rewardValue,
      reason: rewardsForm.value.reason
    })

    // Show success message
    alert(`Reward request for ${customer.value.name} has been sent to approver successfully!`)

    // Close modal
    closeAddRewardsModal()
  } catch (error) {
    console.error('Error submitting reward request:', error)
    alert('Failed to submit reward request. Please try again.')
  } finally {
    isSubmittingReward.value = false
  }
}

// Function to fetch customer bookings using booking page data only
const fetchCustomerBookings = async () => {
  loading.value = true
  try {
    // Use booking page data for history
    if (customer.value) {
      customerBookings.value = allBookings.value.filter((booking: Booking) => {
        if (!customer.value) return false
        return booking.customerEmail === customer.value.email || booking.customerName === customer.value.name
      })
    } else {
      customerBookings.value = []
    }
  } catch (error) {
    console.error('Error filtering customer bookings:', error)
    customerBookings.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Load persisted customer statuses from localStorage
  loadPersistedStatuses()
  console.log('Loading customer details for ID:', route.params.id)
  
  try {
    // Fetch customer data from API
    const customerData = await getCustomerById(customerId)
    if (customerData) {
      customer.value = {
        ...customerData,
        totalBookings: 0 // Will be updated when bookings are fetched
      }
      console.log('Customer data loaded:', customer.value)
    } else {
      error.value = 'Customer not found'
      console.error('Customer not found for ID:', customerId)
    }
  } catch (err) {
    error.value = 'Failed to load customer data'
    console.error('Error loading customer:', err)
  }
  
  // Fetch customer bookings
  await fetchCustomerBookings()
})
</script>
