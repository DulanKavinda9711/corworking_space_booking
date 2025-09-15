<template>
	<AdminLayout>
		<div class="space-y-6 max-w-6xl mx-auto" v-if="subscription">
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
							<div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
								<svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
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
						<div v-if="subscription.userType === 'registered'" class="pt-4 border-t border-gray-200">
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
							<img class="w-16 h-16 rounded-lg object-cover" :src="subscription.productImage" :alt="subscription.productName">
							<div>
								<h3 class="text-sm font-medium text-gray-900">{{ subscription.productName }}</h3>
								<p class="text-sm text-gray-500">{{ subscription.productType }}</p>
								<p class="text-sm text-gray-500">{{ subscription.locationName }}</p>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
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
						</div>
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
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="text-center p-4 bg-blue-50 rounded-lg">
						<label class="text-xs font-medium text-blue-600 uppercase tracking-wider">Subscribed Date</label>
						<p class="text-lg font-semibold text-blue-900 mt-1">{{ formatSubscriptionDate(subscription.subscribedDate || '') }}</p>
					</div>
					<div class="text-center p-4 bg-green-50 rounded-lg">
						<label class="text-xs font-medium text-green-600 uppercase tracking-wider">Subscription Type</label>
						<p class="text-lg font-semibold text-green-900 mt-1 capitalize">{{ subscription.subscriptionType }}</p>
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
						<span class="text-gray-900">${{ subscription.basePrice }}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Additional Facilities</span>
						<span class="text-gray-900">${{ subscription.additionalFacilities }}</span>
					</div>
					<div class="border-t border-gray-200 pt-3">
						<div class="flex justify-between">
							<span class="text-lg font-semibold text-gray-900">Total</span>
							<span class="text-lg font-bold text-primary-600">${{ subscription.totalPrice }}</span>
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

// Reactive subscriptions data
const allSubscriptions = ref<Subscription[]>([])

// Current subscription based on route parameter
const subscription = computed<Subscription | null>(() => {
	const subId = route.params.id as string
	const foundSub = allSubscriptions.value.find((s: Subscription) => s.id === subId)
	if (foundSub) {
		// If cancelled and no cancelledDate, set to today
		let cancelledDate = foundSub.cancelledDate
		if (foundSub.status === 'cancelled' && !cancelledDate) {
			const today = new Date()
			cancelledDate = today.toISOString().split('T')[0]
		}
		return {
			...foundSub,
			customerEmail: foundSub.customerEmail || `${foundSub.customerName?.toLowerCase().replace(' ', '.')}@example.com`,
			customerPhone: foundSub.customerPhone || '+1 (555) 000-0000',
			customerMessage: foundSub.customerMessage || '',
			basePrice: foundSub.basePrice ?? foundSub.totalPrice ?? 0,
			additionalFacilities: foundSub.additionalFacilities ?? 0,
			taxes: foundSub.taxes ?? 0,
			capacity: foundSub.capacity ?? 1,
			facilities: foundSub.facilities ?? ['WiFi', 'Basic Amenities'],
			locationName: foundSub.locationName ?? 'Location Not Specified',
			subscriptionType: foundSub.subscriptionType ?? 'monthly',
			subscribedDate: foundSub.subscribedDate ?? foundSub.date,
			nextBillingDate: foundSub.nextBillingDate ?? foundSub.date,
			cancelledDate: cancelledDate
		}
	}
	return null
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
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
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

onMounted(() => {
	// Sync subscriptions from localStorage if available
	const savedSubs = localStorage.getItem('allBookings')
	if (savedSubs) {
		try {
			const parsedSubs = JSON.parse(savedSubs)
			const subscriptions = parsedSubs.filter((b: any) => b.productType === 'Subscription')
			if (Array.isArray(subscriptions) && subscriptions.length > 0) {
				allSubscriptions.value = subscriptions
			}
		} catch {
			// fallback: keep default
		}
	}
	// Update subscription statuses from localStorage
	const bookingStatuses = JSON.parse(localStorage.getItem('bookingStatuses') || '{}')
	allSubscriptions.value.forEach((sub: Subscription) => {
		if (bookingStatuses[sub.id]) {
			sub.status = bookingStatuses[sub.id]
		}
	})
})
</script>

<style scoped>
.shadow-card {
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
