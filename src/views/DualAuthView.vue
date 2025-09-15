<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dual Authentication</h1>
          <p class="text-gray-600">Review and approve pending system changes</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="approveAllPending"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            :disabled="pendingItems.length === 0"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiCheckAll" />
            </svg>
            <span>Approve All</span>
          </button>
          <div class="text-sm text-gray-500">
            {{ pendingItems.length }} items pending
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiClockAlert" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Total Pending</h3>
              <p class="text-2xl font-bold text-gray-900">{{ authStats.totalPending }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiAccountPlus" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">User Changes</h3>
              <p class="text-2xl font-bold text-gray-900">{{ authStats.userChanges }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCheckCircle" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Approved Today</h3>
              <p class="text-2xl font-bold text-gray-900">{{ authStats.approvedToday }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiCloseCircle" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">Rejected Today</h3>
              <p class="text-2xl font-bold text-gray-900">{{ authStats.rejectedToday }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiShieldCheck" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500">High Priority</h3>
              <p class="text-2xl font-bold text-gray-900">{{ authStats.highPriority }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs for different categories -->
      <div class="bg-white rounded-xl shadow-card">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
              <span :class="[
                activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]">
                {{ getTabCount(tab.id) }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Filters -->
        <div class="p-6 border-b border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select v-model="filters.priority" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Requested By</label>
              <select v-model="filters.requestedBy" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">All Users</option>
                <option value="john.admin">John Administrator</option>
                <option value="sarah.manager">Sarah Manager</option>
                <option value="mike.operator">Mike Operator</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <input
                type="date"
                v-model="filters.dateFrom"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="resetFilters"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Pending Actions Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested By
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="getItemIcon(item.type)" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                      <div class="text-sm text-gray-500">{{ item.description }}</div>
                      <div class="text-xs text-gray-400">ID: {{ item.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeClass(item.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ formatType(item.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img class="h-8 w-8 rounded-full object-cover" :src="item.requestedByAvatar" :alt="item.requestedBy">
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ item.requestedBy }}</div>
                      <div class="text-sm text-gray-500">{{ item.requestedByRole }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(item.submittedAt) }}</div>
                  <div class="text-sm text-gray-500">{{ getTimeAgo(item.submittedAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getPriorityClass(item.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ item.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <button @click="viewDetails(item)" class="text-primary-600 hover:text-primary-900 flex items-center space-x-1" title="View Details">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiEye" />
                      </svg>
                    </button>
                    <button @click="approveItem(item)" class="text-green-600 hover:text-green-900 flex items-center space-x-1" title="Approve">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiCheck" />
                      </svg>
                     
                    </button>
                    <button @click="rejectItem(item)" class="text-red-600 hover:text-red-900 flex items-center space-x-1" title="Reject">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiClose" />
                      </svg>
                     
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredItems.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No pending items</h3>
          <p class="mt-1 text-sm text-gray-500">All items have been processed or no items match the current filters.</p>
        </div>
      </div>
    </div>

    <!-- View Details Modal -->
    <div v-if="showDetailsModal && selectedItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Request Details</h2>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Request Information -->
          <div class="flex items-start space-x-4">
            <div class="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
              <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="getItemIcon(selectedItem.type)" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedItem.title }}</h3>
              <p class="text-gray-600 mt-1">{{ selectedItem.description }}</p>
              <div class="flex items-center space-x-4 mt-3">
                <span :class="getTypeClass(selectedItem.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ formatType(selectedItem.type) }}
                </span>
                <span :class="getPriorityClass(selectedItem.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ selectedItem.priority }} Priority
                </span>
              </div>
            </div>
          </div>

          <!-- Request Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Request Information</h4>
              <div class="space-y-2 text-sm">
                <p><span class="text-gray-500">Request ID:</span> {{ selectedItem.id }}</p>
                <p><span class="text-gray-500">Submitted:</span> {{ formatDate(selectedItem.submittedAt) }}</p>
                <p><span class="text-gray-500">Priority:</span> {{ selectedItem.priority }}</p>
                <p><span class="text-gray-500">Reason:</span> {{ selectedItem.reason || 'Not specified' }}</p>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Requested By</h4>
              <div class="flex items-center space-x-3">
                <img class="h-12 w-12 rounded-full object-cover" :src="selectedItem.requestedByAvatar" :alt="selectedItem.requestedBy">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ selectedItem.requestedBy }}</p>
                  <p class="text-sm text-gray-500">{{ selectedItem.requestedByRole }}</p>
                  <p class="text-sm text-gray-500">{{ selectedItem.requestedByEmail }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Changes Summary -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">Proposed Changes</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="space-y-3">
                <div v-for="change in selectedItem.changes" :key="change.field" class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">{{ change.field }}:</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500 line-through">{{ change.oldValue || 'None' }}</span>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span class="text-sm font-medium text-gray-900">{{ change.newValue }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">Comments</h4>
            <div class="space-y-3">
              <div v-for="comment in selectedItem.comments" :key="comment.id" class="flex space-x-3">
                <img class="h-8 w-8 rounded-full object-cover" :src="comment.avatar" :alt="comment.author">
                <div class="flex-1">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-sm font-medium text-gray-900">{{ comment.author }}</span>
                      <span class="text-xs text-gray-500">{{ formatDate(comment.timestamp) }}</span>
                    </div>
                    <p class="text-sm text-gray-700">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Comment -->
            <div class="mt-4">
              <textarea
                v-model="newComment"
                rows="3"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add a comment..."
              ></textarea>
              <div class="mt-2 flex justify-end">
                <button
                  @click="addComment"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              @click="rejectItem(selectedItem)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiClose" />
              </svg>
              <span>Reject</span>
            </button>
            <button
              @click="approveItem(selectedItem)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCheck" />
              </svg>
              <span>Approve</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Approval/Rejection Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center space-x-4">
            <div :class="confirmAction === 'approve' ? 'bg-green-100' : 'bg-red-100'" class="w-12 h-12 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6" :class="confirmAction === 'approve' ? 'text-green-600' : 'text-red-600'" fill="currentColor" viewBox="0 0 24 24">
                <path :d="confirmAction === 'approve' ? mdiCheck : mdiClose" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ confirmAction === 'approve' ? 'Approve Request' : 'Reject Request' }}
              </h3>
              <p class="text-gray-600">
                Are you sure you want to {{ confirmAction }} this request?
              </p>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ confirmAction === 'approve' ? 'Approval' : 'Rejection' }} Reason (Optional)
            </label>
            <textarea
              v-model="actionReason"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              :placeholder="`Provide reason for ${confirmAction}...`"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showConfirmModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmAction === 'approve' ? finalizeApproval() : finalizeRejection()"
              :class="confirmAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
              class="px-4 py-2 text-white rounded-lg transition-colors"
            >
              {{ confirmAction === 'approve' ? 'Approve' : 'Reject' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  mdiClockAlert, 
  mdiAccountPlus, 
  mdiCheckCircle, 
  mdiCloseCircle, 
  mdiShieldCheck,
  mdiCheckAll,
  mdiEye,
  mdiCheck,
  mdiClose,
  mdiAccount,
  mdiCog
} from '@mdi/js'

// Types
interface AuthItem {
  id: string
  type: string
  title: string
  description: string
  requestedBy: string
  requestedByRole: string
  requestedByEmail: string
  requestedByAvatar: string
  submittedAt: string
  priority: string
  reason?: string
  changes: Array<{
    field: string
    oldValue: any
    newValue: any
  }>
  comments: Array<{
    id: string
    author: string
    avatar: string
    content: string
    timestamp: string
  }>
}

// State
const activeTab = ref('all')
const showDetailsModal = ref(false)
const showConfirmModal = ref(false)
const selectedItem = ref<AuthItem | null>(null)
const confirmAction = ref('')
const actionReason = ref('')
const newComment = ref('')

// Filters
const filters = ref({
  priority: '',
  requestedBy: '',
  dateFrom: ''
})

// Tabs
const tabs = [
  { id: 'all', name: 'All Requests' },
  { id: 'user-management', name: 'User Management' },
  { id: 'customer-updates', name: 'Customer Updates' },
  { id: 'system-changes', name: 'System Changes' },
  { id: 'profile-updates', name: 'Profile Updates' }
]

// Statistics
const authStats = ref({
  totalPending: 7,
  userChanges: 3,
  approvedToday: 12,
  rejectedToday: 2,
  highPriority: 2
})

// Sample pending items
const pendingItems = ref([
  {
    id: 'DA-001',
    type: 'user-creation',
    title: 'New User: Emma Support',
    description: 'Request to create new operator account for customer service',
    requestedBy: 'John Administrator',
    requestedByRole: 'Super Admin',
    requestedByEmail: 'john.admin@cowork.com',
    requestedByAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    submittedAt: '2024-08-15T09:30:00Z',
    priority: 'medium',
    reason: 'New team member joining customer service',
    changes: [
      { field: 'Name', oldValue: null, newValue: 'Emma Support' },
      { field: 'Email', oldValue: null, newValue: 'emma.support@cowork.com' },
      { field: 'Role', oldValue: null, newValue: 'Operator' },
      { field: 'Department', oldValue: null, newValue: 'Support' }
    ],
    comments: [
      {
        id: 'C-001',
        author: 'John Administrator',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces',
        message: 'New hire for customer service team. HR has approved.',
        timestamp: '2024-08-15T09:35:00Z'
      }
    ]
  },
  {
    id: 'DA-002',
    type: 'user-update',
    title: 'Role Change: Mike Operator',
    description: 'Request to promote Mike from Operator to Manager role',
    requestedBy: 'Sarah Manager',
    requestedByRole: 'Admin',
    requestedByEmail: 'sarah.manager@cowork.com',
    requestedByAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c2?w=100&h=100&fit=crop&crop=faces',
    submittedAt: '2024-08-15T08:15:00Z',
    priority: 'high',
    reason: 'Performance promotion after quarterly review',
    changes: [
      { field: 'Role', oldValue: 'Operator', newValue: 'Manager' },
      { field: 'Permissions', oldValue: 'Dashboard Access, Customer Management', newValue: 'Dashboard Access, Customer Management, Booking Management, Reports Access' }
    ],
    comments: []
  },
  {
    id: 'DA-003',
    type: 'customer-update',
    title: 'Customer Profile Update: John Doe',
    description: 'Request to update customer contact information and status',
    requestedBy: 'Mike Operator',
    requestedByRole: 'Manager',
    requestedByEmail: 'mike.operator@cowork.com',
    requestedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    submittedAt: '2024-08-14T16:45:00Z',
    priority: 'low',
    reason: 'Customer requested contact information update',
    changes: [
      { field: 'Phone', oldValue: '+1 (555) 123-4567', newValue: '+1 (555) 999-8888' },
      { field: 'Email', oldValue: 'john.old@example.com', newValue: 'john.doe@example.com' }
    ],
    comments: [
      {
        id: 'C-002',
        author: 'Mike Operator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=faces',
        message: 'Customer verified identity via phone call.',
        timestamp: '2024-08-14T16:50:00Z'
      }
    ]
  },
  {
    id: 'DA-004',
    type: 'system-settings',
    title: 'Commission Rate Update',
    description: 'Request to update commission rates for Main Branch location',
    requestedBy: 'Sarah Manager',
    requestedByRole: 'Admin',
    requestedByEmail: 'sarah.manager@cowork.com',
    requestedByAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c2?w=100&h=100&fit=crop&crop=faces',
    submittedAt: '2024-08-14T14:20:00Z',
    priority: 'high',
    reason: 'Quarterly rate adjustment as per management directive',
    changes: [
      { field: 'Commission Rate', oldValue: '10.0%', newValue: '12.5%' },
      { field: 'Fixed Fee', oldValue: '$5.00', newValue: '$3.00' }
    ],
    comments: []
  },
  {
    id: 'DA-005',
    type: 'user-deletion',
    title: 'User Deactivation: David Analyst',
    description: 'Request to permanently deactivate suspended user account',
    requestedBy: 'John Administrator',
    requestedByRole: 'Super Admin',
    requestedByEmail: 'john.admin@cowork.com',
    requestedByAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    submittedAt: '2024-08-14T11:00:00Z',
    priority: 'medium',
    reason: 'Employee termination - security protocol',
    changes: [
      { field: 'Status', oldValue: 'Suspended', newValue: 'Deleted' },
      { field: 'Access', oldValue: 'Restricted', newValue: 'Revoked' }
    ],
    comments: [
      {
        id: 'C-003',
        author: 'John Administrator',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces',
        message: 'HR has confirmed termination. Please proceed with account deletion.',
        timestamp: '2024-08-14T11:05:00Z'
      }
    ]
  }
])

// Computed properties
const filteredItems = computed(() => {
  let filtered = pendingItems.value

  // Filter by active tab
  if (activeTab.value !== 'all') {
    const typeMap: Record<string, string[]> = {
      'user-management': ['user-creation', 'user-update', 'user-deletion'],
      'customer-updates': ['customer-update', 'customer-profile'],
      'system-changes': ['system-settings', 'commission-update'],
      'profile-updates': ['profile-update', 'contact-update']
    }
    filtered = filtered.filter(item => typeMap[activeTab.value]?.includes(item.type))
  }

  // Apply filters
  if (filters.value.priority) {
    filtered = filtered.filter(item => item.priority === filters.value.priority)
  }
  if (filters.value.requestedBy) {
    filtered = filtered.filter(item => item.requestedBy.includes(filters.value.requestedBy))
  }
  if (filters.value.dateFrom) {
    filtered = filtered.filter(item => item.submittedAt >= filters.value.dateFrom)
  }

  return filtered
})

// Methods
const getTabCount = (tabId: string) => {
  if (tabId === 'all') return pendingItems.value.length
  
  const typeMap: Record<string, string[]> = {
    'user-management': ['user-creation', 'user-update', 'user-deletion'],
    'customer-updates': ['customer-update', 'customer-profile'],
    'system-changes': ['system-settings', 'commission-update'],
    'profile-updates': ['profile-update', 'contact-update']
  }
  
  return pendingItems.value.filter(item => typeMap[tabId]?.includes(item.type)).length
}

const getItemIcon = (type: string) => {
  switch (type) {
    case 'user-creation':
    case 'user-update':
    case 'user-deletion':
      return mdiAccount
    case 'customer-update':
    case 'customer-profile':
      return mdiAccountPlus
    case 'system-settings':
    case 'commission-update':
      return mdiCog
    default:
      return mdiShieldCheck
  }
}

const getTypeClass = (type: string) => {
  switch (type) {
    case 'user-creation':
    case 'user-update':
    case 'user-deletion':
      return 'bg-blue-100 text-blue-800'
    case 'customer-update':
    case 'customer-profile':
      return 'bg-green-100 text-green-800'
    case 'system-settings':
    case 'commission-update':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatType = (type: string) => {
  const typeMap: Record<string, string> = {
    'user-creation': 'User Creation',
    'user-update': 'User Update',
    'user-deletion': 'User Deletion',
    'customer-update': 'Customer Update',
    'customer-profile': 'Customer Profile',
    'system-settings': 'System Settings',
    'commission-update': 'Commission Update'
  }
  return typeMap[type] || type
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
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

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours === 1) return '1 hour ago'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return '1 day ago'
  return `${diffInDays} days ago`
}

const resetFilters = () => {
  filters.value = {
    priority: '',
    requestedBy: '',
    dateFrom: ''
  }
}

const viewDetails = (item: any) => {
  selectedItem.value = item
  showDetailsModal.value = true
}

const approveItem = (item: any) => {
  selectedItem.value = item
  confirmAction.value = 'approve'
  showConfirmModal.value = true
  showDetailsModal.value = false
}

const rejectItem = (item: any) => {
  selectedItem.value = item
  confirmAction.value = 'reject'
  showConfirmModal.value = true
  showDetailsModal.value = false
}

const finalizeApproval = () => {
  if (!selectedItem.value) return
  
  // Remove from pending items
  const index = pendingItems.value.findIndex(item => item.id === selectedItem.value!.id)
  if (index !== -1) {
    pendingItems.value.splice(index, 1)
  }
  
  // Update statistics
  authStats.value.totalPending--
  authStats.value.approvedToday++
  
  showConfirmModal.value = false
  actionReason.value = ''
  alert(`Request ${selectedItem.value.id} has been approved successfully!`)
}

const finalizeRejection = () => {
  if (!selectedItem.value) return
  
  // Remove from pending items
  const index = pendingItems.value.findIndex(item => item.id === selectedItem.value!.id)
  if (index !== -1) {
    pendingItems.value.splice(index, 1)
  }
  
  // Update statistics
  authStats.value.totalPending--
  authStats.value.rejectedToday++
  
  showConfirmModal.value = false
  actionReason.value = ''
  alert(`Request ${selectedItem.value.id} has been rejected.`)
}

const approveAllPending = () => {
  if (confirm('Are you sure you want to approve all pending items?')) {
    const count = pendingItems.value.length
    authStats.value.approvedToday += count
    authStats.value.totalPending = 0
    pendingItems.value = []
    alert(`${count} requests have been approved successfully!`)
  }
}

const addComment = () => {
  if (newComment.value.trim() && selectedItem.value) {
    selectedItem.value.comments.push({
      id: `C-${Date.now()}`,
      author: 'Current User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces',
      content: newComment.value,
      timestamp: new Date().toISOString()
    })
    newComment.value = ''
  }
}
</script>
