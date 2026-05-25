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
        paymentSubscription
    } = useMutationSubscriptions()
    const loader = ''
    const router = useRouter()
    const { plan, price, billing } = router.query

    const handlePayment = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        paymentSubscription.mutate(String(plan), {
            onSuccess: () => {
                setStatus({...status, loader: false})
            }
        })
    }

    return {
        // STATES
        plan,
        price,
        loader,
        billing,
        // SET STATES
        
        // HANDLES
        handleBlur,
        handlePayment,
        handleResubmit
        
    }
}

export default usePayment;