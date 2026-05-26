import useQueryClients from './api/queries';
import { useState, useEffect } from "react";
import useMutationClients from './api/mutations';
import useQueryUsers from '@/controllers/users/api/queries';
const useClients = () => {
    const {
        filter,
        status,

        setFilter,
        setStatus,

        getClients
    } = useQueryClients()
    const {
        client,
        setClient
    } = useMutationClients()
    const {
        getUser
    } = useQueryUsers()
    const { data: user } = getUser()
    const [tableWidth, setTableWidth] = useState(0)
    const { data, isLoading, isFetching } = getClients(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search
    )

    const handlePageChange = (current: number) => {
        setFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    useEffect(() => {
        if(data?.clients?.length){
            setClient(
                {
                    ...client,
                    clientArr: data.clients,
                    totalClients: data.totalClients
                }
            )
        }
    }, [data])

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
        // STATES
        user,
        client,
        status,
        filter,
        tableWidth,
        loader: isLoading || isFetching,

        // SET STATES
        setFilter,
        

        // HANDLES
        handlePageChange
        
    }
}

export default useClients;