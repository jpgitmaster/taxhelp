import { AxiosError } from 'axios'
import api from '@/components/reusables/axios'
import getEditSessionId from '../editSession'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SalesManualCreatePayload, SalesManualDraftPayload, SalesManualRecord } from '../types'

export class LockConflictError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'LockConflictError'
    }
}

/** The draft has already been posted (or otherwise can't be edited as a draft anymore) — e.g. a stale ?draft= link, or finalized by another tab mid-edit. */
export class DraftNotEditableError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'DraftNotEditableError'
    }
}

const statusOf = (error: unknown) =>
    !!error && typeof error === 'object' && 'response' in error
        ? (error as AxiosError).response?.status
        : undefined

const toDraftError = (error: unknown, fallback: string): Error => {
    const status = statusOf(error)
    const message = (error as AxiosError<{ message: string }>)?.response?.data?.message || fallback
    if (status === 409) return new LockConflictError(message)
    if (status === 403) return new DraftNotEditableError(message)
    return error as Error
}

const useSalesManualAPI = () => {
    const queryClient = useQueryClient()
    const apiVersion = process.env?.NEXT_PUBLIC_API_VERSION
    const sessionHeaders = () => ({ 'X-Session-Id': getEditSessionId() })

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['salesManual'] })

    const useGetSalesManual = (
        page: number,
        limit: number,
        search: string,
        clientId: number | null,
    ) => {
        return useQuery({
            queryKey: ['salesManual', page, limit, search, clientId],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/sales-manual/records`,
                    params: {
                        page,
                        search,
                        page_size: limit,
                        client_id: clientId ?? null,
                    }
                })
                return {
                    sales: (res.data?.sales ?? []) as SalesManualRecord[],
                    totalSales: res.data?.total ?? 0
                }
            },
            placeholderData: (prev) => prev ?? { sales: [], totalSales: 0 },
            staleTime: 1000 * 30
        })
    }

    const useGetSalesManualById = (id: number | null) => {
        return useQuery({
            queryKey: ['salesManual', 'byId', id],
            queryFn: async () => {
                const res = await api({
                    method: 'GET',
                    url: `/api/${apiVersion}/sales-manual/records/${id}`,
                })
                return res.data?.data as SalesManualRecord
            },
            enabled: !!id,
            staleTime: 0,
        })
    }

    const useCreateSalesManual = useMutation<unknown, AxiosError, SalesManualCreatePayload>({
        mutationFn: async (data) => {
            const res = await api({
                method: 'POST',
                url: `/api/${apiVersion}/sales-manual/records`,
                data,
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    const useUpdateSalesManual = useMutation<unknown, AxiosError, { id: number } & Partial<SalesManualCreatePayload>>({
        mutationFn: async ({ id, ...data }) => {
            const res = await api({
                method: 'PUT',
                url: `/api/${apiVersion}/sales-manual/records/${id}`,
                data,
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    const useDeleteSalesManual = useMutation<unknown, AxiosError, number>({
        mutationFn: async (id) => {
            const res = await api.delete(`/api/${apiVersion}/sales-manual/records/${id}`, {
                data: { is_active: false }
            })
            return res.data
        },
        onSuccess: invalidate,
    })

    const useCreateDraft = useMutation<SalesManualRecord, AxiosError, { client_id: number }>({
        mutationFn: async (data) => {
            const res = await api({
                method: 'POST',
                url: `/api/${apiVersion}/sales-manual/drafts`,
                data,
                headers: sessionHeaders(),
            })
            return res.data?.data
        },
        onSuccess: invalidate,
    })

    const useAutosaveDraft = useMutation<SalesManualRecord, AxiosError, { id: number, data: SalesManualDraftPayload }>({
        mutationFn: async ({ id, data }) => {
            try {
                const res = await api({
                    method: 'PATCH',
                    url: `/api/${apiVersion}/sales-manual/drafts/${id}`,
                    data,
                    headers: sessionHeaders(),
                })
                return res.data?.data
            } catch (error) {
                throw toDraftError(error, 'Locked by another tab')
            }
        },
    })

    const useLockDraft = useMutation<SalesManualRecord, AxiosError, number>({
        mutationFn: async (id) => {
            try {
                const res = await api({
                    method: 'POST',
                    url: `/api/${apiVersion}/sales-manual/drafts/${id}/lock`,
                    headers: sessionHeaders(),
                })
                return res.data?.data
            } catch (error) {
                throw toDraftError(error, 'Locked by another tab')
            }
        },
    })

    const useUnlockDraft = useMutation<unknown, AxiosError, number>({
        mutationFn: async (id) => {
            const res = await api({
                method: 'DELETE',
                url: `/api/${apiVersion}/sales-manual/drafts/${id}/lock`,
                headers: sessionHeaders(),
            })
            return res.data
        },
    })

    const useFinalizeDraft = useMutation<SalesManualRecord, AxiosError, { id: number, data: SalesManualDraftPayload }>({
        mutationFn: async ({ id, data }) => {
            try {
                const res = await api({
                    method: 'POST',
                    url: `/api/${apiVersion}/sales-manual/drafts/${id}/finalize`,
                    data,
                    headers: sessionHeaders(),
                })
                return res.data?.data
            } catch (error) {
                throw toDraftError(error, 'Unable to finalize')
            }
        },
        onSuccess: invalidate,
    })

    return {
        useGetSalesManual,
        useGetSalesManualById,
        useCreateSalesManual,
        useUpdateSalesManual,
        useDeleteSalesManual,

        useCreateDraft,
        useAutosaveDraft,
        useLockDraft,
        useUnlockDraft,
        useFinalizeDraft,
    }
}

export default useSalesManualAPI
