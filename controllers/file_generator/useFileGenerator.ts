import { Dayjs } from 'dayjs';
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
        hasSelectedClient: boolean
        selectedTable: {
            value: string,
            label: string
        }
        client: {
            id: number | null,
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        },
        period: Dayjs | null
    }>({
        search: '',
        hasSelectedClient: false,
        client: {
            id: null,
            last_name: '',
            first_name: '',
            trade_name: '',
            registered_name: '',
        },
        selectedTable: {
            value: 'SALES',
            label: 'SUMMARY LIST OF SALES (SLS)'
        },
        period: null,
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
        if(sales?.records?.length){
            setRecord(
                {
                    ...record,
                    recordArr: sales.records,
                    totalRecords: sales.totalRecords
                }
            )
        }else{
            setRecord(
                {
                    ...record,
                    recordArr: [],
                    totalRecords: 0
                }
            )
        }
    }, [sales])

    useEffect(() => {
        if(purchases?.records?.length){
            setRecord(
                {
                    ...record,
                    recordArr: purchases.records,
                    totalRecords: purchases.totalRecords
                }
            )
        }else{
            setRecord(
                {
                    ...record,
                    recordArr: [],
                    totalRecords: 0
                }
            )
        }
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
        handleSelectClient,
        handleDownloadSales,
        handleClearSelected,
        handleDownloadPurchases,
    }
}

export default useFileGenerator;