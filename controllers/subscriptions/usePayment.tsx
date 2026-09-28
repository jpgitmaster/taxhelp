import { SyntheticEvent} from 'react';
import { useRouter } from "next/router";
import useGlobal from '@/controllers/global/useGlobal';
import useMutationSubscriptions from "./api/mutations";
const usePayment = () => {
    const {
        handleBlur,
        handleResubmit,
    } = useGlobal()
    const {
        status,
        setStatus,
        downgradeSubscription,
        checkoutSubscription
    } = useMutationSubscriptions()
    const router = useRouter()
    const { plan, price, billing } = router.query

    const handlePayment = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})

        if (plan === 'basic') {
            downgradeSubscription.mutate(String(plan), {
                onSuccess: () => {
                    setStatus(prev => ({
                        ...prev,
                        loader: false,
                        message: 'Your Basic plan is now active.',
                    }))
                    setTimeout(() => {
                        setStatus(prev => ({
                            ...prev,
                            message: '',
                            submessage: ''
                        }))
                    }, 5000)
                },
                onError: () => {
                    setStatus(prev => ({
                        ...prev,
                        loader: false,
                    }))
                },
            })
            return
        }

        checkoutSubscription.mutate(
            {
                plan: String(plan),
                billing_cycle: String(billing),
            },
            {
                onSuccess: (data) => {
                    window.location.href = data.checkout_url
                },
                onError: () => {
                    setStatus(prev => ({
                        ...prev,
                        loader: false,
                    }))
                },
            }
        )
    }

    return {
        // STATES
        plan,
        price,
        status,
        billing,
        // SET STATES
        
        // HANDLES
        handleBlur,
        handlePayment,
        handleResubmit
        
    }
}

export default usePayment;