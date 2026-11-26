import { Modal } from 'antd'
import scss from './styles/CancelSubscriptionModal.module.scss'
import { formatDate } from '@/controllers/subscriptions/format'

export default function CancelSubscriptionModal(props: {
    open: boolean
    plan: string | undefined
    expiresAt: string | null | undefined
    pending: boolean

    onConfirm(): void
    onCancel(): void
}) {
    const { open, plan, expiresAt, pending, onConfirm, onCancel } = props

    return (
        <Modal
            footer={null}
            open={open}
            onCancel={onCancel}
        >
            <div className={scss.cancelSubscriptionModal}>
                <h3 className={scss.title} style={{textTransform: 'capitalize'}}>
                    Cancel {plan} Subscription?
                </h3>

                <p className={scss.message}>
                    You will keep access to your <strong style={{textTransform: 'capitalize'}}>{plan}</strong> plan until <strong>{formatDate(expiresAt)}</strong>. After that date, your account will automatically move to the <strong>Basic</strong> (free) plan — no refund is issued for time already paid for.
                </p>

                <div className={scss.actions}>
                    <button type='button' onClick={onCancel} disabled={pending} className={scss.btn+' '+scss.btnKeep}>
                        Keep Subscription
                    </button>
                    <button type='button' onClick={onConfirm} disabled={pending} className={scss.btn+' '+scss.btnCancel}>
                        {pending ? 'Cancelling...' : 'Cancel Subscription'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
