<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-700" :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">
      <div class="flex items-center justify-center h-16 px-4 bg-gray-900 border-b border-gray-700">
        <h1 class="text-xl font-bold text-white">CoWork Admin</h1>
      </div>
      
      <nav class="mt-8">
        <div class="px-4 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.path"
            class="flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            :class="{ 'bg-green-600 text-white border-r-2 border-green-400': isActive(item.path) }"
            @click="closeSidebarOnMobile"
          >
            <svg class="w-5 h-5 mr-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path :d="item.icon" />
            </svg>
            {{ item.name }}
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
            <router-link to="/settings" class="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="mdiIcons.mdiCog" />
              </svg>
            </router-link>

           

            <!-- User Menu -->
            <div class="relative">
              <button @click="showUserMenu = !showUserMenu" class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 hover:ring-2 hover:ring-green-300 transition-all">
                <img class="h-8 w-8 rounded-full border-2 border-green-200" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
              </button>
              
              <!-- User Dropdown -->
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div class="py-1">
                  <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Profile</router-link>
                  <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Settings</router-link>
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
      <main class="flex-1 overflow-y-auto p-6 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm border-b border-green-100">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
  mdiBullhorn
} from '@mdi/js'

const route = useRoute()
const router = useRouter()

// Sidebar state
const sidebarOpen = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const searchQuery = ref('')

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
  mdiBullhorn
}

// Menu items
const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: mdiViewDashboard, color: 'text-green-600' },
  { name: 'Bookings', path: '/bookings', icon: mdiCalendarCheck, color: 'text-green-600' },
  { name: 'Customers', path: '/customers', icon: mdiAccountGroup, color: 'text-purple-600' },
  { name: 'Facilities', path: '/facilities', icon: mdiSeat, color: 'text-orange-600' },
  { name: 'Products', path: '/products', icon: mdiBookOpen, color: 'text-indigo-600' },
  { name: 'Locations', path: '/locations', icon: mdiMapMarker, color: 'text-red-600' },
  { name: 'Payments', path: '/payments', icon: mdiCreditCard, color: 'text-teal-600' },
  { name: 'Promotions', path: '/promotions', icon: mdiBullhorn, color: 'text-pink-600' },
  { name: 'User Management', path: '/user-management', icon: mdiAccountSettings, color: 'text-yellow-600' },
  { name: 'Dual Auth', path: '/dual-auth', icon: mdiShieldCheck, color: 'text-emerald-600' },
  { name: 'Reports', path: '/reports', icon: mdiChartLine, color: 'text-cyan-600' },
  { name: 'Activity Log', path: '/activity-log', icon: mdiHistory, color: 'text-gray-600' }
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

const notificationCount = computed(() => notifications.value.length)

// Theme (light / dark) - persisted to localStorage and applied to document element
let _initialTheme: 'light' | 'dark' = 'light'
try {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') _initialTheme = 'dark'
} catch (e) {
  // ignore
}
const theme = ref<'light' | 'dark'>(_initialTheme)

const applyTheme = (t: 'light' | 'dark') => {
  try {
    if (t === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } catch (e) {
    // ignore (server-side rendering etc.)
  }
}

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem('theme', theme.value)
  } catch (e) {
    // ignore
  }
  applyTheme(theme.value)
}

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

const onSearch = () => {
  // Emit search event or handle search logic
  console.log('Searching for:', searchQuery.value)
}

const logout = () => {
  localStorage.removeItem('auth-token')
  router.push('/login')
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
  // apply stored theme on mount
  applyTheme(theme.value)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
