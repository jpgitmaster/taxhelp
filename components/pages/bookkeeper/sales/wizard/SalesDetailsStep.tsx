import dayjs from 'dayjs'
import { Collapse, DatePicker } from 'antd'
import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from 'react'
import scss from './styles/Wizard.module.scss'
import WizardField from './WizardField'
import { Particular } from '@/controllers/sales/types'
import SectionHeader from '@/components/reusables/SectionHeader'
import TermsDropdown from '@/components/pages/bookkeeper/sales/TermsDropdown'
import DiscountsDropdown from '@/components/pages/bookkeeper/sales/DiscountsDropdown'
import ParticularsTable from '@/components/pages/bookkeeper/sales/ParticularsTable'

const DATE_FORMAT = 'MM/DD/YYYY'

const SalesDetailsStep = (props: {
  doc: any
  sales: any
  errArr: Particular[]
  displayTerms: boolean
  displayDiscounts: boolean
  setDisplayTerms: Dispatch<SetStateAction<boolean>>
  setDisplayDiscounts: Dispatch<SetStateAction<boolean>>
  handleBlur: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>) => void
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleDate: (date: any, dateString: string, name: string) => void
  handleToggle: (dropdown: string) => void
  handleSelectTerms: (terms: { value: string, label: string }) => void
  handleSelectDiscount: (discount: { value: string, label: string }) => void
  handleAddParticular: () => void
  handleRemoveParticular: (index: number) => void
  handleParticularChange: (index: number, e: ChangeEvent<HTMLInputElement>) => void
}) => {
  const {
    doc,
    sales,
    errArr,
    displayTerms,
    displayDiscounts,
    setDisplayTerms,
    setDisplayDiscounts,
    handleBlur,
    handleChange,
    handleDate,
    handleToggle,
    handleSelectTerms,
    handleSelectDiscount,
    handleAddParticular,
    handleRemoveParticular,
    handleParticularChange,
  } = props

  const customer = sales.salesObj.customer
  const customerName = customer?.classification === 'NON-INDIVIDUAL'
    ? customer?.registered_name
    : [customer?.first_name, customer?.middle_name, customer?.last_name].filter(Boolean).join(' ')

  return (
    <>
      <div className={scss.summaryCard}>
        <Collapse
          ghost
          expandIconPosition="end"
          items={[
            {
              key: '1',
              label: (
                <div className={scss.summaryHeader}>
                  <span className={scss.summaryIcon}>1</span>
                  <div>
                    <strong>{doc.client?.registered_name || doc.client?.first_name || 'Client'}</strong>
                    <small>Billed to: {customerName || 'No customer selected'} · TIN {customer?.tin || '—'}</small>
                  </div>
                </div>
              ),
              children: (
                <div className={scss.summaryList}>
                  <div className={scss.summaryRow}><small>Classification</small><span>{customer?.classification?.toLowerCase() || '—'}</span></div>
                  <div className={scss.summaryRow}><small>TIN No.</small><span>{customer?.tin || '—'}</span></div>
                  <div className={scss.summaryRow}><small>Trade Name</small><span>{customer?.trade_name || '—'}</span></div>
                  <div className={scss.summaryRow}><small>Phone</small><span>{customer?.phone_number || '—'}</span></div>
                  <div className={scss.summaryRow}><small>First Address</small><span>{customer?.first_address || '—'}</span></div>
                  <div className={scss.summaryRow}><small>Second Address</small><span>{customer?.second_address || '—'}</span></div>
                </div>
              ),
            },
          ]}
        />
      </div>

      <div className={scss.panel}>
        <SectionHeader title="Sales Details" />

        <div className={scss.fieldGrid}>
          <WizardField span={4} label="Taxable Month" htmlFor="taxable_month" required err={sales.salesErr.taxable_month as string}>
            <DatePicker
              picker="month"
              format="MM-YYYY"
              name="taxable_month"
              placeholder="MM-YYYY"
              value={sales.salesObj.taxable_month}
              onChange={(date, dateString) => handleDate(date, String(dateString), 'taxable_month')}
              defaultPickerValue={sales.salesObj.taxable_month ? dayjs(sales.salesObj.taxable_month) : dayjs()}
              status={sales.salesErr.taxable_month ? 'error' : undefined}
            />
          </WizardField>
          <WizardField span={4} label="Invoice Date" htmlFor="invoice_date" required err={sales.salesErr.invoice_date as string}>
            <DatePicker
              name="invoice_date"
              format={DATE_FORMAT}
              placeholder="MM/DD/YYYY"
              value={sales.salesObj.invoice_date ? dayjs(sales.salesObj.invoice_date, DATE_FORMAT) : null}
              onChange={(_, dateString) => handleDate(_, String(dateString), 'invoice_date')}
              defaultPickerValue={sales.salesObj.invoice_date ? dayjs(sales.salesObj.invoice_date) : dayjs()}
              status={sales.salesErr.invoice_date ? 'error' : undefined}
            />
          </WizardField>
          <WizardField span={4} label="Invoice Number" htmlFor="invoice_number" required err={sales.salesErr.invoice_number as string}>
            <input
              id="invoice_number"
              type="text"
              name="invoice_number"
              maxLength={20}
              autoComplete="off"
              placeholder="0000000"
              value={sales.salesObj.invoice_number}
              onKeyUp={handleBlur}
              onChange={handleChange}
            />
          </WizardField>
        </div>

        <div className={scss.fieldGrid}>
          <WizardField span={doc.selectedDiscount?.value ? 3 : 4} label="Terms" htmlFor="terms" required err={sales.salesErr.terms as string}>
            <TermsDropdown
              doc={doc}
              options={[
                { label: 'Cash', value: 'CASH' },
                { label: 'Charge', value: 'CHARGE' },
              ]}
              displayTerms={displayTerms}
              setDisplayTerms={setDisplayTerms}
              handleToggle={handleToggle}
              handleSelectTerms={handleSelectTerms}
            />
          </WizardField>
          <WizardField span={doc.selectedDiscount?.value ? 5 : 8} label="Discount Type" htmlFor="discount_type" required err={sales.salesErr.terms as string}>
            <DiscountsDropdown
              doc={doc}
              options={[
                { label: 'No Discount', value: '' },
                { label: 'Senior Citizen', value: 'SC' },
                { label: 'Person with Disability', value: 'PWD' },
                { label: 'Medal of Valor', value: 'MOV' },
                { label: 'National Athletes and Coaches Benefits and Incentives Act', value: 'NAAC' },
                { label: 'Solo Parent', value: 'SP' },
              ]}
              displayDiscounts={displayDiscounts}
              setDisplayDiscounts={setDisplayDiscounts}
              handleToggle={handleToggle}
              handleSelectDiscount={handleSelectDiscount}
            />
          </WizardField>
          {!!doc.selectedDiscount?.value && (
            <WizardField span={4} label={doc.selectedDiscount.value + ' ID No.'} htmlFor="id_number" required err={sales.salesErr.id_number as string}>
              <input
                type="text"
                name="id_number"
                autoComplete="off"
                onKeyUp={handleBlur}
                placeholder="0000000"
                value={sales.salesObj.id_number}
                onChange={handleChange}
              />
            </WizardField>
          )}
        </div>

        <div className={scss.fieldGrid}>
          <WizardField span={12} label="Account Name" htmlFor="account_name" required err={sales.salesErr.account_name as string}>
            <input
              id="account_name"
              type="text"
              name="account_name"
              maxLength={20}
              autoComplete="off"
              value={sales.salesObj.account_name}
              onKeyUp={handleBlur}
              onChange={handleChange}
            />
          </WizardField>
        </div>

        <hr className={scss.divider} />

        <ParticularsTable
          particulars={sales.salesObj.particulars}
          errArr={errArr}
          handleBlur={handleBlur}
          handleAddParticular={handleAddParticular}
          handleRemoveParticular={handleRemoveParticular}
          handleParticularChange={handleParticularChange}
        />
      </div>
    </>
  )
}

export default SalesDetailsStep
