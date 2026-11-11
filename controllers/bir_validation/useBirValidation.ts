import { useState } from 'react'
import { notification } from 'antd'
import type { UploadFile } from 'antd'
import type { RcFile } from 'antd/es/upload/interface'
import useQueryBirValidation from './api/queries'
import useMutationBirValidation from './api/mutations'
import { initFilter } from './states'
import { BIR_VALIDATION_UPLOAD_EXTENSION } from './constants'

const useBirValidation = () => {
    const {
        filter,
        setFilter,
        useBirValidationsQuery
    } = useQueryBirValidation()

    const { useCreateBirValidations: createBirValidations } = useMutationBirValidation()

    const [searchInput, setSearchInput] = useState('')
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])

    const { data, isLoading, isFetching } = useBirValidationsQuery(
        filter.currentPage,
        filter.recordsLimit,
        filter.status,
        filter.search,
    )

    const handlePageChange = (current: number) => {
        setFilter((prev) => ({
            ...prev,
            currentPage: current
        }))
    }

    const handleSearch = () => {
        setFilter((prev) => ({
            ...prev,
            search: searchInput,
            currentPage: 1
        }))
    }

    const handleStatusSelect = (status: string) => {
        setFilter((prev) => ({
            ...prev,
            status,
            currentPage: 1
        }))
    }

    const handleResetFilters = () => {
        setSearchInput('')
        setFilter({
            ...initFilter,
            recordsLimit: filter.recordsLimit,
        })
    }

    const handleOpenUpload = () => {
        setUploadFiles([])
        setIsUploadOpen(true)
    }

    const handleCloseUpload = () => {
        if (createBirValidations.isPending) return

        setIsUploadOpen(false)
        setUploadFiles([])
    }

    const handleUploadChange = (fileList: UploadFile[]) => {
        const [file] = fileList

        if (!file) {
            setUploadFiles([])
            return
        }

        // `accept` only filters the picker, so a dragged file is checked here too.
        if (!file.name.toLowerCase().endsWith(BIR_VALIDATION_UPLOAD_EXTENSION)) {
            notification.error({
                message: 'Unsupported file',
                description: `Only ${BIR_VALIDATION_UPLOAD_EXTENSION} files are accepted.`,
                placement: 'topRight',
                duration: 5,
            })
            return
        }

        // One file per submission.
        setUploadFiles([file])
    }

    const handleSubmitUpload = () => {
        const files = uploadFiles
            .map((file) => file.originFileObj)
            .filter((file): file is RcFile => Boolean(file))

        if (!files.length) {
            notification.warning({
                message: 'No files selected',
                description: `Drag or select a ${BIR_VALIDATION_UPLOAD_EXTENSION} file to validate.`,
                placement: 'topRight',
                duration: 5,
            })
            return
        }

        createBirValidations.mutate(files, {
            onSuccess: () => {
                setIsUploadOpen(false)
                setUploadFiles([])

                notification.success({
                    message: 'Upload submitted',
                    description: `${files.length} file${files.length > 1 ? 's were' : ' was'} queued for BIR validation.`,
                    placement: 'topRight',
                    duration: 5,
                })
            },
            onError: (error) => {
                notification.error({
                    message: 'Upload failed',
                    description: error.message,
                    placement: 'topRight',
                    duration: 6,
                })
            },
        })
    }

    return {
        // STATES
        data,
        filter,
        searchInput,
        isUploadOpen,
        uploadFiles,

        // SET STATES
        setSearchInput,

        loader: isLoading || isFetching,
        uploadLoader: createBirValidations.isPending,

        // HANDLES
        handlePageChange,
        handleSearch,
        handleStatusSelect,
        handleResetFilters,
        handleOpenUpload,
        handleCloseUpload,
        handleUploadChange,
        handleSubmitUpload,
    }
}

export default useBirValidation;
