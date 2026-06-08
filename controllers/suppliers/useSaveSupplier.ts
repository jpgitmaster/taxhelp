import useSupplierAPI from './api'
import { SupplierErr } from './types'
import { useRouter } from 'next/router';
import useGlobal from '@/controllers/global/useGlobal'
import { ChangeEvent, SyntheticEvent, useEffect} from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'

const useSaveSupplier = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    const {
        status,
        supplier,
        
        setStatus,
        setSupplier,

        useGetSupplier,
        useUpdateSupplier,
        useCreateSupplier
    } = useSupplierAPI()
    const router = useRouter()
    const { supplierID } = router.query
    const supplierIdNumber = Number(supplierID)
    
    const fieldValidations = {
        tin: { usename: 'TIN No.', required: true },
        last_name: { usename: 'Last Name', ifCondition: {
            condition: supplier.supplierObj.classification === 'INDIVIDUAL',
            required: true
        }},
        first_name: { usename: 'First Name', ifCondition: {
            condition: supplier.supplierObj.classification === 'INDIVIDUAL',
            required: true
        }},
        email: { usename: 'Email', required: true, email: true },
        representative_phone: { usename: 'Phone', required: true },
        first_address: { usename: 'First Address', required: true },
        second_address: { usename: 'Second Address', required: true },
        registered_name: { usename: 'Registered Name', ifCondition: {
            condition: supplier.supplierObj.classification === 'NON-INDIVIDUAL',
            required: true
        }},
        
    }
    
    const { data, isLoading } = useGetSupplier(supplierIdNumber, {
        enabled: !!supplierID && !isNaN(supplierIdNumber)
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
            case 'classification':
                if (value === 'INDIVIDUAL') {
                    setSupplier({
                        ...supplier,
                        supplierObj: {
                            ...supplier.supplierObj,
                            [name]: value,
                            registered_name: ''
                        }
                    })
                }
                if (value === 'NON-INDIVIDUAL') {
                    setSupplier({
                        ...supplier,
                        supplierObj: {
                            ...supplier.supplierObj,
                            [name]: value,
                            last_name: '',
                            first_name: '',
                            middle_name: ''
                        }
                    })
                }
                break;
            case 'tin':
                setSupplier({
                    ...supplier,
                    supplierObj: {
                        ...supplier.supplierObj,
                        tin: formatTIN(value)
                    }
                })
                break;
            case 'phone':
                setSupplier({
                    ...supplier,
                    supplierObj: {
                        ...supplier.supplierObj,
                        phone: formatPhoneNumber(value)
                    }
                })
                break;
            default:
                setSupplier({
                    ...supplier,
                    supplierObj: {
                        ...supplier.supplierObj,
                        [name]: value
                    }
                })
                break;
        }
        handleRemoveErr(supplier.supplierErr, name)
    }
    
    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, supplier.supplierObj)
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setSupplier({
                    ...supplier,
                    supplierErr: validation_errors as SupplierErr
                })
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }

        // CLIENT CREATION
        useCreateSupplier.mutate(supplier.supplierObj)
    }

    const handleUpdateSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, supplier.supplierObj)
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setSupplier({
                    ...supplier,
                    supplierErr: validation_errors as SupplierErr
                })
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }

        // CLIENT UPDATE
        useUpdateSupplier.mutate(supplier.supplierObj)
    }

    useEffect(() => {
        if (data && supplierID) {
            const fetchedSupplier = data
            setSupplier(prev => ({
                ...prev,
                supplierObj: {
                    ...prev.supplierObj,
                    ...fetchedSupplier,
                }
            }))
        }
    }, [data, supplierID])

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
        supplier,
        isLoading,

        // SET STATES
        setSupplier,
        
        // HANDLES
        handleBlur,
        handleSubmit,
        handleChange,
        handleResubmit,
        handleUpdateSubmit
        
    }
}

export default useSaveSupplier;