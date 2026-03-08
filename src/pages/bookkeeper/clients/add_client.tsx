import Image from 'next/image'
import scss from './styles/Customers.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Avatar from '@/components/reusables/AvatarPlaceholder'
import SavingCustomer_C from '@/controllers/users/SavingCustomer_C'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const AddCustomer_V = () => {
  const {
    client,

    handleBlur,
    handleChange
  } = SavingCustomer_C()
  return (
      <form>
        <div className={scss.cards}>
          <div className={scss.card+' '+scss.w50}>
            <div className={scss.box}>
              <div className={scss.boxTitle}>
                Representative Details
              </div>
              <div className={scss.boxDetails}>
                <div className={scss.avatar}>
                  <Avatar color={''} />
                </div>
                <div className={scss.avatarDetails}>
                  <div className={scss.cards}>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='First Name'
                      labelFor='firstName'
                      err={client.clientErr.firstName as string}
                    >
                      <input
                        id='firstName'
                        type='text'
                        name='firstName'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='Jose Protacio'
                        value={client.clientObj.firstName}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='Middle Name'
                      labelFor='middleName'
                      err={client.clientErr.middleName as string}
                    >
                      <input
                        id='middleName'
                        type='text'
                        name='middleName'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='Realonda'
                        value={client.clientObj.middleName}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='Last Name'
                      labelFor='lastName'
                      err={client.clientErr.lastName as string}
                    >
                      <input
                        id='lastName'
                        type='text'
                        name='lastName'
                        maxLength={20}
                        autoComplete='off'
                        placeholder='Rizal'
                        value={client.clientObj.lastName}
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
          <div className={scss.card+' '+scss.w50}>
            <div className={scss.box}>
              <div className={scss.boxTitle}>
                Company Details
              </div>
              <div className={scss.boxDetails}>
                <div className={scss.avatar}>
                  <Image src='/svgs/building.svg' alt='Company' priority width={20} height={20} unoptimized={true} />
                </div>
                <div className={scss.avatarDetails}>
                  <div className={scss.cards}>
                    <CustomContainer
                      scss={scss}
                      width={100}
                      required={true}
                      label='Company Name'
                      labelFor='companyName'
                      err={client.clientErr.companyName as string}
                    >
                      <input
                        id='companyName'
                        type='text'
                        name='companyName'
                        maxLength={100}
                        autoComplete='off'
                        value={client.clientObj.companyName}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={100}
                      required={true}
                      label='Corporate Email'
                      labelFor='corporateEmail'
                      err={client.clientErr.corporateEmail as string}
                    >
                      <input
                        id='corporateEmail'
                        type='text'
                        name='corporateEmail'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.corporateEmail}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      label='Substreet'
                      labelFor='substreet'
                      err={client.clientErr.substreet as string}
                    >
                      <input
                        id='substreet'
                        type='text'
                        name='substreet'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.substreet}
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
                      labelFor='zipcode'
                      err={client.clientErr.zipcode as string}
                    >
                      <input
                        id='zipcode'
                        type='text'
                        name='zipcode'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={client.clientObj.zipcode}
                      />
                    </CustomContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type='button' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '50px auto 0'}}>
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