import { Dayjs } from 'dayjs';
import useSalesAPI from "./api"
import useClientAPI from '../clients/api';
import useGlobal from '@/controllers/global/useGlobal'
import { useState, ChangeEvent, SyntheticEvent } from "react"
const useSaveSales = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    const {
        sales,
        status,

        setSales
    } = useSalesAPI()
    const {
        filter: clientFilter,
        setFilter: clientSetFilter,

        useGetClients
    } = useClientAPI()
    const [displayTerms, setDisplayTerms] = useState(false)
    const [displayClients, setDisplayClients] = useState(false)
    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = useGetClients(    
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )
    const clientArr = dataClients?.clients;

    const [doc, setDoc] = useState<{
        search: string
        selectedTable?: {
            value: string,
            label: string
        }
        selectedTerms?: {
            value: string,
            label: string
        }
        client: {
            id: number | null,
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        },
        period: Dayjs | null
    }>({
        search: '',
        client: {
            id: null,
            last_name: '',
            first_name: '',
            trade_name: '',
            registered_name: '',
        },
        selectedTerms: {
            value: 'CASH',
            label: 'Cash'
        },
        period: null,
    })
    const handleToggle = (dropdown: string) => {
        if(dropdown === 'clients'){
            setDisplayClients(prevState => !prevState)
        }
        if(dropdown === 'terms'){
            setDisplayTerms(prevState => !prevState)
        }
    }

    const handleSelectTerms = (selectedTerms: { value: string, label: string }) => {
        setDoc({
            ...doc,
            selectedTerms: selectedTerms
        })
        setSales({
            ...sales,
            salesObj: {
                ...sales.salesObj,
                terms: selectedTerms.value
            }
        })
    }

    const handleSelectClient = (client: {
        id: number | null,
        tin: string
        last_name: string
        first_name: string
        trade_name: string
        middle_name: string
        classification: string
        registered_name: string
    }) => {
        setDoc({
            ...doc,
            client: client
        })
        setSales({
            ...sales,
            salesObj: {
                ...sales.salesObj,
                business_profile: {
                    tin: client.tin,
                    last_name: client.last_name,
                    trade_name: client.trade_name,
                    first_name: client.first_name,
                    middle_name: client.middle_name,
                    branch_code: '',
                    first_address: '',
                    second_address: '',
                    classification: client.classification,
                    registered_name: client.registered_name
                }
            }
        })
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        const alphaNumeric = /^[a-zA-Z0-9]+$/
        const regexNumericOnly = /^(0|[1-9]\d*)$/
        const regexNumericDecimalOnly = /^\d*\.?\d*$/;
        if(name === 'search'){
            clientSetFilter(prev => ({
                ...prev,
                search: value,
                currentPage: 1
            }))
            setDoc({
                ...doc,
                [name]: value
            })
            return
        }

        switch (name) {
            case 'atc':
                if(value === '' || alphaNumeric.test(value)){
                    setSales({
                        ...sales,
                        salesObj: {
                            ...sales.salesObj,
                            [name]: value?.toUpperCase()
                        }
                    })
                }
                break;
            case 'exempt_sales':
            case 'vatable_sales':
            case 'zero_rated_sales':
                if (value === '' || regexNumericDecimalOnly.test(value)) {
                    setSales({
                        ...sales,
                        salesObj: {
                            ...sales.salesObj,
                            [name]: value
                        }
                    })
                }
        }
        
        handleRemoveErr(sales.salesErr, name)
    }
    
    const handleDate = (date: Dayjs | null, dateString: string | string[], name: string) => {
        if(name === 'taxable_month'){
            setSales({
                ...sales,
                salesObj: {
                    ...sales.salesObj,
                    taxable_month: date
                }
            })
        }else{
            setSales({
                ...sales,
                salesObj: {
                    ...sales.salesObj,
                    [name]: dateString
                }
            })
        }
        handleRemoveErr(sales.salesErr, name)
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        
    }
    
    return {
        // STATES
        doc,
        sales,
        status,
        clientArr,
        displayTerms,
        displayClients,
        clientLoader: isLoadingClients || isFetchingClients,

        // SET STATES
        setDisplayTerms,
        setDisplayClients,

        // HANDLES
        handleBlur,
        handleDate,
        handleSubmit,
        handleChange,
        handleToggle,
        handleResubmit,
        handleSelectTerms,
        handleSelectClient
        
    }
}

export default useSaveSales;