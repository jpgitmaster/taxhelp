const initScheduleObj = {
    id: null,
    title: '',
    client: '',
    category: {
        value: '',
        label: '',
        color: ''
    },
    description: '',
    schedule: null,
}
const initDashboard = {
    scheduleArr: [],
    scheduleErr: {
        title: '',
        category: '',
        description: '',
        endDateTime: '',
        startDateTime: ''
    },
    totalSchedules: 0,
    scheduleObj: initScheduleObj,
}

export {
    initDashboard
};