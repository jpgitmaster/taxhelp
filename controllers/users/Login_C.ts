
import UserAPIcalls from './api'
import { ChangeEvent, SyntheticEvent } from 'react'
import GlobalController from '@/controllers/global/Global_C'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'

const Login_C = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = GlobalController()
    const {
        user,
        status,

        setUser,
        setStatus,

    } = UserAPIcalls()

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
    }
      
    return {
        // STATES
        user,
        status,

        // SET STATES

        // HANDLES
        handleBlur,
        handleChange,
        handleResubmit,
        handleUserLogin,
    }
}

export default Login_C;