import Image from 'next/image';
import { useEffect } from "react";
import { useRouter } from "next/router";
import scss from './styles/Email.module.scss';
import useUserAPI from "@/controllers/users/api";
import Loader from '@/components/reusables/RotatingLoader'
const EmailVerification = () => {
    const router = useRouter();
    const { token } = router.query;

    const { verifyUserMutation } = useUserAPI();

    useEffect(() => {
      if (typeof token !== 'string') return;

      router.prefetch('/bookkeeper/profile/edit');

      verifyUserMutation.mutate(token); // ✅ NO onSuccess here
    }, [token]);
    return (
        <div className={scss.container}>
          <div className={scss.card}>
            <Image src='/images/logo.png' alt='TaxHelp Logo' priority width={20} height={20} unoptimized={true} style={{width: '100%'}} />
            
            <div className={scss.iconWrapper}>
              <Loader scss={scss} position="absolute" />
            </div>

            <h2 className={scss.title}>Verifying your email</h2>

            <p className={scss.subtitle}>
              Please wait while we securely confirm your account.
            </p>

            <div className={scss.progress}>
              <div className={scss.bar} />
            </div>

            <p className={scss.footerText}>
              This usually takes a few seconds...
            </p>

          </div>
        </div>
    )
}
export default EmailVerification;