import useMutationUsers from './api/mutations'
import useGlobal from '@/controllers/global/useGlobal'
import { useState, ChangeEvent, SyntheticEvent } from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'

const useRegister = () => {
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

        createUserMutation
    } = useMutationUsers()
    const [displayPassword, setDisplayPassword] = useState(false)
    const [passwordChecker, setPasswordChecker] = useState(false)
    const [checkedFeatures, setCheckedFeatures] = useState<string[]>([]);
    const fieldValidations = {
        password: { usename: 'Password', required: true, regex: {
            message: '8 chars with uppercase, lowercase, numbers & symbols',
            pattern: /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])(?=.{8,}).*$/
        }},
        email: { usename: 'Email', required: true, email: true },
        confirmPassword: { usename: 'Confirm Password', required: true, confirm: user.userObj.password },
    }
    const features = [
        {
            disabled: false,
            value: 'dat',
            label: 'DAT File',
            icon: 'dat_file.svg',
            description: 'Manage tax filing data and related records.'
        },
        {
            disabled: false,
            value: 'journal',
            label: 'Books of Accounts',
            icon: 'books_of_accounts.svg',
            description: 'Maintain financial records and accounting books.'
        },
    ];
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
    const handleCheckedFeatures = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setCheckedFeatures(prev => {
            if (checked) {
                // ✅ add to array
                return [...prev, value];
            } else {
                // ✅ remove from array
                return prev.filter(role => role !== value);
            }
        });
        setUser({
            ...user,
            userErr: {
                role: '',
                email: '',
                lastName: '',
                password: '',
                firstName: '',
                confirmPassword: '',
            },
        })
    };

    const handleRegisterUser = async (e: SyntheticEvent<HTMLFormElement>) => {
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

        // REGISTER
        createUserMutation.mutate({
            user: user.userObj,
            checkedFeatures: checkedFeatures
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

                setUser(prev => ({
                    ...prev,
                    userErr: {
                        email: backendErrors?.email || '',
                        password: backendErrors?.password || '',
                        confirmPassword: backendErrors?.confirm_password || '',
                    }
                }))

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
        features,
        checkedFeatures,
        displayPassword,
        passwordChecker,

        // SET STATES
        setUser,
        setStatus,
        setCheckedFeatures,
        setDisplayPassword,
        setPasswordChecker,

        // HANDLES
        handleBlur,
        handleChange,
        handleResubmit,
        handleRegisterUser,
        handleCheckedFeatures
    }
}

export default useRegister;