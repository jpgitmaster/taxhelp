interface DocObj{
  id: number | null
  file_name: string
  created_at: Date | null
  has_sales: boolean | null
  has_purchases: boolean | null
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
  created_at: Date | null
  has_sales: boolean | null
  has_purchases: boolean | null
  last_name: string
  first_name: string
  trade_name: string
  registered_name: string
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
  businessOwner: string
  address1: string
  address2: string
  gross_amount: number
  
  exempt_sales?: number
  zero_rated_sales?: number
  vatable_sales?: number

  exempt_purchases?: number
  vatable_purchases?: number
  zero_rated_purchases?: number
  vatable_purchase_of_services?: number
  vatable_purchase_of_capital_goods?: number
  vatable_purchase_of_other_goods?: number

  vatRate: number
  vat_amount: number
  gross_taxable: number

  // Optional purchase fields
  vatableServices?: number
  vatableCapital?: number
  vatableGoods?: number
}
export type {
    Doc,
    DocObj,
    TableRow,
    ExcelRow,
}