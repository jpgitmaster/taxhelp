import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import PlanCard from './PlanCard'

const SubscriptionPlans_V = () => {
    const plans = [
        {
            name: 'Basic',
            price: 0,
            features: ['1 Project', '5GB Storage', 'Email Support'],
            current: false,
        },
        {
            name: 'Pro',
            price: 499,
            features: ['10 Projects', '20GB Storage', 'Priority Support'],
            current: true,
        },
        {
            name: 'Enterprise',
            price: 1299,
            features: ['Unlimited Projects', '100GB Storage', 'Dedicated Support'],
            current: false,
        },
    ]
    return (
        <section className="space-y-8">

            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Choose Your Plan</h2>
                <p className="text-gray-500 text-sm">
                Upgrade or downgrade anytime. Changes take effect immediately.
                </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center my-3">
                <div className="bg-gray-100 p-1 rounded-lg flex text-sm">
                <button className="px-4 py-1 rounded-md bg-white shadow">
                    Monthly
                </button>
                <button className="px-4 py-1 text-gray-500">
                    Yearly (Save 20%)
                </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-5">
                {plans.map((plan, i) => (
                <PlanCard key={i} plan={plan} />
                ))}
            </div>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-400">
                All prices in PHP. Taxes may apply.
            </p>

        </section>
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
export default SubscriptionPlans_V;