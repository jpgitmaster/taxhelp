import Link from 'next/link'
import Image from 'next/image'
import scss from './styles/AuditTrail.module.scss'
import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const AuditTrail_V = () => {
  return (
    <div>
      <div className={scss.heroBanner}>
        <div className={scss.left}>
            <span className={scss.badge}>
                🔍 Audit Trail
            </span>

            <h1>Track Every System Action in Real Time</h1>

            <p>
                Monitor user activity, system changes, and critical actions
                across your platform. Maintain full transparency and ensure
                accountability across your organization.
            </p>

            <div className={scss.features}>
                <span>
                    <Image
                        src="/svgs/check.svg"
                        alt="Check"
                        width={22}
                        height={22}
                        unoptimized
                        className={scss.check}
                    />
                    Complete Activity Logs
                </span>

                <span>
                    <Image
                        src="/svgs/check.svg"
                        alt="Check"
                        width={22}
                        height={22}
                        unoptimized
                        className={scss.check}
                    />
                    User & System Tracking
                </span>

                <span>
                    <Image
                        src="/svgs/check.svg"
                        alt="Check"
                        width={22}
                        height={22}
                        unoptimized
                        className={scss.check}
                    />
                    Tamper-Proof Records
                </span>
            </div>
        </div>

        <div className={scss.right}>
            <Image
                src="https://plus.unsplash.com/premium_photo-1679923813998-6603ee2466c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={430}
                height={300}
                alt="Audit Trail Monitoring"
            />
        </div>
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

export default AuditTrail_V