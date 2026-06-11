import { useState } from 'react'
import { initClient } from '../states'
import { Client, ClientObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus } from '@/controllers/global/states'
import { useMutation, useQueryClient } from '@tanstack/react-query'
const useMutationClients = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [client, setClient] = useState<Client>(initClient)
    const [status, setStatus] = useState<Status>(initStatus)
    
    const useCreateClient = useMutation({
        mutationFn: async (client: ClientObj) => {
            const res = await api.post(`/api/${apiVersion}/clients`, {
                tin: client.tin,
                email: client.email,
                period: client.period,
                rdo_code: client.rdo_code,
                last_name: client.last_name,
                first_name: client.first_name,
                trade_name: client.trade_name,
                description: client.description,
                middle_name: client.middle_name,
                postal_code: client.postal_code,
                month_end: Number(client.month_end),
                first_address: client.first_address,
                second_address: client.second_address,
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
            queryClient.invalidateQueries({
                queryKey: ['clients']
            })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const useUpdateClient = useMutation({
        mutationFn: async (client: ClientObj) => {
            const res = await api.put(`/api/${apiVersion}/clients/${client.id}`, {
                tin: client.tin,
                email: client.email,
                period: client.period,
                rdo_code: client.rdo_code,
                last_name: client.last_name,
                first_name: client.first_name,
                trade_name: client.trade_name,
                description: client.description,
                middle_name: client.middle_name,
                postal_code: client.postal_code,
                month_end: Number(client.month_end),
                first_address: client.first_address,
                second_address: client.second_address,
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
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ['client', variables.id],
                data.client
            )

            queryClient.invalidateQueries({
                queryKey: ['clients']
            })
        }
    });
    return {
        //STATES
        status,
        client,
        
        // SET STATES
        setStatus,
        setClient,

        // MUTATIONS
        useCreateClient,
        useUpdateClient
    }
}
export default useMutationClients;