import Image from 'next/image'
import scss from './styles/Suppliers.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import CustomContainer from '@/components/reusables/CustomContainer'
import useSaveSupplier from '@/controllers/suppliers/useSaveSupplier'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const AddSupplier_V = () => {
  const {
    status,
    supplier,

    handleBlur,
    handleChange,
    handleSubmit,
    handleResubmit,
  } = useSaveSupplier()
  const { loader } = status
  return (
      <form onSubmit={handleSubmit} className={scss.addClient}>
        { loader && <Loader scss={scss} position='absolute' />}
        <div className={scss.cards}>
          <div className={scss.card+' '+scss.w100}>
            <div className={scss.box}>
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
                      <select
                        id='classification'
                        name='classification'
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={supplier.supplierObj.classification}
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
                      err={supplier.supplierErr.tin as string}
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
                          id='registered_name'
                          type='text'
                          name='registered_name'
                          maxLength={100}
                          autoComplete='off'
                          value={supplier.supplierObj.registered_name}
                          onKeyUp={handleBlur}
                          onChange={handleChange}
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
                            id='first_name'
                            type='text'
                            name='first_name'
                            maxLength={20}
                            autoComplete='off'
                            placeholder='Andres'
                            value={supplier.supplierObj.first_name}
                            onKeyUp={handleBlur}
                            onChange={handleChange}
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
                            type='text'
                            id='middle_name'
                            name='middle_name'
                            maxLength={20}
                            autoComplete='off'
                            placeholder='de Castro'
                            value={supplier.supplierObj.middle_name}
                            onKeyUp={handleBlur}
                            onChange={handleChange}
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
                            id='last_name'
                            type='text'
                            name='last_name'
                            maxLength={20}
                            autoComplete='off'
                            placeholder='Bonifacio'
                            value={supplier.supplierObj.last_name}
                            onKeyUp={handleBlur}
                            onChange={handleChange}
                          />
                        </CustomContainer>
                      </>
                    }
                    <CustomContainer
                      scss={scss}
                      width={50}
                      label='Trade Name'
                      labelFor='trade_name'
                      err={supplier.supplierErr.trade_name as string}
                    >
                      <input
                        id='trade_name'
                        type='text'
                        name='trade_name'
                        maxLength={100}
                        autoComplete='off'
                        value={supplier.supplierObj.trade_name}
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
                      err={supplier.supplierErr.email as string}
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
                        value={supplier.supplierObj.email}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      label='Substreet'
                      labelFor='sub_street'
                      err={supplier.supplierErr.sub_street as string}
                    >
                      <input
                        id='sub_street'
                        type='text'
                        name='sub_street'
                        maxLength={50}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={supplier.supplierObj.sub_street}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      label='Street'
                      labelFor='street'
                      err={supplier.supplierErr.street as string}
                    >
                      <input
                        id='street'
                        type='text'
                        name='street'
                        maxLength={50}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={supplier.supplierObj.street}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={20}
                      label='Barangay'
                      labelFor='barangay'
                      err={supplier.supplierErr.barangay as string}
                    >
                      <input
                        id='barangay'
                        type='text'
                        name='barangay'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={supplier.supplierObj.barangay}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      label='District / Municipality'
                      labelFor='district'
                      err={supplier.supplierErr.district as string}
                    >
                      <input
                        id='district'
                        type='text'
                        name='district'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={supplier.supplierObj.district}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={40}
                      label='City / Province'
                      labelFor='city'
                      err={supplier.supplierErr.city as string}
                    >
                      <input
                        id='city'
                        type='text'
                        name='city'
                        maxLength={30}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={supplier.supplierObj.city}
                      />
                    </CustomContainer>
                    <CustomContainer
                      scss={scss}
                      width={20}
                      label='Zip Code'
                      labelFor='zip_code'
                      err={supplier.supplierErr.zip_code as string}
                    >
                      <input
                        id='zip_code'
                        type='text'
                        name='zip_code'
                        maxLength={10}
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={supplier.supplierObj.zip_code}
                      />
                    </CustomContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '30px auto'}} onKeyDown={handleResubmit}>
          Add Supplier
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
export default AddSupplier_V;