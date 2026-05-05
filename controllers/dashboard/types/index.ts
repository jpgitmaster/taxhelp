import { Dayjs } from 'dayjs';
interface ScheduleObj{
  id: number | null
  title: string
  client_id: number | null
  category: {
    id: null | number
    name: string
    color: string
  }
  client?: {
    id: number | null,
    last_name: string
    first_name: string
    trade_name: string
    registered_name: string
  },
  description: string
  schedule_date_to: string
  schedule_date_from: string
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