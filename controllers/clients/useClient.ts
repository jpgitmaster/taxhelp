import useClientAPI from "./api";
import { useRouter } from 'next/router';
const useClient = () => {
    const {
        client,
        status,

        useGetClient
    } = useClientAPI()
    const router = useRouter()
    const { clientID } = router.query
    const clientIdNumber = Number(clientID)
    const { data } = useGetClient(clientIdNumber, {
        enabled: typeof clientID === 'string',
    })

    return {
        // STATES
        status,
        client:data,
        // SET STATES
        

        // HANDLES
        
    }
}

export default useClient;