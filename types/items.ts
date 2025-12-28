export type GetItem = {
  itemId: number
  name: string
  categoryId: number
  description: string | null

  availableForSale: boolean
  soldBy: string

  price: string
  cost: string
  margin: string

  sku: string
  barcode: string | null

  compositeItem: boolean
  trackStock: boolean

  inStock: number 
  lowStock: number | null

  primarySupplier: string | null

  color: string | null
  shape: string | null
  imageUrl: string | null

  // Variant-related fields
  variantName: string | null
  optionName: string | null
  optionValue: string | null
  variantSku: string | null
  variantInStock: number | null

  // Composite items (future use)
  components: unknown[] | null

  createdAt: string
  updatedAt: string
  expanded:boolean
  categoryName:string
}


export type CreateItem = {
  name: string
  categoryId: number
  description?: string | null

  availableForSale: boolean
  soldBy: string

  price: string
  cost: string
  margin?: string

  sku: string
  barcode?: string | null

  compositeItem: boolean
  trackStock: boolean

  inStock?: number | null
  lowStock?: number | null

  primarySupplier?: string | null

  color?: string | null
  shape?: string | null
  imageUrl?: string | null

  // Variant fields
  variantName?: string | null
  optionName?: string | null
  optionValue?: string | null
  variantSku?: string | null
  variantInStock?: number | null

  // Composite items
  components?: unknown[] | null
}


export type UpdateItem = Partial<CreateItem>

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
