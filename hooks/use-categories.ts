'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { toast } from './use-toast'

import { GetCategory, CreateCategory, UpdateCategory } from '@/types/categories'
import {
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
} from '@/api/categories-api'

// GET hook
export const useCategories = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const query = useQuery<GetCategory[] | null, Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')
      const response = await getCategories(token)
      return response.data // could be null
    },
    enabled: !!token,
  })

  if (query.error) {
    toast({
      title: 'Failed to fetch categories',
      description: query.error.message,
      variant: 'destructive',
    })
  }

  return query
}

// CREATE hook
export const useCreateCategory = ({ onClose, reset }: { onClose: () => void; reset: () => void }) => {
  useInitializeUser()
  const queryClient = useQueryClient()
  const [token] = useAtom(tokenAtom)

  return useMutation({
    mutationFn: async (data: CreateCategory) => {
      if (!token) throw new Error('Token not found')
      return createCategory(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
      reset()
      toast({ title: 'Category created successfully' })
    },
    onError: (err: any) => {
      toast({
        title: 'Create failed',
        description: err.message,
        variant: 'destructive',
      })
    },
  })
}


// UPDATE hook
export const useEditCategory = ({ onClose, reset }: { onClose: () => void; reset: () => void }) => {
  useInitializeUser()
  const queryClient = useQueryClient()
  const [token] = useAtom(tokenAtom)

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategory }) => {
      if (!token) throw new Error('Token not found')
      return editCategory(id, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
      reset()
      toast({ title: 'Category updated successfully' })
    },
    onError: (err: any) => {
      toast({
        title: 'Update failed',
        description: err.message,
        variant: 'destructive',
      })
    },
  })
}


// DELETE hook
export const useDeleteCategory = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id, token),
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Category deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error: any) => {
      console.error('Error deleting category:', error)
    },
  })

  return mutation
}
