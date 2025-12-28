// api/purchase-orders.ts

import {
  CreatePurchaseOrderPayload,
  CreatePurchaseOrderResponse,
  DeletePurchaseOrderResponse,
  GetPurchaseOrder,
  UpdatePurchaseOrderPayload,
  UpdatePurchaseOrderResponse,
} from '@/types/purchase-orders'
import { fetchApi } from '@/utils/http'

// Get all purchase orders
export const getPurchaseOrders = async (token: string) => {
  return fetchApi<GetPurchaseOrder[]>({
    url: 'api/purchaseOrder/getAll',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Get purchase order by ID
export const getPurchaseOrderById = async (id: string, token: string) => {
  return fetchApi<GetPurchaseOrder>({
    url: `api/purchaseOrder/get/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Create a new purchase order
export const createPurchaseOrder = async (
  data: CreatePurchaseOrderPayload,
  token: string
) => {
  return fetchApi<CreatePurchaseOrderResponse>({
    url: 'api/purchaseOrder/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Update purchase order
export const updatePurchaseOrder = async (
  id: string,
  data: UpdatePurchaseOrderPayload,
  token: string
) => {
  return fetchApi<UpdatePurchaseOrderResponse>({
    url: `api/purchaseOrder/update/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Delete purchase order
export const deletePurchaseOrder = async (id: string, token: string) => {
  return fetchApi<DeletePurchaseOrderResponse>({
    url: `api/purchaseOrder/delete/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}