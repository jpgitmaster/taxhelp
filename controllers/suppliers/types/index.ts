interface SupplierObj{
  tin: string
  email: string
  phone: string
  created_at?: Date
  id: number | null
  last_name: string
  trade_name: string
  first_name: string
  middle_name: string
  first_address: string
  second_address: string
  classification: string
  registered_name: string
}

type SupplierErr = {
  tin: string
  email: string
  phone: string
  last_name: string
  trade_name: string
  first_name: string
  middle_name: string
  first_address: string
  second_address: string
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
  email: string
  phone: string
  trade_name: string
  created_at: string
  supplier_name: string
  first_address: string
  second_address: string
  classification: string
  registered_name: string
}

export type {
    Supplier,
    SupplierErr,
    SupplierObj,
    SupplierRow,
}