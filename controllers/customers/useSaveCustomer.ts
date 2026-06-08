import useCustomerAPI from './api'
import { CustomerErr } from './types'
import { useRouter } from 'next/router';
import useGlobal from '@/controllers/global/useGlobal'
import { ChangeEvent, SyntheticEvent, useEffect} from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'

const useSaveCustomer = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    const {
        status,
        customer,
        
        setStatus,
        setCustomer,

        useGetCustomer,
        useUpdateCustomer,
        useCreateCustomer
    } = useCustomerAPI()
    const router = useRouter()
    const { customerID } = router.query
    const customerIdNumber = Number(customerID)
    
    const fieldValidations = {
        tin: { usename: 'TIN No.', required: true },
        last_name: { usename: 'Last Name', ifCondition: {
            condition: customer.customerObj.classification === 'INDIVIDUAL',
            required: true
        }},
        first_name: { usename: 'First Name', ifCondition: {
            condition: customer.customerObj.classification === 'INDIVIDUAL',
            required: true
        }},
        email: { usename: 'Email', email: true },
        representative_phone: { usename: 'Phone', required: true },
        first_address: { usename: 'First Address', required: true },
        second_address: { usename: 'Second Address', required: true },
        registered_name: { usename: 'Registered Name', ifCondition: {
            condition: customer.customerObj.classification === 'NON-INDIVIDUAL',
            required: true
        }},
        
    }
    
    const { data, isLoading } = useGetCustomer(customerIdNumber, {
        enabled: !!customerID && !isNaN(customerIdNumber)
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
        switch (name) {
            case 'classification':
                if (value === 'INDIVIDUAL') {
                    setCustomer({
                        ...customer,
                        customerObj: {
                            ...customer.customerObj,
                            [name]: value,
                            registered_name: ''
                        }
                    })
                }
                if (value === 'NON-INDIVIDUAL') {
                    setCustomer({
                        ...customer,
                        customerObj: {
                            ...customer.customerObj,
                            [name]: value,
                            last_name: '',
                            first_name: '',
                            middle_name: ''
                        }
                    })
                }
                break;
            case 'tin':
                setCustomer({
                    ...customer,
                    customerObj: {
                        ...customer.customerObj,
                        tin: formatTIN(value)
                    }
                })
                break;
            case 'phone':
                setCustomer({
                    ...customer,
                    customerObj: {
                        ...customer.customerObj,
                        phone: formatPhoneNumber(value)
                    }
                })
                break;
            default:
                setCustomer({
                    ...customer,
                    customerObj: {
                        ...customer.customerObj,
                        [name]: value
                    }
                })
                break;
        }
        handleRemoveErr(customer.customerErr, name)
    }
    
    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, customer.customerObj)
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setCustomer({
                    ...customer,
                    customerErr: validation_errors as CustomerErr
                })
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }

        // CLIENT CREATION
        useCreateCustomer.mutate(customer.customerObj)
    }

    const handleUpdateSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, customer.customerObj)
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setCustomer({
                    ...customer,
                    customerErr: validation_errors as CustomerErr
                })
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }

        // CLIENT UPDATE
        useUpdateCustomer.mutate(customer.customerObj)
    }

    useEffect(() => {
        if (data && customerID) {
            const fetchedCustomer = data
            setCustomer(prev => ({
                ...prev,
                customerObj: {
                    ...prev.customerObj,
                    ...fetchedCustomer,
                }
            }))
        }
    }, [data, customerID])

    useEffect(() => {
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
        status,
        customer,
        isLoading,

        // SET STATES
        setCustomer,
        
        // HANDLES
        handleBlur,
        handleSubmit,
        handleChange,
        handleResubmit,
        handleUpdateSubmit
        
    }
}

export default useSaveCustomer;