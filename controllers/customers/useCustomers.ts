
import { useState, useEffect } from "react";
import useQueryCustomers from "./api/queries";
import useMutationCustomers from './api/mutations';
const useCustomers = () => {
    const {
        customer,
        setCustomer
    } = useMutationCustomers()

    const {
        filter,
        status,

        setFilter,
        setStatus,

        useGetCustomers
    } = useQueryCustomers()
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