import { useState } from 'react'
import { AxiosError } from 'axios'
import api from '@/components/reusables/axios'
import { ContactUs, ContactUsObj } from '../types'
import { Status } from '@/controllers/global/types'
import { initStatus } from '@/controllers/global/states'
import { initContactUs } from '../states/initContactUs'
import { useMutation } from '@tanstack/react-query'
import { getRecaptchaToken } from '../recaptcha'

type ContactUsErrorResponse = {
    success: boolean
    message: string
    errors: {
        full_name?: string
        email?: string
        message?: string
    }
}

const useMutationContactUs = () => {
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [contactUs, setContactUs] = useState<ContactUs>(initContactUs)
    const [status, setStatus] = useState<Status>(initStatus)

    const contactUsMutation = useMutation<
        unknown,
        AxiosError<ContactUsErrorResponse>,
        ContactUsObj
    >({
        mutationFn: async (contactObj: ContactUsObj) => {
            const recaptchaToken = await getRecaptchaToken()
            const res = await api.post(`/api/${apiVersion}/contact-us`, {
                full_name: contactObj.fullName,
                email: contactObj.email,
                message: contactObj.message,
                recaptcha_token: recaptchaToken
            });
            return res.data;
        },
        onError: (error) => {
            console.log(error)
        }
    })

    return {
        // STATES
        contactUs,
        status,
        initContactUs,

        // SET STATES
        setContactUs,
        setStatus,

        // MUTATIONS
        contactUsMutation,
    }
}
export default useMutationContactUs;