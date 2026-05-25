import Image from 'next/image';
import { useEffect } from "react";
import { useRouter } from "next/router";
import scss from './styles/Email.module.scss';
import { signIn, getSession } from 'next-auth/react';
import Loader from '@/components/reusables/RotatingLoader'
import useMutationUsers from '@/controllers/users/api/mutations';
const EmailVerification = () => {
    const router = useRouter();
    const { token } = router.query;
    const {
      verifyUserMutation
    } = useMutationUsers()

    useEffect(() => {
      if (typeof token !== 'string') return;
      
      router.prefetch('/bookkeeper/profile/edit');

      verifyUserMutation.mutate(token, {
        onSuccess: async (res) => {
          const { id, email, token_type, access_token, expires_in, refresh_token } = res.user;
          
          try {
              // Step 1: Sign in via NextAuth credentials provider
              const result = await signIn('credentials', {
                  id,
                  email,
                  tokenType: token_type,
                  accessToken: access_token,
                  refreshToken: refresh_token,
                  accessTokenExpires: Number(expires_in),
                  redirect: false,
              });

              if (!result?.ok) {
                  console.error('Sign-in failed', result);
                  return;
              }

              // Step 2: Wait for session to be available
              await getSession(); // ensures session is synced

              // Step 3: Redirect AFTER session is ready
              // mark first verified visit
              localStorage.setItem('showPlanModal', 'true');

              router.push('/bookkeeper/profile/edit');
          } catch (err) {
              console.error('Email verification flow error:', err);
          }
        },
      });
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