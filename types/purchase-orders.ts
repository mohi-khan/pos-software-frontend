// types/purchase-orders.ts

export interface PurchaseOrderItem {
  poItemId?: number
  itemId: number
  quantity: number
  receivedQty?: number
  purchaseCost: string
  amount: string
}

export interface PurchaseOrderAdditionalCost {
  costId?: number
  name: string
  amount: string
}

export interface PurchaseOrder {
  purchaseOrderId?: number
  orderNumber: string
  orderedBy: string
  supplierId: number
  orderDate: string // Format: YYYY-MM-DD
  expectedDate?: string // Format: YYYY-MM-DD
  destinationStoreId?: number | null
  status?: 'Draft' | 'Pending' | 'Partially received' | 'Closed'
  received?: string // Format: "X of Y"
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface GetPurchaseOrder extends PurchaseOrder {
  supplierName?: string // From LEFT JOIN
  items: PurchaseOrderItem[]
  additionalCosts: PurchaseOrderAdditionalCost[]
}

export interface CreatePurchaseOrderPayload {
  order: {
    orderNumber: string
    orderedBy: string
    supplierId: number
    orderDate: string // YYYY-MM-DD
    expectedDate?: string // YYYY-MM-DD
    destinationStoreId?: number
    status?: 'Draft' | 'Pending'
    notes?: string
  }
  items: {
    itemId: number
    quantity: number
    purchaseCost: string
    amount: string
  }[]
  additionalCosts?: {
    name: string
    amount: string
  }[]
}

export interface UpdatePurchaseOrderPayload {
  order?: {
    orderNumber?: string
    orderedBy?: string
    supplierId?: number
    orderDate?: string
    expectedDate?: string
    destinationStoreId?: number
    status?: 'Draft' | 'Pending' | 'Partially received' | 'Closed'
    notes?: string
  }
  items?: {
    itemId: number
    quantity: number
    purchaseCost: string
    amount: string
  }[]
  additionalCosts?: {
    name: string
    amount: string
  }[]
}

export interface CreatePurchaseOrderResponse {
  status: 'success'
  data: {
    purchaseOrderId: number
  }
}

export interface UpdatePurchaseOrderResponse {
  status: 'success'
  data: GetPurchaseOrder
}

export interface DeletePurchaseOrderResponse {
  message: string
}

// // types/purchase-orders.ts

// export interface PurchaseOrderItem {
//   poItemId?: number
//   itemId: number
//   quantity: number
//   receivedQty?: number
//   purchaseCost: string | number
//   amount: string | number
// }

// export interface PurchaseOrderAdditionalCost {
//   costId?: number
//   name: string
//   amount: string | number
// }

// export interface PurchaseOrder {
//   purchaseOrderId?: number
//   orderNumber: string
//   orderedBy: string
//   supplierId: number
//   orderDate: string
//   expectedDate?: string
//   destinationStore?: string
//   status?: 'Draft' | 'Pending' | 'Partially received' | 'Closed'
//   received?: string
//   notes?: string
//   createdAt?: string
//   updatedAt?: string
// }

// export interface GetPurchaseOrder extends PurchaseOrder {
//   items: PurchaseOrderItem[]
//   additionalCosts: PurchaseOrderAdditionalCost[]
// }

// export interface CreatePurchaseOrderPayload {
//   order: Omit<PurchaseOrder, 'purchaseOrderId' | 'createdAt' | 'updatedAt'>
//   items: Omit<PurchaseOrderItem, 'poItemId' | 'purchaseOrderId'>[]
//   additionalCosts?: Omit<PurchaseOrderAdditionalCost, 'costId' | 'purchaseOrderId'>[]
// }

// export interface UpdatePurchaseOrderPayload {
//   order?: Partial<Omit<PurchaseOrder, 'purchaseOrderId' | 'createdAt' | 'updatedAt'>>
//   items?: Omit<PurchaseOrderItem, 'poItemId' | 'purchaseOrderId'>[]
//   additionalCosts?: Omit<PurchaseOrderAdditionalCost, 'costId' | 'purchaseOrderId'>[]
// }

// export interface CreatePurchaseOrderResponse {
//   status: 'success'
//   data: {
//     purchaseOrderId: number
//   }
// }

// export interface UpdatePurchaseOrderResponse {
//   status: 'success'
//   data: GetPurchaseOrder
// }

// export interface DeletePurchaseOrderResponse {
//   message: string
// }