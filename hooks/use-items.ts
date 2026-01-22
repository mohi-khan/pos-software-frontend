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

  const query = useQuery<GetItem[], Error>({
    queryKey: ['items'],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')
      const response = await getItems(token)
      // Backend returns array directly or in data field
      return Array.isArray(response) ? response : response.data ?? []
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

      // Convert to backend format
      const payload: any = {
        name: data.name.trim(),
        categoryId: Number(data.categoryId),
        description: data.description || null,
        availableForSale: data.availableForSale ?? true,
        soldBy: data.soldBy || 'Each',
        sku: data.sku || null,
        barcode: data.barcode || null, // Backend auto-generates if null
        compositeItem: data.compositeItem ?? false,
        trackStock: data.trackStock ?? false,
        inStock: data.inStock ? Number(data.inStock) : 0,
        lowStock: data.lowStock ? Number(data.lowStock) : null,
        primarySupplier: data.primarySupplier || null,
        color: data.color || '#FFFFFF',
        shape: data.shape || 'check',
        imageUrl: data.imageUrl || null,
        variantName: data.variantName || null,
        optionName: data.optionName || null,
        optionValue: data.optionValue || null,
        variantSku: data.variantSku || null,
        variantInStock: data.variantInStock ? Number(data.variantInStock) : null,
        components: data.components || null,
      }

      // Convert price/cost/margin to decimal strings or null
      if (data.price) {
        payload.price = String(Number(data.price))
      }
      if (data.cost) {
        payload.cost = String(Number(data.cost))
      }
      if (data.margin) {
        payload.margin = String(Number(data.margin))
      }

      return createItem(payload, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      onClose()
      reset()
      toast({ title: 'Item created successfully' })
    },

    onError: (err: any) => {
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to create item'
      toast({
        title: 'Create failed',
        description: errorMsg,
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
    mutationFn: async ({ id, data }: { id: number; data: UpdateItem }) => {
      if (!token) throw new Error('Token not found')

      // Build payload with only provided fields
      const payload: any = {}

      if (data.name !== undefined) payload.name = data.name.trim()
      if (data.categoryId !== undefined) payload.categoryId = Number(data.categoryId)
      if (data.description !== undefined) payload.description = data.description || null
      if (data.availableForSale !== undefined) payload.availableForSale = data.availableForSale
      if (data.soldBy !== undefined) payload.soldBy = data.soldBy
      if (data.sku !== undefined) payload.sku = data.sku || null
      if (data.barcode !== undefined) payload.barcode = data.barcode || null
      if (data.compositeItem !== undefined) payload.compositeItem = data.compositeItem
      if (data.trackStock !== undefined) payload.trackStock = data.trackStock
      if (data.inStock !== undefined) payload.inStock = Number(data.inStock)
      if (data.lowStock !== undefined) payload.lowStock = data.lowStock ? Number(data.lowStock) : null
      if (data.primarySupplier !== undefined) payload.primarySupplier = data.primarySupplier || null
      if (data.color !== undefined) payload.color = data.color
      if (data.shape !== undefined) payload.shape = data.shape
      if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl || null
      if (data.variantName !== undefined) payload.variantName = data.variantName || null
      if (data.optionName !== undefined) payload.optionName = data.optionName || null
      if (data.optionValue !== undefined) payload.optionValue = data.optionValue || null
      if (data.variantSku !== undefined) payload.variantSku = data.variantSku || null
      if (data.variantInStock !== undefined) payload.variantInStock = data.variantInStock ? Number(data.variantInStock) : null
      if (data.components !== undefined) payload.components = data.components || null

      // Handle price/cost/margin
      if (data.price !== undefined) {
        payload.price = data.price ? String(Number(data.price)) : null
      }
      if (data.cost !== undefined) {
        payload.cost = data.cost ? String(Number(data.cost)) : null
      }
      if (data.margin !== undefined) {
        payload.margin = data.margin ? String(Number(data.margin)) : null
      }

      return editItem(String(id), payload, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      onClose()
      reset()
      toast({ title: 'Item updated successfully' })
    },

    onError: (err: any) => {
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to update item'
      toast({
        title: 'Update failed',
        description: errorMsg,
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
    mutationFn: (id: number) => {
      if (!token) throw new Error('Token not found')
      return deleteItem(String(id), token)
    },

    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Item deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },

    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || error.message || 'Failed to delete item'
      toast({
        title: 'Delete failed',
        description: errorMsg,
        variant: 'destructive',
      })
    },
  })
}


