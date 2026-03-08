import dayjs from 'dayjs'
import Image from 'next/image'
import { DatePicker } from 'antd'
import scss from './styles/Reports.module.scss'
import { signOut, getSession } from 'next-auth/react'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
const DatFile_V = () => {
    const dateFormat = 'MMMM DD, YYYY'
    return (
        <div>
            <div className={scss.cards} style={{width: '700px', margin: '0 auto'}}>
                <CustomContainer
                    scss={scss}
                    width={33}
                    required={true}
                    label='Select Client'
                    // err={customer.customerErr.firstName as string}
                >
                    <select>
                        <option>
                            Client 1
                        </option>
                        <option>
                            Client 2
                        </option>
                        <option>
                            Client 3
                        </option>
                        <option>
                            Client 4
                        </option>
                    </select>
                </CustomContainer>
                <CustomContainer
                    scss={scss}
                    width={33}
                    required={true}
                    label='Select Reporting Type'
                    // err={customer.customerErr.firstName as string}
                >
                    <select>
                        <option>
                            Template 1
                        </option>
                        <option>
                            Template 2
                        </option>
                        <option>
                            Template 3
                        </option>
                        <option>
                            Template 4
                        </option>
                    </select>
                </CustomContainer>
                <CustomContainer
                    scss={scss}
                    width={33}
                    required={true}
                    label='Month & Year'
                    // err={customer.customerErr.firstName as string}
                >
                    <DatePicker picker="month" />
                </CustomContainer>
            </div>
            <div className={scss.customFile}>
                <div className={scss.customFileUpload}>
                    <label className={scss.customFile}>
                        <input
                            name="file"
                            type="file"
                            accept="image/heic, image/webp, image/jpeg, image/png"
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
                            <p>Browse or upload your report here</p>
                            <span>
                                Supported formats: .xls, .xlsx<br />
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
export default DatFile_V;