import { CreateCategory, GetCategory, UpdateCategory } from '@/types/categories'
import { fetchApi } from '@/utils/http'

// Get all categories
export const getCategories = async (token: string) => {
  return fetchApi<GetCategory[]>({
    url: 'api/categories/getAll',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Get category by ID
export const getCategoryById = async (id: string, token: string) => {
  return fetchApi<GetCategory>({
    url: `api/categories/get/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Create a new category
export const createCategory = async (
  data: { name: string; color: string },
  token: string
) => {
  return fetchApi<CreateCategory>({
    url: 'api/categories/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: (data),
  })
}

// Edit/update a category
export const editCategory = async (
  id: string,
  data: { name?: string; color?: string },
  token: string
) => {
  return fetchApi<UpdateCategory>({
    url: `api/categories/update/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: (data),
  })
}

// Delete a category
export const deleteCategory = async (id: string, token: string) => {
  return fetchApi<{ message: string }>({
    url: `api/categories/delete/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}
