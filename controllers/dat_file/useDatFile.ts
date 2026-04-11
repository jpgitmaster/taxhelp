import * as XLSX from 'xlsx';
import useClients from '../clients/useClients';
import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";

const useDatFile = () => {
    const {
        client,
        loader: clientLoader
    } = useClients()
    const { clientArr } = client
    const [displayClients, setDisplayClients] = useState(false)
    const [displayDocsTbl, setDisplayDocsTbl] = useState(false)
    const [doc, setDoc] = useState<{
        search: string
        selectedTable: {
            value: string,
            label: string
        }
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
        selectedTable: {
            value: 'SALES',
            label: 'SUMMARY LIST OF SALES (SLS)'
        }
    })
    const handleSelectClient = (client: { id: number, registered_name: string }) => {
        setDoc({
            ...doc,
            client: client
        })
    }
    const handleSelectTable = (selectedTable: { value: string, label: string }) => {
        setDoc({
            ...doc,
            selectedTable: selectedTable
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
    return {
        // STATES
        doc,
        clientArr,
        clientLoader,
        displayClients,
        displayDocsTbl,

        // SET STATES
        setDisplayClients,
        setDisplayDocsTbl,

        // HANDLES
        handleToggle,
        handleChange,
        handleSelectClient,
        handleSelectTable
    }
}

export default useDatFile;