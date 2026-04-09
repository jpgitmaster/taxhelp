import dayjs from 'dayjs'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { User, UserObj } from '../types'
import api from '@/components/reusables/axios'
import { initUser } from '../states/initUsers'
import { Status } from '@/controllers/global/types'
import { getSession, signIn, signOut } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { initStatus, initFilter } from '@/controllers/global/states'

const useUserAPI = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [user, setUser] = useState<User>(initUser)
    const [filter, setFilter] = useState(initFilter)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    // ✅ CREATE USER (useMutation)
    const createUserMutation = useMutation({
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
        onSuccess: (_, variables, context) => {
            console.log(context)
            console.log(variables)
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
        onError: (error: any) => {
            console.log(error)

            const message = error?.response?.data?.message
            if (Array.isArray(message)) {
                setUser((prevUser) => ({
                    ...prevUser,
                    userErr: Object.fromEntries(
                        message.map(({ field, message }: any) => [field, message])
                    )
                }))
            }
        }
    })

    // ✅ LOGIN USER (useMutation)
    const loginUserMutation = useMutation({
        mutationFn: async (user: UserObj) => {
            const res = await api.post(`/api/${apiVersion}/auth/login`, {
                email: user.email,
                password: user.password
            })
            return res.data
        },
        onSuccess: async (res) => {
            const { id, email, token_type, access_token, expires_in, refresh_token } = res.data
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
            await queryClient.refetchQueries({ queryKey: ['user'] });
            router.push('/bookkeeper/dashboard');
        },
        onError: (error) => {
            console.log('error', error)
        }
    })

    // ✅ EDIT PROFILE (useMutation)
    const editProfileMutation = useMutation({
        mutationFn: async (user: UserObj) => {
            const res = await api.put(`/api/${apiVersion}/users/${user.id}`, {
                email: user.email,
                birthday: dayjs(user.birthdate).format('YYYY-MM-DD'),
                last_name: user.lastName,
                first_name: user.firstName,
            })
            return res.data
        },
        onSuccess: async (res) => {
            setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    loader: false,
                    message: 'Your profile changes have been saved successfully.'
                }))
            }, 500)
        },
        onError: (error) => {
            console.log('error', error)
        }
    })

    // VERIFY USER THROUGH EMAIL NOTIF
    const verifyUserMutation = useMutation({
        mutationFn: async (token: string) => {
            const res = await api.post(`/api/${apiVersion}/auth/verify-email`, { token });
            return res.data;
        },

        onSuccess: async (res) => {
            const { id, email, token_type, access_token, expires_in, refresh_token } = res;

            try {
            // Step 1: Sign in via NextAuth credentials provider
            const result = await signIn('credentials', {
                id,
                email,
                tokenType: token_type,
                accessToken: access_token,
                refreshToken: refresh_token,
                accessTokenExpires: Number(expires_in),
                redirect: false,
            });

            if (!result?.ok) {
                console.error('Sign-in failed', result);
                return;
            }

            // Step 2: Wait for session to be available
            await getSession(); // ensures session is synced

            // Step 3: Redirect AFTER session is ready
            router.replace('/bookkeeper/profile');
            } catch (err) {
            console.error('Email verification flow error:', err);
            }
        },

        onError: (error) => {
            console.error('Verification API error:', error);
            router.replace('/'); // fallback
        },
    });

    const handleUserLogout = async () => {
        queryClient.removeQueries({ queryKey: ['user'] });
        return await signOut({redirect: true, callbackUrl: '/'});
    }
    
    const useGetUser = async () => {
        try {
            const res = await api({
                method: 'GET',
                url: `/api/${apiVersion}/auth/me`
            });
            const { data } = res.data
            return data ?? null
        } catch (error) {
            console.log('error')
            console.log(error)
            // IMPORTANT: rethrow so React Query can handle it
            throw error;
        }
    };
    
    return {
        //STATES
        user,
        filter,
        status,
        initUser,
        
        // SET STATES
        setUser,
        setFilter,
        setStatus,

        // QUERIES
        useGetUser,

        // MUTATION
        loginUserMutation,
        createUserMutation,
        verifyUserMutation,
        editProfileMutation,

        //HANDLES
        handleUserLogout
    }
}
export default useUserAPI;