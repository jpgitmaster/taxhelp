import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { signOut, getSession } from 'next-auth/react'
import scss from './../styles/Subscription.module.scss'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const SubscriptionPlans_V = () => {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
    const [showModal, setShowModal] = useState(false)

    const plans = [
        {
            name: 'Basic FREE',
            price: 0,
            key: 'basic',
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
            key: 'pro',
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
            key: 'enterprise',
            price: billing === 'monthly' ? 129 : 1299,
            description: 'Advanced tools for large operations',
            highlight: false,
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
                        'Standard invoice PDF'
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
            note: 'Ideal for large-scale operations with advanced accounting needs.',
        },
    ]

    return (
        <div>
            <div className={scss.box}>
                {/* Header */}
                <div className={scss.boxTitle}>
                    <h2>
                        Choose Your Plan
                    </h2>
                    <p>
                        Flexible pricing for businesses of all sizes. Upgrade anytime.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className={scss.billingToggle}>
                    <div className={scss.toggle}>
                        <button
                            onClick={() => setBilling('monthly')}
                            className={scss.btn + (billing === 'monthly'
                                    ? ' '+scss.active
                                    : '')}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBilling('yearly')}
                            className={scss.btn + (billing === 'yearly'
                                    ? ' '+scss.active
                                    : '')}
                        >
                            Yearly (Save more)
                        </button>
                    </div>
                </div>
                <p className={scss.note} style={{marginTop: '20px'}}>
                    All prices in PHP. Taxes may apply.
                </p>
                {/* Plans */}
                <div className={scss.plans}>
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={scss.plan + (plan.highlight
                                    ? ' '+scss.active
                                    : '')}
                        >
                            {plan.highlight && (
                                <span className={scss.popular}>
                                    Most Popular
                                </span>
                            )}

                            <div className={scss.planTopDetails}>
                                <h3>{plan.name}</h3>
                                <p>{plan.description}</p>

                                <div className={scss.price}>
                                    ₱{plan.price}
                                    {plan.price !== 0 && (
                                        <span>
                                            / {billing === 'monthly' ? 'month' : 'year'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <ul className={scss.features}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>
                                        <div className={scss.feature + (
                                                    feature.title !== 'Limitations'
                                                        ? ' '+scss.checked
                                                        : ''
                                                )}>
                                            <div
                                                className={scss.featureCheck}
                                            >
                                                {feature.title === 'Limitations' ? '—' :
                                                    <Image src='/svgs/checker.svg' alt='Checked' priority width={20} height={20} unoptimized={true} />
                                                }
                                            </div>
                                            <span>{feature.title}</span>
                                        </div>

                                        {feature.children && (
                                            <ul className={scss.children}>
                                                {feature.children.map((child, cidx) => (
                                                    <li key={cidx}>
                                                        — {child}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {plan.note && (
                                <p className={scss.note}>
                                    {plan.note}
                                </p>
                            )}
                            {/* CTA */}
                            <Link
                                href={`/bookkeeper/subscription/plans/gcash_payment?plan=${plan.key}&price=${plan.price}&billing=${billing}`}
                                className={scss.button + (
                                    plan.highlight
                                        ? ' '+scss.btnorange
                                        : ' '+scss.btnblue
                                ) + ' mt-4'}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* 🔥 NEW: Custom Solutions Section */}
                <div className={scss.customSolutions}>
                    <div className={scss.customSolution}>

                        <h3>
                            Need Something Beyond Enterprise?
                        </h3>

                        <p>
                            If your business requires specific workflows, custom reports, or system integrations,
                            we offer tailored solutions designed exactly for your operations.
                        </p>

                        <div className={scss.customFeatures}>
                            <ul className="space-y-2">
                                <li>Tailored workflows based on your operations</li>
                                <li>Scalable architecture</li>
                                <li>API / system integrations</li>
                            </ul>
                            <ul className="space-y-2">
                                <li>Priority feature development</li>
                                <li>Dedicated onboarding & support</li>
                                <li>Custom reports & document formats</li>
                                <li>Custom invoice & receipt printing (logo, layout, VAT/BIR-ready formats)</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className={scss.button+' '+scss.btnblue}
                        >
                            Let&rsquo;s Talk Business
                        </button>

                        <p className={scss.note}>
                            We&rsquo;ll discuss your requirements and build a solution that fits your business.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">
                            Let&rsquo;s Build Something for Your Business
                        </h3>

                        <input type="text" placeholder="Business Name" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        <input type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        <textarea 
                            placeholder="What features or customizations do you need? (e.g., custom invoice printing, reports, integrations)" 
                            className="w-full border rounded-lg px-3 py-2 text-sm" 
                        />

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

export default SubscriptionPlans_V