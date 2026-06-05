import dayjs from 'dayjs'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { User, UserObj } from '../types'
import { signOut } from 'next-auth/react'
import api from '@/components/reusables/axios'
import { initUser } from '../states/initUsers'
import { Status } from '@/controllers/global/types'
import { initStatus } from '@/controllers/global/states'
import { useMutation, useQueryClient } from '@tanstack/react-query'
type RegisterErrorResponse = {
    success: boolean
    message: string
    errors: {
        email?: string
        password?: string
        confirm_password?: string
    }
}

type RegisterPayload = {
    user: UserObj
    checkedRoles: string[]
}
const useMutationUsers = () => {
    const queryClient = useQueryClient()
    const [user, setUser] = useState<User>(initUser)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const [status, setStatus] = useState<Status>(initStatus)
    
    // ✅ CREATE USER (useMutation)
    const createUserMutation = useMutation<
        unknown,
        AxiosError<RegisterErrorResponse>,
        RegisterPayload
    >({
        mutationFn: async ({
            user,
            checkedRoles
        }: {
            user: UserObj
            checkedRoles: string[]
        }) => {
            const res = await api.post(`/api/${apiVersion}/auth/register`, {
                email: user.email,
                roles: checkedRoles,
                password: user.password,
                confirm_password: user.confirmPassword,
            })
            return res.data
        },
        onError: (error) => {
            console.log(error)
        }
    })
    const userLogout = async () => {
        queryClient.removeQueries({ queryKey: ['user'] });
        return await signOut({redirect: true, callbackUrl: '/'});
    }

    const forgotPasswordMutation = useMutation({
        mutationFn: async (user: UserObj) => {
            const res = await api.post(`/api/${apiVersion}/auth/forgot-password`, {
                email: user.email
            })
            return res.data
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const loginUserMutation = useMutation({
        mutationFn: async (user: UserObj) => {
            const res = await api.post(`/api/${apiVersion}/auth/login`, {
                email: user.email?.trim(),
                password: user.password?.trim()
            })
            return res.data
        },
        onSuccess: async () => {
            // optionally refetch user after login
            await queryClient.refetchQueries({ queryKey: ['user'] });
        },
    })

    const verifyUserMutation = useMutation({
        mutationFn: async (token: string) => {
            const res = await api.post(`/api/${apiVersion}/auth/verify-email`, { token });
            return res.data;
        },
    });

    // ✅ EDIT PROFILE (useMutation)
    const editProfileMutation = useMutation({
        mutationFn: async (user: UserObj) => {
            const res = await api.put(`/api/${apiVersion}/users/${user.id}`, {
                email: user.email,
                birthday: dayjs(user.birthdate).format('YYYY-MM-DD'),
                last_name: user.lastName,
                first_name: user.firstName,
                middle_name: user.middleName,
            })
            return res.data
        },
        onSuccess: (data) => {
            queryClient.setQueryData(
                ['user'],
                data.user
            )
        }
    });
    return {
        //STATES
        user,
        status,
        initUser,

        // SET STATES
        setUser,
        setStatus,

        // HANDLES
        userLogout,

        // MUTATIONS
        loginUserMutation,
        createUserMutation,
        verifyUserMutation,
        editProfileMutation,
        forgotPasswordMutation,
    }
}
export default useMutationUsers;