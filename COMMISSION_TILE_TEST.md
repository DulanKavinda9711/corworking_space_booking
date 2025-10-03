# 🎯 Quick Setup: Test Commission Tile Hiding

## 📋 **Copy-Paste Ready Responses for Postman**

### **Option 1: STAFF User (Commission Tile HIDDEN)**
Copy this response to your Postman mock server `/login` endpoint:

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDb3dvcmtpbmdTcGFjZUJvb2tpbmciLCJhdWQiOiJDb3dvcmtpbmdTcGFjZUJvb2tpbmdVc2VycyIsImlhdCI6MTc1OTMxMDY1MywiZXhwIjoxNzU5MzUzODUzLCJzdWIiOiI0NTYiLCJuYW1lIjoiVGVzdCBTdGFmZiIsImVtYWlsIjoidGVzdHN0YWZmQGV4YW1wbGUuY29tIiwicm9sZSI6InN0YWZmIiwicGVybWlzc2lvbnMiOlsidmlld19kYXNoYm9hcmQiLCJ2aWV3X2FuYWx5dGljcyIsInZpZXdfcmV2ZW51ZV9zdGF0cyIsInZpZXdfYm9va2luZ19zdGF0cyIsInZpZXdfdXNlcl9zdGF0cyIsInZpZXdfYm9va2luZ3MiLCJ2aWV3X2Jvb2tpbmdfZGV0YWlscyIsInZpZXdfc3Vic2NyaXB0aW9ucyIsInZpZXdfc3Vic2NyaXB0aW9uX2RldGFpbHMiLCJ2aWV3X2N1c3RvbWVycyIsInZpZXdfY3VzdG9tZXJfZGV0YWlscyIsInZpZXdfcGF5bWVudHMiLCJ2aWV3X3BheW1lbnRfZGV0YWlscyJdfQ==.mock_signature_for_testing",
    "user": {
      "id": 456,
      "name": "Test Staff",
      "email": "teststaff@example.com",
      "role": "staff",
      "role_id": 456,
      "created_at": "2023-11-01T09:00:00.000000Z",
      "updated_at": "2023-11-01T09:00:00.000000Z"
    }
  }
}
```

**Result**: ❌ SquareHub Commission tile will be **HIDDEN**

---

### **Option 2: ADMIN User (Commission Tile VISIBLE)**
Copy this response to test that the tile shows correctly:

```json
{
  "status": "success",
  "message": "Login successful", 
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDb3dvcmtpbmdTcGFjZUJvb2tpbmciLCJhdWQiOiJDb3dvcmtpbmdTcGFjZUJvb2tpbmdVc2VycyIsImlhdCI6MTc1OTMxMDY1MywiZXhwIjoxNzU5MzUzODUzLCJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCBBZG1pbiIsImVtYWlsIjoidGVzdGFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsidmlld19kYXNoYm9hcmQiLCJ2aWV3X2FuYWx5dGljcyIsInZpZXdfc3F1cmVodWJfY29tbWlzc2lvbiIsInZpZXdfcmV2ZW51ZV9zdGF0cyIsInZpZXdfYm9va2luZ19zdGF0cyIsInZpZXdfdXNlcl9zdGF0cyIsInZpZXdfdXNlcnMiLCJjcmVhdGVfdXNlcnMiLCJlZGl0X3VzZXJzIiwiZGVsZXRlX3VzZXJzIiwiYWN0aXZhdGVfdXNlcnMiLCJkZWFjdGl2YXRlX3VzZXJzIiwidmlld191c2VyX2RldGFpbHMiLCJ2aWV3X3JvbGVzIiwiY3JlYXRlX3JvbGVzIiwiZWRpdF9yb2xlcyIsImRlbGV0ZV9yb2xlcyIsImFzc2lnbl9yb2xlcyIsIm1hbmFnZV9wZXJtaXNzaW9ucyIsInZpZXdfYm9va2luZ3MiLCJjcmVhdGVfYm9va2luZ3MiLCJlZGl0X2Jvb2tpbmdzIiwiZGVsZXRlX2Jvb2tpbmdzIiwiY2FuY2VsX2Jvb2tpbmdzIiwiYXBwcm92ZV9ib29raW5ncyIsInZpZXdfYm9va2luZ19kZXRhaWxzIiwidmlld19zdWJzY3JpcHRpb25zIiwiY3JlYXRlX3N1YnNjcmlwdGlvbnMiLCJlZGl0X3N1YnNjcmlwdGlvbnMiLCJjYW5jZWxfc3Vic2NyaXB0aW9ucyIsInZpZXdfc3Vic2NyaXB0aW9uX2RldGFpbHMiLCJ2aWV3X2N1c3RvbWVycyIsInZpZXdfY3VzdG9tZXJfZGV0YWlscyIsInZpZXdfcGF5bWVudHMiLCJ2aWV3X3BheW1lbnRfZGV0YWlscyJdfQ==.mock_signature_for_testing",
    "user": {
      "id": 123,
      "name": "Test Admin",
      "email": "testadmin@example.com",
      "role": "admin",
      "role_id": 123,
      "created_at": "2023-11-01T09:00:00.000000Z",
      "updated_at": "2023-11-01T09:00:00.000000Z"
    }
  }
}
```

**Result**: ✅ SquareHub Commission tile will be **VISIBLE**

---

## 🧪 **How to Test:**

### **Step 1: Update Postman Mock Server**
1. Open Postman
2. Go to your mock server collection  
3. Find the `/login` POST endpoint
4. Replace the response body with **Option 1** (Staff User)
5. Save the changes

### **Step 2: Test in Your App**
1. Open your Vue app: `npm run dev`
2. Login with any credentials (they don't matter for mock server)
3. Navigate to the dashboard
4. **Look for the SquareHub Commission tile** - it should be **HIDDEN**

### **Step 3: Verify in Browser Console**
Open browser DevTools console and run:
```javascript
// Check current permissions
const permissionsStore = usePermissionsStore();
console.log('Current permissions:', permissionsStore.userPermissions);

// Check specific permission
console.log('Has commission view:', permissionsStore.hasPermission('view_squrehub_commission'));
// Should return: false

// Check if commission tile is hidden
console.log('Commission tile should be hidden:', !permissionsStore.hasPermission('view_squrehub_commission'));
// Should return: true
```

### **Step 4: Test Commission Tile Visible**
1. Go back to Postman
2. Replace the response with **Option 2** (Admin User)  
3. Refresh your app and login again
4. The SquareHub Commission tile should now be **VISIBLE**

---

## 🔍 **Key Differences:**

### **Staff Token Permissions (Commission Hidden):**
- ✅ `view_dashboard`
- ✅ `view_analytics` 
- ❌ `view_squrehub_commission` ← **MISSING - This hides the tile**
- ✅ `view_revenue_stats`
- ✅ Other basic permissions...

### **Admin Token Permissions (Commission Visible):**
- ✅ `view_dashboard`
- ✅ `view_analytics`
- ✅ `view_squrehub_commission` ← **PRESENT - This shows the tile**  
- ✅ `view_revenue_stats`
- ✅ All other permissions...

---

## 🎯 **Expected Behavior:**

### **With Staff Token (No Commission Permission):**
```
Dashboard Layout:
┌─────────────┬─────────────┬─────────────┐
│   Revenue   │   Bookings  │ User Stats  │
│   Stats     │    Stats    │             │
└─────────────┴─────────────┴─────────────┘
┌─────────────────────────────────────────┐
│        [Commission Tile Hidden]         │
└─────────────────────────────────────────┘
```

### **With Admin Token (Has Commission Permission):**
```
Dashboard Layout:
┌─────────────┬─────────────┬─────────────┐
│   Revenue   │   Bookings  │ User Stats  │
│   Stats     │    Stats    │             │
└─────────────┴─────────────┴─────────────┘
┌─────────────────────────────────────────┐
│    SquareHub Commission: LKR 25,000     │
│           [Tile Visible]                │
└─────────────────────────────────────────┘
```

This should perfectly test your RBAC permission system! 🚀