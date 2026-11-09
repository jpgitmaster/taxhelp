import Image from 'next/image'
import { ChangeEvent, KeyboardEvent } from 'react'
import scss from './styles/Wizard.module.scss'
import WizardField from './WizardField'

interface VatOption {
  value: string
  label: string
  icon: string
  description: string
}

const TaxDetailsStep = (props: {
  sales: any
  options: VatOption[]
  handleBlur: (e: KeyboardEvent<HTMLInputElement>) => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}) => {
  const { sales, options, handleBlur, handleChange } = props

  return (
    <div className={scss.panel}>
      <div className={scss.panelTitle}>Tax Details</div>

      <div className={scss.sectionLabel}>VAT Type</div>
      <div className={scss.vatTypes}>
        {options.map((option) => (
          <label
            key={option.value}
            className={scss.vatOption + (sales.salesObj.vat_type === option.value ? ' ' + scss.checked : '')}
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
              checked={sales.salesObj.vat_type === option.value}
              onChange={handleChange}
            />
          </label>
        ))}
      </div>
      {sales.salesErr.vat_type && <p className={scss.errmsg} style={{ marginTop: '-10px', marginBottom: '14px' }}>{sales.salesErr.vat_type}</p>}

      <div className={scss.sectionLabel}>Sales Breakdown</div>
      <div className={scss.fieldGrid}>
        <WizardField span={3} label="Exempt Sales" htmlFor="exempt_sales" required err={sales.salesErr.exempt_sales as string}>
          <input
            type="text"
            maxLength={20}
            id="exempt_sales"
            autoComplete="off"
            placeholder="0.00"
            name="exempt_sales"
            value={sales.salesObj.exempt_sales}
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
            value={sales.salesObj.zero_rated_sales}
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
            value={sales.salesObj.vatable_sales}
            readOnly={sales.salesObj.vat_type === 'INCLUSIVE'}
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
            value={sales.salesObj.gross_amount}
            onChange={handleChange}
          />
        </WizardField>

        <WizardField span={3} label="VAT Rate" htmlFor="vat_rate" required err={sales.salesErr.vat_rate as string}>
          <input
            readOnly
            type="text"
            id="vat_rate"
            maxLength={20}
            name="vat_rate"
            placeholder="12%"
            autoComplete="off"
            value={sales.salesObj.vat_rate}
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
            value={sales.salesObj.vat_amount}
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
            value={sales.salesObj.gross_taxable}
            readOnly={sales.salesObj.vat_type === 'EXCLUSIVE'}
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
            value={sales.salesObj.total_gross_amount}
            onChange={handleChange}
          />
        </WizardField>
      </div>

      <div className={scss.sectionLabel}>Withholding Tax</div>
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
            value={sales.salesObj.atc}
          />
        </WizardField>
        <WizardField span={4} label="Withholding Tax Rate" htmlFor="ewt_rate" required err={sales.salesErr.ewt_rate as string}>
          <input
            type="text"
            maxLength={20}
            autoComplete="off"
            id="ewt_rate"
            name="ewt_rate"
            value={sales.salesObj.ewt_rate}
            onKeyUp={handleBlur}
            onChange={handleChange}
          />
        </WizardField>
        <WizardField span={4} label="Withholding Tax Amount" htmlFor="tax_amount" required err={sales.salesErr.tax_amount as string}>
          <input
            readOnly
            type="text"
            maxLength={20}
            id="tax_amount"
            name="tax_amount"
            autoComplete="off"
            placeholder="0.00"
            value={sales.salesObj.tax_amount}
            onChange={handleChange}
          />
        </WizardField>
      </div>
    </div>
  )
}

export default TaxDetailsStep
