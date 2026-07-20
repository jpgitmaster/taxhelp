interface DocObj{
  id: number | null
  file_name: string
  created_at: Date | null
  has_sales: boolean | null
  has_purchases: boolean | null
  has_sales_taxes: boolean | null
  has_purchase_taxes: boolean | null
  client: {
    last_name: string
    first_name: string
    trade_name: string
    registered_name: string
  }
}

interface TableRow{
  id: number | null
  file_name: string
  last_name: string
  first_name: string
  trade_name: string
  registered_name: string
  created_at: Date | null
  has_sales: boolean | null
  has_purchases: boolean | null
  has_sales_taxes: boolean | null
  has_purchase_taxes: boolean | null
}

interface Doc{
    docObj: DocObj
    docArr: DocObj[]
    totalDocs: number
    docErr: Record<string, string | { value: string; }>
}

type ExcelRow = {
  taxableMonth: string
  tin: string
  branchCode: string
  registeredName: string
  individualName: string
  address1: string
  address2: string

  gross_amount?: number

  exempt_sales?: number
  zero_rated_sales?: number
  vatable_sales?: number

  exempt_purchases?: number
  vatable_purchases?: number
  zero_rated_purchases?: number
  vatable_purchase_of_services?: number
  vatable_purchase_of_capital_goods?: number
  vatable_purchase_of_other_goods?: number

  vat_rate?: number
  vat_amount?: number
  gross_taxable?: number

  vatableServices?: number
  vatableCapital?: number
  vatableGoods?: number

  atc_code?: string
  tax_rate?: number
  tax_amount?: number
  income_payment?: number
}
export type {
    Doc,
    DocObj,
    TableRow,
    ExcelRow,
}