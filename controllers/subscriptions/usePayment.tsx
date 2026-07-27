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
        paymentSubscription,
        checkoutSubscription
    } = useMutationSubscriptions()
    const router = useRouter()
    const { plan, price, billing } = router.query

    const handlePayment = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        checkoutSubscription.mutate(
            {
                plan: String(plan),
                billing_cycle: String(billing),
            },
            {
                onSuccess: (data) => {
                    paymentSubscription.mutate(String(plan), {
                        onSuccess: () => {
                            // setStatus(prev => ({
                            //     ...prev,
                            //     loader: false,
                            //     message: (
                            //         <>
                            //             Payment successful! Your TaxHelp{' '}
                            //             <span style={{textTransform: 'capitalize'}}>{plan?.toString().toLowerCase()}</span>{' '}<br />
                            //             subscription has been activated.
                            //         </>
                            //     )
                            // }))
                            setTimeout(() => {
                                setStatus(prev => ({
                                    ...prev,
                                    message: '',
                                    submessage: ''
                                }))
                            }, 5000)
                        }
                    })
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