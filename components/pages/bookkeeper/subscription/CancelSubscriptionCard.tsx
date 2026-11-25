import { useState } from 'react'
import SubscriptionCard from './SubscriptionCard'
import CancelSubscriptionModal from './CancelSubscriptionModal'

export default function CancelSubscriptionCard(props: {
    plan: string | undefined
    expiresAt: string | null | undefined
    pending: boolean
    scss: { [key: string]: string }
    onCancel(): void
}) {
    const { plan, expiresAt, pending, scss, onCancel } = props
    const [open, setOpen] = useState(false)

    const handleConfirm = () => {
        onCancel()
        setOpen(false)
    }

    return (
        <SubscriptionCard
            scss={scss}
            variant='red'
            title='Cancel Subscription'
            action={
                <button
                    type='button'
                    onClick={() => setOpen(true)}
                    disabled={pending}
                    className={scss.button+' '+scss.btnred}
                >
                    {pending ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
            }
        >
            <CancelSubscriptionModal
                open={open}
                plan={plan}
                expiresAt={expiresAt}
                pending={pending}
                onConfirm={handleConfirm}
                onCancel={() => setOpen(false)}
            />
        </SubscriptionCard>
    )
}
