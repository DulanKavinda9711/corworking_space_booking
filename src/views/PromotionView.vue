<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center space-x-2 md:sticky md:top-0 z-50">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path :d="mdiBullhorn" />
            </svg>
            <span class="text-sm font-medium text-green-700">
              Total Promotions:
              <span class="font-bold text-green-800">{{ promotions.length }}</span>
            </span>
          </div>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path :d="mdiPlus" />
          </svg>
          <span>Create Promotion</span>
        </button>
      </div>

      <!-- Promotions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="promotion in promotions"
          :key="promotion.id"
          class="bg-white rounded-xl shadow-card overflow-hidden"
        >
          <div class="aspect-video bg-gray-100 flex items-center justify-center">
            <img
              :src="promotion.image"
              :alt="promotion.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ promotion.name }}</h3>
            <p v-if="promotion.description" class="text-sm text-gray-600 mb-2">{{ promotion.description }}</p>
            <p class="text-sm text-gray-500 mb-4">{{ formatDate(promotion.createdAt) }}</p>
            <div class="flex space-x-2">
              <button
                @click="viewPromotion(promotion)"
                class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>View</span>
              </button>
              <button
                @click="editPromotion(promotion)"
                class="flex-1 px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Edit</span>
              </button>
              <button
                @click="confirmDeletePromotion(promotion)"
                class="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="promotions.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No promotions found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first promotion.</p>
        <button
          @click="showCreateModal = true"
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Promotion
        </button>
      </div>
    </div>

    <!-- Create Promotion Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200 bg-green-100 rounded-t-xl">
          <div class="flex items-center justify-between ">
            <h2 class="text-xl font-semibold text-green-900">Create Promotion</h2>
            <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="confirmCreate" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Promotion Name</label>
            <input
              type="text"
              v-model="newPromotion.name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              placeholder="Enter promotion name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="newPromotion.description"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 resize-vertical"
              placeholder="Enter promotion description"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                @change="onImageSelected"
                class="hidden"
              />
              <div v-if="!newPromotion.image && !isImageLoading" @click="triggerImageInput" class="cursor-pointer">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="mt-2 text-sm text-gray-600">Click to upload image</p>
                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              <div v-else-if="isImageLoading" class="flex flex-col items-center">
                <svg class="animate-spin h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-2 text-sm text-gray-600">Loading image...</p>
              </div>
              <div v-else class="space-y-2">
                <img :src="newPromotion.image" class="max-h-32 mx-auto rounded" />
                <button
                  type="button"
                  @click="removeImage"
                  class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  title="Remove image"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiDelete" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeCreateModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!newPromotion.name.trim() || !newPromotion.image || isCreating || isImageLoading"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <svg v-if="isCreating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isCreating ? 'Creating...' : isImageLoading ? 'Loading image...' : 'Create Promotion' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Promotion Modal -->
    <div v-if="showEditModal && promotionToEdit" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200 bg-yellow-100 rounded-t-xl">
          <div class="flex items-center justify-between ">
            <h2 class="text-xl font-semibold text-yellow-900">Edit Promotion</h2>
            <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="confirmEdit" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Promotion Name</label>
            <input
              type="text"
              v-model="editPromotionForm.name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
              placeholder="Enter promotion name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="editPromotionForm.description"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 resize-vertical"
              placeholder="Enter promotion description"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                @change="onImageSelected"
                class="hidden"
              />
              <div v-if="!editPromotionForm.image && !isImageLoading" @click="triggerImageInput" class="cursor-pointer">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="mt-2 text-sm text-gray-600">Click to upload image</p>
                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              <div v-else-if="isImageLoading" class="flex flex-col items-center">
                <svg class="animate-spin h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-2 text-sm text-gray-600">Loading image...</p>
              </div>
              <div v-else class="space-y-2">
                <img :src="editPromotionForm.image" class="max-h-32 mx-auto rounded" />
                <button
                  type="button"
                  @click="removeEditImage"
                  class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  title="Remove image"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="mdiDelete" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeEditModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!editPromotionForm.name.trim() || !editPromotionForm.image || isEditing || isImageLoading"
              class="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <svg v-if="isEditing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isEditing ? 'Updating...' : isImageLoading ? 'Loading image...' : 'Update Promotion' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Promotion Modal -->
    <div v-if="showViewModal && selectedPromotion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ selectedPromotion.name }}</h2>
            <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <img
              :src="selectedPromotion.image"
              :alt="selectedPromotion.name"
              class="w-full max-h-96 object-contain rounded-lg"
            />
          </div>
          <div v-if="selectedPromotion.description" class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p class="text-gray-700">{{ selectedPromotion.description }}</p>
          </div>
          <div class="text-sm text-gray-500">
            Created on {{ formatDate(selectedPromotion.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeDeleteModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">Delete Promotion</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 text-center">
              Are you sure you want to delete this promotion permanently? This action cannot be undone.
            </p>
            <div v-if="promotionToDelete" class="mt-4 p-3 bg-gray-50 rounded-lg text-gray-900">
              <div class="text-sm space-y-1">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                      <path :d="mdiBullhorn" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ promotionToDelete.name }}</div>
                    <div class="text-gray-500">Created: {{ formatDate(promotionToDelete.createdAt) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-xs text-red-700">
                <strong>Warning:</strong> This will permanently remove the promotion from the system.
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center pt-4 space-x-4">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deletePromotion"
              :disabled="isDeleting"
              class="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isDeleting ? 'Deleting...' : 'Delete Promotion' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6 text-center">
          <div class="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-100 mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
          <p class="text-gray-600 mb-6">Promotion created successfully!</p>
          <button
            @click="closeSuccessModal"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
    mdiBullhorn,
  mdiPlus,
  mdiDelete
} from '@mdi/js'

// Types
interface Promotion {
  id: string
  name: string
  description?: string
  image: string
  createdAt: string
}

// State
const showCreateModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const showEditModal = ref(false)
const selectedPromotion = ref<Promotion | null>(null)
const promotionToDelete = ref<Promotion | null>(null)
const promotionToEdit = ref<Promotion | null>(null)
const isDeleting = ref(false)
const isCreating = ref(false)
const isEditing = ref(false)

// Promotions data
const promotions = ref<Promotion[]>([])

// New promotion form
const newPromotion = ref({
  name: '',
  description: '',
  image: ''
})

// Edit promotion form
const editPromotionForm = ref({
  name: '',
  description: '',
  image: ''
})

const isImageLoading = ref(false)

// Template ref for image input
const imageInput = ref<HTMLInputElement>()

// Methods
const onImageSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    isImageLoading.value = true
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      // Determine which form to update based on which modal is open
      if (showCreateModal.value) {
        newPromotion.value.image = imageData
      } else if (showEditModal.value) {
        editPromotionForm.value.image = imageData
      }
      isImageLoading.value = false
    }
    reader.onerror = () => {
      alert('Error reading image file')
      isImageLoading.value = false
    }
    reader.readAsDataURL(file)
  }
}

const triggerImageInput = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

const removeImage = () => {
  newPromotion.value.image = ''
  isImageLoading.value = false
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const removeEditImage = () => {
  editPromotionForm.value.image = ''
  isImageLoading.value = false
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const confirmCreate = async () => {
  // Enhanced validation
  if (!newPromotion.value.name.trim()) {
    alert('Please enter a promotion name')
    return
  }

  if (!newPromotion.value.image) {
    alert('Please select an image')
    return
  }

  if (isImageLoading.value) {
    alert('Please wait for the image to finish loading')
    return
  }

  // Prevent multiple submissions
  if (isCreating.value) {
    return
  }

  isCreating.value = true

  try {
    // Simulate creation delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create promotion with trimmed name and unique ID
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substr(2, 9)
    const promotion: Promotion = {
      id: `PROMO-${timestamp}-${randomSuffix}`,
      name: newPromotion.value.name.trim(),
      description: newPromotion.value.description.trim(),
      image: newPromotion.value.image,
      createdAt: new Date().toISOString()
    }

    // Add to promotions array using spread operator for better reactivity
    promotions.value = [...promotions.value, promotion]

    // Reset form immediately after successful creation
    newPromotion.value = { name: '', description: '', image: '' }
    isImageLoading.value = false
    if (imageInput.value) {
      imageInput.value.value = ''
    }

    // Close modal and show success
    showCreateModal.value = false
    showSuccessModal.value = true

    console.log('Promotion created successfully:', promotion)
  } catch (error) {
    console.error('Error creating promotion:', error)
    alert('Failed to create promotion. Please try again.')
  } finally {
    isCreating.value = false
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  // Don't reset form here anymore - handled in confirmCreate
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Ensure form is completely reset when success modal closes
  newPromotion.value = { name: '', description: '', image: '' }
  isImageLoading.value = false
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const editPromotion = (promotion: Promotion) => {
  promotionToEdit.value = promotion
  editPromotionForm.value = {
    name: promotion.name,
    description: promotion.description || '',
    image: promotion.image
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  promotionToEdit.value = null
  editPromotionForm.value = { name: '', description: '', image: '' }
  isImageLoading.value = false
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const confirmEdit = async () => {
  if (!promotionToEdit.value) return

  // Enhanced validation
  if (!editPromotionForm.value.name.trim()) {
    alert('Please enter a promotion name')
    return
  }

  if (!editPromotionForm.value.image) {
    alert('Please select an image')
    return
  }

  if (isImageLoading.value) {
    alert('Please wait for the image to finish loading')
    return
  }

  // Prevent multiple submissions
  if (isEditing.value) {
    return
  }

  isEditing.value = true

  try {
    // Simulate update delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update promotion
    const updatedPromotion: Promotion = {
      ...promotionToEdit.value,
      name: editPromotionForm.value.name.trim(),
      description: editPromotionForm.value.description.trim(),
      image: editPromotionForm.value.image,
      createdAt: promotionToEdit.value.createdAt // Keep original creation date
    }

    // Update in promotions array
    const index = promotions.value.findIndex(p => p.id === promotionToEdit.value!.id)
    if (index !== -1) {
      promotions.value[index] = updatedPromotion
      alert('Promotion updated successfully!')
    }

    // Close modal
    closeEditModal()
  } catch (error) {
    console.error('Error updating promotion:', error)
    alert('Failed to update promotion. Please try again.')
  } finally {
    isEditing.value = false
  }
}

const viewPromotion = (promotion: Promotion) => {
  selectedPromotion.value = promotion
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedPromotion.value = null
}

const confirmDeletePromotion = (promotion: Promotion) => {
  promotionToDelete.value = promotion
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  promotionToDelete.value = null
  isDeleting.value = false
}

const deletePromotion = async () => {
  if (!promotionToDelete.value) return

  isDeleting.value = true

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Remove promotion from the array
    const index = promotions.value.findIndex(p => p.id === promotionToDelete.value!.id)
    if (index !== -1) {
      promotions.value.splice(index, 1)
      alert('Promotion deleted successfully!')
    }
  } catch (error) {
    console.error('Error deleting promotion:', error)
    alert('Failed to delete promotion. Please try again.')
  } finally {
    closeDeleteModal()
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load promotions from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('promotions')
  if (saved) {
    promotions.value = JSON.parse(saved)
  }
})

// Save to localStorage whenever promotions change
watch(promotions, (newPromotions) => {
  try {
    localStorage.setItem('promotions', JSON.stringify(newPromotions))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}, { deep: true, immediate: false })
</script>