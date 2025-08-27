<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/companies" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Add New Company</h1>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-6xl mx-auto">
        <form @submit.prevent="saveCompany" class="space-y-6">
          <!-- Single Card with All Information -->
          <div class="bg-white rounded-xl shadow-card overflow-hidden">
            <div class="p-8 space-y-16">
              <!-- Company Details Section -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiOfficeBuilding" />
                  </svg>
                  Company Details
                </h2>
                
                <!-- 2x2 Grid for Company Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.name" required
                      :class="[
                        'w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900',
                        validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      ]"
                      placeholder="Enter company name" />
                    <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">{{ validationErrors.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration Number <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="form.registrationNumber" required
                      :class="[
                        'w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900',
                        validationErrors.registrationNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      ]"
                      placeholder="Enter registration number" />
                    <p v-if="validationErrors.registrationNumber" class="mt-1 text-sm text-red-600">{{ validationErrors.registrationNumber }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                    <input type="text" v-model="form.address"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter complete company address" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Company Logo Upload</label>
                    <div class="flex items-center space-x-4">
                      <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <button type="button"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Upload Logo
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Status Field -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select v-model="form.status"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div></div> <!-- Empty div for grid alignment -->
                </div>
              </div>

              <!-- Contact Details Section -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-12 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiAccount" />
                  </svg>
                  Contact Details
                </h2>
                
                <!-- 2x1 Grid for Contact Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contact Person Name</label>
                    <input type="text" v-model="form.contactPerson"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter contact person name" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input type="email" v-model="form.email"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter contact email address" />
                  </div>
                </div>
                
                <!-- Contact Phone Number -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contact Phone Number</label>
                    <input type="tel" v-model="form.phone"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                      placeholder="Enter contact phone number" />
                  </div>
                  <div></div> <!-- Empty div for grid alignment -->
                </div>
              </div>

              <!-- Action Buttons - Bottom Right -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <router-link to="/companies"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </router-link>
                <button type="submit"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create Company</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { mdiOfficeBuilding, mdiAccount } from '@mdi/js'

const router = useRouter()

// Form data - simplified to only include requested fields
const form = ref({
  name: '',
  registrationNumber: '',
  address: '',
  contactPerson: '',
  email: '',
  phone: '',
  status: 'active' as 'active' | 'inactive'
})

// Validation errors
const validationErrors = ref({
  name: '',
  registrationNumber: ''
})

// Form validation
const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && 
         form.value.registrationNumber.trim() !== ''
})

// Validate form and show errors
const validateForm = () => {
  validationErrors.value.name = form.value.name.trim() === '' ? 'Company name is required' : ''
  validationErrors.value.registrationNumber = form.value.registrationNumber.trim() === '' ? 'Business registration number is required' : ''
  
  return isFormValid.value
}

// Methods
const saveCompany = () => {
  // Clear previous validation errors
  validationErrors.value.name = ''
  validationErrors.value.registrationNumber = ''
  
  // Validate form
  if (!validateForm()) {
    return // Don't proceed if validation fails - errors are now shown inline
  }

  // Here you would typically send the data to your API
  console.log('Creating company:', form.value)
  
  // Show success message
  alert('Company created successfully!')
  
  // Navigate back to companies list
  router.push('/companies')
}
</script>
