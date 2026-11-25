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
import PlanSummaryCard from '@/components/pages/bookkeeper/subscription/PlanSummaryCard'
import BillingHistoryCard from '@/components/pages/bookkeeper/subscription/BillingHistoryCard'
import BillingAddressesCard from '@/components/pages/bookkeeper/subscription/BillingAddressesCard'
import CancelSubscriptionCard from '@/components/pages/bookkeeper/subscription/CancelSubscriptionCard'

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

const ManageSubscription_V = () => {
  const { getMySubscription, getMyPayments } = useQuerySubscriptions()
  const { cancelSubscription } = useMutationSubscriptions()
  const { getMyBillingAddresses } = useQueryBillingAddresses()
  const { createBillingAddress, updateBillingAddress, setDefaultBillingAddress, deleteBillingAddress } = useMutationBillingAddresses()
  const { data: subscription } = getMySubscription()
  const { data: payments } = getMyPayments()
  const { data: billingAddresses } = getMyBillingAddresses()

  const isFree = subscription?.plan === 'basic'
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
      <main className={scss.box}>
        <div className={scss.boxTitle}>
          <h2>
            Subscription
          </h2>
          <p>
            Manage your plan, billing, and usage.
          </p>
        </div>
        <section className={scss.cards+' '+scss.plantop}>
          <PlanSummaryCard
            subscription={subscription}
            latestPayment={latestPayment}
            isFree={isFree}
            scss={scss}
          />
          <BillingHistoryCard
            payments={payments}
            scss={scss}
          />
          <BillingAddressesCard
            addresses={billingAddresses}
            scss={scss}
            onSetDefault={(id) => setDefaultBillingAddress.mutate(id)}
            onEdit={startEditAddress}
            onDelete={handleDeleteAddress}
            onAddNew={startAddAddress}
          />
          {!isFree && (
            <CancelSubscriptionCard
              plan={subscription?.plan}
              expiresAt={subscription?.expires_at}
              pending={cancelSubscription.isPending}
              scss={scss}
              onCancel={handleCancel}
            />
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
