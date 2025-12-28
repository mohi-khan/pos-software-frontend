'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { toast } from './use-toast'

import { GetStore, CreateStore, UpdateStore } from '@/types/stores'
import {
  getStores,
  createStore,
  editStore,
  deleteStore,
} from '@/api/store-api'

/* =========================
   GET STORES
========================= */
export const useStores = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const query = useQuery<GetStore[] | null, Error>({
    queryKey: ['stores'],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')
      const response = await getStores(token)
      return response.data
    },
    enabled: !!token,
  })

  if (query.error) {
    toast({
      title: 'Failed to fetch stores',
      description: query.error.message,
      variant: 'destructive',
    })
  }

  return query
}

/* =========================
   CREATE STORE
========================= */
export const useCreateStore = ({
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
    mutationFn: async (data: CreateStore) => {
      if (!token) throw new Error('Token not found')

      // 🔹 Get cached stores
      const stores = queryClient.getQueryData<GetStore[]>(['stores'])

      // 🔹 Prevent duplicate store name (case-insensitive)
      const isDuplicate = stores?.some(
        (store) =>
          store.name.trim().toLowerCase() === data.name.trim().toLowerCase()
      )

      if (isDuplicate) {
        throw new Error('Store name already exists')
      }

      return createStore(data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      onClose()
      reset()
      toast({ title: 'Store created successfully' })
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
   EDIT STORE
========================= */
export const useEditStore = ({
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
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateStore
    }) => {
      if (!token) throw new Error('Token not found')

      const stores = queryClient.getQueryData<GetStore[]>(['stores'])

      // 🔹 Prevent duplicate name except same store
      const isDuplicate = stores?.some(
        (store) =>
          store.storeId.toString() !== id &&
          store.name.trim().toLowerCase() ===
            data.name?.trim().toLowerCase()
      )

      if (isDuplicate) {
        throw new Error('Store name already exists')
      }

      return editStore(id, data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      onClose()
      reset()
      toast({ title: 'Store updated successfully' })
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
   DELETE STORE
========================= */
export const useDeleteStore = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Token not found')
      return deleteStore(id, token)
    },

    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Store deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },

    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}
