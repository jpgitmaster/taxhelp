const STORAGE_KEY = 'salesManualEditSessionId'

const getEditSessionId = (): string => {
    if (typeof window === 'undefined') return ''

    const existing = window.sessionStorage.getItem(STORAGE_KEY)
    if (existing) return existing

    const generated =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`

    window.sessionStorage.setItem(STORAGE_KEY, generated)
    return generated
}

export default getEditSessionId
