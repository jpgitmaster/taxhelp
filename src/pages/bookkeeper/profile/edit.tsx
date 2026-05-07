import dayjs from 'dayjs';
import Link from 'next/link'
import Image from 'next/image'
import { Modal, DatePicker } from 'antd';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import scss from './styles/Profile.module.scss';
import useProfile from '@/controllers/users/useProfile';
import Loader from '@/components/reusables/RotatingLoader';
import Avatar from '@/components/reusables/AvatarPlaceholder';
import CustomContainer from '@/components/reusables/CustomContainer';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';

const EdtProfile_V = () => {
    const {
        user,
        status,
        handleDate,
        handleBlur,
        handleChange,
        handleEditProfile
    } = useProfile()
    const { loader } = status
    const profile = user.userObj
    const dateFormat = 'MM/DD/YYYY'
    const [openPlanModal, setOpenPlanModal] = useState(false);
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
    
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
    useEffect(() => {
        const shouldShow = localStorage.getItem('showPlanModal');

        if (shouldShow === 'true') {
            setOpenPlanModal(true);
        }
    }, []);
    return (
        <div className={scss.profileWrapper}>
            <Link href={`/bookkeeper/profile`} className={scss.editLink}>
                <Image src='/svgs/eyecon_check.svg' alt='View Details' priority width={20} height={20} unoptimized={true} />
                View Details
            </Link>
            <form onSubmit={handleEditProfile} className={scss.form}>
                <div className={scss.editProfile+' '+scss.box}>
                    <div className={scss.boxTitle}>
                        Profile Details
                    </div>
                    <div className={scss.profile}>
                        { loader && <Loader scss={scss} position='absolute' />}
                        <div className={scss.avatar}>
                            <Avatar color={''} />
                        </div>
                        <div className={scss.avatarDetails}>
                            <div className={scss.cards}>
                                <CustomContainer
                                    width={33}
                                    scss={scss}
                                    required={true}
                                    label='First Name'
                                    labelFor='firstName'
                                    err={user.userErr.firstName as string}
                                >
                                    <input
                                        type='text'
                                        maxLength={50}
                                        id='firstName'
                                        name='firstName'
                                        autoComplete='off'
                                        value={user.userObj.firstName}
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                    />
                                </CustomContainer>
                                <CustomContainer
                                    width={33}
                                    scss={scss}
                                    label='Middle Name'
                                    labelFor='middleName'
                                    err={user.userErr.middleName as string}
                                >
                                    <input
                                        type='text'
                                        id='middleName'
                                        name='middleName'
                                        maxLength={50}
                                        autoComplete='off'
                                        value={user.userObj.middleName}
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                    />
                                </CustomContainer>
                                <CustomContainer
                                    width={33}
                                    scss={scss}
                                    required={true}
                                    label='Last Name'
                                    labelFor='lastName'
                                    err={user.userErr.lastName as string}
                                >
                                    <input
                                        type='text'
                                        id='lastName'
                                        name='lastName'
                                        maxLength={50}
                                        autoComplete='off'
                                        value={user.userObj.lastName}
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                    />
                                </CustomContainer>
                                <CustomContainer
                                    width={50}
                                    scss={scss}
                                    required={true}
                                    label='Email'
                                    labelFor='email'
                                >
                                    <input
                                        readOnly
                                        id='email'
                                        name='email'
                                        type='text'
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                        value={user.userObj.email}
                                        className={scss.lblContent}
                                    />
                                </CustomContainer>
                                <CustomContainer
                                    width={50}
                                    scss={scss}
                                    label='Birthdate'
                                    labelFor='birthdate'
                                    err={user.userErr.birthdate as string}
                                >
                                    <DatePicker
                                        id='birthdate'
                                        name='birthdate'
                                        format={dateFormat}
                                        style={{ border: user.userErr.birthdate ? '1px solid #DC2626' : '1px solid rgba(125, 122, 122, 0.6)' }}
                                        onChange={(date) => handleDate(date, 'birthdate')}
                                        value={
                                            profile.birthdate
                                            ? dayjs(profile.birthdate, dateFormat)
                                            : null
                                        }
                                    />
                                </CustomContainer>
                            </div>
                        </div>
                    </div>
                </div>
                <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '30px auto'}}>
                    Save Profile
                </button>
            </form>
            <Modal
                width={'70%'}
                footer={null}
                open={openPlanModal}
                onCancel={() => {
                    setOpenPlanModal(false);

                    // remove forever after closing
                    localStorage.removeItem('showPlanModal');
                }}
                style={{ top: 50 }}
            >
                <div className={scss.planBox}>
                    <div className={scss.banner}>
                        <Image
                            src='https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1600&auto=format&fit=crop'
                            alt='Subscription Plans'
                            fill
                            priority
                            className={scss.bannerImage}
                        />

                        <div className={scss.bannerOverlay}>
                            <h1>Scale Your Business With Confidence</h1>
                            <p>
                                Choose the perfect accounting and compliance solution for your business.
                            </p>
                        </div>
                    </div>
                    {/* Header */}
                    <div className={scss.boxTitle}>
                        <h2>
                            Choose Your Plan
                        </h2>
                        <p>
                            Flexible pricing for businesses of all sizes. Upgrade anytime.
                        </p>
                    </div>
                    <div className={scss.planWrapper}>
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
                                    type='button'
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
                </div>
            </Modal>
        </div>
    )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (!session?.user?.id || !session.user.email) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return {
    props: { session }
  }
}
export default EdtProfile_V;