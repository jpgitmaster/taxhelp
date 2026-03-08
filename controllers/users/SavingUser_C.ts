import UserAPIcalls from './api'
import RoleAPIcalls from '../roles/api'
import { useRouter } from 'next/router'
import GlobalController from '@/controllers/global/Global_C'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'
const SavingUser_C = () => {
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

        getUser,
        createUser,
        updateUser,
    } = UserAPIcalls()
    const {
        role,
        filter:roleFilter,
        getRoles
    } = RoleAPIcalls()
    const router = useRouter()
    const { userID } = router.query
    const [displayPassword, setDisplayPassword] = useState(false)
    const [passwordChecker, setPasswordChecker] = useState(false)
    const fieldCreateValidation = {
        role: { usename: 'Role', required: true },
        password: { usename: 'Password', required: true, regex: {
            message: 'Invalid Password Pattern',
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])(?=.{6,}).*$/
        }},
        lastName: { usename: 'Last Name', required: true },
        firstName: { usename: 'First Name', required: true },
        email: { usename: 'Email', required: true, email: true },
        confirmPassword: { usename: 'Confirm Password', required: true, confirm: user.userObj.password },
    }
    const fieldUpdateValidation = {
        role: { usename: 'Role', required: true },
        lastName: { usename: 'Last Name', required: true },
        firstName: { usename: 'First Name', required: true },
        email: { usename: 'Email', required: true, email: true },
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setUser({
            ...user,
            userObj: {
                ...user.userObj,
                [name]: value
            }
        })
        handleRemoveErr(user.userErr, name)
    }


    const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const newUser = {
            ...user.userObj,
            role: user.userObj.role.name ? 'role' : ''
        }
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldCreateValidation, newUser)
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
        createUser(user.userObj)
    }

    const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true})
        const newUser = {
            ...user.userObj,
            role: user.userObj.role.name ? 'role' : ''
        }
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldUpdateValidation, newUser)
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
        updateUser(user.userObj)
    }

    useEffect(() => {
        getRoles(
            roleFilter.currentPage,
            roleFilter.recordsLimit,
            roleFilter.search
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        if(userID){
            getUser(Number(userID))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userID])

    return {
        // STATES
        role,
        user,
        status,
        passwordChecker,
        displayPassword,

        // SET STATES
        setUser,
        setDisplayPassword,
        setPasswordChecker,
        
        // HANDLES
        handleBlur,
        handleChange,
        handleResubmit,
        handleRemoveErr,
        handleCreateUser,
        handleUpdateUser,
        
    }
}

export default SavingUser_C;