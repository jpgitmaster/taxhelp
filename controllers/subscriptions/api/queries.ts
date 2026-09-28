import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { Subscription } from '../types'

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

    return {
        // STATES

        // SET STATES

        // REQUESTS
        getMySubscription,
    }
}

export default useQuerySubscriptions