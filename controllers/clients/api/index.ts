import { useState } from 'react'
import { initClient } from '../states'
import { useRouter } from 'next/router'
import { Client, ClientObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
type UseGetClientOptions = Omit<
    UseQueryOptions<Client, Error>,
    'queryKey' | 'queryFn'
>
const useClientAPI = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
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
                        sortOrder: 'ASC',
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

        // ✅ Optimistic update
        onMutate: async (updatedClient) => {
            setStatus(prev => ({ ...prev, loader: true }));

            await queryClient.cancelQueries({ queryKey: ['client', updatedClient.id] });

            const previousClient = queryClient.getQueryData(['client', updatedClient.id]);

            queryClient.setQueryData(['client', updatedClient.id], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    ...updatedClient,
                    representative: {
                        email: updatedClient.representative_email,
                        phone_number: updatedClient.representative_phone,
                        last_name: updatedClient.representative_last_name,
                        first_name: updatedClient.representative_first_name,
                        middle_name: updatedClient.representative_middle_name,
                    }
                };
            });

            return { previousClient };
        },

        // ❌ rollback if error
        onError: (error: any, _vars) => {
            console.log(error);
            setStatus(prev => ({ ...prev, loader: false }));
        },

        // ✅ ensure sync with backend
        onSettled: (_data, _err, variables) => {
            queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
            setStatus(prev => ({ ...prev, loader: false }));
        },

        // ✅ success
        onSuccess: (res) => {
            const { client } = res;

            sessionStorage.setItem(
                'successMessage',
                'Your client has been updated.'
            );

            if (client?.id) {
                router.push(`/bookkeeper/clients/${client.id}`);
            }
        }
    });
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