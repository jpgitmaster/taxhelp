import { Dayjs } from 'dayjs';
import useDashboardAPI from './api';
import useClientAPI from '../clients/api';
import useGlobal from '@/controllers/global/useGlobal'
import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";
const useDashboard = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    const {
        status,
        dashboard,

        setStatus,
        setDashboard,
    } = useDashboardAPI()
    const {
        filter: clientFilter,
        setFilter: clientSetFilter,

        useGetClients
    } = useClientAPI()
    const [mounted, setMounted] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [calendarHeight, setCalendarHeight] = useState(500)
    const [displayClients, setDisplayClients] = useState(false)
    const [doc, setDoc] = useState<{
        clientSearch: string
        client: {
            id: number | null,
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        },
    }>({
        clientSearch: '',
        client: {
            id: null,
            last_name: '',
            first_name: '',
            trade_name: '',
            registered_name: '',
        },
    })

    const { data: dataClients, isLoading: isLoadingClients, isFetching: isFetchingClients } = useGetClients(    
        clientFilter.currentPage,
        clientFilter.recordsLimit,
        clientFilter.filter,
        clientFilter.search
    )
    const clientArr = dataClients?.clients;
    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target
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
        setDashboard(prev => ({
            ...prev,
            scheduleObj: {
                ...prev.scheduleObj,
                [name]: value
            }
        }))
        handleRemoveErr(dashboard.scheduleErr, name)
    }

    const handleToggle = (dropdown: string) => {
        if(dropdown === 'clients'){
            setDisplayClients(prevState => !prevState)
        }
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
    }
    const handleDate = (
        dates: [Dayjs | null, Dayjs | null] | null,
        // dateStrings: [string, string]
        ) => {
        console.log(dates)
        setDashboard(prev => ({
            ...prev,
            scheduleObj: {
            ...prev.scheduleObj,
            schedule: dates
            }
        }))

        handleRemoveErr(dashboard.scheduleErr, 'schedule')
    }
    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
    }
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 800) {
                setCalendarHeight(320); // mobile → scroll
            }
        };

        handleResize(); // run on mount
        setMounted(true);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return {
        // STATES
        doc,
        status,
        mounted,
        dashboard,
        clientArr,
        isModalOpen,
        displayClients,
        calendarHeight,
        clientLoader: isLoadingClients || isFetchingClients,

        // SET STATES
        setDisplayClients,

        // HANDLES
        handleDate,
        handleBlur,
        handleToggle,
        handleSubmit,
        handleChange,
        handleResubmit,
        handleRemoveErr,
        handleOpenModal,
        handleCloseModal,
        handleSelectClient,
    }
}

export default useDashboard;