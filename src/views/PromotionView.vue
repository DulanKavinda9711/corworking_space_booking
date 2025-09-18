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
              <span class="font-bold text-green-800">{{ filteredPromotions.length }}</span>
            </span>
          </div>
        <div class="flex items-center space-x-3">
          <!-- View Toggle Button -->
          <button @click="toggleViewMode"
            class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            :title="viewMode === 'tile' ? 'Switch to Table View' : 'Switch to Tile View'">
            <svg v-if="viewMode === 'tile'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
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
      </div>

      <!-- Promotions Content -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <!-- Search and Filters -->
        <div class="bg-white p-5 border b">
          <div class="flex items-end justify-between gap-6">
            <div class="flex-1 max-w-md">
              <label class="block text-sm font-medium text-gray-700 mb-2">Search Promotions</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search promotions by name or description..."
                  v-model="searchQuery"
                  class="pl-10 pr-4 py-2 w-150px border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500  text-gray-900"
                />
              </div>
            </div>
            <button
              @click="resetFilters"
              class="px-6 py-2 border border-gray-300 text-gray-100 rounded-lg hover:bg-green-700 transition-colors bg-green-600 whitespace-nowrap"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div v-if="viewMode === 'table'">
          <!-- Table -->
          <div class="overflow-x-auto border-b">
            <table class="min-w-full divide-y divide-gray-200 border b">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotion
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="promotion in filteredPromotions" :key="promotion.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          :src="promotion.image"
                          :alt="promotion.name"
                          class="h-10 w-10 rounded-lg object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ promotion.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-600 max-w-xs truncate">
                      {{ promotion.description || 'No description' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ formatDate(promotion.createdAt) }}</div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm font-medium w-48" @click.stop>
                    <div class="flex items-center justify-end space-x-2">
                      <button @click.stop="viewPromotion(promotion)"
                        class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center space-x-1"
                        title="View Promotion">
                        <span>View</span>
                      </button>
                      <button @click.stop="editPromotion(promotion)"
                        class="w-20 px-3 py-1 text-xs font-medium rounded-md transition-colors bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center justify-center space-x-1"
                        title="Edit Promotion">
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tile View -->
        <div v-else class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="promotion in filteredPromotions"
              :key="promotion.id"
              class="group relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <!-- Gradient overlay on hover -->
              <div class="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <!-- Card content -->
              <div class="relative">
                <!-- Image -->
                <div class="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    :src="promotion.image"
                    :alt="promotion.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <!-- Content -->
                <div class="p-4">
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 mb-2">
                    {{ promotion.name }}
                  </h3>
                  <p v-if="promotion.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
                    {{ promotion.description }}
                  </p>
                  <p class="text-xs text-gray-500 mb-4">{{ formatDate(promotion.createdAt) }}</p>

                  <!-- Action buttons -->
                  <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div class="flex items-center space-x-2">
                      <button @click.stop="viewPromotion(promotion)"
                        class="group/btn flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                        title="View Promotion">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button @click.stop="editPromotion(promotion)"
                        class="group/btn flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-yellow-50 text-gray-600 hover:text-yellow-600 transition-all duration-200 hover:scale-105"
                        title="Edit Promotion">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Subtle bottom accent -->
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <!-- <div v-if="filteredPromotions.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing {{ startItem }} to {{ endItem }} of {{ filteredPromotions.length }} results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button @click="previousPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                    page === currentPage
                      ? 'z-10 bg-green-50 border-green-500 text-green-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]">
                    {{ page }}
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div> -->

        <!-- Empty State -->
        <div v-if="filteredPromotions.length === 0" class="text-center py-12">
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
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
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
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
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
import { ref, onMounted, watch, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
    mdiBullhorn,
  mdiPlus,
  mdiPencil
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
const showSuccessModal = ref(false)
const showEditModal = ref(false)
const selectedPromotion = ref<Promotion | null>(null)
const promotionToEdit = ref<Promotion | null>(null)
const isCreating = ref(false)
const isEditing = ref(false)

// View mode and pagination
const viewMode = ref<'tile' | 'table'>('table')
const searchQuery = ref('')
// const currentPage = ref(1)
// const itemsPerPage = ref(12)

// Promotions data
const promotions = ref<Promotion[]>([])

// Computed properties for filtering and pagination
const filteredPromotions = computed(() => {
  if (!searchQuery.value.trim()) {
    return promotions.value
  }
  const query = searchQuery.value.toLowerCase()
  return promotions.value.filter(promotion =>
    promotion.name.toLowerCase().includes(query) ||
    (promotion.description && promotion.description.toLowerCase().includes(query))
  )
})

/*
const totalPages = computed(() => {
  return Math.ceil(filteredPromotions.value.length / itemsPerPage.value)
})

const paginatedPromotions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPromotions.value.slice(start, end)
})

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredPromotions.value.length)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push(-1) // ellipsis
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push(-1) // ellipsis
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push(-1) // ellipsis
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(-1) // ellipsis
      pages.push(total)
    }
  }

  return pages
})
*/

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
  editPromotionForm.value = { name: '', description: '', image:''}
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

// View mode and pagination methods
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'tile' ? 'table' : 'tile'
}

const resetFilters = () => {
  searchQuery.value = ''
  // currentPage.value = 1
}

// const previousPage = () => {
//   if (currentPage.value > 1) {
//     currentPage.value--
//   }
// }

// const nextPage = () => {
//   if (currentPage.value < totalPages.value) {
//     currentPage.value++
//   }
// }

// const goToPage = (page: number) => {
//   if (page > 0 && page <= totalPages.value) {
//     currentPage.value = page
//   }
// }

// Watch for search query changes to reset pagination
// watch(searchQuery, () => {
//   currentPage.value = 1
// })

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