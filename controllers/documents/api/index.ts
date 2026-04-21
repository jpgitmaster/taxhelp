import { Doc } from '../types'
import { useState } from 'react'
import { initDoc } from '../states'
import { useRouter } from 'next/router'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { initFilter, initStatus } from '@/controllers/global/states'

const useDocumentAPI = () => {
    const router = useRouter()
    const [filter, setFilter] = useState(initFilter)
    const [doc, setDocument] = useState<Doc>(initDoc)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const useGetDocument = (
        id: number
    ) => {
        return useQuery({
            queryKey: ['document', id],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/files/uploads/${id}`,
                    params: {
                        upload_id: id
                    }
                })
                // console.log(res.data)
                return res
            },
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }

    const useGetDocuments = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string
    ) => {
        return useQuery({
            queryKey: ['documents', page, limit, filter, search],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/files/uploads`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        // sortOrder: 'ASC',
                        // filter: JSON.stringify(filter)
                    }
                })
                // console.log(res.data)
                return {
                    documents: res.data?.files ?? [],
                    totalDocs: res.data?.total ?? 0
                }
            },
            // placeholderData: (prev) => prev, // 👈 replaces keepPreviousData (see below)
        })
    }

    const useGetTemplate = () => {
        return useQuery({
            queryKey: ['download_template'],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/files/template`,
                    responseType: 'blob', // 👈 VERY IMPORTANT
                })
                return res.data
            },
            enabled: false // 👈 prevent auto-run
        })
    }
    
    const uploadDocumentMutation = useMutation({
        mutationFn: async ({
            file,
            clientId,
        }: {
            file: File
            clientId: number | string
        }) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('client_id', String(clientId))

            const res = await api.post(
                `/api/${apiVersion}/files/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            return res.data
        },

        onSuccess: () => {
            sessionStorage.setItem(
                'successMessage',
                'Your document has been uploaded.'
            )
            router.push('/bookkeeper/documents')
        },

        onError: (error: any) => {
            console.error(error)
            alert('Error uploading file')
        },
    })

    return {
        //STATES
        doc,
        filter,
        status,
        
        // SET STATES
        setFilter,
        setStatus,
        setDocument,

        // QUERIES
        useGetTemplate,
        useGetDocument,
        useGetDocuments,

        // MUTATION
        uploadDocumentMutation,

        //HANDLES
    }
}
export default useDocumentAPI;