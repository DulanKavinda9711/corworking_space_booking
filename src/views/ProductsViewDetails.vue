<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/products" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Product Details</h1>
            <p class="text-sm text-gray-500" v-if="product">{{ product.type }} • {{ product.locationName }}</p>
          </div>
        </div>
        <div class="flex space-x-3">
          <router-link v-if="product" :to="`/products/${productId}/edit`" 
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiPencil" />
            </svg>
            <span>Edit Product</span>
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Product Not Found -->
      <div v-else-if="!product || error" class="bg-white rounded-xl shadow-card p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ error || 'Product Not Found' }}</h3>
        <p class="text-gray-500 mb-6">{{ error ? 'Please try again later.' : 'The product you\'re looking for doesn\'t exist or has been removed.' }}</p>
        <router-link to="/products" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </router-link>
      </div>

      <!-- Product Details -->
      <div v-else class="space-y-6">
        <!-- Overview Card -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <div class="flex items-start justify-between mb-6">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="getProductIcon(product.type)" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">{{ product.name }}</h2>
                  <div class="flex items-center space-x-4 mt-2">
                    <span :class="getStatusClass(product.status)" class="px-3 py-1 text-sm font-medium rounded-full">
                      {{ product.status }}
                    </span>
                    <span class="text-sm text-gray-500">
                      Product ID: {{ product.id }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Key Information -->
            <!-- Key Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Key Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Product Type Card -->
                <div class="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex flex-col items-center justify-center space-y-3 mb-3">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="getProductIcon(product.type)" />
                  </svg>
                  </div>
                  <div class="text-center">
                  <div class="text-sm font-medium text-gray-900">Product Type</div>
                  <div class="text-xl font-bold text-gray-900">{{ product.type }}</div>
                  </div>
                </div>
                </div>

              <!-- Max Capacity Card -->
                <!-- Max Capacity Card -->
                <div class="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex flex-col items-center justify-center space-y-3 mb-3">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiAccountGroup" />
                  </svg>
                  </div>
                  <div class="text-center">
                  <div class="text-sm font-medium text-gray-900">Max Capacity</div>
                  <div class="text-xl font-bold text-gray-900">{{ product.maxSeatingCapacity }} {{ product.maxSeatingCapacity === 1 ? 'person' : 'people' }}</div>
                  </div>
                </div>
                </div>

              <!-- Location Card -->
              <div class="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <div class="flex flex-col items-center text-center space-y-3 mb-3">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900">Location</div>
                <div class="text-lg font-bold text-gray-900 mb-1">{{ product.locationName }}</div>
                <div class="text-sm text-gray-600 mb-2">{{ product.locationAddress }}</div>
                <a v-if="product.locationUrl" :href="product.locationUrl" target="_blank" 
                 class="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 font-medium">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View on Map
                </a>
              </div>
              </div>
              </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="product.description">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
            </div>
          </div>
        </div>

        <!-- Images Section -->
        <div v-if="product.images && product.images.length > 0" class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Product Images</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div v-for="(image, index) in product.images" :key="index" class="relative group">
                <div class="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img :src="image" :alt="`Product image ${index + 1}`" 
                       class="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                       @click="openImageModal(image, index)"
                       @error="handleImageError($event)">
                  <!-- Overlay on hover -->
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 rounded-full p-2">
                      <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Section -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-black-600" fill="black" viewBox="0 0 24 24">
                <path :d="mdiCurrencyUsd" />
              </svg>
              Pricing
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-if="product.pricePerHour && product.pricePerHour > 0" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div class="text-sm font-medium text-green-600 mb-1">Per Hour</div>
                <div class="text-2xl font-bold text-green-800">${{ product.pricePerHour }}</div>
              </div>
              <div v-if="product.pricePerDay && product.pricePerDay > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="text-sm font-medium text-blue-600 mb-1">Per Day</div>
                <div class="text-2xl font-bold text-blue-800">${{ product.pricePerDay }}</div>
              </div>
              <div v-if="product.pricePerMonth && product.pricePerMonth > 0" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div class="text-sm font-medium text-purple-600 mb-1">Per Month</div>
                <div class="text-2xl font-bold text-purple-800">${{ product.pricePerMonth }}</div>
              </div>
              <div v-if="product.pricePerYear && product.pricePerYear > 0" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div class="text-sm font-medium text-orange-600 mb-1">Per Year</div>
                <div class="text-2xl font-bold text-orange-800">${{ product.pricePerYear }}</div>
              </div>
              <!-- Show no pricing message if no pricing is available -->
              <div v-if="!product.pricePerHour && !product.pricePerDay && !product.pricePerMonth && !product.pricePerYear" 
                   class="col-span-full text-center py-8 text-gray-500">
                <svg class="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <p class="text-sm">No pricing information available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Availability Section -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiClockOutline" />
              </svg>
              Availability & Operating Hours
            </h3>
            
            <!-- Daily Schedule -->
            <div v-if="product.operation_schedule && product.operation_schedule.length > 0" class="space-y-4">
              <h4 class="text-sm font-medium text-gray-700 mb-4">Operating Hours (Open Days Only)</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="schedule in getOpenDaysSchedule()" :key="schedule.day" 
                     class="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all duration-200">
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <!-- Day Status Indicator -->
                      <div class="w-3 h-3 rounded-full flex-shrink-0 bg-green-500"></div>
                      
                      <!-- Day Name -->
                      <span class="text-green-900 font-semibold text-sm">
                        {{ schedule.day }}
                      </span>
                    </div>
                    
                    <!-- Operating Hours -->
                    <div class="text-right">
                      <div v-if="schedule.start_time && schedule.end_time" 
                           class="text-green-800 text-sm font-medium">
                        {{ formatTime(schedule.start_time) }} - {{ formatTime(schedule.end_time) }}
                      </div>
                      <div v-else class="text-green-600 text-xs">
                        Hours not set
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- No Open Days Message -->
              <div v-if="getOpenDaysSchedule().length === 0" class="text-center py-8 text-gray-500">
                <svg class="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm">No operating days configured</p>
              </div>
              
              
            </div>
            
            <!-- Fallback for legacy data structure -->
            <div v-else class="space-y-6">
              <!-- Open Days Only -->
              <div v-if="product.openDays && product.openDays.length > 0">
                <h4 class="text-sm font-medium text-gray-700 mb-4">Operating Hours (Open Days Only)</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="day in product.openDays" :key="day" 
                       class="bg-green-50 border border-green-200 rounded-lg p-4 transition-all duration-200">
                    
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <!-- Day Status Indicator -->
                        <div class="w-3 h-3 rounded-full flex-shrink-0 bg-green-500"></div>
                        
                        <!-- Day Name -->
                        <span class="text-green-900 font-semibold text-sm">
                          {{ day }}
                        </span>
                      </div>
                      
                      <!-- Operating Hours -->
                      <div class="text-right">
                        <div v-if="product.openHours && product.openHours.start && product.openHours.end" 
                             class="text-green-800 text-sm font-medium">
                          {{ formatTime(product.openHours.start) }} - {{ formatTime(product.openHours.end) }}
                        </div>
                        <div v-else class="text-green-600 text-xs">
                          Hours not set
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Open Days Message -->
              <div v-else class="text-center py-8 text-gray-500">
                <svg class="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm">No operating days available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Facilities Section -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-black-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiCog" />
              </svg>
              Facilities & Amenities
            </h3>
            
            <!-- Default Facilities -->
            <div v-if="product.defaultFacilities && product.defaultFacilities.length > 0" class="mb-8">
              <h4 class="text-sm font-medium text-gray-700 mb-4">Included Facilities (Free)</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="facility in product.defaultFacilities" :key="facility" 
                     class="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCheckCircle" />
                  </svg>
                  <span class="text-green-800 font-medium">{{ facility }}</span>
                </div>
              </div>
            </div>

            <!-- Additional Facilities -->
            <div v-if="product.additionalFacilities && product.additionalFacilities.length > 0">
              <h4 class="text-sm font-medium text-gray-700 mb-4">Premium Add-ons (Paid)</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="facility in product.additionalFacilities" :key="facility.id" 
                     class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3 mb-2">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCurrencyUsd" />
                    </svg>
                    <span class="text-blue-800 font-medium">{{ facility.name || facility }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div v-if="facility.pricePerHour && facility.pricePerHour > 0" class="text-blue-900">
                      <span class="font-medium">${{ facility.pricePerHour }}</span> /hour
                    </div>
                    <div v-if="facility.pricePerDay && facility.pricePerDay > 0" class="text-blue-900">
                      <span class="font-medium">${{ facility.pricePerDay }}</span> /day
                    </div>
                    <div v-if="facility.pricePerMonth && facility.pricePerMonth > 0" class="text-blue-900">
                      <span class="font-medium">${{ facility.pricePerMonth }}</span> /month
                    </div>
                    <div v-if="facility.pricePerYear && facility.pricePerYear > 0" class="text-blue-900">
                      <span class="font-medium">${{ facility.pricePerYear }}</span> /year
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Facilities -->
            <div v-if="(!product.defaultFacilities || product.defaultFacilities.length === 0) && 
                      (!product.additionalFacilities || product.additionalFacilities.length === 0)"
                 class="text-center py-8 text-gray-500">
              <svg class="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p class="text-sm">No facilities information available</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" 
         @click="closeImageModal" @keydown.esc="closeImageModal">
      <div class="relative w-full h-full flex items-center justify-center p-4" @click.stop>
        
        <!-- Close Button -->
        <button @click="closeImageModal" 
                class="absolute top-4 right-4 text-white hover:text-gray-300 z-20 bg-black bg-opacity-50 rounded-full p-3 transition-all hover:bg-opacity-70">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Previous Button (if multiple images) -->
        <button v-if="product && product.images && product.images.length > 1" 
                @click="previousImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-20 bg-black bg-opacity-50 rounded-full p-3 transition-all hover:bg-opacity-70">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Next Button (if multiple images) -->
        <button v-if="product && product.images && product.images.length > 1" 
                @click="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-20 bg-black bg-opacity-50 rounded-full p-3 transition-all hover:bg-opacity-70">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Main Image Container -->
        <div class="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center">
          <img :src="selectedImage" :alt="`Product image ${selectedImageIndex + 1}`" 
               class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
               @load="onImageLoad"
               @error="onImageError">
          
          <!-- Loading Spinner -->
          <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>

        <!-- Image Counter and Info -->
        <div v-if="product && product.images && product.images.length > 1" 
             class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full z-20">
          <div class="flex items-center space-x-4">
            <span class="text-sm font-medium">
              {{ selectedImageIndex + 1 }} / {{ product.images.length }}
            </span>
            <div class="w-px h-4 bg-gray-400"></div>
            <span class="text-xs text-gray-300">
              {{ product.name }}
            </span>
          </div>
        </div>

        <!-- Instructions text -->
        <div class="absolute bottom-6 right-6 text-white text-sm opacity-70">
          <div class="bg-black bg-opacity-50 px-3 py-2 rounded-lg">
            <div class="flex items-center space-x-4">
              <span>ESC to close</span>
              <span v-if="product && product.images && product.images.length > 1">← → to navigate</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { productApi, type Product, type OperationSchedule } from '@/services/api'
import { 
  mdiPencil, 
  mdiAccountGroup, 
  mdiDeskLamp, 
  mdiChairRolling, 
  mdiPackageVariant,
  mdiCurrencyUsd,
  mdiClockOutline,
  mdiCog,
  mdiCheckCircle
} from '@mdi/js'

const route = useRoute()

// State
const product = ref<Product | null>(null)
const isLoading = ref(true)
const selectedImage = ref<string | null>(null)
const selectedImageIndex = ref(0)
const imageLoading = ref(false)
const error = ref('')

// Data
const productId = route.params.id as string
const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const loadProduct = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    console.log('Loading product with ID:', productId)
    
    // Validate product ID
    if (!productId) {
      error.value = 'Invalid product ID'
      return
    }
    
    // Use the new getProductById API method
    let response = await productApi.getProductById(productId)

    console.log('API Response:', response)

    // Fallback: some backends may return 404 or no data for inactive products.
    // Try fetching the admin product list and locate the product there so
    // that inactive products' details can still be viewed/edited.
    if (!response.success || !response.data) {
      console.warn('productApi.getProductById returned no data, attempting fallback to getAllProducts()', response.message)
      try {
        const allResp = await productApi.getAllProducts()
        if (allResp.success && Array.isArray(allResp.data)) {
          const found = allResp.data.find((p: Product) => 
            String(p.id) === String(productId) || String(p.id) === String(Number(productId))
          )
          if (found) {
            response = { success: true, data: found }
            console.log('Fallback: product found in getAllProducts():', found)
          }
        }
      } catch (err) {
        console.error('Fallback getAllProducts() failed:', err)
      }
    }

    if (response.success && response.data) {
      console.log('Product loaded successfully:', response.data)
      console.log('Product images:', response.data.images)
      console.log('Product pricing:', {
        hourly: response.data.pricePerHour,
        daily: response.data.pricePerDay,
        monthly: response.data.pricePerMonth,
        yearly: response.data.pricePerYear
      })
      console.log('Product facilities:', {
        default: response.data.defaultFacilities,
        additional: response.data.additionalFacilities
      })
      console.log('Product schedule:', response.data.openDays)
      console.log('Product operation_schedule:', response.data.operation_schedule)
      
      product.value = response.data as Product
    } else {
      error.value = response.message || 'Product not found'
      console.error('Failed to load product:', response.message)
    }
  } catch (err) {
    console.error('Error loading product:', err)
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Failed to load product details'
    }
  } finally {
    isLoading.value = false
  }
}

const openImageModal = (image: string, index: number) => {
  selectedImage.value = image
  selectedImageIndex.value = index
  imageLoading.value = true
  
  // Add keyboard event listener and prevent body scroll when modal opens
  document.addEventListener('keydown', handleKeydown)
  document.body.classList.add('modal-open')
}

const closeImageModal = () => {
  selectedImage.value = null
  selectedImageIndex.value = 0
  imageLoading.value = false
  
  // Remove keyboard event listener and restore body scroll when modal closes
  document.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('modal-open')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDMuMDEySDNDMS44OTUgMy4wMTIgMSAzLjkwNyAxIDUuMDEyVjE5LjAxMkMxIDIwLjExNyAxLjg5NSAyMS4wMTIgMyAyMS4wMTJIMjFDMjIuMTA1IDIxLjAxMiAyMyAyMC4xMTcgMjMgMTkuMDEyVjUuMDEyQzIzIDMuOTA3IDIyLjEwNSAzLjAxMiAyMSAzLjAxMlpNMjEgMTkuMDEySDNWNS4wMTJIMjFWMTkuMDEyWiIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNNy41IDEwLjUxMkM4LjMyOCAxMC41MTIgOSA5Ljg0IDkgOS4wMTJDOSA4LjE4NCA4LjMyOCA3LjUxMiA3LjUgNy41MTJDNS42NzIgNy41MTIgNiA4LjE4NCA2IDkuMDEyQzYgOS44NCA2LjY3MiAxMC41MTIgNy41IDEwLjUxMloiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTMgMTcuMDEySDIxTDE4IDE0LjAxMkwxNC41IDE2LjUxMkwxMSAxMy4wMTJMMyAxNy4wMTJaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo='
  img.className = 'w-full h-32 object-contain rounded-lg opacity-50'
  img.title = 'Image not available'
}

// Enhanced image modal methods
const nextImage = () => {
  if (!product.value?.images || product.value.images.length <= 1) return
  
  const nextIndex = (selectedImageIndex.value + 1) % product.value.images.length
  selectedImageIndex.value = nextIndex
  const nextImageUrl = product.value.images[nextIndex]
  if (nextImageUrl) {
    selectedImage.value = nextImageUrl
    imageLoading.value = true
  }
}

const previousImage = () => {
  if (!product.value?.images || product.value.images.length <= 1) return
  
  const prevIndex = selectedImageIndex.value === 0 
    ? product.value.images.length - 1 
    : selectedImageIndex.value - 1
  selectedImageIndex.value = prevIndex
  const prevImageUrl = product.value.images[prevIndex]
  if (prevImageUrl) {
    selectedImage.value = prevImageUrl
    imageLoading.value = true
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!selectedImage.value) return
  
  switch (event.key) {
    case 'Escape':
      closeImageModal()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousImage()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextImage()
      break
  }
}

const onImageLoad = () => {
  imageLoading.value = false
}

const onImageError = () => {
  imageLoading.value = false
}

// Methods for handling daily schedule

const getOpenDaysSchedule = (): OperationSchedule[] => {
  if (!product.value?.operation_schedule) {
    // Return only open days from the legacy openDays array
    return allDays
      .filter(day => product.value?.openDays?.includes(day))
      .map(day => ({
        day,
        start_time: product.value?.openHours?.start || '',
        end_time: product.value?.openHours?.end || '',
        is_enabled: true
      }))
  }
  
  // Return only enabled days from operation_schedule
  return product.value.operation_schedule.filter((schedule: OperationSchedule) => schedule.is_enabled)
}



// Initialize
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
/* Aspect ratio utilities for images */
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-w-16 > * {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.aspect-w-4 {
  position: relative;
  padding-bottom: 75%; /* 4:3 aspect ratio */
}

.aspect-w-4 > * {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

/* Fix image border radius within containers */
.aspect-w-4 img,
.aspect-w-16 img {
  border-radius: inherit;
}

/* Ensure smooth transitions */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Fix any potential border conflicts */
.border-gray-200 {
  border-color: #e5e7eb;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Enhanced modal styles */
.fixed.inset-0.bg-black.bg-opacity-90 {
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Image modal buttons */
.fixed button {
  transition: all 0.2s ease;
}

.fixed button:hover {
  transform: scale(1.05);
}

/* Prevent body scroll when modal is open */
body.modal-open {
  overflow: hidden;
}
</style>
