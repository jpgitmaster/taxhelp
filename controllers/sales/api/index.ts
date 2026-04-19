import { Sales } from '../types'
import { useState } from 'react'
import { initSales } from '../states'
import { useRouter } from 'next/router'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { useQuery, useMutation } from '@tanstack/react-query'
import { initStatus, initFilter } from '@/controllers/global/states'

const useSalesAPI = () => {
    const router = useRouter()
    const [filter, setFilter] = useState(initFilter)
    const [sales, setSales] = useState<Sales>(initSales)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const useGetSales = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string,
        documentID: number,
        clientID: number
    ) => {
        return useQuery({
            queryKey: ['sales', page, limit, filter, search, documentID, clientID],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/sales/records`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter),
                        upload_id: documentID ? documentID : null,
                        client_id: clientID ? clientID : null,
                    }
                })

                return {
                    sales: res.data?.sales ?? [],
                    totalSales: res.data?.total ?? 0
                }
            },
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }

    const useDeleteSalesRecord = useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/api/${apiVersion}/sales/records/${id}`, {
                data: { is_active: true }
            })
            return res.data
        },
        onSuccess: () => {
            sessionStorage.setItem(
                'successMessage',
                'Your Sales record has been deleted.'
            )
            router.reload()
        },
        onError: (error: any) => {
            console.log(error)
        }
    })
    return {
        //STATES
        sales,
        status,
        filter,

        // SET STATES
        setSales,
        setFilter,
        setStatus,

        // QUERIES
        useGetSales,
        
        // MUTATION
        useDeleteSalesRecord

        //HANDLES
    }
}
export default useSalesAPI;