import Image from 'next/image'
import scss from './styles/Clients.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import Avatar from '@/components/reusables/AvatarPlaceholder'
import useSaveClient from '@/controllers/clients/useSaveClient'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const AddCustomer_V = () => {
  const {
    client,
    status,

    handleBlur,
    handleChange,
    handleSubmit,
    handleResubmit,
  } = useSaveClient()
  const { loader } = status
  return (
      <form onSubmit={handleSubmit} className={scss.addClient}>
        { loader && <Loader scss={scss} position='absolute' />}
        <div className={scss.cards}>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.box}>
              <div className={scss.boxTitle}>
                Representative Details
              </div>
              <div className={scss.boxDetails}>
                <div className={scss.avatar}>
                  <Avatar color={''} />
                </div>
                <div className={scss.representativeDetails}>
                  <div className={scss.cards}>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='First Name'
                      labelFor='representative_first_name'
                      err={client.clientErr.representative_first_name as string}
                    >
                      <input
                        id='representative_first_name'
                        type='text'
                        name='representative_first_name'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='Jose Protacio'
                        value={client.clientObj.representative_first_name}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      label='Middle Name'
                      labelFor='representative_middle_name'
                      err={client.clientErr.representative_middle_name as string}
                    >
                      <input
                        type='text'
                        id='representative_middle_name'
                        name='representative_middle_name'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='Realonda'
                        value={client.clientObj.representative_middle_name}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='Last Name'
                      labelFor='representative_last_name'
                      err={client.clientErr.representative_last_name as string}
                    >
                      <input
                        id='representative_last_name'
                        type='text'
                        name='representative_last_name'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='Rizal'
                        value={client.clientObj.representative_last_name}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='Email'
                      labelFor='representative_email'
                      err={client.clientErr.representative_email as string}
                    >
                      <input
                        type='text'
                        id='representative_email'
                        name='representative_email'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        placeholder='jrizal@gmail.com'
                        value={client.clientObj.representative_email}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='Phone Number'
                      labelFor='representative_phone'
                      err={client.clientErr.representative_phone as string}
                    >
                      <input
                        id='representative_phone'
                        type='text'
                        name='representative_phone'
                        maxLength={30}
                        autoComplete='off'
                        placeholder='(+63)926-123-4567'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.representative_phone}
                      />
                    </CustomContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.box}>
              <div className={scss.boxTitle}>
                Company Details
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
                      err={client.clientErr.classification as string}
                    >
                      <select
                        id='classification'
                        name='classification'
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.classification}
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
                      err={client.clientErr.tin as string}
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
                        value={client.clientObj.tin}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='RDO Code'
                      labelFor='rdo_code'
                      err={client.clientErr.rdo_code as string}
                    >
                      <input
                        id='rdo_code'
                        type='text'
                        name='rdo_code'
                        maxLength={3}
                        placeholder='A12'
                        autoComplete='off'
                        value={client.clientObj.rdo_code}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='Accounting Period'
                      labelFor='period'
                      err={client.clientErr.period as string}
                    >
                      <select
                        id='period'
                        name='period'
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.period}
                      >
                        <option value='CALENDAR'>Calendar</option>
                        <option value='FISCAL'>Fiscal</option>
                      </select>
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='Fiscal Month End'
                      labelFor='month_end'
                      err={client.clientErr.month_end as string}
                    >
                      <input
                        id='month_end'
                        type='text'
                        name='month_end'
                        maxLength={2}
                        autoComplete='off'
                        value={client.clientObj.month_end}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    {
                      client.clientObj.classification === 'NON-INDIVIDUAL' &&
                      <CustomContainer
                        scss={scss}
                        width={100}
                        label='Registered Name'
                        labelFor='registered_name'
                        err={client.clientErr.registered_name as string}
                        required={client.clientObj.classification === 'NON-INDIVIDUAL' ? true : false}
                      >
                        <input
                          id='registered_name'
                          type='text'
                          name='registered_name'
                          maxLength={100}
                          autoComplete='off'
                          value={client.clientObj.registered_name}
                          onKeyUp={handleBlur}
                          onChange={handleChange}
                        />
                      </CustomContainer>
                    }
                    {
                      client.clientObj.classification === 'INDIVIDUAL' &&
                      <>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="Taxpayer's First Name"
                          labelFor='first_name'
                          err={client.clientErr.first_name as string}
                          required={client.clientObj.classification === 'INDIVIDUAL' ? true : false}
                        >
                          <input
                            id='first_name'
                            type='text'
                            name='first_name'
                            maxLength={20}
                            autoComplete='off'
                            placeholder='Andres'
                            value={client.clientObj.first_name}
                            onKeyUp={handleBlur}
                            onChange={handleChange}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="Taxpayer's Middle Name"
                          labelFor='middle_name'
                          err={client.clientErr.middle_name as string}
                        >
                          <input
                            type='text'
                            id='middle_name'
                            name='middle_name'
                            maxLength={20}
                            autoComplete='off'
                            placeholder='de Castro'
                            value={client.clientObj.middle_name}
                            onKeyUp={handleBlur}
                            onChange={handleChange}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="Taxpayer's Last Name"
                          labelFor='last_name'
                          err={client.clientErr.last_name as string}
                          required={client.clientObj.classification === 'INDIVIDUAL' ? true : false}
                        >
                          <input
                            id='last_name'
                            type='text'
                            name='last_name'
                            maxLength={20}
                            autoComplete='off'
                            placeholder='Bonifacio'
                            value={client.clientObj.last_name}
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
                      err={client.clientErr.trade_name as string}
                      required={client.clientObj.classification === 'NON-INDIVIDUAL' ? true : false}
                    >
                      <input
                        id='trade_name'
                        type='text'
                        name='trade_name'
                        maxLength={100}
                        autoComplete='off'
                        value={client.clientObj.trade_name}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='Corporate Email'
                      labelFor='email'
                      err={client.clientErr.email as string}
                    >
                      <input
                        type='text'
                        maxLength={30}
                        autoComplete='off'
                        id='email'
                        name='email'
                        placeholder='yourname@yourcompany.com'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.email}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      label="Line of Business / Occupation:"
                      labelFor='business_nature'
                      err={client.clientErr.business_nature as string}
                    >
                      <input
                        id='business_nature'
                        type='text'
                        name='business_nature'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='e.g., Manufacturing, Real Estate, Financial Services'
                        value={client.clientObj.business_nature}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={100}
                      label='Company Description'
                      labelFor='description'
                      err={client.clientErr.description as string}
                    >
                      <textarea
                        id='description'
                        name='description'
                        maxLength={100}
                        autoComplete='off'
                        value={client.clientObj.description}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      label='Substreet'
                      labelFor='sub_street'
                      err={client.clientErr.sub_street as string}
                    >
                      <input
                        id='sub_street'
                        type='text'
                        name='sub_street'
                        maxLength={50}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.sub_street}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      label='Street'
                      labelFor='street'
                      err={client.clientErr.street as string}
                    >
                      <input
                        id='street'
                        type='text'
                        name='street'
                        maxLength={50}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.street}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={20}
                      label='Barangay'
                      labelFor='barangay'
                      err={client.clientErr.barangay as string}
                    >
                      <input
                        id='barangay'
                        type='text'
                        name='barangay'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.barangay}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      label='District / Municipality'
                      labelFor='district'
                      err={client.clientErr.district as string}
                    >
                      <input
                        id='district'
                        type='text'
                        name='district'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.district}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      label='City / Province'
                      labelFor='city'
                      err={client.clientErr.city as string}
                    >
                      <input
                        id='city'
                        type='text'
                        name='city'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.city}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={20}
                      label='Zip Code'
                      labelFor='zip_code'
                      err={client.clientErr.zip_code as string}
                    >
                      <input
                        id='zip_code'
                        type='text'
                        name='zip_code'
                        maxLength={10}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.zip_code}
                      />
                    </CustomContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '30px auto'}} onKeyDown={handleResubmit}>
          Add Client
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