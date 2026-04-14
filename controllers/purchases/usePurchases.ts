import usePurchasesAPI from "./api";
import { useState, useEffect } from "react";

const usePurchases = () => {
    const {
        status,
        filter,
        purchases,

        setPurchases,
        setFilter,
        setStatus,

        useGetPurchases
    } = usePurchasesAPI()
    const [tableWidth, setTableWidth] = useState(0)
    const { data, isLoading, isFetching } = useGetPurchases(
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
        if(data?.purchases?.length){
            setPurchases(
                {
                    ...purchases,
                    purchasesArr: data.purchases,
                    totalPurchases: data.totalPurchases
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
        status,
        filter,
        purchases,
        tableWidth,
        loader: isLoading || isFetching,

        // SET STATES
        

        // HANDLES
        handlePageChange,
        
    }
}

export default usePurchases;