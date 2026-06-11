import { Dayjs } from 'dayjs';
import { CustomerObj } from '@/controllers/customers/types'
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
    customer: CustomerObj
    invoice_number: string
    zero_rated_sales: string
    total_gross_amount: string
    created_at?: Dayjs | null
    taxable_month: Dayjs | null
}
type SalesErr = {
    client: string
    customer: string
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

type AppliedDoc = {
    client: {
        id: number | null
    }
    document: {
        id: number | null
    }
    tax_month_end: Dayjs | null
    tax_month_start: Dayjs | null
    invoice_date_end: Dayjs | null
    invoice_date_start: Dayjs | null
    created_date_end: Dayjs | null
    created_date_start: Dayjs | null
}

type DocState = {
    search: string
    docSearch: string
    clientSearch: string
    hasSelectedClient: boolean
    hasSelectedDocument: boolean
    client: {
        id: number | null
        last_name: string
        first_name: string
        trade_name: string
        registered_name: string
    }
    document: {
        id: number | null
        file_name: string
    }
    tax_month_end: Dayjs | null
    tax_month_start: Dayjs | null
    invoice_date_end: Dayjs |null
    invoice_date_start: Dayjs | null
    created_date_end: Dayjs | null
    created_date_start: Dayjs | null
}

export type {
    Sales,
    SalesObj,
    DocState,
    SalesErr,
    AppliedDoc,
    SalesTableRow,
}