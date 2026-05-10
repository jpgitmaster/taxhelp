import { Dayjs } from 'dayjs';
import { Record_Obj } from './types';
import useFileGeneratorAPI from './api';
import useClientAPI from '../clients/api';
import { useState, useEffect, ChangeEvent } from "react";

const useFileGenerator = () => {
    const {
        filter: clientFilter,
        setFilter: clientSetFilter,

        useGetClients
    } = useClientAPI()

    const {
        filter,
        record,
        status,

        setFilter,
        setRecord,
        setStatus,

        useGetSales,
        useGetPurchases,
        useGetSalesTaxes,

        useDeleteSalesRecord,
        downloadSalesMutation,
        useDeletePurchasesRecord,
        downloadPurchasesMutation,
        downloadSalesTaxesMutation,
        downloadPurchasesTaxesMutation
    } = useFileGeneratorAPI()
    const [tableWidth, setTableWidth] = useState(0)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocsTbl, setDisplayDocsTbl] = useState(false)
    
    const datFileOptions =[
        {
            label: 'SUMMARY LIST OF SALES (SLS)',
            value: 'SALES'
        },
        {
            label: 'SUMMARY LIST OF PURCHASES (SLP)',
            value: 'PURCHASES'
        },
        {
            label: 'IMPORTS TRANSACTION',
            value: 'IMPORTATION'
        },
        // PURCHASES
        {
            label: 'QUARTERLY ALPHALIST OF PAYEES (QAP)',
            value: 'QAP',
            children: [
                {
                    label: '1601EQ  Schedule 1',
                    value: '1601EQ',
                },
                {
                    label: '1601FQ Schedule 1',
                    value: '1601FQ',
                },
                {
                    label: '1604E Schedule 3',
                    value: '1604E',
                },
                {
                    label: '1604F Schedule 3',
                    value: '1604F',
                }
            ]
        },
        // SALES
        {
            label: 'SUMMARY ALPHALIST OF WITHHOLDING TAXES (SAWT)',
            value: 'SAWT',
            children: [
                {
                    label: '1700',
                    value: '1700',
                },
                {
                    label: '1701Q',
                    value: '1701Q',
                },
                {
                    label: '1701',
                    value: '1701',
                },
                {
                    label: '1702Q',
                    value: '1702Q',
                },
                {
                    label: '1702',
                    value: '1702',
                },
                {
                    label: '2550M',
                    value: '2550M',
                },
                {
                    label: '2550Q',
                    value: '2550Q',
                },
                {
                    label: '2551Q',
                    value: '2551Q',
                },
                {
                    label: '2553',
                    value: '2553',
                }
            ]
        },
        // COMING SOON
        {
            label: 'MONTHLY ALPHALIST OF PAYEES',
            value: 'MAP',
            children: [
                {
                    label: '1600VT',
                    value: '1600VT',
                },
                {
                    label: '1600PT',
                    value: '1600PT',
                },
            ]
        },
    ]
    const booksOfAccountsOptions =[
        {
            label: 'SALES JOURNAL (SJ)',
            value: 'SJ'
        },
        {
            label: 'PURCHASES JOURNAL (PJ)',
            value: 'PJ'
        },
        {
            label: 'CASH RECEIPTS JOURNAL (CRJ)',
            value: 'CRJ'
        },
        {
            label: 'CASH DISBURSEMENTS JOURNAL (CDJ)',
            value: 'CDJ'
        },
        {
            label: 'GENERAL JOURNAL (GJ)',
            value: 'GJ'
        },
        {
            label: 'GENERAL LEDGER (GL)',
            value: 'GL'
        },
        {
            label: 'TRIAL BALANCE (TB)',
            value: 'TB'
        },
    ]
    const [doc, setDoc] = useState<{
        search: string
        docSearch: string
        clientSearch: string
        hasSelectedClient: boolean
        hasSelectedDocument: boolean
        selectedTable: {
            value: string
            label: string
            parentValue?: string

        }
        document: {
            id: number | null
            file_name: string
        }
        client: {
            id: number | null,
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        },
        period: Dayjs | null
        tax_month_end: Dayjs | null
        tax_month_start: Dayjs | null
    }>({
        search: '',
        docSearch: '',
        clientSearch: '',
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
        selectedTable: {
            value: '',
            label: '',
            parentValue: ''
        },
        period: null,
        tax_month_end: null,
        tax_month_start: null,
    })
    
    
    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = useGetClients(    
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )
    const clientArr = dataClients?.clients;
    const { data: sales, isLoading: isLoadingSales, isFetching: isFetchingSales } = useGetSales(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search,
        doc,
    )

    const { data: purchases, isLoading: isLoadingPurchases, isFetching: isFetchingPurchases } = useGetPurchases(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search,
        doc,
    )

    const { data: salesTaxes, isLoading: isLoadingSalesTaxes, isFetching: isFetchingSalesTaxes } = useGetSalesTaxes(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search,
        doc,
    )
    const handleDownload = (
        type: string,
        selectedTable: string,
        parentTable?: string
    ) => {
        setStatus(prev => ({
            ...prev,
            loader: true,
        }))

        const mutationMap: Record<string, () => void> = {
            SALES: () =>
                downloadSalesMutation.mutate({
                    doc,
                    type,
                }),

            PURCHASES: () =>
                downloadPurchasesMutation.mutate({
                    doc,
                    type,
                }),

            SAWT: () =>
                downloadSalesTaxesMutation.mutate({
                    doc,
                    type,
                    form_type: selectedTable,
                }),

            QAP: () =>
                downloadPurchasesTaxesMutation.mutate({
                    doc,
                    type,
                    form_type: selectedTable,
                }),
        }

        const key = parentTable || selectedTable

        mutationMap[key]?.()
    }
    
    const handlePageChange = (current: number) => {
        setFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    const handleDeleteRecord = (id: number) => {
        setStatus(prev => ({
            ...prev,
            loader: true
        }))
        if(doc.selectedTable.value === 'SALES'){
            useDeleteSalesRecord.mutate(id, {
                onSuccess: () => {
                        setStatus(prev => ({
                    ...prev,
                    loader: false,
                    message: 'Sales record deleted successfully.'
                }))

                setTimeout(() => {
                    setStatus(prev => ({
                        ...prev,
                        message: ''
                    }))
                }, 5000)
                }
            })
        }
        if(doc.selectedTable.value === 'PURCHASES'){
            useDeletePurchasesRecord.mutate(id, {
                onSuccess: () => {
                        setStatus(prev => ({
                    ...prev,
                    loader: false,
                    message: 'Purchase record deleted successfully.'
                }))

                setTimeout(() => {
                    setStatus(prev => ({
                        ...prev,
                        message: ''
                    }))
                }, 5000)
                }
            })
        }
    }

    const handleToggleDelete = (id: number) => {
        setRecord(prev => {
            const newRecordArr = prev.recordArr?.map((record_) =>
                record_.id === id
                    ? {
                        ...record_,
                        toDelete: !record_.toDelete
                    }
                    : {
                        ...record_,
                        toDelete: false
                    }
            )

            return {
                ...prev,
                recordArr: newRecordArr as Record_Obj[]
            }
        })
    }
    
    const handleSelectClient = (client: {
        id: number | null,
        last_name: string
        first_name: string
        trade_name: string
        registered_name: string
    }) => {
        setDoc({
            ...doc,
            client: client,
            hasSelectedClient: true
        })

        setFilter(prev => ({
            ...prev,
            currentPage: 1
        }))
    }
    const handleClearSelected = () => {
        setDoc({
            ...doc,
            client: {
                id: null,
                last_name: '',
                first_name: '',
                trade_name: '',
                registered_name: '',
            },
            hasSelectedClient: false
        })
        setDisplayClients(false)
    }
    
    const handleSelectTable = (
        selectedTable: {
            value: string,
            label: string,
            parentValue?: string
        }
    ) => {
        setDoc({
            ...doc,
            selectedTable: selectedTable
        })
        setFilter(prev => ({
            ...prev,
            currentPage: 1
        }))
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
    const handleDateChange = (date: Dayjs | null) => {
        setDoc(prev => ({
            ...prev,
            period: date
        }))
        setFilter(prev => ({
            ...prev,
            currentPage: 1
        }))
    }
    const handleToggle = (dropdown: string) => {
        if(dropdown === 'clients'){
            setDisplayClients(prevState => !prevState)
        }
        if(dropdown === 'docs_table'){
            setDisplayDocsTbl(prevState => !prevState)
        }
    }

    useEffect(() => {
        if (
            doc.selectedTable.value === 'SALES' &&
            sales
        ){
            console.log(sales)
            setRecord(prev => ({
                ...prev,
                recordArr: sales?.records || [],
                totalRecords: sales?.totalRecords || 0
            }))
        }
    }, [sales, doc.selectedTable.value])

    useEffect(() => {
        if (doc.selectedTable.value === 'PURCHASES' && purchases) {
            setRecord(prev => ({
                ...prev,
                recordArr: purchases?.records || [],
                totalRecords: purchases?.totalRecords || 0
            }))
        }
    }, [purchases, doc.selectedTable.value])

    useEffect(() => {
        if (doc.selectedTable.parentValue === 'QAP' || doc.selectedTable.parentValue === 'SAWT') {
            setRecord(prev => ({
                ...prev,
                recordArr: salesTaxes?.records || [],
                totalRecords: salesTaxes?.totalRecords || 0
            }))
        }
    }, [salesTaxes, doc.selectedTable])
    
    useEffect(() => {
        if(typeof window !== 'undefined'){
            setTableWidth(window.innerWidth - 240)
        }
    },[])
    return {
        // STATES
        doc,
        status,
        filter,
        record,
        clientArr,
        tableWidth,
        datFileOptions,
        displayClients,
        displayDocsTbl,
        booksOfAccountsOptions,
        clientLoader: isLoadingClients || isFetchingClients,
        loader: isLoadingSales || isFetchingSales || isLoadingPurchases || isFetchingPurchases || isFetchingSalesTaxes || isLoadingSalesTaxes,

        // SET STATES
        setDisplayClients,
        setDisplayDocsTbl,

        // HANDLES
        handleToggle,
        handleChange,
        handleDownload,
        handlePageChange,
        handleDateChange,
        handleSelectTable,
        handleDeleteRecord,
        handleSelectClient,
        handleToggleDelete,
        handleClearSelected,
    }
}

export default useFileGenerator;