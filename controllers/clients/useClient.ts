import useClientAPI from "./api";
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
const useClient = () => {
    const {
        client,
        status,

        useGetClient
    } = useClientAPI()
    const router = useRouter()
    const { clientID } = router.query

    useEffect(() => {
        if(clientID){
            useGetClient(Number(clientID))
        }
    }, [clientID])

    return {
        // STATES
        client,
        status,

        // SET STATES
        

        // HANDLES
        
    }
}

export default useClient;