interface NotificationItem {
    id: number
    user_id: number
    bell_notification_content: string
    is_read: boolean
    created_at: string
}

interface NotificationsData {
    notifications: NotificationItem[]
    unreadCount: number
    total: number
}

export type {
    NotificationItem,
    NotificationsData,
}
