import dayjs from 'dayjs'
import Image from 'next/image'
import { Badge, Popover, Skeleton } from 'antd'
import useNotifications from '@/controllers/notifications/useNotifications'
import scss from './styles/NotificationBell.module.scss'

const NotificationBell = () => {
    const { notifications, unreadCount, isLoading, handleMarkRead } = useNotifications()

    const content = (
        <div className={scss.panel}>
            <div className={scss.header}>
                <strong>Notifications</strong>
            </div>
            {
                isLoading
                ?
                <div className={scss.loading}>
                    <Skeleton active title={false} paragraph={{ rows: 3 }} />
                </div>
                :
                notifications.length
                ?
                <ul className={scss.list}>
                    {
                        notifications.map((notification) =>
                            <li
                                key={notification.id}
                                className={scss.item+(notification.is_read ? '' : ' '+scss.unread)}
                                onClick={() => handleMarkRead(notification.id)}
                            >
                                <div className={scss.itemMessage}>{notification.bell_notification_content}</div>
                                <div className={scss.itemTime}>
                                    {
                                        notification.created_at
                                        ? dayjs(notification.created_at).format('MM/DD/YYYY h:mm A')
                                        : ''
                                    }
                                </div>
                            </li>
                        )
                    }
                </ul>
                :
                <p className={scss.empty}>No notifications</p>
            }
        </div>
    )

    return (
        <Popover
            content={content}
            trigger='click'
            placement='bottomRight'
            arrow={false}
            styles={{ container: { padding: 0, borderRadius: 10, overflow: 'hidden' } }}
        >
            <button type='button' className={scss.bell} aria-label={'Notifications, '+unreadCount+' unread'}>
                <Badge count={unreadCount} size='small' offset={[2, -2]}>
                    <Image src='/svgs/header/notification.svg' alt='Notifications' priority width={20} height={20} unoptimized={true} />
                </Badge>
            </button>
        </Popover>
    )
}

export default NotificationBell
