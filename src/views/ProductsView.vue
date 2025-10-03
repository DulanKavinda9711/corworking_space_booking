<template>
  <AdminLayout>
    <div class="space-y-6" @click="closeAllDropdowns">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiGoogleClassroom" />
          </svg>
          <span class="text-sm font-medium text-green-700">
            Total Products:
            <span class="font-bold text-green-800">{{ filteredProducts.length }}</span>
          </span>
        </div>
        <PermissionGuard permission="create_products">
          <router-link to="/products/add"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Product</span>
          </router-link>
        </PermissionGuard>
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
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:ring-1 focus:z-10 text-black"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative" @click.stop>
              <div @click="toggleDropdown('status')" :class="['w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center', dropdownStates.status ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                <span class="text-gray-900 leading-5 h-5 flex items-center">{{ getStatusLabel(filters.status) }}</span>
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
              <div @click="toggleDropdown('location')" :class="['w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center', dropdownStates.location ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                <span class="text-gray-900 leading-5 h-5 flex items-center truncate">{{ getLocationLabel(filters.location) }}</span>
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
              <div @click="toggleDropdown('productType')" :class="['w-full rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 cursor-pointer bg-white min-h-[2.5rem] flex items-center', dropdownStates.productType ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'border border-gray-300']">
                <span class="text-gray-900 leading-5 h-5 flex items-center truncate">{{ getProductTypeLabel(filters.productType) }}</span>
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
                        <!-- Meeting Room Custom SVG -->
                        <svg v-if="product.type === 'Meeting Room'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <!-- Hot Desk Custom SVG -->
                        <svg v-else-if="product.type === 'Hot Desk'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 122.88 73.12">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M97.13,61.06c3.25,0,5.88,0.56,5.88,1.25s-2.63,1.25-5.88,1.25c-3.25,0-5.88-0.56-5.88-1.25 S93.88,61.06,97.13,61.06L97.13,61.06z M25.08,14.73v56.31c0,0.58-0.24,1.1-0.61,1.48c-0.38,0.38-0.9,0.61-1.48,0.61h-9.92 c-0.57,0-1.09-0.23-1.47-0.61l0,0l0,0l0,0c-0.38-0.38-0.61-0.9-0.61-1.47V14.73H2.96c-0.82,0-1.56-0.33-2.09-0.87 C0.33,13.32,0,12.58,0,11.77V2.96C0,2.14,0.33,1.4,0.87,0.87S2.14,0,2.96,0h116.96c0.82,0,1.56,0.33,2.09,0.87s0.87,1.28,0.87,2.09 v8.81c0,0.82-0.33,1.56-0.87,2.09c-0.54,0.54-1.28,0.87-2.09,0.87h-0.19v56.31c0,0.57-0.24,1.09-0.61,1.47l-0.01,0.01 c-0.38,0.38-0.9,0.61-1.47,0.61H77.18c-0.58,0-1.1-0.23-1.48-0.61c-0.07-0.07-0.13-0.14-0.19-0.22c-0.27-0.35-0.43-0.79-0.43-1.26 V14.73H25.08L25.08,14.73z M78.54,30.64h37.74V14.73H78.54V30.64L78.54,30.64z M116.28,34.09H78.54V50.3h37.74V34.09L116.28,34.09z M116.28,53.75H78.54v15.93h37.74V53.75L116.28,53.75z M119.43,3.45H3.45v7.83h115.98V3.45L119.43,3.45z M21.63,14.73h-7.21v54.94 h7.21V14.73L21.63,14.73z M97.13,21.27c3.25,0,5.88,0.53,5.88,1.19s-2.63,1.19-5.88,1.19c-3.25,0-5.88-0.53-5.88-1.19 S93.88,21.27,97.13,21.27L97.13,21.27z M97.13,41.13c3.25,0,5.88,0.56,5.88,1.25s-2.63,1.25-5.88,1.25c-3.25,0-5.88-0.56-5.88-1.25 S93.88,41.13,97.13,41.13L97.13,41.13z" />
                        </svg>
                        <!-- Dedicated Desk Custom SVG -->
                        <svg v-else-if="product.type === 'Dedicated Desk'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 122.88 107.29">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M28,18.22a1,1,0,0,0-.36.42,1.54,1.54,0,0,0-.12.67,5.83,5.83,0,0,0,1.2,2.91h0l2.51,4a21.61,21.61,0,0,0,3.37,4.45,6.91,6.91,0,0,0,4.82,1.94,7.12,7.12,0,0,0,5.1-2A22.16,22.16,0,0,0,48,25.85l2.83-4.66a10.13,10.13,0,0,0,.53-1.48c.45-1.8-.72-1.4-2.08-1.43a4.23,4.23,0,0,1-.5-.05l1-3.69c-7.2,1.14-12.58-4.21-20.18-1.07l.55,4.46c-.77,0-1.41-.21-2.13.29ZM74.68,10H114.3a3.25,3.25,0,0,1,3.23,3.23V39.48a3.25,3.25,0,0,1-3.23,3.23H99.54l2.52,6.35H118a4.89,4.89,0,0,1,4.88,4.88V65.08A4.91,4.91,0,0,1,118,70h-2.47V103.6a3.69,3.69,0,0,1-3.69,3.69H11.59a3.73,3.73,0,0,1-3.71-3.72V70h-3A4.9,4.9,0,0,1,0,65.07V53.93a4.88,4.88,0,0,1,4.88-4.87h7.59c0-1.35,0-2.11,0-3.46,0-8.5,14.26-7.89,19.18-11.1a27.65,27.65,0,0,0,1.29-3.38L33,31A26.54,26.54,0,0,1,30,27l-2.51-4a7.27,7.27,0,0,1-1.43-3.64,3,3,0,0,1,.25-1.32,2.42,2.42,0,0,1,.86-1,3.07,3.07,0,0,1,.6-.31,55.24,55.24,0,0,1-.12-6.59A10.62,10.62,0,0,1,28,8.52a10.53,10.53,0,0,1,7-6.76c1.57-.54,1-1.83,2.56-1.76,3.74.21,9.53,2.63,11.76,5.18C52.4,8.78,51.6,12.6,51.49,17h0a1.78,1.78,0,0,1,1.32,1.36,5.73,5.73,0,0,1-.68,3.43h0a.14.14,0,0,1-.05.08l-2.86,4.71a23,23,0,0,1-3.73,5l-.06.09.46.67c.5.73,1.06,1.56,1.59,2.21,3.94,2.45,17.81,3,18.05,9.13l.21,5.35H87l3-6.35H74.68a3.25,3.25,0,0,1-3.23-3.23V13.2A3.24,3.24,0,0,1,74.68,10Zm-70,43.76a.3.3,0,0,0-.08.2V65.07a.27.27,0,0,0,.27.29H118a.27.27,0,0,0,.28-.29V53.93a.27.27,0,0,0-.09-.2.29.29,0,0,0-.2-.09c-10.48,0-113-.14-113.28.09ZM12.47,70v32.73H111V70ZM34.92,39a3.1,3.1,0,0,1,0-4.55,10.66,10.66,0,0,1,3.78,2,2.21,2.21,0,0,1,1-.16,24.37,24.37,0,0,1,4.13-2.12c1.85,1.8,1.66,3.47-.16,5a8.27,8.27,0,0,1-2.32-1.07,3.27,3.27,0,0,1-.2.79l2,7.81c1.54-3.24,3.14-6.6,3.54-10.79a30.66,30.66,0,0,1-2-2.71c-.15-.21-.28-.4-.4-.59A8.33,8.33,0,0,1,39.44,34a8.08,8.08,0,0,1-5.29-1.9,16.7,16.7,0,0,1-1.53,3.59,1.07,1.07,0,0,1-.14.16A38.16,38.16,0,0,0,36.26,46.7l2-7.81a2.4,2.4,0,0,1-.4-1.29,8.88,8.88,0,0,1-3,1.36Z" />
                        </svg>
                        <!-- Other Product Types (fallback) -->
                        <svg v-else class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
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
                    <!-- Edit Button - Hidden if no edit permission -->
                    <PermissionGuard permission="edit_products">
                      <button @click.stop="editProduct(product.id)"
                        class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 flex items-center justify-center space-x-1"
                        title="Edit Product">
                        <span>Edit</span>
                      </button>
                    </PermissionGuard>
                    
                    <!-- Toggle Status Button - Hidden if no edit permission -->
                    <PermissionGuard permission="edit_products">
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
                    </PermissionGuard>
                    
                    <!-- Show message if no actions available -->
                    <div v-if="!hasAnyProductPermissions" class="text-sm text-gray-500 italic">
                      No actions available
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- Empty State Row -->
            <tbody v-if="filteredProducts.length === 0" class="bg-white">
              <tr>
                <td colspan="4" class="px-6 py-12 text-center">
                  <div>
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiGoogleClassroom" />
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
              <!-- Meeting Room Custom SVG -->
              <svg v-if="productToDelete.type === 'Meeting Room'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <!-- Hot Desk Custom SVG -->
              <svg v-else-if="productToDelete.type === 'Hot Desk'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 122.88 73.12">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M97.13,61.06c3.25,0,5.88,0.56,5.88,1.25s-2.63,1.25-5.88,1.25c-3.25,0-5.88-0.56-5.88-1.25 S93.88,61.06,97.13,61.06L97.13,61.06z M25.08,14.73v56.31c0,0.58-0.24,1.1-0.61,1.48c-0.38,0.38-0.9,0.61-1.48,0.61h-9.92 c-0.57,0-1.09-0.23-1.47-0.61l0,0l0,0l0,0c-0.38-0.38-0.61-0.9-0.61-1.47V14.73H2.96c-0.82,0-1.56-0.33-2.09-0.87 C0.33,13.32,0,12.58,0,11.77V2.96C0,2.14,0.33,1.4,0.87,0.87S2.14,0,2.96,0h116.96c0.82,0,1.56,0.33,2.09,0.87s0.87,1.28,0.87,2.09 v8.81c0,0.82-0.33,1.56-0.87,2.09c-0.54,0.54-1.28,0.87-2.09,0.87h-0.19v56.31c0,0.57-0.24,1.09-0.61,1.47l-0.01,0.01 c-0.38,0.38-0.9,0.61-1.47,0.61H77.18c-0.58,0-1.1-0.23-1.48-0.61c-0.07-0.07-0.13-0.14-0.19-0.22c-0.27-0.35-0.43-0.79-0.43-1.26 V14.73H25.08L25.08,14.73z M78.54,30.64h37.74V14.73H78.54V30.64L78.54,30.64z M116.28,34.09H78.54V50.3h37.74V34.09L116.28,34.09z M116.28,53.75H78.54v15.93h37.74V53.75L116.28,53.75z M119.43,3.45H3.45v7.83h115.98V3.45L119.43,3.45z M21.63,14.73h-7.21v54.94 h7.21V14.73L21.63,14.73z M97.13,21.27c3.25,0,5.88,0.53,5.88,1.19s-2.63,1.19-5.88,1.19c-3.25,0-5.88-0.53-5.88-1.19 S93.88,21.27,97.13,21.27L97.13,21.27z M97.13,41.13c3.25,0,5.88,0.56,5.88,1.25s-2.63,1.25-5.88,1.25c-3.25,0-5.88-0.56-5.88-1.25 S93.88,41.13,97.13,41.13L97.13,41.13z" />
              </svg>
              <!-- Dedicated Desk Custom SVG -->
              <svg v-else-if="productToDelete.type === 'Dedicated Desk'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 122.88 107.29">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M28,18.22a1,1,0,0,0-.36.42,1.54,1.54,0,0,0-.12.67,5.83,5.83,0,0,0,1.2,2.91h0l2.51,4a21.61,21.61,0,0,0,3.37,4.45,6.91,6.91,0,0,0,4.82,1.94,7.12,7.12,0,0,0,5.1-2A22.16,22.16,0,0,0,48,25.85l2.83-4.66a10.13,10.13,0,0,0,.53-1.48c.45-1.8-.72-1.4-2.08-1.43a4.23,4.23,0,0,1-.5-.05l1-3.69c-7.2,1.14-12.58-4.21-20.18-1.07l.55,4.46c-.77,0-1.41-.21-2.13.29ZM74.68,10H114.3a3.25,3.25,0,0,1,3.23,3.23V39.48a3.25,3.25,0,0,1-3.23,3.23H99.54l2.52,6.35H118a4.89,4.89,0,0,1,4.88,4.88V65.08A4.91,4.91,0,0,1,118,70h-2.47V103.6a3.69,3.69,0,0,1-3.69,3.69H11.59a3.73,3.73,0,0,1-3.71-3.72V70h-3A4.9,4.9,0,0,1,0,65.07V53.93a4.88,4.88,0,0,1,4.88-4.87h7.59c0-1.35,0-2.11,0-3.46,0-8.5,14.26-7.89,19.18-11.1a27.65,27.65,0,0,0,1.29-3.38L33,31A26.54,26.54,0,0,1,30,27l-2.51-4a7.27,7.27,0,0,1-1.43-3.64,3,3,0,0,1,.25-1.32,2.42,2.42,0,0,1,.86-1,3.07,3.07,0,0,1,.6-.31,55.24,55.24,0,0,1-.12-6.59A10.62,10.62,0,0,1,28,8.52a10.53,10.53,0,0,1,7-6.76c1.57-.54,1-1.83,2.56-1.76,3.74.21,9.53,2.63,11.76,5.18C52.4,8.78,51.6,12.6,51.49,17h0a1.78,1.78,0,0,1,1.32,1.36,5.73,5.73,0,0,1-.68,3.43h0a.14.14,0,0,1-.05.08l-2.86,4.71a23,23,0,0,1-3.73,5l-.06.09.46.67c.5.73,1.06,1.56,1.59,2.21,3.94,2.45,17.81,3,18.05,9.13l.21,5.35H87l3-6.35H74.68a3.25,3.25,0,0,1-3.23-3.23V13.2A3.24,3.24,0,0,1,74.68,10Zm-70,43.76a.3.3,0,0,0-.08.2V65.07a.27.27,0,0,0,.27.29H118a.27.27,0,0,0,.28-.29V53.93a.27.27,0,0,0-.09-.2.29.29,0,0,0-.2-.09c-10.48,0-113-.14-113.28.09ZM12.47,70v32.73H111V70ZM34.92,39a3.1,3.1,0,0,1,0-4.55,10.66,10.66,0,0,1,3.78,2,2.21,2.21,0,0,1,1-.16,24.37,24.37,0,0,1,4.13-2.12c1.85,1.8,1.66,3.47-.16,5a8.27,8.27,0,0,1-2.32-1.07,3.27,3.27,0,0,1-.2.79l2,7.81c1.54-3.24,3.14-6.6,3.54-10.79a30.66,30.66,0,0,1-2-2.71c-.15-.21-.28-.4-.4-.59A8.33,8.33,0,0,1,39.44,34a8.08,8.08,0,0,1-5.29-1.9,16.7,16.7,0,0,1-1.53,3.59,1.07,1.07,0,0,1-.14.16A38.16,38.16,0,0,0,36.26,46.7l2-7.81a2.4,2.4,0,0,1-.4-1.29,8.88,8.88,0,0,1-3,1.36Z" />
              </svg>
              <!-- Other Product Types (fallback) -->
              <svg v-else class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
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
              <!-- Meeting Room Custom SVG -->
              <svg v-if="productToToggle.type === 'Meeting Room'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <!-- Hot Desk Custom SVG -->
              <svg v-else-if="productToToggle.type === 'Hot Desk'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 122.88 73.12">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M97.13,61.06c3.25,0,5.88,0.56,5.88,1.25s-2.63,1.25-5.88,1.25c-3.25,0-5.88-0.56-5.88-1.25 S93.88,61.06,97.13,61.06L97.13,61.06z M25.08,14.73v56.31c0,0.58-0.24,1.1-0.61,1.48c-0.38,0.38-0.9,0.61-1.48,0.61h-9.92 c-0.57,0-1.09-0.23-1.47-0.61l0,0l0,0l0,0c-0.38-0.38-0.61-0.9-0.61-1.47V14.73H2.96c-0.82,0-1.56-0.33-2.09-0.87 C0.33,13.32,0,12.58,0,11.77V2.96C0,2.14,0.33,1.4,0.87,0.87S2.14,0,2.96,0h116.96c0.82,0,1.56,0.33,2.09,0.87s0.87,1.28,0.87,2.09 v8.81c0,0.82-0.33,1.56-0.87,2.09c-0.54,0.54-1.28,0.87-2.09,0.87h-0.19v56.31c0,0.57-0.24,1.09-0.61,1.47l-0.01,0.01 c-0.38,0.38-0.9,0.61-1.47,0.61H77.18c-0.58,0-1.1-0.23-1.48-0.61c-0.07-0.07-0.13-0.14-0.19-0.22c-0.27-0.35-0.43-0.79-0.43-1.26 V14.73H25.08L25.08,14.73z M78.54,30.64h37.74V14.73H78.54V30.64L78.54,30.64z M116.28,34.09H78.54V50.3h37.74V34.09L116.28,34.09z M116.28,53.75H78.54v15.93h37.74V53.75L116.28,53.75z M119.43,3.45H3.45v7.83h115.98V3.45L119.43,3.45z M21.63,14.73h-7.21v54.94 h7.21V14.73L21.63,14.73z M97.13,21.27c3.25,0,5.88,0.53,5.88,1.19s-2.63,1.19-5.88,1.19c-3.25,0-5.88-0.53-5.88-1.19 S93.88,21.27,97.13,21.27L97.13,21.27z M97.13,41.13c3.25,0,5.88,0.56,5.88,1.25s-2.63,1.25-5.88,1.25c-3.25,0-5.88-0.56-5.88-1.25 S93.88,41.13,97.13,41.13L97.13,41.13z" />
              </svg>
              <!-- Dedicated Desk Custom SVG -->
              <svg v-else-if="productToToggle.type === 'Dedicated Desk'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 122.88 107.29">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M28,18.22a1,1,0,0,0-.36.42,1.54,1.54,0,0,0-.12.67,5.83,5.83,0,0,0,1.2,2.91h0l2.51,4a21.61,21.61,0,0,0,3.37,4.45,6.91,6.91,0,0,0,4.82,1.94,7.12,7.12,0,0,0,5.1-2A22.16,22.16,0,0,0,48,25.85l2.83-4.66a10.13,10.13,0,0,0,.53-1.48c.45-1.8-.72-1.4-2.08-1.43a4.23,4.23,0,0,1-.5-.05l1-3.69c-7.2,1.14-12.58-4.21-20.18-1.07l.55,4.46c-.77,0-1.41-.21-2.13.29ZM74.68,10H114.3a3.25,3.25,0,0,1,3.23,3.23V39.48a3.25,3.25,0,0,1-3.23,3.23H99.54l2.52,6.35H118a4.89,4.89,0,0,1,4.88,4.88V65.08A4.91,4.91,0,0,1,118,70h-2.47V103.6a3.69,3.69,0,0,1-3.69,3.69H11.59a3.73,3.73,0,0,1-3.71-3.72V70h-3A4.9,4.9,0,0,1,0,65.07V53.93a4.88,4.88,0,0,1,4.88-4.87h7.59c0-1.35,0-2.11,0-3.46,0-8.5,14.26-7.89,19.18-11.1a27.65,27.65,0,0,0,1.29-3.38L33,31A26.54,26.54,0,0,1,30,27l-2.51-4a7.27,7.27,0,0,1-1.43-3.64,3,3,0,0,1,.25-1.32,2.42,2.42,0,0,1,.86-1,3.07,3.07,0,0,1,.6-.31,55.24,55.24,0,0,1-.12-6.59A10.62,10.62,0,0,1,28,8.52a10.53,10.53,0,0,1,7-6.76c1.57-.54,1-1.83,2.56-1.76,3.74.21,9.53,2.63,11.76,5.18C52.4,8.78,51.6,12.6,51.49,17h0a1.78,1.78,0,0,1,1.32,1.36,5.73,5.73,0,0,1-.68,3.43h0a.14.14,0,0,1-.05.08l-2.86,4.71a23,23,0,0,1-3.73,5l-.06.09.46.67c.5.73,1.06,1.56,1.59,2.21,3.94,2.45,17.81,3,18.05,9.13l.21,5.35H87l3-6.35H74.68a3.25,3.25,0,0,1-3.23-3.23V13.2A3.24,3.24,0,0,1,74.68,10Zm-70,43.76a.3.3,0,0,0-.08.2V65.07a.27.27,0,0,0,.27.29H118a.27.27,0,0,0,.28-.29V53.93a.27.27,0,0,0-.09-.2.29.29,0,0,0-.2-.09c-10.48,0-113-.14-113.28.09ZM12.47,70v32.73H111V70ZM34.92,39a3.1,3.1,0,0,1,0-4.55,10.66,10.66,0,0,1,3.78,2,2.21,2.21,0,0,1,1-.16,24.37,24.37,0,0,1,4.13-2.12c1.85,1.8,1.66,3.47-.16,5a8.27,8.27,0,0,1-2.32-1.07,3.27,3.27,0,0,1-.2.79l2,7.81c1.54-3.24,3.14-6.6,3.54-10.79a30.66,30.66,0,0,1-2-2.71c-.15-.21-.28-.4-.4-.59A8.33,8.33,0,0,1,39.44,34a8.08,8.08,0,0,1-5.29-1.9,16.7,16.7,0,0,1-1.53,3.59,1.07,1.07,0,0,1-.14.16A38.16,38.16,0,0,0,36.26,46.7l2-7.81a2.4,2.4,0,0,1-.4-1.29,8.88,8.88,0,0,1-3,1.36Z" />
              </svg>
              <!-- Other Product Types (fallback) -->
              <svg v-else class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
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
import PermissionGuard from '@/components/ui/PermissionGuard.vue'
import { mdiPackageVariant, mdiDelete, mdiDeskLamp, mdiAccountGroup, mdiChairRolling, mdiBookOpen, mdiGoogleClassroom } from '@mdi/js'
import { productApi, type Product } from '@/services/api'
import { usePermissions } from '@/composables/usePermissions'

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
const permissionsStore = usePermissions()

// Check if user has any product permissions
const hasAnyProductPermissions = computed(() => {
  return permissionsStore.hasPermission('create_products') || 
         permissionsStore.hasPermission('edit_products')
})

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
  
  // Always include the main product types
  const defaultTypes = ['Meeting Room', 'Hot Desk', 'Dedicated Desk']
  
  // Add default types that aren't already in the data
  defaultTypes.forEach(type => {
    if (!availableProductTypes.value.includes(type)) {
      options.push({
        value: type,
        label: type
      })
    }
  })
  
  // Add any additional types from the data
  availableProductTypes.value.forEach(type => {
    if (!options.some(opt => opt.value === type)) {
      options.push({
        value: type,
        label: type
      })
    }
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