import { Dayjs } from 'dayjs';
import useSalesAPI from "./api"
import useClientAPI from '../clients/api';
import useCustomerAPI from '../customers/api';
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
        
        setSales,
        setStatus,
    } = useSalesAPI()
    const {
        filter: clientFilter,
        setFilter: clientSetFilter,

        useGetClients
    } = useClientAPI()
    const {
        filter: customerFilter,
        setFilter: customerSetFilter,
        useGetCustomers
    } = useCustomerAPI()
    const [displayTerms, setDisplayTerms] = useState(false)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayCustomers, setDisplayCustomers] = useState(false)
    const setVatTypeHandler = (type: 'EXCLUSIVE' | 'INCLUSIVE') => {
    setSales(prev => {
        const updatedSalesObj = {
            ...prev.salesObj,
            vat_type: type,
            vatable_sales: '',
            gross_taxable: ''
        }

            return {
                ...prev,
                salesObj: recalcSales(updatedSalesObj)
            }
        })
    }
    
    // CLIENT
    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = useGetClients(    
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )
    const clientArr = dataClients?.clients;

    // CUSTOMER
    const { data: dataCustomers, isLoading: isLoadingCustomers, isFetching: isFetchingCustomers } = useGetCustomers(    
        customerFilter.currentPage,
        customerFilter.recordsLimit,
        customerFilter.filter,
        customerFilter.search
    )
    const customerArr = dataCustomers?.customers;

    const [doc, setDoc] = useState<{
        clientSearch: string
        customerSearch: string
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
        customer: {
            id: number | null,
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        },
        period: Dayjs | null
    }>({
        clientSearch: '',
        customerSearch: '',
        client: {
            id: null,
            last_name: '',
            first_name: '',
            trade_name: '',
            registered_name: '',
        },
        customer: {
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
        const toNumber = (val: any) => parseFloat(val) || 0

        const exempt = toNumber(salesObj.exempt_sales)
        const zeroRated = toNumber(salesObj.zero_rated_sales)
        const vatType = salesObj.vat_type || 'EXCLUSIVE'

        const grossInput = toNumber(salesObj.gross_taxable)

        let netVatable = 0
        let vatAmount = 0

        // =========================
        // VAT NORMALIZATION
        // =========================
        if (vatType === 'INCLUSIVE') {
            netVatable = grossInput / (1 + VAT_RATE)
            vatAmount = grossInput - netVatable
        } else {
            netVatable = toNumber(salesObj.vatable_sales)
            vatAmount = netVatable * VAT_RATE
        }

        const netSalesTotal = exempt + zeroRated + netVatable
        const totalGrossAmount = netSalesTotal + vatAmount

        const ewtRate = toNumber(salesObj.ewt_rate) / 100
        const taxAmount = netVatable * ewtRate

        return {
            ...salesObj,

            vat_rate: '12%',

            vat_amount: vatAmount ? Number(vatAmount).toFixed(2) : '',

            gross_amount:
                (salesObj.exempt_sales || salesObj.zero_rated_sales || salesObj.vatable_sales)
                    ? Number(netSalesTotal).toFixed(2)
                    : '',

            total_gross_amount:
                (salesObj.exempt_sales || salesObj.zero_rated_sales || salesObj.vatable_sales)
                    ? Number(totalGrossAmount).toFixed(2)
                    : '',

            tax_amount:
                salesObj.ewt_rate && salesObj.vatable_sales
                    ? Number(taxAmount).toFixed(2)
                    : ''
        }
    }
    const handleToggle = (dropdown: string) => {
        if(dropdown === 'clients'){
            setDisplayClients(prevState => !prevState)
        }
        if(dropdown === 'terms'){
            setDisplayTerms(prevState => !prevState)
        }
        if(dropdown === 'customers'){
            setDisplayCustomers(prevState => !prevState)
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

    const handleSelectCustomer = (customer: {
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
            customer: customer
        })
        setSales(prev => ({
            ...prev,
            salesObj: {
                ...prev.salesObj,
                customer: {
                    tin: customer.tin,
                    last_name: customer.last_name,
                    trade_name: customer.trade_name,
                    first_name: customer.first_name,
                    middle_name: customer.middle_name,
                    branch_code: '',
                    first_address: '',
                    second_address: '',
                    classification: customer.classification,
                    registered_name: customer.registered_name
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
            case 'vat_type':
                setVatTypeHandler(value as 'EXCLUSIVE' | 'INCLUSIVE')
                break;
            case 'gross_taxable':
                if (value === '' || regexNumericDecimalOnly.test(value)) {

                    // 1. Update input ONLY (no recalculation yet)
                    setSales(prev => ({
                        ...prev,
                        salesObj: {
                            ...prev.salesObj,
                            gross_taxable: value
                        }
                    }))

                    // 2. Recalculate AFTER render (prevents lag)
                    setTimeout(() => {
                        setSales(prev => {
                            const VAT_RATE = 0.12
                            const gross = parseFloat(value) || 0

                            let updated = { ...prev.salesObj }

                            if (value !== '') {
                                const net = gross / (1 + VAT_RATE)
                                const vat = gross - net

                                updated.vatable_sales = net.toFixed(2)
                                updated.vat_amount = vat.toFixed(2)
                            } else {
                                updated.vatable_sales = ''
                                updated.vat_amount = ''
                            }

                            return {
                                ...prev,
                                salesObj: recalcSales(updated)
                            }
                        })
                    }, 0)
                }
                break
            case 'vatable_sales':
            case 'exempt_sales':
            case 'zero_rated_sales':
            case 'ewt_rate':
                if (value === '' || regexNumericDecimalOnly.test(value)) {
                    setSales(prev => {

                        const VAT_RATE = 0.12
                        const vatType = prev.salesObj.vat_type || 'EXCLUSIVE'

                        let updatedSalesObj = {
                            ...prev.salesObj,
                            [name]: value
                        }

                        const net = parseFloat(value) || 0

                        // =========================
                        // EXCLUSIVE MODE (Net → Gross)
                        // =========================
                        if (name === 'vatable_sales' && vatType === 'EXCLUSIVE') {
                            const vat = net * VAT_RATE
                            const gross = net + vat

                            updatedSalesObj = {
                                ...updatedSalesObj,
                                gross_taxable: gross ? Number(gross).toFixed(2) : '',
                                vat_amount: vat ? Number(vat).toFixed(2) : ''
                            }
                        }

                        return {
                            ...prev,
                            salesObj: recalcSales(updatedSalesObj)
                        }
                    })
                }
                break
            default:
                setSales(prev => ({
                    ...prev,
                    salesObj: {
                        ...prev.salesObj,
                        [name]: value
                    }
                }))
                break;
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
        setStatus({...status, loader: true})
    }
    
    return {
        // STATES
        doc,
        sales,
        status,
        clientArr,
        customerArr,
        displayTerms,
        displayClients,
        displayCustomers,
        clientLoader: isLoadingClients || isFetchingClients,
        customerLoader: isLoadingCustomers || isFetchingCustomers,

        // SET STATES
        setDisplayTerms,
        setDisplayClients,
        setDisplayCustomers,
        setVatType: setVatTypeHandler,

        // HANDLES
        handleBlur,
        handleDate,
        handleSubmit,
        handleChange,
        handleToggle,
        handleResubmit,
        handleSelectTerms,
        handleSelectClient,
        handleSelectCustomer
        
    }
}

export default useSaveSales;