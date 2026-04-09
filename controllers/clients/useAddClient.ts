import useClientAPI from './api'
import { ClientErr } from './types'
import useGlobal from '@/controllers/global/useGlobal'
import { useState, ChangeEvent, SyntheticEvent} from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'
import { initClient } from './states'

const useAddClient = () => {
    const {
        status,
        client,
        
        setStatus,
        setClient,

        useCreateClient
    } = useClientAPI()
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    
    const fieldValidations = {
        email: { usename: 'Email', required: true, email: true },
        registered_name: { usename: 'Company Name', required: true },
    }
    const formatPhoneNumber = (value: string) => {
        // remove all non-digits
        const digits = value.replace(/\D/g, "");

        // remove leading 63 if user types it
        let cleaned = digits.startsWith("63") ? digits.slice(2) : digits;

        // limit to 10 digits (PH mobile without +63)
        cleaned = cleaned.slice(0, 10);

        const part1 = cleaned.slice(0, 3);  // 926
        const part2 = cleaned.slice(3, 6);  // 123
        const part3 = cleaned.slice(6, 10); // 4567

        let formatted = "(+63)";

        if (part1) formatted += part1;
        if (part2) formatted += `-${part2}`;
        if (part3) formatted += `-${part3}`;

        return formatted;
    };
    const formatTIN = (value: string) => {
        // remove non-numeric
        const digits = value.replace(/\D/g, "").slice(0, 9);

        // format: XXX-XXX-XXX-XXX
        const parts = digits.match(/.{1,3}/g);
        return parts ? parts.join("-") : "";
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        const regexNumericOnly = /^(0|[1-9]\d*)$/
        switch (name) {
            case 'fiscal':
                if(value === '' || regexNumericOnly.test(value)){
                    setClient({
                        ...client,
                        clientObj: {
                            ...client.clientObj,
                            [name]: value
                        }
                    })
                }
                break;
            case 'tin':
                setClient({
                    ...client,
                    clientObj: {
                        ...client.clientObj,
                        tin: formatTIN(value)
                    }
                })
                break;
            case 'phone':
                setClient({
                    ...client,
                    clientObj: {
                        ...client.clientObj,
                        phone: formatPhoneNumber(value)
                    }
                })
                break;
            default:
                setClient({
                    ...client,
                    clientObj: {
                        ...client.clientObj,
                        [name]: value
                    }
                })
                break;
        }
        handleRemoveErr(client.clientErr, name)
    }
    
    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, client.clientObj)
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setClient({
                    ...client,
                    clientErr: validation_errors as ClientErr
                })
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }

        // CLIENT CREATION
        useCreateClient.mutate(client.clientObj)
    }

    return {
        // STATES
        client,
        status,

        // SET STATES
        setClient,
        
        // HANDLES
        handleBlur,
        handleSubmit,
        handleChange,
        handleResubmit,
        
    }
}

export default useAddClient;