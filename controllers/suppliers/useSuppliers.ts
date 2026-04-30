import useSupplierAPI from "./api";
import { useState, useEffect } from "react";
const useSuppliers = () => {
    const {
        filter,
        status,
        supplier,

        setSupplier,
        setFilter,
        setStatus,

        useGetSuppliers
    } = useSupplierAPI()
    const [tableWidth, setTableWidth] = useState(0)
    const { data, isLoading, isFetching } = useGetSuppliers(
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
        if(data?.suppliers?.length){
            setSupplier(
                {
                    ...supplier,
                    supplierArr: data.suppliers,
                    totalSuppliers: data.totalSuppliers
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
        supplier,
        tableWidth,
        loader: isLoading || isFetching,

        // SET STATES
        setFilter,
        

        // HANDLES
        handlePageChange
        
    }
}

export default useSuppliers;