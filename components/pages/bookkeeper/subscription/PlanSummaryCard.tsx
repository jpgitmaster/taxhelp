import Link from 'next/link'
import SubscriptionCard from './SubscriptionCard'
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
        <SubscriptionCard
            scss={scss}
            icon={PLAN_ICON[subscription?.plan ?? 'basic']}
            title={<span style={{textTransform: 'capitalize'}}>{subscription?.plan} Plan</span>}
            badge={
                <span className={scss.statusBadge+' '+(subscription?.status === 'active' ? scss.statusActive : scss.statusCancelled)}>
                    {subscription?.status}
                </span>
            }
            action={
                <Link href='/bookkeeper/subscription/plans' className={scss.button+' '+scss.btnblue}>
                    Change Plan
                </Link>
            }
        >
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
        </SubscriptionCard>
    )
}
