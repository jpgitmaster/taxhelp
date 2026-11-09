import { useEffect, useState, ChangeEvent, SyntheticEvent } from 'react'
import useSalesManualAPI from './api'
import useGlobal from '@/controllers/global/useGlobal'

const useSalesManual = () => {
    const { handleBlur, handleResubmit } = useGlobal()
    const { useGetSalesManual, useDeleteSalesManual } = useSalesManualAPI()

    const [search, setSearch] = useState('')
    const [appliedSearch, setAppliedSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [message, setMessage] = useState('')
    const recordsLimit = 10

    const { data, isLoading, isFetching } = useGetSalesManual(
        currentPage,
        recordsLimit,
        appliedSearch,
        null,
    )

    useEffect(() => {
        const stored = sessionStorage.getItem('successMessage')
        if (stored) {
            setMessage(stored)
            sessionStorage.removeItem('successMessage')
        }
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

    const handleDeleteRecord = (id: number) => {
        useDeleteSalesManual.mutate(id)
    }

    return {
        message,
        search,
        currentPage,
        recordsLimit,

        salesArr: data?.sales ?? [],
        totalSales: data?.totalSales ?? 0,
        salesLoader: isLoading || isFetching,

        handleBlur,
        handleResubmit,
        handleSearch,
        handlePageChange,
        handleDeleteRecord,
        handleSubmitSearch,
    }
}

export default useSalesManual
