import dayjs from 'dayjs'
import Image from 'next/image'
import { Collapse } from 'antd'
import { ChangeEvent, KeyboardEvent } from 'react'
import scss from './styles/Wizard.module.scss'
import WizardField from './WizardField'
import SectionHeader from '@/components/reusables/SectionHeader'

interface VatOption {
  value: string
  label: string
  icon: string
  description: string
}

const formatCurrency = (value: string | number) =>
  Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const TaxDetailsStep = (props: {
  doc: any
  sales: any
  options: VatOption[]
  hasWithholding: boolean
  handleBlur: (e: KeyboardEvent<HTMLInputElement>) => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleToggleWithholding: (checked: boolean) => void
}) => {
  const { doc, sales, options, hasWithholding, handleBlur, handleChange, handleToggleWithholding } = props
  const { salesObj } = sales
  const discountLabel = doc.selectedDiscount?.value ? doc.selectedDiscount?.label : ''
  const customer = salesObj.customer
  const customerName = customer?.classification === 'NON-INDIVIDUAL'
    ? customer?.registered_name
    : [customer?.first_name, customer?.middle_name, customer?.last_name].filter(Boolean).join(' ')
  const titleCase = (value?: string) => value ? value.charAt(0) + value.slice(1).toLowerCase() : ''
  const formattedTaxableMonth = salesObj.taxable_month ? dayjs(salesObj.taxable_month).format('MMMM YYYY') : '—'
  const formattedInvoiceDate = salesObj.invoice_date
    ? dayjs(salesObj.invoice_date, 'MM/DD/YYYY').format('MMM D, YYYY')
    : '—'

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
                  <div className={scss.summaryRow}><small>Classification</small><span>{titleCase(customer?.classification) || '—'}</span></div>
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

      <div className={scss.summaryCard}>
        <Collapse
          ghost
          expandIconPosition="end"
          items={[
            {
              key: '1',
              label: (
                <div className={scss.summaryHeader}>
                  <span className={scss.summaryIcon}>2</span>
                  <div>
                    <strong>Invoice {salesObj.invoice_number || '—'}</strong>
                    <small>
                      {formattedTaxableMonth} ·{' '}
                      {salesObj.particulars.filter((p: { description: string }) => p.description).length} line item(s)
                    </small>
                  </div>
                </div>
              ),
              children: (
                <>
                  <div className={scss.summaryList}>
                    <div className={scss.summaryRow}><small>Taxable Month</small><span>{formattedTaxableMonth}</span></div>
                    <div className={scss.summaryRow}><small>Invoice Date</small><span>{formattedInvoiceDate}</span></div>
                    <div className={scss.summaryRow}><small>Terms</small><span>{salesObj.terms || '—'}</span></div>
                    <div className={scss.summaryRow}><small>Account Name</small><span>{salesObj.account_name || '—'}</span></div>
                  </div>
                  <hr className={scss.divider} style={{ margin: '14px 0' }} />
                  <table className={scss.summaryTable}>
                    <thead>
                      <tr>
                        <th>Item Description</th>
                        <th className={scss.amount}>Qty</th>
                        <th className={scss.amount}>Unit Price</th>
                        <th className={scss.amount}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesObj.particulars.filter((p: { description: string }) => p.description).map((p: { description: string, quantity: string, unit_price: string, amount: string }, index: number) => (
                        <tr key={index}>
                          <td>{p.description}</td>
                          <td className={scss.amount}>{p.quantity}</td>
                          <td className={scss.amount}>{formatCurrency(p.unit_price)}</td>
                          <td className={scss.amount}>{formatCurrency(p.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3}>Subtotal</td>
                        <td className={scss.amount}>
                          {formatCurrency(salesObj.particulars.reduce(
                            (sum: number, p: { amount: string }) => sum + (Number(p.amount) || 0), 0
                          ))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </>
              ),
            },
          ]}
        />
      </div>

      <div className={scss.panel}>
        <SectionHeader title="Tax Details" />

        <SectionHeader title="VAT Type" />
        <div className={scss.vatTypes}>
          {options.map((option) => (
            <label
              key={option.value}
              className={scss.vatOption + (salesObj.vat_type === option.value ? ' ' + scss.checked : '')}
            >
              <Image src={'/svgs/' + option.icon} alt={option.label} width={28} height={28} unoptimized />
              <div>
                <strong>{option.label}</strong>
                <p>{option.description}</p>
              </div>
              <input
                type="checkbox"
                name="vat_type"
                onKeyUp={handleBlur}
                value={option.value}
                checked={salesObj.vat_type === option.value}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>
        {sales.salesErr.vat_type && <p className={scss.errmsg} style={{ marginTop: '-10px', marginBottom: '14px' }}>{sales.salesErr.vat_type}</p>}

        <SectionHeader title="Sales Breakdown" />
        <div className={scss.fieldGrid}>
          <WizardField span={3} label="Exempt Sales" htmlFor="exempt_sales" required err={sales.salesErr.exempt_sales as string}>
            <input
              type="text"
              maxLength={20}
              id="exempt_sales"
              autoComplete="off"
              placeholder="0.00"
              name="exempt_sales"
              value={salesObj.exempt_sales}
              onKeyUp={handleBlur}
              onChange={handleChange}
            />
          </WizardField>
          <WizardField span={3} label="Zero Rated Sales" htmlFor="zero_rated_sales" required err={sales.salesErr.zero_rated_sales as string}>
            <input
              type="text"
              maxLength={20}
              autoComplete="off"
              placeholder="0.00"
              id="zero_rated_sales"
              name="zero_rated_sales"
              value={salesObj.zero_rated_sales}
              onKeyUp={handleBlur}
              onChange={handleChange}
            />
          </WizardField>
          <WizardField span={3} label="Vatable Sales" htmlFor="vatable_sales" required err={sales.salesErr.vatable_sales as string}>
            <input
              type="text"
              maxLength={20}
              autoComplete="off"
              id="vatable_sales"
              name="vatable_sales"
              placeholder="0.00"
              value={salesObj.vatable_sales}
              readOnly={salesObj.vat_type === 'INCLUSIVE'}
              onKeyUp={handleBlur}
              onChange={handleChange}
            />
          </WizardField>
          <WizardField span={3} label="Gross Amount" htmlFor="gross_amount" required err={sales.salesErr.gross_amount as string}>
            <input
              readOnly
              type="text"
              maxLength={20}
              id="gross_amount"
              autoComplete="off"
              placeholder="0.00"
              name="gross_amount"
              value={salesObj.gross_amount}
              onChange={handleChange}
            />
          </WizardField>
        </div>

        <div className={scss.fieldGrid}>
          <WizardField span={3} label="VAT Rate" htmlFor="vat_rate" required err={sales.salesErr.vat_rate as string}>
            <input
              readOnly
              type="text"
              id="vat_rate"
              maxLength={20}
              name="vat_rate"
              placeholder="12%"
              autoComplete="off"
              value={salesObj.vat_rate}
              onChange={handleChange}
            />
          </WizardField>
          <WizardField span={3} label="VAT Amount" htmlFor="vat_amount" required err={sales.salesErr.vat_amount as string}>
            <input
              readOnly
              type="text"
              maxLength={20}
              id="vat_amount"
              name="vat_amount"
              autoComplete="off"
              placeholder="0.00"
              value={salesObj.vat_amount}
              onChange={handleChange}
            />
          </WizardField>
          <WizardField span={3} label="Gross Taxable" htmlFor="gross_taxable" required err={sales.salesErr.gross_taxable as string}>
            <input
              type="text"
              maxLength={20}
              placeholder="0.00"
              autoComplete="off"
              id="gross_taxable"
              name="gross_taxable"
              value={salesObj.gross_taxable}
              readOnly={salesObj.vat_type === 'EXCLUSIVE'}
              onKeyUp={handleBlur}
              onChange={handleChange}
            />
          </WizardField>
          <WizardField span={3} label="Total Gross Amount" htmlFor="total_gross_amount" required err={sales.salesErr.total_gross_amount as string}>
            <input
              readOnly
              type="text"
              maxLength={20}
              placeholder="0.00"
              autoComplete="off"
              id="total_gross_amount"
              name="total_gross_amount"
              value={salesObj.total_gross_amount}
              onChange={handleChange}
            />
          </WizardField>
        </div>

        {!!discountLabel && (
          <>
            <hr className={scss.divider} />
            <SectionHeader title="Discount" />
            <div className={scss.fieldGrid}>
              <WizardField span={4} label="Discount Type">
                <input readOnly type="text" value={discountLabel} />
              </WizardField>
              <WizardField span={4} label="Discount Rate">
                <input readOnly type="text" value={salesObj.discount_rate || ''} />
              </WizardField>
              <WizardField span={4} label="Discount Amount">
                <input readOnly type="text" placeholder="0.00" value={salesObj.discount_amount || ''} />
              </WizardField>
            </div>
          </>
        )}

        <hr className={scss.divider} />

        <SectionHeader
          title="Withholding Tax"
          action={
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 'normal', textTransform: 'none' }}>
              <input
                type="checkbox"
                checked={hasWithholding}
                onChange={(e) => handleToggleWithholding(e.target.checked)}
              />
              Customer is a withholding agent
            </label>
          }
        />
        {hasWithholding ? (
          <div className={scss.fieldGrid}>
            <WizardField span={4} label="ATC" htmlFor="atc" required err={sales.salesErr.atc as string}>
              <input
                id="atc"
                name="atc"
                type="text"
                maxLength={10}
                autoComplete="off"
                onKeyUp={handleBlur}
                onChange={handleChange}
                value={salesObj.atc}
              />
            </WizardField>
            <WizardField span={4} label="Withholding Tax Rate" htmlFor="ewt_rate" required err={sales.salesErr.ewt_rate as string}>
              <input
                type="text"
                maxLength={20}
                autoComplete="off"
                id="ewt_rate"
                name="ewt_rate"
                value={salesObj.ewt_rate}
                onKeyUp={handleBlur}
                onChange={handleChange}
              />
            </WizardField>
            <WizardField span={4} label="Withholding Tax Amount" htmlFor="tax_amount">
              <input
                readOnly
                type="text"
                maxLength={20}
                id="tax_amount"
                name="tax_amount"
                autoComplete="off"
                placeholder="0.00"
                value={salesObj.tax_amount}
                onChange={handleChange}
              />
            </WizardField>
            <p style={{ color: 'var(--darkgray, #6b7280)', fontSize: 12, gridColumn: '1 / -1', marginTop: -8 }}>
              Withholding tax doesn't reduce the sale itself — Total Gross Amount above still reflects the
              full invoiced price for VAT/Sales Book purposes. It's deducted in Total Amount Due below, since
              the buyer remits the withheld amount to the BIR directly; you'll get it back as a tax credit
              via the buyer's Form 2307.
            </p>
          </div>
        ) : (
          <p style={{ color: 'var(--darkgray, #6b7280)', fontSize: 12, marginTop: -8 }}>
            Withholding tax only applies when the customer withholds on their purchases
            (government agencies, top withholding agents, large taxpayers). Not applicable
            for an ordinary sale.
          </p>
        )}

        <hr className={scss.divider} />

        {/* Every BIR-compliant invoice ends in a final Amount Due line —
            Total Gross Amount, less any discount, less any withholding —
            so this always renders, not just when a discount/withholding
            is actually present (it simply equals Total Gross Amount then). */}
        <div className={scss.fieldGrid}>
          <WizardField span={12} label="Total Amount Due">
            <input readOnly type="text" placeholder="0.00" value={salesObj.net_amount_due || ''} />
          </WizardField>
        </div>
      </div>
    </>
  )
}

export default TaxDetailsStep
