import { useState } from 'react'
import api from '@/components/reusables/axios'
import { Dashboard, ScheduleObj } from '../types'
import { Status } from '@/controllers/global/types'
import { initStatus } from '@/controllers/global/states'
import { initDashboard, initScheduleObj } from '../states'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useMutationSchedules = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    const [dashboard, setDashboard] = useState<Dashboard>(initDashboard)
    const createCategory = useMutation({
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
        onError: (error) => {
            console.log(error)
        }
    })
    const updateCategory = useMutation({
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

    const createSchedule = useMutation({
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
        onError: (error) => {
            console.log(error)
        }
    })

    const updateSchedule = useMutation({
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
            queryClient.invalidateQueries({ queryKey: ['schedules'] })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const deleteSchedule = useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/api/${apiVersion}/schedules/${id}`)
            return res.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] })
        },

        onError: (error) => {
            console.log(error)
        }
    })
    return {
        //STATES
        status,
        dashboard,
        initScheduleObj,

        // SET STATES
        setStatus,
        setDashboard,

        // MUTATIONS
        createCategory,
        updateCategory,
        deleteSchedule,
        updateSchedule,
        createSchedule,
    }
}
export default useMutationSchedules;