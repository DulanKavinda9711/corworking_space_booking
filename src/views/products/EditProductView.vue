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
            <h1 class="text-xl font-bold text-gray-900">Edit Product</h1>
            <p class="text-sm text-gray-500" v-if="originalProduct">{{ originalProduct.name }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Product Not Found -->
      <div v-else-if="!originalProduct" class="bg-white rounded-xl shadow-card p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Product Not Found</h3>
        <p class="text-gray-500 mb-6">The product you're trying to edit doesn't exist or has been removed.</p>
        <router-link to="/products" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </router-link>
      </div>

      <!-- Edit Form -->
      <div v-else class="max-w-6xl mx-auto">
        <form @submit.prevent="updateProduct" class="space-y-6">
          <!-- Single Card with All Sections -->
          <div class="bg-white rounded-xl shadow-card overflow-hidden">
            <div class="p-8 space-y-8">
              
              <!-- Location Selection -->
              <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiOfficeBuilding" />
                  </svg>
                  Location
                </h2>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Select Location <span class="text-red-500">*</span>
                  </label>
                  <select v-model="form.locationId" required
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                    <option value="">Choose a location</option>
                    <option v-for="location in locations" :key="location.id" :value="location.id">
                      {{ location.name }} - {{ location.address }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Product Details -->
              <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiPackageVariant" />
                  </svg>
                  Product Details
                </h2>
                
                <div class="space-y-6">
                  <!-- Product Type -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Product Type <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.type" required
                      @change="onProductTypeChange"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                      <option value="">Select product type</option>
                      <option value="Meeting Room">Meeting Room</option>
                      <option value="Hot Desk">Hot Desk</option>
                      <option value="Dedicated Desk">Dedicated Desk</option>
                    </select>
                  </div>

                  <!-- Images Upload -->
                  <div v-if="form.type">
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                      Product Images
                      <span class="text-xs text-gray-500 font-normal ml-1">(Optional - Add up to 8 images)</span>
                    </label>
                    <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-200 group">
                      <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                        <svg class="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div class="mt-4">
                        <label for="file-upload" class="cursor-pointer">
                          <span class="block text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">Click to upload images</span>
                          <span class="block text-sm text-gray-500 mt-1">or drag and drop files here</span>
                          <span class="block text-xs text-gray-400 mt-2">PNG, JPG, JPEG • Max 10MB each • Up to 8 images</span>
                        </label>
                        <input id="file-upload" name="file-upload" type="file" multiple accept="image/*,image/jpeg,image/png,image/gif" class="sr-only" @change="handleImageUpload" />
                      </div>
                    </div>
                    <div v-if="form.images.length > 0" class="mt-6">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-gray-700">
                          Uploaded Images ({{ form.images.length }}/8)
                        </span>
                        <button type="button" @click="form.images = []" class="text-sm text-red-600 hover:text-red-700 font-medium">
                          Clear All
                        </button>
                      </div>
                      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div v-for="(image, index) in form.images" :key="index" class="relative group">
                          <img :src="image" :alt="`Product image ${index + 1}`" 
                               class="w-full h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200">
                          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all duration-200 flex items-center justify-center">
                            <button type="button" @click="removeImage(index)" 
                                    class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Name and Description -->
                  <div v-if="form.type" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span class="text-red-500">*</span>
                      </label>
                      <input type="text" v-model="form.name" required
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                        placeholder="Enter product name" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Max Seating Capacity <span class="text-red-500">*</span>
                      </label>
                      <input type="number" v-model.number="form.maxSeatingCapacity" required min="1"
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                        placeholder="Enter capacity" />
                    </div>
                  </div>

                  <div v-if="form.type">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea v-model="form.description" rows="3"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter product description"></textarea>
                  </div>

                  <!-- Status -->
                  <div v-if="form.type">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select v-model="form.status"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Pricing Section - Dynamic based on product type -->
              <div v-if="form.type">
                <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCurrencyUsd" />
                  </svg>
                  Pricing
                </h2>
                
                <!-- Meeting Room Pricing -->
                <div v-if="form.type === 'Meeting Room'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Price per Hour <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input type="number" v-model.number="form.pricePerHour" required step="0.01" min="0"
                        class="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                        placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <!-- Hot Desk Pricing -->
                <div v-if="form.type === 'Hot Desk'" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Hour <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="form.pricePerHour" required step="0.01" min="0"
                          class="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                          placeholder="0.00" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Day <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="form.pricePerDay" required step="0.01" min="0"
                          class="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                          placeholder="0.00" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dedicated Desk Pricing -->
                <div v-if="form.type === 'Dedicated Desk'" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Month <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="form.pricePerMonth" required step="0.01" min="0"
                          class="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                          placeholder="0.00" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Year <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="form.pricePerYear" required step="0.01" min="0"
                          class="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                          placeholder="0.00" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Operating Hours -->
              <div v-if="form.type">
                <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiClockOutline" />
                  </svg>
                  Open Days & Hours
                </h2>
                
                <div class="space-y-6">
                  <!-- Open Days -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Open Days <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-3 md:grid-cols-7 gap-2">
                      <label v-for="day in daysOfWeek" :key="day" class="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" :value="day" v-model="form.openDays" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                        <span class="text-sm text-gray-700">{{ day.substring(0, 3) }}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Open Hours -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Opening Time <span class="text-red-500">*</span>
                      </label>
                      <input type="time" v-model="form.openHours.start" required
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Closing Time <span class="text-red-500">*</span>
                      </label>
                      <input type="time" v-model="form.openHours.end" required
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Facilities -->
              <div v-if="form.type">
                <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiCog" />
                  </svg>
                  Facilities
                </h2>
                
                <div class="space-y-6">
                  <!-- Default Included Facilities -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                      Default Included Facilities (Free)
                      <span class="text-xs text-gray-500 font-normal ml-1">- No additional cost</span>
                    </label>
                    <div class="flex items-center justify-start mb-4">
                      <button type="button" @click="showDefaultFacilityModal = true"
                        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Free Facilities
                      </button>
                    </div>
                    
                    <!-- Selected Default Facilities as Chips -->
                    <div v-if="form.defaultFacilities.length > 0" class="mb-4">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-sm text-gray-600">{{ form.defaultFacilities.length }} facilities selected</span>
                        <button type="button" @click="form.defaultFacilities = []" class="text-xs text-red-600 hover:text-red-700 font-medium">
                          Clear All
                        </button>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <div v-for="(facility, index) in form.defaultFacilities" :key="index"
                             class="inline-flex items-center bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200 px-3 py-2 rounded-lg text-sm font-medium hover:from-green-100 hover:to-green-150 transition-all duration-200 group">
                          <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{{ facility }}</span>
                          <button type="button" @click="removeDefaultFacility(index)"
                            class="ml-2 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full p-1 transition-all duration-200">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="form.defaultFacilities.length === 0" class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                      <div class="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p class="text-sm font-medium text-gray-700">No free facilities selected yet</p>
                      <p class="text-xs text-gray-500 mt-1">Click "Add Free Facilities" to include basic amenities</p>
                    </div>
                  </div>

                  <!-- Additional Facilities with Pricing -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                      Additional Facilities (Paid)
                      <span class="text-xs text-gray-500 font-normal ml-1">- Premium add-ons with pricing</span>
                    </label>
                    <div class="flex items-center justify-start mb-4">
                      <button type="button" @click="showAdditionalFacilityModal = true"
                        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Add Premium Facilities
                      </button>
                    </div>
                    
                    <!-- Selected Additional Facilities as Chips -->
                    <div v-if="form.additionalFacilities.length > 0" class="mb-4">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-sm text-gray-600">{{ form.additionalFacilities.length }} premium facilities selected</span>
                        <button type="button" @click="form.additionalFacilities = []" class="text-xs text-red-600 hover:text-red-700 font-medium">
                          Clear All
                        </button>
                      </div>
                      <div class="space-y-2">
                        <div v-for="(facility, index) in form.additionalFacilities" :key="index"
                             class="inline-flex items-center bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border border-blue-200 px-4 py-3 rounded-lg text-sm font-medium mr-2 mb-2 hover:from-blue-100 hover:to-blue-150 transition-all duration-200 group">
                          <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span class="font-semibold">{{ facility.name }}</span>
                          <span class="mx-2 text-blue-400">•</span>
                          <span class="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">${{ facility.pricePerHour }}/hr</span>
                          <button type="button" @click="removeAdditionalFacility(index)"
                            class="ml-3 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-all duration-200">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="form.additionalFacilities.length === 0" class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                      <div class="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <p class="text-sm font-medium text-gray-700">No premium facilities selected</p>
                      <p class="text-xs text-gray-500 mt-1">Click "Add Premium Facilities" to include paid amenities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between items-center pt-8 border-t border-gray-200">
            <router-link :to="`/products/${productId}`"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
              Cancel
            </router-link>
            
            <div class="flex space-x-4">
              <button type="submit" :disabled="!isFormValid || isSaving"
                class="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-500 disabled:hover:to-primary-600 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl">
                <svg v-if="isSaving" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ isSaving ? 'Updating...' : 'Update Product' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Default Facilities Selection Modal -->
    <div v-if="showDefaultFacilityModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Select Default Facilities</h3>
          <button @click="showDefaultFacilityModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="facility in availableFacilities" :key="facility.id" 
               class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input type="checkbox" :id="`default-${facility.id}`" 
                   :checked="form.defaultFacilities.includes(facility.name)"
                   @change="toggleDefaultFacility(facility.name)"
                   class="rounded border-gray-300 text-green-600 focus:ring-green-500">
            <label :for="`default-${facility.id}`" class="flex-1 cursor-pointer">
              <div class="font-medium text-gray-900">{{ facility.name }}</div>
              <div class="text-sm text-gray-500">{{ facility.description || 'Standard facility included at no extra cost' }}</div>
            </label>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="showDefaultFacilityModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Done
          </button>
        </div>
      </div>
    </div>

    <!-- Additional Facilities Selection Modal -->
    <div v-if="showAdditionalFacilityModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Select Additional Facilities</h3>
          <button @click="showAdditionalFacilityModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="facility in availableFacilities" :key="facility.id" 
               class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-start space-x-3">
              <input type="checkbox" :id="`additional-${facility.id}`" 
                     :checked="form.additionalFacilities.some(f => f.name === facility.name)"
                     @change="toggleAdditionalFacility(facility)"
                     class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1">
              <div class="flex-1">
                <label :for="`additional-${facility.id}`" class="cursor-pointer">
                  <div class="font-medium text-gray-900">{{ facility.name }}</div>
                  <div class="text-sm text-gray-500 mb-2">{{ facility.description || 'Additional paid facility' }}</div>
                </label>
                
                <!-- Price input for selected facilities -->
                <div v-if="form.additionalFacilities.some(f => f.name === facility.name)" class="mt-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Price per Hour</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input type="number" 
                           :value="getAdditionalFacilityPrice(facility.name)"
                           @input="updateAdditionalFacilityPrice(facility.name, $event)"
                           step="0.01" min="0"
                           class="w-32 border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                           placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="showAdditionalFacilityModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Done
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  mdiOfficeBuilding, 
  mdiPackageVariant, 
  mdiCurrencyUsd, 
  mdiClockOutline, 
  mdiCog 
} from '@mdi/js'

const route = useRoute()
const router = useRouter()

// Data
const productId = route.params.id as string
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// State
const isLoading = ref(true)
const isSaving = ref(false)
const originalProduct = ref<any>(null)
const showDefaultFacilityModal = ref(false)
const showAdditionalFacilityModal = ref(false)

// Sample locations data
// Available locations - REMOVED: Mock data has been removed
const locations = ref<any[]>([])

// Available facilities
const availableFacilities = ref([
  { id: 'FC-001', name: 'High-Speed WiFi', description: 'Reliable high-speed internet connection' },
  { id: 'FC-002', name: 'Projector & Screen', description: 'HD projector with large screen for presentations' },
  { id: 'FC-003', name: 'Whiteboard', description: 'Large whiteboard for brainstorming sessions' },
  { id: 'FC-004', name: 'Video Conferencing Setup', description: 'Professional camera and audio system' },
  { id: 'FC-005', name: 'Coffee & Refreshments', description: 'Complimentary coffee and light refreshments' },
  { id: 'FC-006', name: 'Printing Services', description: 'Access to printer and scanner facilities' },
  { id: 'FC-007', name: 'Climate Control', description: 'Individual temperature control system' },
  { id: 'FC-008', name: 'Parking Space', description: 'Dedicated parking spot included' }
])

// Form data
const form = ref({
  locationId: '',
  type: '',
  images: [] as string[],
  name: '',
  description: '',
  maxSeatingCapacity: 1,
  pricePerHour: 0,
  pricePerDay: 0,
  pricePerMonth: 0,
  pricePerYear: 0,
  openDays: [] as string[],
  openHours: {
    start: '09:00',
    end: '17:00'
  },
  defaultFacilities: [] as string[],
  additionalFacilities: [] as Array<{
    name: string
    pricePerHour: number
  }>,
  status: 'active' as 'active' | 'inactive'
})

// Sample products data
const sampleProducts = [
  {
    id: 'PROD001',
    name: 'Executive Meeting Room',
    type: 'Meeting Room',
    locationName: 'Downtown Office',
    locationAddress: '123 Business St',
    locationId: 'LOC001',
    status: 'active',
    maxSeatingCapacity: 12,
    pricePerHour: 50,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=500'
    ],
    description: 'Spacious executive meeting room with state-of-the-art video conferencing facilities',
    openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    openHours: { start: '08:00', end: '18:00' },
    defaultFacilities: ['High-Speed WiFi', 'HD Projector & Screen', 'Whiteboard'],
    additionalFacilities: [
      { name: 'Coffee Machine', pricePerHour: 5 },
      { name: 'Catering Service', pricePerHour: 15 }
    ]
  },
  {
    id: 'PROD002',
    name: 'Modern Hot Desk',
    type: 'Hot Desk',
    locationName: 'Tech Hub',
    locationAddress: '456 Innovation Ave',
    locationId: 'LOC002',
    status: 'active',
    maxSeatingCapacity: 1,
    pricePerHour: 8,
    pricePerDay: 60,
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500'],
    description: 'Modern hot desk in a vibrant coworking environment',
    openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    openHours: { start: '07:00', end: '19:00' },
    defaultFacilities: ['High-Speed WiFi', 'Power Outlets', 'Ergonomic Chair'],
    additionalFacilities: [
      { name: 'External Monitor', pricePerHour: 3 },
      { name: 'Keyboard & Mouse', pricePerHour: 2 }
    ]
  },
  {
    id: 'PROD003',
    name: 'Private Dedicated Workspace',
    type: 'Dedicated Desk',
    locationName: 'Business Center',
    locationAddress: '789 Corporate Blvd',
    locationId: 'LOC003',
    status: 'active',
    maxSeatingCapacity: 1,
    pricePerMonth: 800,
    pricePerYear: 8500,
    images: [],
    description: 'Private dedicated workspace with personal storage',
    openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    openHours: { start: '06:00', end: '22:00' },
    defaultFacilities: ['High-Speed WiFi', 'Storage Locker', 'Ergonomic Chair', 'Desk Lamp'],
    additionalFacilities: [
      { name: 'Printer Access', pricePerHour: 1 },
      { name: 'Phone Line', pricePerHour: 2 }
    ]
  }
]

// Computed properties
const isFormValid = computed(() => {
  const basicValidation = form.value.locationId && 
                         form.value.type && 
                         form.value.name.trim() && 
                         form.value.maxSeatingCapacity > 0 &&
                         form.value.openDays.length > 0

  if (!basicValidation) return false

  // Type-specific pricing validation
  switch (form.value.type) {
    case 'Meeting Room':
      return form.value.pricePerHour > 0
    case 'Hot Desk':
      return form.value.pricePerHour > 0 && form.value.pricePerDay > 0
    case 'Dedicated Desk':
      return form.value.pricePerMonth > 0 && form.value.pricePerYear > 0
    default:
      return false
  }
})

// Methods
const loadProduct = () => {
  isLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    originalProduct.value = sampleProducts.find(p => p.id === productId) || null
    
    if (originalProduct.value) {
      // Populate form with existing data
      Object.assign(form.value, {
        locationId: originalProduct.value.locationId,
        type: originalProduct.value.type,
        images: [...(originalProduct.value.images || [])],
        name: originalProduct.value.name,
        description: originalProduct.value.description || '',
        maxSeatingCapacity: originalProduct.value.maxSeatingCapacity,
        pricePerHour: originalProduct.value.pricePerHour || 0,
        pricePerDay: originalProduct.value.pricePerDay || 0,
        pricePerMonth: originalProduct.value.pricePerMonth || 0,
        pricePerYear: originalProduct.value.pricePerYear || 0,
        openDays: [...originalProduct.value.openDays],
        openHours: { ...originalProduct.value.openHours },
        defaultFacilities: [...(originalProduct.value.defaultFacilities || [])],
        additionalFacilities: [...(originalProduct.value.additionalFacilities || [])],
        status: originalProduct.value.status
      })
    }
    
    isLoading.value = false
  }, 500)
}

const onProductTypeChange = () => {
  // Reset pricing fields when product type changes
  form.value.pricePerHour = originalProduct.value?.pricePerHour || 0
  form.value.pricePerDay = originalProduct.value?.pricePerDay || 0
  form.value.pricePerMonth = originalProduct.value?.pricePerMonth || 0
  form.value.pricePerYear = originalProduct.value?.pricePerYear || 0
}

const handleImageUpload = (event: any) => {
  const files = event.target.files
  if (files) {
    for (let i = 0; i < files.length && form.value.images.length < 8; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          form.value.images.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }
}

const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

// Default facility methods
const toggleDefaultFacility = (facilityName: string) => {
  const index = form.value.defaultFacilities.indexOf(facilityName)
  if (index > -1) {
    form.value.defaultFacilities.splice(index, 1)
  } else {
    form.value.defaultFacilities.push(facilityName)
  }
}

const removeDefaultFacility = (index: number) => {
  form.value.defaultFacilities.splice(index, 1)
}

// Additional facility methods
const toggleAdditionalFacility = (facility: any) => {
  const existingIndex = form.value.additionalFacilities.findIndex(f => f.name === facility.name)
  if (existingIndex > -1) {
    form.value.additionalFacilities.splice(existingIndex, 1)
  } else {
    form.value.additionalFacilities.push({
      name: facility.name,
      pricePerHour: 0
    })
  }
}

const removeAdditionalFacility = (index: number) => {
  form.value.additionalFacilities.splice(index, 1)
}

const getAdditionalFacilityPrice = (facilityName: string) => {
  const facility = form.value.additionalFacilities.find(f => f.name === facilityName)
  return facility ? facility.pricePerHour : 0
}

const updateAdditionalFacilityPrice = (facilityName: string, event: any) => {
  const facility = form.value.additionalFacilities.find(f => f.name === facilityName)
  if (facility) {
    facility.pricePerHour = parseFloat(event.target.value) || 0
  }
}

const updateProduct = async () => {
  if (!isFormValid.value) {
    alert('Please fill in all required fields')
    return
  }

  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In real app, make API call to update product
    console.log('Updating product:', form.value)
    
    // Show success message
    alert('Product updated successfully!')
    
    // Navigate to product detail view
    router.push(`/products/${productId}`)
  } catch (error) {
    console.error('Error updating product:', error)
    alert('Failed to update product. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Initialize
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Modal backdrop blur effect */
.fixed.inset-0 {
  backdrop-filter: blur(4px);
}

/* Enhanced chip animations */
.inline-flex {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.inline-flex:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Button hover effects */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Form input focus improvements */
input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

/* Enhanced border radius for modern look */
.rounded-xl {
  border-radius: 0.75rem;
}

/* Improved shadow effects */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
