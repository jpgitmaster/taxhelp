interface Status {
    loader: boolean
    message: string
}
interface ErrorItem{
    field: string
    message: string
};
export type {
    Status,
    ErrorItem
}