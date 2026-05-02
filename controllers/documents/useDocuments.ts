import useDocumentAPI from "./api";
import useGlobal from '@/controllers/global/useGlobal';
import { useState, useEffect, ChangeEvent } from "react";
const useDocuments = () => {
    const {
        handleBlur,
        handleResubmit,
    } = useGlobal()
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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [checkedTpl, setCheckedTpl ] = useState<string[]>([''])
    const [activeRowId, setActiveRowId] = useState<number | null>(null)
    const { refetch: downloadTemplate, isFetching: isDownloading } = useGetTemplate()
    const { data, isLoading, isFetching } = useGetDocuments(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search
    )

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleCheckedTpls = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        
        if (checked) {
            // Only one role can be checked at a time
            setCheckedTpl([value]);
        } else {
            // If unchecked, clear the selection
            setCheckedTpl([]);
        }
    };
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
        doc,
        filter,
        status,
        checkedTpl,
        tableWidth,
        activeRowId,
        isModalOpen,
        loader: isLoading || isFetching || isDownloading,

        // SET STATES
        setActiveRowId,

        // HANDLES
        handleBlur,
        handleOpenModal,
        handlePageChange,
        handleCloseModal,
        handleCheckedTpls,
        handleDownloadTemplate
    }
}

export default useDocuments;