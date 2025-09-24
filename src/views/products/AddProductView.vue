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
            <div class="bg-white rounded-xl shadow-card overflow-visible relative">
              <!-- Product Number Header -->
                <div class="bg-gradient-to-r rounded-t-xl from-green-500 to-green-600 text-white px-8 py-4">
                <h3 class="text-lg font-semibold">Product {{ idx + 1 }}</h3>
                </div>

              <!-- Remove button for second and subsequent products -->
              <div v-if="idx > 0" class="absolute top-4 right-4 z-10">
                <button type="button" @click="removeProductForm(idx)"
                  class="p-2 text-white hover:text-green-200 hover:bg-green-500/20 rounded-lg transition-all duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="p-8 space-y-8">
                
                <!-- Location Selection - Only show for first product -->
                <div v-if="idx === 0">
                  <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <svg class="w-6 h- mr-3" fill="currentColor" viewBox="0 0 24 24">
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
                    <div v-else class="relative dropdown-container">
                      <div @click="toggleDropdown('location')" :class="[
                        'w-full border rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white flex items-center',
                        showValidation[idx] && !product.locationId ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                      ]">
                        <span class="text-gray-900 leading-5 h-5 flex items-center truncate">{{ getLocationLabel(product.locationId) }}</span>
                      </div>

                      <!-- Dropdown Options -->
                      <div v-if="dropdownStates.location" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div class="p-2">
                          <div v-for="location in locations" :key="location.id" @click="selectLocation(location.id, idx)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
                            {{ location.name }}
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
                      <div class="relative dropdown-container">
                        <div @click="toggleDropdown('productType')" :class="[
                          'w-full border rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white flex items-center',
                          showValidation[idx] && !product.type ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                        ]">
                          <span class="text-gray-900 leading-5 h-5 flex items-center truncate">{{ getProductTypeLabel(product.type) }}</span>
                        </div>

                        <!-- Dropdown Options -->
                        <div v-if="dropdownStates.productType" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div class="p-2">
                            <div v-for="option in productTypeOptions" :key="option.value" @click="selectProductType(option.value, idx)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
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
                      <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50/30 transition-all duration-200 group">
                        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                          <svg class="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div class="mt-4">
                          <label :for="`file-upload-${idx}`" class="cursor-pointer">
                            <span class="block text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Click to upload images</span>
                            <span class="block text-sm text-gray-500 mt-1">or drag and drop files here</span>
                            <span class="block text-xs text-gray-400 mt-2">PNG, JPG, JPEG • Max 10MB each • Up to 8 images</span>
                          </label>
                          <input :id="`file-upload-${idx}`" :name="`file-upload-${idx}`" type="file" multiple accept="image/*,image/jpeg,image/png,image/gif" class="sr-only" @change="(event) => handleImageUpload(event, idx)" />
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
                              <button type="button" @click="removeImage(index, idx)" 
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
                            'w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors',
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
                            'w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors',
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
                            'w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors',
                            showValidation[idx] && !product.description.trim() ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                          ]"
                          placeholder="Enter product description"></textarea>
                        <div v-if="showValidation[idx] && !product.description.trim()" class="mt-1 text-sm text-red-600">
                          Description is required
                        </div>
                      </div>

                  </div>
                </div>

                <!-- Pricing Section - Product-specific pricing -->
                <div v-if="product.type">
                  <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiCurrencyUsd" />
                    </svg>
                    Pricing
                  </h2>
                  
                  <!-- Meeting Room Pricing - Hourly only -->
                  <div v-if="product.type === 'Meeting Room'" class="space-y-4">
                    <div class="rounded-lg p-3">
                      <h3 class="text-md font-semibold text-gray-800 mb-4">Hourly Booking</h3>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Price per Hour <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">LKR </span>
                          <input type="number" v-model.number="product.pricePerHour" step="0.01" min="0"
                            :class="[
                              'w-full rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors',
                              showValidation[idx] && product.pricePerHour <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                            ]"
                            placeholder="0.00" />
                          <div v-if="showValidation[idx] && product.pricePerHour <= 0" class="mt-1 text-sm text-red-600">
                            Price per hour is required
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Hot Desk Pricing - Daily only -->
                  <div v-if="product.type === 'Hot Desk'" class="space-y-4">
                    <div class="rounded-lg p-4">
                      <h3 class="text-md font-semibold text-gray-800 mb-4">Daily Booking</h3>
                      <div class="grid grid-cols-1 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            Price per Day <span class="text-red-500">*</span>
                          </label>
                          <div class="relative">
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">LKR</span>
                            <input type="number" v-model.number="product.pricePerDay" step="0.01" min="0"
                              :class="[
                                'w-full rounded-lg pl-12 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                                showValidation[idx] && product.pricePerDay <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                              ]"
                              placeholder="0.00" />
                            <div v-if="showValidation[idx] && product.pricePerDay <= 0" class="mt-1 text-sm text-red-600">
                              Price per day is required
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Dedicated Desk Pricing - Monthly and Yearly -->
                  <div v-if="product.type === 'Dedicated Desk'" class="space-y-4">
                    <div class=" rounded-lg p-4">
                      <h3 class="text-md font-semibold text-gray-800 mb-4">Long-term Commitment</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            Price per Month <span class="text-red-500">*</span>
                          </label>
                          <div class="relative">
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">LKR</span>
                            <input type="number" v-model.number="product.pricePerMonth" step="0.01" min="0"
                              :class="[
                                'w-full rounded-lg pl-12 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                                showValidation[idx] && product.pricePerMonth <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                              ]"
                              placeholder="0.00" />
                            <div v-if="showValidation[idx] && product.pricePerMonth <= 0" class="mt-1 text-sm text-red-600">
                              Price per month is required
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            Price per Year <span class="text-red-500">*</span>
                          </label>
                          <div class="relative">
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">LKR</span>
                            <input type="number" v-model.number="product.pricePerYear" step="0.01" min="0"
                              :class="[
                                'w-full rounded-lg pl-12 pr-4 py-3 focus:ring-2 text-gray-900 transition-colors',
                                showValidation[idx] && product.pricePerYear <= 0 ? 'border-2 border-red-500 ring-red-500 focus:ring-red-500' : 'border border-gray-300'
                              ]"
                              placeholder="0.00" />
                            <div v-if="showValidation[idx] && product.pricePerYear <= 0" class="mt-1 text-sm text-red-600">
                              Price per year is required
                            </div>
                          </div>
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
                    <!-- Open Days with Individual Times -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-4">
                        Operating Days & Hours <span class="text-red-500">*</span>
                        <span class="block text-xs text-gray-500 mt-1">Select days and set individual operating hours for each day</span>
                      </label>
                      
                      <div class="space-y-3">
                        <div v-for="day in daysOfWeek" :key="day" 
                             class="border border-gray-200 rounded-lg p-4 transition-all duration-200"
                             :class="{ 'border-green-300 ': product.openDays.includes(day) }">
                          
                          <!-- Day Selection Header -->
                          <div class="flex items-center justify-between mb-3">
                            <label class="flex items-center cursor-pointer">
                              <input type="checkbox" 
                                     :value="day" 
                                     v-model="product.openDays" 
                                     @change="toggleDayHours(day, ($event.target as HTMLInputElement).checked)"
                                     class="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3">
                              <span class="font-medium text-gray-900">{{ day }}</span>
                            </label>
                            <!-- <span v-if="product.openDays.includes(day)" 
                                  class="text-xs text-green-600 font-medium">
                              Open
                            </span> -->
                          </div>
                          
                          <!-- Time Settings (shown only when day is selected) -->
                          <div v-if="product.openDays.includes(day)" 
                               class="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-green-200">
                            
                            <div>
                              <label class="block text-xs font-medium text-gray-700 mb-2">
                                Opening Time
                              </label>
                              <button type="button"
                                      @click="openTimePicker(day, 'start')"
                                      class="w-full rounded-md px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-left flex items-center justify-between hover:bg-gray-50 text-gray-700"
                                      :class="[
                                        showValidation[idx] && product.openDays.includes(day) && !product.dayHours[day].start ? 'border-red-500 ring-red-500' : ''
                                      ]">
                                <span class="flex items-center">
                                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {{ product.dayHours[day].start ? convertTo12Hour(product.dayHours[day].start).hour.toString().padStart(2, '0') + ':' + 
                                     convertTo12Hour(product.dayHours[day].start).minute.toString().padStart(2, '0') + ' ' + 
                                     convertTo12Hour(product.dayHours[day].start).period : 'Select time' }}
                                </span>
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <div v-if="showValidation[idx] && product.openDays.includes(day) && !product.dayHours[day].start" 
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
                                        showValidation[idx] && product.openDays.includes(day) && !product.dayHours[day].end ? 'border-red-500 ring-red-500' : ''
                                      ]">
                                <span class="flex items-center">
                                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {{ product.dayHours[day].end ? convertTo12Hour(product.dayHours[day].end).hour.toString().padStart(2, '0') + ':' + 
                                     convertTo12Hour(product.dayHours[day].end).minute.toString().padStart(2, '0') + ' ' + 
                                     convertTo12Hour(product.dayHours[day].end).period : 'Select time' }}
                                </span>
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <div v-if="showValidation[idx] && product.openDays.includes(day) && !product.dayHours[day].end" 
                                   class="mt-1 text-xs text-red-600">
                                Closing time required
                              </div>
                            </div>
                            
                            <!-- Display hours summary -->
                            <div v-if="product.dayHours[day].start && product.dayHours[day].end" 
                                 class="col-span-2 mt-2">
                              <div class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {{ product.dayHours[day].start }} - {{ product.dayHours[day].end }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Validation Message -->
                      <div v-if="showValidation[idx] && product.openDays.length === 0" 
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
                      
                      <!-- Loading state for facilities -->
                      <div v-if="isLoadingFacilities" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-500 mb-4">
                        <svg class="animate-spin w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading facilities...
                      </div>
                      
                      <!-- Error state for facilities -->
                      <div v-else-if="facilitiesError" class="w-full border border-red-300 rounded-lg px-4 py-3 text-red-600 bg-red-50 mb-4">
                        {{ facilitiesError }}
                        <button @click="fetchFacilities" class="ml-2 text-red-700 underline hover:no-underline">
                          Retry
                        </button>
                      </div>
                      
                      <!-- Facilities dropdown with checkboxes -->
                      <div v-else class="mb-4 relative facility-dropdown">
                        <div class="relative">
                          <div @click="toggleDefaultDropdown(idx)" class="cursor-pointer facility-dropdown-trigger w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors text-left flex items-center justify-between"
                            :class="[
                              showDefaultDropdown[idx] 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-300 bg-white'
                            ]"
                          >
                            <span v-if="showDefaultDropdown[idx]" class="text-gray-500">
                              Select facilities below...
                            </span>
                            <span v-else-if="product.defaultFacilities.length === 0" class="text-gray-500">
                              Select free facilities to add
                            </span>
                            <span v-else class="text-gray-900">
                              {{ product.defaultFacilities.length }} {{ product.defaultFacilities.length === 1 ? 'facility' : 'facilities' }} selected
                            </span>
                            <svg class="w-5 h-5 text-gray-400 transform transition-transform duration-200"
                              :class="{ 'rotate-180': showDefaultDropdown[idx] }"
                              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          
                          <!-- Dropdown content -->
                          <div v-show="showDefaultDropdown[idx]" 
                            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div v-if="availableFacilities.length === 0" class="px-4 py-3 text-gray-500 text-sm">
                              No facilities available
                            </div>
                            <div v-else class="py-2">
                              <label v-for="facility in getAvailableDefaultFacilities(idx)" :key="facility.id" 
                                class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" 
                                  :value="facility.id"
                                  :checked="product.defaultFacilities.includes(facility.id)"
                                  @change="(event) => updateDefaultFacilities(event, idx)"
                                  class="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3">
                                <div class="flex-1">
                                  <div class="font-medium text-gray-900">{{ facility.name }}</div>
                                  <div v-if="facility.description" class="text-xs text-gray-500">
                                    {{ facility.description }}
                                  </div>
                                </div>
                                <!-- Show checkmark for selected facilities -->
                                <div v-if="product.defaultFacilities.includes(facility.id)" class="ml-2">
                                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </label>
                            </div>
                            <!-- Action buttons -->
                            <div class="border-t border-gray-200 px-4 py-3 flex justify-between">
                              <button type="button" @click="clearDefaultFacilities(idx)" 
                                class="text-xs text-red-600 hover:text-red-700 font-medium">
                                Clear All
                              </button>
                              <button type="button" @click="showDefaultDropdown[idx] = false"
                                class="text-xs text-green-600 hover:text-green-700 font-medium">
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Selected Default Facilities as Chips -->
                      <div v-if="product.defaultFacilities.length > 0" class="mb-4">
                        <div class="flex items-center justify-between mb-3">
                          <span class="text-sm text-gray-600">{{ product.defaultFacilities.length }} facilities selected</span>
                          <button type="button" @click="clearDefaultFacilities(idx)" class="text-xs text-red-600 hover:text-red-700 font-medium">
                            Clear All
                          </button>
                        </div>
                        <div class="flex flex-wrap gap-2">
                          <div v-for="(facilityId, index) in product.defaultFacilities" :key="index"
                               class="inline-flex items-center bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200 px-3 py-2 rounded-lg text-sm font-medium hover:from-green-100 hover:to-green-150 transition-all duration-200 group">
                            <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{{ getFacilityName(facilityId) }}</span>
                            <button type="button" @click="removeDefaultFacility(index, idx)"
                              class="ml-2 w-4 h-4 text-green-600 hover:text-red-600 transition-colors">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="product.defaultFacilities.length === 0 && !isLoadingFacilities && !facilitiesError" class="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                        <div class="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                          <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p class="text-sm font-medium text-gray-700">No free facilities selected yet</p>
                        <p class="text-xs text-gray-500 mt-1">Select from the dropdown above to add basic amenities</p>
                      </div>
                    </div>

                    <!-- Additional Facilities with Flexible Pricing -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-3">
                        Additional Facilities (Paid)
                        <span class="text-xs text-gray-500 font-normal ml-1">- Premium add-ons with flexible pricing</span>
                      </label>
                      
                      <!-- Loading state for facilities -->
                      <div v-if="isLoadingFacilities" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-500 mb-4">
                        <svg class="animate-spin w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading facilities...
                      </div>
                      
                      <!-- Error state for facilities -->
                      <div v-else-if="facilitiesError" class="w-full border border-red-300 rounded-lg px-4 py-3 text-red-600 bg-red-50 mb-4">
                        {{ facilitiesError }}
                        <button @click="fetchFacilities" class="ml-2 text-red-700 underline hover:no-underline">
                          Retry
                        </button>
                      </div>
                      
                      <!-- Additional Facilities dropdown with checkboxes -->
                      <div v-else class="mb-4 relative facility-dropdown">
                        <div class="relative">
                          <div @click="toggleAdditionalDropdown(idx)" class="cursor-pointer facility-dropdown-trigger w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 text-gray-900 transition-colors text-left flex items-center justify-between"
                            :class="[
                              showAdditionalDropdown[idx] 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-300 bg-white'
                            ]"
                          >
                            <span v-if="showAdditionalDropdown[idx]" class="text-gray-500">
                              Select facilities below...
                            </span>
                            <span v-else-if="product.additionalFacilities.length === 0" class="text-gray-500">
                              Select premium facilities to add
                            </span>
                            <span v-else class="text-gray-900">
                              {{ product.additionalFacilities.length }} {{ product.additionalFacilities.length === 1 ? 'facility' : 'facilities' }} selected
                            </span>
                            <svg class="w-5 h-5 text-gray-400 transform transition-transform duration-200"
                              :class="{ 'rotate-180': showAdditionalDropdown[idx] }"
                              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          
                          <!-- Dropdown content -->
                          <div v-show="showAdditionalDropdown[idx]" 
                            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div v-if="availableFacilities.length === 0" class="px-4 py-3 text-gray-500 text-sm">
                              No facilities available
                            </div>
                            <div v-else class="py-2">
                              <label v-for="facility in getAvailableAdditionalFacilities(idx)" :key="facility.id" 
                                class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" 
                                  :value="facility.id"
                                  :checked="product.additionalFacilities.some(f => f.id === facility.id)"
                                  @change="(event) => updateAdditionalFacilities(event, idx)"
                                  class="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3">
                                <div class="flex-1">
                                  <div class="font-medium text-gray-900">{{ facility.name }}</div>
                                  <div v-if="facility.description" class="text-xs text-gray-500">
                                    {{ facility.description }}
                                  </div>
                                </div>
                                <!-- Show checkmark for selected facilities -->
                                <div v-if="product.additionalFacilities.some(f => f.id === facility.id)" class="ml-2">
                                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </label>
                            </div>
                            <!-- Action buttons -->
                            <div class="border-t border-gray-200 px-4 py-3 flex justify-between">
                              <button type="button" @click="clearAdditionalFacilities(idx)" 
                                class="text-xs text-red-600 hover:text-red-700 font-medium">
                                Clear All
                              </button>
                              <button type="button" @click="showAdditionalDropdown[idx] = false"
                                class="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Selected Additional Facilities - Different layouts for each product type -->
                      <div v-if="product.additionalFacilities.length > 0" class="mb-4">
                        <div class="flex items-center justify-between mb-4">
                          <span class="text-sm text-gray-600">{{ product.additionalFacilities.length }} premium facilities selected</span>
                          <button type="button" @click="clearAdditionalFacilities(idx)" class="text-xs text-red-600 hover:text-red-700 font-medium">
                            Clear All
                          </button>
                        </div>
                        
                        <!-- Meeting Room - Small Card Layout (3 columns) -->
                        <div v-if="product.type === 'Meeting Room'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div v-for="(facility, index) in product.additionalFacilities" :key="index"
                               class="bg-white border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                            <!-- Card Header -->
                            <div class="flex items-center justify-between mb-3">
                              <div class="flex items-center">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                </div>
                                <h4 class="font-medium text-gray-900 text-sm">{{ facility.name }}</h4>
                              </div>
                              <button type="button" @click="removeAdditionalFacility(index, idx)"
                                class="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-all duration-200">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            <!-- Pricing Inputs - All time periods -->
                            <div class="grid grid-cols-2 gap-3">
                              <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Price per Hour</label>
                                <div class="relative">
                                  <span class="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">LKR</span>
                                  <input type="number"
                                         v-model.number="facility.pricePerHour"
                                         step="0.01" min="0"
                                         class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                         placeholder="0.00" />
                                </div>
                              </div>

                              <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Price per Day</label>
                                <div class="relative">
                                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">LKR</span>
                                  <input type="number"
                                         v-model.number="facility.pricePerDay"
                                         step="0.01" min="0"
                                         class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                         placeholder="0.00" />
                                </div>
                              </div>

                              <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Price per Month</label>
                                <div class="relative">
                                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">LKR</span>
                                  <input type="number"
                                         v-model.number="facility.pricePerMonth"
                                         step="0.01" min="0"
                                         class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                         placeholder="0.00" />
                                </div>
                              </div>

                              <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Price per Year</label>
                                <div class="relative">
                                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">LKR</span>
                                  <input type="number"
                                         v-model.number="facility.pricePerYear"
                                         step="0.01" min="0"
                                         class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                         placeholder="0.00" />
                                </div>
                              </div>
                            </div>

                            <!-- Price Display -->
                            <div class="mt-3 flex flex-wrap gap-1">
                              <span v-if="facility.pricePerHour > 0"
                                class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                LKR {{ facility.pricePerHour }}/hr
                              </span>
                              <span v-if="facility.pricePerDay > 0"
                                class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                LKR {{ facility.pricePerDay }}/day
                              </span>
                              <span v-if="facility.pricePerMonth > 0"
                                class="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                LKR {{ facility.pricePerMonth }}/mo
                              </span>
                              <span v-if="facility.pricePerYear > 0"
                                class="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                LKR {{ facility.pricePerYear }}/yr
                              </span>
                              <span v-if="!facility.pricePerHour && !facility.pricePerDay && !facility.pricePerMonth && !facility.pricePerYear"
                                class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                No prices set
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- Hot Desk & Dedicated Desk - Full pricing options -->
                        <div v-if="product.type === 'Hot Desk' || product.type === 'Dedicated Desk'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div v-for="(facility, index) in product.additionalFacilities" :key="index"
                               class="bg-white border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                            <!-- Card Header -->
                            <div class="flex items-center justify-between mb-3">
                              <div class="flex items-center">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                </div>
                                <h4 class="font-medium text-gray-900 text-sm">{{ facility.name }}</h4>
                              </div>
                              <button type="button" @click="removeAdditionalFacility(index, idx)"
                                class="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-all duration-200">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            <!-- Pricing Inputs - All time periods -->
                            <div class="grid grid-cols-2 gap-3">
                              <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Price per Hour</label>
                                <div class="relative">
                                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">LKR</span>
                                  <input type="number"
                                         v-model.number="facility.pricePerHour"
                                         step="0.01" min="0"
                                         class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                         placeholder="0.00" />
                                </div>
                              </div>

                              <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Price per Day</label>
                                <div class="relative">
                                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">LKR</span>
                                  <input type="number"
                                         v-model.number="facility.pricePerDay"
                                         step="0.01" min="0"
                                         class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                         placeholder="0.00" />
                                </div>
                              </div>

                              <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Price per Month</label>
                                <div class="relative">
                                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">LKR</span>
                                  <input type="number"
                                         v-model.number="facility.pricePerMonth"
                                         step="0.01" min="0"
                                         class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                         placeholder="0.00" />
                                </div>
                              </div>

                              <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Price per Year</label>
                                <div class="relative">
                                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">LKR</span>
                                  <input type="number"
                                         v-model.number="facility.pricePerYear"
                                         step="0.01" min="0"
                                         class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                                         placeholder="0.00" />
                                </div>
                              </div>
                            </div>

                            <!-- Price Display -->
                            <div class="mt-3 flex flex-wrap gap-1">
                              <span v-if="facility.pricePerHour > 0"
                                class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                LKR {{ facility.pricePerHour }}/hr
                              </span>
                              <span v-if="facility.pricePerDay > 0"
                                class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                LKR {{ facility.pricePerDay }}/day
                              </span>
                              <span v-if="facility.pricePerMonth > 0"
                                class="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                LKR {{ facility.pricePerMonth }}/mo
                              </span>
                              <span v-if="facility.pricePerYear > 0"
                                class="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                LKR {{ facility.pricePerYear }}/yr
                              </span>
                              <span v-if="!facility.pricePerHour && !facility.pricePerDay && !facility.pricePerMonth && !facility.pricePerYear"
                                class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                No prices set
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="product.additionalFacilities.length === 0 && !isLoadingFacilities && !facilitiesError" class="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                        <div class="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <p class="text-sm font-medium text-gray-700">No premium facilities selected</p>
                        <p class="text-xs text-gray-500 mt-1">Select from the dropdown above to include paid amenities</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Product Status -->
                <div v-if="product.type">
                  <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiToggleSwitch" />
                    </svg>
                    Product Status
                  </h2>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Status <span class="text-red-500">*</span>
                      </label>
                      
                      <div class="relative dropdown-container">
                        <div @click="toggleDropdown('status')" class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 cursor-pointer bg-white flex items-center">
                          <span class="text-gray-900 leading-5 h-5 flex items-center truncate">{{ getStatusLabel(product.status) }}</span>
                        </div>

                        <!-- Dropdown Options -->
                        <div v-if="dropdownStates.status" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div class="p-2">
                            <div v-for="option in statusOptions" :key="option.value" @click="selectStatus(option.value, idx)" class="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900">
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
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons for each form -->
            <div class="flex items-center justify-between pt-8 border-t border-gray-200">
              <!-- Left side: Add Another Product (show only on the last form) -->
              <div>
                <button v-if="idx === products.length - 1" type="button" @click="addAnotherProduct"
                  :disabled="!canAddAnotherProduct"
                  :class="[
                    'px-6 py-3 border-2 rounded-xl transition-all duration-200 flex items-center space-x-3 font-medium shadow-sm hover:shadow-md',
                    canAddAnotherProduct 
                      ? 'border-green-600 text-green-600 hover:bg-greeen-50 hover:border-green-700' 
                      : 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                  ]">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Another Product</span>
                </button>
                <!-- Helper text when button is disabled -->
                <div v-if="idx === products.length - 1 && !canAddAnotherProduct" class="mt-2 text-xs text-gray-500">
                  Complete all required fields to add another product
                </div>
              </div>
              <!-- Right side: Create Product (only on last form) -->
              <div class="flex items-center gap-4">
                <button v-if="idx === products.length - 1" type="submit"
                  :disabled="isCreatingProduct"
                  :class="[
                    'px-6 py-3 rounded-lg transition-colors flex items-center space-x-2',
                    isCreatingProduct 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  ]"
                  class="text-white">
                  <svg v-if="isCreatingProduct" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ isCreatingProduct ? 'Creating...' : 'Create Product' }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
  <!-- Removed standalone Add Another Product button, now inline with Create Product -->
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

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
         @click="closeSuccessModal">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4" @click.stop>
        <!-- Success Icon with circular background like the image -->
        <div class="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <!-- Success Title -->
        <h3 class="text-2xl font-bold text-gray-900 text-center mb-4">
          Success!
        </h3>
        
        <!-- Success Message -->
        <p class="text-gray-600 text-center mb-8 leading-relaxed">
          Product{{ createdProductsCount > 1 ? 's' : '' }} created successfully!
        </p>
        
        <!-- Action Buttons - horizontal layout in one line -->
        <div class="flex space-x-3">
          <button @click="closeSuccessModalAndRedirect" 
            class="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Go to Products
          </button>
          <button @click="closeSuccessModal" 
            class="flex-1 px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Add Another
          </button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
         @click="closeErrorModal">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4" @click.stop>
        <!-- Error Icon with circular background -->
        <div class="flex items-center justify-center w-20 h-20 mx-auto bg-red-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <!-- Error Title -->
        <h3 class="text-2xl font-bold text-gray-900 text-center mb-4">
          Error!
        </h3>
        
        <!-- Error Message -->
        <p class="text-gray-600 text-center mb-8 leading-relaxed">
          {{ errorMessage }}
        </p>
        
        <!-- Action Buttons - vertical layout -->
        <div class="flex space-x-3">
          <button @click="closeErrorModal" 
                  class="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            Try Again
          </button>
          <button @click="closeErrorModal" 
                  class="flex-1 px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { locationApi, facilityApi, productApi } from '@/services/api'
import { 
  mdiOfficeBuilding, 
  mdiPackageVariant, 
  mdiCurrencyUsd, 
  mdiClockOutline, 
  mdiCog,
  mdiToggleSwitch
} from '@mdi/js'

const router = useRouter()

// Type definitions
type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

type DayHours = {
  [key in DayOfWeek]: { start: string; end: string }
}

// Days of the week
const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Available locations - Fetch from API
const locations = ref<any[]>([])
const isLoadingLocations = ref(false)
const locationError = ref('')

// Available facilities - Fetch from API
const availableFacilities = ref<any[]>([])
const isLoadingFacilities = ref(false)
const facilitiesError = ref('')

// Loading states for product creation
const isCreatingProduct = ref(false)

// Multi-select dropdown states - now per product
const showDefaultDropdown = ref<boolean[]>([])
const showAdditionalDropdown = ref<boolean[]>([])

// Dropdown states for rotating arrows
const dropdownStates = ref({
  location: false,
  productType: false,
  status: false
})

// Time picker state
const showTimePicker = ref(false)
const selectedHour = ref(7)
const selectedMinute = ref(0)
const selectedPeriod = ref('AM')
const timePickerMode = ref<'hour' | 'minute'>('hour')
const currentTimeField = ref<{day: DayOfWeek, type: 'start' | 'end'} | null>(null)

// Modal state for success and error
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const createdProductsCount = ref(0)

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
    defaultFacilities: [] as number[],
    additionalFacilities: [] as Array<{
      id: number
      name: string
      pricePerHour: number
      pricePerDay: number
      pricePerMonth: number
      pricePerYear: number
    }>,
    status: 'active'
  }
])

// Per-form validation state
const showValidation = ref([false])

// Computed properties

// Check if we can add another product (current product must be valid)
const canAddAnotherProduct = computed(() => {
  if (products.value.length === 0) return false
  
  // Get the last product (current one being filled)
  const currentProduct = products.value[products.value.length - 1]
  
  // Basic validation
  const basicValid = !!(
    currentProduct.locationId && 
    currentProduct.type && 
    currentProduct.name && 
    currentProduct.name.trim() && 
    currentProduct.maxSeatingCapacity > 0 &&
    currentProduct.description &&
    currentProduct.description.trim() &&
    currentProduct.openDays && 
    currentProduct.openDays.length > 0 &&
    // Check that all selected days have valid hours
    currentProduct.openDays.every((day: DayOfWeek) => 
      currentProduct.dayHours[day] && 
      currentProduct.dayHours[day].start && 
      currentProduct.dayHours[day].end
    )
  )

  if (!basicValid) return false

  // Product-specific pricing validation
  switch (currentProduct.type) {
    case 'Meeting Room':
      return currentProduct.pricePerHour > 0
    case 'Hot Desk':
      return currentProduct.pricePerHour > 0 && currentProduct.pricePerDay > 0
    case 'Dedicated Desk':
      return currentProduct.pricePerMonth > 0 && currentProduct.pricePerYear > 0
    default:
      return false
  }
})

// Helper functions for per-product facility management
const getAvailableDefaultFacilities = (productIndex: number) => {
  // Return all facilities instead of filtering out selected ones
  return availableFacilities.value
}

const getAvailableAdditionalFacilities = (productIndex: number) => {
  // Filter out facilities that are already selected as default facilities
  const defaultFacilityIds = products.value[productIndex].defaultFacilities
  return availableFacilities.value.filter(facility => !defaultFacilityIds.includes(facility.id))
}

const toggleDefaultDropdown = (productIndex: number) => {
  // Only open the dropdown if it's closed, don't close it when clicking the button
  if (!showDefaultDropdown.value[productIndex]) {
    showDefaultDropdown.value[productIndex] = true
  }
  // If already open, do nothing - user must use "Done" button to close
}

const toggleAdditionalDropdown = (productIndex: number) => {
  // Only open the dropdown if it's closed, don't close it when clicking the button
  if (!showAdditionalDropdown.value[productIndex]) {
    showAdditionalDropdown.value[productIndex] = true
  }
  // If already open, do nothing - user must use "Done" button to close
}

// Multi-select dropdown methods
const updateDefaultFacilities = (event: any, productIndex: number) => {
  const facilityId = parseInt(event.target.value)
  if (event.target.checked) {
    if (!products.value[productIndex].defaultFacilities.includes(facilityId)) {
      products.value[productIndex].defaultFacilities.push(facilityId)
    }
  } else {
    const index = products.value[productIndex].defaultFacilities.indexOf(facilityId)
    if (index > -1) {
      products.value[productIndex].defaultFacilities.splice(index, 1)
    }
  }
}

const updateAdditionalFacilities = (event: any, productIndex: number) => {
  const facilityId = parseInt(event.target.value)
  if (event.target.checked) {
    // Add facility if not already present
    if (!products.value[productIndex].additionalFacilities.some(f => f.id === facilityId)) {
      const facility = availableFacilities.value.find(f => f.id === facilityId)
      if (facility) {
        products.value[productIndex].additionalFacilities.push({
          id: facilityId,
          name: facility.name,
          pricePerHour: 0,
          pricePerDay: 0,
          pricePerMonth: 0,
          pricePerYear: 0
        })
      }
    }
  } else {
    // Remove facility
    const index = products.value[productIndex].additionalFacilities.findIndex(f => f.id === facilityId)
    if (index > -1) {
      products.value[productIndex].additionalFacilities.splice(index, 1)
    }
  }
}

const clearDefaultFacilities = (productIndex: number) => {
  products.value[productIndex].defaultFacilities = []
}

const clearAdditionalFacilities = (productIndex: number) => {
  products.value[productIndex].additionalFacilities = []
}

const removeDefaultFacility = (index: number, productIndex: number) => {
  products.value[productIndex].defaultFacilities.splice(index, 1)
}

const removeAdditionalFacility = (index: number, productIndex: number) => {
  products.value[productIndex].additionalFacilities.splice(index, 1)
}

// Time picker helper functions
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
  const currentTime = products.value[0].dayHours[day][type]
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
    products.value[0].dayHours[day][type] = time24
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
    products.value.forEach(product => {
      if (product.dayHours && product.dayHours[day]) {
        product.dayHours[day] = { start: '09:00', end: '17:00' }
      }
    })
  }
}

// Watchers - Remove company watcher since we removed company selection
// Methods

// Location synchronization method
const syncLocationToAllProducts = () => {
  const selectedLocationId = products.value[0].locationId
  // Sync location to all products
  products.value.forEach((product, index) => {
    if (index > 0) {
      product.locationId = selectedLocationId
    }
  })
}

// Dropdown control functions
const toggleDropdown = (dropdown: string) => {
  dropdownStates.value[dropdown as keyof typeof dropdownStates.value] = true
}

const closeDropdown = (dropdown: string) => {
  setTimeout(() => {
    dropdownStates.value[dropdown as keyof typeof dropdownStates.value] = false
  }, 150)
}

// Status Options
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

// Product Type Options
const productTypeOptions = [
  { value: 'Meeting Room', label: 'Meeting Room' },
  { value: 'Hot Desk', label: 'Hot Desk' },
  { value: 'Dedicated Desk', label: 'Dedicated Desk' }
]

// Dropdown label functions
const getStatusLabel = (value: string) => {
  const option = statusOptions.find(opt => opt.value === value)
  return option ? option.label : 'Active'
}

const getLocationLabel = (value: string) => {
  if (!value) return 'Choose a location'
  const location = locations.value.find(loc => loc.id === value)
  return location ? location.name : 'Choose a location'
}

const getProductTypeLabel = (value: string) => {
  if (!value) return 'Select product type'
  const option = productTypeOptions.find(opt => opt.value === value)
  return option ? option.label : 'Select product type'
}

// Dropdown select functions
const selectStatus = (value: string, productIndex: number) => {
  products.value[productIndex].status = value
  closeDropdown('status')
}

const selectLocation = (value: string, productIndex: number) => {
  products.value[productIndex].locationId = value
  syncLocationToAllProducts()
  closeDropdown('location')
}

const selectProductType = (value: string, productIndex: number) => {
  products.value[productIndex].type = value
  onProductTypeChange(productIndex)
  closeDropdown('productType')
}

// Fetch locations from API
const fetchLocations = async () => {
  isLoadingLocations.value = true
  locationError.value = ''

  try {
    const response = await locationApi.getAllLocations()

    if (response.success && response.data) {
      locations.value = response.data.filter((location: any) => location.status === 'active')
    } else {
      locationError.value = response.message || 'Failed to load locations'
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    locationError.value = 'An unexpected error occurred while loading locations'
  } finally {
    isLoadingLocations.value = false
  }
}

// Fetch facilities from API
const fetchFacilities = async () => {
  isLoadingFacilities.value = true
  facilitiesError.value = ''

  try {
    const response = await facilityApi.getAllFacilities()

    if (response.success && response.data) {
      // Transform the facilities data to match our expected format
      availableFacilities.value = response.data
        .filter((facility: any) => facility.status === 'active')
        .map((facility: any) => ({
          id: facility.id,
          name: facility.name,
          description: facility.description || `Professional ${facility.name.toLowerCase()} facility`,
          icon: facility.Icon || facility.iconSVG || null
        }))
    } else {
      facilitiesError.value = response.message || 'Failed to load facilities'
    }
  } catch (error) {
    console.error('Error fetching facilities:', error)
    facilitiesError.value = 'An unexpected error occurred while loading facilities'
  } finally {
    isLoadingFacilities.value = false
  }
}

const onProductTypeChange = (index: number) => {
  // Reset pricing fields when product type changes - only for the specific product
  if (products.value[index]) {
    products.value[index].pricePerHour = 0
    products.value[index].pricePerDay = 0
    products.value[index].pricePerWeek = 0
    products.value[index].pricePerMonth = 0
    products.value[index].pricePerYear = 0
  }
}

const handleImageUpload = (event: any, productIndex: number) => {
  const files = event.target.files
  if (!files) return

  // Validate total number of images for this specific product
  const currentImages = products.value[productIndex].images.length
  const newFilesCount = files.length
  const maxImages = 8

  if (currentImages + newFilesCount > maxImages) {
    alert(`You can only upload up to ${maxImages} images. You currently have ${currentImages} images.`)
    return
  }

  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(`File "${file.name}" is not a valid image file.`)
      continue
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
      continue
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        // Store the base64 data URL - the API will convert this to proper files
        products.value[productIndex].images.push(e.target.result as string)
        console.log(`Image ${i + 1} added for product ${productIndex + 1}:`, file.name, 'Size:', file.size, 'bytes')
      }
    }
    reader.onerror = () => {
      alert(`Failed to read file "${file.name}".`)
    }
    reader.readAsDataURL(file)
  }

  // Clear the input so the same file can be selected again if needed
  event.target.value = ''
}

const removeImage = (index: number, productIndex: number) => {
  products.value[productIndex].images.splice(index, 1)
}

// Helper function to get facility name by ID
const getFacilityName = (facilityId: number) => {
  const facility = availableFacilities.value.find(f => f.id === facilityId)
  return facility ? facility.name : `Facility ${facilityId}`
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
    defaultFacilities: [] as number[],
    additionalFacilities: [] as Array<{
      id: number
      name: string
      pricePerHour: number
      pricePerDay: number
      pricePerMonth: number
      pricePerYear: number
    }>,
    status: 'active'
  }]
  // reset per-form validation state
  showValidation.value = [false]
  // Reset dropdown states
  showDefaultDropdown.value = [false]
  showAdditionalDropdown.value = [false]
}

const addAnotherProduct = () => {
  // Get the location from the first product
  const firstProductLocation = products.value[0]?.locationId || ''
  
  products.value.push({
    locationId: firstProductLocation, // Inherit location from first product
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
    defaultFacilities: [] as number[],
    additionalFacilities: [] as Array<{
      id: number
      name: string
      pricePerHour: number
      pricePerDay: number
      pricePerMonth: number
      pricePerYear: number
    }>,
    status: 'active'
  })
  showValidation.value.push(false)
  // Initialize dropdown states for the new product
  showDefaultDropdown.value.push(false)
  showAdditionalDropdown.value.push(false)
}

const removeProductForm = (index: number) => {
  if (products.value.length > 1) {
    products.value.splice(index, 1)
    showValidation.value.splice(index, 1)
    showDefaultDropdown.value.splice(index, 1)
    showAdditionalDropdown.value.splice(index, 1)
  }
}

// validate a single product object and return boolean
const validateProduct = (product: any) => {
  const basicValidation = !!(
    product.locationId && 
    product.type && 
    product.name && 
    product.name.trim() && 
    product.maxSeatingCapacity > 0 && 
    product.openDays && 
    product.openDays.length > 0 &&
    // Check that all selected days have valid hours
    product.openDays.every((day: DayOfWeek) => 
      product.dayHours[day] && 
      product.dayHours[day].start && 
      product.dayHours[day].end
    )
  )

  if (!basicValidation) return false

  // Product-specific pricing validation
  switch (product.type) {
    case 'Meeting Room':
      return product.pricePerHour > 0
    case 'Hot Desk':
      return product.pricePerDay > 0
    case 'Dedicated Desk':
      return product.pricePerMonth > 0 && product.pricePerYear > 0
    default:
      return false
  }
}

// Modal control functions
const showSuccess = (message: string, productCount: number = 1) => {
  successMessage.value = message
  createdProductsCount.value = productCount
  showSuccessModal.value = true
}

const showError = (message: string) => {
  errorMessage.value = message
  showErrorModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  successMessage.value = ''
  createdProductsCount.value = 0
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

const closeSuccessModalAndRedirect = () => {
  closeSuccessModal()
  router.push('/products')
}

const saveProduct = async (idx: number) => {
  const lastIndex = products.value.length - 1
  isCreatingProduct.value = true

  try {
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

      // All forms valid - create all products
      for (const product of products.value) {
        await createProductAPI(product)
      }
      showSuccess(
        `Successfully created ${products.value.length} product${products.value.length > 1 ? 's' : ''}. You can now view them in the products list or add more products.`,
        products.value.length
      )
      resetForm()
      return
    }

    // Otherwise validate single form
    const product = products.value[idx]
    showValidation.value[idx] = true
    const valid = validateProduct(product)
    if (!valid) return

    // Create single product
    await createProductAPI(product)
    showSuccess(
      `Successfully created "${product.name}".`,
      1
    )
    // remove or reset the form after creation - here we reset single form to blank
    if (products.value.length === 1) {
      resetForm()
    } else {
      removeProductForm(idx)
    }
  } catch (error) {
    console.error('Error creating product:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    showError(`Failed to create product: ${errorMessage}. Please check your input and try again.`)
  } finally {
    isCreatingProduct.value = false
  }
}

// Helper function to call the API
const createProductAPI = async (product: any) => {
  // Calculate general opening/closing times from the selected days
  let earliestStart = '23:59'
  let latestEnd = '00:00'
  
  // Find earliest start and latest end from the selected open days
  product.openDays.forEach((day: DayOfWeek) => {
    if (product.dayHours[day]) {
      if (product.dayHours[day].start < earliestStart) {
        earliestStart = product.dayHours[day].start
      }
      if (product.dayHours[day].end > latestEnd) {
        latestEnd = product.dayHours[day].end
      }
    }
  })
  
  // If no days selected, use default times
  if (product.openDays.length === 0) {
    earliestStart = '09:00'
    latestEnd = '17:00'
  }

  const productData: any = {
    LocationId: product.locationId,
    ProductType: product.type,
    ProductName: product.name,
    Description: product.description,
    MaxSeatingCapacity: product.maxSeatingCapacity,
    OpeningTime: earliestStart,
    ClosingTime: latestEnd,
    DefaultFacilities: product.defaultFacilities,
    AdditionalFacilities: product.additionalFacilities,
    Images: product.images, // This will be base64 data URLs
    IsActive: product.status === 'active', // Convert status to boolean
    OperationTime: {
      IsMonday: product.openDays.includes('Monday'),
      IsTuesday: product.openDays.includes('Tuesday'),
      IsWednesday: product.openDays.includes('Wednesday'),
      IsThursday: product.openDays.includes('Thursday'),
      IsFriday: product.openDays.includes('Friday'),
      IsSaturday: product.openDays.includes('Saturday'),
      IsSunday: product.openDays.includes('Sunday'),
      MondayStart: product.dayHours.Monday.start,
      MondayEnd: product.dayHours.Monday.end,
      TuesdayStart: product.dayHours.Tuesday.start,
      TuesdayEnd: product.dayHours.Tuesday.end,
      WednesdayStart: product.dayHours.Wednesday.start,
      WednesdayEnd: product.dayHours.Wednesday.end,
      ThursdayStart: product.dayHours.Thursday.start,
      ThursdayEnd: product.dayHours.Thursday.end,
      FridayStart: product.dayHours.Friday.start,
      FridayEnd: product.dayHours.Friday.end,
      SaturdayStart: product.dayHours.Saturday.start,
      SaturdayEnd: product.dayHours.Saturday.end,
      SundayStart: product.dayHours.Sunday.start,
      SundayEnd: product.dayHours.Sunday.end
    }
  }

  // Debug log for status and active state
  console.log('Product status:', product.status, '→ IsActive:', product.status === 'active')
  
  // Debug log for images
  console.log('Creating product with', product.images.length, 'images')
  if (product.images.length > 0) {
    console.log('Image data preview:', product.images.map((img: string, idx: number) => ({
      index: idx,
      size: img.length,
      type: img.substring(5, img.indexOf(';'))
    })))
  }

  // Add pricing based on product type
  if (product.type === 'Meeting Room') {
    productData.PricePerHour = product.pricePerHour
  } else if (product.type === 'Hot Desk') {
    productData.PricePerDay = product.pricePerDay
  } else if (product.type === 'Dedicated Desk') {
    productData.PricePerMonth = product.pricePerMonth
    productData.PricePerYear = product.pricePerYear
  }

  const response = await productApi.createProduct(productData)
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to create product')
  }

  return response
}
// ...existing code...

// Lifecycle
onMounted(() => {
  fetchLocations()
  fetchFacilities()
  
  // Initialize dropdown states for the first product
  showDefaultDropdown.value = [false]
  showAdditionalDropdown.value = [false]
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    // Don't close facility dropdowns if clicking within them or their triggers
    if (!target.closest('.facility-dropdown') && !target.closest('.facility-dropdown-trigger')) {
      showDefaultDropdown.value.fill(false)
      showAdditionalDropdown.value.fill(false)
    }
    
    // Close regular dropdowns when clicking outside
    if (!target.closest('.dropdown-container')) {
      dropdownStates.value.location = false
      dropdownStates.value.productType = false
      dropdownStates.value.status = false
    }
  })
})
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
  color: rgb(9, 48, 132);
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



/* Dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Custom checkbox styling */
input[type="checkbox"] {
  transition: all 0.2s ease;
  accent-color: #16a34a; /* Green-600 for fill color */
}

input[type="checkbox"]:checked {
  background-color: currentColor;
  border-color: currentColor;
}

/* Dropdown z-index fix */
.dropdown-content {
  z-index: 50;

}

/* Improved focus states */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}

.focus\:ring-offset-2:focus {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--tw-ring-color);
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
