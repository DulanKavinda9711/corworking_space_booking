<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 bg-gray-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-700 flex flex-col w-64"
      :class="[
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex items-center justify-between h-16 border-b border-gray-700 px-2">
        <router-link to="/dashboard" class="flex items-center justify-center w-full">
          <img src="/assets/logo1.png" alt="Logo" class="h-8 w-auto" />
        </router-link>
      </div>
      <nav class="mt-5 flex-1 overflow-y-auto">
        <div class="px-4">
          <router-link
            v-for="item in visibleMenuItems"
            :key="item.name"
            :to="item.path"
            class="flex items-center py-5 px-4 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors w-full"
            :class="[
              isActive(item.path) ? 'bg-green-600 text-white border-r-2 border-green-400' : '',
            ]"
            @click="closeSidebarOnMobile"
          >
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path :d="item.icon" />
            </svg>
            <span class="ml-3">{{ item.name }}</span>
          </router-link>
        </div>
      </nav>
    </aside>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" @click="closeSidebar"></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden lg:ml-0">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center">
            <button
              @click="toggleSidebar"
              class="p-2 rounded-md text-green-600 hover:text-green-800 hover:bg-green-100 lg:hidden transition-colors"
            >
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 class="text-2xl font-bold text-green-900 ml-4">{{ currentPageName }}</h1>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
              <button @click="showNotifications = !showNotifications" class="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg relative transition-colors">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="mdiIcons.mdiBell" />
                </svg>
                <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{ notificationCount }}
                </span>
              </button>
              
              <!-- Notifications Dropdown -->
              <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div class="p-4 border-b border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div v-for="notification in notifications" :key="notification.id" class="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getNotificationIconClass(notification.type)">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" :class="getNotificationIconColor(notification.type)">
                            <path :d="notification.icon" />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                        <p class="text-sm text-gray-500">{{ notification.message }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings -->
            <!-- <router-link to="/settings" class="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiIcons.mdiCog" />
              </svg>
            </router-link> -->

           

            <!-- User Menu -->
            <div class="relative">
              <button @click="showUserMenu = !showUserMenu" class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 hover:ring-2 hover:ring-green-300 transition-all">
                <img class="h-8 w-8 rounded-full border-2 border-green-200" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
              </button>
              
              <!-- User Dropdown -->
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div class="py-1">
                  <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Profile</router-link>
                  <!-- <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Settings</router-link> -->
                  <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 bg-gradient-to-r from-gray-200 to-gray-250 shadow-sm border-b border-gray-100 relative">
        <!-- Loading Overlay -->
        <div v-if="signingOut" class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div class="flex flex-col items-center space-y-4">
            <svg class="animate-spin h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-lg font-semibold text-gray-700">Signing out...</p>
          </div>
        </div>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissionsStore } from '@/stores/permissions'
import { useThemeStore } from '@/stores/theme'
import {
  mdiViewDashboard,
  mdiCalendarCheck,
  mdiAccountGroup,
  mdiCog,
  mdiMapMarker,
  mdiCreditCard,
  mdiAccountSettings,
  mdiShieldCheck,
  mdiChartLine,
  mdiHistory,
  mdiBell,
  mdiBookOpen,
  mdiCancel,
  mdiSeat,
  mdiBullhorn,
  mdiCheckCircle,
  mdiMessage,
  mdiWifi,
  mdiGoogleClassroom,
  mdiOffer,
  mdiTag
} from '@mdi/js'

const route = useRoute()
const router = useRouter()

// Sidebar state
const sidebarOpen = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const signingOut = ref(false)

// MDI Icons
const mdiIcons = {
  mdiViewDashboard,
  mdiCalendarCheck,
  mdiAccountGroup,
  mdiCog,
  mdiMapMarker,
  mdiCreditCard,
  mdiAccountSettings,
  mdiShieldCheck,
  mdiChartLine,
  mdiHistory,
  mdiBell,
  mdiBookOpen,
  mdiCancel,
  mdiBullhorn,
  mdiMessage
}

// Menu items with permission requirements
const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: mdiViewDashboard, color: 'text-green-600', permission: 'view_dashboard' },
  { name: 'Bookings', path: '/bookings', icon: mdiCalendarCheck, color: 'text-green-600', permission: 'view_bookings' },
  { name: 'Customers', path: '/customers', icon: mdiAccountGroup, color: 'text-purple-600', permission: 'view_customers' },
  { name: 'Messages', path: '/messages', icon: mdiMessage, color: 'text-blue-600', permission: 'view_messages' },
  // { name: 'Approver', path: '/approver', icon: mdiCheckCircle, color: 'text-blue-600', permission: 'approve_bookings' },
  { name: 'Facilities', path: '/facilities', icon: mdiWifi, color: 'text-orange-600', permission: 'view_facilities' },
  { name: 'Products', path: '/products', icon: mdiGoogleClassroom, color: 'text-indigo-600', permission: 'view_products' },
  { name: 'Locations', path: '/locations', icon: mdiMapMarker, color: 'text-red-600', permission: 'view_locations' },
  { name: 'Payments', path: '/payments', icon: mdiCreditCard, color: 'text-teal-600', permission: 'view_payments' },
  { name: 'Promotions', path: '/promotions', icon: mdiTag, color: 'text-pink-600', permission: 'view_promotions' },
  { name: 'User Management', path: '/user-management', icon: mdiAccountSettings, color: 'text-yellow-600', permission: 'view_users' },
  // { name: 'Dual Auth', path: '/dual-auth', icon: mdiShieldCheck, color: 'text-emerald-600', permission: 'system_settings' },
  // { name: 'Activity Log', path: '/activity-log', icon: mdiHistory, color: 'text-gray-600', permission: 'view_activity_logs' }
]

// Notifications
const notifications = ref([
  {
    id: 1,
    type: 'booking',
    title: 'New Booking',
    message: 'BR-2034 for "Board Room – Main Branch" on 12 Aug 2025, 10:00 AM',
    time: '5 minutes ago',
    icon: mdiCalendarCheck
  },
  {
    id: 2,
    type: 'cancellation',
    title: 'Cancellation',
    message: 'Booking BR-2031 has been cancelled by customer',
    time: '1 hour ago',
    icon: mdiCancel
  }
])

const authStore = useAuthStore()
const permissionsStore = usePermissionsStore()
const themeStore = useThemeStore()

const notificationCount = computed(() => notifications.value.length)

// Filter menu items based on user permissions
const visibleMenuItems = computed(() => {
  return menuItems.filter(item => {
    // If no permission specified, show the item
    if (!item.permission) {
      return true
    }
    // Check if user has the required permission
    return permissionsStore.hasPermission(item.permission)
  })
})

// Use theme from store
const theme = computed(() => themeStore.theme)

// Get current page name based on route
const currentPageName = computed(() => {
  // Special case for profile page
  if (route.path === '/profile') {
    return 'Admin Profile'
  }
  
  // Special case for settings page
  if (route.path === '/settings') {
    return 'Settings'
  }
  
  const currentItem = menuItems.find(item => isActive(item.path))
  return currentItem ? currentItem.name : 'Dashboard'
})

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const logout = async () => {
  signingOut.value = true
  showUserMenu.value = false // Close dropdown immediately

  try {
    // Add a delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Clear all authentication and user data using auth store
    authStore.clearAuth()

    // Redirect to login
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Even if there's an error, clear auth and redirect
    authStore.clearAuth()
    router.push('/login')
  } finally {
    signingOut.value = false
  }
}

// Notification icon styling helpers
const getNotificationIconClass = (type: string) => {
  switch (type) {
    case 'booking':
      return 'bg-green-100'
    case 'cancellation':
      return 'bg-orange-100'
    default:
      return 'bg-primary-100'
  }
}

const getNotificationIconColor = (type: string) => {
  switch (type) {
    case 'booking':
      return 'text-green-600'
    case 'cancellation':
      return 'text-orange-600'
    default:
      return 'text-primary-600'
  }
}

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Theme is handled by the theme store
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
