import { useState } from 'react'
import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { AuditLogsData } from '../types'
import { initFilter } from '../states'

const useQueryAuditTrail = () => {
    const [filter, setFilter] = useState(initFilter)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const getAuditLogs = (
        page: number,
        page_size: number,
        action: string,
        resourceType: string,
        search: string,
    ) => {
        return useQuery<AuditLogsData, Error>({
            queryKey: ['audit-logs', page, page_size, action, resourceType, search],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/audit-logs`,
                    params: {
                        page,
                        page_size,
                        action: action || undefined,
                        resource_type: resourceType || undefined,
                        search: search || undefined,
                    },
                })

                return {
                    auditLogs: res.data?.audit_logs ?? [],
                    total: res.data?.total ?? 0,
                    totalPages: res.data?.total_pages ?? 0,
                }
            },
            placeholderData: (prev) => prev,
        })
    }

    return {
        // STATES
        filter,

        // SET STATES
        setFilter,

        // QUERIES
        getAuditLogs,
    }
}

export default useQueryAuditTrail