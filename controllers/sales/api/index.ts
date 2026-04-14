import { Sales } from '../types'
import { useState } from 'react'
import { initSales } from '../states'
import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'

const useSalesAPI = () => {
    const [filter, setFilter] = useState(initFilter)
    const [sales, setSales] = useState<Sales>(initSales)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const useGetSales = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string
    ) => {
        return useQuery({
            queryKey: ['clients', page, limit, filter, search],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/sales/records`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter)
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

        //HANDLES
    }
}
export default useSalesAPI;