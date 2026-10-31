import { useState } from 'react'
import useQueryBirValidation from './api/queries'
import { initFilter } from './states'

const useBirValidation = () => {
    const {
        filter,
        setFilter,
        useBirValidationsQuery
    } = useQueryBirValidation()

    const [searchInput, setSearchInput] = useState('')

    const { data, isLoading, isFetching } = useBirValidationsQuery(
        filter.currentPage,
        filter.recordsLimit,
        filter.status,
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

    const handleStatusSelect = (status: string) => {
        setFilter((prev) => ({
            ...prev,
            status,
            currentPage: 1
        }))
    }

    const handleResetFilters = () => {
        setSearchInput('')
        setFilter({
            ...initFilter,
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
        handleStatusSelect,
        handleResetFilters
    }
}

export default useBirValidation;
