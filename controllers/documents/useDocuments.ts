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
        useGetTemplate,
        useGetDocuments
    } = useDocumentAPI()
    const [tableWidth, setTableWidth] = useState(0)
    const [activeRowId, setActiveRowId] = useState<number | null>(null)
    const { refetch: downloadTemplate, isFetching: isDownloading } = useGetTemplate()
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
    
    const handleDownloadTemplate = async () => {
        try {
            const res = await downloadTemplate()

            if (res?.data) {
                const blob = new Blob([res.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })

                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'template.xlsx'
                document.body.appendChild(link)
                link.click()

                link.remove()
                window.URL.revokeObjectURL(url)
            }
        } catch (error) {
            console.error('Download failed:', error)
        }
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
        loader: isLoading || isFetching || isDownloading,
        // SET STATES
        setActiveRowId,

        // HANDLES
        handlePageChange,
        handleDownloadTemplate
    }
}

export default useDocuments;