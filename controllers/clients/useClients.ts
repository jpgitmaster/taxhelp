import useClientAPI from "./api";
import { useState, useEffect } from "react";
const useClients = () => {
    const {
        client,
        filter,

        setClient,

        useGetClients
    } = useClientAPI()

    const { data } = useGetClients(
        filter.currentPage,
        filter.recordsLimit,
        filter.filter,
        filter.search
    )

    useEffect(() => {
        if(data?.data?.length){
            setClient(
                {
                    ...client,
                    clientArr: data.data,
                    totalClients: data.totalDocs
                }
            )
        }
    }, [data])

    return {
        // STATES
        client

        // SET STATES
        

        // HANDLES
        
    }
}

export default useClients;