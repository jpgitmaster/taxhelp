import Image from 'next/image'
import scss from './styles/Receipts.module.scss'
import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Receipts_V = () => {
  return (
    <div>
      <br /><br />
      <div className={scss.customFile}>
          <div className={scss.customFileUpload}>
              <label className={scss.customFile}>
                  <input
                      name="file"
                      type="file"
                      accept=".xlsx, .xls"
                      // onChange={handleFileChange}
                  />
                  <div className={scss.empty_image}>
                      <Image
                          src="/svgs/reports.svg"
                          alt="Empty Image"
                          width={26}
                          height={26}
                          unoptimized
                      />
                  </div>
                  <>
                      <p>Browse or upload your receipt template here</p>
                      <span>
                          Supported formats: .pdf, .jpeg<br />
                          Maximum file size: 5 MB
                      </span>
                  </>
              </label>
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