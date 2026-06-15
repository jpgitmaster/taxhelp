interface CustomerObj{
  tin: string
  email: string
  created_at?: Date
  id: number | null
  last_name: string
  trade_name: string
  first_name: string
  middle_name: string
  postal_code: string
  phone_number: string
  first_address: string
  second_address: string
  classification: string
  registered_name: string
}

type CustomerErr = {
  tin: string
  email: string
  last_name: string
  trade_name: string
  first_name: string
  middle_name: string
  phone_number: string
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
  trade_name: string
  created_at: string
  phone_number: string
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