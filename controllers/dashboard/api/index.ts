import { useState } from 'react'
import api from '@/components/reusables/axios'
import { Dashboard, ScheduleObj } from '../types'
import { Status } from '@/controllers/global/types'
import { initDashboard, initScheduleObj } from '../states'
import { initStatus, initFilter } from '@/controllers/global/states'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
const useDashboardAPI = () => {
    const queryClient = useQueryClient()
    const [filter, setFilter] = useState(initFilter)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    
    const [dashboard, setDashboard] = useState<Dashboard>(initDashboard)

    const useGetScheduleCategories = () => {
        return useQuery({
            queryKey: [
                'schedule_categories'
            ],

            queryFn: async () => {

                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/schedule-categories`
                })
                console.log(res)
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

    const useGetSchedules = () => {
        return useQuery({
            queryKey: [
                'schedules'
            ],

            queryFn: async () => {

                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/schedules`
                })
                console.log(res)
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

    const useCreateCategory = useMutation({
        mutationFn: async (category: { name: string, color: string }) => {
            const res = await api.post(`/api/${apiVersion}/schedule-categories`, {
                name: category.name,
                color: category.color
            })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule_categories'] })
        },
        onError: (error: any) => {
            console.log(error)
        }
    })

    const useCreateSchedule = useMutation({
        mutationFn: async (schedule: ScheduleObj) => {
            const startDate = schedule.schedule?.[0]?.format('YYYY-MM-DD');
            const endDate = schedule.schedule?.[1]?.format('YYYY-MM-DD');
            const res = await api.post(`/api/${apiVersion}/schedules`, {
                title: schedule.title,
                schedule_date_to: endDate,
                client_id: schedule.clientID,
                schedule_date_from: startDate,
                category_id: schedule.category.id,
                description: schedule.description,
                category_name: schedule.category.name,
                category_color: schedule.category.color,
            })
            return res.data
        },
        onSuccess: () => {
            setStatus({...status, loader: false})
            setDashboard({
                ...dashboard,
                scheduleObj: initScheduleObj
            })
            queryClient.invalidateQueries({ queryKey: ['schedules'] })
        },
        onError: (error: any) => {
            console.log(error)
        }
    })
    return {
        //STATES
        filter,
        status,
        dashboard,
        
        // SET STATES
        setFilter,
        setStatus,
        setDashboard,

        // QUERIES
        useGetSchedules,
        useGetScheduleCategories,

        // MUTATION
        useCreateSchedule,
        useCreateCategory,

        //HANDLES
    }
}
export default useDashboardAPI;