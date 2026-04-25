import dayjs from 'dayjs'
import { useState } from 'react'
import { Purchases } from '../types'
import { useRouter } from 'next/router'
import { initPurchases } from '../states'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { AppliedDoc } from '@/controllers/sales/types'
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
        appliedDoc: AppliedDoc,
    ) => {
        // ✅ stabilize keys (IMPORTANT)
        const filterKey = JSON.stringify(filter)
        const appliedDocKey = JSON.stringify(appliedDoc)
        return useQuery({
            queryKey: [
                'purchases',
                page,
                limit,
                search,
                filterKey,
                appliedDocKey
            ],

            queryFn: async () => {

                // ✅ use original object (no JSON.parse)
                const hasTaxFilter =
                    !!appliedDoc.tax_month_start && !!appliedDoc.tax_month_end

                const hasInvoiceFilter =
                    !!appliedDoc.invoice_date_start && !!appliedDoc.invoice_date_end

                const hasCreatedFilter =
                    !!appliedDoc.created_date_start && !!appliedDoc.created_date_end

                const params: any = {
                    page,
                    search,
                    page_size: limit,
                    sortOrder: 'ASC',
                    filter: filterKey, // ✅ reuse serialized version
                    upload_id: appliedDoc.document.id ?? null,
                    client_id: appliedDoc.client.id ?? null,
                }

                if (hasTaxFilter) {
                    params.taxable_month_from = dayjs(appliedDoc.tax_month_start).format('MM/YYYY')
                    params.taxable_month_to = dayjs(appliedDoc.tax_month_end).format('MM/YYYY')
                }

                if (hasInvoiceFilter) {
                    params.invoice_date_from = dayjs(appliedDoc.invoice_date_start).format('MM/DD/YYYY')
                    params.invoice_date_to = dayjs(appliedDoc.invoice_date_end).format('MM/DD/YYYY')
                }

                if (hasCreatedFilter) {
                    params.created_at_from = dayjs(appliedDoc.created_date_start).format('MM/DD/YYYY')
                    params.created_at_to = dayjs(appliedDoc.created_date_end).format('MM/DD/YYYY')
                }

                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/purchases/records`,
                    params
                })
                return {
                    purchases: res.data?.purchases ?? [],
                    totalPurchases: res.data?.total ?? 0
                }
            },

            // ✅ prevents UI flicker (React Query v5)
            placeholderData: (prev) => prev ?? { purchases: [], totalPurchases: 0 },

            // ✅ smoother UX (no "dead" state when picking dates)
            enabled: true,

            // ✅ optional but highly recommended
            staleTime: 1000 * 30 // 30 seconds cache
        })
    }

    const useDeletePurchasesRecord = useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/api/${apiVersion}/purchases/records/${id}`, {
                data: { is_active: false }
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