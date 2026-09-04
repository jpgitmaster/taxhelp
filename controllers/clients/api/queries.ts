import { useState } from 'react'
import { Client } from '../types'
import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { Status } from '@/controllers/global/types'
import { initFilter, initStatus } from '@/controllers/global/states'

const useQueryClients = () => {
    const [filter, setFilter] = useState(initFilter)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const getClients = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string
    ) => {
        return useQuery({
            queryKey: [
                'clients',
                page,
                limit,
                search,
                (filter?.roleId ?? []).join(',')
            ],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/clients`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'DESC',
                        filter: JSON.stringify(filter)
                    }
                })

                return {
                    clients: res.data?.clients ?? [],
                    totalClients: res.data?.total ?? 0
                }
            },

            // ✅ keeps previous page while fetching new one
            placeholderData: (prev) => prev,
        })
    }

    const getClient = (
        id: number
    ) => {
        return useQuery<Client, Error>({
            queryKey: ['client', id],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/clients/${id}`
                })
                return res.data.client
            },
            placeholderData: (prev) => prev,
            enabled: !!id
        })
    }
    return {
        // STATES
        filter,
        status,
        // SET STATES
        setFilter,
        setStatus,

        // QUERIES
        getClient,
        getClients,

    }
}

export default useQueryClients