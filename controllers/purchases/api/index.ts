import { useState } from 'react'
import { Purchases } from '../types'
import { useRouter } from 'next/router'
import { initPurchases } from '../states'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { useQuery, useMutation} from '@tanstack/react-query'
import { initStatus, initFilter } from '@/controllers/global/states'

const usePurchasesAPI = () => {
    const router = useRouter()
    const [filter, setFilter] = useState(initFilter)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [purchases, setPurchases] = useState<Purchases>(initPurchases)
    const useGetPurchases = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string,
        documentID: number,
        clientID: number
    ) => {
        return useQuery({
            queryKey: ['purchases', page, limit, filter, search, documentID, clientID],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/purchases/records`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter),
                        upload_id: documentID ? documentID : null,
                        client_id: clientID ? clientID : null,
                    }
                })

                return {
                    purchases: res.data?.purchases ?? [],
                    totalPurchases: res.data?.total ?? 0
                }
            },
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }

    const useDeletePurchasesRecord = useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/api/${apiVersion}/purchases/records/${id}`, {
                data: { is_active: true }
            })
            return res.data
        },
        onSuccess: () => {
            sessionStorage.setItem(
                'successMessage',
                'Your Purchases record has been deleted.'
            )
            router.reload()
        },
        onError: (error: any) => {
            console.log(error)
        }
    })
    return {
        //STATES
        status,
        filter,
        purchases,

        // SET STATES
        setPurchases,
        setFilter,
        setStatus,

        // QUERIES
        useGetPurchases,

        // MUTATION
        useDeletePurchasesRecord,

        //HANDLES
    }
}
export default usePurchasesAPI;