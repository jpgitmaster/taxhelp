import { AxiosError } from 'axios'
import api from '@/components/reusables/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BillingAddressForm } from '../types'

const useMutationBillingAddresses = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['billingAddresses'] })

    const createBillingAddress = useMutation<unknown, AxiosError, BillingAddressForm>({
        mutationFn: async (data) => {
            const res = await api({
                method: 'POST',
                url: `/api/${apiVersion}/billing-addresses/me`,
                data,
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    const updateBillingAddress = useMutation<unknown, AxiosError, { id: number } & BillingAddressForm>({
        mutationFn: async ({ id, ...data }) => {
            const res = await api({
                method: 'PUT',
                url: `/api/${apiVersion}/billing-addresses/me/${id}`,
                data,
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    const setDefaultBillingAddress = useMutation<unknown, AxiosError, number>({
        mutationFn: async (id) => {
            const res = await api({
                method: 'PUT',
                url: `/api/${apiVersion}/billing-addresses/me/${id}`,
                data: { is_default: true },
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    const deleteBillingAddress = useMutation<unknown, AxiosError, number>({
        mutationFn: async (id) => {
            const res = await api({
                method: 'DELETE',
                url: `/api/${apiVersion}/billing-addresses/me/${id}`,
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    return {
        // MUTATIONS
        createBillingAddress,
        updateBillingAddress,
        setDefaultBillingAddress,
        deleteBillingAddress,
    }
}

export default useMutationBillingAddresses
