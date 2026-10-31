import { useState } from 'react'
import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { BirValidationsData } from '../types'
import { initFilter } from '../states'

const useQueryBirValidation = () => {
    const [filter, setFilter] = useState(initFilter)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const useBirValidationsQuery = (
        page: number,
        page_size: number,
        status: string,
        search: string,
    ) => {
        return useQuery<BirValidationsData, Error>({
            queryKey: ['bir-validations', page, page_size, status, search],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/bir-validations`,
                    params: {
                        page,
                        page_size,
                        status: status || undefined,
                        search: search || undefined,
                    },
                })

                return {
                    birValidations: res.data?.bir_validations ?? [],
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
        useBirValidationsQuery,
    }
}

export default useQueryBirValidation
