'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { toast } from './use-toast'

import { GetItem, CreateItem, UpdateItem } from '@/types/items'
import { getItems, createItem, editItem, deleteItem } from '@/api/items-api'

/* =========================
   GET ITEMS
========================= */
export const useItems = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const query = useQuery<GetItem[] | null, Error>({
    queryKey: ['items'],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')
      const response = await getItems(token)
      return response.data ?? null
    },
    enabled: !!token,
  })

  if (query.error) {
    toast({
      title: 'Failed to fetch items',
      description: query.error.message,
      variant: 'destructive',
    })
  }

  return query
}

/* =========================
   CREATE ITEM
========================= */
export const useCreateItem = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const queryClient = useQueryClient()
  const [token] = useAtom(tokenAtom)

  return useMutation({
    mutationFn: async (data: CreateItem) => {
      if (!token) throw new Error('Token not found')

      // 🔹 Convert strings to numbers
      const payload = {
        ...data,
        price: Number(data.price),
        categoryId: Number(data.categoryId),

        description: data.description ?? undefined, // convert null -> undefined
      }

      // 🔹 Check duplicate item name
      const items = queryClient.getQueryData<GetItem[]>(['items'])
      const isDuplicate = items?.some(
        (item) =>
          item.name.trim().toLowerCase() === payload.name.trim().toLowerCase()
      )
      if (isDuplicate) throw new Error('Item name already exists')

      return createItem(payload, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      onClose()
      reset()
      toast({ title: 'Item created successfully' })
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

/* =========================
   EDIT ITEM
========================= */
export const useEditItem = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const queryClient = useQueryClient()
  const [token] = useAtom(tokenAtom)

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateItem }) => {
      if (!token) throw new Error('Token not found')

      // 🔹 Convert strings to numbers if needed
      const payload = {
        ...data,
        price: data.price !== undefined ? Number(data.price) : undefined,
        categoryId:
          data.categoryId !== undefined ? Number(data.categoryId) : undefined,

        description: data.description ?? undefined, // convert null -> undefined
      }

      // 🔹 Check duplicate name
      const items = queryClient.getQueryData<GetItem[]>(['items'])
      const isDuplicate = payload.name
        ? items?.some(
            (item) =>
              item.name.trim().toLowerCase() ===
              payload.name!.trim().toLowerCase()
          )
        : false
      if (isDuplicate) throw new Error('Item name already exists')

      return editItem(id, payload, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      onClose()
      reset()
      toast({ title: 'Item updated successfully' })
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

/* =========================
   DELETE ITEM
========================= */
export const useDeleteItem = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Token not found')
      return deleteItem(id, token)
    },

    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Item deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },

    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      })
      console.error('Error deleting item:', error)
    },
  })
}
