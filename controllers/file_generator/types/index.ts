import { Dayjs } from "dayjs";

interface Record_Obj{
    id: number | null
    // terms: string
    toDelete: boolean
    taxable_month: Dayjs | null

    // particulars: string
    // account_name: string
    // invoice_date: Dayjs | null
    gross_amount?: string
    vat_rate?: string
    vat_amount?: string
    gross_taxable?: string

    // SALES
    exempt_sales?: string
    vatable_sales?: string
    zero_rated_sales?: string
    
    // PURCHASES
    exempt_purchases?: string
    vatable_purchases?: string
    zero_rated_purchases?: string
    vatable_purchase_of_services?: string
    vatable_purchase_of_capital_goods?: string
    vatable_purchase_of_other_goods?: string

    // QAP
    atc_code?: string
    tax_rate?: string
    income_payment?: string

    customer?: {
        tin?: string
        name?: string
        last_name?: string
        first_name?: string
        middle_name?: string
        branch_code?: string
        first_address?: string
        second_address?: string
        registered_name?: string
    }
    supplier?: {
        tin?: string
        name?: string
        last_name?: string
        first_name?: string
        middle_name?: string
        branch_code?: string
        first_address?: string
        second_address?: string
        registered_name?: string
    }
}

type Record_Err = {
    
};

interface Record_{
    recordObj: Record_Obj
    recordArr: Record_Obj[]
    totalRecords: number
    recordErr: Record<string, string | { value: string; }>
}

interface Record_TableRow {
  id: number | null;
}
export type {
    Record_,
    Record_Err,
    Record_Obj,
    Record_TableRow
}