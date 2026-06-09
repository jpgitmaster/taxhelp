import Link from 'next/link'
import Image from 'next/image'
import scss from './../styles/Customers.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import CustomContainer from '@/components/reusables/CustomContainer'
import useSaveCustomer from '@/controllers/customers/useSaveCustomer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Customer_V = () => {
  const {
    status,
    customer,

    handleBlur,
    handleChange,
    handleSubmit,
    handleResubmit,
  } = useSaveCustomer()
  const { loader } = status
  return (
      <div className={scss.viewClient}>
        { loader && <Loader scss={scss} position='absolute' />}
        <Link href={`/bookkeeper/users/customers/${customer.customerObj.id}/edit`} className={scss.editLink}>
          <Image src='/svgs/edit.svg' alt='Edit Details' priority width={20} height={20} unoptimized={true} />
          Edit Details
        </Link>
        <div className={scss.cards}>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.box+' '+scss.view}>
              <div className={scss.boxTitle}>
                Customer Details
              </div>
              <div className={scss.boxDetails}>
                <div className={scss.avatar}>
                  <Image src='/svgs/building.svg' alt='Company' priority width={20} height={20} unoptimized={true} />
                </div>
                <div className={scss.companyDetails}>
                  <div className={scss.cards}>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      labelFor='classification'
                      label='Taxpayer Classification'
                      err={customer.customerErr.classification as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='classification'
                        name='classification'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={customer.customerObj.classification}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='TIN No.'
                      labelFor='tin'
                      err={customer.customerErr.tin as string}
                    >
                      <input
                        readOnly
                        id='tin'
                        type='text'
                        name='tin'
                        onChange={handleChange}
                        placeholder="000-000-000"
                        className={scss.lblContent}
                        value={customer.customerObj.tin}
                      />
                    </CustomContainer>
                    {
                      customer.customerObj.classification === 'NON-INDIVIDUAL' &&
                      <CustomContainer
                        scss={scss}
                        width={100}
                        label='Registered Name'
                        labelFor='registered_name'
                        err={customer.customerErr.registered_name as string}
                        required={customer.customerObj.classification === 'NON-INDIVIDUAL' ? true : false}
                      >
                        <input
                          readOnly
                          type='text'
                          id='registered_name'
                          name='registered_name'
                          onChange={handleChange}
                          className={scss.lblContent}
                          value={customer.customerObj.registered_name}
                        />
                      </CustomContainer>
                    }
                    {
                      customer.customerObj.classification === 'INDIVIDUAL' &&
                      <>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="First Name"
                          labelFor='first_name'
                          err={customer.customerErr.first_name as string}
                          required={customer.customerObj.classification === 'INDIVIDUAL' ? true : false}
                        >
                          <input
                            readOnly
                            type='text'
                            id='first_name'
                            name='first_name'
                            placeholder='Andres'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={customer.customerObj.first_name}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="Middle Name"
                          labelFor='middle_name'
                          err={customer.customerErr.middle_name as string}
                        >
                          <input
                            readOnly
                            type='text'
                            id='middle_name'
                            name='middle_name'
                            placeholder='de Castro'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={customer.customerObj.middle_name}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="Last Name"
                          labelFor='last_name'
                          err={customer.customerErr.last_name as string}
                          required={customer.customerObj.classification === 'INDIVIDUAL' ? true : false}
                        >
                          <input
                            readOnly
                            type='text'
                            id='last_name'
                            name='last_name'
                            placeholder='Bonifacio'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={customer.customerObj.last_name}
                          />
                        </CustomContainer>
                      </>
                    }
                    <CustomContainer
                      scss={scss}
                      width={100}
                      label='Trade Name'
                      labelFor='trade_name'
                      err={customer.customerErr.trade_name as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='trade_name'
                        name='trade_name'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={customer.customerObj.trade_name}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      label='Phone Number'
                      labelFor='phone'
                      err={customer.customerErr.phone as string}
                    >
                      <input
                        readOnly
                        id='phone'
                        type='text'
                        name='phone'
                        onChange={handleChange}
                        className={scss.lblContent}
                        placeholder='(+63)926-123-4567'
                        value={customer.customerObj.phone}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      label='Email'
                      labelFor='email'
                      err={customer.customerErr.email as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='email'
                        name='email'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={customer.customerObj.email}
                        placeholder='yourname@yourcompany.com'
                      />
                    </CustomContainer>
                    <CustomContainer
                      required
                      width={50}
                      scss={scss}
                      label='First Address'
                      labelFor='first_address'
                      err={customer.customerErr.first_address as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='first_address'
                        name='first_address'
                        onChange={handleChange}
                        className={scss.lblContent}
                        placeholder='Substreet, Street, Barangay'
                        value={customer.customerObj.first_address}
                      />
                    </CustomContainer>
                    <CustomContainer
                      required
                      width={50}
                      scss={scss}
                      label='Second Address'
                      labelFor='second_address'
                      err={customer.customerErr.second_address as string}
                    >
                      <input
                        type='text'
                        id='second_address'
                        name='second_address'
                        onChange={handleChange}
                        className={scss.lblContent}
                        placeholder='District / Municipality, City / Province, Zip Code'
                        value={customer.customerObj.second_address}
                      />
                    </CustomContainer>
                  </div>
                </div>
              </div>
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
export default Customer_V;