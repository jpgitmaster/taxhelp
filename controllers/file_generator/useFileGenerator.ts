import { Dayjs } from 'dayjs';
import useFileGeneratorAPI from './api';
import useClients from '../clients/useClients';
import { useState, useEffect, ChangeEvent } from "react";


const useFileGenerator = () => {
    const {
        client,
        loader: clientLoader
    } = useClients()
    const {
        filter,
        record,

        setFilter,
        setRecord,

        useGetSales,
        useGetPurchases
    } = useFileGeneratorAPI()
    const { clientArr } = client
    const [tableWidth, setTableWidth] = useState(0)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocsTbl, setDisplayDocsTbl] = useState(false)
    const [doc, setDoc] = useState<{
        search: string
        selectedTable: {
            value: string,
            label: string
        }
        client: {
            id: number | null,
            registered_name: string
        },
        period: Dayjs | null
    }>({
        search: '',
        client: {
            id: null,
            registered_name: ''
        },
        selectedTable: {
            value: 'SALES',
            label: 'SUMMARY LIST OF SALES (SLS)'
        },
        period: null,
    })

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

    const handlePageChange = (current: number) => {
        setFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    const handleSelectClient = (client: { id: number, registered_name: string }) => {
        setDoc({
            ...doc,
            client: client
        })
    }
    const handleSelectTable = (selectedTable: { value: string, label: string }) => {
        setDoc({
            ...doc,
            selectedTable: selectedTable
        })
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
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
        filter,
        record,
        clientArr,
        tableWidth,
        clientLoader,
        displayClients,
        displayDocsTbl,
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
    }
}

export default useFileGenerator;