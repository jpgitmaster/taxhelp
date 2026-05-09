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
  grossAmount: number
  
  exemptSales?: number
  zeroRatedSales?: number
  vatableSales?: number

  exemptPurchases?: number
  vatablePurchases?: number
  zeroRatedPurchases?: number
  vatablePurchaseServices?: number
  vatablePurchaseCapitalGoods?: number
  vatablePurchaseCapitalGoodsOther?: number

  vatRate: number
  vatAmount: number
  grossTaxable: number

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