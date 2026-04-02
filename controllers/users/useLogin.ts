
import UserAPIcalls from './api'
import useGlobal from '@/controllers/global/useGlobal'
import { useState, ChangeEvent, SyntheticEvent } from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'

const useLogin = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    const {
        user,
        status,

        setUser,
        setStatus,

        loginUserMutation,
    } = UserAPIcalls()
    const [displayPassword, setDisplayPassword] = useState(false)
    const fieldValidations = {
        password: { usename: 'Password', required: true },
        email: { usename: 'Email', required: true, email: true },
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser({
            ...user,
            userObj: {
                ...user.userObj,
                [name]: value
            }
        })
        handleRemoveErr(user.userErr, name)
    }
    
    const handleUserLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, user.userObj)
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setUser({
                    ...user,
                    userErr: validation_errors
                })
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }

        // LOGIN
        loginUserMutation.mutate(user.userObj)
    }
      
    return {
        // STATES
        user,
        status,
        displayPassword,

        // SET STATES
        setDisplayPassword,

        // HANDLES
        handleBlur,
        handleChange,
        handleResubmit,
        handleUserLogin,
    }
}

export default useLogin;