import { Dayjs } from 'dayjs';
import { Record_Obj } from './types';
import useSalesAPI from '../sales/api';
import useFileGeneratorAPI from './api';
import useClientAPI from '../clients/api';
import { useState, useEffect, ChangeEvent } from "react";

const useFileGenerator = () => {
    const {
        useDeleteSalesRecord
    } = useSalesAPI()
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
        downloadSalesMutation,
        downloadPurchasesMutation
    } = useFileGeneratorAPI()
    const [tableWidth, setTableWidth] = useState(0)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocsTbl, setDisplayDocsTbl] = useState(false)
    const options =[
        {
            label: 'SUMMARY LIST OF SALES (SLS)',
            value: 'SALES'
        },
        {
            label: 'SUMMARY LIST OF PURCHASES (SLP)',
            value: 'PURCHASES'
        },
    ]
    const [doc, setDoc] = useState<{
        search: string
        docSearch: string
        clientSearch: string
        hasSelectedClient: boolean
        hasSelectedDocument: boolean
        selectedTable: {
            value: string,
            label: string
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
            value: 'SALES',
            label: 'SUMMARY LIST OF SALES (SLS)'
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
    const handleDownloadSales = (type: string) => {
        setStatus(prev => ({
            ...prev,
            loader: true
        }))
        downloadSalesMutation.mutate({ doc, type })
    }
    const handleDownloadPurchases = (type: string) => {
        setStatus(prev => ({
            ...prev,
            loader: true
        }))
        downloadPurchasesMutation.mutate({ doc, type })
    }
    const handlePageChange = (current: number) => {
        setFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    const handleDeleteRecord = (id: number) => {
        setStatus({...status, loader: true})
        if(doc.selectedTable.value === 'SALES'){
            useDeleteSalesRecord.mutate(id)
        }
        if(doc.selectedTable.value === 'PURCHASES'){
            
        }
    }

    const handleToggleDelete = (id: number) => {
        const { recordArr } = record
        const newRecordArr = recordArr?.map((record_) => record_.id == id ? {
            ...record_,
            toDelete: !record_.toDelete
        } : {
            ...record_,
            toDelete: false,
        })
        setRecord({
            ...record,
            recordArr: newRecordArr as Record_Obj[]
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
    const handleSelectTable = (selectedTable: { value: string, label: string }) => {
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
        setRecord(prev => ({
            ...prev,
            recordArr: sales?.records || [],
            totalRecords: sales?.totalRecords || 0
        }))
    }, [sales])

    useEffect(() => {
        setRecord(prev => ({
            ...prev,
            recordArr: purchases?.records || [],
            totalRecords: purchases?.totalRecords || 0
        }))
    }, [purchases])
    
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
        options,
        clientArr,
        tableWidth,
        displayClients,
        displayDocsTbl,
        clientLoader: isLoadingClients || isFetchingClients,
        loader: isLoadingSales || isFetchingSales || isLoadingPurchases || isFetchingPurchases,

        // SET STATES
        setDisplayClients,
        setDisplayDocsTbl,

        // HANDLES
        handleToggle,
        handleChange,
        handlePageChange,
        handleDateChange,
        handleSelectTable,
        handleDeleteRecord,
        handleSelectClient,
        handleToggleDelete,
        handleDownloadSales,
        handleClearSelected,
        handleDownloadPurchases,
    }
}

export default useFileGenerator;