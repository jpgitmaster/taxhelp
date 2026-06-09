import { useState } from 'react'
import { SupplierObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { initFilter, initStatus } from '@/controllers/global/states'
type UseGetSupplierOptions = Omit<
    UseQueryOptions<SupplierObj, Error>,
    'queryKey' | 'queryFn'
>
const useQuerySuppliers = () => {
    const [filter, setFilter] = useState(initFilter)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    
    const useGetSuppliers = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string
    ) => {
        return useQuery({
            queryKey: [
                'suppliers',
                page,
                limit,
                search,
                (filter?.roleId ?? []).join(',')
            ],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/suppliers`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter)
                    }
                })

                return {
                    suppliers: res.data?.suppliers ?? [],
                    totalSuppliers: res.data?.total ?? 0
                }
            },

            // ✅ keeps previous page while fetching new one
            placeholderData: (prev) => prev,
        })
    }

    const useGetSupplier = (
        id: number,
        options?: UseGetSupplierOptions
    ) => {
        return useQuery<SupplierObj, Error>({
            queryKey: ['supplier', id],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/suppliers/${id}`
                })
                return res.data.supplier
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
        useGetSupplier,
        useGetSuppliers,

    }
}

export default useQuerySuppliers