import { Dayjs } from 'dayjs';
import useSalesAPI from "./api";
import { SalesObj } from './types';
import useClientAPI from '../clients/api';
import useDocumentAPI from '../documents/api';
import { useState, useEffect, ChangeEvent } from "react";


const useSales = () => {
    const {
        sales,
        status,
        router,
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
        setFilter: documentSetFilter,

        useGetDocument,
        useGetDocuments
    } = useDocumentAPI()
    const { documentID } = router.query
    const [tableWidth, setTableWidth] = useState(0)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocuments, setDisplayDocuments] = useState(false)
    const [doc, setDoc] = useState<{
        search: string
        hasSelectedClient: boolean
        hasSelectedDocument: boolean
        client: {
            id: number | null,
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        },
        document: {
            id: number | null
            file_name: string
        },
        period: Dayjs | null
    }>({
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
        period: null,
    })


    const { data: dataDocuments, isLoading: isLoadingDocuments, isFetching: isFetchingDocuments } = useGetDocuments(
        documentFilter.currentPage,
        documentFilter.recordsLimit,
        documentFilter.filter,
        documentFilter.search
    )

    // const { data: dataDocument } = useGetDocument(
    //     Number(documentID)
    // )
    const { data: dataSales, isLoading: isLoadingSales, isFetching: isFetchingSales } = useGetSales(
        salesFilter.currentPage,
        salesFilter.recordsLimit,
        salesFilter.filter,
        salesFilter.search,
        Number(doc.document.id),
        Number(doc.client.id),
    )

    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = useGetClients(    
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )

    const clientArr = dataClients?.clients;
    const documentArr = dataDocuments?.documents; 

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
        setDoc({
            ...doc,
            client: client,
            hasSelectedClient: true
        })
        salesSetFilter({
            ...salesFilter,
            currentPage: 1,
        })
    }
    const handleClearSelected = (dropdown: string) => {
        if(dropdown === 'client'){
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
        if(dropdown === 'document'){
            setDoc({
                ...doc,
                document: {
                    id: null,
                    file_name: ''
                },
                hasSelectedDocument: false
            })
            setDisplayDocuments(false)
        }
        salesSetFilter({
            ...salesFilter,
            currentPage: 1,
        })
    }

    const handleDeleteRecord = (id: number) => {
        setStatus({...status, loader: true})
        useDeleteSalesRecord.mutate(id)
    }

    const handleSelectDocument = (document: {
        id: number | null,
        file_name: string
    }) => {
        setDoc({
            ...doc,
            document: document,
            hasSelectedDocument: true
        })
        salesSetFilter({
            ...salesFilter,
            currentPage: 1,
        })
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
    const handleDateChange = (date: Dayjs | null) => {
        setDoc(prev => ({
            ...prev,
            period: date
        }))
    }
    const handlePageChange = (current: number) => {
        salesSetFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    useEffect(() => {
        if(dataSales?.sales?.length){
            setSales(
                {
                    ...sales,
                    salesArr: dataSales.sales?.map((sales_: SalesObj[]) => ({
                        ...sales_,
                        toDelete: false
                    })),
                    totalSales: dataSales.totalSales
                }
            )
        }else{
            setSales(
                {
                    ...sales,
                    salesArr: [],
                    totalSales: 0
                }
            )
        }
    }, [dataSales])

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setTableWidth(window.innerWidth - 240)
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
        displayClients,
        displayDocuments,
        clientLoader: isLoadingClients || isFetchingClients,
        documentLoader: isLoadingDocuments || isFetchingDocuments,
        salesloader: isLoadingSales || isFetchingSales || status.loader,

        // SET STATES
        setDisplayClients,
        setDisplayDocuments,
        

        // HANDLES
        handleChange,
        handleToggle,
        handleDateChange,
        handlePageChange,
        handleToggleDelete,
        handleSelectClient,
        handleDeleteRecord,
        handleClearSelected,
        handleSelectDocument,
    }
}

export default useSales;