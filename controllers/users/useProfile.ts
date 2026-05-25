import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
import useQueryUsers from './api/queries';
import useMutationUsers from './api/mutations';
import { useQuery } from '@tanstack/react-query';
import useGlobal from '@/controllers/global/useGlobal';
import { ChangeEvent, SyntheticEvent, useEffect } from 'react';
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3';

const useProfile = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr
    } = useGlobal()
    const {
        getUser
    } = useQueryUsers()
    const {
        user,
        status,
        initUser,

        setUser,
        setStatus,

        editProfileMutation,
    } = useMutationUsers()
    const router = useRouter()
    const fieldValidations = {
        lastName: { usename: 'Last Name', required: true },
        firstName: { usename: 'First Name', required: true },
    }
    const { data: fetchUser } = getUser()
    
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
    
    const handleDate = (date: Dayjs | null, name: string) => {
        if (!date || !date.isValid()) {
            // CLEAR properly
            setUser({
            ...user,
            userObj: {
                ...user.userObj,
                [name]: null
            }
            });

            handleRemoveErr(user.userErr, name);
            return;
        }

        const formatted = date.format('MM/DD/YYYY');

        setUser({
            ...user,
            userObj: {
            ...user.userObj,
            [name]: formatted
            }
        });

        handleRemoveErr(user.userErr, name);
    };

    const handleEditProfile = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus({...status, loader: true, message: ''})
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

        editProfileMutation.mutate(user.userObj, {
            onSuccess: () => {
                sessionStorage.setItem(
                    'successMessage',
                    'Your profile has been updated.'
                );

                router.push(`/bookkeeper/profile`);
            }
        })
    }

    useEffect(() => {
        if (fetchUser) {
            setUser(prev => ({
                ...prev,
                userObj: {
                    ...prev.userObj,
                    id: fetchUser.id,
                    email: fetchUser.email,
                    lastName: fetchUser.last_name || '',
                    firstName: fetchUser.first_name || '',
                    middleName: fetchUser.middle_name || '',
                    birthdate: fetchUser.birthday
                        ? dayjs(fetchUser.birthday).format('MM/DD/YYYY')
                        : ''
                }
            }))
        }
    }, [fetchUser])

    useEffect(() => {
        const successMessage = sessionStorage.getItem('successMessage');
        if (successMessage) {
            setStatus(prev => ({
                ...prev,
                message: successMessage
            }))

            setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    message: ''
                }))
                sessionStorage.removeItem('successMessage')
            }, 5000)
        }
    },[])
    return {
        // STATES
        user,
        status,
        initUser,

        // SET STATES
        setUser,
        setStatus,

        // HANDLES
        handleDate,
        handleBlur,
        handleChange,
        handleResubmit,
        handleEditProfile
    }
}

export default useProfile;