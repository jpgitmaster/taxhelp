import { Dayjs } from 'dayjs';
import useSalesAPI from "./api";
import { useRouter } from 'next/router';
import useClientAPI from '../clients/api';
import useDocumentAPI from '../documents/api';
import useGlobal from '@/controllers/global/useGlobal'
import { AppliedDoc, DocState, SalesObj } from './types';
import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";

const useSales = () => {
    const router = useRouter()
    const {
        handleBlur,
        handleResubmit
    } = useGlobal()
    const {
        sales,
        status,
        filter: salesFilter,

        setSales,
        setStatus,
        setFilter: salesSetFilter,

        useGetSales,
        useDeleteSalesRecord
    } = useSalesAPI()

    const {
        filter: clientFilter,
        setFilter: clientSetFilter,

        useGetClients
    } = useClientAPI()

    const {
        filter: documentFilter,
        // setFilter: documentSetFilter,

        useGetDocument,
        useGetDocuments
    } = useDocumentAPI()
    const { documentID } = router.query
    const [tableWidth, setTableWidth] = useState(0)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocuments, setDisplayDocuments] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys as number[])
        },
    }
    const [appliedDoc, setAppliedDoc] = useState<AppliedDoc>({
        client: { id: null },
        document: { id: null },
        tax_month_end: null,
        tax_month_start: null,
        invoice_date_end: null,
        invoice_date_start: null,
        created_date_end: null,
        created_date_start: null
    })
    const [doc, setDoc] = useState<DocState>({
        search: '',
        hasSelectedClient: false,
        hasSelectedDocument: false,
        client: {
            id: null,
            last_name: '',
            first_name: '',
            trade_name: '',
            registered_name: '',
        },
        document: {
            id: null,
            file_name: ''
        },
        tax_month_end: null,
        tax_month_start: null,
        invoice_date_end: null,
        invoice_date_start: null,
        created_date_end: null,
        created_date_start: null
    })

    const { data: dataDocuments, isLoading: isLoadingDocuments, isFetching: isFetchingDocuments } = useGetDocuments(
        documentFilter.currentPage,
        documentFilter.recordsLimit,
        documentFilter.filter,
        documentFilter.search
    )

    const { data: dataDocument } = useGetDocument(
        Number(documentID)
    )
    const { data: dataSales, isLoading: isLoadingSales, isFetching: isFetchingSales } = useGetSales(
        salesFilter.currentPage,
        salesFilter.recordsLimit,
        salesFilter.filter,
        salesFilter.search,
        appliedDoc
    )

    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = useGetClients(    
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )

    const clientArr = dataClients?.clients;
    const documentArr = dataDocuments?.documents; 

    const handleSubmitSearch = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
    }
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        salesSetFilter({
            ...salesFilter,
            [name]: value
        })
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        if(name === 'search'){
            clientSetFilter(prev => ({
                ...prev,
                search: value,
                currentPage: 1
            }))
        }
        setDoc({
            ...doc,
            [name]: value
        })
    }
    const handleSelectClient = (client: {
        id: number | null,
        last_name: string
        first_name: string
        trade_name: string
        registered_name: string
    }) => {
        if (appliedDoc.client.id === client.id) return // ✅ prevent refetch
        const updatedDoc = {
            ...doc,
            client,
            hasSelectedClient: true
        }

        setDoc(updatedDoc)

        // 👇 apply immediately
        setAppliedDoc(prev => ({
            ...prev,
            client: {
                id: client.id
            }
        }))

        salesSetFilter(prev => ({
            ...prev,
            currentPage: 1,
        }))
    }
    const handleClearSelected = (dropdown: string) => {
        if (dropdown === 'client') {
            setDoc(prev => ({
                ...prev,
                client: {
                    id: null,
                    last_name: '',
                    first_name: '',
                    trade_name: '',
                    registered_name: '',
                },
                hasSelectedClient: false
            }))

            // 👇 IMPORTANT: trigger refetch
            setAppliedDoc(prev => ({
                ...prev,
                client: { id: null }
            }))

            setDisplayClients(false)
        }

        if (dropdown === 'document') {
            setDoc(prev => ({
                ...prev,
                document: {
                    id: null,
                    file_name: ''
                },
                hasSelectedDocument: false
            }))

            // 👇 IMPORTANT: trigger refetch
            setAppliedDoc(prev => ({
                ...prev,
                document: { id: null }
            }))

            setDisplayDocuments(false)
        }

        salesSetFilter(prev => ({
            ...prev,
            currentPage: 1,
        }))
    }

    const handleDeleteRecord = (id: number) => {
        setStatus({...status, loader: true})
        useDeleteSalesRecord.mutate(id)
    }

    const handleSelectDocument = (document: {
        id: number | null,
        file_name: string
    }) => {
        const updatedDoc = {
            ...doc,
            document,
            hasSelectedDocument: true
        }

        setDoc(updatedDoc)

        // 👇 apply immediately
        setAppliedDoc(prev => ({
            ...prev,
            document: {
                id: document.id
            }
        }))

        salesSetFilter(prev => ({
            ...prev,
            currentPage: 1,
        }))
    }
    const handleToggleDelete = (id: number) => {
        const { salesArr } = sales
        const newSalesArr = salesArr?.map((sales_) => sales_.id == id ? {
            ...sales_,
            toDelete: !sales_.toDelete
        } : {
            ...sales_,
            toDelete: false,
        })
        setSales({
            ...sales,
            salesArr: newSalesArr as SalesObj[]
        })
    }
    const handleToggle = (dropdown: string) => {
        if(dropdown === 'clients'){
            setDisplayClients(prevState => !prevState)
        }
        if(dropdown === 'documents'){
            setDisplayDocuments(prevState => !prevState)
        }
    }
    const handleDateChange = (date: Dayjs | null, name: string) => {
        const updatedDoc = {
            ...doc,
            [name]: date
        }

        // reset paired fields
        if (name === 'tax_month_start') updatedDoc.tax_month_end = null
        if (name === 'invoice_date_start') updatedDoc.invoice_date_end = null
        if (name === 'created_date_start') updatedDoc.created_date_end = null

        setDoc(updatedDoc)

        // ---- helpers
        const isPairValid = (start: any, end: any) =>
            (!!start && !!end) || (!start && !end)

        const taxValid = isPairValid(updatedDoc.tax_month_start, updatedDoc.tax_month_end)
        const invoiceValid = isPairValid(updatedDoc.invoice_date_start, updatedDoc.invoice_date_end)
        const createdValid = isPairValid(updatedDoc.created_date_start, updatedDoc.created_date_end)

        // ❗ Only apply filters if ALL groups are in valid state
        if (taxValid && invoiceValid && createdValid) {
            setAppliedDoc(prev => ({
                ...prev,
                tax_month_start: updatedDoc.tax_month_start,
                tax_month_end: updatedDoc.tax_month_end,

                invoice_date_start: updatedDoc.invoice_date_start,
                invoice_date_end: updatedDoc.invoice_date_end,

                created_date_start: updatedDoc.created_date_start,
                created_date_end: updatedDoc.created_date_end,
            }))
        }
        salesSetFilter(prev => ({
            ...prev,
            currentPage: 1
        }))
    }
    const handlePageChange = (current: number) => {
        salesSetFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    useEffect(() => {
        setSales(prev => ({
            ...prev,
            salesArr: dataSales?.sales?.map((sales_: SalesObj[]) => ({
                        ...sales_,
                        toDelete: false
                    })) || [],
            totalSales: dataSales?.totalSales || 0
        }))
    }, [dataSales])

    useEffect(() => {
        if(dataDocument?.data){
            const { file } = dataDocument.data
            if(file){
                setDoc(prev => ({
                    ...prev,
                    hasSelectedClient: true,
                    hasSelectedDocument: true,
                    document: {
                        id: file.id,
                        file_name: file.file_name
                    },
                    client: {
                        id: file.client?.id,
                        last_name: file.client?.last_name,
                        first_name: file.client?.first_name,
                        trade_name: file.client?.trade_name,
                        registered_name: file.client?.registered_name,
                    }
                }))

                // 👇 apply immediately
                setAppliedDoc(prev => ({
                    ...prev,
                    document: {
                        id: file.id
                    }
                }))
            }
        }else{
            setDoc(prev => ({
                ...prev,
                hasSelectedClient: false,
                hasSelectedDocument: false,
                document: {
                    id: null,
                    file_name: ''
                },
                client: {
                    id: null,
                    last_name: '',
                    first_name: '',
                    trade_name: '',
                    registered_name: '',
                }
            }))
            setAppliedDoc(prev => ({
                ...prev,
                document: {
                    id: null
                }
            }))
        }
    }, [dataDocument?.data])
    useEffect(() => {
        if(typeof window !== 'undefined'){
            setTableWidth(window.innerWidth - 220)
        }

        const successMessage = sessionStorage.getItem('successMessage');
        if (successMessage) {
            setStatus(prev => ({
                ...prev,
                message: successMessage
            }))

            setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    message: ''
                }))
                sessionStorage.removeItem('successMessage')
            }, 5000)
        }
    },[])

    return {
        // STATES
        doc,
        sales,
        status,
        clientArr,
        tableWidth,
        documentArr,
        salesFilter,
        rowSelection,
        displayClients,
        selectedRowKeys,
        displayDocuments,
        clientLoader: isLoadingClients || isFetchingClients,
        documentLoader: isLoadingDocuments || isFetchingDocuments,
        salesloader: isLoadingSales || isFetchingSales || status.loader,

        // SET STATES
        setDisplayClients,
        setDisplayDocuments,
        

        // HANDLES
        handleBlur,
        handleChange,
        handleToggle,
        handleSearch,
        handleResubmit,
        handleDateChange,
        handlePageChange,
        handleToggleDelete,
        handleSelectClient,
        handleDeleteRecord,
        handleSubmitSearch,
        handleClearSelected,
        handleSelectDocument,
    }
}

export default useSales;