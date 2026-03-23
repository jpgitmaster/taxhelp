import { useState } from 'react'
import { useRouter } from 'next/router'
import { User, UserObj } from '../types'
// import api from '@/components/lib/axios'
import { initUser } from '../states/initUsers'
import AuthAPIcalls from '@/controllers/users/api/auth'
import { Status, ErrorItem } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'

const UserAPIcalls = () => {
    const {
        authRefreshToken
    } = AuthAPIcalls()
    const router = useRouter()
    const [user, setUser] = useState<User>(initUser)
    const [filter, setFilter] = useState(initFilter)
    const [status, setStatus] = useState<Status>(initStatus)
    
    const getUser = async (id: number) => {
        // await api({
        //     method: 'GET',
        //     url: '/users/'+id
        // }).then((res) => {
        //     const userObj = res.data
        //     setUser({
        //         ...user,
        //         userObj: userObj
        //     })
        // }).catch(async (error) => {
        //     console.log('error')
        //     console.log(error)
        // })
    }
    const getUsers = async (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string
    ) => {
        // await api({
        //     method: 'GET',
        //     url: '/users',
        //     params: {
        //         page: page,
        //         limit: limit,
        //         search: search,
        //         sortBy: 'createdBy',
        //         sortOrder: 'ASC',
        //         filter: JSON.stringify(filter)
        //         // filter: JSON.stringify({ roleId: ['2'] })
        //     }
        // }).then((res) => {
        //     const { records, total } = res.data
        //     const timer = setTimeout(() => {
        //         if(records){
        //             setUser({
        //                 ...user,
        //                 userArr: records,
        //                 totalUsers: total
        //             })
        //         }
        //         setStatus(prev => ({
        //             ...prev,
        //             loader: false
        //         }))
        //         return false
        //     }, 500)
        //     return () => clearTimeout(timer)
            
        // }).catch(async (error) => {
        //     const { statusCode } = error.response?.data
        //     if(statusCode === 401){
        //         authRefreshToken()
        //     }
        //     return error
        // })
    }

    const createUser = async (user: UserObj) => {
        // await api({
        //     method: 'POST',
        //     url: '/users',
        //     data: {
        //         email: user.email,
        //         roleId: user.role.id,
        //         password: user.password,
        //         lastName: user.lastName,
        //         firstName: user.firstName
        //     }
        // }).then((res) => {
        //     const { message } = res.data
        //     console.log(res.data)
        //     if(message){
        //         sessionStorage.setItem('successMessage', message);
        //         router.push('/cms/users')
        //     }
        // }).catch(async (error) => {
        //     const message: ErrorItem[] | undefined = error?.response?.data?.message;
        //     if (Array.isArray(message)) {
        //         setUser((prevUser) => ({
        //             ...prevUser,
        //             userErr: Object.fromEntries(
        //                         message.map(({ field, message }) => [field, message])
        //                     )
        //         }));
        //     }
        // })
        // const timer = setTimeout(() => {
        //     setStatus(prev => ({
        //         ...prev,
        //         loader: false
        //     }))
        // }, 500)
        // return () => clearTimeout(timer)
    }

    const updateUser = async (user: UserObj) => {
        // await api({
        //     method: 'PATCH',
        //     url: '/users/'+user.id,
        //     data: {
        //         roleId: user.role.id,
        //         lastName: user.lastName,
        //         firstName: user.firstName,
        //     }
        // }).then((res) => {
        //     console.log(res.data)
        // }).catch(async (error) => {
        //     const message: ErrorItem[] | undefined = error?.response?.data?.message;
        //     if (Array.isArray(message)) {
        //         setUser((prevUser) => ({
        //             ...prevUser,
        //             userErr: Object.fromEntries(
        //                         message.map(({ field, message }) => [field, message])
        //                     )
        //         }));
        //     }
        // })
        // const timer = setTimeout(() => {
        //     setStatus({...status, loader: false})
        //     return false
        // }, 500)
        // return () => clearTimeout(timer)
    }
    return {
        //STATES
        user,
        filter,
        status,
        
        // SET STATES
        setUser,
        setFilter,
        setStatus,

        // REQUESTS
        getUser,
        getUsers,
        createUser,
        updateUser,
    }
}
export default UserAPIcalls;