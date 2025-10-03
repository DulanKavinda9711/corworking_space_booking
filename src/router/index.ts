import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissionsStore } from '@/stores/permissions'

// Auth
import LoginView from '@/views/auth/LoginView.vue'
import OnboardingView from '@/views/auth/OnboardingView.vue'

// Dashboard
import DashboardView from '@/views/DashboardView.vue'

// Bookings
import BookingsView from '@/views/bookings/BookingsView.vue'
import BookingDetailView from '@/views/bookings/BookingDetailView.vue'
import SubscriptionDetailView from '@/views/bookings/SubscriptionDetailView.vue'
import CancelBookingView from '@/views/bookings/CancelBookingView.vue'
import CancelSubscriptionView from '@/views/bookings/CancelSubscriptionView.vue'



// Customers
import CustomersView from '@/views/CustomersView.vue'
import CustomerDetailView from '@/views/CustomerDetailView.vue'

// Messages
import MessagesView from '@/views/MessagesView.vue'

// Approver
import ApproverView from '@/views/ApproverView.vue'

// Facilities
import FacilitiesView from '@/views/FacilitiesView.vue'
import AddFacilityView from '@/views/facilities/AddFacilityView.vue'
import EditFacilityView from '@/views/facilities/EditFacilityView.vue'
import ViewFacilityView from '@/views/facilities/ViewFacilityView.vue'

// Products
import ProductsView from '@/views/ProductsView.vue'
import AddProductView from '@/views/products/AddProductView.vue'
import ProductsViewDetails from '@/views/ProductsViewDetails.vue'
import EditProductView from '@/views/products/EditProductView.vue'

// Locations
import LocationsView from '@/views/LocationsView.vue'
import LocationDetailView from '@/views/LocationDetailView.vue'
import AddLocationView from '@/views/locations/AddLocationView.vue'
import EditLocationView from '@/views/locations/EditLocationView.vue'

// Payments
import PaymentsView from '@/views/PaymentsView.vue'
import PaymentDetailView from '@/views/PaymentDetailView.vue'

// User Management
import UserManagementView from '@/views/UserManagementView.vue'
import UserDetailsView from '@/views/users/UserDetailsView.vue'
import EditUserView from '@/views/users/EditUserView.vue'
import AddUserView from '@/views/users/AddUserView.vue'
import AddRoleView from '@/views/users/AddRoleView.vue'
import RoleDetailsView from '@/views/users/RoleDetailsView.vue'
import EditRoleView from '@/views/users/EditRoleView.vue'
import AdminDetailsView from '@/views/users/AdminDetailsView.vue'

// Dual Authentication
import DualAuthView from '@/views/DualAuthView.vue'

// Activity Log
import ActivityLogView from '@/views/ActivityLogView.vue'

// Settings
import SettingsView from '@/views/SettingsView.vue'

// Admin Profile
import AdminProfileView from '@/views/AdminProfileView.vue'

// Placeholder views
// import PlaceholderView from '@/views/PlaceholderView.vue'

// Promotions
import PromotionView from '@/views/PromotionView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: OnboardingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_dashboard']
    }
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: BookingsView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_bookings']
    }
  },
  {
    path: '/bookings/:id',
    name: 'BookingDetail',
    component: BookingDetailView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_booking_details']
    }
  },
  {
    path: '/bookings/:id/cancel',
    name: 'CancelBooking',
    component: CancelBookingView,
    meta: { 
      requiresAuth: true,
      permissions: ['cancel_bookings']
    }
  },
  
  {
    path: '/subscriptions/:id',
    name: 'SubscriptionDetail',
    component: SubscriptionDetailView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_subscriptions']
    }
  },
  {
    path: '/subscriptions/:id/cancel',
    name: 'CancelSubscription',
    component: CancelSubscriptionView,
    meta: { 
      requiresAuth: true,
      permissions: ['cancel_subscriptions']
    }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: CustomersView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_customers']
    }
  },
  {
    path: '/customers/:id',
    name: 'CustomerDetail',
    component: CustomerDetailView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_customer_details']
    }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: MessagesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/approver',
    name: 'Approver',
    component: ApproverView,
    meta: { requiresAuth: true }
  },
  {
    path: '/facilities',
    name: 'Facilities',
    component: FacilitiesView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_facilities']
    }
  },
  {
    path: '/facilities/add',
    name: 'AddFacility',
    component: AddFacilityView,
    meta: { 
      requiresAuth: true,
      permissions: ['create_facilities']
    }
  },
  {
    path: '/facilities/:id',
    name: 'ViewFacility',
    component: ViewFacilityView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_facilities']
    }
  },
  {
    path: '/facilities/:id/edit',
    name: 'EditFacility',
    component: EditFacilityView,
    meta: { 
      requiresAuth: true,
      permissions: ['edit_facilities']
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_products']
    }
  },
  {
    path: '/products/add',
    name: 'AddProduct',
    component: AddProductView,
    meta: { 
      requiresAuth: true,
      permissions: ['create_products']
    }
  },
  {
    path: '/products/:id',
    name: 'ProductsViewDetails',
    component: ProductsViewDetails,
    meta: { 
      requiresAuth: true,
      permissions: ['view_products']
    }
  },
  {
    path: '/products/:id/edit',
    name: 'EditProduct',
    component: EditProductView,
    meta: { 
      requiresAuth: true,
      permissions: ['edit_products']
    }
  },
  {
    path: '/locations',
    name: 'Locations',
    component: LocationsView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_locations']
    }
  },
  {
    path: '/locations/add',
    name: 'AddLocation',
    component: AddLocationView,
    meta: { 
      requiresAuth: true,
      permissions: ['create_locations']
    }
  },
  {
    path: '/locations/:id',
    name: 'LocationDetail',
    component: LocationDetailView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_locations']
    }
  },
  {
    path: '/locations/:id/edit',
    name: 'EditLocation',
    component: EditLocationView,
    meta: { 
      requiresAuth: true,
      permissions: ['edit_locations']
    }
  },
  {
    path: '/payments',
    name: 'Payments',
    component: PaymentsView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_payments']
    }
  },
  {
    path: '/payments/:id',
    name: 'PaymentDetail',
    component: PaymentDetailView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_payment_details']
    }
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagementView,
    meta: { 
      requiresAuth: true,
      permissions: ['view_users']
    }
  },
  {
    path: '/user-management/add',
    name: 'AddUser',
    component: AddUserView,
    meta: { 
      requiresAuth: true,
      permissions: ['users.create']
    }
  },
  {
    path: '/user-management/add-role',
    name: 'AddRole',
    component: AddRoleView,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-management/role/:id',
    name: 'RoleDetails',
    component: RoleDetailsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-management/role/:id/edit',
    name: 'EditRole',
    component: EditRoleView,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-management/admin/:id',
    name: 'AdminDetails',
    component: AdminDetailsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-management/:id',
    name: 'UserDetails',
    component: UserDetailsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-management/:id/edit',
    name: 'EditUser',
    component: EditUserView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dual-auth',
    name: 'DualAuth',
    component: DualAuthView,
    meta: { requiresAuth: true }
  },
  {
    path: '/activity-log',
    name: 'ActivityLog',
    component: ActivityLogView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { 
      requiresAuth: true,
      permissions: ['settings.view']
    }
  },
  {
    path: '/profile',
    name: 'AdminProfile',
    component: AdminProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/promotions',
    name: 'Promotions',
    component: PromotionView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth guard with permission checking
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const permissionsStore = usePermissionsStore()

  const isAuthenticated = authStore.authToken
  const passwordReset = authStore.passwordReset
  const onboardingComplete = authStore.onboardingComplete
  const demoPasswordDisabled = authStore.demoPasswordDisabled
  const storedPassword = authStore.userPassword

  
  // Check if user needs password change (temporary flag from 403 response)
  const passwordChangeRequired = sessionStorage.getItem('passwordChangeRequired') === 'true'
  
  if (to.meta.requiresAuth && !isAuthenticated && !passwordChangeRequired) {
    // Not authenticated and not in password change flow, redirect to login
    console.log('🔐 Router Guard: Redirecting to login - requires auth but not authenticated')
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Already authenticated, redirect to appropriate page
    console.log('🔄 Router Guard: Already authenticated, redirecting to dashboard')
    next('/dashboard')
  } else if (isAuthenticated && to.meta.permissions) {
    // Check permissions for authenticated users
    const requiredPermissions = to.meta.permissions as string[]
    const requireAll = to.meta.requireAllPermissions as boolean || false
    
    // Check if permissions store is empty (might be after page refresh)
    if (permissionsStore.userPermissions.length === 0 && authStore.user?.permissions) {
      console.log('🔄 Router Guard: Permissions store empty, reinitializing from auth store')
      authStore.initializeFromStorage()
    }
    
    if (!permissionsStore.canAccessRoute(requiredPermissions, requireAll)) {
      console.log('🚫 Router Guard: Access denied - insufficient permissions for', to.path)
      console.log('- Required permissions:', requiredPermissions)
      console.log('- User permissions:', permissionsStore.userPermissions)
      // Redirect to dashboard or show access denied page
      next('/dashboard')
      return
    }
    
    console.log('✅ Router Guard: Permission check passed for', to.path)
    next()
  } else if (to.path === '/onboarding' && isAuthenticated && authStore.isPasswordReset && authStore.isOnboardingComplete) {
    // User has already completed onboarding, redirect to dashboard
    console.log('✅ Router Guard: Onboarding complete, redirecting to dashboard')
    next('/dashboard')
  } else if (to.path === '/dashboard' && !isAuthenticated) {
    // Enhanced security check for dashboard access
    console.log('🎯 Router Guard: Dashboard access check', {
      demoPasswordDisabled,
      storedPassword,
      isPasswordReset: authStore.isPasswordReset,
      isOnboardingComplete: authStore.isOnboardingComplete
    })

    if (demoPasswordDisabled === 'true' && storedPassword) {
      // User has set a custom password - allow access
      console.log('🔑 Router Guard: Custom password set, allowing dashboard access')
      next()
    } else if (authStore.isPasswordReset && authStore.isOnboardingComplete) {
      // Fallback for existing users who completed onboarding
      console.log('👑 Router Guard: Password reset and onboarding complete, allowing access')
      next()
    } else if (!authStore.isPasswordReset || !authStore.isOnboardingComplete) {
      // Force onboarding if not completed
      console.log('⚠️ Router Guard: Onboarding not complete, redirecting to onboarding')
      next('/onboarding')
    } else {
      // Default allow access
      console.log('✅ Router Guard: Default dashboard access allowed')
      next()
    }
  } else {
    // Allow access for all other cases
    console.log('✅ Router Guard: Allowing access to', to.path)
    next()
  }
})

export default router
