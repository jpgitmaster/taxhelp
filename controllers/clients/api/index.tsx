
import { useState } from 'react'
import { initClient } from '../states'
import { useRouter } from 'next/router'
import { Client, ClientObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { initStatus, initFilter } from '@/controllers/global/states'

const useClientAPI = () => {
    const router = useRouter()
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
                    totalClients: res.data?.total ?? 0
                }
            },
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }

    const useGetClient = (
        id: number
    ) => {
        return useQuery({
            queryKey: ['client', id],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/clients/${id}`
                })
                console.log(res)
                // return {
                //     data: res.data?.data ?? [],
                //     totalDocs: res.data?.total ?? 0
                // }
            },
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }
    
    const useCreateClient = useMutation({
        mutationFn: async (client: ClientObj) => {
            const res = await api.post(`/api/${apiVersion}/clients`, {
                tin: client.tin,
                city: client.city,
                street: client.street,
                fiscal: client.fiscal,
                zip_code: client.zip_code,
                district: client.district,
                barangay: client.barangay,
                last_name: client.last_name,
                first_name: client.first_name,
                sub_street: client.sub_street,
                middle_name: client.middle_name,
                branch_code: client.branch_code,
                classification: client.classification,
                registered_name: client.registered_name
            })
            return res.data
        },
        onSuccess: () => {
            sessionStorage.setItem(
                'successMessage',
                'Your client has been created.'
            )
            router.push('/bookkeeper/clients')
        },
        onError: (error: any) => {
            console.log(error)
        }
    })
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
        useGetClient,
        useGetClients,

        // MUTATION
        useCreateClient,

        //HANDLES
    }
}
export default useClientAPI;