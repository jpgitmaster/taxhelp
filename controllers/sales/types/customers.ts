interface CustomersObj{
    id: number | null
    last_name: string
    first_name: string
    trade_name: string
    registered_name: string
}

interface Customers{
    customersObj: CustomersObj
    customersArr: CustomersObj[]
    totalSales: number
    customersErr: Record<string, string | { value: string; }>
}


export type {
    Customers,
    CustomersObj,
}