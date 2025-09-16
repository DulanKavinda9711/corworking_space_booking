import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface RewardRequest {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  rewardValue: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedDate: string
  approvedDate?: string
  approvedBy?: string
}

export const useRewardsStore = defineStore('rewards', () => {
  // State
  const rewardRequests = ref<RewardRequest[]>([])
  const customersRewards = ref<Record<string, number>>({})

  // Initialize from localStorage
  const initializeRewards = () => {
    try {
      const savedRequests = localStorage.getItem('rewardRequests')
      if (savedRequests) {
        const parsedRequests = JSON.parse(savedRequests)
        if (Array.isArray(parsedRequests)) {
          rewardRequests.value = parsedRequests
        }
      }

      const savedCustomerRewards = localStorage.getItem('customersRewards')
      if (savedCustomerRewards) {
        customersRewards.value = JSON.parse(savedCustomerRewards)
      }
    } catch (error) {
      console.warn('⚠️ Error initializing rewards from localStorage:', error)
    }
  }

  // Actions
  const addRewardRequest = (request: Omit<RewardRequest, 'id' | 'requestedDate' | 'status'>) => {
    const newRequest: RewardRequest = {
      ...request,
      id: `reward-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      requestedDate: new Date().toISOString()
    }

    rewardRequests.value.push(newRequest)
    saveToLocalStorage()
    return newRequest
  }

  const approveRewardRequest = (requestId: string, approvedBy: string) => {
    const request = rewardRequests.value.find(r => r.id === requestId)
    if (request) {
      request.status = 'approved'
      request.approvedDate = new Date().toISOString()
      request.approvedBy = approvedBy

      // Add reward to customer's total rewards
      if (!customersRewards.value[request.customerId]) {
        customersRewards.value[request.customerId] = 0
      }
      customersRewards.value[request.customerId] += request.rewardValue

      saveToLocalStorage()
      return true
    }
    return false
  }

  const rejectRewardRequest = (requestId: string, approvedBy: string) => {
    const request = rewardRequests.value.find(r => r.id === requestId)
    if (request) {
      request.status = 'rejected'
      request.approvedDate = new Date().toISOString()
      request.approvedBy = approvedBy

      saveToLocalStorage()
      return true
    }
    return false
  }

  const getCustomerRewards = (customerId: string) => {
    return customersRewards.value[customerId] || 0
  }

  const getPendingRequests = () => {
    return rewardRequests.value.filter(request => request.status === 'pending')
  }

  const getApprovedRequests = () => {
    return rewardRequests.value.filter(request => request.status === 'approved')
  }

  const getRejectedRequests = () => {
    return rewardRequests.value.filter(request => request.status === 'rejected')
  }

  const getRequestsByCustomer = (customerId: string) => {
    return rewardRequests.value.filter(request => request.customerId === customerId)
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('rewardRequests', JSON.stringify(rewardRequests.value))
      localStorage.setItem('customersRewards', JSON.stringify(customersRewards.value))
    } catch (error) {
      console.warn('⚠️ Error saving rewards to localStorage:', error)
    }
  }

  // Initialize on store creation
  initializeRewards()

  return {
    // State
    rewardRequests,
    customersRewards,

    // Actions
    initializeRewards,
    addRewardRequest,
    approveRewardRequest,
    rejectRewardRequest,
    getCustomerRewards,
    getPendingRequests,
    getApprovedRequests,
    getRejectedRequests,
    getRequestsByCustomer,
    saveToLocalStorage
  }
})