import { useState } from 'react'
import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
const GCashPaymentPage = () => {
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
    <div className="min-h-screen flex justify-center p-6">
      
      <div className="max-w-2xl w-full space-y-2">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Complete Your Payment</h1>
          <p className="text-gray-500 text-sm">
            You will be redirected to GCash to complete your subscription.
          </p>
        </div>

        {/* Plan Summary */}
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4 my-5">
          <h2 className="font-medium text-lg">Order Summary</h2>

          <div className="flex justify-between text-sm">
            <span>Pro Plan</span>
            <span>₱499 / month</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Billing Cycle</span>
            <span>Monthly</span>
          </div>

          <div className="border-t pt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>₱499</span>
          </div>
        </div>

        {/* GCash Info */}
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4 my-5">
          <h2 className="font-medium text-lg">Pay with GCash</h2>

          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>Click "Pay with GCash"</li>
            <li>You will be redirected to GCash</li>
            <li>Log in and authorize the payment</li>
            <li>Return here after completion</li>
          </ol>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs p-3 rounded mt-5">
            Please do not close this page while processing your payment.
          </div>
        </div>

        {/* Action */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Redirecting to GCash...' : 'Pay with GCash'}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          Secure payment powered by your payment provider
        </p>

      </div>
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