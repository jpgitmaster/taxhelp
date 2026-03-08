import { useState, ChangeEvent } from 'react'
import GlobalController from '@/controllers/global/Global_C'

const SavingCustomer_C = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = GlobalController()
    const [client, setClient] = useState({
        clientObj: {
            city: '',
            email: '',
            phone: '',
            street: '',
            zipcode: '',
            district: '',
            barangay: '',
            lastName: '',
            substreet: '',
            firstName: '',
            middleName: '',
            companyName: '',
            corporateEmail: '',
            
        },
        clientErr: {
            city: '',
            email: '',
            phone: '',
            street: '',
            zipcode: '',
            district: '',
            barangay: '',
            lastName: '',
            substreet: '',
            firstName: '',
            middleName: '',
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