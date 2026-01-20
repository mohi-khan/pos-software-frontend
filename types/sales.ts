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
