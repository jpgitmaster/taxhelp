import { Dayjs } from 'dayjs';
interface SalesObj{
    atc: string
    terms: string
    vat_type: string
    ewt_rate: string
    vat_rate: string
    id: number | null
    toDelete: boolean
    tax_amount: string
    vat_amount: string
    particulars: string
    account_name: string
    gross_amount: string
    exempt_sales: string
    invoice_date: string
    gross_taxable: string
    vatable_sales: string
    invoice_number: string
    zero_rated_sales: string
    total_gross_amount: string
    taxable_month: Dayjs | null
    business_profile: {
        tin: string
        trade_name: string
        last_name: string
        first_name: string
        middle_name: string
        branch_code: string
        first_address: string
        second_address: string
        registered_name: string
        classification: string
    }
}

interface Sales{
    salesObj: SalesObj
    salesArr: SalesObj[]
    totalSales: number
    salesErr: Record<string, string | { value: string; }>
}

interface SalesTableRow {
  id: number | null
  toDelete: boolean
  invoice_date: string
  taxable_month: string
  invoice_number: string
}

export type {
    Sales,
    SalesObj,
    SalesTableRow
}