import { useRouter } from 'next/router'
import useMutationUsers from './api/mutations'
import useGlobal from '@/controllers/global/useGlobal'
import { useState, ChangeEvent, SyntheticEvent } from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'

const useResetPassword = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    const {
        user,
        status,
        initUser,

        setUser,
        setStatus,

        changePasswordMutation
    } = useMutationUsers()
    const router = useRouter()
    const { token } = router.query
    const [passwordChecker, setPasswordChecker] = useState(false)
    const [displayPassword, setDisplayPassword] = useState(false)
    const fieldValidations = {
        newPassword: { usename: 'New Password', required: true, regex: {
            message: '8 chars with uppercase, lowercase, numbers & symbols',
            pattern: /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])(?=.{8,}).*$/
        }},
        confirmNewPassword: { usename: 'Confirm New Password', required: true, confirm: user.userObj.newPassword },
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
    
    const handleResetPassword = async (e: SyntheticEvent<HTMLFormElement>) => {
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
        
        changePasswordMutation.mutate({
            user: user.userObj,
            token: String(token)
        }, {
            onSuccess: () => {
                setTimeout(() => {
                    setStatus(prev => ({
                        ...prev,
                        loader: false,
                        message: 'Account Created Successfully!',
                        submessage:
                            "Check your email to activate your account and get started. Once verified, you're ready to explore."
                    }))
                }, 500)
            },
            onError: (err) => {
                const backendErrors = err?.response?.data?.errors
                console.log('backendErrors', backendErrors)

                setStatus(prev => ({
                    ...prev,
                    loader: false
                }))
            }
        })
    }
      
    return {
        // STATES
        user,
        status,
        initUser,
        passwordChecker,
        displayPassword,

        // SET STATES
        setUser,
        setStatus,
        setPasswordChecker,
        setDisplayPassword,

        // HANDLES
        handleBlur,
        handleChange,
        handleResubmit,
        handleResetPassword
    }
}

export default useResetPassword;