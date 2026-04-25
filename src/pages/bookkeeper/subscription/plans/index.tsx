import { useState } from 'react'
import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const SubscriptionPlans_V = () => {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
    const [showModal, setShowModal] = useState(false)

    const plans = [
        {
            name: 'Basic FREE',
            price: 0,
            description: 'Perfect for getting started',
            highlight: false,
            features: [
                {
                    title: 'Usage Limits',
                    children: [
                        '60 total rows',
                        '3 clients maximum',
                        '20 rows per client',
                    ],
                },
                {
                    title: 'Modules',
                    children: [
                        'Sales tracking',
                        'Purchases tracking',
                    ],
                },
                {
                    title: 'Calendar',
                    children: [
                        '10 schedules per day',
                        '1 event per schedule',
                        '1 category only',
                    ],
                },
                {
                    title: 'Included',
                    children: [
                        'Basic reporting view',
                        'Simple data tracking',
                    ],
                },
                {
                    title: 'Limitations',
                    children: [
                        'No file generation',
                        'No receipts & disbursements',
                        'Limited calendar functionality',
                    ],
                },
                // {
                //     title: 'Support',
                //     children: [
                //         'Community / basic support',
                //     ],
                // },
            ],
            note: 'Best for freelancers or small startups testing the system',
            cta: 'Get Started',
        },
        {
            name: 'Pro',
            price: billing === 'monthly' ? 79 : 599,
            description: 'Best for growing businesses',
            highlight: true,
            features: [
                {
                    title: 'Usage Limits',
                    children: [
                        '1000 rows per client',
                    ],
                },
                {
                    title: 'Modules',
                    children: [
                        'Sales',
                        'Purchases',
                        'Receipts',
                        'Disbursements',
                    ],
                },
                {
                    title: 'File Generation',
                    children: [
                        'DAT Files:',
                        '   SLS, SLP, QAP, SAWT',
                    ],
                },
                {
                    title: 'Calendar',
                    children: [
                        '100 events (multi-day supported)',
                        '3 categories:',
                        '   Green: Owner Schedule',
                        '   Blue: Holidays / Birthdays',
                        '   Red: Tax Deadlines',
                    ],
                },
                // {
                //     title: 'Support',
                //     children: [
                //         'Priority support',
                //     ],
                // },
            ],
            note: 'Ideal for SMEs managing multiple clients and compliance',
            cta: 'Upgrade to Pro',
        },
        {
            name: 'Enterprise',
            price: billing === 'monthly' ? 129 : 1299,
            description: 'Advanced tools for large operations',
            highlight: false,
            isEnterprise: true,
            features: [
                { title: 'Unlimited rows' },
                { title: 'Unlimited clients' },
                {
                    title: 'Full Accounting Suite',
                    children: [
                        'General Journal',
                        'General Ledger',
                        'Trial Balance',
                    ],
                },
                {
                    title: 'Books of Accounts',
                    children: [
                        'Sales Journal',
                        'Purchase Journal',
                        'Cash Disbursement',
                        'Cash Receipts',
                    ],
                },
                {
                    title: 'File Generation',
                    children: [
                        'DAT Files (SLS, SLP, QAP, SAWT)',
                    ],
                },
                {
                    title: 'Calendar',
                    children: [
                        'Unlimited events',
                        'Unlimited categories',
                    ],
                },
            ],
            cta: 'Get Started',
        },
    ]

    return (
        <section>

            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">
                    Choose Your Plan
                </h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Flexible pricing for businesses of all sizes. Upgrade anytime.
                </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mt-6">
                <div className="bg-gray-100 p-1 rounded-xl flex text-sm shadow-inner">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`px-5 py-2 rounded-lg transition ${
                            billing === 'monthly'
                                ? 'bg-white shadow font-medium'
                                : 'text-gray-500'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling('yearly')}
                        className={`px-5 py-2 rounded-lg transition ${
                            billing === 'yearly'
                                ? 'bg-white shadow font-medium'
                                : 'text-gray-500'
                        }`}
                    >
                        Yearly (Save more)
                    </button>
                </div>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mt-10">
                {plans.map((plan, i) => (
                    <div
                        key={i}
                        className={`rounded-2xl border p-6 flex flex-col justify-between transition hover:shadow-xl ${
                            plan.highlight
                                ? 'border-blue-600 shadow-lg scale-105 bg-white'
                                : 'border-gray-200 bg-white'
                        }`}
                    >
                        {plan.highlight && (
                            <span className="text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-full w-fit mb-3">
                                Most Popular
                            </span>
                        )}

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{plan.name}</h3>
                            <p className="text-sm text-gray-500">{plan.description}</p>

                            <div className="text-3xl font-bold mt-3">
                                ₱{plan.price}
                                {plan.price !== 0 && (
                                    <span className="text-sm text-gray-500">
                                        / {billing === 'monthly' ? 'month' : 'year'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="mt-6 space-y-3 text-sm text-gray-600">
                            {plan.features.map((feature, idx) => (
                                <li key={idx}>
                                    <div className="flex items-start gap-2 font-medium">
                                        <div
                                            className={`flex items-start gap-2 font-medium ${
                                                feature.title === 'Limitations'
                                                    ? 'text-gray-400'
                                                    : ''
                                            }`}
                                        >
                                            {feature.title === 'Limitations' ? '—' : '✔'}
                                        </div>
                                        <span>{feature.title}</span>
                                    </div>

                                    {feature.children && (
                                        <ul className="ml-6 mt-2 space-y-1 text-gray-500">
                                            {feature.children.map((child, cidx) => (
                                                <li key={cidx} className="pl-4">
                                                    — {child}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Enterprise helper */}
                        {plan.isEnterprise && (
                            <p className="text-xs text-gray-400 mt-3 text-center">
                                Ideal for large-scale operations with advanced accounting needs.
                            </p>
                        )}
                        {plan.note && (
                            <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
                                {plan.note}
                            </p>
                        )}
                        {/* CTA */}
                        <button
                            onClick={() =>
                                plan.isEnterprise
                                    ? setShowModal(true)
                                    : console.log('Select plan:', plan.name)
                            }
                            className={`mt-6 w-full py-2 rounded-lg font-medium transition ${
                                plan.highlight
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                            }`}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
            
            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-14">
                All prices in PHP. Taxes may apply.
            </p>

            {/* 🔥 NEW: Custom Solutions Section */}
            <div className="max-w-5xl mx-auto px-4 mt-8 mb-15">
                <div className="border rounded-2xl p-8 from-blue-50 to-white shadow-sm text-center">

                    <h3 className="text-xl font-semibold mb-2">
                        Need Something Beyond Enterprise?
                    </h3>

                    <p className="text-sm text-gray-500 max-w-xl mx-auto mb-6">
                        If your business requires specific workflows, custom reports, or system integrations,
                        we offer tailored solutions designed exactly for your operations.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6 text-left max-w-3xl mx-auto">
                        <ul className="space-y-2">
                            <li>• Tailored workflows based on your operations</li>
                            <li>• Custom reports & document formats</li>
                            <li>• API / system integrations</li>
                        </ul>
                        <ul className="space-y-2">
                            <li>• Priority feature development</li>
                            <li>• Dedicated onboarding & support</li>
                            <li>• Scalable architecture</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Let’s Talk Business
                    </button>

                    <p className="text-xs text-gray-400 mt-3">
                        We’ll discuss your requirements and build a solution that fits your business.
                    </p>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">
                            Let’s Build Something for Your Business
                        </h3>

                        <input type="text" placeholder="Business Name" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        <input type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        <textarea placeholder="What features or customizations do you need?" className="w-full border rounded-lg px-3 py-2 text-sm" />

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500">
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
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

export default SubscriptionPlans_V