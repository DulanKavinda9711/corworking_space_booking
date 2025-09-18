<template>
  <AdminLayout>
    <div class="space-y-6" @click="closeAllDropdowns">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiBookOpen" />
          </svg>
          <span class="text-sm font-medium text-green-700">
            Total Products:
            <span class="font-bold text-green-800">{{ filteredProducts.length }}</span>
          </span>
        </div>
        <router-link to="/products/add"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Product</span>
        </router-link>
      </div>

      <!-- Search and Filters -->
      

      <!-- Products Table -->
       
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="bg-white border-b shadow-card p-6">

        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                v-model="searchQuery"
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative" @click.stop>
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div class="relative" @click.stop>
              <div @click="toggleDropdown('location')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <div class="relative" @click.stop>
              <div @click="toggleDropdown('productType')" class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center">
                <span class="text-gray-900 truncate">{{ getProductTypeLabel(filters.productType) }}</span>
              </div>

              <!-- Dropdown Options -->
              <div v-if="dropdownStates.productType" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div class="p-2">
                  <div v-for="option in productTypeOptions" :key="option.value" @click="selectProductType(option.value)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                    {{ option.label }}
                  </div>
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
          <div class="md:col-span-2 flex items-end justify-end">
            <button @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
        <div class="overflow-x-auto h-[410px]">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody v-if="filteredProducts.length > 0" class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.id" 
                  class="hover:bg-gray-50 cursor-pointer"
                  @click="viewProductDetails(product.id)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path :d="getProductIcon(product.type)" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">{{ product.type }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ product.locationName }}</div>
                  <div class="text-sm text-gray-500">{{ product.locationAddress }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(product.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ product.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                  <div class="flex items-center justify-end space-x-2">
                    <button @click.stop="editProduct(product.id)"
                      class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 flex items-center justify-center space-x-1"
                      title="Edit Product">
                      <span>Edit</span>
                    </button>
                    <button @click.stop="toggleProductStatus(product)"
                      :disabled="toggleStatusLoading.has(product.id)"
                      :class="[
                        product.status === 'active' ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200',
                        toggleStatusLoading.has(product.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      ]"
                      class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors border flex items-center justify-center space-x-1"
                      :title="toggleStatusLoading.has(product.id) ? 'Updating...' : (product.status === 'active' ? 'Make Product Inactive' : 'Make Product Active')">
                      <svg v-if="toggleStatusLoading.has(product.id)" class="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span v-else>{{ product.status === 'active' ? 'Inactive' : 'Active' }}</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- Empty State Row -->
            <tbody v-if="filteredProducts.length === 0" class="bg-white">
              <tr>
                <td colspan="4" class="px-6 py-12 text-center">
                  <div>
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V5a2 2 0 00-2-2H9a2 2 0 00-2-2v2h10z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      {{ products.length === 0 ? 'Get started by creating a new product.' : 'Try adjusting your search or filters.' }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State (removed - now handled in table) -->
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeDeleteModal">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiDelete" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Delete Product</h3>
        
        <div v-if="productToDelete" class="bg-gray-100 rounded-lg p-4 mb-4">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="getProductIcon(productToDelete.type)" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ productToDelete.name }}</p>
              <p class="text-sm text-gray-500">{{ productToDelete.type }} • {{ productToDelete.locationName }}</p>
            </div>
          </div>
        </div>
        
        
        <div class="my-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-xs text-red-700">
          <strong>Warning:</strong> This will permanently remove the product from the system and affect any products that use it.
              </p>
            </div>
        
        <div class="flex space-x-3">
          <button
            @click="closeDeleteModal"
            :disabled="isDeleting"
            class="flex-1 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 flex-1"
          >
            Cancel
          </button>
          <button
            @click="showDeleteConfirmation"
            :disabled="isDeleting"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>

    <!-- Final Confirmation Modal -->
    <div v-if="showConfirmDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="cancelDelete">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Are you sure?</h3>
        <p class="text-sm text-gray-500 text-center mb-6">
          This action cannot be undone. The product will be permanently deleted from the system.
        </p>
        
        <div class="flex space-x-3">
          <button
            @click="cancelDelete"
            :disabled="isDeleting"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteProduct"
            :disabled="isDeleting"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isDeleting ? 'Deleting...' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Status Change Confirmation Modal -->
    <div v-if="showStatusConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="cancelStatusChange">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Confirm Status Change</h3>
        
        <div v-if="productToToggle" class="bg-gray-100 border-gray-200 rounded-lg p-4 mb-4">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="getProductIcon(productToToggle.type)" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ productToToggle.name }}</p>
              <p class="text-sm text-gray-500">{{ productToToggle.type }} • {{ productToToggle.locationName }}</p>
            </div>
          </div>
        </div>

        <div class="my-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-700 text-center">
            Are you sure you want to <strong>{{ productToToggle?.status === 'active' ? 'make this product inactive' : 'make this product active' }}</strong>?
          </p>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="cancelStatusChange"
            :disabled="toggleStatusLoading.has(productToToggle?.id || '')"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmStatusChange"
            :disabled="toggleStatusLoading.has(productToToggle?.id || '')"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            <svg v-if="toggleStatusLoading.has(productToToggle?.id || '')" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ toggleStatusLoading.has(productToToggle?.id || '') ? 'Updating...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeSuccessModal">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Success!</h3>
        <p class="text-sm text-gray-500 text-center mb-6">
          {{ successMessage }}
        </p>
        
        <div class="flex justify-center">
          <button
            @click="closeSuccessModal"
            class="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <!-- <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeErrorModal">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4" @click.stop>
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Error loading Products</h3>
        <p class="text-sm text-gray-500 text-center mb-6">
          {{ errorMessage }}
        </p>
        
        <div class="flex justify-center">
          <button
            @click="closeErrorModal"
            class="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div> -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiPackageVariant, mdiDelete, mdiDeskLamp, mdiAccountGroup, mdiChairRolling, mdiBookOpen } from '@mdi/js'
import { productApi, type Product } from '@/services/api'

// Interface for API response data (before transformation)
interface ApiProductResponse {
  id: string | number
  name: string
  type?: string
  product_type?: string
  category?: string
  ProductType?: string
  productType?: string
  location_name?: string
  address?: string
  location_address?: string
  company_name?: string
  company_id?: string | number
  location_id?: string | number
  capacity?: number
  is_active?: boolean | number
  facilities?: string[]
  description?: string
}

// Router
const router = useRouter()

// State
const searchQuery = ref('')
const showDeleteModal = ref(false)
const showConfirmDelete = ref(false)
const productToDelete = ref<Product | null>(null)
const isDeleting = ref(false)
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')
const showNotification = ref(false)
const toggleStatusLoading = ref<Set<string>>(new Set())
const showStatusConfirmModal = ref(false)
const productToToggle = ref<Product | null>(null)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Dropdown states for arrow rotation
const dropdownStates = ref({
  status: false,
  location: false,
  productType: false
})

// Dropdown options
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

const locationOptions = computed(() => {
  const options = [{ value: '', label: 'All Locations' }]
  availableLocations.value.forEach(location => {
    options.push({
      value: location,
      label: location
    })
  })
  return options
})

const productTypeOptions = computed(() => {
  const options = [{ value: '', label: 'All Types' }]
  availableProductTypes.value.forEach(type => {
    options.push({
      value: type,
      label: type
    })
  })
  return options
})

// Filters
const filters = ref({
  status: '',
  productType: '',
  location: ''
})

// Products data - now properly typed
const products = ref<Product[]>([])

// Available locations (derived from product data)
const availableLocations = computed(() => {
  const set = new Set<string>()
  products.value.forEach(p => set.add(p.locationName))
  return Array.from(set)
})

// Available product types (derived from product data)
const availableProductTypes = computed(() => {
  const set = new Set<string>()
  products.value.forEach(p => {
    if (p.type) {
      set.add(p.type)
    }
  })
  return Array.from(set)
})

// Helper function to map API product types to our valid types
const mapProductType = (apiType: string): 'Meeting Room' | 'Hot Desk' | 'Dedicated Desk' => {
  if (!apiType) return 'Meeting Room'
  
  const normalizedType = apiType.toLowerCase().trim()
  
  if (normalizedType.includes('meeting') || normalizedType.includes('conference') || normalizedType.includes('room')) {
    return 'Meeting Room'
  } else if (normalizedType.includes('hot') || normalizedType.includes('hotdesk') || normalizedType.includes('hot desk')) {
    return 'Hot Desk'
  } else if (normalizedType.includes('dedicated') || normalizedType.includes('fixed') || normalizedType.includes('private desk')) {
    return 'Dedicated Desk'
  }
  
  // Default fallback
  return 'Meeting Room'
}

// Load products from API
const loadProducts = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await productApi.getAllProducts()
    if (response.success && response.data) {
      // Transform API data to match our Product interface
      products.value = response.data.map((apiProduct: ApiProductResponse) => {
        
        return {
          id: String(apiProduct.id),
          name: apiProduct.name || 'Unknown Product',
          locationName: apiProduct.location_name || 'Unknown Location',
          locationAddress: apiProduct.address || apiProduct.location_address || 'Unknown Address',
          companyName: apiProduct.company_name || 'Unknown Company',
          companyId: String(apiProduct.company_id || 'unknown'),
          locationId: String(apiProduct.location_id || 'unknown'),
          maxSeatingCapacity: apiProduct.capacity || 1,
          status: (apiProduct.is_active === true || apiProduct.is_active === 1) ? 'active' as const : 'inactive' as const,
          type: mapProductType(apiProduct.type || apiProduct.product_type || apiProduct.category || apiProduct.ProductType || apiProduct.productType || ''),
          description: apiProduct.description || '',
          pricePerHour: 0,
          pricePerDay: 0,
          pricePerMonth: 0,
          pricePerYear: 0,
          images: [],
          openDays: [],
          openHours: { start: '09:00', end: '17:00' },
          defaultFacilities: apiProduct.facilities || [],
          additionalFacilities: []
        }
      }) as Product[]
    } else {
      const errorMsg = response.message || 'Failed to load products'
      error.value = errorMsg
      showErrorModalWithMessage(errorMsg)
    }
  } catch (err) {
    console.error('Error loading products:', err)
    const errorMsg = 'An error occurred while loading products'
    error.value = errorMsg
    showErrorModalWithMessage(errorMsg)
  } finally {
    isLoading.value = false
  }
}

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.type.toLowerCase().includes(query) ||
      product.companyName.toLowerCase().includes(query) ||
      product.locationName.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(product => product.status === filters.value.status)
  }

  // Product type filter
  if (filters.value.productType) {
    filtered = filtered.filter(product => product.type === filters.value.productType)
  }

  // Location filter
  if (filters.value.location) {
    filtered = filtered.filter(product => product.locationName === filters.value.location)
  }

  return filtered
})

// Methods
const getProductIcon = (type: string) => {
  switch (type) {
    case 'Meeting Room':
      return mdiAccountGroup
    case 'Hot Desk':
      return mdiDeskLamp
    case 'Dedicated Desk':
      return mdiChairRolling
    default:
      return mdiPackageVariant
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
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
  dropdownStates.value.status = false
  dropdownStates.value.location = false
  dropdownStates.value.productType = false
}

// Dropdown label functions
const getStatusLabel = (value: string) => {
  const option = statusOptions.find(opt => opt.value === value)
  return option ? option.label : 'All Status'
}

const getLocationLabel = (value: string) => {
  const option = locationOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All Locations'
}

const getProductTypeLabel = (value: string) => {
  const option = productTypeOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All Types'
}

// Dropdown select functions
const selectStatus = (value: string) => {
  filters.value.status = value
  closeAllDropdowns()
}

const selectLocation = (value: string) => {
  filters.value.location = value
  closeAllDropdowns()
}

const selectProductType = (value: string) => {
  filters.value.productType = value
  closeAllDropdowns()
}

// Row click handler to view product details
const viewProductDetails = (productId: string) => {
  // Navigate to product details page
  router.push(`/products/${productId}`)
}

// Edit product handler
const editProduct = (productId: string) => {
  // Navigate to product edit page
  router.push(`/products/${productId}/edit`)
}

const confirmDeleteProduct = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const showDeleteConfirmation = () => {
  showDeleteModal.value = false
  showConfirmDelete.value = true
}

const closeDeleteModal = () => {
  if (!isDeleting.value) {
    showDeleteModal.value = false
    showConfirmDelete.value = false
    productToDelete.value = null
  }
}

const cancelDelete = () => {
  showConfirmDelete.value = false
  showDeleteModal.value = false
  productToDelete.value = null
}

const deleteProduct = async () => {
  if (!productToDelete.value) return
  
  isDeleting.value = true
  
  try {
    // Call the delete product API
    const response = await productApi.deleteProduct(productToDelete.value.id)
    
    if (response.success) {
      // Remove from local products list
      const index = products.value.findIndex(p => p.id === productToDelete.value!.id)
      if (index !== -1) {
        products.value.splice(index, 1)
      }
      
      // Add to localStorage for audit trail
      const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]')
      deletedProducts.push({
        ...productToDelete.value,
        deletedAt: new Date().toISOString(),
        deletedBy: 'Admin User'
      })
      localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts))
      
      console.log('Product deleted successfully:', response.message)
      
      // Close the confirmation modals immediately
      showConfirmDelete.value = false
      showDeleteModal.value = false
      productToDelete.value = null
      
      // Show success modal
      showSuccessModalWithMessage(response.message || 'Product deleted successfully')
      
    } else {
      console.error('Failed to delete product:', response.message)
      // Close confirmation modals and show error modal
      showConfirmDelete.value = false
      showDeleteModal.value = false
      productToDelete.value = null
      showErrorModalWithMessage(response.message || 'Failed to delete product')
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    // Close confirmation modals and show error modal
    showConfirmDelete.value = false
    showDeleteModal.value = false
    productToDelete.value = null
    showErrorModalWithMessage('An error occurred while deleting the product')
  } finally {
    isDeleting.value = false
  }
}

const toggleProductStatus = async (product: Product) => {
  productToToggle.value = product
  showStatusConfirmModal.value = true
}

const confirmStatusChange = async () => {
  if (!productToToggle.value) return
  
  const product = productToToggle.value
  const originalStatus = product.status
  const newStatus = product.status === 'active' ? 'inactive' : 'active'
  const isActive = newStatus === 'active'
  
  try {
    // Add to loading state
    toggleStatusLoading.value.add(product.id)
    
    // Optimistically update the UI
    product.status = newStatus
    
    // Use the new activateProduct API method
    const response = await productApi.activateProduct(product.id, isActive)
    
    if (response.success) {
      console.log(`Product ${product.name} status changed to ${product.status}`)
      const customMessage = isActive ? 'Product made active successfully' : 'Product made inactive successfully'
      showSuccessModalWithMessage(customMessage)
    } else {
      console.error('Failed to toggle product status:', response.message)
      // Revert the status change if API call fails
      product.status = originalStatus
      showErrorModalWithMessage(response.message || 'Failed to update product status')
    }
  } catch (error) {
    console.error('Error toggling product status:', error)
    // Revert the status change if API call fails
    product.status = originalStatus
    showErrorModalWithMessage('An error occurred while updating product status')
  } finally {
    // Remove from loading state
    toggleStatusLoading.value.delete(product.id)
    // Close the confirmation modal
    showStatusConfirmModal.value = false
    productToToggle.value = null
  }
}

const cancelStatusChange = () => {
  showStatusConfirmModal.value = false
  productToToggle.value = null
}

// Modal functions
const showSuccessModalWithMessage = (message: string) => {
  successMessage.value = message
  showSuccessModal.value = true
}

const showErrorModalWithMessage = (message: string) => {
  errorMessage.value = message
  showErrorModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  successMessage.value = ''
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

// Notification helpers (keeping for backward compatibility)

const showError = (message: string) => {
  error.value = message
  successMessage.value = ''
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 5000)
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    status: '',
  productType: '',
  location: ''
  }
}

// Load products on component mount
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>