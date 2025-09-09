# Activate/Deactivate Product API Implementation Summary

## 1. API Service Implementation (src/services/api.ts)

Added `toggleProductStatus` method to the `productApi` object:

```typescript
async toggleProductStatus(id: string, isActive: boolean): Promise<ApiResponse<string>> {
  try {
    console.log('API - Toggling product status with id:', id, 'isActive:', isActive)

    // Create request body as per the API documentation
    const requestBody = {
      product_id: parseInt(id), // Convert string ID to number as per API spec
      is_active: isActive
    }

    const response = await fetch(`${API_CONFIG.API_BASE_URL}/product/activate-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('API - Toggle product status response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API - HTTP error! status: ${response.status}, body:`, errorText)
      try {
        const errorJson = JSON.parse(errorText)
        return errorResponse(errorJson.message || `Server error: ${response.status}`)
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }
    }

    const data = await response.json()
    console.log('API - Toggle product status success response:', data)

    if (data.status_code === 200) {
      return successResponse(data.data || null, data.message || 'Product status updated successfully')
    } else {
      return errorResponse(data.message || 'Failed to update product status')
    }
  } catch (error) {
    console.error('API - Toggle product status error:', error)
    return errorResponse('Network error while updating product status', [(error as Error).message])
  }
}
```

## 2. Frontend Integration (src/views/ProductsView.vue)

### Enhanced State Management
- Added loading state tracking: `toggleStatusLoading` (Set<string>)
- Prevents multiple concurrent requests for the same product

### Updated Toggle Function
```typescript
const toggleProductStatus = async (product: Product) => {
  // Prevent multiple concurrent requests for the same product
  if (toggleStatusLoading.value.has(product.id)) {
    return
  }
  
  const originalStatus = product.status
  const newStatus = product.status === 'active' ? 'inactive' : 'active'
  const isActive = newStatus === 'active'
  
  try {
    // Add to loading state
    toggleStatusLoading.value.add(product.id)
    
    // Optimistically update the UI
    product.status = newStatus
    
    // Call the real API to update the status on the server
    const response = await productApi.toggleProductStatus(product.id, isActive)
    
    if (response.success) {
      console.log(`Product ${product.name} status changed to ${product.status}`)
      showSuccess(response.message || `Product ${isActive ? 'activated' : 'deactivated'} successfully`)
    } else {
      console.error('Failed to toggle product status:', response.message)
      // Revert the status change if API call fails
      product.status = originalStatus
      showError(response.message || 'Failed to update product status')
    }
  } catch (error) {
    console.error('Error toggling product status:', error)
    // Revert the status change if API call fails
    product.status = originalStatus
    showError('An error occurred while updating product status')
  } finally {
    // Remove from loading state
    toggleStatusLoading.value.delete(product.id)
  }
}
```

### Enhanced UI Button
- Loading spinner during API calls
- Disabled state to prevent multiple clicks
- Dynamic tooltips based on current state
- Optimistic UI updates with rollback on failure

## 3. API Endpoint Details

**Endpoint**: `POST /api/product/activate-product`

**Request Body**:
```json
{
  "product_id": 4,
  "is_active": true
}
```

**Success Response**:
```json
{
  "status_code": 200,
  "message": "Request processed successfully",
  "data": "Product updated successfully"
}
```

## 4. Features Implemented

✅ Real API integration for product status toggle
✅ Optimistic UI updates with error rollback
✅ Loading states and disabled buttons during API calls
✅ Success/error notifications with auto-dismiss
✅ Prevention of concurrent requests for same product
✅ Proper error handling and user feedback
✅ TypeScript typing and validation
✅ Console logging for debugging
✅ ID conversion (string to number) for API compatibility

## 5. User Experience

1. **Click activate/deactivate button** → Immediate visual feedback
2. **Loading spinner appears** → Indicates API call in progress
3. **Button is disabled** → Prevents multiple requests
4. **Success notification** → Confirms operation completed
5. **Status updates in real-time** → Reflects current state

### Error Handling
- **Network errors**: Status reverts, error notification shown
- **API errors**: Status reverts, API message displayed
- **Concurrent requests**: Ignored to prevent conflicts

The implementation provides a robust, user-friendly activate/deactivate functionality with proper error handling and visual feedback.
