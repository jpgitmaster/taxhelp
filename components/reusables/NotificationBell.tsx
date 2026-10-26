import dayjs from 'dayjs'
import Image from 'next/image'
import { Badge, Popover, Skeleton } from 'antd'
import useNotifications from '@/controllers/notifications/useNotifications'
import sass from './styles/NotificationBell.module.scss'
interface PropsDefinition {
  scss: { [key: string]: string };
}
const NotificationBell = ({ scss }: PropsDefinition) => {
    const { notifications, unreadCount, isLoading, handleMarkRead } = useNotifications()

    const content = (
        <div className={sass.panel}>
            <div className={sass.header}>
                <strong>Notifications</strong>
            </div>
            {
                isLoading
                ?
                <div className={sass.loading}>
                    <Skeleton active title={false} paragraph={{ rows: 3 }} />
                </div>
                :
                notifications.length
                ?
                <ul className={sass.list}>
                    {
                        notifications.map((notification) =>
                            <li
                                key={notification.id}
                                className={sass.item+(notification.is_read ? '' : ' '+sass.unread)}
                                onClick={() => handleMarkRead(notification.id)}
                            >
                                <div className={sass.itemMessage}>{notification.bell_notification_content}</div>
                                <div className={sass.itemTime}>
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
                <p className={sass.empty}>No notifications</p>
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
            <Badge count={unreadCount} size='small' offset={[2, -2]}>
                <button type='button' className={scss.icon + (unreadCount ? ' ' + scss.hasUnread : '')} aria-label={'Notifications, '+unreadCount+' unread'} style={{width: '18px', height: '18px'}}>
                    <Image src='/svgs/header/notification.svg' alt='Notifications' priority width={20} height={20} unoptimized={true} />
                </button>
            </Badge>
        </Popover>
    )
}

export default NotificationBell
