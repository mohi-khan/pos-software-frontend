
import { CreateItem, GetItem, UpdateItem } from '@/types/items'
import { fetchApi } from '@/utils/http'

// Get all items
export const getItems = async (token: string) => {
  return fetchApi<GetItem[]>({
    url: 'api/items/getAll',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Get item by ID
export const getItemById = async (id: string, token: string) => {
  return fetchApi<GetItem>({
    url: `api/items/get/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Create a new item
export const createItem = async (
  data: {
    name: string
    categoryId: number
    price: number
    quantity?: number
    description?: string
  },
  token: string
) => {
  return fetchApi<CreateItem>({
    url: 'api/items/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Edit/update an item
export const editItem = async (
  id: string,
  data: {
    name?: string
    categoryId?: number
    price?: number
    quantity?: number
    description?: string
  },
  token: string
) => {
  return fetchApi<UpdateItem>({
    url: `api/items/update/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Delete an item
export const deleteItem = async (id: string, token: string) => {
  return fetchApi<{ message: string }>({
    url: `api/items/delete/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}
