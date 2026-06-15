import Link from 'next/link'
import Image from 'next/image'
import scss from './../styles/Suppliers.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import CustomContainer from '@/components/reusables/CustomContainer'
import useSaveSupplier from '@/controllers/suppliers/useSaveSupplier'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Supplier_V = () => {
  const {
    status,
    supplier,

    handleChange,
  } = useSaveSupplier()
  const { loader } = status
  return (
      <div className={scss.viewClient}>
        { loader && <Loader scss={scss} position='absolute' />}
        <Link href={`/bookkeeper/users/suppliers/${supplier.supplierObj.id}/edit`} className={scss.editLink}>
          <Image src='/svgs/edit.svg' alt='Edit Details' priority width={20} height={20} unoptimized={true} />
          Edit Details
        </Link>
        <div className={scss.cards}>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.box+' '+scss.view}>
              <div className={scss.boxTitle}>
                Supplier Details
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
                      err={supplier.supplierErr.classification as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='classification'
                        name='classification'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={supplier.supplierObj.classification}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      label='TIN No.'
                      labelFor='tin'
                      err={supplier.supplierErr.tin as string}
                    >
                      <input
                        id='tin'
                        readOnly
                        name='tin'
                        type='text'
                        onChange={handleChange}
                        placeholder="000-000-000"
                        className={scss.lblContent}
                        value={supplier.supplierObj.tin}
                      />
                    </CustomContainer>
                    {
                      supplier.supplierObj.classification === 'NON-INDIVIDUAL' &&
                      <CustomContainer
                        scss={scss}
                        width={100}
                        label='Registered Name'
                        labelFor='registered_name'
                        err={supplier.supplierErr.registered_name as string}
                        required={supplier.supplierObj.classification === 'NON-INDIVIDUAL' ? true : false}
                      >
                        <input
                            readOnly
                            type='text'
                            id='registered_name'
                            name='registered_name'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={supplier.supplierObj.registered_name}
                        />
                      </CustomContainer>
                    }
                    {
                      supplier.supplierObj.classification === 'INDIVIDUAL' &&
                      <>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="First Name"
                          labelFor='first_name'
                          err={supplier.supplierErr.first_name as string}
                          required={supplier.supplierObj.classification === 'INDIVIDUAL' ? true : false}
                        >
                          <input
                            readOnly
                            type='text'
                            id='first_name'
                            name='first_name'
                            placeholder='Andres'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={supplier.supplierObj.first_name}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="Middle Name"
                          labelFor='middle_name'
                          err={supplier.supplierErr.middle_name as string}
                        >
                          <input
                            readOnly
                            type='text'
                            id='middle_name'
                            name='middle_name'
                            placeholder='de Castro'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={supplier.supplierObj.middle_name}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label="Last Name"
                          labelFor='last_name'
                          err={supplier.supplierErr.last_name as string}
                          required={supplier.supplierObj.classification === 'INDIVIDUAL' ? true : false}
                        >
                          <input
                            readOnly
                            type='text'
                            id='last_name'
                            name='last_name'
                            placeholder='Bonifacio'
                            onChange={handleChange}
                            className={scss.lblContent}
                            value={supplier.supplierObj.last_name}
                          />
                        </CustomContainer>
                      </>
                    }
                    <CustomContainer
                      scss={scss}
                      width={100}
                      label='Trade Name'
                      labelFor='trade_name'
                      err={supplier.supplierErr.trade_name as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='trade_name'
                        name='trade_name'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={supplier.supplierObj.trade_name}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      label='Phone Number'
                      labelFor='phone_number'
                      err={supplier.supplierErr.phone_number as string}
                    >
                      <input
                        readOnly
                        id='phone_number'
                        type='text'
                        name='phone_number'
                        onChange={handleChange}
                        className={scss.lblContent}
                        placeholder='(+63)926-123-4567'
                        value={supplier.supplierObj.phone_number}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      label='Email'
                      labelFor='email'
                      err={supplier.supplierErr.email as string}
                    >
                      <input
                        readOnly
                        id='email'
                        type='text'
                        name='email'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={supplier.supplierObj.email}
                        placeholder='yourname@yourcompany.com'
                      />
                    </CustomContainer>
                    <CustomContainer
                      required
                      width={40}
                      scss={scss}
                      label='First Address'
                      labelFor='first_address'
                      err={supplier.supplierErr.first_address as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='first_address'
                        name='first_address'
                        onChange={handleChange}
                        className={scss.lblContent}
                        placeholder='Substreet, Street, Barangay'
                        value={supplier.supplierObj.first_address}
                      />
                    </CustomContainer>
                    <CustomContainer
                      required
                      width={40}
                      scss={scss}
                      label='Second Address'
                      labelFor='second_address'
                      err={supplier.supplierErr.second_address as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='second_address'
                        name='second_address'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={supplier.supplierObj.second_address}
                        placeholder='District / Municipality, City / Province'
                      />
                    </CustomContainer>
                    <CustomContainer
                      required
                      width={20}
                      scss={scss}
                      label='Postal Code'
                      labelFor='postal_code'
                      err={supplier.supplierErr.postal_code as string}
                    >
                      <input
                        readOnly
                        type='text'
                        id='postal_code'
                        name='postal_code'
                        onChange={handleChange}
                        className={scss.lblContent}
                        value={supplier.supplierObj.postal_code}
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
export default Supplier_V;