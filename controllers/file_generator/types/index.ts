import { Dayjs } from "dayjs";

interface Record_Obj {
    id: number | null

    toDelete: boolean

    taxable_month: Dayjs | string | null

    // COMMON DISPLAY FIELDS
    tin?: string
    branch_code?: string
    registered_name?: string
    first_address?: string
    second_address?: string
    name?: string

    // VAT COMMON
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

    vatable_services?: string

    vatable_purchase_of_services?: string
    vatable_purchase_of_capital_goods?: string
    vatable_purchase_of_other_goods?: string

    // QAP / SAWT
    atc_code?: string
    tax_rate?: string
    tax_amount?: string
    income_payment?: string

    // IMPORTATION
    import_entry_no?: string
    assessment_release_date?: string
    seller_name?: string
    importation_date?: string
    country_origin?: string

    total_landed_cost?: string
    dutiable_value?: string
    charges?: string
    taxable_imports?: string
    exempt_imports?: string

    or_number?: string
    vat_payment_date?: string

    // TABLE DISPLAY IMPORTATION
    importEntryNo?: string
    assessmentReleaseDate?: string
    sellerName?: string
    importationDate?: string
    countryOrigin?: string

    totalLandedCost?: string
    dutiableValue?: string
    taxableImports?: string
    exemptImports?: string

    vatRate?: string
    vatAmount?: string

    orNumber?: string
    vatPaymentDate?: string

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

interface Record_ {
    recordObj: Record_Obj
    recordArr: Record_Obj[]
    totalRecords: number
    recordErr: Record<string, string | { value: string }>
}

interface Record_TableRow {
    id: number | null
}

export type {
    Record_,
    Record_Err,
    Record_Obj,
    Record_TableRow
}