import { useState } from 'react'
import { AxiosError } from 'axios'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus } from '@/controllers/global/states'
import { useMutation, useQueryClient } from '@tanstack/react-query'
interface ErrorItem{
    field: string
    message: string
    submessage: string
};
type ErrorResponse = {
    message?: ErrorItem[]
}
type SuccessResponse = {
    message: string
}
const useMutationSubscriptions = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    const paymentSubscription = useMutation<
            SuccessResponse,
            AxiosError<ErrorResponse>,
            string
        >({
        mutationFn: async (plan: string) => {
            const res = await api({
                method: 'PUT',
                url: `/api/${apiVersion}/subscriptions/me`,
                data: {
                    plan: plan,
                }
            })

            return res.data
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['subscriptions']
            })
            queryClient.invalidateQueries({
                queryKey: ['user']
            })
        }
    })
    return {
        // STATES
        status,

        // SET STATES
        setStatus,

        // MUTATIONS
        paymentSubscription,
    }
}

export default useMutationSubscriptions