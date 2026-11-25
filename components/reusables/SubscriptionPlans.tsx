import { useState } from 'react'
import { PLANS } from '@/controllers/subscriptions/plansData'
import BillingToggle from '@/components/reusables/subscriptionPlans/BillingToggle'
import PlanCard from '@/components/reusables/subscriptionPlans/PlanCard'
import CustomSolutions from '@/components/reusables/subscriptionPlans/CustomSolutions'

interface PropsDefinition {
    title: string;
    caption: string;
    scss: { [key: string]: string };
    currentPlan?: string;
}

const SubscriptionPlans = ({ title, caption, scss, currentPlan }: PropsDefinition) => {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

    return (
        <div className={scss.box+' '+scss.plansContainer}>
            {/* Header */}
            <div className={scss.boxTitle}>
                <h2>
                    {title}
                </h2>
                <p>
                    {caption}
                </p>
            </div>

            <BillingToggle billing={billing} onChange={setBilling} scss={scss} />

            <p className={scss.note} style={{marginTop: '20px'}}>
                All prices in PHP. Taxes may apply.
            </p>

            {/* Plans */}
            <div className={scss.plans}>
                {PLANS.map((plan) => (
                    <PlanCard
                        key={plan.key}
                        plan={plan}
                        price={billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        billing={billing}
                        currentPlan={currentPlan}
                        scss={scss}
                    />
                ))}
            </div>

            <CustomSolutions scss={scss} />
        </div>
    );
};

export default SubscriptionPlans;
