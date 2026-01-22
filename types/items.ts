
// types/items.ts

export type GetItem = {
  itemId: number
  name: string
  categoryId: number
  categoryName?: string | null // Added from backend join
  description: string | null

  availableForSale: boolean | null
  soldBy: string | null

  price: string | null // Decimal stored as string
  cost: string | null
  margin: string | null

  sku: string | null
  barcode: string | null

  compositeItem: boolean | null
  trackStock: boolean | null

  inStock: number | null
  lowStock: number | null

  primarySupplier: string | null

  color: string | null
  shape: string | null
  imageUrl: string | null

  // Variant-related fields
  variantName: string | null
  variantSku: string | null
  optionName: string | null
  optionValue: string | null
  variantInStock: number | null

  // Composite items - stored as text in DB
  components: string | null

  createdAt: string
  updatedAt: string
}

export type CreateItem = {
  name: string
  categoryId: number
  description?: string | null

  availableForSale?: boolean
  soldBy?: string

  price?: string | number // Accept both, convert to number
  cost?: string | number
  margin?: string | number

  sku?: string
  barcode?: string // Backend auto-generates if not provided

  compositeItem?: boolean
  trackStock?: boolean

  inStock?: number
  lowStock?: number

  primarySupplier?: string

  color?: string
  shape?: string
  imageUrl?: string

  // Variant fields
  variantName?: string
  optionName?: string
  optionValue?: string
  variantSku?: string
  variantInStock?: number

  // Composite items - send as JSON string
  components?: string
}

export type UpdateItem = Partial<CreateItem>

// Helper type for component structure
export type ItemComponent = {
  name: string
  quantity: string | number
  cost: string | number
}

// export type GetItem = {
//   itemId: number
//   name: string
//   categoryId: number
//   description: string | null

//   availableForSale: boolean
//   soldBy: string

//   price: string
//   cost: string
//   margin: string

//   sku: string
//   barcode: string | null

//   compositeItem: boolean
//   trackStock: boolean

//   inStock: number 
//   lowStock: number | null

//   primarySupplier: string | null

//   color: string | null
//   shape: string | null
//   imageUrl: string | null

//   // Variant-related fields
//   variantName: string | null
//   variantSku?: string | null  // Changed from Item[]
//   optionName: string | null
//   optionValue: string | null

//   variantInStock: number | null

//   // Composite items (future use)
//   components: unknown[] | null

//   createdAt: string
//   updatedAt: string
//   expanded:boolean
//   categoryName:string
// }


// export type CreateItem = {
//   name: string
//   categoryId: number
//   description?: string | null

//   availableForSale: boolean
//   soldBy: string

//   price: string
//   cost: string
//   margin?: string

//   sku: string
//   barcode?: string | null

//   compositeItem: boolean
//   trackStock: boolean

//   inStock?: number | null
//   lowStock?: number | null

//   primarySupplier?: string | null

//   color?: string | null
//   shape?: string | null
//   imageUrl?: string | null

//   // Variant fields
//   variantName?: string | null
//   optionName?: string | null
//   optionValue?: string | null
//   variantSku?: string | null
//   variantInStock?: number | null

//   // Composite items
//   components?: unknown[] | null
// }


// export type UpdateItem = Partial<CreateItem>




