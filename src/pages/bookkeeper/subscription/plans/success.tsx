import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, getSession } from 'next-auth/react'
import scss from './../styles/Subscription.module.scss'
import Loader from '@/components/reusables/RotatingLoader'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import useQuerySubscriptions from '@/controllers/subscriptions/api/queries'

const SubscriptionSuccessPage = () => {
  const router = useRouter()
  const { plan } = router.query
  const { getMySubscription } = useQuerySubscriptions()
  const { data: subscription } = getMySubscription(2000)

  const isActivated = subscription?.plan === plan && !subscription?.pending_plan

  return (
    <div className={scss.box}>
      <div className={scss.boxTitle}>
        <h2>
          {isActivated ? 'Payment Successful' : 'Confirming Your Payment'}
        </h2>
        <p>
          {isActivated
            ? `Your ${subscription?.plan} plan is now active.`
            : 'We are confirming your GCash payment with the plan provider. This usually takes a few seconds.'
          }
        </p>
      </div>

      {!isActivated && <Loader scss={scss} position='absolute' />}

      <Link href='/bookkeeper/subscription' className={scss.button+' '+scss.btnblue}>
        Go to My Subscription
      </Link>
    </div>
  )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (!session?.user) {
    signOut({ redirect: true, callbackUrl: '/' })
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}
export default SubscriptionSuccessPage
