# Complete Guide: Hide Components Based on Permissions

Your system now **completely hides** components and menu items when users don't have permissions, instead of just disabling them.

## ✅ **What's Already Working:**

### **1. Sidebar Navigation - Auto-Hidden**
Menu items are now **completely hidden** based on permissions:

```vue
<!-- AdminLayout.vue - Navigation automatically filters items -->
<router-link
  v-for="item in visibleMenuItems"  <!-- Only shows items user can access -->
  :key="item.name"
  :to="item.path"
>
  {{ item.name }}
</router-link>
```

**Result**: If user doesn't have `view_facilities` permission, the **Facilities menu item completely disappears**.

### **2. Dashboard Commission Tile - Hidden**
```vue
<!-- DashboardView.vue - Commission tile uses PermissionGuard -->
<PermissionGuard permission="view_squrehub_commission">
  <div class="commission-tile">
    <!-- Commission content -->
  </div>
</PermissionGuard>
```

**Result**: If user doesn't have `view_squrehub_commission` permission, the **commission tile is completely hidden**.

## 🎯 **How to Hide Any Component:**

### **Method 1: Using PermissionGuard Component (Recommended)**

```vue
<template>
  <!-- Hide entire sections -->
  <PermissionGuard permission="edit_users">
    <div class="user-edit-section">
      <h3>Edit User Details</h3>
      <form>
        <!-- Edit form -->
      </form>
    </div>
  </PermissionGuard>

  <!-- Hide buttons -->
  <PermissionGuard permission="delete_customers">
    <button class="btn-danger">Delete Customer</button>
  </PermissionGuard>

  <!-- Hide multiple components with different permissions -->
  <PermissionGuard :permissions="['create_bookings', 'edit_bookings']" :require-all="false">
    <div class="booking-actions">
      <button>Create Booking</button>
      <button>Modify Booking</button>
    </div>
  </PermissionGuard>
</template>

<script setup>
import PermissionGuard from '@/components/ui/PermissionGuard.vue'
</script>
```

### **Method 2: Using Composable (For Complex Logic)**

```vue
<template>
  <!-- Hide form fields -->
  <div class="form-section">
    <input v-if="canEditBasicInfo" type="text" placeholder="Name">
    <input v-if="canEditEmail" type="email" placeholder="Email">
    <input v-if="canEditSalary" type="number" placeholder="Salary">
  </div>

  <!-- Hide action buttons -->
  <div class="action-buttons">
    <button v-if="canCreate">Create</button>
    <button v-if="canEdit">Edit</button>
    <button v-if="canDelete">Delete</button>
    <button v-if="canApprove">Approve</button>
  </div>
</template>

<script setup>
import { usePermissions } from '@/composables/usePermissions'

const { hasPermission } = usePermissions()

// Computed properties for clean template
const canEditBasicInfo = computed(() => hasPermission('edit_users'))
const canEditEmail = computed(() => hasPermission('edit_user_email'))
const canEditSalary = computed(() => hasPermission('edit_user_salary'))
const canCreate = computed(() => hasPermission('create_users'))
const canEdit = computed(() => hasPermission('edit_users'))
const canDelete = computed(() => hasPermission('delete_users'))
const canApprove = computed(() => hasPermission('approve_users'))
</script>
```

### **Method 3: Direct Store Access**

```vue
<template>
  <!-- Hide tabs -->
  <div class="tabs">
    <button v-if="permissionsStore.hasPermission('view_bookings')">Bookings</button>
    <button v-if="permissionsStore.hasPermission('view_customers')">Customers</button>
    <button v-if="permissionsStore.hasPermission('view_payments')">Payments</button>
    <button v-if="permissionsStore.hasPermission('view_reports')">Reports</button>
  </div>

  <!-- Hide table columns -->
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th v-if="permissionsStore.hasPermission('view_user_salary')">Salary</th>
        <th v-if="permissionsStore.hasPermission('view_user_details')">Details</th>
        <th v-if="hasAnyAdminPermission">Actions</th>
      </tr>
    </thead>
  </table>
</template>

<script setup>
import { computed } from 'vue'
import { usePermissionsStore } from '@/stores/permissions'

const permissionsStore = usePermissionsStore()

const hasAnyAdminPermission = computed(() => 
  permissionsStore.hasAnyPermission(['edit_users', 'delete_users', 'activate_users'])
)
</script>
```

## 🎨 **Real-World Examples:**

### **Customer Management Page**
```vue
<template>
  <div class="customer-page">
    <!-- Hide create button -->
    <PermissionGuard permission="create_customers">
      <button class="btn-primary">Add New Customer</button>
    </PermissionGuard>

    <!-- Customer list with conditional actions -->
    <div v-for="customer in customers" :key="customer.id" class="customer-card">
      <h3>{{ customer.name }}</h3>
      
      <!-- Hide sensitive information -->
      <PermissionGuard permission="view_customer_details">
        <p>Phone: {{ customer.phone }}</p>
        <p>Address: {{ customer.address }}</p>
      </PermissionGuard>

      <!-- Hide action buttons -->
      <div class="actions">
        <PermissionGuard permission="edit_customers">
          <button>Edit</button>
        </PermissionGuard>
        <PermissionGuard permission="delete_customers">
          <button class="btn-danger">Delete</button>
        </PermissionGuard>
      </div>
    </div>
  </div>
</template>
```

### **Booking Form with Role-Based Fields**
```vue
<template>
  <form class="booking-form">
    <!-- Basic fields - everyone can see -->
    <input v-model="booking.customerName" placeholder="Customer Name">
    <input v-model="booking.date" type="date">

    <!-- Hide price fields for non-admin users -->
    <PermissionGuard :permissions="['edit_pricing', 'view_payments']" :require-all="false">
      <div class="pricing-section">
        <input v-model="booking.price" type="number" placeholder="Price">
        <input v-model="booking.discount" type="number" placeholder="Discount">
      </div>
    </PermissionGuard>

    <!-- Hide approval section -->
    <PermissionGuard permission="approve_bookings">
      <div class="approval-section">
        <label>
          <input type="checkbox" v-model="booking.requiresApproval">
          Requires Approval
        </label>
      </div>
    </PermissionGuard>

    <!-- Submit buttons based on permissions -->
    <div class="form-actions">
      <PermissionGuard permission="create_bookings">
        <button type="submit">Create Booking</button>
      </PermissionGuard>
      <PermissionGuard permission="approve_bookings">
        <button type="button" @click="approveBooking">Approve & Create</button>
      </PermissionGuard>
    </div>
  </form>
</template>
```

## 🚀 **Current System Status:**

### ✅ **Already Hidden:**
- **Sidebar Menu Items**: Facilities, Products, Locations, etc. (hidden if no permission)
- **Commission Tile**: Hidden if no `view_squrehub_commission` permission
- **All PermissionGuard Components**: Completely hidden when no access

### 📋 **Menu Items Permission Mapping:**
- Dashboard → `view_dashboard`
- Bookings → `view_bookings`  
- Customers → `view_customers`
- Messages → `view_messages`
- Facilities → `view_facilities`
- Products → `view_products`
- Locations → `view_locations`
- Payments → `view_payments`
- Promotions → `view_promotions`
- User Management → `view_users`

## 🧪 **Testing:**

1. **Login with limited permissions** (without `view_facilities`)
2. **Check sidebar** - Facilities menu item should be completely gone
3. **Login without commission permission** - Commission tile should be hidden
4. **Check all pages** - Only show components user can access

Your system now **completely hides** unauthorized content instead of just disabling it! 🎯