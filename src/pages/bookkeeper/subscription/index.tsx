
import Link from 'next/link'
import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const ManageSubscription_V = ({ session }: PageProps) => {

  // TODO: Replace with real DB data
  const subscription = {
    plan: 'Pro', // 'Basic FREE' | 'Pro' | 'Enterprise'
    billing: 'monthly',
    price: 79,
    nextBilling: 'May 15, 2026',
  }

  const isFree = subscription.plan === 'Basic FREE'
  const isEnterprise = subscription.plan === 'Enterprise'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-6">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Subscription</h1>
            <p className="text-gray-500 text-sm">
              Manage your plan, billing, and usage
            </p>
          </div>

          <Link href='/bookkeeper/subscription/plans' className="bg-black text-white px-4 py-2 rounded-lg text-sm">
            {isFree ? 'Upgrade Plan' : 'Change Plan'}
          </Link>
        </div>

        {/* Plan Card */}
        <section className="grid md:grid-cols-3 gap-6 my-5">
          
          {/* Active Plan */}
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

            {/* Billing Info */}
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

            {/* 🔥 Plan Features (more detailed) */}
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

            {/* Actions */}
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

          {/* Usage */}
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

        {/* Payment + Billing (UNCHANGED, just slightly richer) */}
        <section className="grid md:grid-cols-2 gap-6 my-5">
          
          {/* Payment Method */}
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

          {/* Billing Address */}
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

        {/* Billing History */}
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

        {/* Danger Zone */}
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
        )}

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