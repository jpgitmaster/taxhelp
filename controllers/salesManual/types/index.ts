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

interface DraftParticularPayload {
    description?: string
    quantity?: number | string
    unit_price?: number | string
    amount?: number | string
}

/** Every field optional — used for autosave/finalize partial PATCH bodies. */
type SalesManualDraftPayload = Partial<Omit<SalesManualCreatePayload, 'particulars' | 'client_id'>> & {
    particulars?: DraftParticularPayload[]
}

interface SalesManualRecord extends Partial<Omit<SalesManualCreatePayload, 'particulars'>> {
    id: number
    client_id: number
    customer_id: number | null
    status: 'draft' | 'posted'
    locked_by_user_id: number | null
    locked_by_name: string | null
    locked_at: string | null
    lock_is_mine: boolean
    tax_amount: number | string
    vat_amount: number | string
    vat_rate: number | string
    gross_amount: number | string
    total_gross_amount: number | string
    particulars: DraftParticularPayload[]
    is_active: boolean
    customer: Record<string, unknown> | null
    created_at: string | null
    updated_at: string | null
}

export type {
    Particular,
    SalesManualCreatePayload,
    SalesManualDraftPayload,
    SalesManualRecord,
    DraftParticularPayload,
}
