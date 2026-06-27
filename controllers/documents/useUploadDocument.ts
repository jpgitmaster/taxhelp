import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import useDocumentAPI from './api'
import { ExcelRow } from './types'
import {
    useState,
    useEffect,
    ChangeEvent,
    SyntheticEvent,
} from 'react'
import useQueryClients from '../clients/api/queries'
import useQueryUsers from '@/controllers/users/api/queries'
import useMutationDocuments from './api/mutation'

const useUploadDocuments = () => {
    const {
        filter: clientFilter,
        setFilter,
        getClients,
    } = useQueryClients()
    const {
        getUser
    } = useQueryUsers()
    const { data: user } = getUser()
    const { useDownloadDatFile } = useMutationDocuments()
    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    const formatTIN = (value: unknown) => {
        const digits = String(value ?? '')
            .replace(/\D/g, '')
            .slice(0, 9)

        const parts = digits.match(/.{1,3}/g)

        return parts ? parts.join('-') : ''
    }

    const formatNumber = (value: number) =>
        Number(value || 0).toLocaleString(navigator.language, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

    /*
    |--------------------------------------------------------------------------
    | STATES
    |--------------------------------------------------------------------------
    */

    const options = [
        {
            label: 'SUMMARY LIST OF SALES (SLS)',
            value: 'SALES'
        },
        {
            label: 'SUMMARY LIST OF PURCHASES (SLP)',
            value: 'PURCHASES'
        },
        // {
        //     label: 'IMPORTS TRANSACTION',
        //     value: 'IMPORTATION'
        // },
        // PURCHASES
        {
            label: 'QUARTERLY ALPHALIST OF PAYEES (QAP)',
            value: 'QAP',
            children: [
                {
                    label: '1601EQ  Schedule 1',
                    value: '1601EQ',
                },
                {
                    label: '1601FQ Schedule 1',
                    value: '1601FQ',
                },
                {
                    label: '1604E Schedule 3',
                    value: '1604E',
                },
                {
                    label: '1604F Schedule 3',
                    value: '1604F',
                }
            ]
        },
        // SALES
        {
            label: 'SUMMARY ALPHALIST OF WITHHOLDING TAXES (SAWT)',
            value: 'SAWT',
            children: [
                {
                    label: '1700',
                    value: '1700',
                },
                {
                    label: '1701Q',
                    value: '1701Q',
                },
                {
                    label: '1701',
                    value: '1701',
                },
                {
                    label: '1702Q',
                    value: '1702Q',
                },
                {
                    label: '1702',
                    value: '1702',
                },
                {
                    label: '2550M',
                    value: '2550M',
                },
                {
                    label: '2550Q',
                    value: '2550Q',
                },
                {
                    label: '2551Q',
                    value: '2551Q',
                },
                {
                    label: '2553',
                    value: '2553',
                }
            ]
        },
        // {
        //     label: 'MONTHLY ALPHALIST OF PAYEES',
        //     value: 'MAP',
        //     children: [
        //         {
        //             label: '1600VT',
        //             value: '1600VT',
        //         },
        //         {
        //             label: '1600PT',
        //             value: '1600PT',
        //         },
        //     ]
        // },
    ]
    const [width_, setWidth] = useState(0)
    const [file, setFile] = useState<File | null>(null)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocsTbl, setDisplayDocsTbl] = useState(false)
    const [deletedRowIds, setDeletedRowIds] = useState<number[]>([])
    const [rows, setRows] = useState<(ExcelRow & { id: number })[]>([])
    const [displayChildDocsTbl, setDisplayChildDocsTbl] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const { status, setStatus, uploadDocumentMutation, useGetTemplate } = useDocumentAPI()
    const [allRows, setAllRows] = useState<(ExcelRow & { id: number })[]>([])
    const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(null)
    const { refetch: downloadTemplate, isFetching: isDownloading } = useGetTemplate()
    const [doc, setDoc] = useState({
        docSearch: '',
        clientSearch: '',
        selectedTable: {
            value: 'SALES',
            label: 'SUMMARY LIST OF SALES (SLS)',
        },
        selectedChildTable: {
            value: '',
            label: '',
            parentValue: ''
        },
        client: {
            id: null,
            last_name: '',
            first_name: '',
            trade_name: '',
            registered_name: '',
        },
    })
    const selectedParent = options.find(
        option => option.value === doc.selectedTable.value
    )
    
    const childOptions = selectedParent?.children || []
    /*
    |--------------------------------------------------------------------------
    | CLIENTS
    |--------------------------------------------------------------------------
    */

    const { data: dataClients, isLoading, isFetching } = getClients(
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )

    const clientArr = dataClients?.clients

    /*
    |--------------------------------------------------------------------------
    | TABLE ROW SELECTION
    |--------------------------------------------------------------------------
    */

    const rowSelection = {
        selectedRowKeys,

        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys as number[])
        },
    }

    /*
    |--------------------------------------------------------------------------
    | BASE COLUMNS
    |--------------------------------------------------------------------------
    */

    const baseColumns = [
        {
            key: 'taxableMonth',
            title: 'Taxable Month',
            dataIndex: 'taxableMonth',

            render: (value: any) =>
                value
                    ? dayjs(
                          typeof value === 'number'
                              ? XLSX.SSF.format('m/d/yyyy', value)
                              : value
                      ).format('MM-YYYY')
                    : '',
        },

        {
            key: 'tin',
            title: 'Taxpayer Identification Number',
            dataIndex: 'tin',
            width: 180,

            render: (value: string) => formatTIN(value),
        },

        {
            key: 'branchCode',
            title: 'Branch Code',
            dataIndex: 'branchCode',
        },

        {
            key: 'individualName',
            title: 'Individual Name',
            dataIndex: 'individualName',
        },

        {
            key: 'registeredName',
            title: 'Registered Name',
            dataIndex: 'registeredName',
        },
    ]

    /*
    |--------------------------------------------------------------------------
    | SALES COLUMNS
    |--------------------------------------------------------------------------
    */

    const salesColumns = [
        {
            key: 'address1',
            title: 'First Address',
            dataIndex: 'address1',
        },

        {
            key: 'address2',
            title: 'Second Address',
            dataIndex: 'address2',
        },
        {
            key: 'exempt_sales',
            title: 'Exempt Sales',
            dataIndex: 'exempt_sales',
            render: formatNumber,
        },

        {
            key: 'zero_rated_sales',
            title: 'Zero-Rated Sales',
            dataIndex: 'zero_rated_sales',
            render: formatNumber,
        },

        {
            key: 'vatable_sales',
            title: 'Vatable Sales',
            dataIndex: 'vatable_sales',
            render: formatNumber,
        },

        {
            key: 'gross_amount',
            title: 'Gross Amount',
            dataIndex: 'gross_amount',
            render: formatNumber,
        },

        {
            key: 'vat_rate',
            title: 'VAT Rate',
            dataIndex: 'vat_rate',
            render: formatNumber,
        },

        {
            key: 'vat_amount',
            title: 'VAT Amount',
            dataIndex: 'vat_amount',
            render: formatNumber,
        },

        {
            key: 'gross_taxable',
            title: 'Gross Taxable',
            dataIndex: 'gross_taxable',
            render: formatNumber,
        },
    ]

    /*
    |--------------------------------------------------------------------------
    | PURCHASE COLUMNS
    |--------------------------------------------------------------------------
    */

    const purchaseColumns = [
        {
            key: 'address1',
            title: 'First Address',
            dataIndex: 'address1',
        },

        {
            key: 'address2',
            title: 'Second Address',
            dataIndex: 'address2',
        },
        {
            key: 'exempt_purchases',
            title: 'Exempt Purchases',
            dataIndex: 'exempt_purchases',
            render: formatNumber,
        },

        {
            key: 'zero_rated_purchases',
            title: 'Zero-Rated Purchases',
            dataIndex: 'zero_rated_purchases',
            render: formatNumber,
        },

        {
            key: 'vatable_purchases',
            title: 'Vatable Purchases',
            dataIndex: 'vatable_purchases',
            render: formatNumber,
        },

        {
            key: 'vatable_purchase_of_services',
            title: 'Vatable Purchase of Services',
            dataIndex: 'vatable_purchase_of_services',
            width: 180,
            render: formatNumber,
        },

        {
            key: 'vatable_purchase_of_capital_goods',
            title: 'Vatable Purchase of Capital Goods',
            dataIndex: 'vatable_purchase_of_capital_goods',
            width: 180,
            render: formatNumber,
        },

        {
            key: 'vatable_purchase_of_other_goods',
            title:
                'Vatable Purchase of Goods other than Capital Goods',
            dataIndex: 'vatable_purchase_of_other_goods',
            width: 180,
            render: formatNumber,
        },

        {
            key: 'gross_amount',
            title: 'Gross Amount',
            dataIndex: 'gross_amount',
            render: formatNumber,
        },

        {
            key: 'vat_rate',
            title: 'VAT Rate',
            dataIndex: 'vat_rate',
            render: formatNumber,
        },

        {
            key: 'vat_amount',
            title: 'VAT Amount',
            dataIndex: 'vat_amount',
            render: formatNumber,
        },

        {
            key: 'gross_taxable',
            title: 'Gross Taxable',
            dataIndex: 'gross_taxable',
            render: formatNumber,
        },
    ]

    /*
    |--------------------------------------------------------------------------
    | SAWT COLUMNS
    |--------------------------------------------------------------------------
    */

    const sawtColumns = [
        {
            key: 'atc_code',
            title: 'ATC Code',
            dataIndex: 'atc_code',
        },
        {
            key: 'amount_of_income_payment',
            title: 'Amount of Income Payment',
            dataIndex: 'amount_of_income_payment',
            render: formatNumber,
        },
        {
            key: 'tax_rate',
            title: 'Tax Rate',
            dataIndex: 'tax_rate',
            render: formatNumber,
        },
        {
            key: 'amount_of_tax_withheld',
            title: 'Amount of Tax Withheld',
            dataIndex: 'amount_of_tax_withheld',
            render: formatNumber,
        },
    ]

    /*
    |--------------------------------------------------------------------------
    | QAP COLUMNS
    |--------------------------------------------------------------------------
    */

    const qapColumns = [
        {
            key: 'atc_code',
            title: 'ATC Code',
            dataIndex: 'atc_code',
        },
        {
            key: 'amount_of_income_payment',
            title: 'Amount of Income Payment',
            dataIndex: 'amount_of_income_payment',
            render: formatNumber,
        },
        {
            key: 'tax_rate',
            title: 'Tax Rate',
            dataIndex: 'tax_rate',
            render: formatNumber,
        },
        {
            key: 'amount_of_tax_withheld',
            title: 'Amount of Tax Withheld',
            dataIndex: 'amount_of_tax_withheld',
            render: formatNumber,
        },
    ]

    /*
    |--------------------------------------------------------------------------
    | GET COLUMNS
    |--------------------------------------------------------------------------
    */

    const getColumns = () => {
        switch (doc.selectedTable.value) {
            case 'SALES':
                return [...baseColumns, ...salesColumns]

            case 'PURCHASES':
                return [...baseColumns, ...purchaseColumns]

            case 'QAP':
                return [...baseColumns, ...qapColumns]

            case 'SAWT':
                return [...baseColumns, ...sawtColumns]

            default:
                return baseColumns
        }
    }

    /*
    |--------------------------------------------------------------------------
    | DETECT SHEET
    |--------------------------------------------------------------------------
    */

    const detectSheet = (workbook: XLSX.WorkBook) => {
        let salesSheet = null
        let purchaseSheet = null
        let qapSheet = null
        let sawtSheet = null

        workbook.SheetNames.forEach(name => {
            const upper = name.toUpperCase()

            if (upper.includes('SALE') || upper === 'SLS') {
                salesSheet = name
            }

            if (
                upper.includes('PURCHASE') ||
                upper === 'SLP'
            ) {
                purchaseSheet = name
            }

            if (
                upper.includes('QAP') &&
                !upper.includes('PIVOT')
            ) {
                qapSheet = name
            }

            if (
                upper.includes('SAWT') &&
                !upper.includes('PIVOT')
            ) {
                sawtSheet = name
            }
        })

        return {
            salesSheet,
            purchaseSheet,
            qapSheet,
            sawtSheet,
        }
    }

    /*
    |--------------------------------------------------------------------------
    | BASE ROW
    |--------------------------------------------------------------------------
    */

    const mapBaseRow = (row: any, index: number) => {
        const firstName = String(row['FIRST NAME'] ?? '').trim()
        const lastName = String(row['LAST NAME'] ?? '').trim()
        const middleName = String(row['MIDDLE NAME'] ?? '').trim()

        const address1 = String(row['FIRST ADDRESS'] ?? '').trim()
        const address2 = String(row['SECOND ADDRESS'] ?? '').trim()

        return {
            id: index,
            taxableMonth: row['TAXABLE MONTH'],
            tin: row['TAXPAYER IDENTIFICATION NUMBER'],
            branchCode: row['BRANCH CODE'],
            registeredName: row['REGISTERED NAME'],

            firstName,
            lastName,
            middleName,

            individualName:
                `${firstName} ${lastName}`.trim() +
                (middleName ? `, ${middleName}` : ''),

            address1: address1 || '-',
            address2: address2 || '-',
        }
    }

    /*
    |--------------------------------------------------------------------------
    | MAP ROW
    |--------------------------------------------------------------------------
    */

    const mapRow = (
        row: any,
        index: number
    ): ExcelRow & { id: number } => {
        const base = mapBaseRow(row, index)

        switch (doc.selectedTable.value) {
            case 'SALES':
                return {
                    ...base,
                    exempt_sales: Number(
                        row['EXEMPT SALES'] || 0
                    ),
                    zero_rated_sales: Number(
                        row['ZERO-RATED SALES'] || 0
                    ),
                    vatable_sales: Number(
                        row['VATABLE SALES'] || 0
                    ),
                    gross_amount: Number(
                        row['GROSS AMOUNT'] || 0
                    ),
                    vat_rate: Number(
                        row['VAT RATE'] || 0
                    ),
                    vat_amount: Number(
                        row['VAT AMOUNT'] || 0
                    ),
                    gross_taxable: Number(
                        row['GROSS TAXABLE'] || 0
                    ),
                }

            case 'PURCHASES':
                return {
                    ...base,
                    exempt_purchases: Number(
                        row['EXEMPT PURCHASES'] || 0
                    ),
                    zero_rated_purchases: Number(
                        row['ZERO-RATED PURCHASES'] || 0
                    ),
                    vatable_purchases: Number(
                        row['VATABLE PURCHASES'] || 0
                    ),
                    vatable_purchase_of_services: Number(
                        row['VATABLE PURCHASE OF SERVICES'] || 0
                    ),
                    vatable_purchase_of_capital_goods: Number(
                        row['VATABLE PURCHASE OF CAPITAL GOODS'] || 0
                    ),
                    vatable_purchase_of_other_goods: Number(
                        row[
                            'VATABLE PURCHASE OF GOODS OTHER THAN CAPITAL GOODS'
                        ] || 0
                    ),
                    gross_amount: Number(
                        row['GROSS AMOUNT'] || 0
                    ),
                    vat_rate: Number(
                        row['VAT RATE'] || 0
                    ),
                    vat_amount: Number(
                        row['VAT AMOUNT'] || 0
                    ),
                    gross_taxable: Number(
                        row['GROSS TAXABLE'] || 0
                    ),
                }

            case 'QAP':
            case 'SAWT':
                return {
                    ...base,
                    atc_code: row['ATC CODE'],
                    amount_of_income_payment: Number(
                        row['AMOUNT OF INCOME PAYMENT'] || 0
                    ),
                    tax_rate: Number(
                        row['TAX RATE'] || 0
                    ),
                    amount_of_tax_withheld: Number(
                        row['AMOUNT OF TAX WITHHELD'] || 0
                    ),
                }

            default:
                throw new Error(
                    `Unsupported document type: ${doc.selectedTable.value}`
                )
        }
    }

    /*
    |--------------------------------------------------------------------------
    | PARSE WORKBOOK
    |--------------------------------------------------------------------------
    */

    const parseWorkbook = (workbook: XLSX.WorkBook) => {
        const {
            salesSheet,
            purchaseSheet,
            qapSheet,
            sawtSheet,
        } = detectSheet(workbook)

        // console.log('Sheet Names:', workbook.SheetNames)
        // console.log({
        //     salesSheet,
        //     purchaseSheet,
        //     qapSheet,
        //     sawtSheet,
        // })

        let sheetName: string | null = null

        switch (doc.selectedTable.value) {
            case 'SALES':
                sheetName = salesSheet
                break

            case 'PURCHASES':
                sheetName = purchaseSheet
                break

            case 'QAP':
                sheetName = qapSheet
                break

            case 'SAWT':
                sheetName = sawtSheet
                break
        }

        // console.log('Selected Table:', doc.selectedTable.value)
        // console.log('Detected Sheet:', sheetName)

        if (!sheetName) {
            alert(
                `No worksheet found for ${doc.selectedTable.value}`
            )
            return
        }

        const sheet = workbook.Sheets[sheetName]

        const json = XLSX.utils.sheet_to_json(sheet, {
            defval: '',
        })
        // console.log(json[0])
        // console.log(Object.keys(json[0] || {}))

        const mappedRows = json.map((row, index) =>
            mapRow(row, index)
        )

        // console.log('Mapped Rows:', mappedRows.length)
        // console.log('First Mapped Row:', mappedRows[0])

        const tableRows = mappedRows.filter(row => {
            const tin = String(row.tin ?? '')
                .replace(/\D/g, '')

            return (
                tin.length > 0 &&
                !deletedRowIds.includes(row.id)
            )
        })

        // console.log('Filtered Rows:', tableRows.length)

        const finalRows =
            user?.subscription?.plan === 'basic'
                ? tableRows.slice(0, 20)
                : tableRows

        setAllRows(finalRows)
        setRows(finalRows)
    }

    /*
    |--------------------------------------------------------------------------
    | HANDLE FILE CHANGE
    |--------------------------------------------------------------------------
    */

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const f = e.target.files?.[0]

        if (!f) return

        setFile(f)

        const reader = new FileReader()

        reader.onload = evt => {
            const data = evt.target?.result

            if (!data) return

            const workbook = XLSX.read(data, {
                type: 'array',
            })

            parseWorkbook(workbook)
        }

        reader.readAsArrayBuffer(f)
    }

    /*
    |--------------------------------------------------------------------------
    | HANDLES
    |--------------------------------------------------------------------------
    */

    const handleDeleteSelected = () => {
        if (!selectedRowKeys.length) return

        setDeletedRowIds(prev => [
            ...prev,
            ...selectedRowKeys,
        ])

        const filtered = rows.filter(
            row => !selectedRowKeys.includes(row.id)
        )

        setRows(filtered)

        setSelectedRowKeys([])
    }
    const handleSelectChildTable = (selectedChildTable: {
        value: string
        label: string
        parentValue: string
    }) => {
        setDoc(prev => ({
            ...prev,
            selectedChildTable
        }))
    }
    const handleSelectTable = (selectedTable: {
        value: string
        label: string
    }) => {
        setDoc(prev => ({
            ...prev,
            selectedTable,
            selectedChildTable: {
                value: '',
                label: '',
                parentValue: ''
            }
        }))

        setDisplayDocsTbl(false)
        setDisplayChildDocsTbl(false)
    }
    

    const handleSelectClient = (client: any) => {
        setDoc(prev => ({
            ...prev,
            client,
        }))
    }

    const handleChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target

        if (name === 'clientSearch') {
            setFilter(prev => ({
                ...prev,
                search: value,
                currentPage: 1,
            }))
        }

        setDoc(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDownloadTemplate = async () => {
        try {
            const res = await downloadTemplate()

            if (res?.data) {
                const blob = new Blob([res.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })

                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'template.xlsx'
                document.body.appendChild(link)
                link.click()

                link.remove()
                window.URL.revokeObjectURL(url)
            }
        } catch (error) {
            console.error('Download failed:', error)
        }
    }

    const handleToggle = (dropdown: string) => {
        if (dropdown === 'clients') {
            setDisplayClients(prev => !prev)
        }

        if (dropdown === 'docs_table') {
            setDisplayDocsTbl(prev => !prev)
        }
        
        if (dropdown === 'child_docs_table') {
            setDisplayChildDocsTbl(prev => !prev)
            setDisplayDocsTbl(false)
        }
    }

    const handleUpload = async (
        e: SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        setStatus({
            ...status,
            loader: true,
        })

        if (!file || !doc.client.id) {
            alert('Missing file or client')
            return
        }

        uploadDocumentMutation.mutate({
            file,
            clientId: doc.client.id,
        })
    }

    const handleDAT_Upload = (
        e: SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        if (!doc.client.id) {
            alert('Please select a client.')
            return
        }

        if (!selectedMonth) {
            alert('Please select a taxable month.')
            return
        }

        const formType =
            doc.selectedTable.value === 'SALES'
                ? 'SLS'
                : doc.selectedTable.value === 'PURCHASES'
                ? 'SLP'
                : doc.selectedTable.value

        const payload = {
            client_id: Number(doc.client.id),
            month: selectedMonth.month() + 1,
            year: selectedMonth.year(),
            form_type: formType,
            sub_form_type: doc.selectedChildTable.value,
            records: rows.map((row: any) => ({
                taxable_month: dayjs(
                    typeof row.taxableMonth === 'number'
                        ? XLSX.SSF.format('yyyy-mm-dd', row.taxableMonth)
                        : row.taxableMonth
                ).format('YYYY-MM-DD'),

                tin: row.tin,
                registered_name: row.registeredName,

                first_name: row.firstName ?? '',
                last_name: row.lastName ?? '',
                middle_name: row.middleName ?? '',

                first_address: row.address1,
                second_address: row.address2,

                branch_code: row.branchCode,

                ...(formType === 'SLS' && {
                    exempt_sales: row.exempt_sales ?? 0,
                    zero_rated_sales: row.zero_rated_sales ?? 0,
                    vatable_sales: row.vatable_sales ?? 0,
                    vat_rate: row.vat_rate ?? 0,
                }),

                ...(formType === 'SLP' && {
                    exempt_purchases: row.exempt_purchases ?? 0,
                    zero_rated_purchases: row.zero_rated_purchases ?? 0,
                    vatable_purchases: row.vatable_purchases ?? 0,
                    vatable_purchase_of_services:
                        row.vatable_purchase_of_services ?? 0,
                    vatable_purchase_of_capital_goods:
                        row.vatable_purchase_of_capital_goods ?? 0,
                    vatable_purchase_of_other_goods:
                        row.vatable_purchase_of_other_goods ?? 0,
                    vat_rate: row.vat_rate ?? 0,
                }),

                ...(formType === 'SAWT' && {
                    atc_code: row.atc_code,
                    amount_of_income_payment:
                        row.amount_of_income_payment ?? 0,
                    tax_rate: row.tax_rate ?? 0,
                    amount_of_tax_withheld:
                        row.amount_of_tax_withheld ?? 0,
                }),

                ...(formType === 'QAP' && {
                    atc_code: row.atc_code,
                    amount_of_income_payment:
                        row.amount_of_income_payment ?? 0,
                    tax_rate: row.tax_rate ?? 0,
                    amount_of_tax_withheld:
                        row.amount_of_tax_withheld ?? 0,
                }),
            })),
        }

        useDownloadDatFile.mutate(payload, {
            onSuccess: (blob) => {
                const url = URL.createObjectURL(blob)

                const link = document.createElement('a')
                link.href = url
                link.download = `${formType}_${selectedMonth.format(
                    'YYYYMM'
                )}.dat`

                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                URL.revokeObjectURL(url)
            },
            onError: (error) => {
                console.error(error)
            },
        })
    }

    const handleCancel = () => {
        setFile(null)
        setRows([])
        setAllRows([])
        setDeletedRowIds([])
        setSelectedRowKeys([])
        setSelectedMonth(null)

        setDoc(prev => ({
            ...prev,
            selectedTable: {
                value: 'SALES',
                label: 'SUMMARY LIST OF SALES (SLS)',
            },
            selectedChildTable: {
                value: '',
                label: '',
                parentValue: ''
            }
        }))
    }

    useEffect(() => {
        if (!selectedMonth) {
            setRows(allRows)
            return
        }

        const filtered = allRows.filter(row => {
            if (!row.taxableMonth) return false

            const rowDate = dayjs(
                typeof row.taxableMonth === 'number'
                    ? XLSX.SSF.format('m/d/yyyy', row.taxableMonth)
                    : row.taxableMonth
            )

            return (
                rowDate.month() === selectedMonth.month() &&
                rowDate.year() === selectedMonth.year()
            )
        })

        setRows(filtered)
    }, [selectedMonth, allRows])


    useEffect(() => {
        if (!file) return

        const reader = new FileReader()

        reader.onload = evt => {
            const data = evt.target?.result

            if (!data) return

            const workbook = XLSX.read(data, {
                type: 'array',
            })

            parseWorkbook(workbook)
        }

        reader.readAsArrayBuffer(file)
    }, [doc.selectedTable, deletedRowIds])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth - 210)
        }
    }, [])


    return {
        doc,
        rows,
        user,
        file,
        status,
        width_,
        options,
        clientArr,
        childOptions,
        rowSelection,
        isDownloading,
        selectedMonth,
        displayDocsTbl,
        displayClients,
        selectedRowKeys,
        displayChildDocsTbl,
        clientLoader: isLoading || isFetching,

        setRows,
        setSelectedMonth,
        setDisplayClients,
        setDisplayDocsTbl,
        setDisplayChildDocsTbl,

        getColumns,

        handleUpload,
        handleChange,
        handleToggle,
        handleCancel,
        handleDAT_Upload,
        handleFileChange,
        handleSelectTable,
        handleSelectClient,
        handleDeleteSelected,
        handleSelectChildTable,
        handleDownloadTemplate,
    }
}

export default useUploadDocuments