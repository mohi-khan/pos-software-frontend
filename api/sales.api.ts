import { GetAllSalesResponse } from "@/types/sales"
import { fetchApi } from "@/utils/http"

export const getSales = async (token: string) => {
  return fetchApi<GetAllSalesResponse[]>({
    url: 'api/sales/getAll',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}