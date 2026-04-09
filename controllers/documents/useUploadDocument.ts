import * as XLSX from 'xlsx';
import useDocumentAPI from './api';
import { ExcelRow } from "./types";
import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";
import useClients from '../clients/useClients';

const useUploadDocuments = () => {
    const {
        status,

        setStatus,
        uploadDocumentMutation
    } = useDocumentAPI()
    const {
        client
    } = useClients()
    const { clientArr } = client
    const [width_, setWidth] = useState(0)
    const [file, setFile] = useState<File | null>(null)
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocsTbl, setDisplayDocsTbl] = useState(false)
    const [rows, setRows] = useState<(ExcelRow & { id: number })[]>([])
    const [doc, setDoc] = useState<{
        search: string
        selectedTable: string
        client: {
            id: number | null,
            registered_name: string
        }
    }>({
        search: '',
        client: {
            id: null,
            registered_name: ''
        },
        selectedTable: 'SALES'
    })
    
    // [
    //     {
    //         id: 1,
    //         name: 'RB ACCOUNTING OFFICE',
    //     },
    //     {
    //         id: 2,
    //         name: 'VALCITY VIRTUAL OFFICE',
    //     },
    //     {
    //         id: 3,
    //         name: 'QCITY VIRTUAL OFFICE'
    //     }
    // ]

    const getColumns = () => {
        if(doc.selectedTable === 'SALES') {
            return [
            { key: 'tin', title: 'TIN', dataIndex: 'tin' },
            { key: 'registeredName', title: 'Registered Name', dataIndex: 'registeredName' },
            { key: 'firstName', title: 'First Name', dataIndex: 'firstName' },
            { key: 'lastName', title: 'Last Name', dataIndex: 'lastName' },
            { key: 'grossAmount', title: 'Gross Amount', dataIndex: 'grossAmount' },
            { key: 'exemptSales', title: 'Exempt Sales', dataIndex: 'exemptSales' },
            { key: 'zeroRatedSales', title: 'Zero Rated', dataIndex: 'zeroRatedSales' },
            { key: 'vatableSales', title: 'Vatable Sales', dataIndex: 'vatableSales' },
            { key: 'vatRate', title: 'VAT Rate', dataIndex: 'vatRate' },
            { key: 'vatAmount', title: 'VAT Amount', dataIndex: 'vatAmount' },
            { key: 'grossTaxable', title: 'Gross Taxable', dataIndex: 'grossTaxable' },
            { key: 'atc', title: 'ATC', dataIndex: 'atc' },
            { key: 'ewtRate', title: 'EWT Rate', dataIndex: 'ewtRate' },
            { key: 'taxAmount', title: 'Tax Amount', dataIndex: 'taxAmount' },
            ]
        } else { // PURCHASES
            return [
            { key: 'tin', title: 'TIN', dataIndex: 'tin' },
            { key: 'registeredName', title: 'Registered Name', dataIndex: 'registeredName' },
            { key: 'firstName', title: 'First Name', dataIndex: 'firstName' },
            { key: 'lastName', title: 'Last Name', dataIndex: 'lastName' },
            { key: 'grossAmount', title: 'Gross Amount', dataIndex: 'grossAmount' },
            { key: 'exemptSales', title: 'Exempt Purchases', dataIndex: 'exemptSales' },
            { key: 'zeroRatedSales', title: 'Zero Rated Purchases', dataIndex: 'zeroRatedSales' },
            { key: 'vatableSales', title: 'Total Vatable Purchases', dataIndex: 'vatableSales' },
            { key: 'vatableServices', title: 'Vatable Services', dataIndex: 'vatableServices' },
            { key: 'vatableCapital', title: 'Vatable Capital Goods', dataIndex: 'vatableCapital' },
            { key: 'vatableGoods', title: 'Vatable Other Goods', dataIndex: 'vatableGoods' },
            { key: 'vatRate', title: 'VAT Rate', dataIndex: 'vatRate' },
            { key: 'vatAmount', title: 'VAT Amount', dataIndex: 'vatAmount' },
            { key: 'grossTaxable', title: 'Gross Taxable', dataIndex: 'grossTaxable' },
            { key: 'atc', title: 'ATC', dataIndex: 'atc' },
            { key: 'ewtRate', title: 'W/Tax Rate', dataIndex: 'ewtRate' },
            { key: 'taxAmount', title: 'W/Tax Amount', dataIndex: 'taxAmount' },
            ]
        }
    }
    const handleSelectTable = (selectedTable: string) => {
        setDoc({
            ...doc,
            selectedTable: selectedTable
        })
    }
    const handleSelectClient = (client: { id: number, registered_name: string }) => {
        setDoc({
            ...doc,
            client: client
        })
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
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
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return

        setFile(f)

        const reader = new FileReader()
        reader.onload = (evt) => {
            const data = evt.target?.result
            if (!data) return

            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames.find(name =>
                name.toUpperCase().includes(doc.selectedTable)
            )

            if (!sheetName) {
                alert(`${doc.selectedTable} sheet not found in Excel file`)
                return
            }

            const sheet = workbook.Sheets[sheetName]

            // ❌ DO NOT type this as ExcelRow
            const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })

            const mapRow = (row: any, index: number): ExcelRow & { id: number } => {
                if(doc.selectedTable === 'SALES') {
                    return {
                    id: index,
                    taxableMonth: row['TAXABLE MONTH'],
                    invoiceDate: row['INVOICE DATE'],
                    invoiceNumber: row['INVOICE NUMBER'],
                    tin: row['TAXPAYER IDENTIFICATION NUMBER'],
                    branchCode: row['BRANCH CODE'],
                    registeredName: row['REGISTERED NAME'],
                    lastName: row['LAST_NAME'],
                    firstName: row['FIRST_NAME'],
                    middleName: row['MIDDLE_NAME'],
                    address1: row['ADDRESS_1'],
                    address2: row['ADDRESS_2'],
                    particulars: row['PARTICULARS'],
                    terms: row['TERMS'],
                    accountName: row['ACCOUNT_NAME'],
                    grossAmount: Number(row['GROSS AMOUNT *'] || 0),
                    exemptSales: Number(row[' EXEMPT SALES'] || 0),
                    zeroRatedSales: Number(row['ZERO-RATED SALES'] || 0),
                    vatableSales: Number(row['VATABLE SALES'] || 0),
                    vatRate: Number(row['VAT RATE'] || 0),
                    vatAmount: Number(row['VAT AMOUNT*'] || 0),
                    grossTaxable: Number(row['GROSS TAXABLE *'] || 0),
                    atc: row['ATC'],
                    ewtRate: Number(row['EWT RATE'] || 0),
                    taxAmount: Number(row['TAX AMOUNT'] || 0),
                    }
                } else { // PURCHASES
                    return {
                    id: index,
                    taxableMonth: row['TAXABLE MONTH'],
                    invoiceDate: row['INVOICE DATE'],
                    invoiceNumber: row['INVOICE NUMBER'],
                    tin: row['TAXPAYER IDENTIFICATION NUMBER'],
                    branchCode: row['BRANCH CODE'],
                    registeredName: row['REGISTERED NAME'],
                    lastName: row['LAST_NAME'],
                    firstName: row['FIRST_NAME'],
                    middleName: row['MIDDLE_NAME'],
                    address1: row['ADDRESS_1'],
                    address2: row['ADDRESS_2'],
                    particulars: row['PARTICULARS'],
                    terms: row['TERMS'],
                    accountName: row['ACCOUNT_NAME'],
                    grossAmount: Number(row['GROSS  AMOUNT'] || 0),
                    exemptSales: Number(row[' EXEMPT PURCHASES'] || 0),
                    zeroRatedSales: Number(row['ZERO-RATED PURCHASES'] || 0),
                    vatableSales: Number(row['TOTAL VATABLE PURCHASES*'] || 0),
                    vatRate: Number(row['VAT RATE'] || 0),
                    vatAmount: Number(row['VAT AMOUNT*'] || 0),
                    grossTaxable: Number(row['GROSS TAXABLE*'] || 0),
                    atc: row['ATC'],
                    ewtRate: Number(row['W/TAX RATE'] || 0),
                    taxAmount: Number(row['W/TAX AMOUNT*'] || 0),
                    }
                }
                }

            const tableRows = json.map((row, index) => mapRow(row, index))

            setRows(tableRows)
        }

        reader.readAsBinaryString(f)
    }
    const handleUpload = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        if (!file || !doc.client.id) {
            alert('Missing file or client')
            return
        }

        // 👇 TypeScript now knows these are NOT null
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

            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames.find(name =>
                name.toUpperCase().includes(doc.selectedTable)
            )

            if (!sheetName) {
                alert(`${doc.selectedTable} sheet not found in Excel file`)
                return
            }

            const sheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })

            const mapRow = (row: any, index: number): ExcelRow & { id: number } => {
                if(doc.selectedTable === 'SALES') {
                    return {
                    id: index,
                    taxableMonth: row['TAXABLE MONTH'],
                    invoiceDate: row['INVOICE DATE'],
                    invoiceNumber: row['INVOICE NUMBER'],
                    tin: row['TAXPAYER IDENTIFICATION NUMBER'],
                    branchCode: row['BRANCH CODE'],
                    registeredName: row['REGISTERED NAME'],
                    lastName: row['LAST_NAME'],
                    firstName: row['FIRST_NAME'],
                    middleName: row['MIDDLE_NAME'],
                    address1: row['ADDRESS_1'],
                    address2: row['ADDRESS_2'],
                    particulars: row['PARTICULARS'],
                    terms: row['TERMS'],
                    accountName: row['ACCOUNT_NAME'],
                    grossAmount: Number(row['GROSS AMOUNT *'] || 0),
                    exemptSales: Number(row[' EXEMPT SALES'] || 0),
                    zeroRatedSales: Number(row['ZERO-RATED SALES'] || 0),
                    vatableSales: Number(row['VATABLE SALES'] || 0),
                    vatRate: Number(row['VAT RATE'] || 0),
                    vatAmount: Number(row['VAT AMOUNT*'] || 0),
                    grossTaxable: Number(row['GROSS TAXABLE *'] || 0),
                    atc: row['ATC'],
                    ewtRate: Number(row['EWT RATE'] || 0),
                    taxAmount: Number(row['TAX AMOUNT'] || 0),
                    }
                } else { // PURCHASES
                    return {
                    id: index,
                    taxableMonth: row['TAXABLE MONTH'],
                    invoiceDate: row['INVOICE DATE'],
                    invoiceNumber: row['INVOICE NUMBER'],
                    tin: row['TAXPAYER IDENTIFICATION NUMBER'],
                    branchCode: row['BRANCH CODE'],
                    registeredName: row['REGISTERED NAME'],
                    lastName: row['LAST_NAME'],
                    firstName: row['FIRST_NAME'],
                    middleName: row['MIDDLE_NAME'],
                    address1: row['ADDRESS_1'],
                    address2: row['ADDRESS_2'],
                    particulars: row['PARTICULARS'],
                    terms: row['TERMS'],
                    accountName: row['ACCOUNT_NAME'],
                    grossAmount: Number(row['GROSS  AMOUNT'] || 0),
                    exemptSales: Number(row[' EXEMPT PURCHASES'] || 0),
                    zeroRatedSales: Number(row['ZERO-RATED PURCHASES'] || 0),
                    vatableSales: Number(row['TOTAL VATABLE PURCHASES*'] || 0),
                    vatableServices: Number(row['VATABLE PURCHASE OF SERVICES'] || 0),
                    vatableCapital: Number(row['VATABLE PURCHASE OF CAPITAL GOODS'] || 0),
                    vatableGoods: Number(row['VATABLE PURCHASE OF GOODS OTHER THAN CAPITAL GOODS'] || 0),
                    vatRate: Number(row['VAT RATE'] || 0),
                    vatAmount: Number(row['VAT AMOUNT*'] || 0),
                    grossTaxable: Number(row['GROSS TAXABLE*'] || 0),
                    atc: row['ATC'],
                    ewtRate: Number(row['W/TAX RATE'] || 0),
                    taxAmount: Number(row['W/TAX AMOUNT*'] || 0),
                    }
                }
                }

            setRows(json.map((row, index) => mapRow(row, index)))
        }

        reader.readAsBinaryString(file)
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
        clientArr,
        displayDocsTbl,
        displayClients,

        // SET STATES
        setRows,
        setDisplayClients,
        setDisplayDocsTbl,

        getColumns,
        
        // HANDLES
        handleUpload,
        handleChange,
        handleFileChange,
        handleSelectTable,
        handleSelectClient,
        handleToggle
    }
}

export default useUploadDocuments;