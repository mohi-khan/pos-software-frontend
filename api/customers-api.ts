

import { CreateCustomer, GetCustomer, UpdateCustomer } from '@/types/customer'
import { fetchApi } from '@/utils/http'

// Get all customers
export const getCustomers = async (token: string) => {
  return fetchApi<GetCustomer[]>({
    url: 'api/customers/getAll',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Get customer by ID
export const getCustomerById = async (id: string, token: string) => {
  return fetchApi<GetCustomer>({
    url: `api/customers/get/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Create a new customer
export const createCustomer = async (
  data: { name: string; email: string; phone?: string },
  token: string
) => {
  return fetchApi<CreateCustomer>({
    url: 'api/customers/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Edit/update a customer
export const editCustomer = async (
  id: string,
  data: { name?: string; email?: string; phone?: string },
  token: string
) => {
  return fetchApi<UpdateCustomer>({
    url: `api/customers/update/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Delete a customer
export const deleteCustomer = async (id: string, token: string) => {
  return fetchApi<{ message: string }>({
    url: `api/customers/delete/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}
