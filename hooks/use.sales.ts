import { getSales } from "@/api/sales.api"
import { GetAllSalesResponse } from "@/types/sales"
import { tokenAtom, useInitializeUser } from "@/utils/user"
import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { toast } from "./use-toast"

/* =========================
   GET ALL SUPPLIERS
========================= */
export const useSales = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const query = useQuery<GetAllSalesResponse[] | null, Error>({
    queryKey: ['suppliers'],
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
