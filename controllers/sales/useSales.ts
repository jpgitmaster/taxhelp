import useSalesAPI from "./api";
import { useState, useEffect } from "react";

const useSales = () => {
    const {
        sales,
        status,
        filter,

        setSales,
        setFilter,
        setStatus,

        useGetSales
    } = useSalesAPI()
    const [tableWidth, setTableWidth] = useState(0)
    const { data, isLoading, isFetching } = useGetSales(
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
        if(data?.sales?.length){
            setSales(
                {
                    ...sales,
                    salesArr: data.sales,
                    totalSales: data.totalSales
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
        sales,
        status,
        filter,
        tableWidth,
        loader: isLoading || isFetching,

        // SET STATES
        

        // HANDLES
        handlePageChange,
        
    }
}

export default useSales;