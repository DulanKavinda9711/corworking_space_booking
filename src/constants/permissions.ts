/**
 * Permission Constants
 * 
 * Defines all available permissions in the system.
 * These permissions control what features and actions users can access.
 */

export const PERMISSIONS = {
  // Dashboard Permissions
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_SQUREHUB_COMMISSION: 'view_squrehub_commission',
  VIEW_REVENUE_STATS: 'view_revenue_stats',
  VIEW_BOOKING_STATS: 'view_booking_stats',
  VIEW_USER_STATS: 'view_user_stats',

  // User Management Permissions
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  ACTIVATE_USERS: 'activate_users',
  DEACTIVATE_USERS: 'deactivate_users',
  VIEW_USER_DETAILS: 'view_user_details',

  // Role Management Permissions
  VIEW_ROLES: 'view_roles',
  CREATE_ROLES: 'create_roles',
  EDIT_ROLES: 'edit_roles',
  DELETE_ROLES: 'delete_roles',
  ASSIGN_ROLES: 'assign_roles',
  MANAGE_PERMISSIONS: 'manage_permissions',

  // Booking Management Permissions
  VIEW_BOOKINGS: 'view_bookings',
  CREATE_BOOKINGS: 'create_bookings',
  EDIT_BOOKINGS: 'edit_bookings',
  DELETE_BOOKINGS: 'delete_bookings',
  CANCEL_BOOKINGS: 'cancel_bookings',
  APPROVE_BOOKINGS: 'approve_bookings',
  VIEW_BOOKING_DETAILS: 'view_booking_details',

  // Subscription Management Permissions
  VIEW_SUBSCRIPTIONS: 'view_subscriptions',
  CREATE_SUBSCRIPTIONS: 'create_subscriptions',
  EDIT_SUBSCRIPTIONS: 'edit_subscriptions',
  CANCEL_SUBSCRIPTIONS: 'cancel_subscriptions',
  VIEW_SUBSCRIPTION_DETAILS: 'view_subscription_details',

  // Customer Management Permissions
  VIEW_CUSTOMERS: 'view_customers',
  CREATE_CUSTOMERS: 'create_customers',
  EDIT_CUSTOMERS: 'edit_customers',
  DELETE_CUSTOMERS: 'delete_customers',
  VIEW_CUSTOMER_DETAILS: 'view_customer_details',

  // Product Management Permissions
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCTS: 'create_products',
  EDIT_PRODUCTS: 'edit_products',
  DELETE_PRODUCTS: 'delete_products',
  ACTIVATE_PRODUCTS: 'activate_products',
  DEACTIVATE_PRODUCTS: 'deactivate_products',

  // Location Management Permissions
  VIEW_LOCATIONS: 'view_locations',
  CREATE_LOCATIONS: 'create_locations',
  EDIT_LOCATIONS: 'edit_locations',
  DELETE_LOCATIONS: 'delete_locations',

  // Company Management Permissions
  VIEW_COMPANIES: 'view_companies',
  CREATE_COMPANIES: 'create_companies',
  EDIT_COMPANIES: 'edit_companies',
  DELETE_COMPANIES: 'delete_companies',

  // Facility Management Permissions
  VIEW_FACILITIES: 'view_facilities',
  CREATE_FACILITIES: 'create_facilities',
  EDIT_FACILITIES: 'edit_facilities',
  DELETE_FACILITIES: 'delete_facilities',

  // Payment Management Permissions
  VIEW_PAYMENTS: 'view_payments',
  PROCESS_PAYMENTS: 'process_payments',
  REFUND_PAYMENTS: 'refund_payments',
  VIEW_PAYMENT_DETAILS: 'view_payment_details',

  // Promotion Management Permissions
  VIEW_PROMOTIONS: 'view_promotions',
  CREATE_PROMOTIONS: 'create_promotions',
  EDIT_PROMOTIONS: 'edit_promotions',
  DELETE_PROMOTIONS: 'delete_promotions',
  ACTIVATE_PROMOTIONS: 'activate_promotions',

  // Message Management Permissions
  VIEW_MESSAGES: 'view_messages',
  SEND_MESSAGES: 'send_messages',
  DELETE_MESSAGES: 'delete_messages',

  // Settings Permissions
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',
  SYSTEM_SETTINGS: 'system_settings',

  // Activity Log Permissions
  VIEW_ACTIVITY_LOGS: 'view_activity_logs',
  
  // Commission & Rewards Permissions
  VIEW_COMMISSIONS: 'view_commissions',
  MANAGE_COMMISSIONS: 'manage_commissions',
  VIEW_REWARDS: 'view_rewards',
  MANAGE_REWARDS: 'manage_rewards',

  // Super Admin Permission (access to everything)
  SUPER_ADMIN: 'super_admin'
} as const

/**
 * Permission Categories for UI organization
 */
export const PERMISSION_CATEGORIES = {
  DASHBOARD: 'Dashboard',
  USER_MANAGEMENT: 'User Management',
  ROLE_MANAGEMENT: 'Role Management',
  BOOKING_MANAGEMENT: 'Booking Management',
  SUBSCRIPTION_MANAGEMENT: 'Subscription Management',
  CUSTOMER_MANAGEMENT: 'Customer Management',
  PRODUCT_MANAGEMENT: 'Product Management',
  LOCATION_MANAGEMENT: 'Location Management',
  COMPANY_MANAGEMENT: 'Company Management',
  FACILITY_MANAGEMENT: 'Facility Management',
  PAYMENT_MANAGEMENT: 'Payment Management',
  PROMOTION_MANAGEMENT: 'Promotion Management',
  MESSAGE_MANAGEMENT: 'Message Management',
  SETTINGS: 'Settings',
  ACTIVITY_LOGS: 'Activity Logs',
  COMMISSIONS_REWARDS: 'Commissions & Rewards',
  SYSTEM: 'System'
} as const

/**
 * Permission Descriptions for UI display
 */
export const PERMISSION_DESCRIPTIONS = {
  [PERMISSIONS.VIEW_DASHBOARD]: 'View main dashboard',
  [PERMISSIONS.VIEW_ANALYTICS]: 'View analytics and reports',
  [PERMISSIONS.VIEW_SQUREHUB_COMMISSION]: 'View SqureHub commission tile',
  [PERMISSIONS.VIEW_REVENUE_STATS]: 'View revenue statistics',
  [PERMISSIONS.VIEW_BOOKING_STATS]: 'View booking statistics',
  [PERMISSIONS.VIEW_USER_STATS]: 'View user statistics',

  [PERMISSIONS.VIEW_USERS]: 'View users list',
  [PERMISSIONS.CREATE_USERS]: 'Create new users',
  [PERMISSIONS.EDIT_USERS]: 'Edit existing users',
  [PERMISSIONS.DELETE_USERS]: 'Delete users',
  [PERMISSIONS.ACTIVATE_USERS]: 'Activate user accounts',
  [PERMISSIONS.DEACTIVATE_USERS]: 'Deactivate user accounts',
  [PERMISSIONS.VIEW_USER_DETAILS]: 'View detailed user information',

  [PERMISSIONS.VIEW_ROLES]: 'View roles list',
  [PERMISSIONS.CREATE_ROLES]: 'Create new roles',
  [PERMISSIONS.EDIT_ROLES]: 'Edit existing roles',
  [PERMISSIONS.DELETE_ROLES]: 'Delete roles',
  [PERMISSIONS.ASSIGN_ROLES]: 'Assign roles to users',
  [PERMISSIONS.MANAGE_PERMISSIONS]: 'Manage role permissions',

  [PERMISSIONS.VIEW_BOOKINGS]: 'View bookings list',
  [PERMISSIONS.CREATE_BOOKINGS]: 'Create new bookings',
  [PERMISSIONS.EDIT_BOOKINGS]: 'Edit existing bookings',
  [PERMISSIONS.DELETE_BOOKINGS]: 'Delete bookings',
  [PERMISSIONS.CANCEL_BOOKINGS]: 'Cancel bookings',
  [PERMISSIONS.APPROVE_BOOKINGS]: 'Approve bookings',
  [PERMISSIONS.VIEW_BOOKING_DETAILS]: 'View detailed booking information',

  [PERMISSIONS.VIEW_SUBSCRIPTIONS]: 'View subscriptions list',
  [PERMISSIONS.CREATE_SUBSCRIPTIONS]: 'Create new subscriptions',
  [PERMISSIONS.EDIT_SUBSCRIPTIONS]: 'Edit existing subscriptions',
  [PERMISSIONS.CANCEL_SUBSCRIPTIONS]: 'Cancel subscriptions',
  [PERMISSIONS.VIEW_SUBSCRIPTION_DETAILS]: 'View detailed subscription information',

  [PERMISSIONS.SUPER_ADMIN]: 'Full system access (Super Administrator)'
} as const

/**
 * Grouped permissions by category
 */
export const PERMISSIONS_BY_CATEGORY = {
  [PERMISSION_CATEGORIES.DASHBOARD]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_SQUREHUB_COMMISSION,
    PERMISSIONS.VIEW_REVENUE_STATS,
    PERMISSIONS.VIEW_BOOKING_STATS,
    PERMISSIONS.VIEW_USER_STATS
  ],
  [PERMISSION_CATEGORIES.USER_MANAGEMENT]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.ACTIVATE_USERS,
    PERMISSIONS.DEACTIVATE_USERS,
    PERMISSIONS.VIEW_USER_DETAILS
  ],
  [PERMISSION_CATEGORIES.ROLE_MANAGEMENT]: [
    PERMISSIONS.VIEW_ROLES,
    PERMISSIONS.CREATE_ROLES,
    PERMISSIONS.EDIT_ROLES,
    PERMISSIONS.DELETE_ROLES,
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.MANAGE_PERMISSIONS
  ],
  [PERMISSION_CATEGORIES.BOOKING_MANAGEMENT]: [
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.EDIT_BOOKINGS,
    PERMISSIONS.DELETE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKINGS,
    PERMISSIONS.APPROVE_BOOKINGS,
    PERMISSIONS.VIEW_BOOKING_DETAILS
  ],
  [PERMISSION_CATEGORIES.SUBSCRIPTION_MANAGEMENT]: [
    PERMISSIONS.VIEW_SUBSCRIPTIONS,
    PERMISSIONS.CREATE_SUBSCRIPTIONS,
    PERMISSIONS.EDIT_SUBSCRIPTIONS,
    PERMISSIONS.CANCEL_SUBSCRIPTIONS,
    PERMISSIONS.VIEW_SUBSCRIPTION_DETAILS
  ]
} as const

/**
 * Default role configurations (for frontend-only implementation)
 */
export const DEFAULT_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  VIEWER: 'viewer'
} as const

/**
 * Type helpers
 */
export type PermissionKey = keyof typeof PERMISSIONS
export type PermissionValue = typeof PERMISSIONS[PermissionKey]
export type PermissionCategory = keyof typeof PERMISSION_CATEGORIES
export type DefaultRole = keyof typeof DEFAULT_ROLES