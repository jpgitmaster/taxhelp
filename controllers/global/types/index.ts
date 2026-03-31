interface Status {
    loader: boolean
    message: string
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