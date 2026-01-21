import { createSale, deleteSale, getSales, updateSale } from "@/api/sales.api"
import { CreateSaleRequest, CreateSaleResponse, GetAllSalesResponse, UpdateSaleRequest, UpdateSaleResponse } from "@/types/sales"
import { tokenAtom, useInitializeUser } from "@/utils/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { toast } from "./use-toast"

/* =========================
   GET ALL SUPPLIERS
========================= */
export const useSales = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const query = useQuery<GetAllSalesResponse | null, Error>({
    queryKey: ['sales'],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')
      const response = await getSales(token)
      return response.data
    },
    enabled: !!token,
  })

  if (query.error) {
    toast({
      title: 'Failed to fetch sales',
      description: query.error.message,
      variant: 'destructive',
    })
  }

  return query
}

/* =========================
   CREATE SALE
========================= */
export const useCreateSale = ({
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
    mutationFn: async (data: CreateSaleRequest) => {
      if (!token) throw new Error('Token not found')
      return createSale(data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      onClose()
      reset()
      toast({ title: 'Sale created successfully' })
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
   UPDATE SALE
========================= */
export const useEditSale = ({
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
      data: UpdateSaleRequest
    }) => {
      if (!token) throw new Error('Token not found')
      return updateSale(id, data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      onClose()
      reset()
      toast({ title: 'Sale updated successfully' })
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
   DELETE SALE
========================= */
export const useDeleteSale = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Token not found')
      return deleteSale(id, token)
    },

    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Sale deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },

    onError: (err: any) => {
      toast({
        title: 'Delete failed',
        description: err.message,
        variant: 'destructive',
      })
    },
  })
}
