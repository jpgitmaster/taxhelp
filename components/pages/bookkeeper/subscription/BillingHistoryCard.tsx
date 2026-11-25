import { Payment } from '@/controllers/subscriptions/types'
import { formatDate, formatAmount } from '@/controllers/subscriptions/format'

export default function BillingHistoryCard(props: {
    payments: Payment[] | undefined
    scss: { [key: string]: string }
}) {
    const { payments, scss } = props

    return (
        <div className={scss.card+' '+scss.w100}>
            <div className={scss.planbox+' '+scss.blue}>
                <h2>
                    Billing History
                </h2>
                {payments && payments.length > 0 ? (
                    <div className={scss.billingTableWrapper}>
                        <table className={scss.billingTable}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Plan</th>
                                    <th>Billing Cycle</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>{formatDate(payment.paid_at ?? payment.created_at)}</td>
                                        <td style={{textTransform: 'capitalize'}}>{payment.plan}</td>
                                        <td style={{textTransform: 'capitalize'}}>{payment.billing_cycle}</td>
                                        <td>{formatAmount(payment.amount, payment.currency)}</td>
                                        <td>
                                            <span className={scss.statusPill+' '+scss['status_'+payment.status]} style={{textTransform: 'capitalize'}}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className={scss.emptyState}>No billing history yet.</p>
                )}
            </div>
        </div>
    )
}
