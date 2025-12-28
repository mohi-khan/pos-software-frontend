import { CreateStore, GetStore, UpdateStore } from '@/types/stores'
import { fetchApi } from '@/utils/http'

// Get all stores
export const getStores = async (token: string) => {
  return fetchApi<GetStore[]>({
    url: 'api/stores/getAll',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Get store by ID
export const getStoreById = async (id: string, token: string) => {
  return fetchApi<GetStore>({
    url: `api/stores/get/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Create a new store
export const createStore = async (
  data: CreateStore,
  token: string
) => {
  return fetchApi<CreateStore>({
    url: 'api/stores/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Edit/update a store
export const editStore = async (
  id: string,
  data: UpdateStore,
  token: string
) => {
  return fetchApi<UpdateStore>({
    url: `api/stores/update/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}

// Delete a store
export const deleteStore = async (id: string, token: string) => {
  return fetchApi<{ message: string }>({
    url: `api/stores/delete/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}
