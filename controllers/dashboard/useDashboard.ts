import useDashboardAPI from './api';
import dayjs, { Dayjs } from 'dayjs';
import useClientAPI from '../clients/api';
import { EventClickArg } from '@fullcalendar/core';
import { ScheduleErr, ScheduleObj } from './types';
import useGlobal from '@/controllers/global/useGlobal'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'
type EventLike = {
    id: number | null
    title: string;
    start: Date | string;
    end: Date | string | null;
    backgroundColor?: string;
    extendedProps?: EventExtendedProps;
};
type EventExtendedProps = {
    client?: {
        id: number | null,
        last_name: string
        first_name: string
        trade_name: string
        registered_name: string
    }; // or proper client type
    description?: string;
    categoryId?: number;
    categoryName?: string;
    categoryColor?: string;
};
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
        useGetScheduleCategories,

        useUpdateSchedule,
        useCreateSchedule,
        useDeleteSchedule
    } = useDashboardAPI()
    const {
        filter: clientFilter,
        setFilter: clientSetFilter,

        useGetClients
    } = useClientAPI()
    const [mounted, setMounted] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
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
    const { data: scheds } = useGetSchedules()
    const { data, isLoading: isLoadingCategories, isFetching: isFetchingCategories } = useGetScheduleCategories()
    const schedCategories = data?.schedCategories
    const events =
        scheds?.schedules?.map((schedule: ScheduleObj) => ({
            id: schedule.id,
            title: schedule.title,
            client_id: schedule.client_id,
            client: schedule.client,
            start: dayjs(schedule.schedule_date_from).format('YYYY-MM-DD'),
            end: dayjs(schedule.schedule_date_to).format('YYYY-MM-DD'),
            backgroundColor: schedule.category?.color,
            borderColor: schedule.category?.color,
            extendedProps: {
                client: schedule.client,
                description: schedule.description,
                categoryId: schedule.category?.id,
                categoryName: schedule.category?.name,
                categoryColor: schedule.category?.color
            }
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
    const handleDeleteRecord = (id: number) => {
        setStatus({...status, loader: true})
        useDeleteSchedule.mutate(id, {
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

    const openEventModal = (event: EventLike) => {
        const start = event.start ? dayjs(event.start) : null;
        const end = event.end ? dayjs(event.end) : start;

        setDashboard(prev => ({
            ...prev,
            scheduleObj: {
            ...prev.scheduleObj,
                id: event.id,
                title: event.title,
                schedule: start
                    ? [start, (end ?? start).subtract(1, 'day')]
                    : null,
                description: event.extendedProps?.description || '',
            }
        }));

        setDoc(prev => ({
            ...prev,
            selectedCategory: {
                id: event.extendedProps?.categoryId ?? null,
                name: event.extendedProps?.categoryName ?? '',
                color: event.extendedProps?.categoryColor ?? event.backgroundColor ?? ''
            },
            client: event.extendedProps?.client || { // 👈 SET CLIENT HERE
                id: null,
                last_name: '',
                first_name: '',
                trade_name: '',
                registered_name: '',
            }
        }));

        handleOpenModal();
    };
    
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
                client_id: client.id
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

    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        const props = event.extendedProps as EventExtendedProps;

        const start = event.start;
        const end = event.end;

        setDashboard({
            ...dashboard,
            scheduleObj: {
                ...dashboard.scheduleObj,
                id: Number(event.id),
                title: event.title,
                schedule: start
                    ? [
                        dayjs(start),
                        dayjs(end ?? start).subtract(1, 'day') // 🔥 fix here
                    ]
                    : null,
                description: props.description || '',
            }
        });

        setDoc({
            ...doc,
            selectedCategory: {
                id: props.categoryId ?? null,
                name: props.categoryName ?? '',
                color: props.categoryColor ?? '',
            },
            client: props.client || {
                id: null,
                last_name: '',
                first_name: '',
                trade_name: '',
                registered_name: '',
            }
        });

        handleOpenModal();
    };

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
        if(dashboard.scheduleObj.id){
            useUpdateSchedule.mutate(dashboard.scheduleObj, {
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
        }else{
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
        isEditMode,
        isModalOpen,
        displayClients,
        calendarHeight,
        displayCategory,
        schedCategories,
        clientLoader: isLoadingClients || isFetchingClients,
        categoryLoader: isLoadingCategories || isFetchingCategories,

        // SET STATES
        setDoc,
        setIsEditMode,
        setDashboard,
        openEventModal,
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
        handleEventClick,
        handleDeleteRecord,
        handleSelectClient,
        handleSelectCategory,
    }
}

export default useDashboard;