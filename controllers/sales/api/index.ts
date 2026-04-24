import dayjs from 'dayjs'
import { useState } from 'react'
import { initSales } from '../states'
import { AppliedDoc, Sales } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const useSalesAPI = () => {
    const queryClient = useQueryClient()

    const [filter, setFilter] = useState(initFilter)
    const [sales, setSales] = useState<Sales>(initSales)
    const [status, setStatus] = useState<Status>(initStatus)

    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const useGetSales = (
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
                'sales',
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
                    url: `/api/${apiVersion}/sales/records`,
                    params
                })

                return {
                    sales: res.data?.sales ?? [],
                    totalSales: res.data?.total ?? 0
                }
            },

            // ✅ prevents UI flicker (React Query v5)
            placeholderData: (prev) => prev ?? { sales: [], totalSales: 0 },

            // ✅ smoother UX (no "dead" state when picking dates)
            enabled: true,

            // ✅ optional but highly recommended
            staleTime: 1000 * 30 // 30 seconds cache
        })
    }

    const useDeleteSalesRecord = useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/api/${apiVersion}/sales/records/${id}`, {
                data: { is_active: false }
            })
            return res.data
        },

        onSuccess: () => {
            sessionStorage.setItem(
                'successMessage',
                'Your Sales record has been deleted.'
            )

            // ✅ correct v5 invalidation
            queryClient.invalidateQueries({
                queryKey: ['sales']
            })
        },

        onError: (error: any) => {
            console.log(error)
        }
    })

    return {
        // STATES
        sales,
        status,
        filter,

        // SET STATES
        setSales,
        setFilter,
        setStatus,

        // QUERIES
        useGetSales,

        // MUTATION
        useDeleteSalesRecord
    }
}

export default useSalesAPI