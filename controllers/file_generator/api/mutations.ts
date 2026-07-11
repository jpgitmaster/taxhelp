import { Dayjs } from 'dayjs'
import { useState } from 'react'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus } from '@/controllers/global/states'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useMutationFileGenerates = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    
    const deletePurchasesRecord = useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/api/${apiVersion}/purchases/records/${id}`, {
                data: { is_active: false }
            })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['purchases_file']
            })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const deleteSalesRecord = useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/api/${apiVersion}/sales/records/${id}`, {
                data: { is_active: false }
            })
            return res.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sales_file']
            })
        },

        onError: (error) => {
            console.log(error)
        }
    })

    const downloadSalesMutation = useMutation({
        mutationFn: async (params: {
            doc: {
                search: string
                selectedTable: {
                    value: string,
                    label: string
                }
                client: {
                    id: number | null,
                    registered_name: string
                }
                period: Dayjs | null
            },
            type: string
        }) => {
            const { doc, type } = params

            const res = await api.post(
                `/api/${apiVersion}/files/download/sales`,
                {
                    type: type,
                    client_id: doc.client.id,
                    year: doc.period?.format('YYYY') ?? '',
                    month: doc.period?.format('MM') ?? '',
                },
                {
                    responseType: 'blob',
                }
            )
            const disposition = res.headers['content-disposition']
            const filename = disposition?.match(/filename="?([^"]+)"?/)?.[1] ?? `sales-${type}`

            return { data: res.data, type, filename }
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const downloadPurchasesMutation = useMutation({
        mutationFn: async (params: {
            doc: {
                search: string
                selectedTable: {
                    value: string,
                    label: string
                }
                client: {
                    id: number | null,
                    registered_name: string
                }
                period: Dayjs | null
            },
            type: string
        }) => {
            const { doc, type } = params

            const res = await api.post(
                `/api/${apiVersion}/files/download/purchases`,
                {
                    type: type,
                    client_id: doc.client.id,
                    year: doc.period?.format('YYYY') ?? '',
                    month: doc.period?.format('MM') ?? '',
                },
                {
                    responseType: 'blob',
                }
            )
            const disposition = res.headers['content-disposition']
            const filename = disposition?.match(/filename="?([^"]+)"?/)?.[1] ?? `purchases-${type}`

            return { data: res.data, type, filename }
        },

        onError: (error) => {
            console.log(error)
        }
    })

    const downloadSalesTaxesMutation = useMutation({
        mutationFn: async (params: {
            doc: {
                search: string
                selectedTable: {
                    value: string,
                    label: string
                }
                client: {
                    id: number | null,
                    registered_name: string
                }
                period: Dayjs | null
            },
            type: string
            form_type: string
            sub_form_type: string
        }) => {
            const { doc, type, form_type, sub_form_type } = params

            const res = await api.post(
                `/api/${apiVersion}/files/download/sales_taxes`,
                {
                    type: type,
                    form_type: form_type,
                    client_id: doc.client.id,
                    sub_form_type: sub_form_type,
                    year: doc.period?.format('YYYY') ?? '',
                    month: doc.period?.format('MM') ?? '',
                },
                {
                    responseType: 'blob',
                }
            )
            const disposition = res.headers['content-disposition']
            const filename = disposition?.match(/filename="?([^"]+)"?/)?.[1] ?? `sales-taxes-${type}`

            return { data: res.data, type, filename }
        },

        onError: (error) => {
            console.log(error)
        }
    })
    const downloadPurchasesTaxesMutation = useMutation({
        mutationFn: async (params: {
            doc: {
                search: string
                selectedTable: {
                    value: string,
                    label: string
                }
                client: {
                    id: number | null,
                    registered_name: string
                }
                period: Dayjs | null
            },
            type: string
            form_type: string
            sub_form_type: string
        }) => {
            const { doc, type, form_type, sub_form_type } = params

            const res = await api.post(
                `/api/${apiVersion}/files/download/purchase_taxes`,
                {
                    type,
                    form_type,
                    sub_form_type,
                    client_id: doc.client.id,
                    year: doc.period?.format('YYYY') ?? '',
                    month: doc.period?.format('MM') ?? '',
                },
                {
                    responseType: 'blob',
                }
            );
            const disposition = res.headers['content-disposition']
            const filename = disposition?.match(/filename="?([^"]+)"?/)?.[1] ?? `purchases-taxes-${type}`

            return { data: res.data, type, filename }
        },
        onError: (error) => {
            console.log(error)
        }
    })

    return {
        //STATES
        status,

        // SET STATES
        setStatus,

        // MUTATIONS
        deleteSalesRecord,
        deletePurchasesRecord,
        downloadSalesMutation,
        downloadPurchasesMutation,
        downloadSalesTaxesMutation,
        downloadPurchasesTaxesMutation,
    }
}
export default useMutationFileGenerates;