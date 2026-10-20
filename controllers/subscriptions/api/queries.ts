import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { Subscription, Payment } from '../types'

const useQuerySubscriptions = () => {
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const getMySubscription = (refetchInterval?: number) => {
        return useQuery<Subscription, Error>({
            queryKey: ['subscriptions'],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/subscriptions/me`,
                })

                return res.data?.subscription
            },
            retry: false,
            refetchInterval,
        })
    }

    const getMyPayments = (refetchInterval?: number) => {
        return useQuery<Payment[], Error>({
            queryKey: ['payments'],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/payments/me`,
                })

                return res.data?.payments
            },
            retry: false,
            refetchInterval,
        })
    }

    return {
        // STATES

        // SET STATES

        // REQUESTS
        getMySubscription,
        getMyPayments,
    }
}

export default useQuerySubscriptions