interface SupplierObj{
  tin: string
  city: string
  email: string
  phone: string
  street: string
  zip_code: string
  district: string
  barangay: string
  created_at?: Date
  id: number | null
  last_name: string
  trade_name: string
  first_name: string
  sub_street: string
  middle_name: string
  classification: string
  registered_name: string
}

type SupplierErr = {
  tin: string
  city: string
  email: string
  phone: string
  street: string
  zip_code: string
  district: string
  barangay: string
  last_name: string
  trade_name: string
  first_name: string
  sub_street: string
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
  city: string
  email: string
  phone: string
  street: string
  zip_code: string
  district: string
  barangay: string
  trade_name: string
  created_at: string
  sub_street: string
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