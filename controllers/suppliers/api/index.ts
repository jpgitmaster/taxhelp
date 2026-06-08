import { useState } from 'react'
import { initSupplier } from '../states'
import { useRouter } from 'next/router'
import { Supplier, SupplierObj } from '../types'
import api from '@/components/reusables/axios'
import { Status } from '@/controllers/global/types'
import { initStatus, initFilter } from '@/controllers/global/states'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
type UseGetSupplierOptions = Omit<
    UseQueryOptions<Supplier, Error>,
    'queryKey' | 'queryFn'
>
const useSupplierAPI = () => {
    const router = useRouter()
    const querySupplier = useQueryClient()
    const [filter, setFilter] = useState(initFilter)
    const [supplier, setSupplier] = useState<Supplier>(initSupplier)
    const [status, setStatus] = useState<Status>(initStatus)
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION

    const useGetSuppliers = (
        page: number,
        limit: number,
        filter: { roleId: string[] | number[] },
        search: string
    ) => {
        return useQuery({
            queryKey: [
                'suppliers',
                page,
                limit,
                search,
                (filter?.roleId ?? []).join(',')
            ],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/suppliers`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        sortOrder: 'ASC',
                        filter: JSON.stringify(filter)
                    }
                })

                return {
                    suppliers: res.data?.suppliers ?? [],
                    totalSuppliers: res.data?.total ?? 0
                }
            },

            // ✅ keeps previous page while fetching new one
            placeholderData: (prev) => prev,
        })
    }

    const useGetSupplier = (
        id: number,
        options?: UseGetSupplierOptions
    ) => {
        return useQuery<Supplier, Error>({
            queryKey: ['supplier', id],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/suppliers/${id}`
                })
                return res.data.supplier
            },
            ...options,
        })
    }
    
    const useCreateSupplier = useMutation({
        mutationFn: async (supplier: SupplierObj) => {
            const res = await api.post(`/api/${apiVersion}/suppliers`, {
                tin: supplier.tin,
                email: supplier.email,
                last_name: supplier.last_name,
                first_name: supplier.first_name,
                trade_name: supplier.trade_name,
                middle_name: supplier.middle_name,
                first_address: supplier.first_address,
                second_address: supplier.second_address,
                classification: supplier.classification,
                registered_name: supplier.registered_name,
            })
            return res.data
        },
        onSuccess: () => {
            sessionStorage.setItem(
                'successMessage',
                'Your supplier has been created.'
            )
            router.push('/bookkeeper/users/suppliers')
        },
        onError: (error: any) => {
            console.log(error)
        }
    })

    const useUpdateSupplier = useMutation({
        mutationFn: async (supplier: SupplierObj) => {
            const res = await api.put(`/api/${apiVersion}/suppliers/${supplier.id}`, {
                tin: supplier.tin,
                email: supplier.email,
                last_name: supplier.last_name,
                first_name: supplier.first_name,
                trade_name: supplier.trade_name,
                middle_name: supplier.middle_name,
                first_address: supplier.first_address,
                second_address: supplier.second_address,
                classification: supplier.classification,
                registered_name: supplier.registered_name,
            })
            return res.data
        },

        // ✅ Optimistic update
        onMutate: async (updatedSupplier) => {
            setStatus(prev => ({ ...prev, loader: true }));

            await querySupplier.cancelQueries({ queryKey: ['supplier', updatedSupplier.id] });

            const previousSupplier = querySupplier.getQueryData(['supplier', updatedSupplier.id]);

            querySupplier.setQueryData(['supplier', updatedSupplier.id], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    ...updatedSupplier,
                };
            });

            return { previousSupplier };
        },

        // ❌ rollback if error
        onError: (error: any, _vars) => {
            console.log(error);
            setStatus(prev => ({ ...prev, loader: false }));
        },

        // ✅ ensure sync with backend
        onSettled: (_data, _err, variables) => {
            querySupplier.invalidateQueries({ queryKey: ['supplier', variables.id] });
            setStatus(prev => ({ ...prev, loader: false }));
        },

        // ✅ success
        onSuccess: (res) => {
            const { supplier } = res;

            sessionStorage.setItem(
                'successMessage',
                'Your supplier has been updated.'
            );

            if (supplier?.id) {
                router.push(`/bookkeeper/users/suppliers/${supplier.id}`);
            }
        }
    });
    return {
        //STATES
        filter,
        status,
        supplier,
        initSupplier,
        
        // SET STATES
        setSupplier,
        setFilter,
        setStatus,

        // QUERIES
        useGetSupplier,
        useGetSuppliers,

        // MUTATION
        useCreateSupplier,
        useUpdateSupplier,

        //HANDLES
    }
}
export default useSupplierAPI;