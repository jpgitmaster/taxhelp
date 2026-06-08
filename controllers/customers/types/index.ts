interface CustomerObj{
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

type CustomerErr = {
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

interface Customer{
    customerObj: CustomerObj
    customerArr: CustomerObj[]
    totalCustomers: number
    customerErr: Record<string, string | { value: string; }>
}

type CustomerRow = {
  id: number | null
  tin: string
  email: string
  phone: string
  trade_name: string
  created_at: string
  customer_name: string
  first_address: string
  second_address: string
  classification: string
  registered_name: string
}

export type {
    Customer,
    CustomerErr,
    CustomerObj,
    CustomerRow,
}