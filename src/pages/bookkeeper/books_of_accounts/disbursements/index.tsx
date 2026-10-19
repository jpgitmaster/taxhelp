import scss from './styles/Disbursements.module.scss'
import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Disbursements_V = () => {
  return (
      <div className={scss.box}>
        <div className={scss.card}>
          <h3>
            Coming soon...
          </h3>
          
          <p className={scss.caption}>
            We&rsquo;re working hard to bring you a seamless <strong>Tax<span>Help</span></strong> experience. Stay tuned!
          </p>
        </div>
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
export default Disbursements_V;