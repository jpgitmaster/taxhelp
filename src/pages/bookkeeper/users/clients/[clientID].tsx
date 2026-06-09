import Link from 'next/link'
import Image from 'next/image'
import scss from './styles/Clients.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import Avatar from '@/components/reusables/AvatarPlaceholder'
import useSaveClient from '@/controllers/clients/useSaveClient'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Client_V = () => {
    const {
      client,
      status,
      isLoading,

      handleChange,
    } = useSaveClient()
    const { message, loader } = status
    return (
      <div className={scss.viewClient}>
        {
          message &&
          <SuccessMessage message={message} />
        }
        { (loader || isLoading) && <Loader scss={scss} position='absolute' />}
        <Link href={`/bookkeeper/users/clients/${client.clientObj.id}/edit`} className={scss.editLink}>
          <Image src='/svgs/edit.svg' alt='Edit Details' priority width={20} height={20} unoptimized={true} />
          Edit Details
        </Link>
        <div className={scss.cards}>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.box+' '+scss.view}>
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
                        readOnly
                        type='text'
                        id='representative_first_name'
                        name='representative_first_name'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.representative_first_name}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      label='Middle Name'
                      labelFor='representative_middle_name'
                    >
                      <input
                        readOnly
                        type='text'
                        id='representative_middle_name'
                        name='representative_middle_name'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.representative_middle_name}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='Last Name'
                      labelFor='representative_last_name'
                    >
                      <input
                        readOnly
                        type='text'
                        id='representative_last_name'
                        name='representative_last_name'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.representative_last_name}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='Email'
                      labelFor='representative_email'
                    >
                      <input
                        readOnly
                        type='text'
                        id='representative_email'
                        name='representative_email'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.representative_email}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='Phone Number'
                      labelFor='representative_phone'
                    >
                      <input
                        readOnly
                        type='text'
                        id='representative_phone'
                        name='representative_phone'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.representative_phone}
                      />
                    </CustomContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.box+' '+scss.view}>
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
                    >
                      <input
                        readOnly
                        type='text'
                        id='classification'
                        name='classification'
                        onChange={handleChange}
                        className={scss.lblContent}
                        style={{textTransform: 'capitalize'}}
                        value={client.clientObj.classification?.toLowerCase() === 'INDIVIDUAL' ? 'Individual' : client.clientObj.classification?.toUpperCase() === 'NON-INDIVIDUAL' ? 'Non-Individual' : ''}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='TIN No.'
                      labelFor='tin'
                    >
                      <input
                        readOnly
                        id='tin'
                        name='tin'
                        type='text'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.tin}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='RDO Code'
                      labelFor='rdo_code'
                    >
                      <input
                        readOnly
                        type='text'
                        id='rdo_code'
                        name='rdo_code'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.rdo_code}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='Accounting Period'
                      labelFor='period'
                    >
                      <input
                        readOnly
                        type='text'
                        id='period'
                        name='period'
                        onChange={handleChange}
                        className={scss.lblContent}
                        style={{textTransform: 'capitalize'}}
                        value={client.clientObj.period?.toLowerCase()}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={33}
                      required={true}
                      label='Fiscal Month End'
                      labelFor='month_end'
                    >
                      <input
                        id='month_end'
                        type='text'
                        name='month_end'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.month_end}
                      />
                    </CustomContainer>
                    {
                      client.clientObj.classification === 'NON-INDIVIDUAL' &&
                      <CustomContainer
                        scss={scss}
                        width={100}
                        label='Registered Name'
                        labelFor='registered_name'
                        required={client.clientObj.classification === 'NON-INDIVIDUAL' ? true : false}
                      >
                        <input
                          readOnly
                          type='text'
                          id='registered_name'
                          name='registered_name'
                          onChange={handleChange}
                          className={scss.lblContent}
                          value={client.clientObj.registered_name}
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
                          required={client.clientObj.classification === 'INDIVIDUAL' ? true : false}
                        >
                          <input
                            readOnly
                            type='text'
                            id='first_name'
                            name='first_name'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={client.clientObj.first_name}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="Taxpayer's Middle Name"
                          labelFor='middle_name'
                        >
                          <input
                            readOnly
                            type='text'
                            id='middle_name'
                            name='middle_name'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={client.clientObj.middle_name}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="Taxpayer's Last Name"
                          labelFor='last_name'
                          required={client.clientObj.classification === 'INDIVIDUAL' ? true : false}
                        >
                          <input
                            readOnly
                            type='text'
                            id='last_name'
                            name='last_name'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={client.clientObj.last_name}
                          />
                        </CustomContainer>
                      </>
                    }
                    <CustomContainer
                      scss={scss}
                      width={100}
                      label='Trade Name'
                      labelFor='trade_name'
                      required={client.clientObj.classification === 'NON-INDIVIDUAL' ? true : false}
                    >
                      <input
                        readOnly
                        id='trade_name'
                        type='text'
                        name='trade_name'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.trade_name}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      labelFor='email'
                      label='Corporate Email'
                    >
                      <input
                        readOnly
                        id='email'
                        type='text'
                        name='email'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.email}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      labelFor='business_nature'
                      label="Line of Business / Occupation:"
                    >
                      <input
                        readOnly
                        type='text'
                        id='business_nature'
                        name='business_nature'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.business_nature}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={100}
                      labelFor='description'
                      label='Company Description'
                    >
                      <input
                        readOnly
                        type='text'
                        id='description'
                        name='description'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.description}
                      />
                    </CustomContainer>
                    <CustomContainer
                      required
                      width={50}
                      scss={scss}
                      label='First Address'
                      labelFor='first_address'
                      err={client.clientErr.first_address as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='first_address'
                        name='first_address'
                        onChange={handleChange}
                        className={scss.lblContent}
                        placeholder='Substreet, Street, Barangay'
                        value={client.clientObj.first_address}
                      />
                    </CustomContainer>
                    <CustomContainer
                      required
                      width={50}
                      scss={scss}
                      label='Second Address'
                      labelFor='second_address'
                      err={client.clientErr.second_address as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='second_address'
                        name='second_address'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={client.clientObj.second_address}
                        placeholder='District / Municipality, City / Province, Zip Code'
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
export default Client_V;