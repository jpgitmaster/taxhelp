import { AxiosError } from 'axios'
import api from '@/components/reusables/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationItem } from '../types'

interface NotificationReadResponse {
    notification: NotificationItem
    success: boolean
    message: string
}

const useMutationNotifications = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const markAsRead = useMutation<NotificationReadResponse, AxiosError, number>({
        mutationFn: async (notificationId: number) => {
            const res = await api({
                method: 'PATCH',
                url: `/api/${apiVersion}/notifications/${notificationId}/read`,
            })

            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        },
    })

    return {
        // REQUESTS
        markAsRead,
    }
}

export default useMutationNotifications
