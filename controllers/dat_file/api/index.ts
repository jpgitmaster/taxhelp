import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { Record_ } from '../types'
import { initRecord } from '../states'
import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'


const useDatAPI = () => {
    const [filter, setFilter] = useState(initFilter)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    const [record, setRecord] = useState<Record_>(initRecord)

    const useGetRecords = (
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
            queryKey: ['dat_files', page, limit, filter, search, doc],
            queryFn: async () => {
                console.log(doc.period?.format('YYYY'))
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/sales/records`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter),
                        clientId: doc.client.id,
                        month: doc.period?.format('MM') ?? null,
                        year: doc.period?.format('YYYY') ?? null
                    }
                })
                console.log(res)
                return {
                    records: res.data?.data ?? [],
                    totalRecords: res.data?.total ?? 0
                }
            },
            // ✅ KEY PART
            enabled: !!doc.period && !!doc.client.id && !!doc.selectedTable.value,
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }

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
        useGetRecords,

        // MUTATION

        //HANDLES
    }
}
export default useDatAPI;