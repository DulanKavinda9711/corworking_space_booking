# Mock Login API for Testing RBAC System

## Test User Login API

### **API Endpoint:**
```
POST /auth/admin/login
```

### **Test Request:**
```json
{
  "username": "testadmin",
  "password": "admin123"
}
```

### **Mock Response (Success - 200):**
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

## **JWT Token Decoded Payload:**
The token above contains these claims when decoded:

```json
{
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "user_123",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "testadmin",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/permissions": [
    "users.view",
    "users.create",
    "bookings.view",
    "bookings.create",
    "bookings.update",
    "bookings.cancel",
    "companies.view",
    "facilities.view",
    "payments.view",
    "reports.view",
    "commission.view",
    "settings.view",
    "dashboard.view"
  ],
  "exp": 1730064000,
  "iat": 1729977600
}
```

## **Test Scenarios:**

### **Scenario 1: Admin User (Full Access)**
Use the above request/response - user can see everything including SquareHub commission tile.

### **Scenario 2: Manager User (Limited Access)**
**Request:** Same as above

**Response:** Same structure but with different permissions:
```json
{
  "success": true,
  "status_code": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InVzZXJfNDU2IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InRlc3RtYW5hZ2VyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTWFuYWdlciIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcGVybWlzc2lvbnMiOlsiYm9va2luZ3MudmlldyIsImJvb2tpbmdzLmNyZWF0ZSIsImNvbXBhbmllcy52aWV3IiwiZmFjaWxpdGllcy52aWV3IiwiZGFzaGJvYXJkLnZpZXciXSwiZXhwIjoxNzMwMDY0MDAwLCJpYXQiOjE3Mjk5Nzc2MDB9.fake_signature_for_manager",
    "expires_in": 86400,
    "token_type": "Bearer"
  }
}
```

**Manager Token Permissions:**
```json
[
  "bookings.view",
  "bookings.create", 
  "companies.view",
  "facilities.view",
  "dashboard.view"
]
```

### **Scenario 3: Staff User (Basic Access)**
**Request:** Same as above but with username "teststaff"

**Staff Token Permissions:**
```json
[
  "bookings.view",
  "bookings.create",
  "facilities.view",
  "dashboard.view"
]
```

## **How to Test:**

### **1. Create Mock API Response:**
```javascript
// In your mock API or backend
app.post('/auth/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'testadmin' && password === 'admin123') {
    return res.json({
      "success": true,
      "status_code": 200,
      "message": "Login successful",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InVzZXJfMTIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InRlc3RhZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9wZXJtaXNzaW9ucyI6WyJ1c2Vycy52aWV3IiwidXNlcnMuY3JlYXRlIiwiYm9va2luZ3MudmlldyIsImJvb2tpbmdzLmNyZWF0ZSIsImJvb2tpbmdzLnVwZGF0ZSIsImJvb2tpbmdzLmNhbmNlbCIsImNvbXBhbmllcy52aWV3IiwiZmFjaWxpdGllcy52aWV3IiwicGF5bWVudHMudmlldyIsInJlcG9ydHMudmlldyIsImNvbW1pc3Npb24udmlldyIsInNldHRpbmdzLnZpZXciLCJkYXNoYm9hcmQudmlldyJdLCJleHAiOjE3MzAwNjQwMDAsImlhdCI6MTcyOTk3NzYwMH0.fake_signature_for_testing",
        "expires_in": 86400,
        "token_type": "Bearer"
      }
    });
  }
  
  return res.status(401).json({
    "success": false,
    "status_code": 401,
    "message": "Invalid credentials"
  });
});
```

### **2. Test Login Flow:**
1. **Start your frontend application**
2. **Navigate to login page**
3. **Enter credentials:**
   - Username: `testadmin`
   - Password: `admin123`
4. **Click login**

### **3. Expected Results:**
- ✅ **Login succeeds** and redirects to dashboard
- ✅ **SquareHub Commission tile visible** (user has `commission.view` permission)
- ✅ **Can access protected routes** like `/payments`, `/user-management`
- ✅ **Console shows permissions** when you run `usePermissionsStore().debugPermissions()`

### **4. Test Different Permission Levels:**
**Manager User** (limited permissions):
- Username: `testmanager`
- SquareHub Commission tile should be **hidden**
- Cannot access `/payments` or `/user-management`

**Staff User** (basic permissions):
- Username: `teststaff`  
- Most admin features should be **hidden**
- Can only access basic booking functions

## **Quick Testing Commands:**

### **Test in Browser Console:**
```javascript
// Check current permissions
usePermissionsStore().debugPermissions()

// Test specific permission
usePermissionsStore().hasPermission('commission.view')

// Check if user can access route
usePermissionsStore().canAccessRoute(['payments.view'])

// Switch user role for testing
useAuthStore().setUserWithPermissions({ id: '1', role: 'staff' })
```

### **Expected Permission Behavior:**
- **Admin User**: Sees all tiles, can access all routes
- **Manager User**: No commission tile, limited route access  
- **Staff User**: Basic dashboard only, very limited access

This mock response will let you test the complete RBAC system functionality with different permission levels!