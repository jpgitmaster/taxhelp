import UserAPIcalls from './api'
import GlobalController from '@/controllers/global/Global_C'
import { useState, ChangeEvent, SyntheticEvent } from 'react'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'
const Register_C = () => {
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
    const [checkedRoles, setCheckedRoles] = useState<string[]>([]);
    const fieldValidations = {
        password: { usename: 'Password', required: true },
        email: { usename: 'Email', required: true, email: true },
        confirmPassword: { usename: 'Confirm Password', required: true, confirm: user.userObj.password },
    }
    const roles = [
        {
            value: 'business_owner',
            label: 'Business Owner',
            icon: 'business_owner.svg',
            description: 'Manage your business taxes and track your filings.'
        },
        {
            value: 'bookkeeper',
            label: 'Bookkeeper',
            icon: 'bookkeeper.svg',
            description: 'Manage financial records and prepare tax-ready reports.'
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
    const handleCheckedRoles = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setCheckedRoles(prev => {
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
    }
    return {
        // STATES
        user,
        roles,
        status,
        checkedRoles,

        // SET STATES

        // HANDLES
        handleBlur,
        handleChange,
        handleResubmit,
        handleRegisterUser,
        handleCheckedRoles
    }
}

export default Register_C;