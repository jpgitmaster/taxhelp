import { useState } from 'react'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { useMutation } from '@tanstack/react-query'
import { initStatus } from '@/controllers/global/states'
const useMutationDocuments = () => {
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)

    const useDownloadDatFile = useMutation({
        mutationFn: async (payload: {
            client_id: number
            month: number
            year: number
            form_type: string
            sub_form_type: string
            records: any[]
        }) => {
            const response = await api.post(
                `/api/${apiVersion}/files/upload-and-download`,
                payload,
                {
                    responseType: 'blob',
                }
            )

            return response.data
        },
    })

    
    return {
        //STATES
        status,
        
        // SET STATES
        setStatus,

        // MUTATIONS
        useDownloadDatFile
    }
}
export default useMutationDocuments;