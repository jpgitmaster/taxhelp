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
        setSales(prev => ({
            ...prev,
            salesObj: {
                ...prev.salesObj,
                terms: selectedTerms.value
            }
        }))
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
        setSales(prev => ({
            ...prev,
            salesObj: {
                ...prev.salesObj,
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
        }))
    }

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
    const { name, value } = event.target
    const alphaNumeric = /^[a-zA-Z0-9]+$/
    const regexNumericDecimalOnly = /^\d*\.?\d*$/

    if (name === 'search') {
        clientSetFilter(prev => ({
        ...prev,
        search: value,
        currentPage: 1
        }))

        setDoc(prev => ({
        ...prev,
        [name]: value
        }))
        return
    }

    switch (name) {
        case 'atc':
        if (value === '' || alphaNumeric.test(value)) {
            setSales(prev => ({
            ...prev,
            salesObj: {
                ...prev.salesObj,
                [name]: value.toUpperCase()
            }
            }))
        }
        break

        case 'exempt_sales':
        case 'vatable_sales':
        case 'zero_rated_sales':
        case 'ewt_rate':
        if (value === '' || regexNumericDecimalOnly.test(value)) {
            setSales(prev => {
            const updatedSalesObj = {
                ...prev.salesObj,
                [name]: value
            }

            const exempt = parseFloat(updatedSalesObj.exempt_sales || '0')
            const zeroRated = parseFloat(updatedSalesObj.zero_rated_sales || '0')
            const vatable = parseFloat(updatedSalesObj.vatable_sales || '0')

            // ✅ FIXED VAT (constant)
            const VAT_RATE = 0.12

            const grossAmount = exempt + zeroRated + vatable
            const vatAmount = vatable * VAT_RATE
            const grossTaxable = vatable + vatAmount
            const totalGrossAmount = grossAmount + vatAmount

            // ✅ Optional: EWT computation
            const ewtRate = parseFloat(updatedSalesObj.ewt_rate || '0') / 100
            const taxAmount = vatable * ewtRate

            return {
                ...prev,
                salesObj: {
                ...updatedSalesObj,
                vat_rate: '12%', // always enforced
                gross_amount: grossAmount.toFixed(2),
                vat_amount: vatAmount.toFixed(2),
                gross_taxable: grossTaxable.toFixed(2),
                total_gross_amount: totalGrossAmount.toFixed(2),
                tax_amount: taxAmount.toFixed(2)
                }
            }
            })
        }
        break
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