
import { useEffect } from "react";
import { useRouter } from "next/router";
import useUserAPI from "@/controllers/users/api";

const EmailValidation = () => {
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
    return (
        <div>
            
        </div>
    )
}
export default EmailValidation;