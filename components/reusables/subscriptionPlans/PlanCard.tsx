import Link from 'next/link'
import Image from 'next/image'
import { Plan, PLAN_RANK } from '@/controllers/subscriptions/plansData'

interface PropsDefinition {
    plan: Plan
    price: number
    billing: 'monthly' | 'yearly'
    currentPlan?: string
    scss: { [key: string]: string }
}

const PlanCard = ({ plan, price, billing, currentPlan, scss }: PropsDefinition) => {
    const isCurrentPlan = !!currentPlan && plan.key === currentPlan

    return (
        <div className={scss.plan + (plan.highlight ? ' '+scss.active : '')}>
            {plan.highlight && (
                <span className={scss.popular}>
                    Most Popular
                </span>
            )}

            <div className={scss.planTopDetails}>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>

                <div className={scss.price}>
                    ₱{price}
                    {price !== 0 && (
                        <span>
                            / {billing === 'monthly' ? 'month' : 'year'}
                        </span>
                    )}
                </div>
            </div>

            <ul className={scss.features}>
                {plan.features.map((feature, idx) => (
                    <li key={idx}>
                        <div className={scss.feature + (
                                    feature.title !== 'Limitations'
                                        ? ' '+scss.checked
                                        : ''
                                )}>
                            <div className={scss.featureCheck}>
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

            {isCurrentPlan ? (
                <button
                    type='button'
                    disabled
                    className={scss.button + ' ' + scss.disabled + ' mt-4'}
                >
                    Current Plan
                </button>
            ) : (
                <Link
                    href={`/bookkeeper/subscription/plans/gcash_payment?plan=${plan.key}&price=${price}&billing=${billing}`}
                    className={scss.button + (
                        plan.highlight
                            ? ' '+scss.btnorange
                            : ' '+scss.btnblue
                    ) + ' mt-4'}
                >
                    {currentPlan && PLAN_RANK[plan.key] < PLAN_RANK[currentPlan] ? 'Downgrade' : plan.cta}
                </Link>
            )}
        </div>
    )
}

export default PlanCard
