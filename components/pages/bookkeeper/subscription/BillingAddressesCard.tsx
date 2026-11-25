import Image from 'next/image'
import SubscriptionCard from './SubscriptionCard'
import { BillingAddress } from '@/controllers/billingAddresses/types'

export default function BillingAddressesCard(props: {
    addresses: BillingAddress[] | undefined
    scss: { [key: string]: string }
    onSetDefault(id: number): void
    onEdit(address: BillingAddress): void
    onDelete(id: number): void
    onAddNew(): void
}) {
    const { addresses, scss, onSetDefault, onEdit, onDelete, onAddNew } = props

    return (
        <SubscriptionCard
            scss={scss}
            title='Billing Addresses'
            description='Used on your payment receipts. The default address is also sent to PayMongo at checkout.'
            action={
                <button
                    type='button'
                    onClick={onAddNew}
                    className={scss.button+' '+scss.btnblue}
                >
                    Add New Address
                </button>
            }
        >
            {addresses && addresses.length > 0 ? (
                <ul className={scss.addressList}>
                    {addresses.map((address) => (
                        <li key={address.id} className={scss.addressCard}>
                            <div className={scss.addressCardActions}>
                                {address.is_default ? (
                                    <span className={scss.defaultBadge}>Default</span>
                                ) : (
                                    <button
                                        type='button'
                                        title='Set as Default'
                                        onClick={() => onSetDefault(address.id)}
                                        className={scss.iconBtn}
                                    >
                                        <Image src='/svgs/check.svg' alt='Set as Default' width={16} height={16} unoptimized={true} />
                                    </button>
                                )}
                                <button
                                    type='button'
                                    title='Edit'
                                    onClick={() => onEdit(address)}
                                    className={scss.iconBtn}
                                >
                                    <Image src='/svgs/edit.svg' alt='Edit' width={16} height={16} unoptimized={true} />
                                </button>
                                <button
                                    type='button'
                                    title='Delete'
                                    onClick={() => onDelete(address.id)}
                                    className={scss.iconBtn}
                                >
                                    <Image src='/svgs/delete.svg' alt='Delete' width={16} height={16} unoptimized={true} />
                                </button>
                            </div>
                            <p>
                                {address.name}<br />
                                {[address.line1, address.line2].filter(Boolean).join(', ')}
                                {(address.line1 || address.line2) && <br />}
                                {[address.city, address.state, address.postal_code].filter(Boolean).join(', ')}
                                {address.country && ` ${address.country}`}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={scss.emptyState}>No billing address set.</p>
            )}
        </SubscriptionCard>
    )
}
