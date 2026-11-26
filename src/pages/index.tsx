import Head from 'next/head';
import { useRouter } from 'next/router';
import { Manrope } from 'next/font/google';
import { getSession } from 'next-auth/react';
import scss from '@/styles/Landing.module.scss';
import { useState, useEffect } from 'react';
import Hero_V from '@/components/pages/landing/hero';
import Header_V from '@/components/pages/landing/header';
import About_V from '@/components/pages/landing/about';
import Footer_V from '@/components/pages/landing/footer';
import Services_V from '@/components/pages/landing/services';
import ContactUs_V from '@/components/pages/landing/contact_us';
import SubscriptionPlans from '@/components/reusables/SubscriptionPlans';
import Testimonials_V from '@/components/pages/landing/testimonials';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import LandingLoginModal from '@/components/pages/landing/login';
import LandingSignupModal from '@/components/pages/landing/register';
import LandingForgotPasswordModal from '@/components/pages/landing/forgot_password';
import LandingChangePasswordModal from '@/components/pages/landing/change_password';
import LandingEmailVerificationModal from '@/components/pages/landing/email_verification';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

const LandingPage = () => {
  const router = useRouter();
  const [displayModal, setDisplayModal] = useState({
    login: false,
    registration: false,
    forgot_password: false,
    change_password: false
  })
  const [message, setMessage] = useState('');

  const toggleModal = (modal: boolean, form: string) => {
    if (modal) {
      setDisplayModal({
        login: false,
        registration: false,
        forgot_password: false,
        change_password: false,
        [form]: true
      })
      return
    }
    setDisplayModal(prev => ({
      ...prev,
      [form]: false
    }))
  };

  useEffect(() => {
    const successMessage = sessionStorage.getItem('successMessage');
    if (successMessage) {
        setMessage(successMessage);

        setTimeout(() => {
            setMessage('');
            sessionStorage.removeItem('successMessage');
        }, 5000)
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.token) {
      toggleModal(true, 'change_password')
      router.replace('/', undefined, { shallow: true })
    }
  }, [router.isReady, router.query.token]);

  const [verifyToken, setVerifyToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!router.isReady) return
    if (router.query.verify_token) {
      setVerifyToken(String(router.query.verify_token))
      router.replace('/', undefined, { shallow: true })
    }
  }, [router.isReady, router.query.verify_token]);

  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return

    const setHeaderHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`)
    }

    setHeaderHeight()
    const observer = new ResizeObserver(setHeaderHeight)
    observer.observe(header)

    return () => observer.disconnect()
  }, []);

  return (
    <>
      <Head>
        <title>TaxHelp Accounting Firm</title>
        <meta name="description" content="Professional accounting and tax services for small businesses and families." />
      </Head>

      <div className={scss.app+' '+manrope.className}>
        <Header_V scss={scss} message={message} toggleModal={toggleModal} />
        <div className={scss.heroPanel}>
          <Hero_V scss={scss} />
          <Services_V scss={scss} />
        </div>
        <About_V scss={scss} />
        <SubscriptionPlans
            title="Simple Plans. Powerful Business Tools."
            caption="Choose the right TaxHelp subscription for your business. Start for free and upgrade as your operations grow."
            scss={scss}
            hideCustomSolutions
        />
        <div className={scss.closingPanel}>
          <Testimonials_V scss={scss} />
          <ContactUs_V scss={scss} />
        </div>
        <Footer_V scss={scss} />
      </div>
      <LandingLoginModal
        displayModal={displayModal}
        toggleModal={toggleModal}
      />
      <LandingSignupModal
        displayModal={displayModal}
        toggleModal={toggleModal}
      />
      <LandingForgotPasswordModal
        displayModal={displayModal}
        toggleModal={toggleModal}
      />
      <LandingChangePasswordModal
        displayModal={displayModal}
        toggleModal={toggleModal}
      />
      <LandingEmailVerificationModal
        open={!!verifyToken}
        token={verifyToken}
        onClose={() => setVerifyToken(undefined)}
      />
    </>
  );
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (session?.user) {
    return {
      redirect: {
        destination: '/bookkeeper/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}

export default LandingPage;
