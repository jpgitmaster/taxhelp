import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { Record_ } from '../types'
import { initRecord } from '../states'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
const fileConfig: Record<string, { mime: string; ext: string }> = {
    journal: {
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ext: 'xlsx',
    },
    dat: {
        mime: 'text/plain',
        ext: 'dat',
    },
}

const useFileGeneratorAPI = () => {
    const queryClient = useQueryClient()
    const [filter, setFilter] = useState(initFilter)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    const [record, setRecord] = useState<Record_>(initRecord)

    const useGetSales = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string,
        doc: {
            search: string
            selectedTable: {
                value: string,
                label: string
            }
            client: {
                id: number | null,
                registered_name: string
            },
            period: Dayjs | null
        }
    ) => {
        return useQuery({
            queryKey: ['sales_file', page, limit, filter, search, doc],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/sales/records`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        // sortOrder: 'ASC',
                        // filter: JSON.stringify(filter),
                        clientId: doc.client.id,
                        taxable_month_from: doc.period?.format('MM/YYYY') ?? null,
                        taxable_month_to: doc.period?.format('MM/YYYY') ?? null,
                    }
                })
                
                return {
                    records: res.data?.sales ?? [],
                    totalRecords: res.data?.total ?? 0
                }
            },
            // ✅ KEY PART
            enabled: !!doc.period && !!doc.client.id && !!doc.selectedTable.value && doc.selectedTable.value === 'SALES', // 👈 only runs when these conditions are met
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
            queryClient.invalidateQueries({
                queryKey: ['sales_file']
            })
        },

        onError: (error: any) => {
            console.log(error)
        }
    })

    
    const useGetSalesTaxes = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string,
        doc: {
            search: string
            selectedTable: {
                value: string,
                label: string,
                parentValue?: string
            }
            client: {
                id: number | null,
                registered_name: string
            },
            period: Dayjs | null
        }
    ) => {
        return useQuery({
            queryKey: ['sales_taxes_file', page, limit, filter, search, doc],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/sales-taxes/records`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        // sortOrder: 'ASC',
                        // filter: JSON.stringify(filter),
                        clientId: doc.client.id,
                        taxable_month_from: doc.period?.format('MM/YYYY') ?? null,
                        taxable_month_to: doc.period?.format('MM/YYYY') ?? null,
                    }
                })
                return {
                    records: res.data?.sales_taxes ?? [],
                    totalRecords: res.data?.total ?? 0
                }
            },
            // ✅ KEY PART
            enabled:
                !!doc.period &&
                !!doc.client.id &&
                (
                    doc.selectedTable.parentValue === 'QAP' ||
                    doc.selectedTable.parentValue === 'SAWT'
                ),
        })
    }

    const useGetPurchases = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string,
        doc: {
            search: string
            selectedTable: {
                value: string,
                label: string
            }
            client: {
                id: number | null,
                registered_name: string
            },
            period: Dayjs | null
        }
    ) => {
        return useQuery({
            queryKey: ['purchases_file', page, limit, filter, search, doc],
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
                        clientId: doc.client.id,
                        taxable_month_from: doc.period?.format('MM/YYYY') ?? null,
                        taxable_month_to: doc.period?.format('MM/YYYY') ?? null,
                    }
                })
                return {
                    records: res.data?.purchases ?? [],
                    totalRecords: res.data?.total ?? 0
                }
            },
            // ✅ KEY PART
            enabled: !!doc.period && !!doc.client.id && !!doc.selectedTable.value && doc.selectedTable.value === 'PURCHASES', // 👈 only runs when these conditions are met
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
            queryClient.invalidateQueries({
                queryKey: ['purchases_file']
            })
        },
        onError: (error: any) => {
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

        onSuccess: ({ data, type, filename }) => {
            const config = fileConfig[type] || {
                mime: 'application/octet-stream',
                ext: 'dat',
            }

            const blob = new Blob([data], { type: config.mime })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = filename

            document.body.appendChild(link)
            link.click()

            link.remove()
            window.URL.revokeObjectURL(url)
            setStatus(prev => ({
                ...prev,
                loader: false
            }))
        },

        onError: (error: any) => {
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

        onSuccess: ({ data, type, filename }) => {
            const config = fileConfig[type] || {
                mime: 'application/octet-stream',
                ext: 'dat',
            }

            const blob = new Blob([data], { type: config.mime })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = filename

            document.body.appendChild(link)
            link.click()

            link.remove()
            window.URL.revokeObjectURL(url)
            setStatus(prev => ({
                ...prev,
                loader: false
            }))
        },

        onError: (error: any) => {
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
        }) => {
            const { doc, type, form_type } = params

            const res = await api.post(
                `/api/${apiVersion}/files/download/sales_taxes`,
                {
                    type: type,
                    form_type: form_type,
                    client_id: doc.client.id,
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

        onSuccess: ({ data, type, filename }) => {
            const config = fileConfig[type] || {
                mime: 'application/octet-stream',
                ext: 'dat',
            }

            const blob = new Blob([data], { type: config.mime })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = filename

            document.body.appendChild(link)
            link.click()

            link.remove()
            window.URL.revokeObjectURL(url)
            setStatus(prev => ({
                ...prev,
                loader: false
            }))
        },

        onError: (error: any) => {
            console.log(error)
        }
    })

    return {
        //STATES
        filter,
        status,
        record,
        initRecord,
        
        // SET STATES
        setFilter,
        setStatus,
        setRecord,

        // QUERIES
        useGetSales,
        useGetPurchases,
        useGetSalesTaxes,
        
        // MUTATION
        useDeleteSalesRecord,
        downloadSalesMutation,
        useDeletePurchasesRecord,
        downloadPurchasesMutation,
        downloadSalesTaxesMutation

        //HANDLES
    }
}
export default useFileGeneratorAPI;