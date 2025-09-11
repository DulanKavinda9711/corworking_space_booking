import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

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
import CommissionSetupView from '@/views/CommissionSetupView.vue'

// User Management
import UserManagementView from '@/views/UserManagementView.vue'
import UserDetailsView from '@/views/users/UserDetailsView.vue'
import EditUserView from '@/views/users/EditUserView.vue'
import AddUserView from '@/views/users/AddUserView.vue'
import AddRoleView from '@/views/users/AddRoleView.vue'
import RoleDetailsView from '@/views/users/RoleDetailsView.vue'
import EditRoleView from '@/views/users/EditRoleView.vue'

// Dual Authentication
import DualAuthView from '@/views/DualAuthView.vue'

// Activity Log
import ActivityLogView from '@/views/ActivityLogView.vue'

// Settings
import SettingsView from '@/views/SettingsView.vue'

// Admin Profile
import AdminProfileView from '@/views/AdminProfileView.vue'

// Placeholder views
import PlaceholderView from '@/views/PlaceholderView.vue'

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
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: BookingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/:id',
    name: 'BookingDetail',
    component: BookingDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/:id/cancel',
    name: 'CancelBooking',
    component: CancelBookingView,
    meta: { requiresAuth: true }
  },
  
  {
    path: '/subscriptions/:id',
    name: 'SubscriptionDetail',
    component: SubscriptionDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/subscriptions/:id/cancel',
    name: 'CancelSubscription',
    component: CancelSubscriptionView,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: CustomersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers/:id',
    name: 'CustomerDetail',
    component: CustomerDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/facilities',
    name: 'Facilities',
    component: FacilitiesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/facilities/add',
    name: 'AddFacility',
    component: AddFacilityView,
    meta: { requiresAuth: true }
  },
  {
    path: '/facilities/:id',
    name: 'ViewFacility',
    component: ViewFacilityView,
    meta: { requiresAuth: true }
  },
  {
    path: '/facilities/:id/edit',
    name: 'EditFacility',
    component: EditFacilityView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/add',
    name: 'AddProduct',
    component: AddProductView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id',
    name: 'ProductsViewDetails',
    component: ProductsViewDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id/edit',
    name: 'EditProduct',
    component: EditProductView,
    meta: { requiresAuth: true }
  },
  {
    path: '/locations',
    name: 'Locations',
    component: LocationsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/locations/add',
    name: 'AddLocation',
    component: AddLocationView,
    meta: { requiresAuth: true }
  },
  {
    path: '/locations/:id',
    name: 'LocationDetail',
    component: LocationDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/locations/:id/edit',
    name: 'EditLocation',
    component: EditLocationView,
    meta: { requiresAuth: true }
  },
  {
    path: '/payments',
    name: 'Payments',
    component: PaymentsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/payments/:id',
    name: 'PaymentDetail',
    component: PaymentDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/payments/commission-setup',
    name: 'CommissionSetup',
    component: CommissionSetupView,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagementView,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-management/add',
    name: 'AddUser',
    component: AddUserView,
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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

// Auth guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth-token')
  const passwordReset = localStorage.getItem('password-reset')
  const onboardingComplete = localStorage.getItem('onboarding-complete')
  const demoPasswordDisabled = localStorage.getItem('demo-password-disabled')
  const storedPassword = localStorage.getItem('user-password')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Not authenticated, redirect to login
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Already authenticated, check if onboarding is needed
    if (!passwordReset || !onboardingComplete) {
      next('/onboarding')
    } else {
      next('/dashboard')
    }
  } else if (to.path === '/onboarding' && isAuthenticated && passwordReset === 'true' && onboardingComplete === 'true') {
    // User has already completed onboarding, redirect to dashboard
    next('/dashboard')
  } else if (to.path === '/dashboard' && isAuthenticated) {
    // Enhanced security check for dashboard access
    if (demoPasswordDisabled === 'true' && storedPassword) {
      // User has set a custom password - allow access
      next()
    } else if (passwordReset === 'true' && onboardingComplete === 'true') {
      // Fallback for existing users who completed onboarding
      next()
    } else if (!passwordReset || !onboardingComplete) {
      // Force onboarding if not completed
      next('/onboarding')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
