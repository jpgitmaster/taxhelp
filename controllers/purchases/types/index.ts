interface PurchasesObj{
    atc: string
    terms: string
    id: number | null
    toDelete: boolean
    vat_rate: string | number
    vat_amount: string | number
    particulars: string
    invoice_date: string
    account_name: string
    gross_amount: string | number
    gross_taxable: string | number
    taxable_month: string
    invoice_number: string
    exempt_purchases: string | number
    vatable_purchases: string | number
    zero_rated_purchases: string | number
    vatable_purchase_of_services: string | number
    vatable_purchase_of_other_goods: string | number
    vatable_purchase_of_capital_goods: string | number
    supplier: {
        tin: string
        last_name: string
        first_name: string
        middle_name: string
        branch_code: string
        first_address: string
        second_address: string
        registered_name: string
    }
}

interface Purchases{
    purchasesObj: PurchasesObj
    purchasesArr: PurchasesObj[]
    totalPurchases: number
    purchasesErr: Record<string, string | { value: string; }>
}

interface PurchasesTableRow {
  id: number | null
  toDelete: boolean
}

export type {
    Purchases,
    PurchasesObj,
    PurchasesTableRow
}