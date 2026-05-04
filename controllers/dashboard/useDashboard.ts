import dayjs, { Dayjs } from 'dayjs';
import useDashboardAPI from './api';
import { ScheduleErr, ScheduleObj } from './types';
import useClientAPI from '../clients/api';
import useGlobal from '@/controllers/global/useGlobal'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'
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
        useGetSchedules,
        useCreateSchedule
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
    const [displayCategory, setDisplayCategory] = useState(false)
    const [doc, setDoc] = useState<{
        clientSearch: string
        selectedCategory: {
            id: null | number
            name: string
            color: string
        },
        client: {
            id: number | null,
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        },
    }>({
        clientSearch: '',
        selectedCategory: {
            id: null,
            name: '',
            color: '',
        },
        client: {
            id: null,
            last_name: '',
            first_name: '',
            trade_name: '',
            registered_name: '',
        },
    })
    const { data } = useGetSchedules()
    const events =
            data?.schedules?.map((schedule: ScheduleObj) => ({
                title: schedule.title,
                start: dayjs(schedule.schedule_date_from).format('YYYY-MM-DD'),
                end: dayjs(schedule.schedule_date_to).format('YYYY-MM-DD'),
                backgroundColor: schedule.category?.color,
                borderColor: schedule.category?.color,
            })) || [];
    const fieldValidations = {
        title: { usename: 'Title', required: true },
        schedule: { usename: 'Schedule', required: true },
        category: { usename: 'Category', required: true },
    }

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
    const handleSelectCategory = (selectedCategory: {
        id: null | number
        name: string,
        color: string
    }) => {
        setDoc({
            ...doc,
            selectedCategory: selectedCategory
        })
        setDashboard(prev => ({
            ...prev,
            scheduleObj: {
                ...prev.scheduleObj,
                category: selectedCategory
            }
        }))
        handleRemoveErr(dashboard.scheduleErr, 'category')
    }

    const handleToggle = (dropdown: string) => {
        if(dropdown === 'clients'){
            setDisplayClients(prevState => !prevState)
        }
        if(dropdown === 'categories'){
            setDisplayCategory(prevState => !prevState)
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
        setDashboard(prev => ({
            ...prev,
            scheduleObj: {
                ...prev.scheduleObj,
                clientID: client.id
            }
        }))
    }
    const handleDate = (
        dates: [Dayjs | null, Dayjs | null] | null,
        // dateStrings: [string, string]
        ) => {
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
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, {
            ...dashboard.scheduleObj,
            category: dashboard.scheduleObj?.category?.name ? dashboard.scheduleObj.category.name : '',
            schedule: dashboard.scheduleObj?.schedule ? String(dashboard.scheduleObj) : '',
        })
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setDashboard({
                    ...dashboard,
                    scheduleErr: validation_errors as ScheduleErr
                })
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }
        
        useCreateSchedule.mutate(dashboard.scheduleObj, {
            onSuccess: () => {
                setDoc({
                    clientSearch: '',
                    selectedCategory: {
                        id: null,
                        name: '',
                        color: '',
                    },
                    client: {
                        id: null,
                        last_name: '',
                        first_name: '',
                        trade_name: '',
                        registered_name: '',
                    },
                })
                handleCloseModal()
            }
        })
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
        events,
        status,
        mounted,
        dashboard,
        clientArr,
        isModalOpen,
        displayClients,
        calendarHeight,
        displayCategory,
        clientLoader: isLoadingClients || isFetchingClients,

        // SET STATES
        setDoc,
        setDashboard,
        setDisplayClients,
        setDisplayCategory,
        
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
        handleSelectCategory,
    }
}

export default useDashboard;