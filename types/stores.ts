// GET type for a store
export type GetStore = {
  storeId: number
  name: string
  address: string
  city: string
  region: string
  postalCode: string
  country: string
  phone: string
  description: string | null
  numberOfPOS: number
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

// CreateStore type
export type CreateStore = {
  name: string
  address: string
  city: string
  region: string
  postalCode: string
  country: string
  phone: string
  description?: string
  numberOfPOS?: number
}

// UpdateStore type
export type UpdateStore = {
  name?: string
  address?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
  phone?: string
  description?: string
  numberOfPOS?: number
}
