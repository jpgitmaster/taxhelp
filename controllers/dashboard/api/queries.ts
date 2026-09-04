import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
const useQuerySchedules = () => {
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const getScheduleCategories = (search: string = '') => {
        return useQuery({
            queryKey: [
                'schedule_categories',
                search
            ],

            queryFn: async () => {

                const res = await api({
                    method: 'GET',
                    params: {
                        search
                    },
                    url: `/api/${apiVersion}/schedule-categories`
                })
                return {
                    schedCategories: res.data?.categories ?? [],
                    totalCategories: res.data?.total ?? 0
                }
            },

            // ✅ prevents UI flicker (React Query v5)
            placeholderData: (prev) => prev ?? { schedCategories: [], totalCategories: 0 },

            // ✅ smoother UX (no "dead" state when picking dates)
            enabled: true,

            // ✅ optional but highly recommended
            staleTime: 1000 * 30 // 30 seconds cache
        })
    }

    const getSchedules = () => {
        return useQuery({
            queryKey: [
                'schedules'
            ],

            queryFn: async () => {

                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/schedules`
                })
                return {
                    schedules: res.data?.schedules ?? [],
                    totalSchedules: res.data?.total ?? 0
                }
            },

            // ✅ prevents UI flicker (React Query v5)
            placeholderData: (prev) => prev ?? { schedules: [], totalSchedules: 0 },

            // ✅ smoother UX (no "dead" state when picking dates)
            enabled: true,

            // ✅ optional but highly recommended
            staleTime: 1000 * 30 // 30 seconds cache
        })
    }
    return {
        // STATES

        // SET STATES

        // QUERIES
        getSchedules,
        getScheduleCategories,
    }
}

export default useQuerySchedules