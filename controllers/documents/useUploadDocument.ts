import dayjs from 'dayjs'
import * as XLSX from 'xlsx';
import useDocumentAPI from './api';
import { ExcelRow } from "./types";
import useClientAPI from '../clients/api';
import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";

const useUploadDocuments = () => {
    const {
        status,

        setStatus,
        uploadDocumentMutation
    } = useDocumentAPI()
    const {
        filter: clientFilter,

        setFilter,

        useGetClients
    } = useClientAPI()
    const [options, setOptions] = useState([
        {
            label: 'SUMMARY LIST OF SALES (SLS)',
            value: 'SALES'
        },
        {
            label: 'SUMMARY LIST OF PURCHASES (SLP)',
            value: 'PURCHASES'
        },
    ])
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys as number[])
        },
    }
    const [width_, setWidth] = useState(0)
    const [file, setFile] = useState<File | null>(null)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocsTbl, setDisplayDocsTbl] = useState(false)
    const [rows, setRows] = useState<(ExcelRow & { id: number })[]>([])
    const [doc, setDoc] = useState<{
        docSearch: string
        clientSearch: string
        selectedTable: {
            value: string,
            label: string
        }
        client: {
            id: number | null,
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        }
    }>({
        docSearch: '',
        clientSearch: '',
        client: {
            id: null,
            last_name: '',
            first_name: '',
            trade_name: '',
            registered_name: '',
        },
        selectedTable: {
            value: 'SALES',
            label: 'SUMMARY LIST OF SALES (SLS)'
        }
    })

    const { data: dataClients, isLoading, isFetching } = useGetClients(
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )
    const clientArr = dataClients?.clients;
    const formatTIN = (value: unknown) => {
        const digits = String(value ?? '')
            .replace(/\D/g, '')
            .slice(0, 9);

        const parts = digits.match(/.{1,3}/g);
        return parts ? parts.join('-') : '';
    };
    const getColumns = () => {
        if(doc.selectedTable.value === 'SALES') {
            return [
                { key: 'taxableMonth', title: 'Taxable Month', dataIndex: 'taxableMonth', render: (value: any) =>
                value
                    ? dayjs(
                        typeof value === 'number'
                        ? XLSX.SSF.format('m/d/yyyy', value) // convert Excel number
                        : value
                    ).format('MM-YYYY')
                    : '' },
                { key: 'tin', title: 'Taxpayer Identification Number', dataIndex: 'tin', width: 180, render: (value: string) => formatTIN(value) },
                { key: 'branchCode', title: 'Branch Code', dataIndex: 'branchCode' },
                { key: 'businessOwner', title: 'Business Owner', dataIndex: 'businessOwner' },
                { key: 'registeredName', title: 'Registered Name', dataIndex: 'registeredName' },
                { key: 'address1', title: 'Address 1', dataIndex: 'address1' },
                { key: 'address2', title: 'Address 2', dataIndex: 'address2' },
                { key: 'exemptSales', title: 'Exempt Sales', dataIndex: 'exemptSales', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'zeroRatedSales', title: 'Zero-Rated Sales', dataIndex: 'zeroRatedSales', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'vatableSales', title: 'Vatable Sales', dataIndex: 'vatableSales', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'grossAmount', title: 'Gross Amount', dataIndex: 'grossAmount', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'vatRate', title: 'VAT Rate', dataIndex: 'vatRate' },
                { key: 'vatAmount', title: 'VAT Amount', dataIndex: 'vatAmount', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'grossTaxable', title: 'Gross Taxable', dataIndex: 'grossTaxable', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
            ]
        } else { // PURCHASES
            return [
                { key: 'taxableMonth', title: 'Taxable Month', dataIndex: 'taxableMonth', render: (value: string) =>
                value
                    ? dayjs(
                        typeof value === 'number'
                        ? XLSX.SSF.format('m/d/yyyy', value) // convert Excel number
                        : value
                    ).format('MM-YYYY')
                    : '' },
                { key: 'tin', title: 'Taxpayer Identification Number', dataIndex: 'tin', width: 180, render: (value: string) => formatTIN(value) },
                { key: 'branchCode', title: 'Branch Code', dataIndex: 'branchCode' },
                { key: 'businessOwner', title: 'Business Owner', dataIndex: 'businessOwner' },
                { key: 'registeredName', title: 'Registered Name', dataIndex: 'registeredName' },
                { key: 'address1', title: 'Address 1', dataIndex: 'address1' },
                { key: 'address2', title: 'Address 2', dataIndex: 'address2' },
                { key: 'exemptPurchases', title: 'Exempt Purchases', dataIndex: 'exemptPurchases', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'zeroRatedPurchases', title: 'Zero-Rated Purchases', dataIndex: 'zeroRatedPurchases', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'vatablePurchases', title: 'Vatable Purchases', dataIndex: 'vatablePurchases', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'vatablePurchaseServices', title: 'Vatable Purchase of Services', dataIndex: 'vatablePurchaseServices', width: 180, render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'vatablePurchaseCapitalGoods', title: 'Vatable Purchase of Capital Goods', dataIndex: 'vatablePurchaseCapitalGoods', width: 180, render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'vatablePurchaseCapitalGoodsOther', title: 'Vatable Purchase of Goods other than Capital Goods', dataIndex: 'vatablePurchaseCapitalGoodsOther', width: 180, render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'grossAmount', title: 'Gross Amount', dataIndex: 'grossAmount', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'vatRate', title: 'VAT Rate', dataIndex: 'vatRate' },
                { key: 'vatAmount', title: 'VAT Amount', dataIndex: 'vatAmount', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
                { key: 'grossTaxable', title: 'Gross Taxable', dataIndex: 'grossTaxable', render: (value: number) => Number(value)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )},
            ]
        }
    }

    const handleDeleteSelected = () => {
        if (!selectedRowKeys.length) return

        const filtered = rows.filter(row => !selectedRowKeys.includes(row.id))
        setRows(filtered)
        setSelectedRowKeys([]) // reset after delete
    }

    const handleSelectTable = (selectedTable: {
        value: string,
        label: string
    }) => {
        setDoc({
            ...doc,
            selectedTable: selectedTable
        })
    }
    const handleSelectClient = (client: {
        id: number | null,
        last_name: string
        first_name: string
        trade_name: string
        registered_name: string
    }) => {
        setDoc({
            ...doc,
            client: client,
        })
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        if(name === 'clientSearch'){
            setFilter(prev => ({
                ...prev,
                search: value,
                currentPage: 1
            }))
        }
        setDoc({
            ...doc,
            [name]: value
        })

    }

    const handleToggle = (dropdown: string) => {
        if(dropdown === 'clients'){
            setDisplayClients(prevState => !prevState)
        }
        if(dropdown === 'docs_table'){
            setDisplayDocsTbl(prevState => !prevState)
        }
    }
    const detectSheet = (workbook: XLSX.WorkBook) => {
        let salesSheet = null
        let purchaseSheet = null

        workbook.SheetNames.forEach(name => {
            const upper = name.toUpperCase()

            if (upper.includes('SALE') || upper.includes('SLS')) {
                salesSheet = name
            }

            if (upper.includes('PURCHASE') || upper.includes('SLP')) {
                purchaseSheet = name
            }
        })

        return { salesSheet, purchaseSheet }
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return

        setFile(f)

        const reader = new FileReader()
        reader.onload = (evt) => {
            const data = evt.target?.result
            if (!data) return

            const workbook = XLSX.read(data, { type: 'array' })

            const { salesSheet, purchaseSheet } = detectSheet(workbook)

            let sheetName = null

            // ✅ PRIORITY LOGIC
            if (salesSheet && purchaseSheet) {
                // both exist → use selectedTable
                setOptions([
                    {
                        label: 'SUMMARY LIST OF SALES (SLS)',
                        value: 'SALES'
                    },
                    {
                        label: 'SUMMARY LIST OF PURCHASES (SLP)',
                        value: 'PURCHASES'
                    },
                ])
                sheetName =
                    doc.selectedTable.value === 'SALES'
                        ? salesSheet
                        : purchaseSheet
            } else if (salesSheet) {
                // only sales exists → force SALES
                sheetName = salesSheet
                setOptions([
                    {
                        label: 'SUMMARY LIST OF SALES (SLS)',
                        value: 'SALES'
                    }
                ])
                if (doc.selectedTable.value !== 'SALES') {
                    setDoc(prev => ({
                        ...prev,
                        selectedTable: {
                            value: 'SALES',
                            label: 'SUMMARY LIST OF SALES (SLS)'
                        }
                    }))
                }
            } else if (purchaseSheet) {
                // only purchases exists → force PURCHASES
                sheetName = purchaseSheet
                setOptions([
                    {
                        label: 'SUMMARY LIST OF PURCHASES (SLP)',
                        value: 'PURCHASES'
                    }
                ])
                if (doc.selectedTable.value !== 'PURCHASES') {
                    setDoc(prev => ({
                        ...prev,
                        selectedTable: {
                            value: 'PURCHASES',
                            label: 'SUMMARY LIST OF PURCHASES (SLP)'
                        }
                    }))
                }
            }

            // ❌ NOTHING FOUND
            if (!sheetName) {
                alert('No SALES or PURCHASES sheet found in Excel file')
                return
            }

            const sheet = workbook.Sheets[sheetName]

            // ❌ DO NOT type this as ExcelRow
            const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })

            const mapRow = (row: any, index: number): ExcelRow & { id: number } => {
                // console.log(row)
                const firstName = String(row['FIRST_NAME'] ?? '').trim();
                const lastName = String(row['LAST_NAME'] ?? '').trim();
                const middleName = String(row['MIDDLE_NAME'] ?? '').trim();
                if(doc.selectedTable.value === 'SALES') {
                    return {
                        id: index,
                        taxableMonth: row['TAXABLE MONTH'],
                        tin: row['TAXPAYER IDENTIFICATION NUMBER'],
                        branchCode: row['BRANCH CODE'],
                        registeredName: row['REGISTERED NAME'],
                        businessOwner: `${firstName} ${lastName}`.trim() + (middleName ? `, ${middleName}` : ''),
                        address1: row['ADDRESS ONE'],
                        address2: row['ADDRESS TWO'],
                        exemptSales: Number(row[' EXEMPT SALES'] || 0),
                        zeroRatedSales: Number(row['ZERO-RATED SALES'] || 0),
                        vatableSales: Number(row['VATABLE SALES'] || 0),
                        grossAmount: Number(row['GROSS AMOUNT'] || 0),
                        vatRate: Number(row['VAT RATE'] || 0),
                        vatAmount: Number(row['VAT AMOUNT'] || 0),
                        grossTaxable: Number(row['GROSS TAXABLE'] || 0)
                    }
                } else { // PURCHASES
                    return {
                        id: index,
                        taxableMonth: row['TAXABLE MONTH'],
                        tin: row['TAXPAYER IDENTIFICATION NUMBER'],
                        branchCode: row['BRANCH CODE'],
                        registeredName: row['REGISTERED NAME'],
                        businessOwner: `${firstName} ${lastName}`.trim() + (middleName ? `, ${middleName}` : ''),
                        address1: row['ADDRESS ONE'],
                        address2: row['ADDRESS TWO'],
                        exemptPurchases: Number(row['EXEMPT PURCHASES'] || 0),
                        zeroRatedPurchases: Number(row['ZERO-RATED PURCHASES'] || 0),
                        vatablePurchases: Number(row['VATABLE PURCHASES'] || 0),
                        vatablePurchaseServices: Number(row['VATABLE PURCHASE OF SERVICES'] || 0),
                        vatablePurchaseCapitalGoods: Number(row['VATABLE PURCHASE OF CAPITAL GOODS'] || 0),
                        vatablePurchaseCapitalGoodsOther: Number(row['VATABLE PURCHASE OF GOODS OTHER THAN CAPITAL GOODS'] || 0),
                        vatRate: Number(row['VAT RATE'] || 0),
                        vatAmount: Number(row['VAT AMOUNT'] || 0),
                        grossAmount: Number(row['GROSS AMOUNT'] || 0),
                        grossTaxable: Number(row['GROSS TAXABLE'] || 0)
                        
                    }
                }
            }

            const tableRows = json.map((row, index) => mapRow(row, index))

            setRows(tableRows)
        }

        reader.readAsArrayBuffer(f)
    }
    const handleUpload = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        if (!file || !doc.client.id) {
            alert('Missing file or client')
            return
        }

        uploadDocumentMutation.mutate({
            file,
            clientId: doc.client.id,
        })
    };

    useEffect(() => {
        if (!file) return
        const reader = new FileReader()
        reader.onload = (evt) => {
            const data = evt.target?.result
            if (!data) return

            const workbook = XLSX.read(data, { type: 'array' })

            const { salesSheet, purchaseSheet } = detectSheet(workbook)

            let sheetName = null

            // ✅ PRIORITY LOGIC
            if (salesSheet && purchaseSheet) {
                // both exist → use selectedTable
                sheetName =
                    doc.selectedTable.value === 'SALES'
                        ? salesSheet
                        : purchaseSheet
            } else if (salesSheet) {
                // only sales exists → force SALES
                sheetName = salesSheet

                if (doc.selectedTable.value !== 'SALES') {
                    setDoc(prev => ({
                        ...prev,
                        selectedTable: {
                            value: 'SALES',
                            label: 'SUMMARY LIST OF SALES (SLS)'
                        }
                    }))
                }
            } else if (purchaseSheet) {
                // only purchases exists → force PURCHASES
                sheetName = purchaseSheet

                if (doc.selectedTable.value !== 'PURCHASES') {
                    setDoc(prev => ({
                        ...prev,
                        selectedTable: {
                            value: 'PURCHASES',
                            label: 'SUMMARY LIST OF PURCHASES (SLP)'
                        }
                    }))
                }
            }

            // ❌ NOTHING FOUND
            if (!sheetName) {
                alert('No SALES or PURCHASES sheet found in Excel file')
                return
            }

            const sheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })

            const mapRow = (row: any, index: number): ExcelRow & { id: number } => {
                const firstName = String(row['FIRST_NAME'] ?? '').trim();
                const lastName = String(row['LAST_NAME'] ?? '').trim();
                const middleName = String(row['MIDDLE_NAME'] ?? '').trim();
                if(doc.selectedTable.value === 'SALES') {
                    return {
                        id: index,
                        taxableMonth: row['TAXABLE MONTH'],
                        tin: row['TAXPAYER IDENTIFICATION NUMBER'],
                        branchCode: row['BRANCH CODE'],
                        registeredName: row['REGISTERED NAME'],
                        businessOwner: `${firstName} ${lastName}`.trim() + (middleName ? `, ${middleName}` : ''),
                        address1: row['ADDRESS ONE'],
                        address2: row['ADDRESS TWO'],
                        exemptSales: Number(row[' EXEMPT SALES'] || 0),
                        grossAmount: Number(row['GROSS AMOUNT'] || 0),
                        zeroRatedSales: Number(row['ZERO-RATED SALES'] || 0),
                        vatableSales: Number(row['VATABLE SALES'] || 0),
                        vatRate: Number(row['VAT RATE'] || 0),
                        vatAmount: Number(row['VAT AMOUNT'] || 0),
                        grossTaxable: Number(row['GROSS TAXABLE'] || 0),
                    }
                } else { // PURCHASES
                    return {
                        id: index,
                        taxableMonth: row['TAXABLE MONTH'],
                        tin: row['TAXPAYER IDENTIFICATION NUMBER'],
                        branchCode: row['BRANCH CODE'],
                        registeredName: row['REGISTERED NAME'],
                        businessOwner: `${firstName} ${lastName}`.trim() + (middleName ? `, ${middleName}` : ''),
                        address1: row['ADDRESS ONE'],
                        address2: row['ADDRESS TWO'],
                        exemptPurchases: Number(row['EXEMPT PURCHASES'] || 0),
                        zeroRatedPurchases: Number(row['ZERO-RATED PURCHASES'] || 0),
                        vatablePurchases: Number(row['VATABLE PURCHASES'] || 0),
                        vatablePurchaseServices: Number(row['VATABLE PURCHASE OF SERVICES'] || 0),
                        vatablePurchaseCapitalGoods: Number(row['VATABLE PURCHASE OF CAPITAL GOODS'] || 0),
                        vatablePurchaseCapitalGoodsOther: Number(row['VATABLE PURCHASE OF GOODS OTHER THAN CAPITAL GOODS'] || 0),
                        grossAmount: Number(row['GROSS AMOUNT'] || 0),
                        vatRate: Number(row['VAT RATE'] || 0),
                        vatAmount: Number(row['VAT AMOUNT'] || 0),
                        grossTaxable: Number(row['GROSS TAXABLE'] || 0),
                    }
                }
                }

            setRows(json.map((row, index) => mapRow(row, index)))
        }

        reader.readAsArrayBuffer(file)
    }, [doc.selectedTable, file])

    
    useEffect(() => {
        if(typeof window !== 'undefined'){
            setWidth(window.innerWidth - 240)
        }
    },[])

    return {
        // STATES
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

        // SET STATES
        setRows,
        setDisplayClients,
        setDisplayDocsTbl,

        getColumns,
        
        // HANDLES
        handleUpload,
        handleChange,
        handleToggle,
        handleFileChange,
        handleSelectTable,
        handleSelectClient,
        handleDeleteSelected,
    }
}

export default useUploadDocuments;