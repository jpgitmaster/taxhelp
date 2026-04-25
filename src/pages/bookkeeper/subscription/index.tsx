
import Link from 'next/link'
import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const ManageSubscription_V = ({ session }: PageProps) => {
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

          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
            Upgrade Plan
          </button>
        </div>

        {/* Plan Card */}
        <section className="grid md:grid-cols-3 gap-6 my-5">
          
          {/* Active Plan */}
          <div className="col-span-2 bg-white border rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-bl-lg">
              ACTIVE
            </div>

            <h2 className="text-xl font-semibold">TaxHelp Pro Plan</h2>
            <p className="text-gray-500">₱499 / month</p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Billing cycle</p>
                <p className="font-medium">Monthly</p>
              </div>
              <div>
                <p className="text-gray-400">Next billing</p>
                <p className="font-medium">May 15, 2026</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link href='/bookkeeper/subscription/plans' className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
                Change Plan
              </Link>
              <button className="border px-4 py-2 rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </div>
          {/* Usage */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">Usage</h3>

            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between">
                  <span>Projects</span>
                  <span>7 / 10</span>
                </div>
                <div className="h-2 bg-gray-100 rounded mt-1">
                  <div className="h-2 bg-black rounded w-[70%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Storage</span>
                  <span>12GB / 20GB</span>
                </div>
                <div className="h-2 bg-gray-100 rounded mt-1">
                  <div className="h-2 bg-black rounded w-[60%]" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Payment + Billing */}
        <section className="grid md:grid-cols-2 gap-6 my-5">
          
          {/* Payment Method */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium mb-4">Payment Method</h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Visa •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/28</p>
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

            <button className="mt-3 text-sm border px-3 py-1 rounded">
              Edit
            </button>
          </div>
        </section>

        {/* Invoice Table */}
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
                <th></th>
              </tr>
            </thead>

            <tbody className="space-y-2">
              <tr className="border-t">
                <td className="py-3">Apr 2026</td>
                <td className="text-green-600">Paid</td>
                <td>₱499</td>
                <td className="text-right">
                  <button className="text-sm underline">Download</button>
                </td>
              </tr>

              <tr className="border-t">
                <td className="py-3">Mar 2026</td>
                <td className="text-green-600">Paid</td>
                <td>₱499</td>
                <td className="text-right">
                  <button className="text-sm underline">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-600 font-medium mb-2">Danger Zone</h3>
          <p className="text-sm text-red-500 mb-4">
            Canceling will remove access to premium features immediately.
          </p>

          <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
            Cancel Subscription
          </button>
        </section>

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