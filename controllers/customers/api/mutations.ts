import { useState } from 'react'
import { initCustomer } from '../states'
import { Customer, CustomerObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus } from '@/controllers/global/states'
import { useMutation, useQueryClient } from '@tanstack/react-query'
const useMutationCustomers = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    const [customer, setCustomer] = useState<Customer>(initCustomer)
    
    const useCreateCustomer = useMutation({
        mutationFn: async (customer: CustomerObj) => {
            const res = await api.post(`/api/${apiVersion}/customers`, {
                tin: customer.tin,
                email: customer.email,
                last_name: customer.last_name,
                first_name: customer.first_name,
                trade_name: customer.trade_name,
                middle_name: customer.middle_name,
                postal_code: customer.postal_code,
                first_address: customer.first_address,
                second_address: customer.second_address,
                classification: customer.classification,
                registered_name: customer.registered_name,
            })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['customers']
            })
        },
    })

    const useUpdateCustomer = useMutation({
        mutationFn: async (customer: CustomerObj) => {
            const res = await api.put(`/api/${apiVersion}/customers/${customer.id}`, {
                tin: customer.tin,
                email: customer.email,
                last_name: customer.last_name,
                first_name: customer.first_name,
                trade_name: customer.trade_name,
                middle_name: customer.middle_name,
                postal_code: customer.postal_code,
                first_address: customer.first_address,
                second_address: customer.second_address,
                classification: customer.classification,
                registered_name: customer.registered_name,
            })
            return res.data
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ['customer', variables.id],
                data.customer
            )

            queryClient.invalidateQueries({
                queryKey: ['customers']
            })
        }
    });
    return {
        //STATES
        status,
        customer,
        
        // SET STATES
        setStatus,
        setCustomer,

        // MUTATIONS
        useCreateCustomer,
        useUpdateCustomer
    }
}
export default useMutationCustomers;