import dayjs from 'dayjs'
import Image from 'next/image'
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
import CustomersDropdown from '@/components/pages/bookkeeper/sales/CustomersDropdown'
import { Fragment } from 'react/jsx-runtime'
const AddSalesRecord_V = () => {
  const {
    doc,
    sales,
    status,
    errArr,
    options,
    clientArr,
    customerArr,
    clientLoader,
    displayTerms,
    editCustomer,
    displayClients,
    customerLoader,
    displayCustomers,

    setDisplayTerms,
    setDisplayClients,
    setDisplayCustomers,
    
    handleBlur,
    handleDate,
    handleChange,
    handleSubmit,
    handleToggle,
    handleResubmit,
    handleSelectTerms,
    handleSelectClient,
    handleEditCustomer,
    handleAddParticular,
    handleSelectCustomer,
    handleRemoveParticular,
    handleParticularChange,
  } = useSaveSales()
  const { loader } = status
  const dateFormat = 'MM/DD/YYYY'
  return (
      <form onSubmit={handleSubmit} className={scss.addClient}>
        { loader && <Loader scss={scss} position='absolute' />}
        <div className={scss.box+' '+scss.view}>
          <div className={scss.cards} style={{marginBottom: 0}}>
            <CustomContainer
              scss={scss}
              width={50}
              required={true}
              label='Client'
              labelFor='client'
              err={sales.salesErr.client as string}
            >
              <ClientsDropdown
                doc={doc}
                clients={clientArr}
                loader={clientLoader}
                displayClients={displayClients}
                err={sales.salesErr.client as string}
                setDisplayClients={setDisplayClients}

                handleChange={handleChange}
                handleToggle={handleToggle}
                handleSelectClient={handleSelectClient}
              />
            </CustomContainer>
          </div>
        </div>
        <div className={scss.box}>
          <div className={scss.boxTitle}>
            Customer Details
          </div>
          {
            (doc.customer?.id && !editCustomer) &&
            <button type='button' className={scss.editForm} onClick={() => handleEditCustomer(true)}>
              <Image src='/svgs/edit.svg' alt='Edit Details' priority width={20} height={20} unoptimized={true} />
              Edit Details
            </button>
          }
          {
            (editCustomer) &&
            <button type='button' className={scss.editForm} onClick={() => handleEditCustomer(false)}>
              <Image src='/svgs/eyecon_check.svg' alt='View Details' priority width={20} height={20} unoptimized={true} />
              View Details
            </button>
          }
          
          <div className={scss.cards}>
            <CustomContainer
              scss={scss}
              width={50}
              required={true}
              label='Customer'
              labelFor='customer'
              err={sales.salesErr.customer as string}
            >
              <CustomersDropdown
                doc={doc}
                loader={customerLoader}
                customers={customerArr}
                displayCustomers={displayCustomers}
                err={sales.salesErr.customer as string}

                setDisplayCustomers={setDisplayCustomers}

                handleChange={handleChange}
                handleToggle={handleToggle}
                handleSelectCustomer={handleSelectCustomer}
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
                  {
                    editCustomer ?
                    <select
                      id='classification'
                      name='classification'
                      autoComplete='off'
                      onKeyUp={handleBlur}
                      onChange={handleChange}
                      value={sales.salesObj.customer?.classification}
                    >
                      <option value='NON-INDIVIDUAL'>Non-Individual</option>
                      <option value='INDIVIDUAL'>Individual</option>
                    </select>
                    :
                    <input
                      readOnly
                      type='text'
                      id='classification'
                      name='classification'
                      className={scss.lblContent}
                      value={sales.salesObj.customer?.classification?.toLowerCase()}
                      onChange={handleChange}
                      style={{textTransform: 'capitalize'}}
                    />
                  }
                  
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={50}
                  required={true}
                  label='TIN No.'
                  labelFor='tin'
                  err={sales.salesErr.tin as string}
                >
                  {
                    editCustomer ?
                    <input
                      id='tin'
                      type='text'
                      name='tin'
                      maxLength={30}
                      autoComplete='off'
                      onKeyUp={handleBlur}
                      onChange={handleChange}
                      placeholder="000-000-000"
                      value={sales.salesObj.customer?.tin}
                    />
                    :
                    <input
                      id='tin'
                      readOnly
                      name='tin'
                      type='text'
                      className={scss.lblContent}
                      value={sales.salesObj.customer?.tin}
                      onChange={handleChange}
                    />
                  }
                </CustomContainer>
              </div>
            </div>
            {
              sales.salesObj.customer?.classification === 'NON-INDIVIDUAL' &&
              <CustomContainer
                scss={scss}
                width={100}
                label='Registered Name'
                labelFor='registered_name'
                err={sales.salesErr.registered_name as string}
                required={sales.salesObj.customer?.classification === 'NON-INDIVIDUAL' ? true : false}
              >
                {
                  editCustomer ?
                  <input
                    type='text'
                    maxLength={100}
                    autoComplete='off'
                    id='registered_name'
                    name='registered_name'
                    onKeyUp={handleBlur}
                    onChange={handleChange}
                    value={sales.salesObj.customer?.registered_name}
                  />
                  :
                  <input
                    readOnly
                    type='text'
                    id='registered_name'
                    name='registered_name'
                    onChange={handleChange}
                    className={scss.lblContent}
                    value={sales.salesObj.customer?.registered_name}
                  />
                }
              </CustomContainer>
            }
            {
              sales.salesObj.customer?.classification === 'INDIVIDUAL' &&
              <>
                <CustomContainer
                  scss={scss}
                  width={33}
                  label='First Name'
                  labelFor='first_name'
                  err={sales.salesErr.first_name as string}
                  required={sales.salesObj.customer?.classification === 'INDIVIDUAL' ? true : false}
                >
                  {
                    editCustomer ?
                    <input
                      type='text'
                      maxLength={20}
                      id='first_name'
                      name='first_name'
                      autoComplete='off'
                      onKeyUp={handleBlur}
                      onChange={handleChange}
                      value={sales.salesObj.customer?.first_name}
                    />
                    :
                    <input
                      readOnly
                      type='text'
                      id='first_name'
                      name='first_name'
                      onChange={handleChange}
                      className={scss.lblContent}
                      value={sales.salesObj.customer?.first_name}
                    />
                  }
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={33}
                  label='Middle Name'
                  labelFor='middle_name'
                  err={sales.salesErr.middle_name as string}
                >
                  {
                    editCustomer ?
                    <input
                      type='text'
                      maxLength={20}
                      id='middle_name'
                      name='middle_name'
                      autoComplete='off'
                      onKeyUp={handleBlur}
                      onChange={handleChange}
                      value={sales.salesObj.customer?.middle_name}
                    />
                    :
                    <input
                      readOnly
                      type='text'
                      id='middle_name'
                      name='middle_name'
                      onChange={handleChange}
                      className={scss.lblContent}
                      value={sales.salesObj.customer?.middle_name}
                    />
                  }
                </CustomContainer>
                <CustomContainer
                  scss={scss}
                  width={33}
                  label='Last Name'
                  labelFor='last_name'
                  err={sales.salesErr.last_name as string}
                  required={sales.salesObj.customer?.classification === 'INDIVIDUAL' ? true : false}
                >
                  {
                    editCustomer ?
                    <input
                      type='text'
                      maxLength={20}
                      id='last_name'
                      name='last_name'
                      autoComplete='off'
                      onKeyUp={handleBlur}
                      onChange={handleChange}
                      value={sales.salesObj.customer?.last_name}
                    />
                    :
                    <input
                      readOnly
                      type='text'
                      id='last_name'
                      name='last_name'
                      onChange={handleChange}
                      className={scss.lblContent}
                      value={sales.salesObj.customer?.last_name}
                    />
                  }
                </CustomContainer>
              </>
            }
            
            <CustomContainer
              scss={scss}
              width={100}
              label='Trade Name'
              labelFor='trade_name'
              err={sales.salesErr.trade_name as string}
            >
              {
                editCustomer ?
                <input
                  type='text'
                  maxLength={100}
                  id='trade_name'
                  name='trade_name'
                  autoComplete='off'
                  onKeyUp={handleBlur}
                  onChange={handleChange}
                  value={sales.salesObj.customer?.trade_name}
                />
                :
                <input
                  readOnly
                  type='text'
                  id='trade_name'
                  name='trade_name'
                  onChange={handleChange}
                  className={scss.lblContent}
                  value={sales.salesObj.customer?.trade_name}
                />
              }
              
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={50}
              label='Phone Number'
              labelFor='phone'
              err={sales.salesErr.phone as string}
            >
              {
                editCustomer ?
                <input
                  id='phone'
                  type='text'
                  name='phone'
                  maxLength={30}
                  autoComplete='off'
                  placeholder='(+63)926-123-4567'
                  onKeyUp={handleBlur}
                  onChange={handleChange}
                  value={sales.salesObj.customer?.phone_number}
                />
                :
                <input
                  readOnly
                  id='phone_number'
                  type='text'
                  name='phone_number'
                  onChange={handleChange}
                  className={scss.lblContent}
                  value={sales.salesObj.customer?.phone_number}
                />
              }
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={50}
              label='Email'
              labelFor='email'
              err={sales.salesErr.email as string}
            >
              {
                editCustomer ?
                <input
                  id='email'
                  name='email'
                  type='text'
                  maxLength={50}
                  autoComplete='off'
                  placeholder='yourname@yourcompany.com'
                  onKeyUp={handleBlur}
                  onChange={handleChange}
                  value={sales.salesObj.customer?.email}
                />
                :
                <input
                  readOnly
                  type='text'
                  id='email'
                  name='email'
                  onChange={handleChange}
                  className={scss.lblContent}
                  value={sales.salesObj.customer?.email}
                />
              }
              
            </CustomContainer>
            <CustomContainer
              required
              width={40}
              scss={scss}
              label='First Address'
              labelFor='first_address'
              err={sales.salesErr.first_address as string}
            >
              {
                editCustomer ?
                <input
                  type='text'
                  maxLength={50}
                  autoComplete='off'
                  id='first_address'
                  name='first_address'
                  onKeyUp={handleBlur}
                  onChange={handleChange}
                  placeholder='Substreet, Street, Barangay'
                  value={sales.salesObj.customer?.first_address}
                />
                :
                <input
                  readOnly
                  type='text'
                  id='first_address'
                  name='first_address'
                  onChange={handleChange}
                  className={scss.lblContent}
                  value={sales.salesObj.customer?.first_address}
                />
              }
            </CustomContainer>
            <CustomContainer
              required
              width={40}
              scss={scss}
              label='Second Address'
              labelFor='second_address'
              err={sales.salesErr.second_address as string}
            >
              {
                editCustomer ?
                <input
                  id='second_address'
                  type='text'
                  name='second_address'
                  maxLength={50}
                  autoComplete='off'
                  onKeyUp={handleBlur}
                  onChange={handleChange}
                  placeholder='District / Municipality, City / Province'
                  value={sales.salesObj.customer?.second_address}
                />
                :
                <input
                  readOnly
                  type='text'
                  id='second_address'
                  name='second_address'
                  onChange={handleChange}
                  className={scss.lblContent}
                  value={sales.salesObj.customer?.second_address}
                />
              }
            </CustomContainer>
            <CustomContainer
              width={20}
              scss={scss}
              label='Postal Code'
              labelFor='postal_code'
              err={sales.salesErr.postal_code as string}
            >
              {
                editCustomer ?
                <input
                  type='text'
                  maxLength={10}
                  id='postal_code'
                  autoComplete='off'
                  name='postal_code'
                  onKeyUp={handleBlur}
                  onChange={handleChange}
                  value={sales.salesObj.customer?.postal_code}
                />
                :
                <input
                  readOnly
                  type='text'
                  id='postal_code'
                  name='postal_code'
                  onChange={handleChange}
                  className={scss.lblContent}
                  value={sales.salesObj.customer?.postal_code}
                />
              }
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
                  style={{ border: sales.salesErr.invoice_date ? '1px solid #F00' : '1px solid #D9D9D9' }}
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
                placeholder='0000000'
                value={sales.salesObj.invoice_number}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={20}
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
            </CustomContainer>
            <CustomContainer
              scss={scss}
              width={80}
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
          </div>
          <div className={scss.divider}>
              <h2>
                  Particulars
              </h2>
              <hr />
          </div>
          <button
            className={scss.button + ' ' + scss.btngreen}
            style={{
              float: 'left',
              width: '150px',
              margin: '-15px 0 20px'
            }}
            type="button"
            onClick={handleAddParticular}
          >
            Add Particular
          </button>
          <div className={scss.cards} style={{paddingRight: '35px'}}>
            {sales.salesObj.particulars.map((particular, index) => (
            <Fragment key={index}>
                    <CustomContainer
                      scss={scss}
                      width={50}
                      required={true}
                      labelFor={`description-${index}`}
                      label='Item Description / Service Nature'
                      err={errArr[index]?.description as string}
                    >
                      <input
                        type='text'
                        name='description'
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        id={`description-${index}`}
                        value={particular.description}
                        onChange={(e) => handleParticularChange(index, e)}
                      />
                    </CustomContainer>
                    <div className={scss.card+' '+scss.w50}>
                      <div className={scss.cards+' '+scss.particulars}>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          required={true}
                          label='Quantity'
                          labelFor={`quantity-${index}`}
                          err={errArr[index]?.quantity as string}
                        >
                          <input
                            type='text'
                            name='quantity'
                            placeholder='0'
                            autoComplete='off'
                            onKeyUp={handleBlur}
                            id={`quantity-${index}`}
                            value={particular.quantity}
                            onChange={(e) => handleParticularChange(index, e)}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          required={true}
                          label='Unit Price'
                          labelFor={`unit-price-${index}`}
                          err={errArr[index]?.unit_price as string}
                        >
                          <input
                            type='text'
                            name='unit_price'
                            autoComplete='off'
                            placeholder='0.00'
                            id={`unit-price-${index}`}
                            onKeyUp={handleBlur}
                            value={particular.unit_price}
                            onChange={(e) => handleParticularChange(index, e)}
                          />
                        </CustomContainer>
                        <CustomContainer
                          scss={scss}
                          width={33}
                          label='Amount'
                          required={true}
                          labelFor={`amount-${index}`}
                          err={errArr[index]?.amount as string}
                        >
                          <input
                            readOnly
                            type='text'
                            name='amount'
                            autoComplete='off'
                            placeholder='0.00'
                            onKeyUp={handleBlur}
                            id={`amount-${index}`}
                            value={particular.amount}
                            className={scss.lblContent}
                            onChange={(e) => handleParticularChange(index, e)}
                          />
                        </CustomContainer>
                        <div className={scss.removeBtn}>
                          {sales.salesObj.particulars.length > 1 && (
                            <button
                              type='button'
                              className={scss.remove}
                              onClick={() => handleRemoveParticular(index)}
                            >
                              <Image src='/svgs/cross.svg' alt='Remove Record' priority width={25} height={25} unoptimized={true} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                </Fragment>
              ))}
          </div>
        </div>
        <div className={scss.box}>
          <div className={scss.boxTitle}>
            Tax Details
          </div>
          <div className={scss.cards}>
            <CustomContainer
              scss={scss}
              width={100}
              required={true}
              label='VAT Type'
              labelFor='vat_type'
              err={sales.salesErr.vat_type as string}
            >
              <ul className={scss.typeOptions}>
                  {
                      options.map((option, index) => (
                          <li key={index}>
                              <label className={scss.option
                                  + (sales.salesObj.vat_type === option.value ? ' '+scss.checked : '')
                              }>
                                  <Image src={'/svgs/'+option.icon} alt="Business Owner" width={20} height={20} unoptimized={true} />
                                  <div>
                                      <strong>
                                      {option.label}
                                      </strong>
                                      <p>
                                      {option.description}
                                      </p>
                                  </div>
                                  <input type='checkbox'
                                      name='vat_type'
                                      onKeyUp={handleBlur}
                                      value={option.value}
                                      checked={sales.salesObj.vat_type === option.value}
                                      onChange={handleChange}
                                  />
                                  <span className={scss.checkmark}></span>
                              </label>
                          </li>
                      ))
                  }
              </ul>
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
                readOnly={sales.salesObj.vat_type === 'INCLUSIVE'}
                className={sales.salesObj.vat_type === 'INCLUSIVE' ? scss.lblContent : ''}
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
                type='text'
                maxLength={20}
                placeholder='0.00'
                autoComplete='off'
                id='gross_taxable'
                name='gross_taxable'
                value={sales.salesObj.gross_taxable}
                readOnly={sales.salesObj.vat_type === 'EXCLUSIVE'}
                className={sales.salesObj.vat_type === 'EXCLUSIVE' ? scss.lblContent : ''}
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
                placeholder='0.00'
                autoComplete='off'
                id='total_gross_amount'
                name='total_gross_amount'
                className={scss.lblContent}
                value={sales.salesObj.total_gross_amount}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </CustomContainer>
            
            <CustomContainer
              width={33}
              scss={scss}
              label='ATC'
              labelFor='atc'
              required={true}
              err={sales.salesErr.atc as string}
            >
              <input
                id='atc'
                name='atc'
                type='text'
                maxLength={10}
                autoComplete='off'
                onKeyUp={handleBlur}
                onChange={handleChange}
                value={sales.salesObj.atc}
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