import Link from 'next/link'
import { Subscription, Payment } from '@/controllers/subscriptions/types'
import { formatDate, formatAmount, PLAN_ICON } from '@/controllers/subscriptions/format'

export default function PlanSummaryCard(props: {
    subscription: Subscription | undefined
    latestPayment: Payment | undefined
    isFree: boolean
    scss: { [key: string]: string }
}) {
    const { subscription, latestPayment, isFree, scss } = props

    return (
        <div className={scss.card+' '+scss.w100}>
            <div className={scss.planbox+' '+scss.blue}>
                <div className={scss.planHeaderRow}>
                    <div className={scss.planHeader}>
                        <div className={scss.planIcon} aria-hidden="true">{PLAN_ICON[subscription?.plan ?? 'basic']}</div>
                        <div>
                            <h2 style={{textTransform: 'capitalize'}}>
                                {subscription?.plan} Plan
                            </h2>
                            <span className={scss.statusBadge+' '+(subscription?.status === 'active' ? scss.statusActive : scss.statusCancelled)}>
                                {subscription?.status}
                            </span>
                        </div>
                    </div>
                    <Link href='/bookkeeper/subscription/plans' className={scss.button+' '+scss.btnblue}>
                        Change Plan
                    </Link>
                </div>
                {isFree ? (
                    <p>Free plan</p>
                ) : (
                    <div className={scss.planStats}>
                        <div className={scss.planStat}>
                            <span className={scss.planStatLabel}>Price</span>
                            <span className={scss.planStatValue}>
                                {latestPayment ? formatAmount(latestPayment.amount, latestPayment.currency) : 'N/A'}
                            </span>
                        </div>
                        <div className={scss.planStat}>
                            <span className={scss.planStatLabel}>Active Until</span>
                            <span className={scss.planStatValue}>{formatDate(subscription?.expires_at)}</span>
                        </div>
                        <div className={scss.planStat}>
                            <span className={scss.planStatLabel}>Billing Cycle</span>
                            <span className={scss.planStatValue} style={{textTransform: 'capitalize'}}>
                                {latestPayment?.billing_cycle ?? 'N/A'}
                            </span>
                        </div>
                    </div>
                )}
                {subscription?.pending_plan && (
                    <p style={{textTransform: 'capitalize'}}>
                        Downgrading to {subscription.pending_plan} on {formatDate(subscription.expires_at)}
                    </p>
                )}
            </div>
        </div>
    )
}
