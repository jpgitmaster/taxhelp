import ProfileMenu from './ProfileMenu'
import SidebarHamburger from './SidebarHamburger'
import HeaderBreadcrumbs from './HeaderBreadcrumbs'
import NotificationBell from '@/components/reusables/NotificationBell'

interface HeaderUser {
    email?: string
    first_name?: string
    last_name?: string
    subscription?: {
        plan?: string
    }
}

interface BreadcrumbItem {
    label: string
    url?: string
}

interface PropsDefinition {
    scss: { [key: string]: string }
    user?: HeaderUser | null
    breadcrumb: { icon?: string, items: BreadcrumbItem[] }
    onToggleSidebar: () => void
    onLogout: () => void
}

const AppHeader = ({ scss, user, breadcrumb, onToggleSidebar, onLogout }: PropsDefinition) => {
    return (
        <div className={scss.appHeader}>
            <div className={scss.headerLeft}>
                <SidebarHamburger scss={scss} onClick={onToggleSidebar} />
                <HeaderBreadcrumbs scss={scss} icon={breadcrumb.icon} items={breadcrumb.items} />
            </div>
            <div className={scss.headerRight}>
                <div className={scss.headerIcon + ' ' + scss.notif}>
                    <NotificationBell scss={scss} />
                </div>
                <ProfileMenu scss={scss} user={user} onLogout={onLogout} />
            </div>
        </div>
    )
}

export default AppHeader
