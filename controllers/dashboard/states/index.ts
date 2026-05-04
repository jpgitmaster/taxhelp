const initScheduleObj = {
    id: null,
    title: '',
    clientID: null,
    category: {
        id: null,
        name: '',
        color: ''
    },
    description: '',
    schedule: null,
    schedule_date_to: '',
    schedule_date_from: '',
}
const initDashboard = {
    scheduleArr: [],
    scheduleErr: {
        title: '',
        client: '',
        category: '',
        description: '',
        endDateTime: '',
        startDateTime: ''
    },
    totalSchedules: 0,
    scheduleObj: initScheduleObj,
}

export {
    initDashboard,
    initScheduleObj
};