import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import scss from './styles/EmailVerification.module.scss';
import LandingModal from '@/components/pages/landing/landing_modal';
import useMutationUsers from '@/controllers/users/api/mutations';

interface PropsDefinition {
    open: boolean
    token?: string
    onClose: () => void
}

const LandingEmailVerificationModal = ({ open, token, onClose }: PropsDefinition) => {
    const router = useRouter();
    const verifiedRef = useRef(false);
    const [error, setError] = useState<string | null>(null);
    const { verifyUserMutation } = useMutationUsers()

    useEffect(() => {
        if (!open) {
            verifiedRef.current = false;
            setError(null);
            return;
        }
        if (!token || verifiedRef.current) return;
        verifiedRef.current = true;

        router.prefetch('/bookkeeper/profile/edit');

        verifyUserMutation.mutate(token, {
            onSuccess: async (res) => {
                const { id, email, token_type, access_token, expires_in, refresh_token } = res.user;

                try {
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
                        setError('We verified your email, but couldn’t sign you in automatically. Please log in manually.');
                        return;
                    }

                    await getSession();

                    localStorage.setItem('showPlanModal', 'true');

                    router.push('/bookkeeper/profile/edit');
                } catch {
                    setError('Something went wrong while signing you in. Please log in manually.');
                }
            },
            onError: (err) => {
                const backendMessage = err?.response?.data?.message
                setError(backendMessage || 'This verification link is invalid or has expired. Please request a new one.');
            },
        });
    }, [open, token]);

    return (
        <LandingModal
            open={open}
            width={420}
            closable={!!error}
            onCancel={error ? onClose : () => {}}
        >
            <div className={scss.verifyModal}>
                <Image src='/images/logo.png' alt='TaxHelp Logo' width={20} height={20} unoptimized={true} className={scss.logo} />

                {
                    error ?
                    <>
                        <h2 className={scss.title}>Verification failed</h2>
                        <p className={scss.subtitle}>
                            {error}
                        </p>
                    </>
                    :
                    <>
                        <h2 className={scss.title}>Verifying your email</h2>

                        <div className={scss.logoLoader}>
                            <span className={scss.logoLoaderRing} />
                            <Image src='/images/favicon.png' alt='' width={40} height={40} unoptimized={true} className={scss.logoLoaderMark} />
                        </div>

                        <p className={scss.subtitle}>
                            Please wait while we securely confirm your account.
                        </p>

                        <div className={scss.progress}>
                            <div className={scss.bar} />
                        </div>

                        <p className={scss.footerText}>
                            This usually takes a few seconds...
                        </p>
                    </>
                }
            </div>
        </LandingModal>
    )
}

export default LandingEmailVerificationModal;
