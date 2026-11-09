import { Particular } from '@/controllers/sales/types'

interface SalesManualCreatePayload {
    client_id: number

    tin: string
    classification: string
    registered_name?: string
    first_name?: string
    last_name?: string
    middle_name?: string
    trade_name?: string
    phone_number?: string
    email?: string
    first_address: string
    second_address: string
    postal_code?: string

    taxable_month: string
    invoice_date: string
    invoice_number: string
    terms: string
    account_name?: string

    atc?: string
    ewt_rate?: number

    discount_type?: string
    discount_id_number?: string

    vat_type: string
    exempt_sales: number
    zero_rated_sales: number
    vatable_sales: number
    gross_taxable: number

    particulars: {
        description: string
        quantity: number
        unit_price: number
        amount: number
    }[]
}

export type {
    Particular,
    SalesManualCreatePayload,
}
