# Router Permission Format Fix

## 🐛 **Problem:**
Router routes were using **old permission format** while JWT tokens contain **new permission format**:

- **Router**: `permissions: ['products.view']`  
- **JWT Token**: `"view_products"`

This caused "Access denied" errors even when users had the correct permissions.

## ✅ **Fixed Routes:**

### **Products Routes:**
```typescript
// OLD: permissions: ['products.view']
// NEW: permissions: ['view_products']
'/products' → requires: 'view_products' ✅
'/products/add' → requires: 'create_products' ✅
'/products/:id' → requires: 'view_products' ✅
'/products/:id/edit' → requires: 'edit_products' ✅
```

### **Facilities Routes:**
```typescript
// OLD: permissions: ['facilities.view']  
// NEW: permissions: ['view_facilities']
'/facilities' → requires: 'view_facilities' ✅
'/facilities/add' → requires: 'create_facilities' ✅
'/facilities/:id' → requires: 'view_facilities' ✅
'/facilities/:id/edit' → requires: 'edit_facilities' ✅
```

### **Locations Routes:**
```typescript
// OLD: No permissions specified
// NEW: Added proper permissions
'/locations' → requires: 'view_locations' ✅
'/locations/add' → requires: 'create_locations' ✅
'/locations/:id' → requires: 'view_locations' ✅
'/locations/:id/edit' → requires: 'edit_locations' ✅
```

### **Booking/Subscription Routes:**
```typescript
// OLD: permissions: ['bookings.cancel']
// NEW: permissions: ['cancel_bookings']
'/bookings/:id/cancel' → requires: 'cancel_bookings' ✅
'/subscriptions/:id' → requires: 'view_subscriptions' ✅  
'/subscriptions/:id/cancel' → requires: 'cancel_subscriptions' ✅
```

## 🎯 **JWT Token Permissions (Working Format):**
```json
{
  "permissions": [
    "view_dashboard",
    "view_analytics", 
    "view_products",     // ← Matches router now
    "edit_products",     // ← Matches router now
    "view_locations",    // ← Matches router now
    "edit_locations",    // ← Matches router now
    "view_facilities",   // ← Would match router
    "edit_facilities",   // ← Would match router
    "view_bookings",
    "cancel_bookings",   // ← Matches router now
    "view_customers",
    "view_payments"
  ]
}
```

## 🚀 **Result:**
- ✅ **Products page**: Now accessible with `view_products` permission
- ✅ **All routes**: Use consistent permission format  
- ✅ **Menu items**: Still hide/show based on permissions
- ✅ **Router guards**: Work correctly with JWT tokens

## 🧪 **Test:**
1. Login with JWT token containing `view_products` permission
2. Click "Products" in sidebar → Should load successfully
3. All permission-based routing now works correctly!