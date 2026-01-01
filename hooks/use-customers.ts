'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { toast } from './use-toast'


import {
  getCustomers,
  createCustomer,
  editCustomer,
  deleteCustomer,
} from '@/api/customers-api'
import { CreateCustomer, GetCustomer, UpdateCustomer } from '@/types/customer'

/* =========================
   GET ALL CUSTOMERS
========================= */
export const useCustomers = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const query = useQuery<GetCustomer[] | null, Error>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')
      const response = await getCustomers(token)
      return response.data // could be null
    },
    enabled: !!token,
  })

  if (query.error) {
    toast({
      title: 'Failed to fetch customers',
      description: query.error.message,
      variant: 'destructive',
    })
  }

  return query
}

/* =========================
   CREATE CUSTOMER
========================= */
export const useCreateCustomer = ({
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
    mutationFn: async (data: CreateCustomer) => {
      if (!token) throw new Error('Token not found')

      // 🔹 Get existing customers from cache
      const customers =
        queryClient.getQueryData<GetCustomer[]>(['customers'])

      // 🔹 Check duplicate email (case-insensitive)
      const isDuplicate = customers?.some(
        (cus) => cus.email.toLowerCase() === data.email.toLowerCase()
      )

      if (isDuplicate) {
        throw new Error('Customer email already exists')
      }

      return createCustomer(data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      onClose()
      reset()
      toast({ title: 'Customer created successfully' })
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
   EDIT CUSTOMER
========================= */
export const useEditCustomer = ({
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
      data: UpdateCustomer
    }) => {
      if (!token) throw new Error('Token not found')

      // 🔹 Get cached customers
    
        queryClient.getQueryData<GetCustomer[]>(['customers'])

     

      return editCustomer(id, data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      onClose()
      reset()
      toast({ title: 'Customer updated successfully' })
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
   DELETE CUSTOMER
========================= */
export const useDeleteCustomer = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id, token),
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Customer deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
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
