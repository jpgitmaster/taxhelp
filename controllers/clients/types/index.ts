interface ClientObj{
  tin: string
  email: string
  period: string
  rdo_code: string
  month_end: string
  created_at?: Date
  id: number | null
  last_name: string
  trade_name: string
  first_name: string
  middle_name: string
  branch_code: string
  description: string
  phone_number: string
  first_address: string
  second_address: string
  classification: string
  registered_name: string
  business_nature: string
  representative_email: string
  representative_phone: string
  representative_last_name: string
  representative_first_name: string
  representative_middle_name: string
  representative?: {
    email: string
    phone_number: string
    last_name: string
    first_name: string
    middle_name: string
  }
}

type ClientErr = {
  tin: string;
  email: string;
  phone: string;
  fiscal: string;
  last_name: string;
  first_name: string;
  branch_code: string;
  middle_name: string;
  first_address: string
  second_address: string
  registered_name: string;
  corporate_email: string;
};

interface Client{
    clientObj: ClientObj
    clientArr: ClientObj[]
    totalClients: number
    representative?: {
      email: string
      phone_number: string
      last_name: string
      first_name: string
      middle_name: string
    }
    clientErr: Record<string, string | { value: string; }>
}

interface ClientTableRow {
  id: number | null;
  tin: string
  period: string
  rdo_code: string
  month_end: string
  trade_name: string
  created_at: string
  taxpayer_name: string
  first_address: string
  second_address: string
  classification: string
  registered_name: string
  representative_name: string
}
export type {
    Client,
    ClientErr,
    ClientObj,
    ClientTableRow
}