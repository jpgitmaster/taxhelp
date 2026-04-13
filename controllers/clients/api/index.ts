import { useState } from 'react'
import { initClient } from '../states'
import { useRouter } from 'next/router'
import { Client, ClientObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query'
type UseGetClientOptions = Omit<
    UseQueryOptions<Client, Error>,
    'queryKey' | 'queryFn'
>
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
                    clients: res.data?.clients ?? [],
                    totalClients: res.data?.total ?? 0
                }
            },
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }

    const useGetClient = (
        id: number,
        options?: UseGetClientOptions
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
            ...options,
        })
    }
    
    const useCreateClient = useMutation({
        mutationFn: async (client: ClientObj) => {
            const res = await api.post(`/api/${apiVersion}/clients`, {
                tin: client.tin,
                city: client.city,
                email: client.email,
                period: client.period,
                street: client.street,
                rdo_code: client.rdo_code,
                zip_code: client.zip_code,
                district: client.district,
                barangay: client.barangay,
                last_name: client.last_name,
                first_name: client.first_name,
                sub_street: client.sub_street,
                trade_name: client.trade_name,
                description: client.description,
                middle_name: client.middle_name,
                month_end: Number(client.month_end),
                classification: client.classification,
                registered_name: client.registered_name,
                business_nature: client.business_nature,
                representative: {
                    email: client.representative_email,
                    phone_number: client.representative_phone,
                    last_name: client.representative_last_name,
                    first_name: client.representative_first_name,
                    middle_name: client.representative_middle_name,
                }
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

    const useUpdateClient = useMutation({
        mutationFn: async (client: ClientObj) => {
            const res = await api.put(`/api/${apiVersion}/clients/${client.id}`, {
                tin: client.tin,
                city: client.city,
                email: client.email,
                period: client.period,
                street: client.street,
                rdo_code: client.rdo_code,
                zip_code: client.zip_code,
                district: client.district,
                barangay: client.barangay,
                last_name: client.last_name,
                first_name: client.first_name,
                sub_street: client.sub_street,
                trade_name: client.trade_name,
                description: client.description,
                middle_name: client.middle_name,
                month_end: Number(client.month_end),
                classification: client.classification,
                registered_name: client.registered_name,
                business_nature: client.business_nature,
                representative: {
                    email: client.representative_email,
                    phone_number: client.representative_phone,
                    last_name: client.representative_last_name,
                    first_name: client.representative_first_name,
                    middle_name: client.representative_middle_name,
                }
            })
            return res.data
        },
        onMutate: () => {
            setStatus(prev => ({ ...prev, loader: true }))
        },
        onSettled: () => {
            setStatus(prev => ({ ...prev, loader: false }))
        },
        onSuccess: () => {
            sessionStorage.setItem(
                'successMessage',
                'Your client has been updated.'
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
        useUpdateClient,

        //HANDLES
    }
}
export default useClientAPI;