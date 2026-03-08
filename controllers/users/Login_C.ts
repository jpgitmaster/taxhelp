import { signIn } from 'next-auth/react'
import AuthAPIcalls from '@/controllers/users/api/auth'
import GlobalController from '@/controllers/global/Global_C'
import { useState, ChangeEvent, SyntheticEvent } from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'

const Login_C = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = GlobalController()
    const {
        // STATES
        err,
        status,
        
        // SET STATES
        setErr,
        setStatus,

        // REQUESTS
        authLogin
    } = AuthAPIcalls()
    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const fieldValidations = {
        password: { usename: 'Password', required: true },
        email: { usename: 'Email', required: true, email: true },
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
        handleRemoveErr(err, name)
    }
      
    const handleCredentialLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, user)
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setErr(validation_errors)
                setStatus({...status, loader: false})
                return false
            }, 500)
            return () => clearTimeout(timer)
        }
        authLogin(user.email, user.password)
    }
      
    return {
        // STATES
        err,
        user,
        status,

        // SET STATES

        // HANDLES
        handleBlur,
        handleChange,
        handleResubmit,
        handleCredentialLogin,
    }
}

export default Login_C;