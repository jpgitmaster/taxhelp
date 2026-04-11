import * as XLSX from 'xlsx';
import { Dayjs } from 'dayjs';
import useDatAPI from './api';
import useClients from '../clients/useClients';
import { useState, useEffect, ChangeEvent } from "react";


const useDatFile = () => {
    const {
        client,
        loader: clientLoader
    } = useClients()
    const {
        filter,
        record,
        setRecord,

        useGetRecords,
    } = useDatAPI()
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
        period: null
    })

    const { data, isLoading, isFetching } = useGetRecords(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search,
        doc,
    )

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
        console.log(data)
        if(data?.records?.length){
            setRecord(
                {
                    ...record,
                    recordArr: data.records,
                    totalRecords: data.totalRecords
                }
            )
        }
    }, [data])
    useEffect(() => {
        if(typeof window !== 'undefined'){
            setTableWidth(window.innerWidth - 240)
        }
    },[])
    return {
        // STATES
        doc,
        record,
        clientArr,
        tableWidth,
        clientLoader,
        displayClients,
        displayDocsTbl,
        loader: isLoading || isFetching,

        // SET STATES
        setDisplayClients,
        setDisplayDocsTbl,

        // HANDLES
        handleToggle,
        handleChange,
        handleDateChange,
        handleSelectTable,
        handleSelectClient,
    }
}

export default useDatFile;