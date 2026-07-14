import { useState } from 'react'
import axios, { AxiosError } from "axios";
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { useMutation } from '@tanstack/react-query'
import { initStatus } from '@/controllers/global/states'
interface DatRecord {
    taxable_month: string
    tin: string
    registered_name: string

    first_name?: string
    last_name?: string
    middle_name?: string

    first_address: string
    second_address: string

    branch_code: string

    exempt_sales?: number
    zero_rated_sales?: number
    vatable_sales?: number

    exempt_purchases?: number
    zero_rated_purchases?: number
    vatable_purchases?: number
    vatable_purchase_of_services?: number
    vatable_purchase_of_capital_goods?: number
    vatable_purchase_of_other_goods?: number

    vat_rate?: number

    atc_code?: string
    amount_of_income_payment?: number
    tax_rate?: number
    amount_of_tax_withheld?: number
}
interface ApiError {
  success: boolean;
  errors: {
    message: string;
  };
}interface Payload {
    client_id: number
    month: number
    year: number
    form_type: string
    sub_form_type: string
    records: DatRecord[]
}

const useMutationDocuments = () => {
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)

    const useDownloadDatFile = useMutation<Blob, ApiError, Payload>({
        mutationFn: async (payload) => {
            try {
                const response = await api.post(
                    `/api/${apiVersion}/files/upload-and-download`,
                    payload,
                    {
                        responseType: 'blob',
                    }
                )

                return response.data
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<Blob>

                    if (
                        axiosError.response?.data instanceof Blob &&
                        axiosError.response.data.type.includes('application/json')
                    ) {
                        const text = await axiosError.response.data.text()
                        const json: ApiError = JSON.parse(text)

                        throw json
                    }
                }

                throw error
            }
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