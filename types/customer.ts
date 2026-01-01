//customer type
export interface GetCustomer {
  customerId: number
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
  customerCode?: string
  note?: string
  totalVisits?: number
  totalSpent?: string
  points?: string
  availableForSale: boolean
  createdAt: string
  updatedAt: string
}

// For creating a new customer
export interface CreateCustomer {
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
  customerCode?: string
  note?: string
  availableForSale?: boolean
}

// For updating an existing customer
export interface UpdateCustomer {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
  customerCode?: string
  note?: string
  availableForSale?: boolean
}