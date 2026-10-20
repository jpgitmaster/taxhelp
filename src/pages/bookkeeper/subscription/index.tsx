
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { signOut, getSession } from 'next-auth/react'
import scss from './styles/Subscription.module.scss'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import useQuerySubscriptions from '@/controllers/subscriptions/api/queries'
import useMutationSubscriptions from '@/controllers/subscriptions/api/mutations'
import useQueryBillingAddresses from '@/controllers/billingAddresses/api/queries'
import useMutationBillingAddresses from '@/controllers/billingAddresses/api/mutations'
import { BillingAddress, BillingAddressForm } from '@/controllers/billingAddresses/types'
import BillingAddressModal from '@/components/pages/bookkeeper/subscription/BillingAddressModal'

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatAmount = (amount: string, currency: string) => {
  const symbol = currency === 'PHP' ? '₱' : `${currency} `
  return `${symbol}${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
}

const PLAN_ICON: Record<string, string> = {
  basic: '◻',
  pro: '◆',
  enterprise: '⬢',
}

const emptyBillingForm: BillingAddressForm = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
}

const ManageSubscription_V = ({ session }: PageProps) => {
  const { getMySubscription, getMyPayments } = useQuerySubscriptions()
  const { cancelSubscription } = useMutationSubscriptions()
  const { getMyBillingAddresses } = useQueryBillingAddresses()
  const { createBillingAddress, updateBillingAddress, setDefaultBillingAddress, deleteBillingAddress } = useMutationBillingAddresses()
  const { data: subscription } = getMySubscription()
  const { data: payments } = getMyPayments()
  const { data: billingAddresses } = getMyBillingAddresses()

  const isFree = subscription?.plan === 'basic'
  const isEnterprise = subscription?.plan === 'enterprise'
  const latestPayment = payments?.find((payment) => payment.status === 'paid')

  // null = not editing, 'new' = adding a new address, number = editing that address id
  const [editingAddressId, setEditingAddressId] = useState<number | 'new' | null>(null)
  const [billingForm, setBillingForm] = useState<BillingAddressForm>(emptyBillingForm)

  const handleBillingFieldChange = (field: keyof BillingAddressForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setBillingForm((prev) => ({ ...prev, [field]: e.target.value }))

  const startAddAddress = () => {
    setBillingForm(emptyBillingForm)
    setEditingAddressId('new')
  }

  const startEditAddress = (address: BillingAddress) => {
    setBillingForm({
      name: address.name ?? '',
      phone: address.phone ?? '',
      line1: address.line1 ?? '',
      line2: address.line2 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      postal_code: address.postal_code ?? '',
      country: address.country ?? '',
    })
    setEditingAddressId(address.id)
  }

  const handleCancel = () => {
    if (!confirm('Cancel your subscription? You will keep access until your current billing period ends.')) return
    cancelSubscription.mutate()
  }

  const isSavingBilling = createBillingAddress.isPending || updateBillingAddress.isPending

  const handleSaveBilling = () => {
    if (editingAddressId === 'new') {
      createBillingAddress.mutate(billingForm, { onSuccess: () => setEditingAddressId(null) })
    } else if (editingAddressId !== null) {
      updateBillingAddress.mutate(
        { id: editingAddressId, ...billingForm },
        { onSuccess: () => setEditingAddressId(null) }
      )
    }
  }

  const handleDeleteAddress = (id: number) => {
    if (!confirm('Delete this billing address?')) return
    deleteBillingAddress.mutate(id)
  }

  return (
    <div>
      
      {/* Sidebar */}
      {/* <aside className="w-64 bg-white border-r p-6 space-y-6">
        <h2 className="text-xl font-semibold">Settings</h2>

        <nav className="space-y-2 text-sm">
          <div className="text-gray-400 uppercase text-xs">Account</div>
          <a className="block text-gray-600 hover:text-black">Profile</a>
          <a className="block text-gray-600 hover:text-black">Security</a>

          <div className="text-gray-400 uppercase text-xs mt-4">Billing</div>
          <a className="block font-medium text-black">Subscription</a>
          <a className="block text-gray-600 hover:text-black">Invoices</a>
          <a className="block text-gray-600 hover:text-black">Payment Methods</a>
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className={scss.box}>

        {/* Header */}
        <div className={scss.boxTitle}>
          <h2>
            Subscription
          </h2>
          <p>
            Manage your plan, billing, and usage.
          </p>
        </div>
        <section className={scss.cards+' '+scss.plantop}>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.planbox+' '+scss.blue}>
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
              <Link href='/bookkeeper/subscription/plans' className={scss.button+' '+scss.btnblue}>
                Change Plan
              </Link>
            </div>
          </div>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.planbox+' '+scss.blue}>
              <h2>
                Billing History
              </h2>
              {payments && payments.length > 0 ? (
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
              ) : (
                <p className={scss.emptyState}>No billing history yet.</p>
              )}
            </div>
          </div>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.planbox+' '+scss.blue}>
              <h2>
                Billing Addresses
              </h2>
              <p className={scss.billingAddressNote}>
                Used on your payment receipts. The default address is also sent to PayMongo at checkout.
              </p>

              {billingAddresses && billingAddresses.length > 0 ? (
                <ul className={scss.addressList}>
                  {billingAddresses.map((address) => (
                    <li key={address.id} className={scss.addressCard}>
                      <div className={scss.addressCardActions}>
                        {address.is_default ? (
                          <span className={scss.defaultBadge}>Default</span>
                        ) : (
                          <button
                            type='button'
                            title='Set as Default'
                            onClick={() => setDefaultBillingAddress.mutate(address.id)}
                            className={scss.iconBtn}
                          >
                            <Image src='/svgs/check.svg' alt='Set as Default' width={16} height={16} unoptimized={true} />
                          </button>
                        )}
                        <button
                          type='button'
                          title='Edit'
                          onClick={() => startEditAddress(address)}
                          className={scss.iconBtn}
                        >
                          <Image src='/svgs/edit.svg' alt='Edit' width={16} height={16} unoptimized={true} />
                        </button>
                        <button
                          type='button'
                          title='Delete'
                          onClick={() => handleDeleteAddress(address.id)}
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

              <button
                type='button'
                onClick={startAddAddress}
                className={scss.button+' '+scss.btnblue}
              >
                Add New Address
              </button>
            </div>
          </div>
          {!isFree && (
            <div className={scss.card+' '+scss.w100}>
              <div className={scss.planbox+' '+scss.red}>
                <h2>
                  Cancel Subscription
                </h2>
                <button
                  type='button'
                  onClick={handleCancel}
                  disabled={cancelSubscription.isPending}
                  className={scss.button+' '+scss.btnred}
                >
                  {cancelSubscription.isPending ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          )}
        </section>
        <BillingAddressModal
          open={editingAddressId !== null}
          mode={editingAddressId === 'new' ? 'new' : 'edit'}
          form={billingForm}
          saving={isSavingBilling}
          onChange={handleBillingFieldChange}
          onSave={handleSaveBilling}
          onCancel={() => setEditingAddressId(null)}
        />
        {/* <section className={"grid md:grid-cols-3 gap-6 my-5"}>
          <div className="col-span-2 bg-white border rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-bl-lg">
              ACTIVE
            </div>

            <h2 className="text-xl font-semibold">
              {subscription.plan} Plan
            </h2>

            <p className="text-gray-500">
              {isFree
                ? 'Free plan'
                : `₱${subscription.price} / ${subscription.billing === 'monthly' ? 'month' : 'year'}`
              }
            </p>

            {!isFree && (
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Billing cycle</p>
                  <p className="font-medium capitalize">{subscription.billing}</p>
                </div>
                <div>
                  <p className="text-gray-400">Next billing</p>
                  <p className="font-medium">{subscription.nextBilling}</p>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              
              <div>
                <p className="text-gray-400">Clients</p>
                <p className="font-medium">
                  {isFree ? 'Up to 3' : isEnterprise ? 'Unlimited' : 'Unlimited'}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Rows</p>
                <p className="font-medium">
                  {isFree ? '60 total' : isEnterprise ? 'Unlimited' : '1000 / client'}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Modules</p>
                <p className="font-medium">
                  {isFree
                    ? 'Sales, Purchases'
                    : 'Sales, Purchases, Receipts, Disbursements'}
                </p>
              </div>

              <div>
                <p className="text-gray-400">File Generation</p>
                <p className="font-medium">
                  {isFree ? 'Not available' : 'DAT (SLS, SLP, QAP, SAWT)'}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Calendar</p>
                <p className="font-medium">
                  {isFree
                    ? 'Limited (10/day)'
                    : isEnterprise
                      ? 'Unlimited'
                      : 'Up to 100 events'}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Reports</p>
                <p className="font-medium">
                  {isFree ? 'Basic only' : 'Advanced reporting'}
                </p>
              </div>

            </div>

            <div className="mt-6 flex gap-3">
              <Link href='/bookkeeper/subscription/plans' className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
                Change Plan
              </Link>

              {!isFree && !isEnterprise && (
                <button className="border px-4 py-2 rounded-lg text-sm">
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">Usage</h3>

            <div className="space-y-4 text-sm">

              <div>
                <div className="flex justify-between">
                  <span>Rows Used</span>
                  <span>320 / {isFree ? 60 : isEnterprise ? '∞' : 1000}</span>
                </div>
                {!isEnterprise && (
                  <div className="h-2 bg-gray-100 rounded mt-1">
                    <div className="h-2 bg-black rounded w-[32%]" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Clients</span>
                  <span>2 / {isFree ? 3 : isEnterprise ? '∞' : 'Unlimited'}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Calendar Events</span>
                  <span>12 / {isFree ? 10 : isEnterprise ? '∞' : 100}</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 my-5">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">Payment Method</h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Visa •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/28</p>
                <p className="text-xs text-gray-400 mt-1">
                  Used for automatic billing
                </p>
              </div>

              <button className="text-sm border px-3 py-1 rounded">
                Update
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">Billing Address</h3>

            <p className="text-sm text-gray-700">
              Juan Dela Cruz <br />
              Quezon City, Philippines
            </p>

            <p className="text-xs text-gray-400 mt-2">
              This address appears on your invoices
            </p>

            <button className="mt-3 text-sm border px-3 py-1 rounded">
              Edit
            </button>
          </div>
        </section>

        {!isFree && (
          <section className="bg-white border rounded-xl p-6 shadow-sm my-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Billing History</h3>
              <button className="text-sm border px-3 py-1 rounded">
                Download All
              </button>
            </div>

            <table className="w-full text-sm">
              <thead className="text-gray-400 text-left">
                <tr>
                  <th className="pb-2">Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="py-3">Apr 2026</td>
                  <td className="text-green-600">Paid</td>
                  <td>₱{subscription.price}</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {!isFree && !isEnterprise && (
          <section className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-red-600 font-medium mb-2">Cancel Subscription</h3>
            <p className="text-sm text-red-500 mb-4">
              Canceling will remove access to premium features immediately.
            </p>

            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
              Cancel Subscription
            </button>
          </section>
        )} */}
      </main>
    </div>
  )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (!session?.user) {
    signOut({ redirect: true, callbackUrl: '/' })
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}
export default ManageSubscription_V;