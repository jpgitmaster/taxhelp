interface PurchasesObj{
    atc: string
    terms: string
    vat_rate: string
    wtax_rate: string
    id: number | null
    vat_amount: string
    wtax_amount: string
    particulars: string
    invoice_date: string
    account_name: string
    gross_amount: string
    gross_taxable: string
    taxable_month: string
    invoice_number: string
    exempt_purchases: string
    vatable_purchases: string
    zero_rated_purchases: string
    vatable_purchase_of_services: string
    vatable_purchase_of_other_goods: string
    vatable_purchase_of_capital_goods: string
    business_profile: {
        tin: string
        branch_code: string
        last_name: string
        first_name: string
        middle_name: string
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
}

export type {
    Purchases,
    PurchasesObj,
    PurchasesTableRow
}