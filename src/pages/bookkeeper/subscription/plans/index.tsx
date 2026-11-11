import { signOut, getSession } from 'next-auth/react'
import scss from './../styles/Subscription.module.scss'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import SubscriptionPlans from '@/components/reusables/SubscriptionPlans'

const SubscriptionPlans_V = () => {
    return (
        <div>
            <SubscriptionPlans
                scss={scss}
                title='Choose the Right Plan for Your Business'
                caption='Flexible and affordable pricing designed for freelancers, bookkeepers, and growing businesses.'
            />
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

export default SubscriptionPlans_V