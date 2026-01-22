// hooks/use-purchase-orders.ts

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { toast } from './use-toast'

import {
  GetPurchaseOrder,
  CreatePurchaseOrderPayload,
  UpdatePurchaseOrderPayload,
} from '@/types/purchase-orders'
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  getPurchaseOrders,
  updatePurchaseOrder,
} from '@/api/purchase-orders-api'

/* =========================
   GET ALL PURCHASE ORDERS
========================= */
export const usePurchaseOrders = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const query = useQuery<GetPurchaseOrder[] | null, Error>({
    queryKey: ['purchaseOrders'],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')
      const response = await getPurchaseOrders(token)
      return response.data
    },
    enabled: !!token,
  })

  if (query.error) {
    toast({
      title: 'Failed to fetch purchase orders',
      description: query.error.message,
      variant: 'destructive',
    })
  }

  return query
}

/* =========================
   GET PURCHASE ORDER BY ID
========================= */
export const usePurchaseOrderById = (id: string) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const query = useQuery<GetPurchaseOrder | null, Error>({
    queryKey: ['purchaseOrder', id],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')
      const response = await getPurchaseOrderById(id, token)
      return response.data
    },
    enabled: !!token && !!id,
  })

  if (query.error) {
    toast({
      title: 'Failed to fetch purchase order',
      description: query.error.message,
      variant: 'destructive',
    })
  }

  return query
}

/* =========================
   CREATE PURCHASE ORDER
========================= */
export const useCreatePurchaseOrder = ({
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
    mutationFn: async (data: CreatePurchaseOrderPayload) => {
      if (!token) throw new Error('Token not found')

      // Validate items array is not empty
      if (!data.items || data.items.length === 0) {
        throw new Error('At least one item is required')
      }

      // Validate each item has required fields
      for (const item of data.items) {
        if (!item.itemId) throw new Error('All items must have a valid item selected')
        if (!item.quantity || item.quantity <= 0) throw new Error('All items must have quantity greater than 0')
        if (!item.purchaseCost) throw new Error('All items must have a purchase cost')
      }

      return createPurchaseOrder(data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })
      onClose()
      reset()
      toast({ 
        title: 'Success',
        description: 'Purchase order created successfully'
      })
    },

    onError: (err: any) => {
      toast({
        title: 'Create failed',
        description: err.message || 'Failed to create purchase order',
        variant: 'destructive',
      })
    },
  })
}

/* =========================
   UPDATE PURCHASE ORDER
========================= */
export const useUpdatePurchaseOrder = ({
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
      data: UpdatePurchaseOrderPayload
    }) => {
      if (!token) throw new Error('Token not found')

      // Validate items array if provided
      if (data.items) {
        if (data.items.length === 0) {
          throw new Error('At least one item is required')
        }

        // Validate each item
        for (const item of data.items) {
          if (!item.itemId) throw new Error('All items must have a valid item selected')
          if (!item.quantity || item.quantity <= 0) throw new Error('All items must have quantity greater than 0')
          if (!item.purchaseCost) throw new Error('All items must have a purchase cost')
        }
      }

      return updatePurchaseOrder(id, data, token)
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })
      queryClient.invalidateQueries({
        queryKey: ['purchaseOrder', variables.id],
      })
      onClose()
      reset()
      toast({ 
        title: 'Success',
        description: 'Purchase order updated successfully'
      })
    },

    onError: (err: any) => {
      toast({
        title: 'Update failed',
        description: err.message || 'Failed to update purchase order',
        variant: 'destructive',
      })
    },
  })
}

/* =========================
   DELETE PURCHASE ORDER
========================= */
export const useDeletePurchaseOrder = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Token not found')
      return deletePurchaseOrder(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Purchase order deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete purchase order',
        variant: 'destructive',
      })
    },
  })
}


// 'use client'

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { useAtom } from 'jotai'
// import { tokenAtom, useInitializeUser } from '@/utils/user'
// import { toast } from './use-toast'

// import {
//   GetPurchaseOrder,
//   CreatePurchaseOrderPayload,
//   UpdatePurchaseOrderPayload,
// } from '@/types/purchase-orders'
// import {
//   createPurchaseOrder,
//   deletePurchaseOrder,
//   getPurchaseOrderById,
//   getPurchaseOrders,
//   updatePurchaseOrder,
// } from '@/api/purchase-orders-api'

// /* =========================
//    GET ALL PURCHASE ORDERS
// ========================= */
// export const usePurchaseOrders = () => {
//   useInitializeUser()
//   const [token] = useAtom(tokenAtom)

//   const query = useQuery<GetPurchaseOrder[] | null, Error>({
//     queryKey: ['purchaseOrders'],
//     queryFn: async () => {
//       if (!token) throw new Error('Token not found')
//       const response = await getPurchaseOrders(token)
//       return response.data
//     },
//     enabled: !!token,
//   })

//   if (query.error) {
//     toast({
//       title: 'Failed to fetch purchase orders',
//       description: query.error.message,
//       variant: 'destructive',
//     })
//   }

//   return query
// }

// /* =========================
//    GET PURCHASE ORDER BY ID
// ========================= */
// export const usePurchaseOrderById = (id: string) => {
//   useInitializeUser()
//   const [token] = useAtom(tokenAtom)

//   const query = useQuery<GetPurchaseOrder | null, Error>({
//     queryKey: ['purchaseOrder', id],
//     queryFn: async () => {
//       if (!token) throw new Error('Token not found')
//       const response = await getPurchaseOrderById(id, token)
//       return response.data
//     },
//     enabled: !!token && !!id,
//   })

//   if (query.error) {
//     toast({
//       title: 'Failed to fetch purchase order',
//       description: query.error.message,
//       variant: 'destructive',
//     })
//   }

//   return query
// }

// /* =========================
//    CREATE PURCHASE ORDER
// ========================= */
// export const useCreatePurchaseOrder = ({
//   onClose,
//   reset,
// }: {
//   onClose: () => void
//   reset: () => void
// }) => {
//   useInitializeUser()
//   const queryClient = useQueryClient()
//   const [token] = useAtom(tokenAtom)

//   return useMutation({
//     mutationFn: async (data: CreatePurchaseOrderPayload) => {
//       if (!token) throw new Error('Token not found')

//       // Check for duplicate order number
//       const orders = queryClient.getQueryData<GetPurchaseOrder[]>([
//         'purchaseOrders',
//       ])
//       const isDuplicate = orders?.some(
//         (order) =>
//           order.orderNumber.toLowerCase() ===
//           data.order.orderNumber.toLowerCase()
//       )

//       if (isDuplicate) {
//         throw new Error('Order number already exists')
//       }

//       // Validate items array is not empty
//       if (!data.items || data.items.length === 0) {
//         throw new Error('At least one item is required')
//       }

//       return createPurchaseOrder(data, token)
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })
//       onClose()
//       reset()
//       toast({ title: 'Purchase order created successfully' })
//     },

//     onError: (err: any) => {
//       toast({
//         title: 'Create failed',
//         description: err.message,
//         variant: 'destructive',
//       })
//     },
//   })
// }

// /* =========================
//    UPDATE PURCHASE ORDER
// ========================= */
// export const useUpdatePurchaseOrder = ({
//   onClose,
//   reset,
// }: {
//   onClose: () => void
//   reset: () => void
// }) => {
//   useInitializeUser()
//   const queryClient = useQueryClient()
//   const [token] = useAtom(tokenAtom)

//   return useMutation({
//     mutationFn: async ({
//       id,
//       data,
//     }: {
//       id: string
//       data: UpdatePurchaseOrderPayload
//     }) => {
//       if (!token) throw new Error('Token not found')

//       // Check duplicate order number ignoring current order

//       // Validate items array if provided
//       if (data.items && data.items.length === 0) {
//         throw new Error('At least one item is required')
//       }

//       return updatePurchaseOrder(id, data, token)
//     },

//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })
//       queryClient.invalidateQueries({
//         queryKey: ['purchaseOrder', variables.id],
//       })
//       onClose()
//       reset()
//       toast({ title: 'Purchase order updated successfully' })
//     },

//     onError: (err: any) => {
//       toast({
//         title: 'Update failed',
//         description: err.message,
//         variant: 'destructive',
//       })
//     },
//   })
// }

// /* =========================
//    DELETE PURCHASE ORDER
// ========================= */
// export const useDeletePurchaseOrder = () => {
//   useInitializeUser()
//   const [token] = useAtom(tokenAtom)
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (id: string) => {
//       if (!token) throw new Error('Token not found')
//       return deletePurchaseOrder(id, token)
//     },
//     onSuccess: () => {
//       toast({
//         title: 'Success!',
//         description: 'Purchase order deleted successfully.',
//       })
//       queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })
//     },
//     onError: (error: any) => {
//       toast({
//         title: 'Delete failed',
//         description: error.message,
//         variant: 'destructive',
//       })
//     },
//   })
// }
