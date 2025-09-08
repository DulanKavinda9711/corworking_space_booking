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
        <router-link to="/products" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-primary-700">
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
                  
                  <!-- Loading state for locations -->
                  <div v-if="isLoadingLocations" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-500">
                    <svg class="animate-spin w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading locations...
                  </div>
                  
                  <!-- Error state for locations -->
                  <div v-else-if="locationError" class="w-full border border-red-300 rounded-lg px-4 py-3 text-red-600 bg-red-50">
                    {{ locationError }}
                    <button @click="fetchLocations" class="ml-2 text-red-700 underline hover:no-underline">
                      Retry
                    </button>
                  </div>
                  
                  <!-- Location dropdown -->
                  <div v-else class="relative">
                    <select 
                      v-model="form.locationId"
                      @focus="toggleDropdown('location')"
                      @blur="closeDropdown('location')"
                      :class="[
                        'w-full border rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors appearance-none cursor-pointer',
                        showValidation && !form.locationId ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                      ]"
                    >
                      <option value="">Choose a location</option>
                      <option v-for="location in allLocations" :key="location.id" :value="location.id">
                        {{ location.name }}
                      </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg 
                        :class="[
                          'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                          dropdownStates.location ? 'transform rotate-180' : ''
                        ]"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div v-if="showValidation && !form.locationId" class="mt-1 text-sm text-red-600">
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
                    <div class="relative">
                      <select 
                        v-model="form.type"
                        @change="onProductTypeChange"
                        @focus="toggleDropdown('productType')"
                        @blur="closeDropdown('productType')"
                        :class="[
                          'w-full border rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors appearance-none cursor-pointer',
                          showValidation && !form.type ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                        ]"
                      >
                        <option value="">Select product type</option>
                        <option value="Meeting Room">Meeting Room</option>
                        <option value="Hot Desk">Hot Desk</option>
                        <option value="Dedicated Desk">Dedicated Desk</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg 
                          :class="[
                            'w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out',
                            dropdownStates.productType ? 'transform rotate-180' : ''
                          ]"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div v-if="showValidation && !form.type" class="mt-1 text-sm text-red-600">
                      Product type is required
                    </div>
                  </div>

                  <!-- Images Upload -->
                  <div v-if="form.type">
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                      Product Images
                      <span class="text-xs text-gray-500 font-normal ml-1">(Optional - Add up to 8 images)</span>
                    </label>
                    <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50/30 transition-all duration-200 group">
                      <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                        <svg class="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div class="mt-4">
                        <label for="file-upload" class="cursor-pointer">
                          <span class="block text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Click to upload images</span>
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
                          <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Image {{ index + 1 }}
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
                      <input type="text" v-model="form.name"
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors',
                          showValidation && !form.name.trim() ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                        ]"
                        placeholder="Enter product name" />
                      <div v-if="showValidation && !form.name.trim()" class="mt-1 text-sm text-red-600">
                        Product name is required
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Max Seating Capacity <span class="text-red-500">*</span>
                      </label>
                      <input type="number" v-model.number="form.maxSeatingCapacity" min="1"
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors',
                          showValidation && (!form.maxSeatingCapacity || form.maxSeatingCapacity < 1) ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                        ]"
                        placeholder="Enter capacity" />
                      <div v-if="showValidation && (!form.maxSeatingCapacity || form.maxSeatingCapacity < 1)" class="mt-1 text-sm text-red-600">
                        Max seating capacity is required
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="form.type">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Description <span class="text-red-500">*</span>
                    </label>
                    <textarea v-model="form.description" rows="3"
                      :class="[
                        'w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors',
                        showValidation && !form.description.trim() ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                      ]"
                      placeholder="Enter product description"></textarea>
                    <div v-if="showValidation && !form.description.trim()" class="mt-1 text-sm text-red-600">
                      Description is required
                    </div>
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
                
                <!-- Meeting Room Pricing - Hourly only -->
                <div v-if="form.type === 'Meeting Room'" class="space-y-4">
                  <div class="rounded-lg p-4">
                    <h3 class="text-md font-semibold text-gray-800 mb-4">Hourly Booking</h3>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Price per Hour <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" v-model.number="form.pricePerHour" step="0.01" min="0"
                          :class="[
                            'w-full rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors',
                            showValidation && form.pricePerHour <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                          ]"
                          placeholder="0.00" />
                        <div v-if="showValidation && form.pricePerHour <= 0" class="mt-1 text-sm text-red-600">
                          Price per hour is required
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Hot Desk Pricing - Hourly and Daily -->
                <div v-if="form.type === 'Hot Desk'" class="space-y-4">
                  <div class="bg-green-50 rounded-lg p-4">
                    <h3 class="text-md font-semibold text-gray-800 mb-4">Flexible Booking Options</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Price per Hour <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input type="number" v-model.number="form.pricePerHour" step="0.01" min="0"
                            :class="[
                              'w-full rounded-lg pl-8 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                              showValidation && form.pricePerHour <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                            ]"
                            placeholder="0.00" />
                          <div v-if="showValidation && form.pricePerHour <= 0" class="mt-1 text-sm text-red-600">
                            Price per hour is required
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Price per Day <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input type="number" v-model.number="form.pricePerDay" step="0.01" min="0"
                            :class="[
                              'w-full rounded-lg pl-8 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                              showValidation && form.pricePerDay <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                            ]"
                            placeholder="0.00" />
                          <div v-if="showValidation && form.pricePerDay <= 0" class="mt-1 text-sm text-red-600">
                            Price per day is required
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dedicated Desk Pricing - Monthly and Yearly -->
                <div v-if="form.type === 'Dedicated Desk'" class="space-y-4">
                  <div class="bg-purple-50 rounded-lg p-4">
                    <h3 class="text-md font-semibold text-gray-800 mb-4">Long-term Commitment</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Price per Month <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input type="number" v-model.number="form.pricePerMonth" step="0.01" min="0"
                            :class="[
                              'w-full rounded-lg pl-8 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                              showValidation && form.pricePerMonth <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                            ]"
                            placeholder="0.00" />
                          <div v-if="showValidation && form.pricePerMonth <= 0" class="mt-1 text-sm text-red-600">
                            Price per month is required
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Price per Year <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input type="number" v-model.number="form.pricePerYear" step="0.01" min="0"
                            :class="[
                              'w-full rounded-lg pl-8 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                              showValidation && form.pricePerYear <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                            ]"
                            placeholder="0.00" />
                          <div v-if="showValidation && form.pricePerYear <= 0" class="mt-1 text-sm text-red-600">
                            Price per year is required
                          </div>
                        </div>
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
                  <!-- Open Days with Individual Times -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-4">
                      Operating Days & Hours <span class="text-red-500">*</span>
                      <span class="block text-xs text-gray-500 mt-1">Select days and set individual operating hours for each day</span>
                    </label>
                    
                    <div class="space-y-3">
                      <div v-for="day in daysOfWeek" :key="day" 
                           class="border border-gray-200 rounded-lg p-4 transition-all duration-200"
                           :class="{ 'border-green-300 ': form.openDays.includes(day) }">
                        
                        <!-- Day Selection Header -->
                        <div class="flex items-center justify-between mb-3">
                          <label class="flex items-center cursor-pointer">
                            <input type="checkbox" 
                                   :value="day" 
                                   v-model="form.openDays" 
                                   @change="toggleDayHours(day, ($event.target as HTMLInputElement).checked)"
                                   class="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3">
                            <span class="font-medium text-gray-900">{{ day }}</span>
                          </label>
                        </div>
                        
                        <!-- Time Settings (shown only when day is selected) -->
                        <div v-if="form.openDays.includes(day)" 
                             class="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-green-200">
                          
                          <div>
                            <label class="block text-xs font-medium text-gray-700 mb-2">
                              Opening Time
                            </label>
                            <button type="button"
                                    @click="openTimePicker(day, 'start')"
                                    class="w-full rounded-md px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-left flex items-center justify-between hover:bg-gray-50 text-gray-700"
                                    :class="[
                                      showValidation && form.openDays.includes(day) && !form.dayHours[day].start ? 'border-red-500 ring-red-500' : ''
                                    ]">
                              <span class="flex items-center">
                                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ form.dayHours[day].start ? convertTo12Hour(form.dayHours[day].start).hour.toString().padStart(2, '0') + ':' + 
                                   convertTo12Hour(form.dayHours[day].start).minute.toString().padStart(2, '0') + ' ' + 
                                   convertTo12Hour(form.dayHours[day].start).period : 'Select time' }}
                              </span>
                              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div v-if="showValidation && form.openDays.includes(day) && !form.dayHours[day].start" 
                                 class="mt-1 text-xs text-red-600">
                              Opening time required
                            </div>
                          </div>
                          
                          <div>
                            <label class="block text-xs font-medium text-gray-700 mb-2">
                              Closing Time
                            </label>
                            <button type="button"
                                    @click="openTimePicker(day, 'end')"
                                    class="w-full rounded-md px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-left flex items-center justify-between hover:bg-gray-50 text-gray-700"
                                    :class="[
                                      showValidation && form.openDays.includes(day) && !form.dayHours[day].end ? 'border-red-500 ring-red-500' : ''
                                    ]">
                              <span class="flex items-center">
                                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ form.dayHours[day].end ? convertTo12Hour(form.dayHours[day].end).hour.toString().padStart(2, '0') + ':' + 
                                   convertTo12Hour(form.dayHours[day].end).minute.toString().padStart(2, '0') + ' ' + 
                                   convertTo12Hour(form.dayHours[day].end).period : 'Select time' }}
                              </span>
                              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div v-if="showValidation && form.openDays.includes(day) && !form.dayHours[day].end" 
                                 class="mt-1 text-xs text-red-600">
                              Closing time required
                            </div>
                          </div>
                          
                          <!-- Display hours summary -->
                          <div v-if="form.dayHours[day].start && form.dayHours[day].end" 
                               class="col-span-2 mt-2">
                            <div class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {{ form.dayHours[day].start }} - {{ form.dayHours[day].end }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Validation Message -->
                    <div v-if="showValidation && form.openDays.length === 0" 
                         class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div class="flex items-center">
                        <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-sm text-red-600">Please select at least one operating day with valid hours</span>
                      </div>
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
                    
                    <div class="relative">
                      <select 
                        v-model="selectedDefaultFacility"
                        @change="addDefaultFacility"
                        class="w-full border border-green-400 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 text-gray-700 transition-colors appearance-none cursor-pointer bg-white"
                      >
                        <option value="">Select free facilities to add</option>
                        <option 
                          v-for="facility in availableDefaultFacilities" 
                          :key="facility.id" 
                          :value="facility.name"
                        >
                          {{ facility.name }}
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <!-- Selected Default Facilities Display -->
                    <div v-if="form.defaultFacilities.length === 0" class="mt-4 text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                      <div class="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p class="text-sm font-medium text-gray-700">No free facilities selected yet</p>
                      <p class="text-xs text-gray-500 mt-1">Select from the dropdown above to add basic amenities</p>
                    </div>
                    
                    <div v-else class="mt-4 space-y-2">
                      <div v-for="(facility, index) in form.defaultFacilities" :key="index"
                           class="inline-flex items-center bg-gradient-to-r from-green-50 to-green-100 text-green-900 border border-green-200 px-4 py-3 rounded-lg text-sm font-medium mr-2 mb-2 hover:from-green-100 hover:to-green-150 transition-all duration-200 group">
                        <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="font-semibold">{{ facility }}</span>
                        <span class="mx-2 text-green-400">•</span>
                        <span class="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-bold">FREE</span>
                        <button type="button" @click="removeDefaultFacility(index)"
                          class="ml-3 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full p-1 transition-all duration-200">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Facilities with Pricing -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                      Additional Facilities (Paid)
                      <span class="text-xs text-gray-500 font-normal ml-1">- Premium add-ons with flexible pricing</span>
                    </label>
                    
                    <div class="relative">
                      <select 
                        v-model="selectedAdditionalFacility"
                        @change="addAdditionalFacility"
                        class="w-full border border-blue-400 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 text-gray-700 transition-colors appearance-none cursor-pointer bg-white"
                      >
                        <option value="">Select premium facilities to add</option>
                        <option 
                          v-for="facility in availableAdditionalFacilities" 
                          :key="facility.id" 
                          :value="facility.name"
                        >
                          {{ facility.name }}
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <!-- Selected Additional Facilities Display -->
                    <div v-if="form.additionalFacilities.length === 0" class="mt-4 text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                      <div class="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <p class="text-sm font-medium text-gray-700">No premium facilities selected</p>
                      <p class="text-xs text-gray-500 mt-1">Select from the dropdown above to include paid amenities</p>
                    </div>
                    
                    <div v-else class="mt-4 space-y-3">
                      <div v-for="(facility, index) in form.additionalFacilities" :key="index"
                           class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 px-4 py-4 rounded-lg hover:from-blue-100 hover:to-blue-150 transition-all duration-200">
                        <div class="flex items-center justify-between mb-3">
                          <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span class="font-semibold text-blue-900">{{ facility.name }}</span>
                          </div>
                          <button type="button" @click="removeAdditionalFacility(index)"
                            class="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-all duration-200">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div class="flex items-center space-x-3">
                          <label class="text-sm font-medium text-blue-800">Price per Hour:</label>
                          <div class="relative flex-1 max-w-32">
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">$</span>
                            <input 
                              type="number" 
                              v-model.number="facility.pricePerHour"
                              step="0.01" 
                              min="0"
                              class="w-full border border-blue-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900 bg-white"
                              placeholder="0.00" 
                            />
                          </div>
                          <span class="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                            ${{ facility.pricePerHour || 0 }}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Product Status -->
                  <div>
                    <div class="flex items-center space-x-3">
                      <div class="flex items-center">
                        <input 
                          type="checkbox" 
                          id="product-status"
                          v-model="isProductActive"
                          class="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <div class="ml-3">
                          <label for="product-status" class="text-lg font-semibold text-gray-900 cursor-pointer">
                            Product Status
                          </label>
                        </div>
                      </div>
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
                class="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-green-600 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl">
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

    <!-- Time Picker Modal -->
    <div v-if="showTimePicker" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 time-picker-modal"
         @keydown="handleKeyDown">
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-80 max-w-sm mx-4">
        <!-- Header -->
        <div class="text-center mb-6">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">SELECT TIME</h3>
          <div class="flex items-center justify-center space-x-3">
            <!-- Time Display -->
            <div class="flex items-center space-x-1 text-3xl font-light">
              <button @click="timePickerMode = 'hour'"
                      class="px-3 py-2 rounded-lg font-mono transition-all duration-200 hover:scale-105"
                      :class="timePickerMode === 'hour' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                {{ selectedHour.toString().padStart(2, '0') }}
              </button>
              <span class="text-gray-400 mx-2">:</span>
              <button @click="timePickerMode = 'minute'"
                      class="px-3 py-2 rounded-lg font-mono transition-all duration-200 hover:scale-105"
                      :class="timePickerMode === 'minute' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                {{ selectedMinute.toString().padStart(2, '0') }}
              </button>
            </div>
            <!-- AM/PM Toggle -->
            <div class="flex flex-col space-y-1">
              <button @click="togglePeriod" 
                      :class="selectedPeriod === 'AM' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'"
                      class="px-3 py-1 rounded text-sm font-medium transition-colors">
                AM
              </button>
              <button @click="togglePeriod"
                      :class="selectedPeriod === 'PM' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'"
                      class="px-3 py-1 rounded text-sm font-medium transition-colors">
                PM
              </button>
            </div>
          </div>
        </div>

        <!-- Clock Face -->
        <div class="relative w-56 h-56 mx-auto mb-6">
          <!-- Clock circle -->
          <div class="absolute inset-0 clock-face rounded-full"></div>
          
          <!-- Hour mode -->
          <div v-if="timePickerMode === 'hour'">
            <!-- Hour numbers -->
            <div v-for="hour in 12" :key="hour"
                 class="absolute w-8 h-8 flex items-center justify-center text-sm font-medium cursor-pointer rounded-full transition-all duration-200 clock-number"
                 :class="selectedHour === hour ? 'bg-green-500 text-white selected' : 'text-gray-700 hover:bg-green-100 hover:text-green-600'"
                 :style="`left: ${getNumberPosition(hour, 112, 12).x - 16}px; top: ${getNumberPosition(hour, 112, 12).y - 16}px`"
                 @click="selectHour(hour)">
              {{ hour }}
            </div>
            
      <!-- Clock hand for hour (angle now calculated without -90 offset so it matches highlighted number) -->
      <div class="absolute top-1/2 left-1/2 origin-bottom transform -translate-x-1/2 clock-hand"
        :style="`height: 80px; margin-top: -80px; transform: translateX(-50%) rotate(${getHandAngle(selectedHour % 12, 12)}deg)`">
              <div class="w-1 h-full bg-green-500 rounded-full shadow-lg"></div>
              <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <!-- Minute mode -->
          <div v-else>
            <!-- Minute markers (every 5 minutes) -->
            <div v-for="minute in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]" :key="minute"
                 class="absolute w-8 h-8 flex items-center justify-center text-sm font-medium cursor-pointer rounded-full transition-all duration-200 clock-number"
                 :class="selectedMinute === minute ? 'bg-green-500 text-white selected' : 'text-gray-700 hover:bg-green-100 hover:text-green-600'"
                 :style="`left: ${getNumberPosition(minute / 5 || 12, 112, 12).x - 16}px; top: ${getNumberPosition(minute / 5 || 12, 112, 12).y - 16}px`"
                 @click="selectMinute(minute)">
              {{ minute.toString().padStart(2, '0') }}
            </div>
            
      <!-- Clock hand for minute -->
      <div class="absolute top-1/2 left-1/2 origin-bottom transform -translate-x-1/2 clock-hand"
        :style="`height: 80px; margin-top: -80px; transform: translateX(-50%) rotate(${getHandAngle(selectedMinute, 60)}deg)`">
              <div class="w-0.5 h-full bg-green-500 rounded-full shadow-lg"></div>
              <div class="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <!-- Center dot -->
          <div class="absolute top-1/2 left-1/2 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-white"></div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end">
          <div class="flex space-x-2">
            <button @click="closeTimePicker" 
                    class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
              CANCEL
            </button>
            <button @click="confirmTimeSelection"
                    class="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-800 transition-colors">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { productApi, locationApi } from '@/services/api'
import { 
  mdiOfficeBuilding, 
  mdiPackageVariant, 
  mdiCurrencyUsd, 
  mdiClockOutline, 
  mdiCog 
} from '@mdi/js'

const route = useRoute()
const router = useRouter()

// Type definitions
type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

type DayHours = {
  [key in DayOfWeek]: { start: string; end: string }
}

// Data
const productId = route.params.id as string
const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// State
const isLoading = ref(true)
const isSaving = ref(false)
const originalProduct = ref<any>(null)

// Facility selection
const selectedDefaultFacility = ref('')
const selectedAdditionalFacility = ref('')

// Loading states for external data
const isLoadingLocations = ref(false)
const locationError = ref('')
const isLoadingFacilities = ref(false)
const facilitiesError = ref('')

// Validation state
const showValidation = ref(false)

// Time picker state
const showTimePicker = ref(false)
const selectedHour = ref(7)
const selectedMinute = ref(0)
const selectedPeriod = ref('AM')
const timePickerMode = ref<'hour' | 'minute'>('hour')
const currentTimeField = ref<{day: DayOfWeek, type: 'start' | 'end'} | null>(null)

// Dropdown states for rotating arrows
const dropdownStates = ref({
  location: false,
  productType: false
})

// Available locations and facilities
const locations = ref<any[]>([])

// Sample locations as fallback
const sampleLocations = [
  { id: 'LOC001', name: 'Downtown Office', city: 'New York', status: 'active' },
  { id: 'LOC002', name: 'Tech Hub', city: 'San Francisco', status: 'active' },
  { id: 'LOC003', name: 'Business Center', city: 'Los Angeles', status: 'active' },
  { id: 'LOC004', name: 'Innovation Campus', city: 'Austin', status: 'active' },
  { id: 'LOC005', name: 'Corporate Plaza', city: 'Chicago', status: 'active' }
]
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
  openDays: [] as DayOfWeek[],
  dayHours: {
    'Monday': { start: '09:00', end: '17:00' },
    'Tuesday': { start: '09:00', end: '17:00' },
    'Wednesday': { start: '09:00', end: '17:00' },
    'Thursday': { start: '09:00', end: '17:00' },
    'Friday': { start: '09:00', end: '17:00' },
    'Saturday': { start: '09:00', end: '17:00' },
    'Sunday': { start: '09:00', end: '17:00' }
  } as DayHours,
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
                         form.value.description.trim() && 
                         form.value.maxSeatingCapacity > 0 &&
                         form.value.openDays.length > 0 &&
                         form.value.openDays.every((day) => 
                           form.value.dayHours[day].start && form.value.dayHours[day].end
                         )

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

const isProductActive = computed({
  get: () => form.value.status === 'active',
  set: (value: boolean) => {
    form.value.status = value ? 'active' : 'inactive'
  }
})

const availableDefaultFacilities = computed(() => {
  return availableFacilities.value.filter(facility => 
    !form.value.defaultFacilities.includes(facility.name)
  )
})

const availableAdditionalFacilities = computed(() => {
  return availableFacilities.value.filter(facility => 
    !form.value.additionalFacilities.some(f => f.name === facility.name)
  )
})

// Computed property to ensure current location is always in the list
const allLocations = computed(() => {
  const currentLocationId = form.value.locationId
  const locationsList = [...locations.value]
  
  // If there's a current location ID that's not in the list, add it
  if (currentLocationId && !locationsList.some(loc => loc.id === currentLocationId)) {
    // Try to find the location name from originalProduct
    const locationName = originalProduct.value?.locationName || `Location ${currentLocationId}`
    locationsList.unshift({
      id: currentLocationId,
      name: locationName,
      city: 'Unknown',
      status: 'active'
    })
  }
  
  return locationsList
})

// Methods
const loadProduct = async () => {
  isLoading.value = true
  
  try {
    console.log('Loading product for edit with ID:', productId)
    
    const response = await productApi.getProductById(productId)
    
    if (response.success && response.data) {
      originalProduct.value = response.data
      console.log('Product loaded for editing:', originalProduct.value)
      
      // Populate form with existing data
      Object.assign(form.value, {
        locationId: originalProduct.value.locationId || '',
        type: originalProduct.value.type || '',
        images: [...(originalProduct.value.images || [])],
        name: originalProduct.value.name || '',
        description: originalProduct.value.description || '',
        maxSeatingCapacity: originalProduct.value.maxSeatingCapacity || 1,
        pricePerHour: originalProduct.value.pricePerHour || 0,
        pricePerDay: originalProduct.value.pricePerDay || 0,
        pricePerMonth: originalProduct.value.pricePerMonth || 0,
        pricePerYear: originalProduct.value.pricePerYear || 0,
        openDays: [...(originalProduct.value.openDays || [])],
        dayHours: originalProduct.value.dayHours ? { ...originalProduct.value.dayHours } : {
          'Monday': { start: '09:00', end: '17:00' },
          'Tuesday': { start: '09:00', end: '17:00' },
          'Wednesday': { start: '09:00', end: '17:00' },
          'Thursday': { start: '09:00', end: '17:00' },
          'Friday': { start: '09:00', end: '17:00' },
          'Saturday': { start: '09:00', end: '17:00' },
          'Sunday': { start: '09:00', end: '17:00' }
        },
        openHours: { 
          start: originalProduct.value.openHours?.start || '09:00',
          end: originalProduct.value.openHours?.end || '17:00'
        },
        defaultFacilities: [...(originalProduct.value.defaultFacilities || [])],
        additionalFacilities: (originalProduct.value.additionalFacilities || []).map((facility: any) => ({
          name: facility.name || '',
          pricePerHour: facility.pricePerHour || 0
        })),
        status: originalProduct.value.status || 'active'
      })
    } else {
      console.error('Failed to load product:', response.message)
      originalProduct.value = null
    }
  } catch (error) {
    console.error('Error loading product:', error)
    originalProduct.value = null
  } finally {
    isLoading.value = false
  }
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

// Dropdown methods
const toggleDropdown = (dropdownType: string) => {
  if (dropdownType === 'location') {
    dropdownStates.value.location = !dropdownStates.value.location
  } else if (dropdownType === 'productType') {
    dropdownStates.value.productType = !dropdownStates.value.productType
  }
}

const closeDropdown = (dropdownType: string) => {
  setTimeout(() => {
    if (dropdownType === 'location') {
      dropdownStates.value.location = false
    } else if (dropdownType === 'productType') {
      dropdownStates.value.productType = false
    }
  }, 150)
}

// Fetch methods (placeholder for future API integration)
const fetchLocations = async () => {
  isLoadingLocations.value = true
  locationError.value = ''
  try {
    console.log('Fetching locations...')
    const response = await locationApi.getAllLocations()
    if (response.success && response.data) {
      locations.value = response.data
      console.log('Locations loaded:', locations.value)
    } else {
      // Use sample data as fallback
      console.log('Using sample location data as fallback')
      locations.value = sampleLocations
    }
  } catch (error) {
    // Use sample data as fallback
    console.log('Using sample location data as fallback due to error:', error)
    locations.value = sampleLocations
    locationError.value = ''  // Clear error since we have fallback data
  } finally {
    isLoadingLocations.value = false
  }
}

const fetchFacilities = async () => {
  isLoadingFacilities.value = true
  facilitiesError.value = ''
  try {
    // TODO: Implement facility API fetch
    // const response = await facilityApi.getFacilities()
    // availableFacilities.value = response.data || []
    console.log('Facility fetching not yet implemented')
  } catch (error) {
    facilitiesError.value = 'Failed to load facilities'
    console.error('Error fetching facilities:', error)
  } finally {
    isLoadingFacilities.value = false
  }
}

// Default facility methods
const addDefaultFacility = () => {
  if (selectedDefaultFacility.value && !form.value.defaultFacilities.includes(selectedDefaultFacility.value)) {
    form.value.defaultFacilities.push(selectedDefaultFacility.value)
    selectedDefaultFacility.value = ''
  }
}

const removeDefaultFacility = (index: number) => {
  form.value.defaultFacilities.splice(index, 1)
}

// Additional facility methods
const addAdditionalFacility = () => {
  if (selectedAdditionalFacility.value && !form.value.additionalFacilities.some(f => f.name === selectedAdditionalFacility.value)) {
    form.value.additionalFacilities.push({
      name: selectedAdditionalFacility.value,
      pricePerHour: 0
    })
    selectedAdditionalFacility.value = ''
  }
}

const removeAdditionalFacility = (index: number) => {
  form.value.additionalFacilities.splice(index, 1)
}

// Time picker helper functions
const formatTime = (hour: number, minute: number, period: string) => {
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`
}

const parseTimeToComponents = (timeString: string) => {
  const [time, period] = timeString.split(' ')
  const [hourStr, minuteStr] = time.split(':')
  let hour = parseInt(hourStr)
  const minute = parseInt(minuteStr)
  
  if (period === 'PM' && hour !== 12) {
    hour += 12
  } else if (period === 'AM' && hour === 12) {
    hour = 0
  }
  
  return { hour, minute, period }
}

const convertTo12Hour = (time24: string) => {
  const [hourStr, minuteStr] = time24.split(':')
  let hour = parseInt(hourStr)
  const minute = parseInt(minuteStr)
  const period = hour >= 12 ? 'PM' : 'AM'
  
  if (hour === 0) {
    hour = 12
  } else if (hour > 12) {
    hour -= 12
  }
  
  return { hour, minute, period }
}

const convertTo24Hour = (hour: number, minute: number, period: string) => {
  let hour24 = hour
  if (period === 'AM' && hour === 12) {
    hour24 = 0
  } else if (period === 'PM' && hour !== 12) {
    hour24 += 12
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

const getNumberPosition = (number: number, radius: number, total: number) => {
  // Adjust for 12 o'clock being at top (subtract 90 degrees)
  const angle = ((number * 360) / total) - 90
  const radian = (angle * Math.PI) / 180
  const x = radius + radius * 0.8 * Math.cos(radian)
  const y = radius + radius * 0.8 * Math.sin(radian)
  return { x, y }
}

// Helper function to get exact hand angle (baseline is 12 o'clock at 0deg)
const getHandAngle = (value: number, maxValue: number) => {
  return (value * 360) / maxValue
}

const openTimePicker = (day: DayOfWeek, type: 'start' | 'end') => {
  currentTimeField.value = { day, type }
  
  // Get current time for this field
  const currentTime = form.value.dayHours[day][type]
  const timeComponents = convertTo12Hour(currentTime)
  
  selectedHour.value = timeComponents.hour
  selectedMinute.value = timeComponents.minute
  selectedPeriod.value = timeComponents.period
  timePickerMode.value = 'hour'
  showTimePicker.value = true
}

const selectHour = (hour: number) => {
  selectedHour.value = hour
  // Don't automatically switch to minute mode - let user click on minute display
}

const selectMinute = (minute: number) => {
  selectedMinute.value = minute
  // Don't automatically confirm - let user decide when to confirm
}

const togglePeriod = () => {
  selectedPeriod.value = selectedPeriod.value === 'AM' ? 'PM' : 'AM'
}

const confirmTimeSelection = () => {
  if (currentTimeField.value) {
    const time24 = convertTo24Hour(selectedHour.value, selectedMinute.value, selectedPeriod.value)
    const { day, type } = currentTimeField.value
    form.value.dayHours[day][type] = time24
  }
  closeTimePicker()
}

const closeTimePicker = () => {
  showTimePicker.value = false
  currentTimeField.value = null
  timePickerMode.value = 'hour'
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!showTimePicker.value) return
  
  switch (event.key) {
    case 'Escape':
      closeTimePicker()
      break
    case 'Enter':
      confirmTimeSelection()
      break
    case 'ArrowLeft':
    case 'ArrowRight':
      event.preventDefault()
      togglePeriod()
      break
    case 'ArrowUp':
    case 'ArrowDown':
      event.preventDefault()
      timePickerMode.value = timePickerMode.value === 'hour' ? 'minute' : 'hour'
      break
  }
}

// Toggle day hours when a day is selected/deselected
const toggleDayHours = (day: DayOfWeek, isChecked: boolean) => {
  if (!isChecked) {
    // When day is unchecked, reset its hours to default
    form.value.dayHours[day] = { start: '09:00', end: '17:00' }
  }
}

const updateProduct = async () => {
  // Enable validation
  showValidation.value = true
  
  if (!isFormValid.value) {
    alert('Please fill in all required fields')
    return
  }

  isSaving.value = true
  
  try {
    console.log('Updating product with form data:', form.value)
    
    // Calculate general opening/closing times from the selected days
    let earliestStart = '23:59'
    let latestEnd = '00:00'
    
    // Find earliest start and latest end from the selected open days
    if (form.value.openDays.length > 0) {
      form.value.openDays.forEach((day: DayOfWeek) => {
        const dayStart = form.value.dayHours[day].start
        const dayEnd = form.value.dayHours[day].end
        
        if (dayStart < earliestStart) {
          earliestStart = dayStart
        }
        if (dayEnd > latestEnd) {
          latestEnd = dayEnd
        }
      })
    }
    
    // If no days selected, use default times
    if (form.value.openDays.length === 0) {
      earliestStart = '09:00'
      latestEnd = '17:00'
    }

    // Transform frontend form data to API format
    const productData: any = {
      LocationId: form.value.locationId,
      ProductType: form.value.type,
      ProductName: form.value.name,
      Description: form.value.description,
      MaxSeatingCapacity: form.value.maxSeatingCapacity,
      OpeningTime: earliestStart,
      ClosingTime: latestEnd,
      DefaultFacilities: [], // TODO: Convert facility names to IDs when facility API is ready
      AdditionalFacilities: form.value.additionalFacilities.map((facility, index) => ({
        id: index + 1, // TODO: Use real facility IDs when API is ready
        name: facility.name,
        pricePerHour: facility.pricePerHour,
        pricePerDay: 0,
        pricePerMonth: 0,
        pricePerYear: 0
      })),
      Images: form.value.images,
      IsActive: form.value.status === 'active',
      OperationTime: {
        IsMonday: form.value.openDays.includes('Monday'),
        IsTuesday: form.value.openDays.includes('Tuesday'),
        IsWednesday: form.value.openDays.includes('Wednesday'),
        IsThursday: form.value.openDays.includes('Thursday'),
        IsFriday: form.value.openDays.includes('Friday'),
        IsSaturday: form.value.openDays.includes('Saturday'),
        IsSunday: form.value.openDays.includes('Sunday'),
        MondayStart: form.value.dayHours.Monday.start,
        MondayEnd: form.value.dayHours.Monday.end,
        TuesdayStart: form.value.dayHours.Tuesday.start,
        TuesdayEnd: form.value.dayHours.Tuesday.end,
        WednesdayStart: form.value.dayHours.Wednesday.start,
        WednesdayEnd: form.value.dayHours.Wednesday.end,
        ThursdayStart: form.value.dayHours.Thursday.start,
        ThursdayEnd: form.value.dayHours.Thursday.end,
        FridayStart: form.value.dayHours.Friday.start,
        FridayEnd: form.value.dayHours.Friday.end,
        SaturdayStart: form.value.dayHours.Saturday.start,
        SaturdayEnd: form.value.dayHours.Saturday.end,
        SundayStart: form.value.dayHours.Sunday.start,
        SundayEnd: form.value.dayHours.Sunday.end
      }
    }

    // Add pricing based on product type
    if (form.value.type === 'Meeting Room') {
      productData.PricePerHour = form.value.pricePerHour
    } else if (form.value.type === 'Hot Desk') {
      productData.PricePerHour = form.value.pricePerHour
      productData.PricePerDay = form.value.pricePerDay
    } else if (form.value.type === 'Dedicated Desk') {
      productData.PricePerMonth = form.value.pricePerMonth
      productData.PricePerYear = form.value.pricePerYear
    }

    console.log('Sending update request with data:', productData)
    
    const response = await productApi.updateProduct(productId, productData)
    
    if (response.success) {
      console.log('Product updated successfully:', response)
      alert('Product updated successfully!')
      
      // Navigate to product detail view
      router.push(`/products/${productId}`)
    } else {
      console.error('Failed to update product:', response.message)
      alert(`Failed to update product: ${response.message}`)
    }
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
  fetchLocations()
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
input[type="checkbox"] {
  transition: all 0.2s ease;
  accent-color: #16a34a; /* Green-600 for fill color */
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

/* Time picker specific styles */
.time-picker-modal {
  backdrop-filter: blur(4px);
}

.clock-hand {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.clock-number {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.clock-number:hover {
  transform: scale(1.1);
}

.clock-number.selected {
  transform: scale(1.15);
}

/* Time picker button animations */
.time-button {
  position: relative;
  overflow: hidden;
}

.time-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.time-button:hover::before {
  left: 100%;
}

/* Modal entrance animation */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.time-picker-modal > div {
  animation: modalFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Clock face gradient */
.clock-face {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
