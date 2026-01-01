//supplier type 
// Type for GET response
export interface GetSupplier {
  supplierId: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  region: string | null
  postalCode: string | null
  country: string | null
  supplierCode: string | null
  note: string | null
  totalOrders: number
  totalSpent: string
  points: string
  availableForSale: boolean
  createdAt: string
  updatedAt: string
}

// Type for CREATE request
export interface CreateSupplierPayload {
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
  supplierCode?: string
  note?: string
  totalOrders?: number
  totalSpent?: string
  points?: string
  availableForSale?: boolean
}

// Type for UPDATE request
export type UpdateSupplierPayload = Partial<CreateSupplierPayload>

// Type for CREATE response
export interface CreateSupplierResponse {
  message: string
  supplier: GetSupplier
}

// Type for UPDATE response
export interface UpdateSupplierResponse {
  message: string
  supplier: GetSupplier
}
