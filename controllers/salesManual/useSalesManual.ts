import { Dayjs } from 'dayjs'
import useSalesManualAPI from './api'
import useGlobal from '@/controllers/global/useGlobal'
import useQueryClients from '@/controllers/clients/api/queries'
import { useEffect, useState, ChangeEvent, SyntheticEvent } from 'react'

const useSalesManual = () => {
    const { handleBlur, handleResubmit } = useGlobal()
    const { useGetSalesManual, useDeleteSalesManual } = useSalesManualAPI()
    const {
        filter: clientFilter,
        setFilter: clientSetFilter,
        getClients,
    } = useQueryClients()

    const [search, setSearch] = useState('')
    const [appliedSearch, setAppliedSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [message, setMessage] = useState('')
    const [tableWidth, setTableWidth] = useState(0)
    const [displayClients, setDisplayClients] = useState(false)
    const [recordsLimit, setRecordsLimit] = useState(10)

    const [doc, setDoc] = useState<{
        clientSearch: string
        client: { id: number | null, last_name: string, first_name: string, trade_name: string, registered_name: string }
        taxable_month_from: Dayjs | null
        taxable_month_to: Dayjs | null
    }>({
        clientSearch: '',
        client: { id: null, last_name: '', first_name: '', trade_name: '', registered_name: '' },
        taxable_month_from: null,
        taxable_month_to: null,
    })

    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = getClients(
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )
    const clientArr = dataClients?.clients

    const { data, isLoading, isFetching } = useGetSalesManual(
        currentPage,
        recordsLimit,
        appliedSearch,
        doc.client.id,
        doc.taxable_month_from ? doc.taxable_month_from.format('MM/YYYY') : null,
        doc.taxable_month_to ? doc.taxable_month_to.format('MM/YYYY') : null,
    )

    useEffect(() => {
        if (typeof window === 'undefined') return

        const updateTableWidth = () => setTableWidth(window.innerWidth - 240)
        updateTableWidth()
        // Recompute on resize — it was only set once on mount before, so a
        // maximized/resized window after load left it stale (table wouldn't
        // know it had more room, or would stay too wide to need scrolling).
        window.addEventListener('resize', updateTableWidth)

        const stored = sessionStorage.getItem('successMessage')
        if (stored) {
            setMessage(stored)
            sessionStorage.removeItem('successMessage')
        }

        return () => window.removeEventListener('resize', updateTableWidth)
    }, [])

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handleSubmitSearch = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCurrentPage(1)
        setAppliedSearch(search)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageSizeChange = (pageSize: number) => {
        setRecordsLimit(pageSize)
        setCurrentPage(1)
    }

    const handleDeleteRecord = (id: number) => {
        useDeleteSalesManual.mutate(id)
    }

    const handleToggle = (dropdown: string) => {
        if (dropdown === 'clients') setDisplayClients(prev => !prev)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        if (name === 'clientSearch') {
            clientSetFilter(prev => ({ ...prev, search: value, currentPage: 1 }))
        }
        setDoc(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectClient = (client: { id: number | null, last_name: string, first_name: string, trade_name: string, registered_name: string }) => {
        setDoc(prev => ({ ...prev, client }))
        setCurrentPage(1)
    }

    const handleClearSelected = (dropdown: string) => {
        if (dropdown === 'client') {
            setDoc(prev => ({
                ...prev,
                client: { id: null, last_name: '', first_name: '', trade_name: '', registered_name: '' },
            }))
            setCurrentPage(1)
        }
    }

    const handleDateChange = (date: Dayjs | null, name: 'taxable_month_from' | 'taxable_month_to') => {
        setDoc(prev => {
            const updated = { ...prev, [name]: date }
            if (name === 'taxable_month_from') updated.taxable_month_to = null
            return updated
        })
        setCurrentPage(1)
    }

    return {
        doc,
        message,
        search,
        currentPage,
        recordsLimit,
        tableWidth,

        clientArr,
        displayClients,
        clientLoader: isLoadingClients || isFetchingClients,

        salesArr: data?.sales ?? [],
        totalSales: data?.totalSales ?? 0,
        salesLoader: isLoading || isFetching,

        setDisplayClients,

        handleBlur,
        handleToggle,
        handleChange,
        handleResubmit,
        handleSearch,
        handleDateChange,
        handlePageChange,
        handlePageSizeChange,
        handleDeleteRecord,
        handleSelectClient,
        handleSubmitSearch,
        handleClearSelected,
    }
}

export default useSalesManual
