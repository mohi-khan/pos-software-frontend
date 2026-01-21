/* =====================================================
   GET ALL SALES RESPONSE (ALREADY PROVIDED)
   ===================================================== */

export type GetAllSalesResponse = {
  saleMasterId: number
  paymentType: 'cash' | 'credit'
  customerId: number
  customerName: string
  saleDate: string
  totalQuantity: number
  totalAmount: number
  discountAmount: number
  notes: string | null
  createdBy: number
  createdAt: string
  updatedBy: number | null
  updatedAt: string | null

  Details: {
    saleDetailsId: number
    saleMasterId: number
    itemId: number
    itemName: string
    avgPrice: number
    quantity: number
    amount: number
    unitPrice: number
    createdBy: number
    createdAt: string
    updatedBy: number | null
    updatedAt: string | null
  }[]
}[]

/* =====================================================
   SHARED SALE ITEM PAYLOAD (CREATE / UPDATE)
   ===================================================== */

export type SaleItemPayload = {
  itemId: number
  quantity: number
  unitPrice: number
  avgPrice?: number
  amount: number
}

/* =====================================================
   CREATE SALE TYPES
   ===================================================== */

// Request payload → POST /sales/create
export type CreateSaleRequest = {
  sale: {
    paymentType: 'cash' | 'credit'
    customerId: number
    saleDate: string
    totalQuantity: number
    totalAmount: number
    discountAmount?: number
    notes?: string | null
  }
  items: SaleItemPayload[]
}

// Response → createSaleController
export type CreateSaleResponse = {
  status: 'success'
  data: {
    saleMasterId: number
  }
}

/* =====================================================
   UPDATE SALE TYPES
   ===================================================== */

// Request payload → PATCH /sales/update/:id
export type UpdateSaleRequest = {
  sale?: {
    paymentType?: 'cash' | 'credit'
    customerId?: number
    saleDate?: string
    totalQuantity?: number
    totalAmount?: number
    discountAmount?: number
    notes?: string | null
  }
  items?: SaleItemPayload[]
}

// Response → updateSaleController (getSaleById result)
export type UpdateSaleResponse = {
  status: 'success'
  data: {
    saleMasterId: number
    paymentType: 'cash' | 'credit'
    customerId: number
    saleDate: string
    totalQuantity: number
    totalAmount: number
    discountAmount: number
    notes: string | null
    createdBy: number
    createdAt: string
    updatedBy: number | null
    updatedAt: string | null

    items: {
      saleDetailsId: number
      saleMasterId: number
      itemId: number
      avgPrice: number
      quantity: number
      amount: number
      unitPrice: number
      createdBy: number
      createdAt: string
      updatedBy: number | null
      updatedAt: string | null
    }[]
  }
}


export type GetSaleByIdResponse = {
  status: 'success'
  data: {
    saleMasterId: number
    paymentType: 'cash' | 'credit'
    customerId: number
    saleDate: string
    totalQuantity: number
    totalAmount: number
    discountAmount: number
    notes: string | null
    createdBy: number
    createdAt: string
    updatedBy: number | null
    updatedAt: string | null

    items: {
      saleDetailsId: number
      saleMasterId: number
      itemId: number
      avgPrice: number
      quantity: number
      amount: number
      unitPrice: number
      createdBy: number
      createdAt: string
      updatedBy: number | null
      updatedAt: string | null
    }[]
  }
}
