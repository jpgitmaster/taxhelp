import { User } from '../types'
import { useState } from 'react'
import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'
const useQueryUsers = () => {
    const [filter, setFilter] = useState(initFilter)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    
    const getUser = () => {
        return useQuery({
            queryKey: ['user'],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/auth/me`
                })
                const { user } = res.data
                return user ?? null
            },
            placeholderData: (prev) => prev,
        })
    }
    return {
        // STATES
        filter,
        status,

        // SET STATES
        setFilter,
        setStatus,

        // QUERIES
        getUser
    }
}

export default useQueryUsers