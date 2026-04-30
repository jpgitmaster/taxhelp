interface SupplierObj{
  tin: string
  email: string
  created_at?: Date
  id: number | null
  last_name: string
  trade_name: string
  first_name: string
  middle_name: string
  classification: string
  registered_name: string
}

type SupplierErr = {
  tin: string
  email: string
  last_name: string
  trade_name: string
  first_name: string
  middle_name: string
  classification: string
  registered_name: string
};

interface Supplier{
    supplierObj: SupplierObj
    supplierArr: SupplierObj[]
    totalSuppliers: number
    supplierErr: Record<string, string | { value: string; }>
}

type SupplierRow = {
  id: number | null
  tin: string
  trade_name: string
  created_at: string
  supplier_name: string
  classification: string
  registered_name: string
}

export type {
    Supplier,
    SupplierErr,
    SupplierObj,
    SupplierRow,
}