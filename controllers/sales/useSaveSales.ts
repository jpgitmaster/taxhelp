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
    const setVatTypeHandler = (type: 'EXCLUSIVE' | 'INCLUSIVE') => {
        setSales(prev => {
            const updatedSalesObj = {
                ...prev.salesObj,
                vat_type: type
            }

            return {
                ...prev,
                salesObj: recalcSales(updatedSalesObj)
            }
        })
    }
    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = useGetClients(    
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )
    const clientArr = dataClients?.clients;

    const [doc, setDoc] = useState<{
        clientSearch: string
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
        clientSearch: '',
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

    const recalcSales = (salesObj: any) => {
        const VAT_RATE = 0.12

        const exempt = parseFloat(salesObj.exempt_sales || '0')
        const zeroRated = parseFloat(salesObj.zero_rated_sales || '0')
        const vatableInput = parseFloat(salesObj.vatable_sales || '0')
        const vatType = salesObj.vat_type || 'EXCLUSIVE'

        let vatAmount = 0
        let grossAmount = 0
        let grossTaxable = 0
        let totalGrossAmount = 0
        let vatableBase = vatableInput

        if (vatType === 'INCLUSIVE') {
            const net = vatableInput / (1 + VAT_RATE)
            vatAmount = vatableInput - net

            vatableBase = net
            grossAmount = exempt + zeroRated + net
            grossTaxable = vatableInput
            totalGrossAmount = grossAmount + vatAmount
        } else {
            vatAmount = vatableInput * VAT_RATE

            grossAmount = exempt + zeroRated + vatableInput
            grossTaxable = vatableInput + vatAmount
            totalGrossAmount = grossAmount + vatAmount
        }

        const ewtRate = parseFloat(salesObj.ewt_rate || '0') / 100
        const taxAmount = vatableBase * ewtRate

        return {
            ...salesObj,
            vat_rate: '12%',
            vat_amount: vatAmount.toFixed(2),
            gross_amount: grossAmount.toFixed(2),
            gross_taxable: grossTaxable.toFixed(2),
            total_gross_amount: totalGrossAmount.toFixed(2),
            tax_amount: taxAmount.toFixed(2)
        }
    }
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

                        return {
                            ...prev,
                            salesObj: recalcSales(updatedSalesObj)
                        }
                    })
                }
                break
        }

        handleRemoveErr(sales.salesErr, name)
    }
    
    const handleDate = (
        date: Dayjs | null,
        dateString: string | string[],
        name: string
    ) => {
        setSales(prev => {
            const updatedSalesObj = {
                ...prev.salesObj,
                [name]: name === 'taxable_month' ? date : dateString
            }

            return {
                ...prev,
                salesObj: updatedSalesObj
            }
        })

        handleRemoveErr(sales.salesErr, name)
    }

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
        setVatType: setVatTypeHandler,

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