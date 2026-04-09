interface ClientObj{
  tin: string
  city: string
  email: string
  phone: string
  fiscal: string
  street: string
  zip_code: string
  district: string
  barangay: string
  created_at?: Date
  id: number | null
  last_name: string
  sub_street: string
  first_name: string
  middle_name: string
  branch_code: string
  classification: string
  corporate_email: string
  registered_name: string
}

type ClientErr = {
  tin: string;
  city: string;
  email: string;
  phone: string;
  street: string;
  fiscal: string;
  zip_code: string;
  district: string;
  barangay: string;
  last_name: string;
  sub_street: string;
  first_name: string;
  branch_code: string;
  middle_name: string;
  registered_name: string;
  corporate_email: string;
};

interface Client{
    clientObj: ClientObj
    clientArr: ClientObj[]
    totalClients: number
    clientErr: Record<string, string | { value: string; }>
}

interface ClientTableRow {
  id: number | null;
  tin: string;
  fiscal: string;
  created_at: string;
  branch_code: string;
  classification: string;
  registered_name: string;
  name: string;
  address: string;
}
export type {
    Client,
    ClientErr,
    ClientObj,
    ClientTableRow
}