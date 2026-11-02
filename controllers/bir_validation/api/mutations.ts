import axios from 'axios'
import api from '@/components/reusables/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BirValidationObj } from '../types'

interface ApiErrorResponse {
    message?: string
    errors?: Record<string, string>
}

const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const data = error.response?.data

        return (
            data?.errors?.files ??
            data?.errors?.message ??
            data?.message ??
            error.message
        )
    }

    return error instanceof Error ? error.message : 'Upload failed'
}

const useMutationBirValidation = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const useCreateBirValidations = useMutation<BirValidationObj[], Error, File[]>({
        mutationFn: async (files) => {
            const formData = new FormData()

            files.forEach((file) => formData.append('files', file))

            try {
                const res = await api.post(
                    `/api/${apiVersion}/bir-validations`,
                    formData,
                )

                return res.data ?? []
            } catch (error) {
                throw new Error(getErrorMessage(error))
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['bir-validations'],
            })
        },
    })

    return {
        // MUTATIONS
        useCreateBirValidations,
    }
}

export default useMutationBirValidation
