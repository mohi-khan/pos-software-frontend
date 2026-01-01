import { CreateSupplierPayload, GetSupplier, UpdateSupplierPayload } from '@/types/supplier'
import { fetchApi } from '@/utils/http'

// Get all suppliers
export const getSuppliers = async (token: string) => {
  return fetchApi<GetSupplier[]>({
    url: 'api/supplier/getAll',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Get supplier by ID
export const getSupplierById = async (id: string, token: string) => {
  return fetchApi<GetSupplier>({
    url: `api/supplier/get/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Create a new supplier
export const createSupplier = async (
  data: {
    name: string
    email?: string
    phone?: string
    address?: string
  },
  token: string
) => {
  return fetchApi<CreateSupplierPayload>({
    url: 'api/supplier/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Edit/update supplier
export const editSupplier = async (
  id: string,
  data: {
    name?: string
    email?: string
    phone?: string
    address?: string
  },
  token: string
) => {
  return fetchApi<UpdateSupplierPayload>({
    url: `api/supplier/update/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Delete supplier
export const deleteSupplier = async (id: string, token: string) => {
  return fetchApi<{ message: string }>({
    url: `api/supplier/delete/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}
