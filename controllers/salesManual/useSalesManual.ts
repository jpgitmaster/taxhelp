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
    const [sortBy, setSortBy] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    // The popover's fields edit `doc` live (so inputs stay responsive/
    // controlled as the user picks), but the query only reads from this —
    // it's only synced from `doc` when "Search" is clicked, so picking a
    // date doesn't refire the API on every keystroke/selection.
    const [appliedFilters, setAppliedFilters] = useState({
        clientId: null as number | null,
        taxableMonthFrom: null as string | null,
        taxableMonthTo: null as string | null,
        invoiceDateFrom: null as string | null,
        invoiceDateTo: null as string | null,
        status: null as string | null,
        tin: null as string | null,
    })

    const [doc, setDoc] = useState<{
        clientSearch: string
        client: { id: number | null, last_name: string, first_name: string, trade_name: string, registered_name: string }
        taxable_month_from: Dayjs | null
        taxable_month_to: Dayjs | null
        invoice_date_from: Dayjs | null
        invoice_date_to: Dayjs | null
        status: string
        tin: string
    }>({
        clientSearch: '',
        client: { id: null, last_name: '', first_name: '', trade_name: '', registered_name: '' },
        taxable_month_from: null,
        taxable_month_to: null,
        invoice_date_from: null,
        invoice_date_to: null,
        status: '',
        tin: '',
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
        appliedFilters.clientId,
        appliedFilters.taxableMonthFrom,
        appliedFilters.taxableMonthTo,
        sortBy,
        sortOrder,
        appliedFilters.invoiceDateFrom,
        appliedFilters.invoiceDateTo,
        appliedFilters.status,
        appliedFilters.tin,
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

    const handleSortChange = (field: string | null, order: 'asc' | 'desc') => {
        setSortBy(field)
        setSortOrder(order)
        setCurrentPage(1)
    }

    const handleDeleteRecord = (id: number) => {
        useDeleteSalesManual.mutate(id)
    }

    const handleToggle = (dropdown: string) => {
        if (dropdown === 'clients') setDisplayClients(prev => !prev)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        if (name === 'clientSearch') {
            clientSetFilter(prev => ({ ...prev, search: value, currentPage: 1 }))
        }
        setDoc(prev => ({ ...prev, [name]: value }))
    }

    // Only edits the draft `doc` — doesn't touch the query. Query only
    // updates once handleApplyFilters runs (Search button click).
    const handleSelectClient = (client: { id: number | null, last_name: string, first_name: string, trade_name: string, registered_name: string }) => {
        setDoc(prev => ({ ...prev, client }))
    }

    // Clearing is an immediate action (not a draft edit) — resets both the
    // visible field and the actual query right away, same as Gmail's
    // "Clear filters" doesn't wait for a separate Search click.
    const handleClearSelected = (dropdown: string) => {
        if (dropdown === 'client') {
            setDoc(prev => ({
                ...prev,
                client: { id: null, last_name: '', first_name: '', trade_name: '', registered_name: '' },
            }))
            setAppliedFilters(prev => ({ ...prev, clientId: null }))
            setCurrentPage(1)
        }
        if (dropdown === 'taxable_month') {
            setDoc(prev => ({ ...prev, taxable_month_from: null, taxable_month_to: null }))
            setAppliedFilters(prev => ({ ...prev, taxableMonthFrom: null, taxableMonthTo: null }))
            setCurrentPage(1)
        }
        if (dropdown === 'invoice_date') {
            setDoc(prev => ({ ...prev, invoice_date_from: null, invoice_date_to: null }))
            setAppliedFilters(prev => ({ ...prev, invoiceDateFrom: null, invoiceDateTo: null }))
            setCurrentPage(1)
        }
        if (dropdown === 'status') {
            setDoc(prev => ({ ...prev, status: '' }))
            setAppliedFilters(prev => ({ ...prev, status: null }))
            setCurrentPage(1)
        }
        if (dropdown === 'tin') {
            setDoc(prev => ({ ...prev, tin: '' }))
            setAppliedFilters(prev => ({ ...prev, tin: null }))
            setCurrentPage(1)
        }
    }

    const handleDateChange = (
        date: Dayjs | null,
        name: 'taxable_month_from' | 'taxable_month_to' | 'invoice_date_from' | 'invoice_date_to',
    ) => {
        setDoc(prev => {
            const updated = { ...prev, [name]: date }
            if (name === 'taxable_month_from') updated.taxable_month_to = null
            if (name === 'invoice_date_from') updated.invoice_date_to = null
            return updated
        })
    }

    // Commits the draft `doc` filter fields into the query — called when
    // the filter popover's Search button is clicked.
    const handleApplyFilters = () => {
        setAppliedFilters({
            clientId: doc.client.id,
            taxableMonthFrom: doc.taxable_month_from ? doc.taxable_month_from.format('MM/YYYY') : null,
            taxableMonthTo: doc.taxable_month_to ? doc.taxable_month_to.format('MM/YYYY') : null,
            invoiceDateFrom: doc.invoice_date_from ? doc.invoice_date_from.format('YYYY-MM-DD') : null,
            invoiceDateTo: doc.invoice_date_to ? doc.invoice_date_to.format('YYYY-MM-DD') : null,
            status: doc.status || null,
            tin: doc.tin || null,
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
        sortBy,
        sortOrder,
        appliedFilters,

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
        handleApplyFilters,
        handlePageChange,
        handlePageSizeChange,
        handleSortChange,
        handleDeleteRecord,
        handleSelectClient,
        handleSubmitSearch,
        handleClearSelected,
    }
}

export default useSalesManual
