<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p class="text-gray-600">Generate and download transaction, audit, and customer analytics reports</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="generateAllReports"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiDownloadMultiple" />
            </svg>
            <span>Generate All</span>
          </button>
          <div class="text-sm text-gray-500">
            Last updated: {{ currentTime }}
          </div>
        </div>
      </div>

      <!-- Report Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Transaction Reports -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCurrencyUsd" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Transaction Reports</h3>
                <p class="text-sm text-gray-500">Revenue and payment analytics</p>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Total Revenue (30 days)</span>
              <span class="font-semibold text-gray-900">${{ reportStats.totalRevenue.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Total Transactions</span>
              <span class="font-semibold text-gray-900">{{ reportStats.totalTransactions }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Commission Earned</span>
              <span class="font-semibold text-gray-900">${{ reportStats.commissionEarned.toLocaleString() }}</span>
            </div>
          </div>
          <button 
            @click="generateTransactionReport"
            class="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiDownload" />
            </svg>
            <span>Download Report</span>
          </button>
        </div>

        <!-- Audit Reports -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiShieldCheck" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Audit Reports</h3>
                <p class="text-sm text-gray-500">System activity and security logs</p>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Total Activities (30 days)</span>
              <span class="font-semibold text-gray-900">{{ reportStats.totalActivities.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">User Actions</span>
              <span class="font-semibold text-gray-900">{{ reportStats.userActions }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">System Changes</span>
              <span class="font-semibold text-gray-900">{{ reportStats.systemChanges }}</span>
            </div>
          </div>
          <button 
            @click="generateAuditReport"
            class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiDownload" />
            </svg>
            <span>Download Report</span>
          </button>
        </div>

        <!-- Customer Analytics -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiAccountGroup" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Customer Analytics</h3>
                <p class="text-sm text-gray-500">Customer behavior and insights</p>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Total Customers</span>
              <span class="font-semibold text-gray-900">{{ reportStats.totalCustomers }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Active This Month</span>
              <span class="font-semibold text-gray-900">{{ reportStats.activeCustomers }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Avg. Bookings per Customer</span>
              <span class="font-semibold text-gray-900">{{ reportStats.avgBookingsPerCustomer }}</span>
            </div>
          </div>
          <button 
            @click="generateCustomerAnalytics"
            class="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiDownload" />
            </svg>
            <span>Download Report</span>
          </button>
        </div>
      </div>

      <!-- Report Filters -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Report Filters</h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range From</label>
            <input
              type="date"
              v-model="filters.dateFrom"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range To</label>
            <input
              type="date"
              v-model="filters.dateTo"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select v-model="filters.location" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">All Locations</option>
              <option value="main-branch">Main Branch</option>
              <option value="tech-hub">Tech Hub</option>
              <option value="creative-quarter">Creative Quarter</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
            <select v-model="filters.format" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="applyFilters"
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Revenue Trends Chart -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Revenue Trends (Last 30 Days)</h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Growth:</span>
            <span class="text-sm font-semibold text-green-600">+12.5%</span>
          </div>
        </div>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-gray-600">Revenue Chart Visualization</p>
            <p class="text-sm text-gray-500 mt-1">Chart component would be integrated here</p>
          </div>
        </div>
      </div>

      <!-- Analytics Dashboard -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Customer Insights -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Customer Insights</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Top Customer Segment</h3>
                <p class="text-xs text-gray-500">Registered users with 5+ bookings</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-gray-900">68%</span>
                <p class="text-xs text-gray-500">of total revenue</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Most Popular Product</h3>
                <p class="text-xs text-gray-500">Executive Board Room</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-gray-900">42%</span>
                <p class="text-xs text-gray-500">of bookings</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Peak Booking Hours</h3>
                <p class="text-xs text-gray-500">10 AM - 2 PM weekdays</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-gray-900">78%</span>
                <p class="text-xs text-gray-500">of daily bookings</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="bg-white rounded-xl shadow-card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Average Session Value</h3>
                <p class="text-xs text-gray-500">Revenue per booking session</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-green-600">$156</span>
                <p class="text-xs text-green-500">+8% vs last month</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Cancellation Rate</h3>
                <p class="text-xs text-gray-500">Bookings cancelled within 24h</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-orange-600">4.2%</span>
                <p class="text-xs text-orange-500">-1.3% vs last month</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Customer Retention</h3>
                <p class="text-xs text-gray-500">Returning customers (30 days)</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-blue-600">84%</span>
                <p class="text-xs text-blue-500">+5% vs last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="bg-white rounded-xl shadow-card">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Recent Reports</h2>
          <button 
            @click="clearReportHistory"
            class="text-sm text-red-600 hover:text-red-700"
          >
            Clear History
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Range
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
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
              <tr v-for="report in recentReports" :key="report.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="getReportIcon(report.type)" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ report.name }}</div>
                      <div class="text-sm text-gray-500">{{ report.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getReportTypeClass(report.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ report.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ report.dateRange }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(report.generatedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(report.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ report.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <button 
                      @click="downloadReport(report)" 
                      :disabled="report.status !== 'completed'"
                      class="text-primary-600 hover:text-primary-900 disabled:text-gray-400 flex items-center space-x-1" 
                      title="Download Report"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiDownload" />
                      </svg>
                      <span class="hidden sm:inline">Download</span>
                    </button>
                    <button @click="deleteReport(report)" class="text-red-600 hover:text-red-900 flex items-center space-x-1" title="Delete Report">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiDelete" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="recentReports.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No reports generated</h3>
          <p class="mt-1 text-sm text-gray-500">Generate your first report to see it here.</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  mdiDownloadMultiple,
  mdiCurrencyUsd,
  mdiShieldCheck,
  mdiAccountGroup,
  mdiDownload,
  mdiDelete,
  mdiFileChart,
  mdiFileAccount,
  mdiCog
} from '@mdi/js'

// State
const currentTime = ref('')

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  location: '',
  format: 'pdf'
})

// Report statistics
const reportStats = ref({
  totalRevenue: 145750,
  totalTransactions: 892,
  commissionEarned: 14575,
  totalActivities: 3247,
  userActions: 1856,
  systemChanges: 423,
  totalCustomers: 156,
  activeCustomers: 98,
  avgBookingsPerCustomer: 5.7
})

// Recent reports
const recentReports = ref([
  {
    id: 'RPT-001',
    name: 'Monthly Transaction Report',
    description: 'Complete transaction analysis for August 2024',
    type: 'Transaction',
    dateRange: 'Aug 1 - Aug 31, 2024',
    generatedAt: '2024-08-15T10:30:00Z',
    status: 'completed',
    format: 'PDF'
  },
  {
    id: 'RPT-002',
    name: 'Customer Analytics Report',
    description: 'Customer behavior and engagement analysis',
    type: 'Analytics',
    dateRange: 'Jul 1 - Aug 15, 2024',
    generatedAt: '2024-08-15T09:15:00Z',
    status: 'completed',
    format: 'Excel'
  },
  {
    id: 'RPT-003',
    name: 'System Audit Report',
    description: 'Security and activity audit trail',
    type: 'Audit',
    dateRange: 'Aug 1 - Aug 15, 2024',
    generatedAt: '2024-08-15T08:45:00Z',
    status: 'processing',
    format: 'PDF'
  },
  {
    id: 'RPT-004',
    name: 'Revenue Analysis Q3',
    description: 'Quarterly revenue breakdown and trends',
    type: 'Transaction',
    dateRange: 'Jul 1 - Sep 30, 2024',
    generatedAt: '2024-08-14T16:20:00Z',
    status: 'completed',
    format: 'Excel'
  }
])

// Methods
const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getReportIcon = (type: string) => {
  switch (type) {
    case 'Transaction':
      return mdiCurrencyUsd
    case 'Analytics':
      return mdiFileAccount
    case 'Audit':
      return mdiShieldCheck
    default:
      return mdiFileChart
  }
}

const getReportTypeClass = (type: string) => {
  switch (type) {
    case 'Transaction':
      return 'bg-green-100 text-green-800'
    case 'Analytics':
      return 'bg-purple-100 text-purple-800'
    case 'Audit':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const applyFilters = () => {
  console.log('Applying filters:', filters.value)
  alert('Filters applied successfully!')
}

const generateTransactionReport = () => {
  const reportName = `Transaction Report - ${new Date().toLocaleDateString()}`
  addNewReport(reportName, 'Complete transaction and revenue analysis', 'Transaction')
  alert('Transaction report generation started! Check the recent reports section.')
}

const generateAuditReport = () => {
  const reportName = `Audit Report - ${new Date().toLocaleDateString()}`
  addNewReport(reportName, 'System activity and security audit trail', 'Audit')
  alert('Audit report generation started! Check the recent reports section.')
}

const generateCustomerAnalytics = () => {
  const reportName = `Customer Analytics - ${new Date().toLocaleDateString()}`
  addNewReport(reportName, 'Customer behavior and engagement insights', 'Analytics')
  alert('Customer analytics report generation started! Check the recent reports section.')
}

const generateAllReports = () => {
  if (confirm('This will generate Transaction, Audit, and Customer Analytics reports. Continue?')) {
    generateTransactionReport()
    generateAuditReport()
    generateCustomerAnalytics()
  }
}

const addNewReport = (name: string, description: string, type: string) => {
  const newReport = {
    id: `RPT-${String(recentReports.value.length + 1).padStart(3, '0')}`,
    name,
    description,
    type,
    dateRange: `${filters.value.dateFrom || 'Aug 1'} - ${filters.value.dateTo || 'Aug 31'}, 2024`,
    generatedAt: new Date().toISOString(),
    status: 'processing',
    format: filters.value.format.toUpperCase()
  }
  
  recentReports.value.unshift(newReport)
  
  // Simulate report completion after 3 seconds
  setTimeout(() => {
    const index = recentReports.value.findIndex(r => r.id === newReport.id)
    if (index !== -1) {
      recentReports.value[index].status = 'completed'
    }
  }, 3000)
}

const downloadReport = (report: any) => {
  if (report.status === 'completed') {
    // Simulate file download
    alert(`Downloading ${report.name} (${report.format})...`)
    console.log('Downloaded report:', report)
  }
}

const deleteReport = (report: any) => {
  if (confirm(`Are you sure you want to delete "${report.name}"?`)) {
    const index = recentReports.value.findIndex(r => r.id === report.id)
    if (index !== -1) {
      recentReports.value.splice(index, 1)
    }
  }
}

const clearReportHistory = () => {
  if (confirm('Are you sure you want to clear all report history?')) {
    recentReports.value = []
  }
}

onMounted(() => {
  updateCurrentTime()
  // Update time every minute
  setInterval(updateCurrentTime, 60000)
  
  // Set default date range (last 30 days)
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
  
  filters.value.dateTo = today.toISOString().split('T')[0]
  filters.value.dateFrom = thirtyDaysAgo.toISOString().split('T')[0]
})
</script>
