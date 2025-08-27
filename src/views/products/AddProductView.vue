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
            <h1 class="text-xl font-bold text-gray-900">Add New Product</h1>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <div v-for="(product, idx) in products" :key="idx" class="mb-8">
          <form @submit.prevent="saveProduct(idx)" class="space-y-6">
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
                    <select v-model="product.locationId"
                      :class="[
                        'w-full border rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                        showValidation[idx] && !product.locationId ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                      ]"
                    >
                      <option value="">Choose a location</option>
                      <option v-for="location in locations" :key="location.id" :value="location.id">
                        {{ location.name }} - {{ location.address }}
                      </option>
                    </select>
                    <div v-if="showValidation[idx] && !product.locationId" class="mt-1 text-sm text-red-600">
                      Location is required
                    </div>
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
                      <select v-model="product.type"
                        @change="onProductTypeChange"
                        :class="[
                          'w-full border rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                          showValidation[idx] && !product.type ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                        ]"
                      >
                        <option value="">Select product type</option>
                        <option value="Meeting Room">Meeting Room</option>
                        <option value="Hot Desk">Hot Desk</option>
                        <option value="Dedicated Desk">Dedicated Desk</option>
                      </select>
                      <div v-if="showValidation[idx] && !product.type" class="mt-1 text-sm text-red-600">
                        Product type is required
                      </div>
                    </div>

                    <!-- Images Upload -->
                    <div v-if="product.type">
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
                      <div v-if="product.images.length > 0" class="mt-6">
                        <div class="flex items-center justify-between mb-3">
                          <span class="text-sm font-medium text-gray-700">
                            Uploaded Images ({{ product.images.length }}/8)
                          </span>
                          <button type="button" @click="product.images = []" class="text-sm text-red-600 hover:text-red-700 font-medium">
                            Clear All
                          </button>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          <div v-for="(image, index) in product.images" :key="index" class="relative group">
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
                            <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Image {{ index + 1 }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Name and Description -->
                    <div v-if="product.type" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Product Name <span class="text-red-500">*</span>
                        </label>
                        <input type="text" v-model="product.name"
                          :class="[
                            'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                            showValidation[idx] && !product.name.trim() ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                          ]"
                          placeholder="Enter product name" />
                        <div v-if="showValidation[idx] && !product.name.trim()" class="mt-1 text-sm text-red-600">
                          Product name is required
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Max Seating Capacity <span class="text-red-500">*</span>
                        </label>
                        <input type="number" v-model.number="product.maxSeatingCapacity" min="1"
                          :class="[
                            'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                            showValidation[idx] && (!product.maxSeatingCapacity || product.maxSeatingCapacity < 1) ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                          ]"
                          placeholder="Enter capacity" />
                        <div v-if="showValidation[idx] && (!product.maxSeatingCapacity || product.maxSeatingCapacity < 1)" class="mt-1 text-sm text-red-600">
                          Max seating capacity is required
                        </div>
                      </div>
                    </div>
                      <div v-if="product.type">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Description <span class="text-red-500">*</span>
                        </label>
                        <textarea v-model="product.description" rows="3"
                          :class="[
                            'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                            showValidation[idx] && !product.description.trim() ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                          ]"
                          placeholder="Enter product description"></textarea>
                        <div v-if="showValidation[idx] && !product.description.trim()" class="mt-1 text-sm text-red-600">
                          Description is required
                        </div>
                      </div>

                  </div>
                </div>

                <!-- Pricing Section - Dynamic based on product type -->
                <div v-if="product.type">
                  <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCurrencyUsd" />
                    </svg>
                    Pricing
                  </h2>
                  
                  <!-- Meeting Room Pricing -->
                  <div v-if="product.type === 'Meeting Room'" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Hour <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-6 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="product.pricePerHour" step="0.01" min="0"
                          :class="[
                            'w-full rounded-lg pl-8 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                            showValidation[idx] && product.type === 'Meeting Room' && product.pricePerHour <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                          ]"
                          placeholder="0.00" />
                        <div v-if="showValidation[idx] && product.type === 'Meeting Room' && product.pricePerHour <= 0" class="mt-1 text-sm text-red-600">
                          Price per hour is required
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Hot Desk Pricing -->
                  <div v-if="product.type === 'Hot Desk'" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Pricing Type <span class="text-red-500">*</span>
                      </label>
                      <select v-model="hotDeskPricingType"
                        class="w-full border rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors border-gray-300">
                        <option value="hour">Per Hour</option>
                        <option value="day">Per Day</option>
                      </select>
                    </div>
                    <div v-if="hotDeskPricingType === 'hour'">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Hour <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="product.pricePerHour" step="0.01" min="0"
                          :class="['w-full border rounded-lg pl-8 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors', showValidation[idx] && product.pricePerHour <= 0 ? 'border-red-500 ring-red-500 focus:ring-red-500 border-2' : 'border-gray-300']"
                          placeholder="0.00" />
                        <div v-if="showValidation[idx] && product.pricePerHour <= 0" class="mt-1 text-sm text-red-600">
                          Price per hour is required
                        </div>
                      </div>
                    </div>
                    <div v-if="hotDeskPricingType === 'day'">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Day <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="product.pricePerDay" step="0.01" min="0"
                          :class="['w-full border rounded-lg pl-8 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors', showValidation[idx] && product.pricePerDay <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300']"
                          placeholder="0.00" />
                        <div v-if="showValidation[idx] && product.pricePerDay <= 0" class="mt-1 text-sm text-red-600">
                          Price per day is required
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Dedicated Desk Pricing -->
                  <div v-if="product.type === 'Dedicated Desk'" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Pricing Type <span class="text-red-500">*</span>
                      </label>
                      <select v-model="dedicatedDeskPricingType"
                        class="w-full border rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors border-gray-300">
                        <option value="month">Per Month</option>
                        <option value="year">Per Year</option>
                      </select>
                    </div>
                    <div v-if="dedicatedDeskPricingType === 'month'">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Month <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="product.pricePerMonth" step="0.01" min="0"
                          :class="['w-full border rounded-lg pl-8 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors', showValidation[idx] && product.pricePerMonth <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300']"
                          placeholder="0.00" />
                        <div v-if="showValidation[idx] && product.pricePerMonth <= 0" class="mt-1 text-sm text-red-600">
                          Price per month is required
                        </div>
                      </div>
                    </div>
                    <div v-if="dedicatedDeskPricingType === 'year'">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Year <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="product.pricePerYear" step="0.01" min="0"
                          :class="['w-full border rounded-lg pl-8 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors', showValidation[idx] && product.pricePerYear <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300']"
                          placeholder="0.00" />
                        <div v-if="showValidation[idx] && product.pricePerYear <= 0" class="mt-1 text-sm text-red-600">
                          Price per year is required
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Operating Hours -->
                <div v-if="product.type">
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
                      <div
                        :class="[
                          'grid grid-cols-3 md:grid-cols-7 gap-2',
                          showValidation[idx] && product.openDays.length === 0 ? 'border-2 border-red-500 rounded-lg p-2' : ''
                        ]"
                      >
                        <label v-for="day in daysOfWeek" :key="day" class="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" :value="day" v-model="product.openDays" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                          <span class="text-sm text-gray-700">{{ day.substring(0, 3) }}</span>
                        </label>
                      </div>
                      <div v-if="showValidation[idx] && product.openDays.length === 0" class="mt-1 text-sm text-red-600">
                        At least one open day is required
                      </div>
                    </div>

                    <!-- Open Hours -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Opening Time <span class="text-red-500">*</span>
                        </label>
                        <input type="time" v-model="product.openHours.start"
                          :class="[
                            'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                            showValidation[idx] && !product.openHours.start ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                          ]"
                          placeholder="Start time" />
                        <div v-if="showValidation[idx] && !product.openHours.start" class="mt-1 text-sm text-red-600">
                          Start time is required
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Closing Time <span class="text-red-500">*</span>
                        </label>
                        <input type="time" v-model="product.openHours.end"
                          :class="[
                            'w-full rounded-lg px-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                            showValidation[idx] && !product.openHours.end ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                          ]"
                          placeholder="End time" />
                        <div v-if="showValidation[idx] && !product.openHours.end" class="mt-1 text-sm text-red-600">
                          End time is required
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Facilities -->
                <div v-if="product.type">
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
                      <div v-if="product.defaultFacilities.length > 0" class="mb-4">
                        <div class="flex items-center justify-between mb-3">
                          <span class="text-sm text-gray-600">{{ product.defaultFacilities.length }} facilities selected</span>
                          <button type="button" @click="product.defaultFacilities = []" class="text-xs text-red-600 hover:text-red-700 font-medium">
                            Clear All
                          </button>
                        </div>
                        <div class="flex flex-wrap gap-2">
                          <div v-for="(facility, index) in product.defaultFacilities" :key="index"
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
                      
                      <div v-if="product.defaultFacilities.length === 0" class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
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
                      <div v-if="product.additionalFacilities.length > 0" class="mb-4">
                        <div class="flex items-center justify-between mb-3">
                          <span class="text-sm text-gray-600">{{ product.additionalFacilities.length }} premium facilities selected</span>
                          <button type="button" @click="product.additionalFacilities = []" class="text-xs text-red-600 hover:text-red-700 font-medium">
                            Clear All
                          </button>
                        </div>
                        <div class="space-y-2">
                          <div v-for="(facility, index) in product.additionalFacilities" :key="index"
                               class="inline-flex items-center bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border border-blue-200 px-4 py-3 rounded-lg text-sm font-medium mr-2 mb-2 hover:from-blue-100 hover:to-blue-150 transition-all duration-200 group">
                            <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span class="font-semibold">{{ facility.name }}</span>
                            <span class="mx-2 text-blue-400">•</span>
                            <span class="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">${{ facility.pricePerHour }}/hr</span>
                            
                            <!-- Price input for selected facilities -->
                            <div class="ml-6">
                              <label class="block text-xs font-medium text-gray-700 mb-1">Price per Hour</label>
                              <div class="relative">
                                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input type="number"
                                       v-model.number="facility.pricePerHour"
                                       step="0.01" min="0"
                                       class="w-24 border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                       placeholder="0.00" />
                              </div>
                            </div>
                            <button type="button" @click="removeAdditionalFacility(index)"
                              class="ml-3 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-all duration-200">
                              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="product.additionalFacilities.length === 0" class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
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

            <!-- Action Buttons for each form -->
            <div class="flex items-center justify-between pt-8 border-t border-gray-200">
              <!-- Left side: Add Another Product (show only on the last form) -->
              <div>
                <button v-if="idx === products.length - 1" type="button" @click="addAnotherProduct"
                  class="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 hover:border-primary-700 transition-all duration-200 flex items-center space-x-3 font-medium shadow-sm hover:shadow-md">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Another Product</span>
                </button>
              </div>
              <!-- Right side: Create Product (only on last form) and Cancel -->
              <div class="flex items-center gap-4">
                <button v-if="idx === products.length - 1" type="submit"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create Product</span>
                </button>
                <div class="flex items-center">
                  <button type="button" @click="cancelProduct(idx)"
                    class="px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-700 transition-all duration-200 flex items-center space-x-3 font-medium shadow-sm hover:shadow-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
  <!-- Removed standalone Add Another Product button, now inline with Create Product -->
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
                   :checked="products[0].defaultFacilities.includes(facility.name)"
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
                     :checked="products[0].additionalFacilities.some(f => f.name === facility.name)"
                     @change="toggleAdditionalFacility(facility)"
                     class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1">
              <div class="flex-1">
                <label :for="`additional-${facility.id}`" class="cursor-pointer">
                  <div class="font-medium text-gray-900">{{ facility.name }}</div>
                  <div class="text-sm text-gray-500 mb-2">{{ facility.description || 'Additional paid facility' }}</div>
                </label>
                
                <!-- Price input for selected facilities -->
                <div v-if="products[0].additionalFacilities.some(f => f.name === facility.name)" class="mt-2">
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
// Dedicated Desk pricing type selection
const dedicatedDeskPricingType = ref('month')
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  mdiOfficeBuilding, 
  mdiPackageVariant, 
  mdiCurrencyUsd, 
  mdiClockOutline, 
  mdiCog 
} from '@mdi/js'

const router = useRouter()

// Days of the week
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Sample locations data
const locations = ref([
  { id: 'LOC001', name: 'Downtown Office', address: '123 Business St' },
  { id: 'LOC002', name: 'Tech Hub', address: '456 Innovation Ave' },
  { id: 'LOC003', name: 'Business Center', address: '789 Corporate Blvd' },
  { id: 'LOC004', name: 'Innovation Park', address: '321 Future Dr' },
  { id: 'LOC005', name: 'Startup Hub', address: '654 Enterprise St' },
  { id: 'LOC006', name: 'Creative Space', address: '987 Design Ave' }
])

// Available facilities from FacilitiesView
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

// Modal states
const showDefaultFacilityModal = ref(false)
const showAdditionalFacilityModal = ref(false)

// Form data
const products = ref([
  {
    locationId: '',
    type: '',
    images: [] as string[],
    name: '',
    description: '',
    maxSeatingCapacity: 1,
    pricePerHour: 0,
    pricePerDay: 0,
    pricePerWeek: 0,
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
    status: 'active'
  }
])

// Hot Desk pricing type selection
const hotDeskPricingType = ref('hour')

// Per-form validation state
const showValidation = ref([false])

// Computed properties
const isFormValid = computed(() => {
  const basicValidation = products.value.every(product => 
    product.locationId && 
    product.type && 
    product.name.trim() && 
    product.maxSeatingCapacity > 0 &&
    product.openHours.start &&
    product.openHours.end &&
    product.openDays.length > 0
  )

  if (!basicValidation) return false

  // Type-specific pricing validation
  return products.value.every(product => {
    switch (product.type) {
      case 'Meeting Room':
        return product.pricePerHour > 0
      case 'Hot Desk':
        return product.pricePerHour > 0 && product.pricePerDay > 0
      case 'Dedicated Desk':
        return product.pricePerMonth > 0 && product.pricePerYear > 0
      default:
        return false
    }
  })
})

// Watchers - Remove company watcher since we removed company selection
// Methods
const onCompanyChange = () => {
  // Remove this method since we no longer have company selection
}

const onProductTypeChange = () => {
  // Reset pricing fields when product type changes
  products.value.forEach(product => {
    product.pricePerHour = 0
    product.pricePerDay = 0
    product.pricePerWeek = 0
    product.pricePerMonth = 0
    product.pricePerYear = 0
  })
  if (products.value[0].type === 'Hot Desk') {
    hotDeskPricingType.value = 'hour'
  }
  if (products.value[0].type === 'Dedicated Desk') {
    dedicatedDeskPricingType.value = 'month'
  }
}

const handleImageUpload = (event: any) => {
  const files = event.target.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          products.value[0].images.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }
}

const removeImage = (index: number) => {
  products.value[0].images.splice(index, 1)
}

// Default facility methods
const toggleDefaultFacility = (facilityName: string) => {
  const index = products.value[0].defaultFacilities.indexOf(facilityName)
  if (index > -1) {
    products.value[0].defaultFacilities.splice(index, 1)
  } else {
    products.value[0].defaultFacilities.push(facilityName)
  }
}

const removeDefaultFacility = (index: number) => {
  products.value[0].defaultFacilities.splice(index, 1)
}

// Additional facility methods
const toggleAdditionalFacility = (facility: any) => {
  const existingIndex = products.value[0].additionalFacilities.findIndex(f => f.name === facility.name)
  if (existingIndex > -1) {
    products.value[0].additionalFacilities.splice(existingIndex, 1)
  } else {
    products.value[0].additionalFacilities.push({
      name: facility.name,
      pricePerHour: 0
    })
  }
}

const removeAdditionalFacility = (index: number) => {
  products.value[0].additionalFacilities.splice(index, 1)
}

const getAdditionalFacilityPrice = (facilityName: string) => {
  const facility = products.value[0].additionalFacilities.find(f => f.name === facilityName)
  return facility ? facility.pricePerHour : 0
}

const updateAdditionalFacilityPrice = (facilityName: string, event: any) => {
  const facility = products.value[0].additionalFacilities.find(f => f.name === facilityName)
  if (facility) {
    facility.pricePerHour = parseFloat(event.target.value) || 0
  }
}

const resetForm = () => {
  products.value = [{
    locationId: '',
    type: '',
    images: [] as string[],
    name: '',
    description: '',
    maxSeatingCapacity: 1,
    pricePerHour: 0,
    pricePerDay: 0,
    pricePerWeek: 0,
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
    status: 'active'
  }]
  hotDeskPricingType.value = 'hour'
  dedicatedDeskPricingType.value = 'month'
  // reset per-form validation state
  showValidation.value = [false]
}

const addAnotherProduct = () => {
  products.value.push({
    locationId: '',
    type: '',
    images: [] as string[],
    name: '',
    description: '',
    maxSeatingCapacity: 1,
    pricePerHour: 0,
    pricePerDay: 0,
    pricePerWeek: 0,
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
    status: 'active'
  })
  showValidation.value.push(false)
}

const removeProductForm = (index: number) => {
  if (products.value.length > 1) {
    products.value.splice(index, 1)
    showValidation.value.splice(index, 1)
  }
}

const cancelProduct = (index: number) => {
  // If multiple forms exist, remove the selected one. Otherwise reset the single form.
  if (products.value.length > 1) {
    removeProductForm(index)
  } else {
    // Reset the first form to initial blank values
    products.value[0] = {
      locationId: '',
      type: '',
      images: [] as string[],
      name: '',
      description: '',
      maxSeatingCapacity: 1,
      pricePerHour: 0,
      pricePerDay: 0,
      pricePerWeek: 0,
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
      }> ,
      status: 'active'
    }
    showValidation.value = [false]
    hotDeskPricingType.value = 'hour'
    dedicatedDeskPricingType.value = 'month'
  }
}

// validate a single product object and return boolean
const validateProduct = (product: any) => {
  const basicValidation = !!(product.locationId && product.type && product.name && product.name.trim() && product.maxSeatingCapacity > 0 && product.openHours?.start && product.openHours?.end && product.openDays && product.openDays.length > 0)

  if (!basicValidation) return false

  switch (product.type) {
    case 'Meeting Room':
      return product.pricePerHour > 0
    case 'Hot Desk':
      return product.pricePerHour > 0 && product.pricePerDay > 0
    case 'Dedicated Desk':
      return product.pricePerMonth > 0 && product.pricePerYear > 0
    default:
      return false
  }
}

const saveProduct = (idx: number) => {
  const lastIndex = products.value.length - 1

  // If creating from the last form and multiple forms exist, validate all forms
  if (idx === lastIndex && products.value.length > 1) {
    // ensure validation flags exist for all forms
    for (let i = 0; i < products.value.length; i++) {
      showValidation.value[i] = true
    }

    const allValid = products.value.every(p => validateProduct(p))
    if (!allValid) {
      // show red borders via showValidation and stop
      return
    }

    // All forms valid - create all products (replace with API call)
    console.log('Creating products:', products.value)
    alert('Products created successfully!')
    // reset form list
    resetForm()
    return
  }

  // Otherwise validate single form
  const product = products.value[idx]
  showValidation.value[idx] = true
  const valid = validateProduct(product)
  if (!valid) return

  // Create single product
  console.log('Creating product:', product)
  alert('Product created successfully!')
  // remove or reset the form after creation - here we reset single form to blank
  if (products.value.length === 1) {
    resetForm()
  } else {
    removeProductForm(idx)
  }
}
// ...existing code...
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Hide main horizontal scrollbar and prevent horizontal overflow */
.max-w-6xl {
  overflow-x: hidden;
}
html, body {
  overflow-x: hidden;
}
html::-webkit-scrollbar, body::-webkit-scrollbar {
  display: none;
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

/* Image upload area improvements */
.group:hover .group-hover\:bg-primary-100 {
  background-color: rgb(219 234 254);
}

.group:hover .group-hover\:text-primary-600 {
  color: rgb(37 99 235);
}

.group:hover .group-hover\:text-primary-500 {
  color: rgb(59 130 246);
}

/* Form input focus improvements */
input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

/* Gradient backgrounds for better visual appeal */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Smooth scrolling for form navigation */
html {
  scroll-behavior: smooth;
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

/* Loading state animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom scrollbar for modals */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Improved focus states */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}

.focus\:ring-offset-2:focus {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--tw-ring-color);
}
</style>
