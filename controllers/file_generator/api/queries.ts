import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { Record_ } from '../types'
import { initRecord } from '../states'
import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'
const useQueryFileGenerates = () => {
    const [filter, setFilter] = useState(initFilter)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    const [record, setRecord] = useState<Record_>(initRecord)
    const getSales = (
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

    const getSalesTaxes = (
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

    const getPurchases = (
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
    return {
        // STATES
        filter,
        status,
        record,

        // SET STATES
        setFilter,
        setStatus,
        setRecord,

        // QUERIES
        getSales,
        getPurchases,
        getSalesTaxes
    }
}

export default useQueryFileGenerates