import api from '@/components/reusables/axios'
import { useQuery } from '@tanstack/react-query'
import { NotificationsData } from '../types'

const useQueryNotifications = () => {
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const getNotifications = () => {
        return useQuery<NotificationsData, Error>({
            queryKey: ['notifications'],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/notifications`,
                })

                return {
                    notifications: res.data?.notifications ?? [],
                    unreadCount: res.data?.unread_count ?? 0,
                    total: res.data?.total ?? 0,
                }
            },
            retry: false,
            refetchInterval: 60000,
        })
    }

    return {
        // REQUESTS
        getNotifications,
    }
}

export default useQueryNotifications
