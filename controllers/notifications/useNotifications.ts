import useQueryNotifications from './api/queries'
import useMutationNotifications from './api/mutations'
import { initNotifications } from './states'

const useNotifications = () => {
    const { getNotifications } = useQueryNotifications()
    const { markAsRead } = useMutationNotifications()

    const { data, isLoading, isFetching } = getNotifications()

    const notifications = data?.notifications ?? initNotifications
    const unreadCount = data?.unreadCount ?? 0

    const handleMarkRead = (id: number) => {
        const notification = notifications.find((item) => item.id === id)

        // Already read (or unknown) — nothing to persist.
        if (!notification || notification.is_read) {
            return
        }

        markAsRead.mutate(id)
    }

    return {
        // STATES
        notifications,
        unreadCount,
        isLoading,
        isFetching,

        // HANDLERS
        handleMarkRead,
    }
}

export default useNotifications
