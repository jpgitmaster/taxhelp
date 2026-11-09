import { AxiosError } from 'axios'
import api from '@/components/reusables/axios'
import { SalesManualCreatePayload } from '../types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const useSalesManualAPI = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['salesManual'] })

    const useGetSalesManual = (
        page: number,
        limit: number,
        search: string,
        clientId: number | null,
    ) => {
        return useQuery({
            queryKey: ['salesManual', page, limit, search, clientId],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/sales-manual/records`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        client_id: clientId ?? null,
                    }
                })
                return {
                    sales: res.data?.sales ?? [],
                    totalSales: res.data?.total ?? 0
                }
            },
            placeholderData: (prev) => prev ?? { sales: [], totalSales: 0 },
            staleTime: 1000 * 30
        })
    }

    const useCreateSalesManual = useMutation<unknown, AxiosError, SalesManualCreatePayload>({
        mutationFn: async (data) => {
            const res = await api({
                method: 'POST',
                url: `/api/${apiVersion}/sales-manual/records`,
                data,
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    const useUpdateSalesManual = useMutation<unknown, AxiosError, { id: number } & Partial<SalesManualCreatePayload>>({
        mutationFn: async ({ id, ...data }) => {
            const res = await api({
                method: 'PUT',
                url: `/api/${apiVersion}/sales-manual/records/${id}`,
                data,
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    const useDeleteSalesManual = useMutation<unknown, AxiosError, number>({
        mutationFn: async (id) => {
            const res = await api.delete(`/api/${apiVersion}/sales-manual/records/${id}`, {
                data: { is_active: false }
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    return {
        useGetSalesManual,
        useCreateSalesManual,
        useUpdateSalesManual,
        useDeleteSalesManual,
    }
}

export default useSalesManualAPI
