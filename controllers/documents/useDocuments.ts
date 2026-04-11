import useDocumentAPI from "./api";
import { useState, useEffect } from "react";
const useDocuments = () => {
    const {
        doc,
        filter,
        status,
        setStatus,
        setFilter,
        setDocument,
        useGetDocuments
    } = useDocumentAPI()
    const [tableWidth, setTableWidth] = useState(0)
    const [activeRowId, setActiveRowId] = useState<number | null>(null)
    const { data, isLoading, isFetching } = useGetDocuments(
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
        if(data?.documents?.length){
            setDocument(
                {
                    ...doc,
                    docArr: data.documents,
                    totalDocs: data.totalDocs
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
        doc,
        filter,
        status,
        tableWidth,
        activeRowId,
        loader: isLoading || isFetching,
        // SET STATES
        setActiveRowId,

        // HANDLES
        handlePageChange
    }
}

export default useDocuments;