
import { useState } from 'react'
import { Client } from '../types'
import { initClient } from '../states'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { initStatus, initFilter } from '@/controllers/global/states'

const useClientAPI = () => {
    const [filter, setFilter] = useState(initFilter)
    const [client, setClient] = useState<Client>(initClient)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const useGetClients = (
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
                    url: `/api/${apiVersion}/clients`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter)
                    }
                })

                return {
                    data: res.data?.data ?? [],
                    totalDocs: res.data?.total ?? 0
                }
            },
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }
    
    return {
        //STATES
        client,
        filter,
        status,
        initClient,
        
        // SET STATES
        setClient,
        setFilter,
        setStatus,

        // QUERIES
        useGetClients,

        // MUTATION

        //HANDLES
    }
}
export default useClientAPI;