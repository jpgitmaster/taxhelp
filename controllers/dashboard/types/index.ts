import { Dayjs } from 'dayjs';
interface ScheduleObj{
  id: number | null
  title: string
  client: string
  category: {
    value: string
    label: string
    color: string
  }
  description: string
  schedule: [Dayjs | null, Dayjs | null] | null
}

type ScheduleErr = {
  title: string
  category: string
  description: string
  endDateTime: string
  startDateTime: string
};

interface Dashboard{
    scheduleObj: ScheduleObj
    scheduleArr: ScheduleObj[]
    totalSchedules: number
    scheduleErr: Record<string, string | { value: string; }>
}

export type {
    Dashboard,
    ScheduleErr,
    ScheduleObj,
}