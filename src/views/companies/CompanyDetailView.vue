<template>
  <AdminLayout>
    <div class="space-y-6" v-if="company">
      <!-- Back Button -->
      <div class="flex items-center">
        <router-link to="/companies" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Companies
        </router-link>
      </div>

      <!-- Company Profile Card -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-6">
            <img 
              :src="company.logo" 
              :alt="company.name"
              class="w-20 h-20 rounded-xl object-cover"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ company.name }}</h1>
              <p class="text-gray-600 mt-1">{{ company.registrationNumber }}</p>
              <div class="mt-3 space-y-1">
                <p class="text-sm text-gray-600">{{ company.address }}</p>
                <p class="text-sm text-gray-600">{{ company.city }}, {{ company.country }}</p>
              </div>
              
              <!-- Contact Details -->
              <div class="mt-4 space-y-2">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiAccount" />
                  </svg>
                  {{ company.contactPerson }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiEmail" />
                  </svg>
                  {{ company.email }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiPhone" />
                  </svg>
                  {{ company.phone }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <span :class="getStatusClass(company.status)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{ company.status }}
            </span>
            <div class="flex space-x-2">
              <!-- <button 
                @click="editCompany"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Details
              </button> -->
              <button 
                @click="toggleStatus"
                :class="company.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                class="px-4 py-2 text-white rounded-lg transition-colors"
              >
                {{ company.status === 'active' ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Listed Products Section -->
      <div class="bg-white rounded-xl shadow-card">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Listed Spaces ({{ products.length }})</h2>
          <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Space</span>
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Space Details
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Hour
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
              <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <img class="h-12 w-12 rounded-lg object-cover" :src="product.image" :alt="product.name">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">Capacity: {{ product.capacity }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {{ product.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ product.location }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ product.pricePerHour }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(product.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ product.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-3">
                    <button class="text-blue-600 hover:text-blue-900 flex items-center space-x-1" title="Edit Space">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="mdiPencil" />
                      </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-900 flex items-center space-x-1" title="Delete Space">
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
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useCompanies } from '@/composables/useCompanies'
import { mdiAccount, mdiEmail, mdiPhone, mdiPencil, mdiDelete } from '@mdi/js'

const route = useRoute()
const { getCompanyById, toggleCompanyStatus } = useCompanies()

// Get company data from shared store
const companyId = parseInt(route.params.id as string)
const company = getCompanyById(companyId)

// Sample products data
const products = ref([
  {
    id: 1,
    name: 'Executive Board Room',
    type: 'Meeting Room',
    location: 'Main Branch - Floor 5',
    capacity: 12,
    pricePerHour: 75,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: 2,
    name: 'Hot Desk Area',
    type: 'Hot Desk',
    location: 'Main Branch - Floor 2',
    capacity: 1,
    pricePerHour: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: 3,
    name: 'Private Office Suite',
    type: 'Private Office',
    location: 'Main Branch - Floor 3',
    capacity: 4,
    pricePerHour: 50,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center'
  }
])

// Methods
const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

const toggleStatus = () => {
  if (company.value) {
    toggleCompanyStatus(company.value.id)
  }
}

onMounted(() => {
  // In a real app, fetch company data based on route.params.id
  console.log('Loading company details for ID:', route.params.id)
})
</script>
