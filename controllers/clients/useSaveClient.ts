import useClientAPI from './api'
import { ClientErr } from './types'
import { useRouter } from 'next/router';
import useGlobal from '@/controllers/global/useGlobal'
import { ChangeEvent, SyntheticEvent, useEffect} from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'

const useAddClient = () => {
    const {
        status,
        client,
        
        setStatus,
        setClient,

        useGetClient,
        useCreateClient
    } = useClientAPI()
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    const router = useRouter()
    const { clientID } = router.query
    const clientIdNumber = Number(clientID)
    
    const fieldValidations = {
        tin: { usename: 'TIN No.', required: true },
        last_name: { usename: 'Last Name', ifCondition: {
            condition: client.clientObj.classification === 'INDIVIDUAL',
            required: true
        }},
        first_name: { usename: 'First Name', ifCondition: {
            condition: client.clientObj.classification === 'INDIVIDUAL',
            required: true
        }},
        email: { usename: 'Email', required: true, email: true },
        representative_phone: { usename: 'Phone', required: true },
        trade_name: { usename: 'Trade Name', ifCondition: {
            condition: client.clientObj.classification === 'NON-INDIVIDUAL',
            required: true
        }},
        registered_name: { usename: 'Registered Name', ifCondition: {
            condition: client.clientObj.classification === 'NON-INDIVIDUAL',
            required: true
        }},
        representative_last_name: { usename: 'Last Name', required: true },
        representative_first_name: { usename: 'First Name', required: true },
        representative_email: { usename: 'Email', required: true, email: true },
        
    }
    
    const { data } = useGetClient(clientIdNumber, {
        enabled: !!clientID && !isNaN(clientIdNumber)
    })

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
        const alphaNumeric = /^[a-zA-Z0-9]+$/
        const regexNumericOnly = /^(0|[1-9]\d*)$/
        switch (name) {
            case 'month_end':
                if (value === '' || regexNumericOnly.test(value)) {
                    const numericValue = Number(value)
                    const maxMonth =
                        client.clientObj.period === 'FISCAL' ? 11 : 12

                    if (value === '' || numericValue <= maxMonth) {
                        setClient({
                            ...client,
                            clientObj: {
                                ...client.clientObj,
                                [name]: value
                            }
                        })
                    }
                }
                break;
            case 'rdo_code':
                if(value === '' || alphaNumeric.test(value)){
                    setClient({
                        ...client,
                        clientObj: {
                            ...client.clientObj,
                            [name]: value?.toUpperCase()
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
            case 'period':
                setClient({
                    ...client,
                    clientObj: {
                        ...client.clientObj,
                        period: value,
                        month_end: ''
                    }
                })
                break;
            case 'representative_phone':
                setClient({
                    ...client,
                    clientObj: {
                        ...client.clientObj,
                        representative_phone: formatPhoneNumber(value)
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

    useEffect(() => {
        if (data && clientID) {
            const fetchedClient = data

            setClient(prev => ({
                ...prev,
                clientObj: {
                    ...prev.clientObj,
                    ...fetchedClient
                }
            }))
        }
    }, [data, clientID])
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