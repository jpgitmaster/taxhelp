import { useState, ChangeEvent } from 'react'
import useGlobal from '@/controllers/global/useGlobal'

const SavingCustomer_C = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    const [client, setClient] = useState({
        clientObj: {
            tin: '',
            city: '',
            email: '',
            phone: '',
            street: '',
            zip_code: '',
            district: '',
            barangay: '',
            last_name: '',
            sub_street: '',
            first_name: '',
            middle_name: '',
            branch_code: '',
            companyName: '',
            classification: '',
            corporateEmail: '',
            registered_name: ''
            
        },
        clientErr: {
            city: '',
            email: '',
            phone: '',
            street: '',
            zip_code: '',
            district: '',
            barangay: '',
            last_name: '',
            sub_street: '',
            first_name: '',
            branch_code: '',
            middle_name: '',
            companyName: '',
            corporateEmail: '',
        }
    })
    
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setClient({
            ...client,
            clientObj: {
                ...client.clientObj,
                [name]: value
            }
        })
        handleRemoveErr(client.clientErr, name)
    }
    

    return {
        // STATES
        client,

        // SET STATES
        setClient,
        
        // HANDLES
        handleBlur,
        handleChange,
        handleResubmit,
        
    }
}

export default SavingCustomer_C;