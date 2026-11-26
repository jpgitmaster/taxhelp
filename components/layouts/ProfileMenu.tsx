import Link from 'next/link'
import Image from 'next/image'
import { Dropdown } from 'antd'

interface ProfileUser {
    email?: string
    first_name?: string
    last_name?: string
    subscription?: {
        plan?: string
    }
}

interface PropsDefinition {
    scss: { [key: string]: string }
    user?: ProfileUser | null
    onLogout: () => void
}

const getInitials = (user?: ProfileUser | null) => {
    const fromName = (
        (user?.first_name?.[0] ?? '') + (user?.last_name?.[0] ?? '')
    ).toUpperCase()

    if (fromName) return fromName

    return (user?.email?.[0] ?? '?').toUpperCase()
}

const getFullName = (user?: ProfileUser | null) => {
    if (user?.first_name && user?.last_name) {
        return `${user.first_name} ${user.last_name}`
    }
    return user?.email ?? ''
}

const ProfileMenu = ({ scss, user, onLogout }: PropsDefinition) => {
    const initials = getInitials(user)
    const fullName = getFullName(user)

    return (
        <Dropdown
            placement='bottomRight'
            trigger={['click']}
            popupRender={() => (
                <div className={scss.profileCard}>
                    <div className={scss.profileCardHeader}>
                        <span className={scss.avatarInitials}>{initials}</span>
                        <div className={scss.profileCardInfo}>
                            <strong>{fullName}</strong>
                            {user?.email && <small>{user.email}</small>}
                            {user?.subscription?.plan && (
                                <span className={scss.planBadge + ' ' + (scss[user.subscription.plan] ?? '')}>
                                    {user.subscription.plan}
                                </span>
                            )}
                        </div>
                    </div>

                    <hr className={scss.profileCardDivider} />

                    <Link href='/bookkeeper/profile/edit' className={scss.profileCardItem}>
                        <Image src='/svgs/header/profile.svg' alt='' width={16} height={16} unoptimized={true} />
                        Profile
                    </Link>
                    <Link href='/bookkeeper/subscription' className={scss.profileCardItem}>
                        <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor'>
                            <path d='M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3v-6h18v6zm0-10H3V6h18v2z' />
                        </svg>
                        Subscription
                    </Link>

                    <hr className={scss.profileCardDivider} />

                    <button type='button' className={scss.profileCardItem + ' ' + scss.logoutItem} onClick={onLogout}>
                        <Image src='/svgs/header/logout.svg' alt='' width={16} height={16} unoptimized={true} />
                        Logout
                    </button>
                </div>
            )}
        >
            <button type='button' className={scss.profileTrigger}>
                <span className={scss.avatarInitials}>{initials}</span>
                <Image
                    src='/svgs/master/arrowDown.svg'
                    alt=''
                    width={12}
                    height={12}
                    unoptimized={true}
                    className={scss.chevron}
                />
            </button>
        </Dropdown>
    )
}

export default ProfileMenu
