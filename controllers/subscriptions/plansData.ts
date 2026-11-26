interface PlanFeature {
    title: string
    children?: string[]
}

interface Plan {
    name: string
    key: string
    description: string
    highlight: boolean
    features: PlanFeature[]
    note: string
    cta: string
    monthlyPrice: number
    yearlyPrice: number
}

const PLAN_RANK: Record<string, number> = { basic: 0, pro: 1, enterprise: 2 }

const PLANS: Plan[] = [
    {
        name: 'Basic FREE',
        key: 'basic',
        description: 'Perfect for getting started',
        highlight: false,
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
            {
                title: 'Usage Limits',
                children: [
                    'Up to 3 clients',
                    'Maximum of 20 records per transaction',
                ],
            },
            {
                title: 'Calendar',
                children: [
                    'Up to 5 schedules per week',
                    'Up to 2 calendar categories',
                    'Single-day schedules only',
                ],
            },
        ],
        note: 'Perfect for freelancers, startups, and small businesses exploring the platform.',
        cta: 'Get Started',
    },
    {
        name: 'Pro',
        key: 'pro',
        description: 'Best for growing businesses',
        highlight: true,
        monthlyPrice: 199,
        yearlyPrice: 2299,
        features: [
            {
                title: 'Usage Limits',
                children: [
                    'Up to 10 clients',
                    'Maximum of 100 records per transaction',
                ],
            },
            {
                title: 'Calendar',
                children: [
                    'Up to 10 schedules per week',
                    'Up to 5 calendar categories',
                    'Multi-day schedules supported',
                ],
            },
        ],
        note: 'Ideal for growing businesses and accounting professionals managing multiple clients.',
        cta: 'Upgrade to Pro',
    },
    {
        name: 'Enterprise',
        key: 'enterprise',
        description: 'Advanced tools for large operations',
        highlight: false,
        monthlyPrice: 299,
        yearlyPrice: 3499,
        features: [
            {
                title: 'Usage Limits',
                children: [
                    'Unlimited clients',
                    'Unlimited records',
                ],
            },
            {
                title: 'Calendar',
                children: [
                    'Unlimited schedules',
                    'Unlimited categories',
                    'Multi-day schedules supported',
                ],
            },
        ],
        note: 'Designed for established businesses and firms that require complete accounting and compliance management.',
        cta: 'Get Started',
    },
]

export type { Plan, PlanFeature }
export { PLANS, PLAN_RANK }
