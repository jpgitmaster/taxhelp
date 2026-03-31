import { useRouter } from 'next/router'
import { User, UserObj } from '../types'
import { useState, useContext } from 'react'
import api from '@/components/reusables/axios'
import { initUser } from '../states/initUsers'
import { Status, ErrorItem } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'
import { AppContext } from '@/pages/AppProvider'
import { message } from 'antd'

const UserAPIcalls = () => {
    const router = useRouter()
    const [user, setUser] = useState<User>(initUser)
    const [filter, setFilter] = useState(initFilter)
    const [status, setStatus] = useState<Status>(initStatus)
    const createUser = async (user: UserObj, checkedRoles: string[], { toggleModal }: { toggleModal: (modal: boolean, form: string) => void }) => {
        await api({
            method: 'POST',
            url: '/api/v1/auth/register',
            data: {
                email: user.email,
                roles: checkedRoles,
                password: user.password,
                confirm_password: user.confirmPassword,
            }
        }).then((res) => {
            // const { message } = res.data
            console.log(res)
            const timer = setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    loader: false,
                    message: 'Account Created Successfully!',
                    submessage: 'Check your email to activate your account and get started. Once verified, you\'re ready to explore.'
                }))
                // toggleModal(false, 'registration')
            }, 500)
            return () => clearTimeout(timer)
        }).catch(async (error) => {
            console.log(error)
            // const message: ErrorItem[] | undefined = error?.response?.data?.message;
            // if (Array.isArray(message)) {
            //     setUser((prevUser) => ({
            //         ...prevUser,
            //         userErr: Object.fromEntries(
            //                     message.map(({ field, message }) => [field, message])
            //                 )
            //     }));
            // }
        })
        
    }

    const loginUser = async (user: UserObj) => {
        await api({
            method: 'POST',
            url: '/api/v1/auth/login',
            data: {
                email: user.email,
                password: user.password
            }
        }).then((res) => {
            console.log(res)
            // if (accessToken) {
            //     return signIn('credentials', {
            //         id: id,
            //         email: email,
            //         password: password,
            //         accessToken: accessToken,
            //         refreshToken: refreshToken,
            //     })
            // }
        }).catch(async (error) => {
            console.log('error')
            console.log(error)
        })
    }

    const getUser = async () => {
        await api({
            method: 'GET',
            url: '/api/v1/auth/me'
        }).then((res) => {
            console.log(res)
            const userObj = res.data
            setUser({
                ...user,
                userObj: userObj
            })
        }).catch(async (error) => {
            console.log('error')
            console.log(error)
        })
    }
    
    return {
        //STATES
        user,
        filter,
        status,
        initUser,
        
        // SET STATES
        setUser,
        setFilter,
        setStatus,

        // REQUESTS
        getUser,
        loginUser,
        createUser,
    }
}
export default UserAPIcalls;