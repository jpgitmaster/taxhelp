import { ReactNode } from "react"

interface Status {
    loader: boolean
    message: string | ReactNode
    submessage: string
}
interface ErrorItem{
    field: string
    message: string
    submessage: string
};
export type {
    Status,
    ErrorItem
}