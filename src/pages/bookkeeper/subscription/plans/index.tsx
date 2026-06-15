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
                    'Up to 3 clients',
                    'Maximum of 20 records per client',
                    'Maximum of 60 records total',
                    ],
                },
                {
                    title: 'Modules Included',
                    children: [
                    'Sales Tracking',
                    'Purchase Tracking',
                    ],
                },
                {
                    title: 'Calendar',
                    children: [
                    'Up to 10 schedules per week',
                    'Single-day schedules only',
                    'Up to 2 calendar categories',
                    ],
                },
                {
                    title: 'File Generation',
                    children: [
                    'Up to 20 records per client',
                    'DAT file generation included',
                    ],
                },
                {
                    title: 'Included',
                    children: [
                    'Basic reports',
                    'Simple business tracking',
                    ],
                },
                {
                    title: 'Limitations',
                    children: [
                    'No Receipts module',
                    'No Disbursements module',
                    'Limited calendar functionality',
                    ],
                },
            ],
            note: 'Perfect for freelancers, startups, and small businesses exploring the platform.',
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
                    'Up to 10 clients',
                    'Maximum of 100 records per client',
                    'Maximum of 1,000 records total',
                    ],
                },
                {
                    title: 'Modules Included',
                    children: [
                    'Sales',
                    'Purchases',
                    'Receipts',
                    'Disbursements',
                    ],
                },
                {
                    title: 'DAT File Generation',
                    children: [
                    'SLS',
                    'SLP',
                    'QAP',
                    'SAWT',
                    ],
                },
                {
                    title: 'Calendar',
                    children: [
                    'Up to 100 events',
                    'Multi-day events supported',
                    'Up to 10 categories',
                    'Predefined categories for schedules, holidays, and tax deadlines',
                    ],
                },
                {
                    title: 'Reports & Compliance',
                    children: [
                    'Enhanced reporting tools',
                    'BIR compliance support',
                    ],
                },
            ],
            note: 'Ideal for growing businesses and accounting professionals managing multiple clients.',
            cta: 'Upgrade to Pro',
        },
        {
            name: 'Enterprise',
            key: 'enterprise',
            price: billing === 'monthly' ? 129 : 1299,
            description: 'Advanced tools for large operations',
            highlight: false,
            features: [
                {
                    title: 'Usage Limits',
                    children: [
                    'Unlimited clients',
                    'Unlimited records',
                    ],
                },
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
                    'Cash Receipts Journal',
                    'Cash Disbursements Journal',
                    ],
                },
                {
                    title: 'File Generation',
                    children: [
                    'DAT Files (SLS, SLP, QAP, SAWT)',
                    'Standard Invoice PDF Generation',
                    ],
                },
                {
                    title: 'Calendar',
                    children: [
                    'Unlimited events',
                    'Unlimited categories',
                    ],
                },
                {
                    title: 'Advanced Features',
                    children: [
                    'Comprehensive accounting reports',
                    'Business-wide financial tracking',
                    'Enterprise-level scalability',
                    ],
                },
            ],
            cta: 'Get Started',
            note: 'Designed for established businesses and firms that require complete accounting and compliance management.',
        },
    ]

    return (
        <div>
            <div className={scss.box}>
                {/* Header */}
                <div className={scss.boxTitle}>
                    <h2>
                        Choose the Right Plan for Your Business
                    </h2>
                    <p>
                        Flexible and affordable pricing designed for freelancers, bookkeepers, and growing businesses.
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
                            Need a Custom Solution?
                        </h3>

                        <p>
                            If your business requires custom workflows, specialized reports, unique document formats, or third-party integrations, we can build a solution tailored to your operations.
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
                            type='button'
                            onClick={() => setShowModal(true)}
                            className={scss.button+' '+scss.btnblue}
                        >
                            Request a Consultation
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
                            <button type='button' onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500">
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