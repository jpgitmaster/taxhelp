import { useState } from 'react'
import { Purchases } from '../types'
import { initPurchases } from '../states'
import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'

const usePurchasesAPI = () => {
    const [filter, setFilter] = useState(initFilter)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [purchases, setPurchases] = useState<Purchases>(initPurchases)
    const useGetPurchases = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string
    ) => {
        return useQuery({
            queryKey: ['purchases', page, limit, filter, search],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/purchases/records`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter)
                    }
                })

                return {
                    purchases: res.data?.purchases ?? [],
                    totalPurchases: res.data?.total ?? 0
                }
            },
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }

    
    return {
        //STATES
        status,
        filter,
        purchases,

        // SET STATES
        setPurchases,
        setFilter,
        setStatus,

        // QUERIES
        useGetPurchases,

        // MUTATION

        //HANDLES
    }
}
export default usePurchasesAPI;