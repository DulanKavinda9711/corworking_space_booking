<template>
	<AdminLayout>
		<div class="space-y-6 max-w-6xl mx-auto" v-if="!isLoading && !error && subscription">
			<!-- Back Button -->
			<div class="flex items-center">
				<router-link :to="getBackNavigationPath()" class="flex items-center text-gray-600 hover:text-gray-900">
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					{{ getBackNavigationLabel() }}
				</router-link>
			</div>

			<!-- Subscription Header -->
			<div class="bg-white rounded-xl shadow-card p-6 ">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-bold text-gray-900">Subscription Details – {{ subscription.id }}</h1>
						<p class="text-gray-600 mt-1">{{ subscription.productName }} • {{ formatSubscriptionType(subscription.subscriptionType || 'monthly') }}</p>
					</div>
					<div class="flex items-center space-x-4">
						<span :class="getStatusClass(subscription.status)" class="px-3 py-1 text-sm font-medium rounded-full">
							{{ subscription.status }}
						</span>
						<button 
							v-if="subscription.status !== 'cancelled'"
							@click="confirmCancelSubscription"
							class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
						>
							Cancel Subscription
						</button>
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
							<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
								<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
									<path :d="mdiAccount" />
								</svg>
							</div>
							<div>
								<h3 class="text-sm font-medium text-gray-900">{{ subscription.customerName }}</h3>
								<p class="text-sm text-gray-500">{{ subscription.customerEmail }}</p>
								<!-- <div v-if="getCustomerDetails(subscription).isRegistered" class="flex items-center space-x-2 mt-1">
									<span class="text-xs text-blue-600 font-medium">ID: {{ getCustomerDetails(subscription).customerId }}</span>
									<span class="text-xs text-gray-400">•</span>
									<span class="text-xs text-gray-600">{{ getCustomerDetails(subscription).totalBookings }} total bookings</span>
								</div> -->
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
							<div>
								<label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
								<p class="text-sm text-gray-900">{{ subscription.customerPhone }}</p>
							</div>
							<!-- <div>
								<label class="text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</label>
								<div class="flex items-center space-x-2 mt-1">
									<span :class="subscription.userType === 'registered' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" 
												class="inline-block px-2 py-1 text-xs font-medium rounded-full">
										{{ subscription.userType }}
									</span>
									<span v-if="getCustomerDetails(subscription).isRegistered"
												:class="getCustomerStatusClass(getCustomerDetails(subscription).customerStatus || 'inactive')"
												class="inline-block px-2 py-1 text-xs font-medium rounded-full">
										{{ getCustomerDetails(subscription).customerStatus || 'inactive' }}
									</span>
								</div>
							</div> -->
						</div>
						<div v-if="subscription.customerMessage" class="pt-4 border-t border-gray-200">
							<label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Message</label>
							<p class="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">{{ subscription.customerMessage }}</p>
						</div>
						<!-- <div v-if="subscription.userType === 'registered'" class="pt-4 border-t border-gray-200">
							<div class="flex items-center space-x-4">
								<button v-if="getCustomerDetails(subscription).isRegistered" 
												@click="viewCustomerProfile" 
												class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center">
									<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
										<path :d="mdiEye" />
									</svg>
									View Profile
								</button>
								<span v-else class="text-gray-400 text-sm">Profile not available</span>
								<button v-if="getCustomerDetails(subscription).isRegistered" 
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
							<div v-if="subscription.productImage" class="w-16 h-16 rounded-lg overflow-hidden">
								<img class="w-full h-full object-cover" :src="subscription.productImage" :alt="subscription.productName">
							</div>
							<div v-else class="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
								<svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
									<path :d="mdiOfficeBuilding" />
								</svg>
							</div>
							<div>
								<h3 class="text-sm font-medium text-gray-900">{{ subscription.productName }}</h3>
								<p class="text-sm text-gray-500">{{ subscription.productType }}</p>
								<p class="text-sm text-gray-500">{{ subscription.locationName }}</p>
							</div>
						</div>
						<!-- <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
							<div>
								<label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</label>
								<p class="text-sm text-gray-900">{{ subscription.capacity }} {{ subscription.capacity === 1 ? 'person' : 'people' }}</p>
							</div>
							<div>
								<label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Facilities</label>
								<div class="flex flex-wrap gap-1 mt-1">
									<span v-for="facility in subscription.facilities" :key="facility" 
												class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
										{{ facility }}
									</span>
								</div>
							</div>
						</div> -->
					</div>
				</div>
			</div>

			<!-- Subscription Details -->
			<div class="bg-white rounded-xl shadow-card p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
					<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
						<path :d="mdiCalendarClock" />
					</svg>
					Subscription Details
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div class="text-center p-4 bg-blue-50 rounded-lg">
						<label class="text-xs font-medium text-blue-600 uppercase tracking-wider">Subscribed Date</label>
						<p class="text-lg font-semibold text-blue-900 mt-1">{{ formatSubscriptionDate(subscription.subscribedDate || '') }}</p>
					</div>
					<div class="text-center p-4 bg-orange-50 rounded-lg">
						<label class="text-xs font-medium text-orange-600 uppercase tracking-wider">Subscription End Date</label>
						<p class="text-lg font-semibold text-orange-900 mt-1">
							<template v-if="subscription.status === 'cancelled'">
								{{ formatSubscriptionDate(subscription.cancelledDate || subscription.nextBillingDate || '') }}
							</template>
							<template v-else>
								{{ getSubscriptionEndDate(subscription) }}
							</template>
						</p>
					</div>
					<div class="text-center p-4 bg-purple-50 rounded-lg">
						<label class="text-xs font-medium text-purple-600 uppercase tracking-wider">
							<template v-if="subscription.status === 'cancelled'">Cancel Booking Date</template>
							<template v-else>Next Billing</template>
						</label>
						<p class="text-lg font-semibold text-purple-900 mt-1">
							<template v-if="subscription.status === 'cancelled'">
								{{ formatSubscriptionDate(subscription.cancelledDate || subscription.nextBillingDate || '') }}
							</template>
							<template v-else>
								{{ formatSubscriptionDate(subscription.nextBillingDate || '') }}
							</template>
						</p>
					</div>
					<div class="text-center p-4 bg-green-50 rounded-lg">
						<label class="text-xs font-medium text-green-600 uppercase tracking-wider">Subscription Type</label>
						<p class="text-lg font-semibold text-green-900 mt-1 capitalize">{{ subscription.subscriptionType }}</p>
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
						<span class="text-gray-900">LKR {{ subscription.basePrice }}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Additional Facilities</span>
						<span class="text-gray-900">LKR {{ subscription.additionalFacilities }}</span>
					</div>
					<div class="border-t border-gray-200 pt-3">
						<div class="flex justify-between">
							<span class="text-lg font-semibold text-gray-900">Total</span>
							<span class="text-lg font-bold text-primary-600">LKR {{ subscription.totalPrice }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Loading state -->
		<div v-if="isLoading" class="flex items-center justify-center h-64">
			<div class="text-center">
				<svg class="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Loading Subscription Details</h3>
				<p class="text-gray-600">Please wait while we fetch the subscription information...</p>
			</div>
		</div>

		<!-- Error state -->
		<div v-if="!isLoading && error" class="flex items-center justify-center h-64">
			<div class="text-center">
				<svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Subscription</h3>
				<p class="text-gray-600 mb-4">{{ error }}</p>
				<router-link :to="getBackNavigationPath()" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					{{ getBackNavigationLabel() }}
				</router-link>
			</div>
		</div>

		<!-- Not Found state -->
		<div v-if="!isLoading && !error && !subscription" class="flex items-center justify-center h-64">
			<div class="text-center">
				<svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Subscription Not Found</h3>
				<p class="text-gray-600 mb-4">The subscription with ID "{{ route.params.id }}" could not be found.</p>
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
						<div v-if="subscription" class="mb-4 p-3 bg-gray-50 rounded-lg">
							<div class="text-sm text-gray-900">
								<div class="flex items-center space-x-2 mb-2">
									<div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
										<svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
											<path :d="mdiAccount" />
										</svg>
									</div>
									<div>
										<div class="font-medium">{{ subscription.customerName }}</div>
										<div class="text-xs text-gray-500">{{ subscription.customerEmail }}</div>
									</div>
								</div>
								<div class="text-xs text-gray-600">
									<span class="font-medium">Subscription:</span> {{ subscription.productName }} - {{ formatSubscriptionType(subscription.subscriptionType || 'monthly') }}
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
									:placeholder="subscription?.customerPhone || ''"
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
import { subscriptionApi, type SubscriptionDetailResponse } from '@/services'
import { mdiAccount, mdiOfficeBuilding, mdiCalendarClock, mdiCurrencyUsd, mdiEye, mdiMessage } from '@mdi/js'

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

// Subscription type definition
interface Subscription {
		id: string;
		productName: string;
		productType: string;
		productId?: string;
		productImage?: string;
		customerName: string;
		customerEmail?: string;
		customerPhone?: string;
		userType: string;
		date?: string;
		startTime?: string;
		endTime?: string;
		duration?: string;
		totalPrice: number;
		basePrice?: number;
		additionalFacilities?: number;
		taxes?: number;
		status: string;
		location?: string;
		locationName?: string;
		capacity?: number;
		facilities?: string[];
		subscriptionType?: string;
		subscribedDate?: string;
		nextBillingDate?: string;
		customerMessage?: string;
		cancelledDate?: string;
}

// Reactive subscription data
const subscriptionDetail = ref<SubscriptionDetailResponse | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Current subscription based on API response
const subscription = computed<Subscription | null>(() => {
	if (!subscriptionDetail.value) return null

	const apiData = subscriptionDetail.value

	// Map API response to Subscription interface
	const mappedSubscription: Subscription = {
		id: apiData.booking_id,
		productName: `${apiData.product_type} Subscription`,
		productType: 'Subscription',
		productId: apiData.booking_id,
		productImage: '', // API doesn't provide image, could be added later
		customerName: `${apiData.first_name} ${apiData.last_name}`,
		customerEmail: apiData.email,
		customerPhone: apiData.phone,
		userType: apiData.customer_type.toLowerCase() === 'registered' ? 'registered' : 'guest',
		date: apiData.subscribed_date,
		totalPrice: apiData.total_price,
		basePrice: apiData.total_price, // Assuming total price is the base price
		additionalFacilities: 0, // API doesn't provide breakdown
		taxes: 0, // API doesn't provide taxes
		status: apiData.status.toLowerCase() === 'unknown' ? 'confirmed' : apiData.status.toLowerCase(),
		location: apiData.location_name,
		locationName: apiData.location_name,
		capacity: 1, // Default capacity
		facilities: ['WiFi', 'Basic Amenities'], // Default facilities
		subscriptionType: apiData.package_type,
		subscribedDate: apiData.subscribed_date,
		nextBillingDate: apiData.next_billing_date,
		customerMessage: '', // API doesn't provide message
		cancelledDate: apiData.status.toLowerCase() === 'cancelled' ? apiData.subscription_end_date : undefined
	}

	return mappedSubscription
})

// Customer lookup function
const getCustomerDetails = (subscription: any) => {
	if (!subscription) return { isRegistered: false, customerData: null, customerId: null }
	if (subscription.userType === 'registered') {
		const customerData = customers.value.find((customer: Customer) => 
			customer.email.toLowerCase() === subscription.customerEmail?.toLowerCase()
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
	return {
		isRegistered: false,
		customerData: null,
		customerId: null,
		displayName: subscription.customerName,
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

const formatSubscriptionType = (type: string) => {
	return type.charAt(0).toUpperCase() + type.slice(1)
}

const formatSubscriptionDate = (dateString: string) => {
	if (!dateString) return 'N/A'

	const date = new Date(dateString)

	// Return in YYYY-MM-DD format
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')

	return `${year}-${month}-${day}`
}

const getSubscriptionEndDate = (subscription: any) => {
	// If we have subscription_end_date from API, use it
	if (subscriptionDetail.value?.subscription_end_date) {
		return subscriptionDetail.value.subscription_end_date
	}

	// Fallback to calculation
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

// Modal functions
const confirmCancelSubscription = () => {
	if (subscription.value) {
		router.push(`/subscriptions/${subscription.value.id}/cancel`)
	}
}


const viewCustomerProfile = () => {
	if (!subscription.value) return
	const customerDetails = getCustomerDetails(subscription.value)
	if (customerDetails.isRegistered && customerDetails.customerId) {
		router.push({
			name: 'CustomerDetail',
			params: { id: customerDetails.customerId }
		})
	} else {
		alert('Customer profile is only available for registered customers.')
	}
}

// Send message functions
const openSendMessageModal = () => {
	messageForm.value = {
		subject: `Regarding your subscription: ${subscription.value?.productName} - ${subscription.value?.id}`,
		message: '',
		contactMethod: 'email',
		recipientEmail: subscription.value?.customerEmail || '',
		recipientPhone: subscription.value?.customerPhone || ''
	}
	showSendMessageModal.value = true
}

const closeSendMessageModal = () => {
	showSendMessageModal.value = false
	isSendingMessage.value = false
	messageForm.value = {
		subject: '',
		message: '',
		contactMethod: 'email',
		recipientEmail: '',
		recipientPhone: ''
	}
}

const sendMessage = async () => {
	if (!subscription.value || !messageForm.value.subject.trim() || !messageForm.value.message.trim()) return
	isSendingMessage.value = true
	try {
		await new Promise(resolve => setTimeout(resolve, 2000))
		const sentMessages = JSON.parse(localStorage.getItem('sentCustomerMessages') || '[]')
		const recipientContact = messageForm.value.contactMethod === 'email' 
			? messageForm.value.recipientEmail || subscription.value.customerEmail
			: messageForm.value.recipientPhone || subscription.value.customerPhone
		const newMessage = {
			id: `MSG-${Date.now()}`,
			subscriptionId: subscription.value.id,
			customerName: subscription.value.customerName,
			customerEmail: subscription.value.customerEmail,
			subject: messageForm.value.subject,
			message: messageForm.value.message,
			contactMethod: messageForm.value.contactMethod,
			recipientContact: recipientContact,
			sentAt: new Date().toISOString(),
			sentBy: 'Admin',
			status: 'sent'
		}
		sentMessages.push(newMessage)
		localStorage.setItem('sentCustomerMessages', JSON.stringify(sentMessages))
		closeSendMessageModal()
		const contactType = messageForm.value.contactMethod === 'email' ? 'email' : 'phone'
		const contactDisplay = messageForm.value.contactMethod === 'email' 
			? messageForm.value.recipientEmail || subscription.value.customerEmail
			: messageForm.value.recipientPhone || subscription.value.customerPhone
		alert(`Message sent successfully to ${subscription.value.customerName} via ${contactType}!\n\nContact: ${contactDisplay}\nSubject: ${messageForm.value.subject}`)
	} catch {
		alert('Failed to send message. Please try again.')
	} finally {
		isSendingMessage.value = false
	}
}

// Navigation methods for determining correct back button destination

const getBackNavigationPath = () => {
	// Always return to BookingsView with subscriptions tab
	return '/bookings?tab=subscriptions'
}

const getBackNavigationLabel = () => {
	return 'Back to Subscriptions'
}

onMounted(async () => {
	const orderId = route.params.id as string
	if (!orderId) {
		error.value = 'No subscription ID provided'
		isLoading.value = false
		return
	}

	try {
		isLoading.value = true
		error.value = null

		const response = await subscriptionApi.getSubscriptionByOrderId(orderId)

		if (response.success && response.data) {
			subscriptionDetail.value = response.data
		} else {
			error.value = response.message || 'Failed to load subscription details'
		}
	} catch (err: any) {
		console.error('Error loading subscription:', err)
		error.value = 'Network error while loading subscription details'
	} finally {
		isLoading.value = false
	}
})
</script>

<style scoped>
.shadow-card {
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
