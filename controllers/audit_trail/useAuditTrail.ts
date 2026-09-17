import { useState } from 'react'
import useQueryAuditTrail from './api/queries'

const useAuditTrail = () => {
    const {
        filter,
        setFilter,
        getAuditLogs
    } = useQueryAuditTrail()

    const [searchInput, setSearchInput] = useState('')

    const { data, isLoading, isFetching } = getAuditLogs(
        filter.currentPage,
        filter.recordsLimit,
        filter.action,
        filter.resourceType,
        filter.search,
    )

    const handlePageChange = (current: number) => {
        setFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    const handleSearch = () => {
        setFilter((prev) => ({
            ...prev,
            search: searchInput,
            currentPage: 1
        }))
    }

    const handleActionSelect = (action: string) => {
        setFilter((prev) => ({
            ...prev,
            action,
            currentPage: 1
        }))
    }

    const handleResourceTypeSelect = (resourceType: string) => {
        setFilter((prev) => ({
            ...prev,
            resourceType,
            currentPage: 1
        }))
    }

    const handleResetFilters = () => {
        setSearchInput('')
        setFilter({
            search: '',
            action: '',
            resourceType: '',
            currentPage: 1,
            recordsLimit: filter.recordsLimit,
        })
    }

    return {
        // STATES
        data,
        filter,
        searchInput,

        // SET STATES
        setSearchInput,

        loader: isLoading || isFetching,

        // HANDLES
        handlePageChange,
        handleSearch,
        handleActionSelect,
        handleResourceTypeSelect,
        handleResetFilters
    }
}

export default useAuditTrail;