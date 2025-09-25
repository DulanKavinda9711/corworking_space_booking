/**
 * Services Index
 * 
 * Centralized exports for all API services and utilities
 */

// Main API service
export { default as api } from './api'

// Individual API services for specific imports
export {
  authApi,
  bookingApi,
  subscriptionApi,
  customerApi,
  companyApi,
  locationApi,
  facilityApi,
  productApi,
  paymentApi,
  messageApi,
  dashboardApi,
  API_CONFIG,
  createHttpClient
} from './api'

// Types and interfaces
export type {
  ApiResponse,
  LoginCredentials,
  User,
  Booking,
  Customer,
  Company,
  Location,
  Facility,
  Product,
  Payment,
  Message,
  CancellationRequest,
  DashboardStats,
  Admin
} from './api'
