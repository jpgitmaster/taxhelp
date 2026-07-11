import { Dayjs } from 'dayjs';
import { Record_Obj } from './types';
import useQueryFileGenerates from './api/queries';
import useQueryClients from '../clients/api/queries';
import useMutationFileGenerates from './api/mutations';
import { useState, useEffect, ChangeEvent } from "react";
import useQueryUsers from '@/controllers/users/api/queries';
const fileConfig: Record<string, { mime: string; ext: string }> = {
    journal: {
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ext: 'xlsx',
    },
    dat: {
        mime: 'text/plain',
        ext: 'dat',
    },
}
const useFileGenerator = () => {
    const {
        filter: clientFilter,
        setFilter: clientSetFilter,

        getClients
    } = useQueryClients()
    
    const {
        filter,
        status,
        record,

        setFilter,
        setStatus,
        setRecord,

        getSales,
        getPurchases,
        getSalesTaxes,
        getPurchaseTaxes
    } = useQueryFileGenerates()

    const {
        deleteSalesRecord,
        deletePurchasesRecord,
        downloadSalesMutation,
        downloadPurchasesMutation,
        downloadSalesTaxesMutation,
        downloadPurchasesTaxesMutation
    } = useMutationFileGenerates()
    const {
        getUser
    } = useQueryUsers()
    const { data: user } = getUser()
    const [tableWidth, setTableWidth] = useState(0)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocsTbl, setDisplayDocsTbl] = useState(false)
    const [displayChildDocsTbl, setDisplayChildDocsTbl] = useState(false)
    const datFileOptions =[
        {
            label: 'SUMMARY LIST OF SALES (SLS)',
            value: 'SALES'
        },
        {
            label: 'SUMMARY LIST OF PURCHASES (SLP)',
            value: 'PURCHASES'
        },
        // {
        //     label: 'IMPORTS TRANSACTION',
        //     value: 'IMPORTATION'
        // },
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
        // {
        //     label: 'MONTHLY ALPHALIST OF PAYEES',
        //     value: 'MAP',
        //     children: [
        //         {
        //             label: '1600VT',
        //             value: '1600VT',
        //         },
        //         {
        //             label: '1600PT',
        //             value: '1600PT',
        //         },
        //     ]
        // },
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
        selectedChildTable: {
            value: string
            label: string
            parentValue: string
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
        selectedChildTable: {
            value: '',
            label: '',
            parentValue: ''
        },
        period: null,
        tax_month_end: null,
        tax_month_start: null,
    })
    const selectedParent = datFileOptions.find(
        option => option.value === doc.selectedTable.value
    )
    const childOptions = selectedParent?.children || []
    
    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = getClients(    
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )
    const clientArr = dataClients?.clients;
    const { data: sales, isLoading: isLoadingSales, isFetching: isFetchingSales } = getSales(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search,
        doc,
    )

    const { data: purchases, isLoading: isLoadingPurchases, isFetching: isFetchingPurchases } = getPurchases(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search,
        doc,
    )

    const { data: salesTaxes, isLoading: isLoadingSalesTaxes, isFetching: isFetchingSalesTaxes } = getSalesTaxes(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search,
        doc,
    )

    const {
        data: purchaseTaxes,
        isLoading: isLoadingPurchaseTaxes,
        isFetching: isFetchingPurchaseTaxes,
    } = getPurchaseTaxes(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search,
        doc,
    )

    const handleFileDownload = ({
        data,
        type,
        filename,
    }: {
        data: BlobPart
        type: string
        filename: string
    }) => {
        const config = fileConfig[type] || {
            mime: 'application/octet-stream',
            ext: 'dat',
        }

        const blob = new Blob([data], { type: config.mime })
        const url = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = filename

        document.body.appendChild(link)
        link.click()

        link.remove()
        window.URL.revokeObjectURL(url)

        setStatus(prev => ({
            ...prev,
            loader: false,
        }))
    }
    
    const handleDownload = (
        type: string,
        selectedTable: string,
        parentTable?: string
    ) => {
        setStatus(prev => ({
            ...prev,
            loader: true,
        }))

        const commonOptions = {
            onSuccess: handleFileDownload,
        }
        const mutationMap: Record<string, () => void> = {
            SALES: () =>
                downloadSalesMutation.mutate(
                    { doc, type },
                    commonOptions
                ),
            PURCHASES: () =>
                downloadPurchasesMutation.mutate(
                    { doc, type },
                    commonOptions
                ),
            QAP: () =>
                downloadPurchasesTaxesMutation.mutate(
                    {
                        doc,
                        type,
                        form_type: parentTable!,
                        sub_form_type: selectedTable,
                    },
                    commonOptions
                ),

                SAWT: () =>
                downloadSalesTaxesMutation.mutate(
                    {
                    doc,
                        type,
                        form_type: parentTable!,
                        sub_form_type: selectedTable,
                    },
                    commonOptions
                ),
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
            deleteSalesRecord.mutate(id, {
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
            deletePurchasesRecord.mutate(id, {
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
            selectedTable: selectedTable,
            selectedChildTable: {
                value: '',
                label: '',
                parentValue: ''
            }
        })
        setFilter(prev => ({
            ...prev,
            currentPage: 1
        }))
        setDisplayDocsTbl(false)
        setDisplayChildDocsTbl(false)
    }

    const handleSelectChildTable = (selectedChildTable: {
        value: string
        label: string
        parentValue: string
    }) => {
        setDoc(prev => ({
            ...prev,
            selectedChildTable
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
        if (dropdown === 'child_docs_table') {
            setDisplayChildDocsTbl(prev => !prev)
            setDisplayDocsTbl(false)
        }
    }

    useEffect(() => {
        if (
            doc.selectedTable.value === 'SALES' &&
            sales
        ){
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
        const docType =
            doc.selectedChildTable.parentValue || doc.selectedTable.value

        if (docType === 'SAWT') {
            setRecord(prev => ({
                ...prev,
                recordArr: salesTaxes?.records || [],
                totalRecords: salesTaxes?.totalRecords || 0,
            }))
        }
    }, [salesTaxes, doc.selectedTable.value, doc.selectedChildTable.parentValue])

    useEffect(() => {
        const docType =
            doc.selectedChildTable.parentValue || doc.selectedTable.value

        if (docType === 'QAP') {
            setRecord(prev => ({
                ...prev,
                recordArr: purchaseTaxes?.records || [],
                totalRecords: purchaseTaxes?.totalRecords || 0,
            }))
        }
    }, [purchaseTaxes, doc.selectedTable.value, doc.selectedChildTable.parentValue])
    
    useEffect(() => {
        if(typeof window !== 'undefined'){
            setTableWidth(window.innerWidth - 220)
        }
    },[])
    return {
        // STATES
        doc,
        user,
        status,
        filter,
        record,
        clientArr,
        tableWidth,
        childOptions,
        datFileOptions,
        displayClients,
        displayDocsTbl,
        displayChildDocsTbl,
        booksOfAccountsOptions,
        clientLoader: isLoadingClients || isFetchingClients,
        loader:
            isLoadingSales ||
            isFetchingSales ||
            isLoadingPurchases ||
            isFetchingPurchases ||
            isLoadingSalesTaxes ||
            isFetchingSalesTaxes ||
            isLoadingPurchaseTaxes ||
            isFetchingPurchaseTaxes,

        // SET STATES
        setDisplayClients,
        setDisplayDocsTbl,
        setDisplayChildDocsTbl,

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
        handleSelectChildTable,
    }
}

export default useFileGenerator;