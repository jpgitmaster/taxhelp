import Axios from 'axios'
import { useState } from 'react'
import { Status } from '@/controllers/global/types'
import {
    signIn,
    // useSession
} from 'next-auth/react'
import { initStatus } from '@/controllers/global/states'
const AuthAPIcalls = () => {
    // const session = useSession()
    // const sessionEmail = session?.data?.user?.email
    // const refreshToken = session?.data?.refreshToken
    const [status, setStatus] = useState<Status>(initStatus)
    const [err, setErr] = useState<Record<string, string | { value: string; }>>({
        email: '',
        password: ''
    })
    const authLogin = async (email: string, password: string) => {
        await Axios({
            method: 'POST',
            url: '/auth/login',
            data: {
              email: email,
              password: password
            }
        }).then((res) => {
            const { id, email, details, accessToken, refreshToken, accessTokenExpiresIn } = res.data
            
            if(accessToken){
                return signIn('credentials', {
                    id: id,
                    email: email,
                    password: password,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    lastName: details.lastName,
                    firstName: details.firstName,
                    roleName: details.role?.name,
                    roleColor: details.role?.color,
                    accessTokenExpiresIn: accessTokenExpiresIn,
                    redirect: true,
                    callbackUrl: '/bookkeeper/dashboard'
                })
            }
        }).catch(async (error) => {
            console.log(error)
            if(error && error.response){
                const { message, statusCode } = error?.response?.data
                console.log(error?.response?.data)
                switch (statusCode) {
                    case 401:
                        const timer1 = setTimeout(() => {
                            setErr({
                                ...err,
                                password: message
                            })
                            setStatus({...status, loader: false})
                            return false
                        }, 500)
                        return () => clearTimeout(timer1)
                    case 404:
                        const timer2 = setTimeout(() => {
                            setErr({
                                ...err,
                                email: message
                            })
                            setStatus({...status, loader: false})
                            return false
                        }, 500)
                        return () => clearTimeout(timer2)
                }
            }
        })
    }

    const authRefreshToken = async () => {
        // await Axios({
        //     method: 'POST',
        //     url: '/auth/refresh_token',
        //     data: {
        //         email: sessionEmail,
        //         refresh: refreshToken
        //     }
        // }).then((res) => {
        //     const { accessToken } = res?.data
        //     Axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken
        // }).catch(async (error) => {
        //     console.log('error')
        //     console.log(error)
        //     return error
        // })
    }

    return {
        //STATES
        err,
        status,

        // SET STATES
        setErr,
        setStatus,
        
        // REQUESTS
        authLogin,
        authRefreshToken
    }
}
export default AuthAPIcalls;