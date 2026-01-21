import {
  GetAllSalesResponse,
  GetSaleByIdResponse,
  CreateSaleRequest,
  CreateSaleResponse,
  UpdateSaleRequest,
  UpdateSaleResponse,
} from '@/types/sales'
import { fetchApi } from '@/utils/http'

/* =====================================================
   GET ALL SALES
   ===================================================== */

export const getSales = async (token: string) => {
  return fetchApi<GetAllSalesResponse>({
    url: 'api/sales/getall',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
}

/* =====================================================
   GET SALE BY ID
   ===================================================== */

export const getSaleById = async (id: string, token: string) => {
  return fetchApi<GetSaleByIdResponse>({
    url: `api/sales/get/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
}

/* =====================================================
   CREATE SALE
   ===================================================== */

export const createSale = async (
  data: CreateSaleRequest,
  token: string
) => {
  return fetchApi<CreateSaleResponse>({
    url: 'api/sales/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: data,
  })
}

/* =====================================================
   UPDATE SALE
   ===================================================== */

export const updateSale = async (
  id: string,
  data: UpdateSaleRequest,
  token: string
) => {
  return fetchApi<UpdateSaleResponse>({
    url: `api/sales/update/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: data,
  })
}

/* =====================================================
   DELETE SALE
   ===================================================== */

export const deleteSale = async (id: string, token: string) => {
  return fetchApi<{ status: 'success' }>({
    url: `api/sales/delete/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
}
