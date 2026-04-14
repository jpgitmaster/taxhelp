interface SalesObj{
    atc: string
    terms: string
    ewt_rate: string
    vat_rate: string
    id: number | null
    tax_amount: string
    vat_amount: string
    particulars: string
    exempt_sales: string
    gross_amount: string
    account_name: string
    invoice_date: string
    gross_taxable: string
    vatable_sales: string
    taxable_month: string
    first_address: string
    invoice_number: string
    second_address: string
    zero_rated_sales: string
    business_profile: {
        tin: string
        branch_code: string
        last_name: string
        first_name: string
        middle_name: string
        registered_name: string
    }
}

type SalesErr = {
    
};

interface Sales{
    salesObj: SalesObj
    salesArr: SalesObj[]
    totalSales: number
    salesErr: Record<string, string | { value: string; }>
}

interface SalesTableRow {
  id: number | null
  invoice_date: string
  taxable_month: string
  invoice_number: string
}

export type {
    Sales,
    SalesErr,
    SalesObj,
    SalesTableRow
}