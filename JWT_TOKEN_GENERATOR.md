# JWT Token Generator for Testing Permissions

## 🎯 **Creating Token WITHOUT Commission.View Permission**

To test that the SquareHub commission tile is properly hidden, you need a JWT token that excludes the `commission.view` permission.

## 🔧 **Step 1: Update Postman Mock Response**

In your Postman mock server, update the login response to return a user without `commission.view` permission:

### **Mock Response Body (Without Commission Permission):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDb3dvcmtpbmdTcGFjZUJvb2tpbmciLCJhdWQiOiJDb3dvcmtpbmdTcGFjZUJvb2tpbmdVc2VycyIsImlhdCI6MTY5ODg0MDAwMCwiZXhwIjoxNjk4ODgzMjAwLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgU3RhZmYiLCJlbWFpbCI6InRlc3RzdGFmZkBleGFtcGxlLmNvbSIsInJvbGUiOiJzdGFmZiIsInBlcm1pc3Npb25zIjpbInZpZXdfZGFzaGJvYXJkIiwidmlld19hbmFseXRpY3MiLCJ2aWV3X3JldmVudWVfc3RhdHMiLCJ2aWV3X2Jvb2tpbmdfc3RhdHMiLCJ2aWV3X3VzZXJfc3RhdHMiLCJ2aWV3X2Jvb2tpbmdzIiwidmlld19ib29raW5nX2RldGFpbHMiLCJ2aWV3X3N1YnNjcmlwdGlvbnMiLCJ2aWV3X3N1YnNjcmlwdGlvbl9kZXRhaWxzIiwidmlld19jdXN0b21lcnMiLCJ2aWV3X2N1c3RvbWVyX2RldGFpbHMiLCJ2aWV3X3BheW1lbnRzIiwidmlld19wYXltZW50X2RldGFpbHMiXX0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    "user": {
      "id": 2,
      "name": "Test Staff",
      "email": "teststaff@example.com",
      "role": "staff",
      "role_id": 2,
      "created_at": "2023-11-01T09:00:00.000000Z",
      "updated_at": "2023-11-01T09:00:00.000000Z"
    }
  }
}
```

## 🔍 **Key Differences from Admin Token:**

### **Permissions INCLUDED in Staff Token:**
- `view_dashboard` ✅
- `view_analytics` ✅
- `view_revenue_stats` ✅
- `view_booking_stats` ✅
- `view_user_stats` ✅
- `view_bookings` ✅
- `view_booking_details` ✅
- `view_subscriptions` ✅
- `view_subscription_details` ✅
- `view_customers` ✅
- `view_customer_details` ✅
- `view_payments` ✅
- `view_payment_details` ✅

### **Permissions EXCLUDED from Staff Token:**
- `view_squrehub_commission` ❌ (This will hide the commission tile)
- `create_users` ❌
- `edit_users` ❌
- `delete_users` ❌
- `manage_permissions` ❌
- `create_roles` ❌
- `edit_roles` ❌
- `delete_roles` ❌
- All other administrative permissions ❌

## 🧪 **How to Test:**

### **Step 1: Update Your Mock Server**
1. Open Postman
2. Go to your mock server collection
3. Find the `/login` endpoint response
4. Replace the response body with the JSON above

### **Step 2: Test the Application**
1. Open your application and login with any credentials
2. Navigate to the dashboard
3. **Expected Result**: The SquareHub commission tile should be **HIDDEN**

### **Step 3: Verify in Browser Console**
```javascript
// Check current user permissions
const permissionsStore = usePermissionsStore();
console.log('User permissions:', permissionsStore.userPermissions);

// Check if user has commission permission
console.log('Has commission.view:', permissionsStore.hasPermission('commission.view'));

// Should return false, confirming the tile should be hidden
```

## 🔄 **Switch Back to Admin Token**

To see the commission tile again, use the admin token with ALL permissions:

### **Admin Token Permissions (Commission Tile Visible):**
```json
{
  "permissions": [
    "view_dashboard",
    "view_analytics", 
    "view_squrehub_commission",
    "view_revenue_stats",
    "view_booking_stats",
    "view_user_stats",
    "view_users",
    "create_users",
    "edit_users",
    "delete_users",
    "activate_users",
    "deactivate_users",
    "view_user_details",
    "view_roles",
    "create_roles",
    "edit_roles",
    "delete_roles",
    "assign_roles",
    "manage_permissions",
    "view_bookings",
    "create_bookings",
    "edit_bookings",
    "delete_bookings",
    "cancel_bookings",
    "approve_bookings",
    "view_booking_details",
    "view_subscriptions",
    "create_subscriptions",
    "edit_subscriptions",
    "cancel_subscriptions",
    "view_subscription_details",
    "view_customers",
    "view_customer_details",
    "view_payments",
    "view_payment_details"
  ]
}
```

## 🎯 **What You Should See:**

### **Without `commission.view` Permission:**
- ✅ Dashboard loads normally
- ✅ Other stats tiles are visible
- ❌ **SquareHub Commission tile is HIDDEN**
- ✅ Fallback message may show: "Contact administrator for commission access"

### **With `commission.view` Permission:**
- ✅ Dashboard loads normally  
- ✅ All stats tiles are visible
- ✅ **SquareHub Commission tile is VISIBLE**
- ✅ Shows commission amount: "LKR 25,000"

## 🚀 **Advanced Testing:**

You can create different user types by modifying the permissions array:

### **Manager (Some Permissions):**
```json
{
  "role": "manager",
  "permissions": [
    "view_dashboard",
    "view_analytics",
    "view_squrehub_commission",
    "view_bookings",
    "edit_bookings",
    "view_customers",
    "view_payments"
  ]
}
```

### **Viewer (Read-Only):**
```json
{
  "role": "viewer", 
  "permissions": [
    "view_dashboard",
    "view_analytics",
    "view_bookings",
    "view_customers"
  ]
}
```

This way you can test different permission combinations and see how the UI responds to each user type!