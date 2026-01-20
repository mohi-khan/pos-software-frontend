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
  variantSku?: string | null  // Changed from Item[]
  optionName: string | null
  optionValue: string | null

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




