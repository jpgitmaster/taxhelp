import { useState } from 'react'
import { initSupplier } from '../states'
import { Supplier, SupplierObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus } from '@/controllers/global/states'
import { useMutation, useQueryClient } from '@tanstack/react-query'
const useMutationSuppliers = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    const [supplier, setSupplier] = useState<Supplier>(initSupplier)
    
    const useCreateSupplier = useMutation({
        mutationFn: async (supplier: SupplierObj) => {
            const res = await api.post(`/api/${apiVersion}/suppliers`, {
                tin: supplier.tin,
                email: supplier.email,
                last_name: supplier.last_name,
                first_name: supplier.first_name,
                trade_name: supplier.trade_name,
                middle_name: supplier.middle_name,
                postal_code: supplier.postal_code,
                first_address: supplier.first_address,
                second_address: supplier.second_address,
                classification: supplier.classification,
                registered_name: supplier.registered_name,
            })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['suppliers']
            })
        },
    })

    const useUpdateSupplier = useMutation({
        mutationFn: async (supplier: SupplierObj) => {
            const res = await api.put(`/api/${apiVersion}/suppliers/${supplier.id}`, {
                tin: supplier.tin,
                email: supplier.email,
                last_name: supplier.last_name,
                first_name: supplier.first_name,
                trade_name: supplier.trade_name,
                middle_name: supplier.middle_name,
                postal_code: supplier.postal_code,
                first_address: supplier.first_address,
                second_address: supplier.second_address,
                classification: supplier.classification,
                registered_name: supplier.registered_name,
            })
            return res.data
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ['supplier', variables.id],
                data.supplier
            )

            queryClient.invalidateQueries({
                queryKey: ['suppliers']
            })
        }
    });
    return {
        //STATES
        status,
        supplier,
        
        // SET STATES
        setStatus,
        setSupplier,

        // MUTATIONS
        useCreateSupplier,
        useUpdateSupplier
    }
}
export default useMutationSuppliers;