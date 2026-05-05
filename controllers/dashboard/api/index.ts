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

    const useUpdateCategory = useMutation({
        mutationFn: async (category: { id: number, name: string, color: string }) => {
            const res = await api.put(`/api/${apiVersion}/schedule-categories/${category.id}`, {
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
                client_id: schedule.client_id,
                schedule_date_from: startDate,
                category_id: schedule.category.id,
                description: schedule.description,
                category_name: schedule.category.name,
                category_color: schedule.category.color,
            })
            return res.data
        },
        onSuccess: () => {
            setStatus(prev => ({
                ...prev,
                loader: false,
                message: 'Schedule created successfully.'
            }))

            setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    message: ''
                }))
            }, 5000)

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

    const useUpdateSchedule = useMutation({
        mutationFn: async (schedule: ScheduleObj) => {
            const startDate = schedule.schedule?.[0]?.format('YYYY-MM-DD');
            const endDate = schedule.schedule?.[1]?.format('YYYY-MM-DD');
            const res = await api.put(`/api/${apiVersion}/schedules/${schedule.id}`, {
                title: schedule.title,
                schedule_date_to: endDate,
                client_id: schedule.client_id,
                schedule_date_from: startDate,
                category_id: schedule.category.id,
                description: schedule.description,
                category_name: schedule.category.name,
                category_color: schedule.category.color,
            })
            return res.data
        },
        onSuccess: () => {
            setStatus(prev => ({
                ...prev,
                loader: false,
                message: 'Schedule updated successfully.'
            }))

            setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    message: ''
                }))
            }, 5000)

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

    const useDeleteSchedule = useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/api/${apiVersion}/schedules/${id}`)
            return res.data
        },

        onSuccess: () => {
            setDashboard({
                ...dashboard,
                scheduleObj: initScheduleObj
            })
            setStatus(prev => ({
                ...prev,
                loader: false,
                message: 'Your schedule record has been deleted.'
            }))
            // auto-clear after 5s
            setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    message: ''
                }))
            }, 5000)
            
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
        useUpdateSchedule,
        useCreateSchedule,
        useCreateCategory,
        useDeleteSchedule,
        useUpdateCategory,

        //HANDLES
    }
}
export default useDashboardAPI;