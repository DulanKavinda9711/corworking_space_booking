<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-end">
        <div class="flex items-center space-x-3">
          <!-- Edit button moved below form -->
        </div>
      </div>

      <!-- Settings Navigation -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in settingsTabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="tab.icon" />
                </svg>
                <span>{{ tab.label }}</span>
              </div>
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- General Settings -->
          <!-- <div v-if="activeTab === 'general'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    v-model="settings.general.companyName"
                    :readonly="!isEditMode"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    placeholder="Your Company Name"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    v-model="settings.general.contactInfo.phone"
                    :readonly="!isEditMode"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-200 group">
                    <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <svg class="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div class="mt-3">
                      <label for="logo-upload" class="cursor-pointer">
                        <span class="block text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">Click to upload logo</span>
                        <span class="block text-xs text-gray-500 mt-1">or drag and drop file here</span>
                        <span class="block text-xs text-gray-400 mt-2">PNG, JPG, JPEG • Max 5MB</span>
                      </label>
                      <input id="logo-upload" name="logo-upload" type="file" accept="image/*,image/jpeg,image/png,image/gif" class="sr-only" @change="handleLogoUpload" />
                    </div>
                  </div>
                  <div v-if="settings.general.logo" class="mt-4">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-sm font-medium text-gray-700">Uploaded Logo</span>
                      <button type="button" @click="removeLogo" class="text-sm text-red-600 hover:text-red-700 font-medium">
                        Remove
                      </button>
                    </div>
                    <div class="relative group inline-block">
                      <img :src="settings.general.logo" alt="Company logo" 
                           class="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200">
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <button type="button" @click="removeLogo" 
                                class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    v-model="settings.general.contactInfo.email"
                    :readonly="!isEditMode"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
                  <input
                    type="text"
                    v-model="settings.general.contactInfo.address"
                    :readonly="!isEditMode"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    placeholder="123 Business St, City, State 12345"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select v-model="settings.general.timezone" :disabled="!isEditMode" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black">
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select v-model="settings.general.currency" :disabled="!isEditMode" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                  <textarea
                    v-model="settings.general.cancellationPolicy"
                    :readonly="!isEditMode"
                    rows="3"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    placeholder="Enter your cancellation policy..."
                  ></textarea>
                </div>
                
              </div>
            </div>
          </div> -->

          <!-- Booking Settings -->
          <div v-if="activeTab === 'booking'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Booking Rules</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Max Advance Booking (days)</label>
                  <input
                    type="number"
                    v-model="settings.booking.maxAdvanceBooking"
                    :readonly="!isEditMode"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    min="1"
                    max="365"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Reschedule Limit</label>
                  <select v-model="settings.booking.rescheduleLimit" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black">
                    <option value="0">No rescheduling allowed</option>
                    <option value="1">One time only</option>
                    <option value="2">Up to 2 times</option>
                    <option value="3">Up to 3 times</option>
                    <option value="-1">Unlimited</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Cancellation Window (hours)</label>
                  <input
                    type="number"
                    v-model="settings.booking.cancellationWindow"
                    :readonly="!isEditMode"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    min="1"
                    max="72"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Grace Period (minutes)</label>
                  <input
                    type="number"
                    v-model="settings.booking.gracePeriod"
                    :readonly="!isEditMode"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    min="0"
                    max="60"
                  />
                  <p class="text-xs text-gray-500 mt-1">Late arrival grace period before booking is marked as no-show</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit/Save Controls -->
      <div class="flex justify-end space-x-3">
        <button
          v-if="!isEditMode"
          @click="isEditMode = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiPencil" />
          </svg>
          <span>Edit</span>
        </button>
        
        <div v-if="isEditMode" class="flex space-x-3">
          <button
            @click="cancelEdit"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiClose" />
            </svg>
            <span>Cancel</span>
          </button>
          
          <button
            @click="saveAllSettings"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiContentSave" />
            </svg>
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <!-- Save Confirmation -->
      <div v-if="showSaveMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path :d="mdiCheck" />
        </svg>
        <span>Settings saved successfully!</span>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { 
  mdiContentSave,
  mdiCog,
  mdiCalendarClock,
  mdiCheck,
  mdiPencil,
  mdiClose
} from '@mdi/js'

// State
const activeTab = ref('booking')
const showSaveMessage = ref(false)
const isEditMode = ref(false)

// Settings tabs
const settingsTabs = [
  // { key: 'general', label: 'General', icon: mdiCog },
  { key: 'booking', label: 'Booking Rules', icon: mdiCalendarClock }
]

// Settings data
const settings = ref({
  // general: {
  //   companyName: 'CoWork Space',
  //   logo: '',
  //   contactInfo: {
  //     phone: '+1 (555) 123-4567',
  //     email: 'contact@cowork.com',
  //     address: '123 Business St, City, State 12345'
  //   },
  //   timezone: 'UTC',
  //   currency: 'USD',
  //   cancellationPolicy: 'Bookings can be cancelled up to 24 hours before the scheduled time for a full refund.'
  // },
  booking: {
    maxAdvanceBooking: 30,
    rescheduleLimit: 1,
    cancellationWindow: 24,
    gracePeriod: 15
  }
})

// Methods
const saveAllSettings = () => {
  // In a real app, this would save to backend
  console.log('Saving settings:', settings.value)
  
  // Exit edit mode after saving
  isEditMode.value = false
  
  // Show success message
  showSaveMessage.value = true
  setTimeout(() => {
    showSaveMessage.value = false
  }, 3000)
}

// const handleLogoUpload = (event: Event) => {
//   const target = event.target as HTMLInputElement
//   const file = target.files?.[0]
//   if (file) {
//     // Validate file size (5MB max)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Logo file size must be less than 5MB')
//       return
//     }

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       alert('Please select a valid image file')
//       return
//     }

//     // In a real app, this would upload to a server
//     console.log('Logo file selected:', file.name)
//     // For demo purposes, create a temporary URL
//     const reader = new FileReader()
//     reader.onload = (e) => {
//       settings.value.general.logo = e.target?.result as string
//     }
//     reader.readAsDataURL(file)
//   }
// }

// const removeLogo = () => {
//   settings.value.general.logo = ''
// }

const cancelEdit = () => {
  isEditMode.value = false
  // In a real app, you might want to reset the form to original values here
}
</script>
