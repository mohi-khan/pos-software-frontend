'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { toast } from './use-toast'

import {
  GetSupplier,
  CreateSupplierPayload,
  UpdateSupplierPayload,
} from '@/types/items'
import { createSupplier, deleteSupplier, editSupplier, getSuppliers } from '@/api/supplier-api'


/* =========================
   GET ALL SUPPLIERS
========================= */
export const useSuppliers = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const query = useQuery<GetSupplier[] | null, Error>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')
      const response = await getSuppliers(token)
      return response.data
    },
    enabled: !!token,
  })

  if (query.error) {
    toast({
      title: 'Failed to fetch suppliers',
      description: query.error.message,
      variant: 'destructive',
    })
  }

  return query
}

/* =========================
   CREATE SUPPLIER
========================= */
export const useCreateSupplier = ({
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
    mutationFn: async (data: CreateSupplierPayload) => {
      if (!token) throw new Error('Token not found')

      // Check for duplicate supplier name/email
      const suppliers = queryClient.getQueryData<GetSupplier[]>(['suppliers'])
      const isDuplicate = suppliers?.some(
        (sup) =>
          sup.name.toLowerCase() === data.name.toLowerCase() ||
          (data.email && sup.email?.toLowerCase() === data.email.toLowerCase())
      )

      if (isDuplicate) {
        throw new Error('Supplier name or email already exists')
      }

      return createSupplier(data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      onClose()
      reset()
      toast({ title: 'Supplier created successfully' })
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
   EDIT SUPPLIER
========================= */
export const useEditSupplier = ({
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
      data: UpdateSupplierPayload
    }) => {
      if (!token) throw new Error('Token not found')

      const suppliers = queryClient.getQueryData<GetSupplier[]>(['suppliers'])

      // Check duplicate name/email ignoring current supplier
      if (data.name || data.email) {
        const isDuplicate = suppliers?.some(
          (sup) =>
            sup.supplierId.toString() !== id &&
            ((data.name && sup.name.toLowerCase() === data.name.toLowerCase()) ||
              (data.email &&
                sup.email?.toLowerCase() === data.email.toLowerCase()))
        )

        if (isDuplicate) {
          throw new Error('Supplier name or email already exists')
        }
      }

      return editSupplier(id, data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      onClose()
      reset()
      toast({ title: 'Supplier updated successfully' })
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
   DELETE SUPPLIER
========================= */
export const useDeleteSupplier = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id, token),
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Supplier deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
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
