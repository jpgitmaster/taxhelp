import Image from 'next/image'
import scss from './styles/Customers.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import CustomContainer from '@/components/reusables/CustomContainer'
import useSaveCustomer from '@/controllers/customers/useSaveCustomer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const AddCustomer_V = () => {
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
      <form onSubmit={handleSubmit} className={scss.addClient}>
        { loader && <Loader scss={scss} position='absolute' />}
        <div className={scss.cards}>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.box}>
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
                      label='Taxpayer Classification'
                      labelFor='classification'
                      err={customer.customerErr.classification as string}
                    >
                      <select
                        id='classification'
                        name='classification'
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={customer.customerObj.classification}
                      >
                        <option value='NON-INDIVIDUAL'>Non-Individual</option>
                        <option value='INDIVIDUAL'>Individual</option>
                      </select>
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
                        id='tin'
                        type='text'
                        name='tin'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        placeholder="000-000-000"
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
                          id='registered_name'
                          type='text'
                          name='registered_name'
                          maxLength={100}
                          autoComplete='off'
                          value={customer.customerObj.registered_name}
                          onKeyUp={handleBlur}
                          onChange={handleChange}
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
                            id='first_name'
                            type='text'
                            name='first_name'
                            maxLength={20}
                            autoComplete='off'
                            placeholder='Andres'
                            value={customer.customerObj.first_name}
                            onKeyUp={handleBlur}
                            onChange={handleChange}
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
                            type='text'
                            id='middle_name'
                            name='middle_name'
                            maxLength={20}
                            autoComplete='off'
                            placeholder='de Castro'
                            value={customer.customerObj.middle_name}
                            onKeyUp={handleBlur}
                            onChange={handleChange}
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
                            id='last_name'
                            type='text'
                            name='last_name'
                            maxLength={20}
                            autoComplete='off'
                            placeholder='Bonifacio'
                            value={customer.customerObj.last_name}
                            onKeyUp={handleBlur}
                            onChange={handleChange}
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
                        id='trade_name'
                        type='text'
                        name='trade_name'
                        maxLength={100}
                        autoComplete='off'
                        value={customer.customerObj.trade_name}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
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
                        id='phone'
                        type='text'
                        name='phone'
                        maxLength={30}
                        autoComplete='off'
                        placeholder='(+63)926-123-4567'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
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
                        type='text'
                        maxLength={50}
                        autoComplete='off'
                        id='email'
                        name='email'
                        placeholder='yourname@yourcompany.com'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={customer.customerObj.email}
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
                        type='text'
                        maxLength={50}
                        autoComplete='off'
                        id='first_address'
                        name='first_address'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
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
                        id='second_address'
                        type='text'
                        name='second_address'
                        maxLength={50}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
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
        <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '30px auto'}} onKeyDown={handleResubmit}>
          Add Customer
        </button>
      </form>
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
export default AddCustomer_V;