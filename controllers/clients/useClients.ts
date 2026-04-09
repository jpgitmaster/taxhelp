import useClientAPI from "./api";
import { useState, useEffect } from "react";
const useClients = () => {
    const {
        client,
        filter,
        status,

        setClient,
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

    useEffect(() => {
        if(data?.data?.length){
            setClient(
                {
                    ...client,
                    clientArr: data.data,
                    totalClients: data.totalDocs
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
        tableWidth,
        loader: isLoading || isFetching,

        // SET STATES
        

        // HANDLES
        
    }
}

export default useClients;