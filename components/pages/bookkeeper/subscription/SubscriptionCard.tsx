import { ReactNode } from 'react'

export default function SubscriptionCard(props: {
    icon?: ReactNode
    title: ReactNode
    badge?: ReactNode
    description?: ReactNode
    action?: ReactNode
    variant?: 'blue' | 'red'
    scss: { [key: string]: string }
    children?: ReactNode
}) {
    const { icon, title, badge, description, action, variant = 'blue', scss, children } = props

    return (
        <div className={scss.card+' '+scss.w100}>
            <div className={scss.planbox+' '+scss[variant]}>
                <div className={scss.planHeaderRow}>
                    <div className={scss.planHeader}>
                        {icon && (
                            <div className={scss.planIcon} aria-hidden="true">{icon}</div>
                        )}
                        <div>
                            <div className={scss.titleRow}>
                                <h2>{title}</h2>
                                {badge}
                            </div>
                            {description && (
                                <p className={scss.cardDescription}>{description}</p>
                            )}
                        </div>
                    </div>
                    {action}
                </div>
                <hr className={scss.cardDivider} />
                {children}
            </div>
        </div>
    )
}
