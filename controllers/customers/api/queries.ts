import { useState } from 'react'
import { CustomerObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { initFilter, initStatus } from '@/controllers/global/states'
type UseGetCustomerOptions = Omit<
    UseQueryOptions<CustomerObj, Error>,
    'queryKey' | 'queryFn'
>
const useQueryCustomers = () => {
    const [filter, setFilter] = useState(initFilter)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    
    const useGetCustomers = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string
    ) => {
        return useQuery({
            queryKey: [
                'customers',
                page,
                limit,
                search,
                (filter?.roleId ?? []).join(',')
            ],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/customers`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter)
                    }
                })

                return {
                    customers: res.data?.customers ?? [],
                    totalCustomers: res.data?.total ?? 0
                }
            },

            // ✅ keeps previous page while fetching new one
            placeholderData: (prev) => prev,
        })
    }

    const useGetCustomer = (
        id: number,
        options?: UseGetCustomerOptions
    ) => {
        return useQuery<CustomerObj, Error>({
            queryKey: ['customer', id],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/customers/${id}`
                })
                return res.data.customer
            },
            ...options,
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
        useGetCustomer,
        useGetCustomers,

    }
}

export default useQueryCustomers