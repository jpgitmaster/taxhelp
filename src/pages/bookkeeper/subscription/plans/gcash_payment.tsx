import { useState } from 'react'
import { useRouter } from 'next/router'
import { signOut, getSession } from 'next-auth/react'
import scss from './../styles/Subscription.module.scss'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const GCashPaymentPage = () => {
  const router = useRouter()
  const { plan, price, billing } = router.query
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)

    const res = await fetch('/api/gcash/create-payment', {
      method: 'POST',
    })

    const { checkoutUrl } = await res.json()

    // Redirect to GCash
    window.location.href = checkoutUrl
  }

  return (
    <div className={scss.box}>
      <div className={scss.boxTitle}>
          <h2>
            Complete Your Payment
          </h2>
          <p>
            You will be redirected to GCash to complete your subscription.
          </p>
      </div>
      <div className={scss.selectedPlan}>
        <h3>Payment Summary</h3>

        <div className={scss.details}>
          <span>{plan} Plan</span>
          <span>₱{price} / {billing}</span>
        </div>

        <div className={scss.details}>
          <span>Billing Cycle</span>
          <span>{billing}</span>
        </div>

        <div className={scss.total}>
          <span>Total</span>
          <span>₱{price}</span>
        </div>
      </div>
      <div className={scss.selectedPlan}>
        {/* GCash Info */}
        <h3>Pay with GCash</h3>

          <ol>
            <li>Click "Pay with GCash"</li>
            <li>You will be redirected to GCash</li>
            <li>Log in and authorize the payment</li>
            <li>Return here after completion</li>
          </ol>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs p-3 rounded mt-5">
            Please do not close this page while processing your payment.
          </div>
          <br />
          <button
            onClick={handlePay}
            disabled={loading}
            className={scss.button+' '+scss.btnblue}
          >
            {loading ? 'Redirecting to GCash...' : 'Pay with GCash'}
          </button>

          {/* Footer */}
          <p className={scss.note}>
            Secure payment powered by your payment provider
          </p>
        </div>
        <br /><br />
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
export default GCashPaymentPage