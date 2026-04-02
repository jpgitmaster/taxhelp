import useUserAPI from './api'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
const useEmailVerification = () => {
    const router = useRouter()
    
    const { token } = router.query
    const {
        verifyUserMutation
    } = useUserAPI()

    useEffect(() => {
        const verifyEmail = async () => {
            if (router.isReady && token) {
            try {
                await verifyUserMutation.mutateAsync(String(token));
            } catch (err) {
                console.error(err);
            }
            }
        };
        verifyEmail();
    }, [router.isReady, token]);
    return {
        // STATES
        router

        // SET STATES
        

        // HANDLES
        
    }
}

export default useEmailVerification;