# RBAC Backend API Specification

## Overview
This document specifies the backend API endpoints required to support the Role-Based Access Control (RBAC) system implemented in the frontend.

## Base URL
```
https://your-api-domain.com/api/v1
```

## Authentication
All endpoints require JWT authentication unless specified otherwise.
```
Authorization: Bearer {jwt_token}
```

---

## 1. Authentication & User Management

### 1.1 Admin Login
**Endpoint:** `POST /auth/admin/login`

**Request Body:**
```json
{
  "username": "admin_user",
  "password": "admin_password"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400,
    "token_type": "Bearer"
  }
}
```

**JWT Token Claims:**
```json
{
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "user_id_123",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "admin_username",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/permissions": [
    "users.view",
    "users.create",
    "bookings.view",
    "bookings.create"
  ],
  "exp": 1635724800,
  "iat": 1635638400
}
```

**Response (Password Change Required - 403):**
```json
{
  "success": false,
  "status_code": 403,
  "message": "Password change required",
  "data": null
}
```

**Response (Invalid Credentials - 401):**
```json
{
  "success": false,
  "status_code": 401,
  "message": "Invalid username or password",
  "data": null
}
```

---

## 2. Permission Management

### 2.1 Get All Permissions
**Endpoint:** `GET /permissions`

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Permissions retrieved successfully",
  "data": [
    {
      "id": 1,
      "code_name": "users.view",
      "description": "View users and user details",
      "category": "User Management",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "code_name": "users.create",
      "description": "Create new users",
      "category": "User Management",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 2.2 Create Permission
**Endpoint:** `POST /permissions`

**Request Body:**
```json
{
  "code_name": "custom.permission",
  "description": "Custom permission description",
  "category": "Custom Category"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "status_code": 201,
  "message": "Permission created successfully",
  "data": {
    "id": 50,
    "code_name": "custom.permission",
    "description": "Custom permission description",
    "category": "Custom Category",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

### 2.3 Update Permission
**Endpoint:** `PUT /permissions/{id}`

**Request Body:**
```json
{
  "code_name": "updated.permission",
  "description": "Updated permission description",
  "category": "Updated Category"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Permission updated successfully",
  "data": {
    "id": 50,
    "code_name": "updated.permission",
    "description": "Updated permission description",
    "category": "Updated Category",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z"
  }
}
```

### 2.4 Delete Permission
**Endpoint:** `DELETE /permissions/{id}`

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Permission deleted successfully",
  "data": null
}
```

---

## 3. Role Management

### 3.1 Get All Roles
**Endpoint:** `GET /roles`

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": "role_123",
      "name": "Administrator",
      "description": "Full system administrator",
      "is_active": true,
      "permissions": [
        {
          "id": 1,
          "code_name": "users.view",
          "description": "View users and user details"
        },
        {
          "id": 2,
          "code_name": "users.create",
          "description": "Create new users"
        }
      ],
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 3.2 Create Role
**Endpoint:** `POST /roles`

**Request Body:**
```json
{
  "name": "Custom Manager",
  "description": "Custom manager role with specific permissions",
  "is_active": true,
  "permission_ids": [1, 2, 5, 8, 12]
}
```

**Alternative Request (with permission codes):**
```json
{
  "name": "Custom Manager",
  "description": "Custom manager role with specific permissions",
  "is_active": true,
  "permissions": [
    "users.view",
    "bookings.view",
    "bookings.create",
    "companies.view",
    "facilities.view"
  ]
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "status_code": 201,
  "message": "Role created successfully",
  "data": {
    "id": "role_456",
    "name": "Custom Manager",
    "description": "Custom manager role with specific permissions",
    "is_active": true,
    "permissions": [
      {
        "id": 1,
        "code_name": "users.view",
        "description": "View users and user details"
      },
      {
        "id": 2,
        "code_name": "bookings.view",
        "description": "View bookings and booking details"
      }
    ],
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

### 3.3 Update Role
**Endpoint:** `PUT /roles/{id}`

**Request Body:**
```json
{
  "name": "Updated Role Name",
  "description": "Updated role description",
  "is_active": true,
  "permission_ids": [1, 3, 5, 7, 9, 11]
}
```

### 3.4 Delete Role
**Endpoint:** `DELETE /roles/{id}`

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Role deleted successfully",
  "data": null
}
```

### 3.5 Get Role Details
**Endpoint:** `GET /roles/{id}`

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Role retrieved successfully",
  "data": {
    "id": "role_123",
    "name": "Administrator",
    "description": "Full system administrator",
    "is_active": true,
    "permissions": [
      {
        "id": 1,
        "code_name": "users.view",
        "description": "View users and user details",
        "category": "User Management"
      }
    ],
    "users_count": 5,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

---

## 4. User Permission Management

### 4.1 Get User Permissions
**Endpoint:** `GET /users/{user_id}/permissions`

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "User permissions retrieved successfully",
  "data": {
    "user_id": "user_123",
    "username": "admin_user",
    "role": {
      "id": "role_456",
      "name": "Administrator",
      "description": "Full system administrator"
    },
    "permissions": [
      "users.view",
      "users.create",
      "users.update",
      "users.delete",
      "bookings.view",
      "bookings.create",
      "settings.view"
    ],
    "effective_permissions": [
      "users.view",
      "users.create", 
      "bookings.view",
      "dashboard.view"
    ]
  }
}
```

### 4.2 Assign Role to User
**Endpoint:** `POST /users/{user_id}/roles`

**Request Body:**
```json
{
  "role_id": "role_456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Role assigned to user successfully",
  "data": {
    "user_id": "user_123",
    "role_id": "role_456",
    "assigned_at": "2025-01-01T12:00:00Z"
  }
}
```

### 4.3 Remove Role from User
**Endpoint:** `DELETE /users/{user_id}/roles/{role_id}`

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Role removed from user successfully",
  "data": null
}
```

---

## 5. Permission Checking

### 5.1 Check User Permission
**Endpoint:** `GET /users/{user_id}/permissions/check`

**Query Parameters:**
```
permission=users.view
permissions=users.view,bookings.create
require_all=false
```

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Permission check completed",
  "data": {
    "user_id": "user_123",
    "has_permission": true,
    "checked_permissions": ["users.view", "bookings.create"],
    "granted_permissions": ["users.view"],
    "denied_permissions": ["bookings.create"],
    "require_all": false
  }
}
```

---

## 6. Dashboard & Analytics

### 6.1 Dashboard Statistics (with permissions)
**Endpoint:** `GET /dashboard/stats`

**Response (Success - 200):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "todays_booking_count": 25,
    "upcoming_booking_count": 45,
    "todays_cancelled_booking_count": 3,
    "todays_revenue": 15000.50,
    "square_hub_commission": 750.25,
    "user_permissions": [
      "dashboard.view",
      "view_analytics",
      "view_squrehub_commission"
    ]
  }
}
```

---

## 7. Error Responses

### Common Error Responses

**Unauthorized (401):**
```json
{
  "success": false,
  "status_code": 401,
  "message": "Unauthorized access",
  "data": null
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "status_code": 403,
  "message": "Insufficient permissions",
  "data": {
    "required_permissions": ["users.create"],
    "user_permissions": ["users.view"]
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "status_code": 404,
  "message": "Resource not found",
  "data": null
}
```

**Validation Error (422):**
```json
{
  "success": false,
  "status_code": 422,
  "message": "Validation failed",
  "data": {
    "errors": {
      "name": ["The name field is required."],
      "permissions": ["At least one permission must be selected."]
    }
  }
}
```

**Server Error (500):**
```json
{
  "success": false,
  "status_code": 500,
  "message": "Internal server error",
  "data": null
}
```

---

## 8. Database Schema Recommendations

### 8.1 Users Table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 8.2 Roles Table
```sql
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 8.3 Permissions Table
```sql
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 8.4 User Roles Junction Table
```sql
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role_id)
);
```

### 8.5 Role Permissions Junction Table
```sql
CREATE TABLE role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id VARCHAR(36) NOT NULL,
    permission_id INT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);
```

---

## 9. Frontend Integration Points

### 9.1 API Service Configuration
Update `src/services/api.ts`:

```typescript
// Permission API endpoints
export const permissionApi = {
  // Get all permissions
  getAllPermissions: () => apiRequest<Permission[]>('GET', '/permissions'),
  
  // Create permission
  createPermission: (data: CreatePermissionRequest) => 
    apiRequest<Permission>('POST', '/permissions', data),
  
  // Update permission
  updatePermission: (id: number, data: UpdatePermissionRequest) => 
    apiRequest<Permission>('PUT', `/permissions/${id}`, data),
  
  // Delete permission
  deletePermission: (id: number) => 
    apiRequest<void>('DELETE', `/permissions/${id}`),
}

// Role API endpoints
export const roleApi = {
  // Get all roles
  getAllRoles: () => apiRequest<Role[]>('GET', '/roles'),
  
  // Create role
  createRole: (data: CreateRoleRequest) => 
    apiRequest<Role>('POST', '/roles', data),
  
  // Update role
  updateRole: (id: string, data: UpdateRoleRequest) => 
    apiRequest<Role>('PUT', `/roles/${id}`, data),
  
  // Delete role
  deleteRole: (id: string) => 
    apiRequest<void>('DELETE', `/roles/${id}`),
  
  // Get role details
  getRoleDetails: (id: string) => 
    apiRequest<Role>('GET', `/roles/${id}`),
}

// User permission API endpoints
export const userPermissionApi = {
  // Get user permissions
  getUserPermissions: (userId: string) => 
    apiRequest<UserPermissions>('GET', `/users/${userId}/permissions`),
  
  // Assign role to user
  assignRole: (userId: string, roleId: string) => 
    apiRequest<UserRole>('POST', `/users/${userId}/roles`, { role_id: roleId }),
  
  // Remove role from user
  removeRole: (userId: string, roleId: string) => 
    apiRequest<void>('DELETE', `/users/${userId}/roles/${roleId}`),
  
  // Check user permission
  checkPermission: (userId: string, permissions: string[], requireAll = false) => 
    apiRequest<PermissionCheck>('GET', `/users/${userId}/permissions/check`, {
      params: { permissions: permissions.join(','), require_all: requireAll }
    }),
}
```

### 9.2 Type Definitions
Add to your TypeScript definitions:

```typescript
// Permission types
interface Permission {
  id: number
  code_name: string
  description: string
  category: string
  created_at: string
  updated_at: string
}

interface CreatePermissionRequest {
  code_name: string
  description: string
  category: string
}

interface UpdatePermissionRequest {
  code_name?: string
  description?: string
  category?: string
}

// Role types
interface Role {
  id: string
  name: string
  description: string
  is_active: boolean
  permissions: Permission[]
  users_count?: number
  created_at: string
  updated_at: string
}

interface CreateRoleRequest {
  name: string
  description: string
  is_active: boolean
  permission_ids?: number[]
  permissions?: string[]
}

interface UpdateRoleRequest {
  name?: string
  description?: string
  is_active?: boolean
  permission_ids?: number[]
  permissions?: string[]
}

// User permission types
interface UserPermissions {
  user_id: string
  username: string
  role: {
    id: string
    name: string
    description: string
  }
  permissions: string[]
  effective_permissions: string[]
}

interface UserRole {
  user_id: string
  role_id: string
  assigned_at: string
}

interface PermissionCheck {
  user_id: string
  has_permission: boolean
  checked_permissions: string[]
  granted_permissions: string[]
  denied_permissions: string[]
  require_all: boolean
}
```

---

## 10. Implementation Priority

### Phase 1 (Essential)
1. **Authentication APIs** - Login with JWT tokens containing permissions
2. **Permission Management** - Get all permissions endpoint
3. **User Permissions** - Get user permissions endpoint
4. **Basic RBAC** - Role assignment and permission checking

### Phase 2 (Extended Features)
1. **Role Management** - Full CRUD operations for roles
2. **Permission CRUD** - Create, update, delete permissions
3. **Advanced Permission Checking** - Bulk permission validation
4. **User Role Management** - Assign/remove roles from users

### Phase 3 (Advanced Features)
1. **Audit Logging** - Track permission changes and access
2. **Permission Analytics** - Usage statistics and reporting
3. **Bulk Operations** - Mass permission assignments
4. **Permission Dependencies** - Hierarchical permission relationships

---

## 11. Security Considerations

### 11.1 JWT Token Security
- Include user permissions in JWT claims
- Set appropriate token expiration times
- Implement token refresh mechanism
- Validate permissions on every protected endpoint

### 11.2 Permission Validation
- Always validate permissions on the backend
- Don't rely solely on frontend permission checks
- Implement middleware for route-level permission checking
- Log permission violations for security monitoring

### 11.3 Role Management Security
- Restrict role management to super admins only
- Implement role hierarchy to prevent privilege escalation
- Audit all role and permission changes
- Implement approval workflows for sensitive permission changes

---

This specification provides a complete backend API structure for your RBAC system. The frontend is already configured to work with these endpoints once you implement them in your backend.