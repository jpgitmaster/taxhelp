import useCustomerAPI from "./api";
import { useState, useEffect } from "react";
const useCustomers = () => {
    const {
        filter,
        status,
        customer,

        setCustomer,
        setFilter,
        setStatus,

        useGetCustomers
    } = useCustomerAPI()
    const [tableWidth, setTableWidth] = useState(0)
    const { data, isLoading, isFetching } = useGetCustomers(
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
        if(data?.customers?.length){
            setCustomer(
                {
                    ...customer,
                    customerArr: data.customers,
                    totalCustomers: data.totalCustomers
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
        status,
        filter,
        customer,
        tableWidth,
        loader: isLoading || isFetching,

        // SET STATES
        setFilter,
        

        // HANDLES
        handlePageChange
        
    }
}

export default useCustomers;