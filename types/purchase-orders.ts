// types/purchase-orders.ts

export interface PurchaseOrderItem {
  poItemId?: number
  itemId: number
  quantity: number
  receivedQty?: number
  purchaseCost: string | number
  amount: string | number
}

export interface PurchaseOrderAdditionalCost {
  costId?: number
  name: string
  amount: string | number
}

export interface PurchaseOrder {
  purchaseOrderId?: number
  orderNumber: string
  orderedBy: string
  supplierId: number
  orderDate: string
  expectedDate?: string
  destinationStore?: string
  status?: 'Draft' | 'Pending' | 'Partially received' | 'Closed'
  received?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface GetPurchaseOrder extends PurchaseOrder {
  items: PurchaseOrderItem[]
  additionalCosts: PurchaseOrderAdditionalCost[]
}

export interface CreatePurchaseOrderPayload {
  order: Omit<PurchaseOrder, 'purchaseOrderId' | 'createdAt' | 'updatedAt'>
  items: Omit<PurchaseOrderItem, 'poItemId' | 'purchaseOrderId'>[]
  additionalCosts?: Omit<PurchaseOrderAdditionalCost, 'costId' | 'purchaseOrderId'>[]
}

export interface UpdatePurchaseOrderPayload {
  order?: Partial<Omit<PurchaseOrder, 'purchaseOrderId' | 'createdAt' | 'updatedAt'>>
  items?: Omit<PurchaseOrderItem, 'poItemId' | 'purchaseOrderId'>[]
  additionalCosts?: Omit<PurchaseOrderAdditionalCost, 'costId' | 'purchaseOrderId'>[]
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