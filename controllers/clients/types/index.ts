interface ClientObj{
  email: string
  id: number | null
  last_name: string
  first_name: string
  middle_name: string
  registered_name: string
}

interface Client{
    clientObj: ClientObj
    clientArr: ClientObj[]
    totalClients: number
    clientErr: Record<string, string | { value: string; }>
}

export type {
    Client,
    ClientObj,
}