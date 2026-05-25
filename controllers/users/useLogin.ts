import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import useMutationUsers from './api/mutations'
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
        initUser,

        setUser,
        setStatus,

        loginUserMutation,
        forgotPasswordMutation
    } = useMutationUsers()
    const router = useRouter()
    const [displayPassword, setDisplayPassword] = useState(false)
    const fieldValidations = {
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
    const handleForgotPassword = async (e: SyntheticEvent<HTMLFormElement>) => {
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
        forgotPasswordMutation.mutate(user.userObj, {
            onSuccess: () => {
                setTimeout(() => {
                    setStatus(prev => ({
                        ...prev,
                        loader: false,
                        message: 'Password Reset Email Sent!',
                        submessage:
                            "Check your email for instructions to reset your password. Follow the link provided to create a new one."
                    }));
                }, 500)
            },
        })
    }

    const handleUserLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3({
            ...fieldValidations,
            password: { usename: 'Password', required: true },
        }, user.userObj)
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
        loginUserMutation.mutate(user.userObj,{
            onSuccess: async (res) => {
                const { id, email, token_type, access_token, expires_in, refresh_token } = res.user
                await signIn('credentials', {
                    id: id,
                    email: email,
                    redirect: false,
                    refreshToken: refresh_token,
                    accessTokenExpires: Number(expires_in),
                    tokenType: token_type,
                    accessToken: access_token,
                });

                // optionally refetch user after login
                router.push('/bookkeeper/dashboard');
            },
            onError: (error) => {
                console.log(error)
                setUser(prev => ({
                    ...prev,
                    userErr: {
                        ...(prev.userErr || {}),
                        email: 'Invalid email or password',
                        password: 'Please contact TaxHelp Administrator'
                    }
                }));
                setStatus({...status, loader: false})
            }
        })
    }
      
    return {
        // STATES
        user,
        status,
        initUser,
        displayPassword,

        // SET STATES
        setUser,
        setStatus,
        setDisplayPassword,

        // HANDLES
        handleBlur,
        handleChange,
        handleResubmit,
        handleUserLogin,
        handleForgotPassword
    }
}

export default useLogin;