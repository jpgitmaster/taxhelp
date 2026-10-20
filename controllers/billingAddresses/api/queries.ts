import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { BillingAddress } from '../types'

const useQueryBillingAddresses = () => {
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const getMyBillingAddresses = (refetchInterval?: number) => {
        return useQuery<BillingAddress[], Error>({
            queryKey: ['billingAddresses'],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/billing-addresses/me`,
                })

                return res.data?.billing_addresses ?? []
            },
            retry: false,
            refetchInterval,
        })
    }

    return {
        // REQUESTS
        getMyBillingAddresses,
    }
}

export default useQueryBillingAddresses
