import useClientAPI from "./api";
import { useState, useEffect } from "react";
const useClients = () => {
    const {
        client,
        filter,
        status,

        setClient,
        setFilter,
        setStatus,

        useGetClients
    } = useClientAPI()
    const [tableWidth, setTableWidth] = useState(0)
    const { data, isLoading, isFetching } = useGetClients(
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
        if(data?.data?.length){
            setClient(
                {
                    ...client,
                    clientArr: data.data,
                    totalClients: data.totalClients
                }
            )
        }
    }, [data])

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
        client,
        status,
        filter,
        tableWidth,
        loader: isLoading || isFetching,

        // SET STATES
        

        // HANDLES
        handlePageChange
        
    }
}

export default useClients;