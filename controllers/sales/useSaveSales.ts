import { Dayjs } from 'dayjs';
import useSalesAPI from "./api"
import { SalesErr } from './types'
import useQueryClients from '../clients/api/queries';
import useGlobal from '@/controllers/global/useGlobal';
import useQueryCustomers from '../customers/api/queries';
import { CustomerObj } from '@/controllers/customers/types'
import { useState, ChangeEvent, SyntheticEvent } from "react";
import { initCustomerObj } from '@/controllers/customers/states';
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3';
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

        getClients
    } = useQueryClients()

    const {
        filter: customerFilter,
        // setFilter: customerSetFilter,
        useGetCustomers
    } = useQueryCustomers()
    const [editCustomer, setEditCustomer] = useState(false)
    const [displayTerms, setDisplayTerms] = useState(false)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayCustomers, setDisplayCustomers] = useState(false)
    
    const options = [
        {
            value: 'INCLUSIVE',
            label: 'VAT Inclusive',
            icon: 'inclusive.svg',
            description: 'Amounts entered are already inclusive of VAT.'
        },
        {
            value: 'EXCLUSIVE',
            label: 'VAT Exclusive',
            icon: 'exclusive.svg',
            description: 'Amounts entered do not include VAT and will be subject to VAT computation.'
        },
    ];
    
    // CLIENT
    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = getClients(    
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
        customer: CustomerObj,
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
            ...initCustomerObj,
            classification: ''
        },
        selectedTerms: {
            value: 'CASH',
            label: 'Cash'
        },
        period: null,
    })
    const fieldValidations = {
        atc: { usename: 'ATC', required: true },
        tin: { usename: 'TIN No.', required: true },
        client: { usename: 'Client', required: true },
        customer: { usename: 'Customer', required: true },
        vat_amount: { usename: 'VAT Amount', required: true },
        particulars: { usename: 'Particulars', required: true },
        exempt_sales: { usename: 'Exempt Sales', required: true },
        account_name: { usename: 'Account Name', required: true },
        invoice_date: { usename: 'Invoice Date', required: true },
        gross_amount: { usename: 'Gross Amount', required: true },
        gross_taxable: { usename: 'Gross Taxable', required: true },
        first_address: { usename: 'First Address', required: true },
        taxable_month: { usename: 'Taxable Month', required: true },
        vatable_sales: { usename: 'Vatable Sales', required: true },
        invoice_number: { usename: 'Invoice Number', required: true },
        second_address: { usename: 'Second Address', required: true },
        classification: { usename: 'Classification', required: true },
        ewt_rate: { usename: 'Withholding Tax Rate', required: true },
        zero_rated_sales: { usename: 'Zero Rated Sales', required: true },
        tax_amount: { usename: 'Withholding Tax Amount', required: true },
        total_gross_amount: { usename: 'Total Gross Amount', required: true },
        registered_name: { usename: 'Registered Name', ifCondition: {
            condition: doc.customer?.classification === 'NON-INDIVIDUAL',
            required: true
        }},
    }
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
    const handleEditCustomer = (edit: boolean) => {
        setEditCustomer(edit)
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
        handleRemoveErr(sales.salesErr, 'client')
    }

    const handleSelectCustomer = (customer: CustomerObj) => {
        setDoc({
            ...doc,
            customer: customer
        })
        setSales(prev => ({
            ...prev,
            salesObj: {
                ...prev.salesObj,
                customer: {
                    id: customer.id,
                    tin: customer.tin,
                    phone: customer.phone,
                    email: customer.email,
                    last_name: customer.last_name,
                    trade_name: customer.trade_name,
                    first_name: customer.first_name,
                    middle_name: customer.middle_name,
                    postal_code: customer.postal_code,
                    first_address: customer.first_address,
                    second_address: customer.second_address,
                    classification: customer.classification,
                    registered_name: customer.registered_name
                }
            }
        }))
        handleRemoveErr(sales.salesErr, 'tin')
        handleRemoveErr(sales.salesErr, 'customer')
        handleRemoveErr(sales.salesErr, 'first_address')
        handleRemoveErr(sales.salesErr, 'second_address')
        handleRemoveErr(sales.salesErr, 'classification')
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
                setSales(prev => ({
                    ...prev,
                    salesObj: {
                        ...prev.salesObj,
                        [name]: value
                    }
                }))
                handleRemoveErr(sales.salesErr, 'atc')
                handleRemoveErr(sales.salesErr, 'ewt_rate')
                handleRemoveErr(sales.salesErr, 'vat_amount')
                handleRemoveErr(sales.salesErr, 'tax_amount')
                handleRemoveErr(sales.salesErr, 'gross_amount')
                handleRemoveErr(sales.salesErr, 'exempt_sales')
                handleRemoveErr(sales.salesErr, 'gross_taxable')
                handleRemoveErr(sales.salesErr, 'vatable_sales')
                handleRemoveErr(sales.salesErr, 'zero_rated_sales')
                handleRemoveErr(sales.salesErr, 'total_gross_amount')
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
                handleRemoveErr(sales.salesErr, 'ewt_rate')
                handleRemoveErr(sales.salesErr, 'vat_amount')
                handleRemoveErr(sales.salesErr, 'tax_amount')
                handleRemoveErr(sales.salesErr, 'gross_amount')
                handleRemoveErr(sales.salesErr, 'exempt_sales')
                handleRemoveErr(sales.salesErr, 'gross_taxable')
                handleRemoveErr(sales.salesErr, 'vatable_sales')
                handleRemoveErr(sales.salesErr, 'zero_rated_sales')
                handleRemoveErr(sales.salesErr, 'total_gross_amount')
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
                    handleRemoveErr(sales.salesErr, 'ewt_rate')
                    handleRemoveErr(sales.salesErr, 'vat_amount')
                    handleRemoveErr(sales.salesErr, 'tax_amount')
                    handleRemoveErr(sales.salesErr, 'gross_amount')
                    handleRemoveErr(sales.salesErr, 'exempt_sales')
                    handleRemoveErr(sales.salesErr, 'gross_taxable')
                    handleRemoveErr(sales.salesErr, 'vatable_sales')
                    handleRemoveErr(sales.salesErr, 'zero_rated_sales')
                    handleRemoveErr(sales.salesErr, 'total_gross_amount')
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
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, {
            tin: doc.customer?.tin || '',
            atc: sales.salesObj.atc || '',
            ewt_rate: sales.salesObj.ewt_rate || '',
            client: doc.client?.id ? String(doc.client?.id) : '',
            customer: doc.customer?.id ? String(doc.customer?.id) : '',
            terms: sales.salesObj.terms || '',
            tax_amount: sales.salesObj.tax_amount || '',
            vat_amount: sales.salesObj.vat_amount || '',
            particulars: sales.salesObj.particulars || '',
            gross_amount: sales.salesObj.gross_amount || '',
            exempt_sales: sales.salesObj.exempt_sales || '',
            account_name: sales.salesObj.account_name || '',
            invoice_date: sales.salesObj.invoice_date || '',
            first_address: doc.customer?.first_address || '',
            gross_taxable: sales.salesObj.gross_taxable || '',
            vatable_sales: sales.salesObj.vatable_sales || '',
            second_address: doc.customer?.second_address || '',
            classification: doc.customer?.classification || '',
            taxable_month: sales.salesObj.taxable_month || '',
            invoice_number: sales.salesObj.invoice_number || '',
            zero_rated_sales: sales.salesObj.zero_rated_sales || '',
            total_gross_amount: sales.salesObj.total_gross_amount || '',
        })
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setSales({
                    ...sales,
                    salesErr: validation_errors as SalesErr
                })
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }
    }
    
    return {
        // STATES
        doc,
        sales,
        status,
        options,
        clientArr,
        customerArr,
        editCustomer,
        displayTerms,
        displayClients,
        displayCustomers,
        clientLoader: isLoadingClients || isFetchingClients,
        customerLoader: isLoadingCustomers || isFetchingCustomers,

        // SET STATES
        setSales,
        setDisplayTerms,
        setDisplayClients,
        setDisplayCustomers,

        // HANDLES
        handleBlur,
        handleDate,
        handleSubmit,
        handleChange,
        handleToggle,
        handleResubmit,
        handleSelectTerms,
        handleEditCustomer,
        handleSelectClient,
        handleSelectCustomer
        
    }
}

export default useSaveSales;