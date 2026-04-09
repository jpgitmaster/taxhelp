import { useEffect } from "react";
import { useRouter } from "next/router";
import useUserAPI from "@/controllers/users/api";
const EmailVerification = () => {
    const router = useRouter();
    const { token } = router.query;

    const { verifyUserMutation } = useUserAPI();

    useEffect(() => {
      if (typeof token !== 'string') return;

      router.prefetch('/bookkeeper/profile');

      verifyUserMutation.mutate(token); // ✅ NO onSuccess here
    }, [token]);
    return (
        <div>
            
        </div>
    )
}
export default EmailVerification;