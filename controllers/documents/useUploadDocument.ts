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

const useUploadDocuments = () => {
    const [deletedRowIds, setDeletedRowIds] = useState<number[]>([])
    const { status, setStatus, uploadDocumentMutation } = useDocumentAPI()

    const {
        filter: clientFilter,
        setFilter,
        getClients,
    } = useQueryClients()
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

    const [options, setOptions] = useState([
        {
            label: 'SUMMARY LIST OF SALES (SLS)',
            value: 'SALES',
        },
        {
            label: 'SUMMARY LIST OF PURCHASES (SLP)',
            value: 'PURCHASES',
        },
    ])

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

    const [width_, setWidth] = useState(0)

    const [file, setFile] = useState<File | null>(null)

    const [displayClients, setDisplayClients] = useState(false)

    const [displayDocsTbl, setDisplayDocsTbl] = useState(false)

    const [rows, setRows] = useState<(ExcelRow & { id: number })[]>([])

    const [doc, setDoc] = useState({
        docSearch: '',
        clientSearch: '',

        selectedTable: {
            value: 'SALES',
            label: 'SUMMARY LIST OF SALES (SLS)',
        },

        client: {
            id: null,
            last_name: '',
            first_name: '',
            trade_name: '',
            registered_name: '',
        },
    })

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
            key: 'businessOwner',
            title: 'Business Owner',
            dataIndex: 'businessOwner',
        },

        {
            key: 'registeredName',
            title: 'Registered Name',
            dataIndex: 'registeredName',
        },

        {
            key: 'address1',
            title: 'Address 1',
            dataIndex: 'address1',
        },

        {
            key: 'address2',
            title: 'Address 2',
            dataIndex: 'address2',
        },
    ]

    /*
    |--------------------------------------------------------------------------
    | SALES COLUMNS
    |--------------------------------------------------------------------------
    */

    const salesColumns = [
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
            key: 'vatRate',
            title: 'VAT Rate',
            dataIndex: 'vatRate',
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
            key: 'vatRate',
            title: 'VAT Rate',
            dataIndex: 'vatRate',
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
    | GET COLUMNS
    |--------------------------------------------------------------------------
    */

    const getColumns = () => {
        return [
            ...baseColumns,

            ...(doc.selectedTable.value === 'SALES'
                ? salesColumns
                : purchaseColumns),
        ]
    }

    /*
    |--------------------------------------------------------------------------
    | DETECT SHEET
    |--------------------------------------------------------------------------
    */

    const detectSheet = (workbook: XLSX.WorkBook) => {
        let salesSheet = null
        let purchaseSheet = null

        workbook.SheetNames.forEach(name => {
            const upper = name.toUpperCase()

            if (
                upper.includes('SALE') ||
                upper.includes('SLS')
            ) {
                salesSheet = name
            }

            if (
                upper.includes('PURCHASE') ||
                upper.includes('SLP')
            ) {
                purchaseSheet = name
            }
        })

        return { salesSheet, purchaseSheet }
    }

    /*
    |--------------------------------------------------------------------------
    | BASE ROW
    |--------------------------------------------------------------------------
    */

    const mapBaseRow = (row: any, index: number) => {
        const firstName = String(
            row['FIRST_NAME'] ?? ''
        ).trim()

        const lastName = String(
            row['LAST_NAME'] ?? ''
        ).trim()

        const middleName = String(
            row['MIDDLE_NAME'] ?? ''
        ).trim()

        return {
            id: index,

            taxableMonth: row['TAXABLE MONTH'],

            tin: row['TAXPAYER IDENTIFICATION NUMBER'],

            branchCode: row['BRANCH CODE'],

            registeredName: row['REGISTERED NAME'],

            businessOwner:
                `${firstName} ${lastName}`.trim() +
                (middleName ? `, ${middleName}` : ''),

            address1: row['ADDRESS ONE'],

            address2: row['ADDRESS TWO'],
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

        if (doc.selectedTable.value === 'SALES') {
            return {
                ...base,

                exempt_sales: Number(
                    row[' EXEMPT SALES'] || 0
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

                vatRate: Number(row['VAT RATE'] || 0),

                vat_amount: Number(
                    row['VAT AMOUNT'] || 0
                ),

                gross_taxable: Number(
                    row['GROSS TAXABLE'] || 0
                ),
            }
        }

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

            vatRate: Number(row['VAT RATE'] || 0),

            vat_amount: Number(
                row['VAT AMOUNT'] || 0
            ),

            gross_taxable: Number(
                row['GROSS TAXABLE'] || 0
            ),
        }
    }

    /*
    |--------------------------------------------------------------------------
    | PARSE WORKBOOK
    |--------------------------------------------------------------------------
    */

    const parseWorkbook = (workbook: XLSX.WorkBook) => {
        const { salesSheet, purchaseSheet } =
            detectSheet(workbook)

        let sheetName = null

        if (salesSheet && purchaseSheet) {
            setOptions([
                {
                    label: 'SUMMARY LIST OF SALES (SLS)',
                    value: 'SALES',
                },

                {
                    label: 'SUMMARY LIST OF PURCHASES (SLP)',
                    value: 'PURCHASES',
                },
            ])

            sheetName =
                doc.selectedTable.value === 'SALES'
                    ? salesSheet
                    : purchaseSheet
        } else if (salesSheet) {
            sheetName = salesSheet

            setOptions([
                {
                    label: 'SUMMARY LIST OF SALES (SLS)',
                    value: 'SALES',
                },
            ])
        } else if (purchaseSheet) {
            sheetName = purchaseSheet

            setOptions([
                {
                    label: 'SUMMARY LIST OF PURCHASES (SLP)',
                    value: 'PURCHASES',
                },
            ])
        }

        if (!sheetName) {
            alert(
                'No SALES or PURCHASES sheet found in Excel file'
            )

            return
        }

        const sheet = workbook.Sheets[sheetName]

        const json = XLSX.utils.sheet_to_json(sheet, {
            defval: '',
        })

        const tableRows = json
            .map((row, index) => mapRow(row, index))
            .filter(row => {
                const tin = String(row.tin ?? '')
                    .replace(/\D/g, '') // remove dashes/spaces/etc

                return (
                    tin.length > 0 &&
                    !deletedRowIds.includes(row.id)
                )
            })

        setRows(tableRows)
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

    const handleSelectTable = (selectedTable: {
        value: string
        label: string
    }) => {
        setDoc(prev => ({
            ...prev,
            selectedTable,
        }))
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

    const handleToggle = (dropdown: string) => {
        if (dropdown === 'clients') {
            setDisplayClients(prev => !prev)
        }

        if (dropdown === 'docs_table') {
            setDisplayDocsTbl(prev => !prev)
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

    /*
    |--------------------------------------------------------------------------
    | EFFECTS
    |--------------------------------------------------------------------------
    */

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
            setWidth(window.innerWidth - 240)
        }
    }, [])

    /*
    |--------------------------------------------------------------------------
    | RETURN
    |--------------------------------------------------------------------------
    */

    return {
        doc,
        rows,
        status,
        width_,
        options,
        clientArr,
        rowSelection,
        displayDocsTbl,
        displayClients,
        selectedRowKeys,

        clientLoader: isLoading || isFetching,

        setRows,
        setDisplayClients,
        setDisplayDocsTbl,

        getColumns,

        handleUpload,
        handleChange,
        handleToggle,
        handleFileChange,
        handleSelectTable,
        handleSelectClient,
        handleDeleteSelected,
    }
}

export default useUploadDocuments