import { useState } from 'react'
import { initCustomer } from '../states'
import { useRouter } from 'next/router'
import { Customer, CustomerObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
type UseGetCustomerOptions = Omit<
    UseQueryOptions<Customer, Error>,
    'queryKey' | 'queryFn'
>
const useCustomerAPI = () => {
    const router = useRouter()
    const queryCustomer = useQueryClient()
    const [filter, setFilter] = useState(initFilter)
    const [customer, setCustomer] = useState<Customer>(initCustomer)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const useGetCustomers = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string
    ) => {
        return useQuery({
            queryKey: [
                'customers',
                page,
                limit,
                search,
                (filter?.roleId ?? []).join(',')
            ],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/customers`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter)
                    }
                })

                return {
                    customers: res.data?.customers ?? [],
                    totalCustomers: res.data?.total ?? 0
                }
            },

            // ✅ keeps previous page while fetching new one
            placeholderData: (prev) => prev,
        })
    }

    const useGetCustomer = (
        id: number,
        options?: UseGetCustomerOptions
    ) => {
        return useQuery<Customer, Error>({
            queryKey: ['customer', id],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/customers/${id}`
                })
                return res.data.customer
            },
            ...options,
        })
    }
    
    const useCreateCustomer = useMutation({
        mutationFn: async (customer: CustomerObj) => {
            const res = await api.post(`/api/${apiVersion}/customers`, {
                tin: customer.tin,
                email: customer.email,
                last_name: customer.last_name,
                first_name: customer.first_name,
                trade_name: customer.trade_name,
                middle_name: customer.middle_name,
                first_address: customer.first_address,
                second_address: customer.second_address,
                classification: customer.classification,
                registered_name: customer.registered_name,
            })
            return res.data
        },
        onSuccess: () => {
            sessionStorage.setItem(
                'successMessage',
                'Your customer has been created.'
            )
            router.push('/bookkeeper/users/customers')
        },
        onError: (error: any) => {
            console.log(error)
        }
    })

    const useUpdateCustomer = useMutation({
        mutationFn: async (customer: CustomerObj) => {
            const res = await api.put(`/api/${apiVersion}/customers/${customer.id}`, {
                tin: customer.tin,
                email: customer.email,
                last_name: customer.last_name,
                first_name: customer.first_name,
                trade_name: customer.trade_name,
                middle_name: customer.middle_name,
                first_address: customer.first_address,
                second_address: customer.second_address,
                classification: customer.classification,
                registered_name: customer.registered_name,
            })
            return res.data
        },

        // ✅ Optimistic update
        onMutate: async (updatedCustomer) => {
            setStatus(prev => ({ ...prev, loader: true }));

            await queryCustomer.cancelQueries({ queryKey: ['customer', updatedCustomer.id] });

            const previousCustomer = queryCustomer.getQueryData(['customer', updatedCustomer.id]);

            queryCustomer.setQueryData(['customer', updatedCustomer.id], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    ...updatedCustomer,
                };
            });

            return { previousCustomer };
        },

        // ❌ rollback if error
        onError: (error: any, _vars) => {
            console.log(error);
            setStatus(prev => ({ ...prev, loader: false }));
        },

        // ✅ ensure sync with backend
        onSettled: (_data, _err, variables) => {
            queryCustomer.invalidateQueries({ queryKey: ['customer', variables.id] });
            setStatus(prev => ({ ...prev, loader: false }));
        },

        // ✅ success
        onSuccess: (res) => {
            const { customer } = res;

            sessionStorage.setItem(
                'successMessage',
                'Your customer has been updated.'
            );

            if (customer?.id) {
                router.push(`/bookkeeper/users/customers/${customer.id}`);
            }
        }
    });
    return {
        //STATES
        filter,
        status,
        customer,
        initCustomer,
        
        // SET STATES
        setCustomer,
        setFilter,
        setStatus,

        // QUERIES
        useGetCustomer,
        useGetCustomers,

        // MUTATION
        useCreateCustomer,
        useUpdateCustomer,

        //HANDLES
    }
}
export default useCustomerAPI;