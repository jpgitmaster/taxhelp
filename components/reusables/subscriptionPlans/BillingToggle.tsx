interface PropsDefinition {
    billing: 'monthly' | 'yearly'
    scss: { [key: string]: string }
    onChange(billing: 'monthly' | 'yearly'): void
}

const BillingToggle = ({ billing, scss, onChange }: PropsDefinition) => {
    return (
        <div className={scss.billingToggle}>
            <div className={scss.toggle}>
                <button
                    type='button'
                    onClick={() => onChange('monthly')}
                    className={scss.btn + (billing === 'monthly' ? ' '+scss.active : '')}
                >
                    Monthly
                </button>
                <button
                    type='button'
                    onClick={() => onChange('yearly')}
                    className={scss.btn + (billing === 'yearly' ? ' '+scss.active : '')}
                >
                    Yearly (Save more)
                </button>
            </div>
        </div>
    )
}

export default BillingToggle
