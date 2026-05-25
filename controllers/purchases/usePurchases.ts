import { Dayjs } from 'dayjs';
import usePurchasesAPI from "./api";
import { PurchasesObj } from './types';
import { useRouter } from 'next/router';
import useDocumentAPI from '../documents/api';
import useQueryClients from '../clients/api/queries';
import { AppliedDoc, DocState } from '../sales/types';
import useGlobal from '@/controllers/global/useGlobal';
import useQueryUsers from '@/controllers/users/api/queries';
import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";

const usePurchases = () => {
    const {
        handleBlur,
        handleResubmit
    } = useGlobal()
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
    const router = useRouter()
    const { documentID } = router.query
    const {
        filter: clientFilter,
        setFilter: clientSetFilter,

        getClients
    } = useQueryClients()

    const {
        filter: documentFilter,
        setFilter: documentSetFilter,

        useGetDocument,
        useGetDocuments
    } = useDocumentAPI()

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
    const [doc, setDoc] = useState<DocState>({
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
        tax_month_end: null,
        tax_month_start: null,
        invoice_date_end: null,
        invoice_date_start: null,
        created_date_end: null,
        created_date_start: null
    })
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
    const { data: dataPurchases, isLoading: isLoadingPurchases, isFetching: isFetchingPurchases } = useGetPurchases(
        purchasesFilter.currentPage,
        purchasesFilter.recordsLimit,
        purchasesFilter.filter,
        purchasesFilter.search,
        appliedDoc
    )

    const { data: dataDocuments, isLoading: isLoadingDocuments, isFetching: isFetchingDocuments } = useGetDocuments(
        documentFilter.currentPage,
        documentFilter.recordsLimit,
        documentFilter.filter,
        documentFilter.search
    )

    const { data: dataDocument } = useGetDocument(
        Number(documentID)
    )
    const {
        getUser
    } = useQueryUsers()
    const { data: user } = getUser()
    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = getClients(    
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )
    const clientArr = dataClients?.clients;
    const documentArr = dataDocuments?.documents; 

    const handleSubmitSearch = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPurchaseFilter(prev => ({
            ...prev,
            search: doc.search,   // 👈 trigger API search
            currentPage: 1        // 👈 reset pagination
        }))
    }
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDoc({
            ...doc,
            [name]: value
        })
    }
    
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        if(name === 'docSearch'){
            documentSetFilter(prev => ({
                ...prev,
                search: value,
                currentPage: 1
            }))
        }
        if(name === 'clientSearch'){
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

        setPurchaseFilter(prev => ({
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

        setPurchaseFilter(prev => ({
            ...prev,
            currentPage: 1,
        }))
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

        setPurchaseFilter(prev => ({
            ...prev,
            currentPage: 1,
        }))
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
        const newPurchasesArr = purchasesArr?.map((purchases_) => purchases_.id == id ? {
            ...purchases_,
            toDelete: !purchases_.toDelete
        } : {
            ...purchases_,
            toDelete: false,
        })
        setPurchases({
            ...purchases,
            purchasesArr: newPurchasesArr as PurchasesObj[]
        })
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
        setPurchaseFilter(prev => ({
            ...prev,
            currentPage: 1
        }))
    }

    const handlePageChange = (current: number) => {
        setPurchaseFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    useEffect(() => {
        setPurchases(prev => ({
            ...prev,
            purchasesArr: dataPurchases?.purchases?.map((purchases_: PurchasesObj[]) => ({
                        ...purchases_,
                        toDelete: false
                    })) || [],
            totalPurchases: dataPurchases?.totalPurchases || 0
        }))
    }, [dataPurchases])

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
        doc,
        user,
        status,
        purchases,
        clientArr,
        tableWidth,
        documentArr,
        rowSelection,
        displayClients,
        purchasesFilter,
        selectedRowKeys,
        displayDocuments,
        clientLoader: isLoadingClients || isFetchingClients,
        documentLoader: isLoadingDocuments || isFetchingDocuments,
        purchasesLoader: isLoadingPurchases || isFetchingPurchases || status.loader,

        setDisplayClients,
        setDisplayDocuments,
        
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

export default usePurchases;