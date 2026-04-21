import { Dayjs } from 'dayjs';
import usePurchasesAPI from "./api";
import { PurchasesObj } from './types';
import useClientAPI from '../clients/api';
import useDocumentAPI from '../documents/api';
import { useState, useEffect, ChangeEvent } from "react";

const usePurchases = () => {
    const {
        status,
        purchases,
        filter: purchasesFilter,

        setStatus,
        setPurchases,
        setFilter: setPurchaseFilter,

        useGetPurchases,
        useDeletePurchasesRecord
    } = usePurchasesAPI()

    const {
        filter: clientFilter,
        setFilter: clientSetFilter,

        useGetClients
    } = useClientAPI()

    const {
        filter: documentFilter,
        setFilter: documentSetFilter,

        useGetDocuments
    } = useDocumentAPI()

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
    const { data: dataPurchases, isLoading: isLoadingPurchases, isFetching: isFetchingPurchases } = useGetPurchases(
        purchasesFilter.currentPage,
        purchasesFilter.recordsLimit,
        purchasesFilter.filter,
        purchasesFilter.search,
        Number(doc.document.id),
        Number(doc.client.id),
    )

    const { data: dataDocuments, isLoading: isLoadingDocuments, isFetching: isFetchingDocuments } = useGetDocuments(
        documentFilter.currentPage,
        documentFilter.recordsLimit,
        documentFilter.filter,
        documentFilter.search
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
    const handleDeleteRecord = (id: number) => {
        setStatus({...status, loader: true})
        useDeletePurchasesRecord.mutate(id)
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
        setPurchaseFilter({
            ...purchasesFilter,
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
        setPurchaseFilter({
            ...purchasesFilter,
            currentPage: 1,
        })
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
        setPurchaseFilter({
            ...purchasesFilter,
            currentPage: 1,
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

    const handleToggleDelete = (id: number) => {
        const { purchasesArr } = purchases
        const newSalesArr = purchasesArr?.map((purchases_) => purchases_.id == id ? {
            ...purchases_,
            toDelete: !purchases_.toDelete
        } : {
            ...purchases_,
            toDelete: false,
        })
        setPurchases({
            ...purchases,
            purchasesArr: newSalesArr as PurchasesObj[]
        })
    }

    const handleDateChange = (date: Dayjs | null) => {
        setDoc(prev => ({
            ...prev,
            period: date
        }))
    }

    const handlePageChange = (current: number) => {
        setPurchaseFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    useEffect(() => {
        if(dataPurchases?.purchases?.length){
            setPurchases(
                {
                    ...purchases,
                    purchasesArr: dataPurchases.purchases?.map((purchases_: PurchasesObj[]) => ({
                        ...purchases_,
                        toDelete: false
                    })),
                    totalPurchases: dataPurchases.totalPurchases
                }
            )
        }else{
            setPurchases(
                {
                    ...purchases,
                    purchasesArr: [],
                    totalPurchases: 0
                }
            )
        }
    }, [dataPurchases])

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
        doc,
        status,
        purchases,
        clientArr,
        tableWidth,
        documentArr,
        displayClients,
        purchasesFilter,
        displayDocuments,
        clientLoader: isLoadingClients || isFetchingClients,
        documentLoader: isLoadingDocuments || isFetchingDocuments,
        purchasesLoader: isLoadingPurchases || isFetchingPurchases || status.loader,

        setDisplayClients,
        setDisplayDocuments,
        
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

export default usePurchases;