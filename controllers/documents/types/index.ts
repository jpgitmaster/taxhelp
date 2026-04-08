interface DocObj{
  id: number | null
  file_name: string
  created_at: Date | null
  has_sales: boolean | null
  has_purchases: boolean | null
}

interface Doc{
    docObj: DocObj
    docArr: DocObj[]
    totalDocs: number
    docErr: Record<string, string | { value: string; }>
}

type ExcelRow = {
  taxableMonth: string
  invoiceDate: string
  invoiceNumber: string
  tin: string
  branchCode: string
  registeredName: string
  lastName: string
  firstName: string
  middleName: string
  address1: string
  address2: string
  particulars: string
  terms: string
  accountName: string
  grossAmount: number
  exemptSales: number
  zeroRatedSales: number
  vatableSales: number
  vatRate: number
  vatAmount: number
  grossTaxable: number
  atc: string
  ewtRate: number
  taxAmount: number

  // Optional purchase fields
  vatableServices?: number
  vatableCapital?: number
  vatableGoods?: number
}
export type {
    Doc,
    DocObj,
    ExcelRow,
}