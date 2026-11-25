export default function CancelSubscriptionCard(props: {
    pending: boolean
    scss: { [key: string]: string }
    onCancel(): void
}) {
    const { pending, scss, onCancel } = props

    return (
        <div className={scss.card+' '+scss.w100}>
            <div className={scss.planbox+' '+scss.red}>
                <h2>
                    Cancel Subscription
                </h2>
                <button
                    type='button'
                    onClick={onCancel}
                    disabled={pending}
                    className={scss.button+' '+scss.btnred}
                >
                    {pending ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
            </div>
        </div>
    )
}
