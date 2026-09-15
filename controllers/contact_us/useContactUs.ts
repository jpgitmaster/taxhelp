import useMutationContactUs from './api/mutations'
import useGlobal from '@/controllers/global/useGlobal'
import { ChangeEvent, SyntheticEvent } from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'

type ContactUsErrorResponse = {
    success: boolean
    message: string
    errors: {
        full_name?: string
        email?: string
        message?: string
    }
}

const useContactUs = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()

    const {
        contactUs,
        status,
        initContactUs,

        setContactUs,
        setStatus,

        contactUsMutation
    } = useMutationContactUs()
    const fieldValidations = {
        fullName: { usename: 'Full Name', required: true },
        email: { usename: 'Email', required: true, email: true },
        message: { usename: 'Message', required: true },
    }
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setContactUs({
            ...contactUs,
            contactObj: {
                ...contactUs.contactObj,
                [name]: value
            }
        })
        handleRemoveErr(contactUs.contactErr, name)
    }

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, contactUs.contactObj)
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setContactUs({
                    ...contactUs,
                    contactErr: validation_errors
                })
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }

        // SUBMIT
        contactUsMutation.mutate(contactUs.contactObj, {
            onSuccess: (res) => {
                setTimeout(() => {
                    setStatus(prev => ({
                        ...prev,
                        loader: false,
                        message: (res as { message?: string })?.message || 'Message Sent Successfully!',
                        submessage:
                            "We've received your message and will get back to you shortly."
                    }))
                }, 500)
            },
            onError: (err) => {
                const backendErrors = (err as { response?: { data?: ContactUsErrorResponse } })?.response?.data?.errors

                setContactUs(prev => ({
                    ...prev,
                    contactErr: {
                        fullName: backendErrors?.full_name || '',
                        email: backendErrors?.email || '',
                        message: backendErrors?.message || '',
                    }
                }))

                setStatus(prev => ({
                    ...prev,
                    loader: false
                }))
            }
        })
    }

    const handleReset = () => {
        setContactUs({
            contactErr: { fullName: '', email: '', message: '' },
            contactObj: { fullName: '', email: '', message: '' },
        })
        setStatus({...status, loader: false, message: '', submessage: ''})
    }
    return {
        // STATES
        contactUs,
        status,
        initContactUs,

        // SET STATES
        setContactUs,
        setStatus,

        // HANDLES
        handleBlur,
        handleResubmit,
        handleChange,
        handleSubmit,
        handleReset
    }
}

export default useContactUs;