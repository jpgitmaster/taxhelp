import { signOut, getSession } from 'next-auth/react'
import scss from './../styles/Subscription.module.scss'
import Loader from '@/components/reusables/RotatingLoader'
import usePayment from '@/controllers/subscriptions/usePayment'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const GCashPaymentPage = () => {
  const {
    plan,
    price,
    status,
    billing,
    handlePayment,
    handleResubmit
  } = usePayment()
  const { loader, message } = status
  return (
    <form onSubmit={handlePayment} className={scss.paymentForm}>
      { loader && <Loader scss={scss} position='absolute' />}
      {
        message &&
        <SuccessMessage message={message} />
      }
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
          {
            plan === 'basic' &&
            <>
              <br />
              <button
                  type='submit'
                  onKeyDown={handleResubmit}
                  className={scss.button+' '+scss.btnblue}
                >
                {loader ? 'Loading...' : 'Activate Basic Plan'}
              </button>
            </>
          }
        </div>
        {
          plan !== 'basic' &&
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
              type='submit'
              onKeyDown={handleResubmit}
              className={scss.button+' '+scss.btnblue}
            >
              {loader ? 'Redirecting to GCash...' : 'Pay with GCash'}
            </button>

            {/* Footer */}
            <p className={scss.note}>
              Secure payment powered by your payment provider
            </p>
          </div>
        }
        <br /><br />
      </div>
    </form>
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