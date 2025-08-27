import { ref, computed } from 'vue'

// Sample companies data - this will be shared across components
const companiesData = ref([
  {
    id: 1,
    name: 'WorkHub Co.',
    registrationNumber: 'REG-001-2024',
    address: '123 Business St, New York, NY 10001',
    city: 'New York',
    country: 'USA',
    contactPerson: 'John Smith',
    email: 'john@workhub.com',
    phone: '+1 (555) 123-4567',
    totalSpaces: 15,
    status: 'active',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: 2,
    name: 'FlexSpace Inc.',
    registrationNumber: 'REG-002-2024',
    address: '456 Innovation Ave, San Francisco, CA 94102',
    city: 'San Francisco',
    country: 'USA',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@flexspace.com',
    phone: '+1 (555) 987-6543',
    totalSpaces: 8,
    status: 'active',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: 3,
    name: 'Creative Spaces LLC',
    registrationNumber: 'REG-003-2024',
    address: '789 Design Blvd, Austin, TX 73301',
    city: 'Austin',
    country: 'USA',
    contactPerson: 'Mike Davis',
    email: 'mike@creativespaces.com',
    phone: '+1 (555) 456-7890',
    totalSpaces: 22,
    status: 'inactive',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center'
  }
])

export const useCompanies = () => {
  const companies = companiesData

  const getCompanyById = (id: number) => {
    return computed(() => companies.value.find(company => company.id === parseInt(id.toString())))
  }

  const updateCompanyStatus = (companyId: number, newStatus: string) => {
    const index = companies.value.findIndex(c => c.id === companyId)
    if (index !== -1) {
      companies.value[index].status = newStatus
    }
  }

  const toggleCompanyStatus = (companyId: number) => {
    const company = companies.value.find(c => c.id === companyId)
    if (company) {
      const newStatus = company.status === 'active' ? 'inactive' : 'active'
      updateCompanyStatus(companyId, newStatus)
    }
  }

  const deleteCompany = (companyId: number) => {
    const index = companies.value.findIndex(c => c.id === companyId)
    if (index !== -1) {
      companies.value.splice(index, 1)
    }
  }

  return {
    companies,
    getCompanyById,
    updateCompanyStatus,
    toggleCompanyStatus,
    deleteCompany
  }
}
