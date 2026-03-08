import UserAPIcalls from './api'
import { useEffect, ChangeEvent, FormEvent } from 'react'
import GlobalController from '@/controllers/global/Global_C'
const GetUsers_C = () => {
    const {
        // removeErr,
        handleBlur,
        // removeErrArray,
        handleResubmit
    } = GlobalController()
    const {
        // STATES
        user,
        filter,
        status,

        // SET STATES
        setFilter,
        setStatus,

        // REQUESTS
        getUsers
    } = UserAPIcalls()

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFilter({
            ...filter,
            [name]: value
        })
    }

    const handleSubmitSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        return await getUsers(
            filter.currentPage,
            filter.recordsLimit,
            filter.filter,
            filter.search
        )
    }

    const handlePageChange = async (current: number) => {
        return await getUsers(
            current,
            filter.recordsLimit,
            filter.filter,
            filter.search
        )
    };

    useEffect(() => {
        getUsers(
            filter.currentPage,
            filter.recordsLimit,
            filter.filter,
            filter.search
        )
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    
    return {
        // STATES
        user,
        filter,
        status,
        // SET STATES

        // HANDLES
        handleBlur,
        handleSearch,
        handleResubmit,
        handlePageChange,
        handleSubmitSearch
    }
}

export default GetUsers_C;