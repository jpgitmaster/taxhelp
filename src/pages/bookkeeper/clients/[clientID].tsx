import Image from 'next/image'
import scss from './styles/Clients.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import Avatar from '@/components/reusables/AvatarPlaceholder'
import useSaveClient from '@/controllers/clients/useSaveClient'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Client_V = () => {
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
                      labelFor='first_name'
                      err={client.clientErr.first_name as string}
                    >
                      <input
                        id='first_name'
                        type='text'
                        name='first_name'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='Jose Protacio'
                        value={client.clientObj.first_name}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      label='Middle Name'
                      labelFor='middle_name'
                      err={client.clientErr.middle_name as string}
                    >
                      <input
                        type='text'
                        id='middle_name'
                        name='middle_name'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='Realonda'
                        value={client.clientObj.middle_name}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='Last Name'
                      labelFor='last_name'
                      err={client.clientErr.last_name as string}
                    >
                      <input
                        id='last_name'
                        type='text'
                        name='last_name'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='Rizal'
                        value={client.clientObj.last_name}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='Email'
                      labelFor='email'
                      err={client.clientErr.email as string}
                    >
                      <input
                        id='email'
                        type='text'
                        name='email'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        placeholder='jrizal@gmail.com'
                        value={client.clientObj.email}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='Phone Number'
                      labelFor='phone'
                      err={client.clientErr.phone as string}
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
                        value={client.clientObj.phone}
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
                      width={80}
                      required={true}
                      label='Company Name'
                      labelFor='registered_name'
                      err={client.clientErr.registered_name as string}
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
                    <CustomContainer
                      scss={scss}
                      width={20}
                      required={true}
                      label='Fiscal'
                      labelFor='fiscal'
                      err={client.clientErr.fiscal as string}
                    >
                      <input
                        id='fiscal'
                        type='text'
                        name='fiscal'
                        maxLength={2}
                        autoComplete='off'
                        value={client.clientObj.fiscal}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={100}
                      label='Company Description'
                      labelFor='company_description'
                      err={client.clientErr.company_description as string}
                    >
                      <textarea
                        id='company_description'
                        name='company_description'
                        maxLength={100}
                        autoComplete='off'
                        value={client.clientObj.company_description}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={20}
                      required={true}
                      label='Branch Code'
                      labelFor='branch_code'
                      err={client.clientErr.branch_code as string}
                    >
                      <input
                        type='text'
                        maxLength={3}
                        id='branch_code'
                        placeholder='000'
                        autoComplete='off'
                        name='branch_code'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        
                        value={client.clientObj.branch_code}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
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
                        placeholder="000-000-000-000"
                        value={client.clientObj.tin}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      required={true}
                      label='Corporate Email'
                      labelFor='corporate_email'
                      err={client.clientErr.corporate_email as string}
                    >
                      <input
                        type='text'
                        maxLength={30}
                        autoComplete='off'
                        id='corporate_email'
                        name='corporate_email'
                        placeholder='yourname@yourcompany.com'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.corporate_email}
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
                      label='Substreet'
                      labelFor='sub_street'
                      err={client.clientErr.sub_street as string}
                    >
                      <input
                        id='sub_street'
                        type='text'
                        name='sub_street'
                        maxLength={30}
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
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.street}
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
                        maxLength={30}
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
          Update Client
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
export default Client_V;