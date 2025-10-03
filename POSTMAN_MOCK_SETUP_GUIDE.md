# Postman Mock Server Setup for RBAC Testing

## ✅ **Updated Configuration**
Your API base URL has been updated to: `https://53d8acbd-6f60-474b-a0d7-78f87db04cc7.mock.pstmn.io`

## 🔧 **Postman Mock API Setup**

### **1. Create Login Endpoint**
In your Postman mock server, create this endpoint:

**Method:** `POST`  
**URL:** `https://53d8acbd-6f60-474b-a0d7-78f87db04cc7.mock.pstmn.io/auth/login`

### **2. Mock Response for Testing**
Set up the response to return this JSON when called:

```json
{
  "success": true,
  "status_code": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InVzZXJfMTIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InRlc3RhZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9wZXJtaXNzaW9ucyI6WyJ1c2Vycy52aWV3IiwidXNlcnMuY3JlYXRlIiwiYm9va2luZ3MudmlldyIsImJvb2tpbmdzLmNyZWF0ZSIsImJvb2tpbmdzLnVwZGF0ZSIsImJvb2tpbmdzLmNhbmNlbCIsImNvbXBhbmllcy52aWV3IiwiZmFjaWxpdGllcy52aWV3IiwicGF5bWVudHMudmlldyIsInJlcG9ydHMudmlldyIsImNvbW1pc3Npb24udmlldyIsInNldHRpbmdzLnZpZXciLCJkYXNoYm9hcmQudmlldyJdLCJleHAiOjE3MzAwNjQwMDAsImlhdCI6MTcyOTk3NzYwMH0.fake_signature_for_testing",
    "expires_in": 86400,
    "token_type": "Bearer"
  }
}
```

### **3. Test Credentials**
Your mock should respond to these login credentials:
```json
{
  "username": "testadmin",
  "password": "admin123"
}
```

### **4. Different User Types (Optional)**
You can create multiple responses based on request matching:

**Admin User** (Full Permissions):
- Username: `testadmin`
- Token includes: `commission.view`, `users.create`, `payments.view`, etc.

**Manager User** (Limited Permissions):
- Username: `testmanager` 
- Token includes: `bookings.view`, `companies.view` (no `commission.view`)

**Staff User** (Basic Permissions):
- Username: `teststaff`
- Token includes: `bookings.view`, `dashboard.view` only

## 🧪 **Testing the RBAC System**

### **1. Start Your Development Server**
```bash
npm run dev
```

### **2. Test Login Flow**
1. Navigate to your login page
2. Enter credentials: `testadmin` / `admin123`
3. Click login

### **3. Expected Results**
- ✅ **Login succeeds** and redirects to dashboard
- ✅ **SquareHub Commission tile visible** (user has `commission.view` permission)
- ✅ **Can access protected routes** like `/payments`, `/user-management`
- ✅ **Console shows permissions** when you run `usePermissionsStore().debugPermissions()`

### **4. Test Permission-Based Features**
After login, test these features:

**Dashboard:**
- SquareHub commission tile should be visible for admin users
- Hidden for users without `commission.view` permission

**Navigation:**
- Try accessing `/payments` - should work for admin
- Try accessing `/user-management` - should work for admin
- Try accessing restricted routes with different user types

**Browser Console Testing:**
```javascript
// Check current user permissions
usePermissionsStore().debugPermissions()

// Test specific permissions
usePermissionsStore().hasPermission('commission.view')  // Should return true for admin

// Test route access
usePermissionsStore().canAccessRoute(['payments.view'])  // Should return true for admin
```

## 🔍 **Troubleshooting**

### **If Login Doesn't Work:**
1. Check browser network tab for the API call
2. Verify the mock server is responding
3. Check console for any JavaScript errors
4. Ensure the JWT token is properly formatted

### **If Permissions Don't Work:**
1. Check if JWT token contains permission claims
2. Verify the token is being decoded correctly
3. Test permission store methods in browser console

### **Mock Server Tips:**
- Make sure your Postman mock server is active
- Test the endpoint directly in Postman first
- Check that the response format matches exactly
- Ensure CORS is enabled if needed

## 🎯 **Next Steps**

Once this login works with your mock server:

1. **Test different user roles** by changing the permissions in the JWT token
2. **Add more mock endpoints** as needed for other features
3. **Implement real backend APIs** using the same request/response format
4. **Test the complete RBAC system** with role creation and management

The frontend is now configured to use your Postman mock server for authentication. The RBAC system will work with any user permissions included in the JWT token response!