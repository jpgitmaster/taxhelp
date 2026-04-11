import { Dayjs } from "dayjs";

interface Record_Obj{
    id: number | null
    account_name: string
    invoice_date: Dayjs
    taxable_month: Dayjs
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