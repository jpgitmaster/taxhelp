import { Dayjs } from "dayjs";

interface Record_Obj{
    id: number | null
    // terms: string
    toDelete: boolean
    // particulars: string
    // account_name: string
    // invoice_date: Dayjs | null
    taxable_month: Dayjs | null
    customer?: {
        tin?: string
        name?: string
        last_name?: string
        first_name?: string
        middle_name?: string
        branch_code?: string
        registered_name?: string
    }
    supplier?: {
        tin?: string
        name?: string
        last_name?: string
        first_name?: string
        middle_name?: string
        branch_code?: string
        registered_name?: string
    }
}

type Record_Err = {
    
};

interface Record_{
    recordObj: Record_Obj
    recordArr: Record_Obj[]
    totalRecords: number
    recordErr: Record<string, string | { value: string; }>
}

interface Record_TableRow {
  id: number | null;
}
export type {
    Record_,
    Record_Err,
    Record_Obj,
    Record_TableRow
}