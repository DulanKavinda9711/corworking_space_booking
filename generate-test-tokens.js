/**
 * JWT Token Generator for Testing Different Permission Sets
 * 
 * This script helps generate JWT tokens with different permission combinations
 * for testing the RBAC system.
 */

// Available permissions in the system
const ALL_PERMISSIONS = [
  // Dashboard Permissions
  'view_dashboard',
  'view_analytics', 
  'view_squrehub_commission', // This is the key permission for commission tile
  'view_revenue_stats',
  'view_booking_stats',
  'view_user_stats',

  // User Management Permissions
  'view_users',
  'create_users',
  'edit_users',
  'delete_users',
  'activate_users',
  'deactivate_users',
  'view_user_details',

  // Role Management Permissions
  'view_roles',
  'create_roles',
  'edit_roles',
  'delete_roles',
  'assign_roles',
  'manage_permissions',

  // Booking Management Permissions
  'view_bookings',
  'create_bookings',
  'edit_bookings',
  'delete_bookings',
  'cancel_bookings',
  'approve_bookings',
  'view_booking_details',

  // Subscription Management Permissions
  'view_subscriptions',
  'create_subscriptions',
  'edit_subscriptions',
  'cancel_subscriptions',
  'view_subscription_details',

  // Customer Management Permissions
  'view_customers',
  'view_customer_details',

  // Payment Management Permissions
  'view_payments',
  'view_payment_details'
];

// Predefined user roles with different permission sets
const USER_ROLES = {
  // Super Admin - All permissions
  SUPER_ADMIN: {
    role: 'super_admin',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    permissions: ALL_PERMISSIONS
  },

  // Admin - All permissions except some sensitive ones
  ADMIN: {
    role: 'admin',
    name: 'Test Admin',
    email: 'testadmin@example.com', 
    permissions: ALL_PERMISSIONS
  },

  // Manager - Business operations permissions INCLUDING commission view
  MANAGER: {
    role: 'manager',
    name: 'Test Manager',
    email: 'testmanager@example.com',
    permissions: [
      'view_dashboard',
      'view_analytics',
      'view_squrehub_commission', // Manager CAN see commission
      'view_revenue_stats',
      'view_booking_stats',
      'view_user_stats',
      'view_bookings',
      'create_bookings',
      'edit_bookings',
      'cancel_bookings',
      'approve_bookings',
      'view_booking_details',
      'view_subscriptions',
      'edit_subscriptions',
      'view_subscription_details',
      'view_customers',
      'view_customer_details',
      'view_payments',
      'view_payment_details'
    ]
  },

  // Staff - Basic permissions WITHOUT commission view
  STAFF: {
    role: 'staff',
    name: 'Test Staff',
    email: 'teststaff@example.com',
    permissions: [
      'view_dashboard',
      'view_analytics',
      // 'view_squrehub_commission', // Staff CANNOT see commission - COMMENTED OUT
      'view_revenue_stats',
      'view_booking_stats',
      'view_user_stats',
      'view_bookings',
      'view_booking_details',
      'view_subscriptions', 
      'view_subscription_details',
      'view_customers',
      'view_customer_details',
      'view_payments',
      'view_payment_details'
    ]
  },

  // Viewer - Read-only permissions, no commission
  VIEWER: {
    role: 'viewer',
    name: 'Test Viewer',
    email: 'testviewer@example.com',
    permissions: [
      'view_dashboard',
      'view_analytics',
      // 'view_squrehub_commission', // Viewer CANNOT see commission - COMMENTED OUT
      'view_bookings',
      'view_booking_details',
      'view_customers',
      'view_customer_details'
    ]
  },

  // Reception - Front desk permissions, no commission
  RECEPTION: {
    role: 'reception',
    name: 'Test Reception',
    email: 'testreception@example.com',
    permissions: [
      'view_dashboard',
      'view_bookings',
      'create_bookings',
      'edit_bookings',
      'view_booking_details',
      'view_customers',
      'view_customer_details'
      // 'view_squrehub_commission', // Reception CANNOT see commission - OMITTED
    ]
  }
};

/**
 * Generate a mock JWT payload for testing
 * @param {string} userType - One of: SUPER_ADMIN, ADMIN, MANAGER, STAFF, VIEWER, RECEPTION
 * @param {number} userId - User ID for the token
 * @returns {object} JWT payload object
 */
function generateJWTPayload(userType = 'STAFF', userId = 123) {
  const user = USER_ROLES[userType];
  
  if (!user) {
    throw new Error(`Invalid user type: ${userType}. Available: ${Object.keys(USER_ROLES).join(', ')}`);
  }

  return {
    iss: "CoworkingSpaceBooking",
    aud: "CoworkingSpaceBookingUsers", 
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (12 * 60 * 60), // 12 hours
    sub: userId.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions
  };
}

/**
 * Generate a complete mock login response
 * @param {string} userType - User type to generate
 * @param {number} userId - User ID
 * @returns {object} Complete login response object
 */
function generateLoginResponse(userType = 'STAFF', userId = 123) {
  const user = USER_ROLES[userType];
  const payload = generateJWTPayload(userType, userId);
  
  return {
    status: "success",
    message: "Login successful",
    data: {
      token: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(payload))}.mock_signature_for_testing`,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        role_id: userId,
        created_at: "2023-11-01T09:00:00.000000Z",
        updated_at: "2023-11-01T09:00:00.000000Z"
      }
    }
  };
}

// Console testing functions
console.log('=== JWT Token Generator for RBAC Testing ===\n');

console.log('🔧 Available User Types:');
Object.keys(USER_ROLES).forEach(type => {
  const user = USER_ROLES[type];
  const hasCommission = user.permissions.includes('view_squrehub_commission');
  console.log(`  ${type}: ${user.name} - Commission Tile: ${hasCommission ? '✅ VISIBLE' : '❌ HIDDEN'}`);
});

console.log('\n🧪 Generate Test Tokens:');
console.log('Example usage:');
console.log('  generateLoginResponse("STAFF")     // No commission access');
console.log('  generateLoginResponse("MANAGER")   // Has commission access');
console.log('  generateLoginResponse("ADMIN")     // Has all permissions');

console.log('\n🎯 To Test Commission Tile Hiding:');
console.log('1. Use generateLoginResponse("STAFF") - Commission tile should be HIDDEN');
console.log('2. Use generateLoginResponse("ADMIN") - Commission tile should be VISIBLE');

// Generate examples
console.log('\n📋 Example Responses:');

console.log('\n--- STAFF User (NO Commission Access) ---');
const staffResponse = generateLoginResponse('STAFF', 456);
console.log(JSON.stringify(staffResponse, null, 2));

console.log('\n--- ADMIN User (HAS Commission Access) ---');  
const adminResponse = generateLoginResponse('ADMIN', 123);
console.log(JSON.stringify(adminResponse, null, 2));

// Export for use in Postman or other tools  
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateJWTPayload,
    generateLoginResponse,
    USER_ROLES,
    ALL_PERMISSIONS
  };
}