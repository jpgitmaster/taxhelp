import { useState } from 'react'
import { Dashboard } from '../types'
import { initDashboard } from '../states'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'

const useDashboardAPI = () => {
    const [filter, setFilter] = useState(initFilter)
    const [status, setStatus] = useState<Status>(initStatus)

    const [dashboard, setDashboard] = useState<Dashboard>(initDashboard)
    return {
        //STATES
        filter,
        status,
        dashboard,
        
        // SET STATES
        setFilter,
        setStatus,
        setDashboard,

        // QUERIES

        // MUTATION

        //HANDLES
    }
}
export default useDashboardAPI;