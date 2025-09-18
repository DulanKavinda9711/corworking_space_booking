<template>
  <AdminLayout>
    <div class="space-y-6">


      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-card">
        <div class="border-b border-gray-200">
          <div class="flex items-center justify-between px-6">
            <nav class="flex space-x-8" aria-label="Tabs">
              <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-6 px-1 border-b-2 font-medium text-sm'
              ]">
                {{ tab.name }}
                <span :class="[
                  activeTab === tab.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-900',
                  'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
                ]">
                  {{ getTabCount(tab.id) }}
                </span>
              </button>
            </nav>
            <button @click="exportToCSV" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 ">
              <svg class="-ml-1 mr-2 h-5 w-5 text-white-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="p-6 border-b border-gray-200">
          <div :class="activeTab === 'all' ? 'grid grid-cols-1 gap-6 md:grid-cols-7' : 'grid grid-cols-1 gap-6 md:grid-cols-5'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <AdvancedDateRangePicker
                v-model="dateRange"
                placeholder="Select Date Range"
                @change="handleDateRangeChange"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div class="relative">
                <div @click="toggleDropdown('location')" class="w-[150px] border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
                  <span class="text-gray-900 truncate">{{ getLocationLabel(filters.location) }}</span>
                </div>

                <!-- Dropdown Options -->
                <div v-if="dropdownStates.location" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div class="p-2">
                    <div v-for="option in locationOptions" :key="option.value" @click="selectLocation(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                      {{ option.label }}
                    </div>
                  </div>
                </div>

                <!-- Dropdown Arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.location ? 'transform rotate-180' : ''
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">User Type</label>
              <div class="relative">
                <div @click="toggleDropdown('userType')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
                  <span class="text-gray-900">{{ getUserTypeLabel(filters.userType) }}</span>
                </div>

                <!-- Dropdown Options -->
                <div v-if="dropdownStates.userType" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div class="p-2">
                    <div v-for="option in userTypeOptions" :key="option.value" @click="selectUserType(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                      {{ option.label }}
                    </div>
                  </div>
                </div>

                <!-- Dropdown Arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.userType ? 'transform rotate-180' : ''
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="relative">
                <div @click="toggleDropdown('status')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
                  <span class="text-gray-900">{{ getStatusLabel(filters.status) }}</span>
                </div>

                <!-- Dropdown Options -->
                <div v-if="dropdownStates.status" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div class="p-2">
                    <div v-for="option in statusOptions" :key="option.value" @click="selectStatus(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                      {{ option.label }}
                    </div>
                  </div>
                </div>

                <!-- Dropdown Arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.status ? 'transform rotate-180' : ''
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <!-- Product Type - Only show on All tab -->
            <div v-if="activeTab === 'all'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
              <div class="relative">
                <!-- Custom Multi-Select Dropdown -->
                <div @click="toggleDropdown('productType')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white h-[2.5rem] flex items-center overflow-hidden">
                  <div class="flex flex-wrap gap-1 flex-1 overflow-hidden">
                    <span v-if="filters.productType.length === 0" class="text-gray-500">All Types</span>
                    <span v-else v-for="type in filters.productType" :key="type"
                          class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800 flex-shrink-0">
                      {{ type }}
                      <button @click.stop="removeProductType(type)" class="ml-1 text-green-600 hover:text-green-800 flex-shrink-0">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  </div>
                </div>

                <!-- Dropdown Options -->
                <div v-if="dropdownStates.productType" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div class="p-2">
                    <!-- Select All / Clear All -->
                    <!-- <div class="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                      <button @click="selectAllProductTypes"
                              class="text-xs text-green-600 hover:text-green-800 font-medium">
                        Select All
                      </button>
                      <button @click="clearProductTypes"
                              class="text-xs text-red-600 hover:text-red-800 font-medium">
                        Clear All
                      </button>
                    </div> -->

                    <!-- Individual Checkboxes -->
                    <label v-for="option in productTypeOptions" :key="option.value"
                           class="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        :value="option.value"
                        v-model="filters.productType"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span class="ml-2 text-sm text-gray-900">{{ option.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Dropdown Arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.productType ? 'transform rotate-180' : ''
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'all'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Subscription Type</label>
              <div class="relative">
                <div @click="toggleDropdown('subscriptionType')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
                  <span class="text-gray-900">{{ getSubscriptionTypeLabel(filters.subscriptionType) }}</span>
                </div>

                <!-- Dropdown Options -->
                <div v-if="dropdownStates.subscriptionType" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div class="p-2">
                    <div v-for="option in subscriptionTypeOptions" :key="option.value" @click="selectSubscriptionType(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                      {{ option.label }}
                    </div>
                  </div>
                </div>

                <!-- Dropdown Arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg :class="[
                    'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                    dropdownStates.subscriptionType ? 'transform rotate-180' : ''
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="flex items-end justify-end">
              <!-- Reset Filters Button - Right aligned for all tabs -->
              <button @click="resetFilters"
                class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600 whitespace-nowrap">
                Reset Filters
              </button>
            </div>
          </div>


        </div>

        <!-- Bookings Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ activeTab === 'subscriptions' ? 'Subscription ID' : activeTab === 'all' ? 'ID' : 'Booking ID' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ activeTab === 'subscriptions' ? 'Subscribed Date' : activeTab === 'all' ? 'Date' : 'Date & Time' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Price
                </th>
                <th v-if="activeTab === 'bookings' || activeTab === 'all'"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th v-if="activeTab === 'all'"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribed Date
                </th>
                <th v-if="activeTab === 'subscriptions' || activeTab === 'all'"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Billing
                </th>
                <th v-if="activeTab === 'subscriptions' || activeTab === 'all'"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription End Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th v-if="activeTab !== 'history' && activeTab !== 'all'"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="booking in paginatedBookings" :key="booking.id" class="hover:bg-gray-50 cursor-pointer"
                @click="navigateToBookingDetails(booking)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="mdiCalendar" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ booking.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <!-- <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-lg object-cover" :src="booking.productImage"
                        :alt="booking.productType">
                    </div> -->
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ booking.productName || booking.productType }}
                      </div>
                      <div v-if="activeTab === 'subscriptions'" class="text-sm text-gray-500">{{
                        booking.subscriptionType }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.locationName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.customerName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="activeTab === 'subscriptions' || (activeTab === 'all' && booking.productType === 'Subscription')" class="text-sm text-gray-900">{{ booking.subscribedDate }}
                  </div>
                  <div v-else-if="activeTab === 'all'">
                    <div class="text-sm text-gray-900">{{ booking.date }}</div>
                    <div v-if="booking.productType !== 'Hot Desk'" class="text-sm text-gray-500">{{ booking.startTime }} - {{ booking.endTime }}</div>
                  </div>
                  <div v-else>
                    <div class="text-sm text-gray-900">{{ booking.date }}</div>
                    <div v-if="booking.productType !== 'Hot Desk'" class="text-sm text-gray-500">{{ booking.startTime }} - {{ booking.endTime }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <template v-if="booking.productType === 'Subscription'">
                    <template v-if="booking.subscriptionType === 'monthly'">
                      {{ booking.totalPrice }} LKR/Month
                    </template>
                    <template v-else-if="booking.subscriptionType === 'annually'">
                      {{ booking.totalPrice }} LKR/Annually
                    </template>
                    <template v-else>
                      LKR {{ booking.totalPrice }}
                    </template>
                  </template>
                  <template v-else>
                    LKR {{ booking.totalPrice }}
                  </template>
                </td>
                <td v-if="activeTab === 'bookings' || activeTab === 'all'"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <template v-if="booking.productType === 'Subscription'">-</template>
                  <template v-else>{{ booking.duration }}</template>
                </td>
                <td v-if="activeTab === 'all'" class="px-6 py-4 whitespace-nowrap">
                  <div v-if="booking.productType === 'Subscription'" class="text-sm text-gray-900">{{ booking.subscribedDate }}</div>
                  <div v-else class="text-sm text-gray-500">-</div>
                </td>
                <td v-if="activeTab === 'subscriptions' || activeTab === 'all'" class="px-6 py-4 whitespace-nowrap">
                  <div v-if="booking.productType === 'Subscription' && booking.status === 'confirmed'" class="text-sm text-gray-900">{{ booking.nextBillingDate }}
                  </div>
                  <div v-else-if="booking.productType === 'Subscription'" class="text-sm text-gray-500 italic">Cancelled</div>
                  <div v-else class="text-sm text-gray-500">-</div>
                </td>
                <td v-if="activeTab === 'subscriptions' || activeTab === 'all'" class="px-6 py-4 whitespace-nowrap">
                  <div v-if="booking.productType === 'Subscription' && booking.status === 'confirmed'" class="text-sm text-gray-900">{{ getSubscriptionEndDate(booking) }}
                  </div>
                  <div v-else-if="booking.productType === 'Subscription'" class="text-sm text-gray-500 italic">Cancelled</div>
                  <div v-else class="text-sm text-gray-500">-</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(getDynamicStatus(booking))" class="px-2 py-1 text-xs font-medium rounded-full">
                    <template v-if="activeTab === 'subscriptions'">
                      {{ getDynamicStatus(booking) }}
                    </template>
                    <template v-else-if="activeTab === 'bookings'">
                      {{ getDynamicStatus(booking) }}
                    </template>
                    <template v-else>
                      {{ booking.status }}
                    </template>
                  </span>
                </td>
                <td v-if="activeTab !== 'history' && activeTab !== 'all'" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <!-- Cancel subscription button for active subscriptions -->
                    <button v-if="activeTab === 'subscriptions' && booking.status === 'confirmed'"
                      @click.stop="cancelSubscription(booking)"
                      class="px-3 py-1 text-xs font-medium rounded-md transition-colors bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1"
                      title="Cancel Subscription">
                      <span>Cancel</span>
                    </button>

                    <!-- Cancel booking button for ongoing bookings -->
                    <button v-if="activeTab === 'bookings' && booking.status === 'ongoing'"
                      @click.stop="cancelBooking(booking)"
                      class="px-3 py-1 text-xs font-medium rounded-md transition-colors bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1"
                      title="Cancel Booking">
                      <span>Cancel</span>
                    </button>

                    <!-- Delete booking button for history bookings -->
                    <button v-if="activeTab === 'history'" @click.stop="confirmDeleteBooking(booking)"
                      class="px-3 py-1 text-xs font-medium rounded-md transition-colors bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 flex items-center space-x-1"
                      title="Delete Booking">
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing {{ startItem }} to {{ endItem }} of {{ filteredBookings.length }} results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button @click="previousPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                    page === currentPage
                      ? 'z-10 bg-green-50 border-green-500 text-green-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors'
                  ]">
                    {{ page }}
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredBookings.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p class="mt-1 text-sm text-gray-500">No bookings match the current filters.</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeDeleteModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16">
              </path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Delete Booking</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to delete this booking permanently? This action cannot be undone.
            </p>
            <div v-if="bookingToDelete" class="mt-4 p-3 bg-gray-50 rounded-lg text-gray-900">
              <div class="text-sm space-y-1">
                <div><strong>Booking ID:</strong> {{ bookingToDelete.id }}</div>
                <div><strong>Customer:</strong> {{ bookingToDelete.customerName }}</div>
                <div><strong>Product:</strong> {{ bookingToDelete.productName }}</div>
                <div><strong>Date:</strong> {{ bookingToDelete.date }}</div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button @click="closeDeleteModal"
              class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors">
              Cancel
            </button>
            <button @click="deleteBooking" :disabled="isDeleting"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center space-x-2 transition-colors">
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>{{ isDeleting ? 'Deleting...' : 'Delete' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import AdvancedDateRangePicker from '@/components/ui/AdvancedDateRangePicker.vue'
import { mdiCalendar } from '@mdi/js'
import { locationApi } from '@/services/api'
import type { Location } from '@/services/api'

// Router
const route = useRoute()
const router = useRouter()

// State
const activeTab = ref('all')
const dateRange = ref({
  startDate: '',
  endDate: ''
})

// Delete modal state
const showDeleteModal = ref(false)
const bookingToDelete = ref<any>(null)
const isDeleting = ref(false)

// Dropdown states for arrow rotation
const dropdownStates = ref({
  location: false,
  productType: false,
  subscriptionType: false,
  subscriptionStatus: false,
  userType: false,
  status: false
})

// Tabs
const tabs = [
  { id: 'all', name: 'All' },
  { id: 'bookings', name: 'Bookings' },
  { id: 'subscriptions', name: 'Subscriptions' },
  { id: 'history', name: 'History' }
]

// Filters
const filters = ref({
  startDate: '',
  endDate: '',
  location: '',
  productType: [] as string[],
  userType: '',
  subscriptionType: '',
  subscriptionStatus: '',
  status: ''
})

// Locations data
const locations = ref<Location[]>([])
const isLoadingLocations = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10


// Sample bookings data - Using actual product details
const allBookings = ref([
  // Confirmed Bookings (Active)
  {
    id: 'BR-2034',
    productName: 'Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    userType: 'registered',
    date: '2025-08-20',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    status: 'ongoing',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2035',
    productName: 'Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Michael Brown',
    userType: 'guest',
    date: '2025-08-21',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: '8 hours',
    totalPrice: 64, // $8/hour * 8 hours
    status: 'ongoing',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  {
    id: 'BR-2036',
    productName: 'Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    userType: 'registered',
    date: '2025-08-22',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    status: 'ongoing',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2037',
    productName: 'Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Jane Smith',
    userType: 'registered',
    date: '2025-08-23',
    startTime: '8:00 AM',
    endTime: '12:00 PM',
    duration: '4 hours',
    totalPrice: 32, // $8/hour * 4 hours
    status: 'ongoing',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  {
    id: 'BR-2039',
    productName: 'Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    userType: 'registered',
    date: '2025-08-25',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    status: 'ongoing',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2040',
    productName: 'Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    userType: 'registered',
    date: '2025-08-26',
    startTime: '10:00 AM',
    endTime: '6:00 PM',
    duration: '8 hours',
    totalPrice: 64, // $8/hour * 8 hours
    status: 'ongoing',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },

    


  // Completed Bookings (History)
  {
    id: 'BR-2020',
    productName: 'Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'Jane Smith',
    userType: 'registered',
    date: '2025-08-15',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    status: 'completed',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2021',
    productName: 'Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    userType: 'registered',
    date: '2025-08-16',
    startTime: '8:00 AM',
    endTime: '4:00 PM',
    duration: '8 hours',
    totalPrice: 64, // $8/hour * 8 hours
    status: 'completed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  {
    id: 'BR-2023',
    productName: 'Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    userType: 'registered',
    date: '2025-08-18',
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    duration: '3 hours',
    totalPrice: 150, // $50/hour * 3 hours
    status: 'completed',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2024',
    productName: 'Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'David Miller',
    userType: 'guest',
    date: '2025-08-14',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    duration: '4 hours',
    totalPrice: 32, // $8/hour * 4 hours
    status: 'completed',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },

  // Cancelled Bookings (History)
  {
    id: 'BR-2010',
    productName: 'Meeting Room',
    productType: 'Meeting Room',
    productId: 'PROD001',
    productImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
    customerName: 'Jennifer Wilson',
    userType: 'guest',
    date: '2025-08-12',
    startTime: '3:00 PM',
    endTime: '5:00 PM',
    duration: '2 hours',
    totalPrice: 100, // $50/hour * 2 hours
    status: 'upcoming',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.'
  },
  {
    id: 'BR-2011',
    productName: 'Hot Desk',
    productType: 'Hot Desk',
    productId: 'PROD002',
    productImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    customerName: 'Kevin Martinez',
    userType: 'guest',
    date: '2025-08-11',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    duration: '4 hours',
    totalPrice: 32, // $8/hour * 4 hours
    status: 'upcoming',
    location: 'tech-hub',
    locationName: 'Tech Hub',
    companyName: 'Tech Innovations Ltd.'
  },
  

  // Subscription Data
  {
    id: 'SUB-3001',
    productName: 'Dedicated Desk',
    productType: 'Subscription',
    productId: 'SUB001',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'John Doe',
    userType: 'registered',
    subscriptionType: 'monthly',
    subscribedDate: '2025-08-01',
    nextBillingDate: '2025-09-01',
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
    id: 'SUB-3003',
    productName: 'Dedicated Desk',
    productType: 'Subscription',
    productId: 'SUB003',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'Sarah Wilson',
    userType: 'registered',
    subscriptionType: 'annually',
    subscribedDate: '2025-01-01',
    nextBillingDate: '2026-01-01',
    totalPrice: 8000,
    basePrice: 7500,
    additionalFacilities: 500,
    status: 'ongoing',
    location: 'business-center',
    locationName: 'Business Center',
    companyName: 'Global Solutions Inc.',
    capacity: 1,
    facilities: ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp', 'Personal Phone Line', '24/7 Access']
  },
  {
    id: 'SUB-3004',
    productName: 'Dedicated Desk',
    productType: 'Subscription',
    productId: 'SUB001',
    productImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop&crop=center',
    customerName: 'Michael Brown',
    userType: 'guest',
    subscriptionType: 'monthly',
    subscribedDate: '2025-07-15',
    nextBillingDate: '2025-08-15',
    totalPrice: 850,
    basePrice: 800,
    additionalFacilities: 50,
    status: 'upcoming',
    location: 'main-branch',
    locationName: 'Main Branch',
    companyName: 'Premium Co-working Ltd.',
    capacity: 1,
    facilities: ['WiFi', 'Private Storage', 'Ergonomic Chair', 'Desk Lamp']
  }
])

// Computed properties
const filteredBookings = computed(() => {
  let bookings = allBookings.value

  // Get today's date in YYYY-MM-DD format
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Filter by tab
  if (activeTab.value === 'all') {
    // Show all bookings and subscriptions without tab-specific filtering
    bookings = allBookings.value
  } else if (activeTab.value === 'bookings') {
    bookings = bookings.filter(b => {
      // Only show ongoing bookings that are not subscriptions
      if (b.status !== 'ongoing' || b.productType === 'Subscription') {
        return false
      }

      // Only show bookings for today and future dates
      if (b.date) {
        return b.date >= todayStr
      }

      return false
    })
  } else if (activeTab.value === 'subscriptions') {
    // Show only active (not cancelled) subscriptions
    bookings = bookings.filter(b => b.productType === 'Subscription' && b.status !== 'cancelled')
  } else {
    // History tab includes:
    // 1. Past confirmed bookings (before today)
    // 2. Completed bookings
    // 3. Cancelled bookings
    // 4. Cancelled subscriptions
    bookings = bookings.filter(b => {
      // Include cancelled subscriptions
      if (b.productType === 'Subscription' && b.status === 'cancelled') {
        return true
      }

      // Include completed or cancelled regular bookings
      if (b.productType !== 'Subscription' && (b.status === 'completed' || b.status === 'cancelled')) {
        return true
      }

      // Include past confirmed bookings (confirmed bookings before today)
      if (b.status === 'confirmed' && b.productType !== 'Subscription' && b.date && b.date < todayStr) {
        return true
      }

      return false
    })
  }

  // Apply date range filter
  if (filters.value.startDate && filters.value.endDate) {
    bookings = bookings.filter(b => {
      const bookingDate = b.date || b.subscribedDate
      if (!bookingDate) return false

      // Ensure date comparison works correctly
      const bookingDateStr = bookingDate.toString()
      const startDateStr = filters.value.startDate.toString()
      const endDateStr = filters.value.endDate.toString()

      return bookingDateStr >= startDateStr && bookingDateStr <= endDateStr
    })
  } else if (filters.value.startDate) {
    // Single date filter - show only bookings on the exact selected date
    bookings = bookings.filter(b => {
      const bookingDate = b.date || b.subscribedDate
      if (!bookingDate) return false

      const bookingDateStr = bookingDate.toString()
      const startDateStr = filters.value.startDate.toString()

      // For single date selection, match exactly
      return bookingDateStr === startDateStr
    })
  }

  // Apply other filters
  if (filters.value.location) {
    bookings = bookings.filter(b => b.location === filters.value.location)
  }
  if (filters.value.productType && filters.value.productType.length > 0) {
    bookings = bookings.filter(b => {
      const displayType = b.productType === 'Subscription' ? 'Dedicated Desk' : b.productType
      return filters.value.productType.includes(displayType)
    })
  }
  if (filters.value.status) {
    bookings = bookings.filter(b => b.status === filters.value.status)
  }
  if (filters.value.subscriptionType) {
    bookings = bookings.filter(b => b.subscriptionType === filters.value.subscriptionType)
  }
  if (filters.value.subscriptionStatus) {
    bookings = bookings.filter(b => b.status === filters.value.subscriptionStatus)
  }
  if (filters.value.userType) {
    bookings = bookings.filter(b => b.userType === filters.value.userType)
  }

  return bookings
})

const totalPages = computed(() => Math.ceil(filteredBookings.value.length / itemsPerPage))

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBookings.value.slice(start, end)
})

const startItem = computed(() => {
  if (filteredBookings.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return Math.min(end, filteredBookings.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Public function to view booking details
const viewBookingDetails = (booking: any) => {
  // This is a public function that can be called to view booking details
  console.log('Viewing booking details for:', booking.id, booking)

  // Log the view action for analytics/audit purposes
  const viewLogs = JSON.parse(localStorage.getItem('bookingViewLogs') || '[]')
  viewLogs.push({
    bookingId: booking.id,
    viewedAt: new Date().toISOString(),
    viewedBy: 'Admin', // In real app, get from auth context
    bookingDetails: {
      customerName: booking.customerName,
      productName: booking.productName,
      status: booking.status,
      date: booking.date || booking.subscribedDate
    }
  })
  localStorage.setItem('bookingViewLogs', JSON.stringify(viewLogs))

  // Navigate to the appropriate route
  const routePath = booking.productType === 'Subscription'
    ? `/subscriptions/${booking.id}`
    : `/bookings/${booking.id}`

  router.push(routePath)
}

// Public function to get all booking details
const getAllBookingDetails = () => {
  // Return all bookings with full details for external access
  console.log('Getting all booking details, total bookings:', allBookings.value.length)
  return allBookings.value.map(booking => ({
    ...booking,
    // Add computed fields for better detail view
    formattedDate: booking.date ? new Date(booking.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'N/A',
    timeSlot: `${booking.startTime} - ${booking.endTime}`,
    statusColor: getStatusClass(booking.status),
    isUpcoming: booking.status === 'confirmed' && booking.date && new Date(booking.date) > new Date(),
    isPast: booking.status === 'completed' || booking.status === 'cancelled' || (booking.date && new Date(booking.date) < new Date())
  }))
}

// Public function to get specific booking details by ID
const getBookingById = (bookingId: string) => {
  const booking = allBookings.value.find(b => b.id === bookingId)
  if (!booking) {
    console.warn('Booking not found:', bookingId)
    return null
  }

  // Return booking with enhanced details
  return {
    ...booking,
    formattedDate: booking.date ? new Date(booking.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'N/A',
    timeSlot: `${booking.startTime} - ${booking.endTime}`,
    statusColor: getStatusClass(booking.status),
    isUpcoming: booking.status === 'ongoing' && booking.date && new Date(booking.date) > new Date(),
    isPast: booking.status === 'completed' || booking.status === 'upcoming' || (booking.date && new Date(booking.date) < new Date()),
    canBeCancelled: booking.status === 'ongoing' && booking.date && new Date(booking.date) > new Date(),
    canBeDeleted: booking.status === 'completed' || booking.status === 'cancelled'
  }
}

// Public function to add new booking and ensure it's viewable
const addNewBooking = (newBookingData: any) => {
  // Generate new booking ID
  const maxId = Math.max(...allBookings.value.map(b => parseInt(b.id.split('-')[1])))
  const newId = `BR-${(maxId + 1).toString().padStart(4, '0')}`

  const newBooking = {
    id: newId,
    ...newBookingData,
    status: 'ongoing', // New bookings are ongoing by default
    // Ensure all required fields are present
    productImage: newBookingData.productImage || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center'
  }

  // Add to bookings array
  allBookings.value.unshift(newBooking) // Add at beginning for recent bookings to show first

  // Save to localStorage for persistence
  localStorage.setItem('allBookings', JSON.stringify(allBookings.value))

  // Log the addition
  const additionLogs = JSON.parse(localStorage.getItem('bookingAdditionLogs') || '[]')
  additionLogs.push({
    bookingId: newId,
    addedAt: new Date().toISOString(),
    addedBy: 'Admin',
    bookingData: newBooking
  })
  localStorage.setItem('bookingAdditionLogs', JSON.stringify(additionLogs))

  console.log('New booking added:', newId, newBooking)

  // Return the new booking details
  return getBookingById(newId)
}

// Methods
const getTabCount = (tabId: string) => {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  if (tabId === 'all') {
    // Count all bookings and subscriptions
    return allBookings.value.length
  } else if (tabId === 'bookings') {
    // Count only ongoing bookings (not subscriptions) for today and future dates
    return allBookings.value.filter(b =>
      b.status === 'ongoing' &&
      b.productType !== 'Subscription' &&
      b.date &&
      b.date >= todayStr
    ).length
  } else if (tabId === 'subscriptions') {
    // Count only current (active) subscriptions, not cancelled ones
    return allBookings.value.filter(b => b.productType === 'Subscription' && b.status === 'confirmed').length
  } else {
    // History includes:
    // 1. Past confirmed bookings (before today)
    // 2. Completed bookings
    // 3. Cancelled bookings
    // 4. Cancelled subscriptions
    return allBookings.value.filter(b => {
      // Include cancelled subscriptions
      if (b.productType === 'Subscription' && b.status === 'cancelled') {
        return true
      }

      // Include completed or cancelled regular bookings
      if (b.productType !== 'Subscription' && (b.status === 'completed' || b.status === 'cancelled')) {
        return true
      }

      // Include past confirmed bookings (confirmed bookings before today)
      if (b.status === 'confirmed' && b.productType !== 'Subscription' && b.date && b.date < todayStr) {
        return true
      }

      return false
    }).length
  }
}

// Dropdown toggle functions
const toggleDropdown = (dropdownName: string) => {
  // Close all dropdowns first
  closeAllDropdowns()
  // Then open the clicked dropdown
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = true
}

const closeDropdown = (dropdownName: string) => {
  dropdownStates.value[dropdownName as keyof typeof dropdownStates.value] = false
}

const closeAllDropdowns = () => {
  Object.keys(dropdownStates.value).forEach(key => {
    dropdownStates.value[key as keyof typeof dropdownStates.value] = false
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'bg-green-100 text-green-800'
    case 'upcoming':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'completed':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'on going':
      return 'bg-blue-100 text-blue-800'
    case 'up comming':
      return 'bg-yellow-100 text-yellow-800'
    case 'complete':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get dynamic status based on current time and booking time
const getDynamicStatus = (booking: any) => {
  // Handle subscriptions differently
  if (booking.productType === 'Subscription') {
    if (booking.status === 'cancelled') {
      return 'complete'
    }

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

  // Handle regular bookings
  if (booking.status !== 'ongoing') {
    return booking.status
  }

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

// Get subscription end date
const getSubscriptionEndDate = (subscription: any) => {
  if (!subscription.nextBillingDate) return 'N/A'

  const nextBillingDate = new Date(subscription.nextBillingDate)
  // Subscription ends 1 day before next billing date
  const endDate = new Date(nextBillingDate)
  endDate.setDate(endDate.getDate() - 1)

  // Return in YYYY-MM-DD format
  const year = endDate.getFullYear()
  const month = String(endDate.getMonth() + 1).padStart(2, '0')
  const day = String(endDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Row click handler to view booking details
const navigateToBookingDetails = (booking: any) => {
  const routePath = booking.productType === 'Subscription'
    ? `/subscriptions/${booking.id}`
    : `/bookings/${booking.id}`

  // Use router to navigate to the booking details page
  router.push(routePath)
}

// Cancel subscription handler
const cancelSubscription = (booking: any) => {
  const routePath = `/subscriptions/${booking.id}/cancel`
  router.push(routePath)
}

// Cancel booking handler
const cancelBooking = (booking: any) => {
  const routePath = `/bookings/${booking.id}/cancel`
  router.push(routePath)
}

const resetFilters = () => {
  filters.value = {
    startDate: '',
    endDate: '',
    location: '',
    productType: [],
    userType: '',
    subscriptionType: '',
    subscriptionStatus: '',
    status: ''
  }
  currentPage.value = 1
}

// Export to CSV function
const exportToCSV = () => {
  const data = paginatedBookings.value
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  // Define CSV headers based on active tab
  let headers = []
  let filename = ''

  switch (activeTab.value) {
    case 'all':
      headers = ['ID', 'Product', 'Location', 'Customer', 'Date', 'Total Price', 'Subscribed Date', 'Duration', 'Next Billing', 'Subscription End Date', 'Status']
      filename = 'all-bookings-report.csv'
      break
    case 'bookings':
      headers = ['ID', 'Product', 'Location', 'Customer', 'Date & Time', 'Duration', 'Total Price', 'Status']
      filename = 'bookings-report.csv'
      break
    case 'subscriptions':
      headers = ['Subscription ID', 'Product', 'Location', 'Customer', 'Subscribed Date', 'Total Price', 'Next Billing', 'Subscription End Date', 'Status']
      filename = 'subscriptions-report.csv'
      break
    case 'history':
      headers = ['ID', 'Product', 'Location', 'Customer', 'Date', 'Total Price', 'Status']
      filename = 'booking-history-report.csv'
      break
    default:
      headers = ['ID', 'Product', 'Location', 'Customer', 'Date', 'Total Price', 'Status']
      filename = 'bookings-report.csv'
  }

  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(booking => {
      const row = []

      // ID column
      row.push(booking.id)

      // Product column
      row.push(booking.productName || booking.productType || '')

      // Location column
      row.push(booking.locationName || '')

      // Customer column
      row.push(booking.customerName || '')

      // Date columns based on tab
      if (activeTab.value === 'subscriptions') {
        row.push(booking.subscribedDate || '')
      } else if (activeTab.value === 'all') {
        // For 'all' tab, show booking date
        if (booking.productType === 'Subscription') {
          row.push(booking.subscribedDate || '')
        } else {
          row.push(booking.date || '')
        }
      } else if (activeTab.value === 'bookings') {
        row.push(`${booking.date || ''} ${booking.startTime || ''} - ${booking.endTime || ''}`)
      } else {
        row.push(booking.date || '')
      }

      // Additional columns for 'all' tab
      if (activeTab.value === 'all') {
        // Total Price
        let price = ''
        if (booking.productType === 'Subscription') {
          if (booking.subscriptionType === 'monthly') {
            price = `${booking.totalPrice} LKR/Month`
          } else if (booking.subscriptionType === 'annually') {
            price = `${booking.totalPrice} LKR/Annually`
          } else {
            price = `LKR ${booking.totalPrice}`
          }
        } else {
          price = `LKR ${booking.totalPrice}`
        }
        row.push(price)

        // Subscribed Date
        row.push(booking.productType === 'Subscription' ? booking.subscribedDate || '' : '-')

        // Duration
        row.push(booking.productType === 'Subscription' ? '-' : booking.duration || '')
      }

      // Total Price for other tabs
      if (activeTab.value !== 'all') {
        let price = ''
        if (booking.productType === 'Subscription') {
          if (booking.subscriptionType === 'monthly') {
            price = `${booking.totalPrice} LKR/Month`
          } else if (booking.subscriptionType === 'annually') {
            price = `${booking.totalPrice} LKR/Annually`
          } else {
            price = `LKR ${booking.totalPrice}`
          }
        } else {
          price = `LKR ${booking.totalPrice}`
        }
        row.push(price)
      }

      // Next Billing and Subscription End Date for subscriptions and all tabs
      if (activeTab.value === 'subscriptions' || activeTab.value === 'all') {
        if (booking.productType === 'Subscription' && booking.status === 'confirmed') {
          row.push(booking.nextBillingDate || '')
          row.push(getSubscriptionEndDate(booking))
        } else {
          row.push('-')
          row.push('-')
        }
      }

      // Duration for bookings tab
      if (activeTab.value === 'bookings') {
        row.push(booking.duration || '')
      }

      // Status column
      row.push(booking.status || '')

      return row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    })
  ].join('\n')

  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Pagination methods
const goToPage = (page: number) => {
  currentPage.value = page
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




// Handle date range change from the calendar component
const handleDateRangeChange = (newDateRange: { startDate: string; endDate: string }) => {
  dateRange.value = newDateRange
  filters.value.startDate = newDateRange.startDate
  filters.value.endDate = newDateRange.endDate
  currentPage.value = 1 // Reset pagination
}

// Delete booking functions
const confirmDeleteBooking = (booking: any) => {
  bookingToDelete.value = booking
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  bookingToDelete.value = null
  isDeleting.value = false
}

const deleteBooking = async () => {
  if (!bookingToDelete.value) return

  isDeleting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Remove booking from the array
    const index = allBookings.value.findIndex(b => b.id === bookingToDelete.value.id)
    if (index > -1) {
      allBookings.value.splice(index, 1)
    }

    // Save to localStorage for persistence
    localStorage.setItem('allBookings', JSON.stringify(allBookings.value))

    // Log the deletion
    const deletedBookings = JSON.parse(localStorage.getItem('deletedBookings') || '[]')
    deletedBookings.push({
      ...bookingToDelete.value,
      deletedAt: new Date().toISOString(),
      deletedBy: 'Admin' // In real app, get from auth context
    })
    localStorage.setItem('deletedBookings', JSON.stringify(deletedBookings))

    closeDeleteModal()

    // Show success message (you could replace this with a toast notification)
    console.log('Booking deleted successfully:', bookingToDelete.value.id)

  } catch (error) {
    console.error('Error deleting booking:', error)
    // Handle error (show toast notification, etc.)
  } finally {
    isDeleting.value = false
  }
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  // Close all dropdowns if clicking outside any select element or custom dropdown
  if (!target.closest('select') && !target.closest('.relative')) {
    closeAllDropdowns()
  }
}

// Product Type Multi-Select Methods
const productTypeOptions = [
  { value: 'Meeting Room', label: 'Meeting Room' },
  { value: 'Hot Desk', label: 'Hot Desk' },
  { value: 'Dedicated Desk', label: 'Dedicated Desk' }
]

// Location Options - computed from fetched locations
const locationOptions = computed(() => {
  const options = [{ value: '', label: 'All Locations' }]
  locations.value.forEach(location => {
    options.push({
      value: location.id,
      label: location.name
    })
  })
  return options
})

// User Type Options
const userTypeOptions = [
  { value: '', label: 'All Users' },
  { value: 'registered', label: 'Registered' },
  { value: 'guest', label: 'Guest' }
]

// Status Options
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

// Subscription Type Options
const subscriptionTypeOptions = [
  { value: '', label: 'All Periods' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' }
]

const removeProductType = (type: string) => {
  const index = filters.value.productType.indexOf(type)
  if (index > -1) {
    filters.value.productType.splice(index, 1)
  }
}

// const selectAllProductTypes = () => {
//   filters.value.productType = productTypeOptions.map(option => option.value)
// }

// const clearProductTypes = () => {
//   filters.value.productType = []
// }

// Selection methods for single-select dropdowns
const selectLocation = (value: string) => {
  filters.value.location = value
  closeDropdown('location')
}

const selectUserType = (value: string) => {
  filters.value.userType = value
  closeDropdown('userType')
}

const selectStatus = (value: string) => {
  filters.value.status = value
  closeDropdown('status')
}

const selectSubscriptionType = (value: string) => {
  filters.value.subscriptionType = value
  closeDropdown('subscriptionType')
}

// Label getter functions
const getLocationLabel = (value: string) => {
  const option = locationOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All Locations'
}

const getUserTypeLabel = (value: string) => {
  const option = userTypeOptions.find(opt => opt.value === value)
  return option ? option.label : 'All Users'
}

const getStatusLabel = (value: string) => {
  const option = statusOptions.find(opt => opt.value === value)
  return option ? option.label : 'All Status'
}

const getSubscriptionTypeLabel = (value: string) => {
  const option = subscriptionTypeOptions.find(opt => opt.value === value)
  return option ? option.label : 'All Periods'
}

// Fetch locations from API
const fetchLocations = async () => {
  isLoadingLocations.value = true
  try {
    const response = await locationApi.getAllLocations()
    if (response.success && response.data) {
      locations.value = response.data
    } else {
      console.error('Failed to load locations:', response.message)
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
  } finally {
    isLoadingLocations.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchLocations()

  // Check for tab query parameter and set active tab
  const tabParam = route.query.tab as string
  if (tabParam && ['all', 'bookings', 'subscriptions', 'history'].includes(tabParam)) {
    activeTab.value = tabParam
  }

  // Load bookings from localStorage if available (for persistence across sessions)
  const savedBookings = localStorage.getItem('allBookings')
  if (savedBookings) {
    try {
      const parsedBookings = JSON.parse(savedBookings)
      if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
        allBookings.value = parsedBookings
        console.log('Loaded bookings from localStorage:', parsedBookings.length)
      }
    } catch (error) {
      console.warn('Error loading bookings from localStorage:', error)
    }
  }

  // If there are no bookings in localStorage yet, persist the initial sample data so
  // other views (like CancelBookingView) can load the 'actual' data by ID.
  if (!savedBookings) {
    try {
      localStorage.setItem('allBookings', JSON.stringify(allBookings.value))
      console.log('Seeded initial sample bookings to localStorage:', allBookings.value.length)
    } catch (err) {
      console.warn('Failed to seed bookings to localStorage:', err)
    }
  }

  // Update booking statuses from localStorage (simulate real-time updates)
  const bookingStatuses = JSON.parse(localStorage.getItem('bookingStatuses') || '{}')
  allBookings.value.forEach(booking => {
    if (bookingStatuses[booking.id]) {
      booking.status = bookingStatuses[booking.id]
    }
  })

  console.log('BookingsView mounted with', allBookings.value.length, 'total bookings')
})

// Watch for filter changes to reset pagination
// Watch for route changes to update active tab
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string' && ['all', 'bookings', 'subscriptions', 'history'].includes(newTab)) {
    activeTab.value = newTab
  }
})

// Reset page when filters or active tab change
watch([() => filters.value, activeTab], () => {
  currentPage.value = 1
}, { deep: true })

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for tab changes to update status of past confirmed bookings
watch(activeTab, (newTab) => {
  if (newTab === 'history') {
    const todayStr = new Date().toISOString().split('T')[0]
    allBookings.value.forEach(booking => {
      if (
        booking.status === 'confirmed' &&
        booking.productType !== 'Subscription' &&
        booking.date &&
        booking.date < todayStr
      ) {
        booking.status = 'completed'
      }
    })
    // Persist status changes to localStorage
    localStorage.setItem('allBookings', JSON.stringify(allBookings.value))
  }
})

// Expose public functions for external access
// These functions can be called from parent components or other parts of the application
defineExpose({
  viewBookingDetails,
  navigateToBookingDetails,
  cancelSubscription,
  cancelBooking,
  getAllBookingDetails,
  getBookingById,
  addNewBooking,
  // Expose filtered bookings for external components
  getCurrentBookings: () => filteredBookings.value,
  // Expose booking management functions
  confirmDeleteBooking
})
</script>

<style scoped>
/* Custom dropdown styles */
.appearance-none {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Enhance dropdown arrow animation */
.rotate-180 {
  transform: rotate(180deg);
}

/* Custom select hover effects */
select:hover {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
}

/* Smooth transitions for focus states */
select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Enhanced arrow styling */
.pointer-events-none svg {
  transition: all 0.2s ease-in-out;
}

select:focus+.absolute svg {
  color: #10b981;
}

/* Custom scrollbar for select options (webkit browsers) */
select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
