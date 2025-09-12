<template>
  <AdminLayout>
    <div class="space-y-6" v-if="payment">
      <!-- Back Button -->
      <div class="flex items-center">
        <router-link to="/payments" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Payments
        </router-link>
      </div>

      <!-- Payment Header -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Payment Details</h1>
            <p class="text-gray-600 mt-1">Payment ID: {{ payment.paymentId }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <span 
              class="px-3 py-1 text-sm font-medium rounded-full"
              :class="getStatusClass(payment.status)"
            >
              {{ payment.status.charAt(0).toUpperCase() + payment.status.slice(1) }}
            </span>
            <button 
              @click="downloadInvoice"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Invoice</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Information Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Customer Information -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiAccount" />
            </svg>
            Customer Information
          </h2>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiAccount" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ payment.customerName }}</h3>
                <p class="text-sm text-gray-500">{{ payment.customerEmail }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</label>
                <p class="text-sm text-gray-900 mt-1">{{ payment.bookingId }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</label>
                <p class="text-sm text-gray-900 mt-1">{{ formatDate(payment.date) }}</p>
                <p class="text-sm text-gray-500">{{ payment.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Location & Product Information -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiMapMarker" />
            </svg>
            Location & Product Details
          </h2>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ payment.locationName }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Product</label>
              <p class="text-sm text-gray-900 mt-1">{{ payment.productName }}</p>
              <p class="text-sm text-gray-500">{{ payment.productType }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
              <span 
                class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1"
                :class="getStatusClass(payment.status)"
              >
                {{ payment.status === 'pending' ? 'Pending (Subscription)' : 'Paid' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Facilities -->
      <div class="bg-white rounded-xl shadow-card p-6" v-if="payment.additionalFacilities && payment.additionalFacilities.length > 0">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" />
          </svg>
          Additional Facilities
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="facility in payment.additionalFacilities" 
            :key="facility.name"
            class="bg-gray-50 rounded-lg p-4"
          >
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-900">{{ facility.name }}</span>
              <span class="text-sm font-semibold text-gray-900">${{ facility.price }}</span>
            </div>
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
        <div class="space-y-4">
          <div class="flex justify-between" v-if="additionalFacilitiesTotal > 0">
            <span class="text-gray-600">Additional Facilities</span>
            <span class="text-gray-900">${{ additionalFacilitiesTotal }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-lg font-semibold text-gray-900">Total Amount</span>
            <span class="text-lg font-bold text-gray-900">${{ payment.totalAmount }}</span>
          </div>
        </div>

        <!-- Commission Information -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Commission Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- PayMedia Commission -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 class="text-sm font-medium text-gray-900 mb-3">PayMedia Commission</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-700">Commission Rate</span>
                  <span class="text-sm font-semibold text-gray-900">{{ payment.SquareHubRate }}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-700">Commission Amount</span>
                  <span class="text-sm font-semibold text-gray-900">${{ payment.SquareHubCommission }}</span>
                </div>
              </div>
            </div>

            <!-- Ceylinco Commission -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Ceylinco Commission</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-700">Commission Rate</span>
                  <span class="text-sm font-semibold text-gray-900">{{ payment.ceylincoRate }}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-700">Commission Amount</span>
                  <span class="text-sm font-semibold text-gray-900">${{ payment.ceylincoCommission }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Total Commission Summary -->
          <!-- <div class="mt-4 bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-900">Total Commission</span>
              <span class="text-lg font-bold text-primary-600">${{ payment.totalCommission }}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-sm text-gray-600">Net Amount to Partner</span>
              <span class="text-sm font-semibold text-gray-900">${{ (payment.totalAmount - payment.totalCommission).toFixed(2) }}</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  mdiAccount, 
  mdiMapMarker, 
  mdiCurrencyUsd
} from '@mdi/js'

const route = useRoute()

// Sample payment data based on payments view structure
const payment = ref({
  id: 'PAY-001',
  paymentId: 'PM-2024-001',
  bookingId: 'BR-2034',
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  productName: 'Executive Board Room',
  productType: 'Meeting Room',
  locationName: 'Main Branch - Downtown',
  baseAmount: 120,
  additionalFacilities: [
    { name: 'Projector', price: 20 },
    { name: 'Catering', price: 10 }
  ],
  totalAmount: 150,
  // Updated commission structure
  SquareHubCommission: 75.00,
  SquareHubRate: 50.0,
  ceylincoCommission: 75.00,
  ceylincoRate: 50.0,
  totalCommission: 150.00,
  status: 'paid',
  date: '2024-08-15',
  time: '10:30 AM'
})

// Computed properties
const additionalFacilitiesTotal = computed(() => {
  if (!payment.value.additionalFacilities || payment.value.additionalFacilities.length === 0) {
    return 0
  }
  return payment.value.additionalFacilities.reduce((total, facility) => total + facility.price, 0)
})

// Commission calculations - Load from localStorage or use defaults
const loadCommissionSettings = () => {
  const savedSettings = localStorage.getItem('commissionSettings')
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings)
    } catch (error) {
      console.error('Error loading commission settings:', error)
    }
  }
  // Default settings if nothing saved
  return {
    SquareHubRate: 50.0,
    SquareHubFixedFee: 0.00,
    ceylincoRate: 50.0,
    ceylincoFixedFee: 0.00
  }
}

const commissionSettings = ref(loadCommissionSettings())

const payMediaCommissionRate = computed(() => commissionSettings.value.SquareHubRate)
const ceylincoCommissionRate = computed(() => commissionSettings.value.ceylincoRate)
const totalCommissionRate = computed(() => payMediaCommissionRate.value + ceylincoCommissionRate.value)

const payMediaCommissionAmount = computed(() => {
  const rate = payMediaCommissionRate.value / 100
  return (payment.value.totalAmount * rate).toFixed(2)
})

const ceylincoCommissionAmount = computed(() => {
  const rate = ceylincoCommissionRate.value / 100
  return (payment.value.totalAmount * rate).toFixed(2)
})

const netAmountToPartner = computed(() => {
  const payMediaAmount = parseFloat(payMediaCommissionAmount.value)
  const ceylincoAmount = parseFloat(ceylincoCommissionAmount.value)
  return (payment.value.totalAmount - payMediaAmount - ceylincoAmount).toFixed(2)
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const downloadInvoice = () => {
  // Fallback: open printable invoice in a new window (user can print-to-PDF)
  const p = payment.value
  const printScript = '<scr' + 'ipt>window.onload = function(){ window.print(); }</scr' + 'ipt>'

  const invoiceHtml = `
    <html>
      <head>
        <title>Invoice ${p.paymentId}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111827 }
          h1 { font-size: 20px }
          .row { display: flex; justify-content: space-between; margin-bottom: 6px }
          .section { margin-top: 12px }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <div class="section">
          <div class="row"><strong>Invoice #</strong><span>${p.paymentId}</span></div>
          <div class="row"><strong>Date</strong><span>${p.date} ${p.time}</span></div>
          <div class="row"><strong>Customer</strong><span>${p.customerName}</span></div>
          <div class="row"><strong>Email</strong><span>${p.customerEmail}</span></div>
          <div class="row"><strong>Booking ID</strong><span>${p.bookingId}</span></div>
          <div class="row"><strong>Location</strong><span>${p.locationName}</span></div>
        </div>
        <div class="section">
          <h3>Product</h3>
          <div>${p.productName} (${p.productType})</div>
        </div>
        <div class="section">
          <h3>Additional Facilities</h3>
          ${p.additionalFacilities && p.additionalFacilities.length > 0 ? `<ul>${p.additionalFacilities.map((f:any) => `<li>${f.name} - $${f.price}</li>`).join('')}</ul>` : '<div>None</div>'}
        </div>
        <div class="section">
          <div class="row"><strong>Total Amount</strong><span>$${p.totalAmount}</span></div>
          <div class="row"><strong>PayMedia Commission</strong><span>$${p.SquareHubCommission} (${p.SquareHubRate}%)</span></div>
          <div class="row"><strong>Ceylinco Commission</strong><span>$${p.ceylincoCommission} (${p.ceylincoRate}%)</span></div>
          <div class="row"><strong>Total Commission</strong><span>$${p.totalCommission} (${p.SquareHubRate + p.ceylincoRate}%)</span></div>
          <div class="row"><strong>Net to Partner</strong><span>$${(p.totalAmount - p.totalCommission).toFixed(2)}</span></div>
        </div>
    ` + printScript + `
      </body>
    </html>
  `

  const w = window.open('', '_blank')
  if (w) {
    w.document.write(invoiceHtml)
    w.document.close()
  } else {
    alert('Unable to open print window. Please allow popups for this site or use the browser print feature.')
  }
}

onMounted(() => {
  // In a real app, fetch payment data based on route.params.id
  console.log('Loading payment details for ID:', route.params.id)
  
  // Sample data mapping based on the payments data structure
  const samplePayments = [
    {
      id: 'PAY-001',
      paymentId: 'PM-2024-001',
      bookingId: 'BR-2034',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      productName: 'Executive Board Room',
      productType: 'Meeting Room',
      locationName: 'Main Branch - Downtown',
      baseAmount: 120,
      additionalFacilities: [
        { name: 'Projector', price: 20 },
        { name: 'Catering', price: 10 }
      ],
      totalAmount: 150,
      // Updated commission structure
      SquareHubCommission: 75.00,
      SquareHubRate: 50.0,
      ceylincoCommission: 75.00,
      ceylincoRate: 50.0,
      totalCommission: 150.00,
      status: 'paid',
      date: '2024-08-15',
      time: '10:30 AM'
    },
    {
      id: 'PAY-002',
      paymentId: 'PM-2024-002',
      bookingId: 'BR-2033',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      productName: 'Hot Desk Area',
      productType: 'Hot Desk',
      locationName: 'Tech Hub - Silicon Valley',
      baseAmount: 50,
      additionalFacilities: [
        { name: 'Monitor', price: 10 }
      ],
      totalAmount: 60,
      // Updated commission structure
      SquareHubCommission: 30.00,
      SquareHubRate: 50.0,
      ceylincoCommission: 30.00,
      ceylincoRate: 50.0,
      totalCommission: 60.00,
      status: 'paid',
      date: '2024-08-15',
      time: '2:15 PM'
    }
  ]
  
  // Find payment by ID from route params
  const foundPayment = samplePayments.find(p => p.id === route.params.id)
  if (foundPayment) {
    payment.value = foundPayment
  }

  // Listen for commission settings updates
  const handleCommissionSettingsUpdate = (event: CustomEvent) => {
    // Update commission settings and trigger recalculation
    commissionSettings.value = { ...commissionSettings.value, ...event.detail }
  }
  window.addEventListener('commissionSettingsUpdated', handleCommissionSettingsUpdate as EventListener)
})
</script>