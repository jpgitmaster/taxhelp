import dayjs from 'dayjs'
import { DatePicker } from 'antd'
import scss from './styles/Sales.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import useSaveSales from '@/controllers/sales/useSaveSales'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import TermsDropdown from '@/components/pages/bookkeeper/sales/TermsDropdown'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
const AddSalesRecord_V = () => {
  const {
    doc,
    sales,
    status,
    clientArr,
    clientLoader,
    displayTerms,
    displayClients,

    setDisplayTerms,
    setDisplayClients,
    
    handleBlur,
    handleDate,
    handleChange,
    handleSubmit,
    handleToggle,
    handleResubmit,
    handleSelectTerms,
    handleSelectClient
  } = useSaveSales()
  const { loader } = status
  const dateFormat = 'MM/DD/YYYY'
  return (
      <form onSubmit={handleSubmit} className={scss.addClient}>
        { loader && <Loader scss={scss} position='absolute' />}
        <div className={scss.box}>
          <div className={scss.boxTitle}>
            Customer Details
          </div>
          <div className={scss.cards}>
            <CustomContainer
              scss={scss}
              width={50}
              required={true}
              label='Customer'
              labelFor='client'
              err={sales.salesErr.client as string}
            >
              <ClientsDropdown
                doc={doc}
                clients={clientArr}
                loader={clientLoader}
                displayClients={displayClients}

                setDisplayClients={setDisplayClients}

                handleChange={handleChange}
                handleToggle={handleToggle}
                handleSelectClient={handleSelectClient}
              />
            </CustomContainer>
            <div className={scss.card+' '+scss.w50}>
              <div className={scss.cards} style={{margin: 0}}>
                <CustomContainer
                  scss={scss}
                  width={50}
                  required={true}
                  label='Classification'
                  labelFor='classification'
                  err={sales.salesErr.classification as string}
                >
                  <input
                    readOnly
                    type='text'
                    id='classification'
                    name='classification'
                    className={scss.lblContent}
                    value={sales.salesObj.business_profile.classification?.toLowerCase()}
                    onKeyUp={handleBlur}
                    onChange={handleChange}
                    style={{textTransform: 'capitalize'}}
                  />
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={50}
                  required={true}
                  label='TIN No.'
                  labelFor='tin'
                  err={sales.salesErr.tin as string}
                >
                  <input
                    id='tin'
                    readOnly
                    name='tin'
                    type='text'
                    maxLength={20}
                    autoComplete='off'
                    placeholder='000-000-000'
                    className={scss.lblContent}
                    value={sales.salesObj.business_profile.tin}
                    onKeyUp={handleBlur}
                    onChange={handleChange}
                  />
                </CustomContainer>
              </div>
            </div>
            <CustomContainer
              scss={scss}
              width={33}
              label='First Name'
              labelFor='first_name'
              err={sales.salesErr.first_name as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                id='first_name'
                name='first_name'
                autoComplete='off'
                className={scss.lblContent}
                value={sales.salesObj.business_profile.first_name}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={33}
              label='Middle Name'
              labelFor='middle_name'
              err={sales.salesErr.middle_name as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                id='middle_name'
                name='middle_name'
                autoComplete='off'
                className={scss.lblContent}
                value={sales.salesObj.business_profile.middle_name}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={33}
              label='Last Name'
              labelFor='last_name'
              err={sales.salesErr.last_name as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                id='last_name'
                name='last_name'
                autoComplete='off'
                className={scss.lblContent}
                value={sales.salesObj.business_profile.last_name}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={50}
              label='Registered Name'
              labelFor='registered_name'
              err={sales.salesErr.registered_name as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                autoComplete='off'
                id='registered_name'
                name='registered_name'
                className={scss.lblContent}
                value={sales.salesObj.business_profile.registered_name}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={50}
              label='Trade Name'
              labelFor='trade_name'
              err={sales.salesErr.trade_name as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                id='trade_name'
                name='trade_name'
                autoComplete='off'
                className={scss.lblContent}
                value={sales.salesObj.business_profile.trade_name}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
          </div>
        </div>
        <div className={scss.box}>
          <div className={scss.boxTitle}>
            Sales Details
          </div>
          <div className={scss.cards}>
            <CustomContainer
              scss={scss}
              width={33}
              required={true}
              label='Taxable Month'
              labelFor='taxable_month'
              err={sales.salesErr.taxable_month as string}
            >
              <DatePicker
                  picker="month"
                  format={'MM-YYYY'}
                  name='taxable_month'
                  placeholder='MM-YYYY'
                  value={sales.salesObj.taxable_month}
                  onChange={(date, dateString) => handleDate(date, String(dateString), 'taxable_month',)}
                  defaultPickerValue={sales.salesObj.taxable_month ? dayjs(sales.salesObj.taxable_month) : dayjs()}
                  style={{ border: sales.salesErr.taxable_month ? '1px solid #F00' : '1px solid #D9D9D9' }}
                  // disabledDate={(current) => {
                  //     const customDate = dayjs().format(dateFormat);
                  //     return current && current < dayjs(customDate, dateFormat);
                  // }}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={33}
              required={true}
              label='Invoice Date'
              labelFor='invoice_date'
              err={sales.salesErr.invoice_date as string}
            >
              <DatePicker
                  name='invoice_date'
                  format={dateFormat}
                  placeholder='MM/DD/YYYY'
                  value={sales.salesObj.invoice_date ? dayjs(sales.salesObj.invoice_date, dateFormat) : null}
                  onChange={(_, dateString) => handleDate(_, String(dateString), 'invoice_date',)}
                  defaultPickerValue={sales.salesObj.invoice_date ? dayjs(sales.salesObj.invoice_date) : dayjs()}
                  style={{ border: sales.salesErr.taxable_month ? '1px solid #F00' : '1px solid #D9D9D9' }}
                  // disabledDate={(current) => {
                  //     const customDate = dayjs().format(dateFormat);
                  //     return current && current < dayjs(customDate, dateFormat);
                  // }}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={33}
              required={true}
              label='Invoice Number'
              labelFor='invoice_number'
              err={sales.salesErr.invoice_number as string}
            >
              <input
                id='invoice_number'
                type='text'
                name='invoice_number'
                maxLength={20}
                autoComplete='off'
                value={sales.salesObj.invoice_number}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={33}
              required={true}
              label='Particulars'
              labelFor='particulars'
              err={sales.salesErr.particulars as string}
            >
              <input
                id='particulars'
                type='text'
                name='particulars'
                maxLength={20}
                autoComplete='off'
                value={sales.salesObj.particulars}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={33}
              required={true}
              label='Terms'
              labelFor='terms'
              err={sales.salesErr.terms as string}
            >
              <TermsDropdown
                doc={doc}
                options={[
                  {
                    label: 'Cash',
                    value: 'CASH'
                  },
                  {
                    label: 'Charge',
                    value: 'CHARGE'
                  }
                ]}
                displayTerms={displayTerms}
                setDisplayTerms={setDisplayTerms}
                handleToggle={handleToggle}
                handleSelectTerms={handleSelectTerms}
              />
              {/* <input
                id='terms'
                type='text'
                name='terms'
                maxLength={20}
                autoComplete='off'
                value={sales.salesObj.terms}
                onKeyUp={handleBlur}
                onChange={handleChange}
              /> */}
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={33}
              required={true}
              label='Account Name'
              labelFor='account_name'
              err={sales.salesErr.account_name as string}
            >
              <input
                id='account_name'
                type='text'
                name='account_name'
                maxLength={20}
                autoComplete='off'
                value={sales.salesObj.account_name}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            
            <CustomContainer
              scss={scss}
              width={25}
              required={true}
              label='Exempt Sales'
              labelFor='exempt_sales'
              err={sales.salesErr.exempt_sales as string}
            >
              <input
                type='text'
                maxLength={20}
                id='exempt_sales'
                autoComplete='off'
                placeholder='0.00'
                name='exempt_sales'
                value={sales.salesObj.exempt_sales}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={25}
              required={true}
              label='Zero Rated Sales'
              labelFor='zero_rated_sales'
              err={sales.salesErr.zero_rated_sales as string}
            >
              <input
                type='text'
                maxLength={20}
                autoComplete='off'
                placeholder='0.00'
                id='zero_rated_sales'
                name='zero_rated_sales'
                value={sales.salesObj.zero_rated_sales}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={25}
              required={true}
              label='Vatable Sales'
              labelFor='vatable_sales'
              err={sales.salesErr.vatable_sales as string}
            >
              <input
                type='text'
                maxLength={20}
                autoComplete='off'
                id='vatable_sales'
                name='vatable_sales'
                placeholder='0.00'
                value={sales.salesObj.vatable_sales}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={25}
              required={true}
              label='Gross Amount'
              labelFor='gross_amount'
              err={sales.salesErr.gross_amount as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                id='gross_amount'
                autoComplete='off'
                placeholder='0.00'
                name='gross_amount'
                className={scss.lblContent}
                value={sales.salesObj.gross_amount}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={25}
              required={true}
              label='VAT Rate'
              labelFor='vat_rate'
              err={sales.salesErr.vat_rate as string}
            >
              <input
                readOnly
                type='text'
                id='vat_rate'
                maxLength={20}
                name='vat_rate'
                placeholder='12%'
                autoComplete='off'
                className={scss.lblContent}
                value={sales.salesObj.vat_rate}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={25}
              required={true}
              label='VAT Amount'
              labelFor='vat_amount'
              err={sales.salesErr.vat_amount as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                id='vat_amount'
                name='vat_amount'
                autoComplete='off'
                placeholder='0.00'
                className={scss.lblContent}
                value={sales.salesObj.vat_amount}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={25}
              required={true}
              label='Gross Taxable'
              labelFor='gross_taxable'
              err={sales.salesErr.gross_taxable as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                autoComplete='off'
                id='gross_taxable'
                name='gross_taxable'
                placeholder='0.00'
                className={scss.lblContent}
                value={sales.salesObj.gross_taxable}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={25}
              required={true}
              label='Total Gross Amount'
              labelFor='total_gross_amount'
              err={sales.salesErr.total_gross_amount as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                autoComplete='off'
                id='total_gross_amount'
                name='total_gross_amount'
                placeholder='0.00'
                className={scss.lblContent}
                value={sales.salesObj.total_gross_amount}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            
            <CustomContainer
              scss={scss}
              width={33}
              required={true}
              label='ATC'
              labelFor='atc'
              err={sales.salesErr.atc as string}
            >
              <input
                type='text'
                maxLength={10}
                autoComplete='off'
                id='atc'
                name='atc'
                value={sales.salesObj.atc}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            
            <CustomContainer
              scss={scss}
              width={33}
              required={true}
              label='Withholding Tax Rate'
              labelFor='ewt_rate'
              err={sales.salesErr.ewt_rate as string}
            >
              <input
                type='text'
                maxLength={20}
                autoComplete='off'
                id='ewt_rate'
                name='ewt_rate'
                value={sales.salesObj.ewt_rate}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={33}
              required={true}
              label='Witholding Tax Amount'
              labelFor='tax_amount'
              err={sales.salesErr.tax_amount as string}
            >
              <input
                readOnly
                type='text'
                maxLength={20}
                id='tax_amount'
                name='tax_amount'
                autoComplete='off'
                placeholder='0.00'
                className={scss.lblContent}
                value={sales.salesObj.tax_amount}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            
          </div>
        </div>
        <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '30px auto'}} onKeyDown={handleResubmit}>
          Add Sales Record
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
export default AddSalesRecord_V;