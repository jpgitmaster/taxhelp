import dayjs, { Dayjs } from 'dayjs';
import useSalesAPI from "./api"
import { useRouter } from 'next/router';
import { Particular, SalesErr } from './types'
import useQueryClients from '../clients/api/queries';
import useGlobal from '@/controllers/global/useGlobal';
import useQueryCustomers from '../customers/api/queries';
import { ClientObj } from '@/controllers/clients/types'
import { CustomerObj } from '@/controllers/customers/types'
import { initCustomerObj } from '@/controllers/customers/states';
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3';
import useSalesManualAPI, { LockConflictError, DraftNotEditableError } from '../salesManual/api';
import { SalesManualDraftPayload, SalesManualRecord } from '../salesManual/types';
import { useState, useEffect, useRef, useCallback, ChangeEvent, SyntheticEvent } from "react";

const AUTOSAVE_DEBOUNCE_MS = 1200
const HEARTBEAT_INTERVAL_MS = 20000

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

// Which fieldValidations keys belong to which wizard step — used to scope
// validation (and therefore which fields light up red) to just the step
// the user is currently trying to leave, instead of validating the whole
// form (and marking steps the user hasn't reached yet as already invalid).
const STEP_FIELDS: Record<number, string[]> = {
    1: [
        'client', 'customer', 'tin', 'classification', 'registered_name',
        'first_name', 'last_name', 'first_address', 'second_address',
    ],
    2: [
        'taxable_month', 'invoice_date', 'invoice_number', 'terms', 'account_name', 'particulars',
    ],
    3: [
        'atc', 'ewt_rate', 'vat_amount', 'exempt_sales', 'gross_amount', 'gross_taxable',
        'vatable_sales', 'zero_rated_sales', 'tax_amount', 'total_gross_amount',
    ],
}

const useSaveSales = () => {
    const router = useRouter()
    const draftIdFromQuery = router.query.draft ? Number(router.query.draft) : null
    const {
        useGetSalesManualById,
        useCreateDraft,
        useAutosaveDraft,
        useLockDraft,
        useUnlockDraft,
        useFinalizeDraft,
    } = useSalesManualAPI()
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

        getClient,
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
    const [displayDiscounts, setDisplayDiscounts] = useState(false)
    const [displayCustomers, setDisplayCustomers] = useState(false)
    const [errArr, setErrArr] = useState(sales.salesObj.particulars)

    // DRAFT / AUTOSAVE / LOCKING
    const [draftId, setDraftId] = useState<number | null>(draftIdFromQuery)
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
    const [lockConflict, setLockConflict] = useState<{ locked: boolean, message: string | null }>({ locked: false, message: null })
    const [isHydrating, setIsHydrating] = useState(!!draftIdFromQuery)
    const hasHydratedRef = useRef(false)
    const skipNextAutosaveRef = useRef(false)
    const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const lastSavedPayloadRef = useRef<string | null>(null)

    const { data: existingDraft } = useGetSalesManualById(draftIdFromQuery)
    const { data: draftClient } = getClient(Number(existingDraft?.client_id))
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
        selectedDiscount?: {
            value: string,
            label: string
        }
        client: Partial<ClientObj> & { id: number | null },
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
        selectedDiscount: {
            value: 'SC',
            label: 'Senior Citizen'
        },
        period: null,
    })

    // Hydrate from an existing draft (?draft=<id>) once its record and client have loaded.
    useEffect(() => {
        if (!draftIdFromQuery || hasHydratedRef.current) return
        if (!existingDraft || !draftClient) return

        hasHydratedRef.current = true
        skipNextAutosaveRef.current = true

        const rawCustomer = (existingDraft.customer || {}) as unknown as Partial<CustomerObj>
        // Controlled inputs can't take null (React warns and drops back to uncontrolled) —
        // the backend returns nulls for unset text fields, so coerce them to ''.
        const customer: CustomerObj = {
            id: rawCustomer.id ?? null,
            tin: rawCustomer.tin || '',
            email: rawCustomer.email || '',
            last_name: rawCustomer.last_name || '',
            trade_name: rawCustomer.trade_name || '',
            first_name: rawCustomer.first_name || '',
            middle_name: rawCustomer.middle_name || '',
            postal_code: rawCustomer.postal_code || '',
            phone_number: rawCustomer.phone_number || '',
            first_address: rawCustomer.first_address || '',
            second_address: rawCustomer.second_address || '',
            classification: rawCustomer.classification || '',
            registered_name: rawCustomer.registered_name || '',
        }
        const client = draftClient as unknown as {
            id: number | null
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        }

        setDoc(prev => ({
            ...prev,
            client: {
                id: client.id ?? null,
                last_name: client.last_name || '',
                first_name: client.first_name || '',
                trade_name: client.trade_name || '',
                registered_name: client.registered_name || '',
            },
            customer,
            selectedTerms: existingDraft.terms
                ? { value: existingDraft.terms, label: existingDraft.terms === 'CASH' ? 'Cash' : 'Charge' }
                : prev.selectedTerms,
            selectedDiscount: existingDraft.discount_type
                ? { value: existingDraft.discount_type, label: existingDraft.discount_type }
                : prev.selectedDiscount,
        }))

        setSales(prev => ({
            ...prev,
            salesObj: {
                ...prev.salesObj,
                id: existingDraft.id,
                atc: existingDraft.atc || '',
                terms: existingDraft.terms || 'CASH',
                id_number: existingDraft.discount_id_number || '',
                vat_type: existingDraft.vat_type || 'INCLUSIVE',
                ewt_rate: existingDraft.ewt_rate != null ? String(existingDraft.ewt_rate) : '',
                vat_rate: '12%',
                tax_amount: existingDraft.tax_amount != null ? String(existingDraft.tax_amount) : '',
                vat_amount: existingDraft.vat_amount != null ? String(existingDraft.vat_amount) : '',
                account_name: existingDraft.account_name || '',
                gross_amount: existingDraft.gross_amount != null ? String(existingDraft.gross_amount) : '',
                exempt_sales: existingDraft.exempt_sales != null ? String(existingDraft.exempt_sales) : '',
                invoice_date: existingDraft.invoice_date ? dayjs(existingDraft.invoice_date).format('MM/DD/YYYY') : '',
                gross_taxable: existingDraft.gross_taxable != null ? String(existingDraft.gross_taxable) : '',
                vatable_sales: existingDraft.vatable_sales != null ? String(existingDraft.vatable_sales) : '',
                taxable_month: existingDraft.taxable_month ? dayjs(existingDraft.taxable_month) : null,
                invoice_number: existingDraft.invoice_number || '',
                zero_rated_sales: existingDraft.zero_rated_sales != null ? String(existingDraft.zero_rated_sales) : '',
                total_gross_amount: existingDraft.total_gross_amount != null ? String(existingDraft.total_gross_amount) : '',
                particulars: existingDraft.particulars?.length ? existingDraft.particulars.map(p => ({
                    description: p.description || '',
                    quantity: p.quantity != null ? String(p.quantity) : '',
                    unit_price: p.unit_price != null ? String(p.unit_price) : '',
                    amount: p.amount != null ? String(p.amount) : '',
                })) : prev.salesObj.particulars,
                customer,
            }
        }))

        setIsHydrating(false)

        if (existingDraft.status !== 'draft') {
            setLockConflict({ locked: true, message: 'This sale has already been posted and can no longer be edited here.' })
        } else if (!existingDraft.lock_is_mine) {
            useLockDraft.mutate(draftIdFromQuery, {
                onError: (error) => {
                    const message = (error instanceof LockConflictError || error instanceof DraftNotEditableError)
                        ? error.message
                        : 'This draft could not be opened for editing.'
                    setLockConflict({ locked: true, message })
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draftIdFromQuery, existingDraft, draftClient])

    const fieldValidations = {
        atc: { usename: 'ATC', required: true },
        tin: { usename: 'TIN No.', required: true },
        client: { usename: 'Client', required: true },
        customer: { usename: 'Customer', required: true },
        vat_amount: { usename: 'VAT Amount', required: true },
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
        first_name: { usename: 'First Name', ifCondition: {
            condition: sales.salesObj.customer?.classification === 'INDIVIDUAL',
            required: true
        }},
        last_name: { usename: 'Last Name', ifCondition: {
            condition: sales.salesObj.customer?.classification === 'INDIVIDUAL',
            required: true
        }},
        registered_name: { usename: 'Registered Name', ifCondition: {
            condition: sales.salesObj.customer?.classification === 'NON-INDIVIDUAL',
            required: true
        }},
        particulars: sales.salesObj.particulars.map(() => ({
            amount: { usename: 'Amount', required: true },
            quantity: { usename: 'Quantity', required: true },
            unit_price: { usename: 'Unit Price', required: true },
            description: { usename: 'Item Description / Service Nature', required: true },
        })),
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
    // Particulars is the source of truth for the taxable amount — keep Tax
    // Details' Gross Taxable (VAT Inclusive) / Vatable Sales (VAT Exclusive) in
    // sync with the particulars subtotal instead of making the user retype the
    // same total a second time. Re-syncs whenever particulars or the VAT type
    // itself changes; manual edits made directly in Tax Details afterward are
    // left alone until the particulars change again.
    useEffect(() => {
        const subtotal = sales.salesObj.particulars.reduce(
            (sum, p) => sum + (parseFloat(p.amount) || 0), 0
        )
        const subtotalStr = subtotal ? subtotal.toFixed(2) : ''
        const vatType = sales.salesObj.vat_type || 'INCLUSIVE'
        const targetField = vatType === 'INCLUSIVE' ? 'gross_taxable' : 'vatable_sales'

        if (sales.salesObj[targetField] === subtotalStr) return

        setSales(prev => ({
            ...prev,
            salesObj: recalcSales({ ...prev.salesObj, [targetField]: subtotalStr })
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sales.salesObj.particulars, sales.salesObj.vat_type])

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
        if(dropdown === 'discounts'){
            setDisplayDiscounts(prevState => !prevState)
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

    const handleSelectDiscount = (selectedDiscount: { value: string, label: string }) => {
        // discount_type is read from doc.selectedDiscount (see buildDraftPayload) —
        // salesObj.terms is a different field (Cash/Charge) and must stay untouched.
        setDoc({
            ...doc,
            selectedDiscount: selectedDiscount
        })
    }

    const handleSelectClient = (client: Partial<ClientObj> & { id: number | null }) => {
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
                    branch_code: client.branch_code || '',
                    first_address: client.first_address || '',
                    second_address: client.second_address || '',
                    classification: client.classification,
                    registered_name: client.registered_name
                }
            }
        }))
        handleRemoveErr(sales.salesErr, 'client')
        // A draft isn't created yet — picking a client alone shouldn't leave a row
        // behind. The autosave effect below creates one lazily on the first real
        // field change.
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
                    email: customer.email,
                    last_name: customer.last_name,
                    trade_name: customer.trade_name,
                    first_name: customer.first_name,
                    middle_name: customer.middle_name,
                    postal_code: customer.postal_code,
                    phone_number: customer.phone_number,
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

    const handleAddParticular = () => {
        setSales(prev => ({
            ...prev,
            salesObj: {
                ...prev.salesObj,
                particulars: [
                    ...prev.salesObj.particulars,
                    {
                        description: '',
                        quantity: '',
                        unit_price: '',
                        amount: '',
                    }
                ]
            }
        }))
    }

    const handleRemoveParticular = (index: number) => {
        setSales(prev => ({
            ...prev,
            salesObj: {
                ...prev.salesObj,
                particulars: prev.salesObj.particulars.filter(
                    (_, i) => i !== index
                )
            }
        }))
    }

    const handleParticularChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target
        const numericFields = ['quantity', 'unit_price']
        const regexNumericDecimalOnly = /^\d*\.?\d*$/

        if (
            numericFields.includes(name) &&
            value !== '' &&
            !regexNumericDecimalOnly.test(value)
        ) {
            return
        }

        setSales(prev => {
            const particulars = prev.salesObj.particulars.map(
                (particular, i) => {
                    if (i !== index) return particular

                    const updated = {
                        ...particular,
                        [name]: value,
                    }

                    if (numericFields.includes(name)) {
                        const quantity = parseFloat(
                            name === 'quantity'
                                ? value
                                : updated.quantity
                        ) || 0

                        const unitPrice = parseFloat(
                            name === 'unit_price'
                                ? value
                                : updated.unit_price
                        ) || 0

                        updated.amount =
                            updated.quantity !== '' &&
                            updated.unit_price !== ''
                                ? (quantity * unitPrice).toFixed(2)
                                : ''
                    }

                    return updated
                }
            )

            return {
                ...prev,
                salesObj: {
                    ...prev.salesObj,
                    particulars,
                }
            }
        })

        // Particulars errors live in errArr (one entry per row), not sales.salesErr —
        // clear just this row's field as the user corrects it.
        setErrArr(prev => prev.map((err, i) => i === index ? { ...err, [name]: '' } : err))
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
            case 'tin':
            case 'email':
            case 'phone':
            case 'last_name':
            case 'first_name':
            case 'middle_name':
            case 'trade_name':
            case 'classification':
            case 'registered_name':
            case 'postal_code':
            case 'first_address':
            case 'second_address':
                if(name === 'classification'){
                    handleRemoveErr(sales.salesErr, 'last_name')
                    handleRemoveErr(sales.salesErr, 'first_name')
                    handleRemoveErr(sales.salesErr, 'registered_name')
                }
                setSales(prev => ({
                    ...prev,
                    salesObj: {
                        ...prev.salesObj,
                        customer: {
                            ...prev.salesObj.customer,
                            [name]: value
                        }
                    }
                }))
                break;
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

    const buildDraftPayload = useCallback((): SalesManualDraftPayload => {
        const { customer, taxable_month, invoice_date, ...rest } = sales.salesObj
        const toNumber = (val: string) => val ? Number(val) : 0

        return {
            tin: customer?.tin || undefined,
            classification: customer?.classification || undefined,
            registered_name: customer?.registered_name,
            first_name: customer?.first_name,
            last_name: customer?.last_name,
            middle_name: customer?.middle_name,
            trade_name: customer?.trade_name,
            phone_number: customer?.phone_number,
            email: customer?.email,
            first_address: customer?.first_address,
            second_address: customer?.second_address,
            postal_code: customer?.postal_code,

            taxable_month: taxable_month ? dayjs(taxable_month).format('YYYY-MM-DD') : undefined,
            invoice_date: invoice_date ? dayjs(invoice_date, 'MM/DD/YYYY').format('YYYY-MM-DD') : undefined,
            invoice_number: rest.invoice_number || undefined,
            terms: rest.terms || undefined,
            account_name: rest.account_name || undefined,

            atc: rest.atc || undefined,
            ewt_rate: rest.ewt_rate ? Number(rest.ewt_rate) : undefined,

            discount_type: doc.selectedDiscount?.value,
            discount_id_number: rest.id_number || undefined,

            vat_type: rest.vat_type || undefined,
            exempt_sales: toNumber(rest.exempt_sales),
            zero_rated_sales: toNumber(rest.zero_rated_sales),
            vatable_sales: toNumber(rest.vatable_sales),
            gross_taxable: toNumber(rest.gross_taxable),

            particulars: rest.particulars
                .filter(p => p.description || p.quantity || p.unit_price || p.amount)
                .map(particular => ({
                    description: particular.description || undefined,
                    quantity: particular.quantity ? toNumber(particular.quantity) : undefined,
                    unit_price: particular.unit_price ? toNumber(particular.unit_price) : undefined,
                    amount: particular.amount ? toNumber(particular.amount) : undefined,
                })),
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sales.salesObj, doc.selectedDiscount])

    // terms/vat_type/discount_type all default to a pre-selected value from mount
    // (Cash/Inclusive/Senior Citizen) — they're not evidence the user typed anything,
    // so they're deliberately excluded here.
    const isDraftPayloadEmpty = (payload: SalesManualDraftPayload) =>
        !payload.tin && !payload.registered_name && !payload.first_name && !payload.last_name &&
        !payload.first_address && !payload.second_address &&
        !payload.taxable_month && !payload.invoice_date && !payload.invoice_number && !payload.account_name &&
        !payload.atc && !payload.ewt_rate && !payload.discount_id_number &&
        !payload.exempt_sales && !payload.zero_rated_sales && !payload.vatable_sales && !payload.gross_taxable &&
        (!payload.particulars || payload.particulars.length === 0)

    // DEBOUNCED AUTOSAVE — fires a bit after the user stops typing/changing anything.
    // No draft exists yet until there's something worth saving (picking a client
    // alone doesn't create one); once real content shows up, the draft is created
    // lazily and the same change is saved into it in one go.
    useEffect(() => {
        if (!doc.client?.id || isHydrating || lockConflict.locked) return

        if (skipNextAutosaveRef.current) {
            skipNextAutosaveRef.current = false
            return
        }

        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)

        autosaveTimerRef.current = setTimeout(() => {
            const payload = buildDraftPayload()
            if (!draftId && isDraftPayloadEmpty(payload)) return

            const payloadKey = JSON.stringify(payload)
            if (payloadKey === lastSavedPayloadRef.current) return

            const onSaveError = (error: unknown) => {
                if (error instanceof LockConflictError || error instanceof DraftNotEditableError) {
                    setLockConflict({ locked: true, message: error.message })
                } else {
                    setSaveStatus('error')
                }
            }

            setSaveStatus('saving')

            if (!draftId) {
                useCreateDraft.mutate({ client_id: doc.client!.id! }, {
                    onSuccess: (created) => {
                        setDraftId(created.id)
                        useAutosaveDraft.mutate({ id: created.id, data: payload }, {
                            onSuccess: () => {
                                lastSavedPayloadRef.current = payloadKey
                                setSaveStatus('saved')
                            },
                            onError: onSaveError,
                        })
                    },
                    onError: () => {
                        setSaveStatus('error')
                        setStatus(prev => ({
                            ...prev,
                            message: 'Could not start a draft for this sale — your changes may not be saved. Please retry.',
                        }))
                    }
                })
                return
            }

            useAutosaveDraft.mutate({ id: draftId, data: payload }, {
                onSuccess: () => {
                    lastSavedPayloadRef.current = payloadKey
                    setSaveStatus('saved')
                },
                onError: onSaveError,
            })
        }, AUTOSAVE_DEBOUNCE_MS)

        return () => {
            if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sales.salesObj, doc.client?.id, doc.selectedDiscount, draftId, isHydrating, lockConflict.locked])

    // HEARTBEAT — refreshes the lock every HEARTBEAT_INTERVAL_MS even if nothing changed,
    // so a tab that's just sitting open (no edits) doesn't lose its lock to staleness.
    useEffect(() => {
        if (!draftId || lockConflict.locked) return

        const interval = setInterval(() => {
            useLockDraft.mutate(draftId, {
                onError: (error) => {
                    if ((error instanceof LockConflictError || error instanceof DraftNotEditableError)) {
                        setLockConflict({ locked: true, message: error.message })
                    }
                }
            })
        }, HEARTBEAT_INTERVAL_MS)

        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draftId, lockConflict.locked])

    // Best-effort lock release on unmount (SPA navigation) and tab close.
    useEffect(() => {
        if (!draftId) return

        const release = () => useUnlockDraft.mutate(draftId, { onError: () => undefined })
        window.addEventListener('pagehide', release)

        return () => {
            window.removeEventListener('pagehide', release)
            release()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draftId])

    const buildValidationData = () => ({
        atc: sales.salesObj.atc || '',
        ewt_rate: sales.salesObj.ewt_rate || '',
        client: doc.client?.id ? String(doc.client?.id) : '',
        customer: sales.salesObj.customer?.id ? String(sales.salesObj.customer?.id) : '',

        tin: sales.salesObj.customer?.tin || '',
        email: sales.salesObj.customer?.email || '',
        last_name: sales.salesObj.customer?.last_name || '',
        first_name: sales.salesObj.customer?.first_name || '',
        middle_name: sales.salesObj.customer?.middle_name || '',
        trade_name: sales.salesObj.customer?.trade_name || '',
        postal_code: sales.salesObj.customer?.postal_code || '',
        phone_number: sales.salesObj.customer?.phone_number || '',
        first_address: sales.salesObj.customer?.first_address || '',
        second_address: sales.salesObj.customer?.second_address || '',
        classification: sales.salesObj.customer?.classification || '',
        registered_name: sales.salesObj.customer?.registered_name || '',

        terms: sales.salesObj.terms || '',
        tax_amount: sales.salesObj.tax_amount || '',
        vat_amount: sales.salesObj.vat_amount || '',
        gross_amount: sales.salesObj.gross_amount || '',
        exempt_sales: sales.salesObj.exempt_sales || '',
        account_name: sales.salesObj.account_name || '',
        invoice_date: sales.salesObj.invoice_date || '',
        gross_taxable: sales.salesObj.gross_taxable || '',
        vatable_sales: sales.salesObj.vatable_sales || '',
        taxable_month: sales.salesObj.taxable_month || '',
        invoice_number: sales.salesObj.invoice_number || '',
        zero_rated_sales: sales.salesObj.zero_rated_sales || '',
        total_gross_amount: sales.salesObj.total_gross_amount || '',

        particulars: sales.salesObj.particulars?.map(particular => ({
            amount: particular.amount ? particular.amount : '',
            quantity: particular.quantity ? particular.quantity : '',
            unit_price: particular.unit_price ? particular.unit_price : '',
            description: particular.description ? particular.description : '',
        })),
    })

    /** Validate only the given fieldValidations keys (defaults to all), surfacing
     * errors for just those fields via sales.salesErr/errArr. Returns whether it
     * passed. Used both by the final submit (all fields) and by per-step "Continue"
     * checks (just that step's fields), so navigating forward doesn't light up
     * fields on steps the user hasn't reached yet. */
    const validateFields = (fieldNames?: string[]) => {
        const scopedValidations = fieldNames
            ? Object.fromEntries(Object.entries(fieldValidations).filter(([key]) => fieldNames.includes(key)))
            : fieldValidations

        const {
            validation_errors,
            validation_has_error,
            validation_errors_array
        } = ValidatorV3(scopedValidations, buildValidationData())

        setSales(prev => {
            const nextErr = { ...prev.salesErr }
            Object.keys(scopedValidations).forEach(key => delete nextErr[key])
            return {
                ...prev,
                salesErr: { ...nextErr, ...validation_errors } as SalesErr
            }
        })
        if (!fieldNames || fieldNames.includes('particulars')) {
            setErrArr(validation_errors_array as Particular[])
        }

        return !validation_has_error
    }

    /** Validate just one wizard step's fields — used by the "Continue" button. */
    const validateStep = (step: number) => validateFields(STEP_FIELDS[step])

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})

        if (!validateFields()) {
            setStatus(prev => ({...prev, loader: false}))
            return
        }

        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)

        const finalizePayload = buildDraftPayload()
        const onFinalizeSuccess = () => {
            sessionStorage.setItem(
                'successMessage',
                'Your sale record has been posted.'
            )
            router.push('/bookkeeper/books_of_accounts/sales/manual')
        }
        const onFinalizeError = (error: unknown) => {
            setStatus(prev => ({
                ...prev,
                loader: false,
                message: (error instanceof LockConflictError || error instanceof DraftNotEditableError)
                    ? error.message
                    : (error as { response?: { data?: { message?: string } } })?.response?.data?.message
                        || 'Could not post this sale — please check the form and try again.',
            }))
        }

        if (!draftId) {
            // Passed validation fast enough that the debounced autosave never got a
            // chance to create the draft — create it now, then finalize straight away.
            if (!doc.client?.id) {
                setStatus(prev => ({ ...prev, loader: false, message: 'Select a client first.' }))
                return
            }
            useCreateDraft.mutate({ client_id: doc.client.id }, {
                onSuccess: (created) => {
                    setDraftId(created.id)
                    useFinalizeDraft.mutate({ id: created.id, data: finalizePayload }, {
                        onSuccess: onFinalizeSuccess,
                        onError: onFinalizeError,
                    })
                },
                onError: onFinalizeError,
            })
            return
        }

        useFinalizeDraft.mutate({ id: draftId, data: finalizePayload }, {
            onSuccess: onFinalizeSuccess,
            onError: onFinalizeError,
        })
    }

    return {
        // STATES
        doc,
        sales,
        status,
        errArr,
        options,
        clientArr,
        customerArr,
        editCustomer,
        displayTerms,
        displayClients,
        displayDiscounts,
        displayCustomers,
        clientLoader: isLoadingClients || isFetchingClients,
        customerLoader: isLoadingCustomers || isFetchingCustomers,

        // DRAFT / AUTOSAVE / LOCKING
        draftId,
        saveStatus,
        lockConflict,
        isHydrating,

        // SET STATES
        setDisplayTerms,
        setDisplayClients,
        setDisplayCustomers,
        setDisplayDiscounts,

        // HANDLES
        handleBlur,
        handleDate,
        handleSubmit,
        handleChange,
        validateStep,
        handleToggle,
        handleResubmit,
        handleSelectTerms,
        handleEditCustomer,
        handleSelectClient,
        handleAddParticular,
        handleSelectCustomer,
        handleSelectDiscount,
        handleRemoveParticular,
        handleParticularChange,
    }
}

export default useSaveSales;