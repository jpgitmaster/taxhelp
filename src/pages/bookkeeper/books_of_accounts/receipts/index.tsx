import Link from 'next/link'
import Image from 'next/image'
import scss from './styles/Receipts.module.scss'
import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Receipts_V = () => {
  return (
    <div>
      <div className={scss.header}>
        <Link href='/bookkeeper/receipts/upload_new_receipt' className={scss.button+' '+scss.btnblue}>
          Upload New Receipt Template
        </Link>
      </div>
      <div className={scss.cards}>
        <div className={scss.card+' '+scss.w33}>
          <div className={scss.cardHeader}>
            <h3>Receipt Template 1</h3>
          </div>
          <div className={scss.cardBody}>
            <Image
              src="/images/receipts/receipt-template-1.png"
              alt="Receipt Template 1"
              width={26}
              height={26}
              unoptimized
            />
          </div>
        </div> 
        <div className={scss.card+' '+scss.w33}>
          <div className={scss.cardHeader}>
            <h3>Receipt Template 2</h3>
          </div>
          <div className={scss.cardBody}>
            <Image
              src="/images/receipts/receipt-template-2.jpg"
              alt="Receipt Template 2"
              width={26}
              height={26}
              unoptimized
            />
          </div>
        </div> 
        <div className={scss.card+' '+scss.w33}>
          <div className={scss.cardHeader}>
            <h3>Receipt Template 3</h3>
          </div>
          <div className={scss.cardBody}>
            <Image
              src="/images/receipts/receipt-template-3.png"
              alt="Receipt Template 3"
              width={26}
              height={26}
              unoptimized
            />
          </div>
        </div> 
        <div className={scss.card+' '+scss.w33}>
          <div className={scss.cardHeader}>
            <h3>Receipt Template 4</h3>
          </div>
          <div className={scss.cardBody}>
            
          </div>
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

export default Receipts_V