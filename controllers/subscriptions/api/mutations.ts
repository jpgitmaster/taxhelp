import { useState } from 'react'
import { AxiosError } from 'axios'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus } from '@/controllers/global/states'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Subscription } from '../types'
interface ErrorItem{
    field: string
    message: string
    submessage: string
};
type ErrorResponse = {
    message?: ErrorItem[]
}
interface CheckoutPayload {
    plan: string
    billing_cycle: string
}

interface CheckoutResponse {
    checkout_url: string
    payment_id: number
    success: boolean
    message: string
}

interface SubscriptionResponse {
    subscription: Subscription
    success: boolean
    message: string
}

const useMutationSubscriptions = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)

    const downgradeSubscription = useMutation<
        SubscriptionResponse,
        AxiosError<ErrorResponse>,
        string
    >({
        mutationFn: async (plan: string) => {
            const res = await api({
                method: 'POST',
                url: `/api/${apiVersion}/subscriptions/me/downgrade`,
                data: {
                    plan: plan,
                }
            })

            return res.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['subscriptions']
            })
            queryClient.invalidateQueries({
                queryKey: ['user']
            })
        }
    })

    const cancelSubscription = useMutation<
        SubscriptionResponse,
        AxiosError<ErrorResponse>,
        void
    >({
        mutationFn: async () => {
            const res = await api({
                method: 'POST',
                url: `/api/${apiVersion}/subscriptions/me/cancel`,
            })

            return res.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['subscriptions']
            })
            queryClient.invalidateQueries({
                queryKey: ['user']
            })
        }
    })

    const checkoutSubscription = useMutation<
        CheckoutResponse,
        AxiosError<ErrorResponse>,
        CheckoutPayload
    >({
        mutationFn: async (payload) => {
            const res = await api({
                method: 'POST',
                url: `/api/${apiVersion}/subscriptions/checkout`,
                data: payload,
            })

            return res.data
        },
    })
    return {
        // STATES
        status,

        // SET STATES
        setStatus,

        // MUTATIONS
        downgradeSubscription,
        cancelSubscription,
        checkoutSubscription,
    }
}

export default useMutationSubscriptions