import { useRouter } from 'next/router';
import useQueryClients from './api/queries';
const useClient = () => {
    const {
        getClient
    } = useQueryClients()
    const router = useRouter()
    const { clientID } = router.query
    const { data } = getClient(Number(clientID))

    return {
        // STATES
        client:data,
        // SET STATES
        

        // HANDLES
        
    }
}

export default useClient;